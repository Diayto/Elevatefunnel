import { NextResponse } from "next/server";

export const maxDuration = 120;
const WEBHOOK_TIMEOUT_MS = 15_000;
const MAX_BODY_BYTES = 8192;

const MAX_LEN = {
  name: 200,
  country: 120,
  specialty: 200,
  contact: 120,
  course: 80,
  age: 20,
  status: 40,
  videos_watched: 16,
  watch_log: 2000,
};

function isBlockedHostname(hostname: string): boolean {
  const h = hostname.toLowerCase();
  if (!h || h === "localhost") return true;
  if (h.endsWith(".local")) return true;
  if (h.endsWith(".internal")) return true;
  if (h === "metadata.google.internal") return true;

  const ipv4 = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
  const m = h.match(ipv4);
  if (m) {
    const a = Number(m[1]);
    const b = Number(m[2]);
    if (a === 10) return true;
    if (a === 127) return true;
    if (a === 0) return true;
    if (a === 192 && b === 168) return true;
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 169 && b === 254) return true;
    if (a === 100 && b >= 64 && b <= 127) return true;
  }
  if (h === "::1" || h === "[::1]") return true;
  return false;
}

function isGoogleAppsScriptWebhookHost(hostname: string): boolean {
  const h = hostname.toLowerCase();
  return h === "script.google.com" || h === "script.googleusercontent.com";
}

function isAllowedWebhookUrl(raw: string): boolean {
  try {
    const u = new URL(raw.trim());
    if (u.protocol !== "https:") return false;
    if (!u.hostname) return false;
    if (isBlockedHostname(u.hostname)) return false;
    if (!isGoogleAppsScriptWebhookHost(u.hostname)) return false;
    return true;
  } catch {
    return false;
  }
}

type LeadPayload = {
  name: string;
  age: string;
  country: string;
  status: string;
  course: string | null;
  specialty: string;
  contact: string;
  videos_watched: string;
  watch_log: string;
  submittedAt: string;
  source: "elevate-funnel";
};

async function postWebhook(payload: LeadPayload): Promise<boolean> {
  const url = process.env.GOOGLE_SHEETS_WEBHOOK_URL?.trim();
  if (!url || !isAllowedWebhookUrl(url)) {
    if (process.env.NODE_ENV === "development") {
      console.error("[api/submit-lead] GOOGLE_SHEETS_WEBHOOK_URL missing or not allowed");
    }
    return false;
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  const secret = process.env.GOOGLE_SHEETS_WEBHOOK_SECRET?.trim();
  if (secret) {
    headers.Authorization = `Bearer ${secret}`;
  }

  const body = secret ? { ...payload, _webhookVerify: secret } : payload;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(WEBHOOK_TIMEOUT_MS),
    });
    const text = await res.text().catch(() => "");
    if (!res.ok) {
      console.error("[api/submit-lead] webhook HTTP error", res.status);
      return false;
    }
    try {
      const parsed = JSON.parse(text) as { ok?: unknown };
      if (parsed && typeof parsed === "object" && parsed.ok === true) {
        return true;
      }
    } catch {
      /* non-JSON */
    }
    console.error("[api/submit-lead] webhook returned 200 but not ok:true");
    return false;
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.error("[api/submit-lead] webhook fetch error", err);
    }
    return false;
  }
}

export async function GET() {
  return NextResponse.json(
    { ok: false, error: "method_not_allowed" },
    { status: 405, headers: { Allow: "POST, OPTIONS" } },
  );
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: { Allow: "POST, OPTIONS" },
  });
}

export async function POST(req: Request) {
  const isProd = process.env.NODE_ENV === "production";
  const webhookUrlRaw = process.env.GOOGLE_SHEETS_WEBHOOK_URL?.trim();
  const hasWebhook = Boolean(webhookUrlRaw);

  if (isProd && !hasWebhook) {
    return NextResponse.json({ ok: false, error: "not_configured" }, { status: 503 });
  }

  if (isProd && webhookUrlRaw && !isAllowedWebhookUrl(webhookUrlRaw)) {
    return NextResponse.json({ ok: false, error: "not_configured" }, { status: 503 });
  }

  const ct = req.headers.get("content-type") ?? "";
  if (!ct.toLowerCase().includes("application/json")) {
    return NextResponse.json({ ok: false, error: "unsupported_media_type" }, { status: 415 });
  }

  let body: unknown;
  try {
    const raw = await req.text();
    const byteLen = new TextEncoder().encode(raw).length;
    if (byteLen > MAX_BODY_BYTES) {
      return NextResponse.json({ ok: false, error: "payload_too_large" }, { status: 413 });
    }
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }

  const record = body as Record<string, unknown>;
  const {
    name,
    age,
    country,
    status,
    course,
    specialty,
    contact,
    website,
    videos_watched,
    watch_log,
  } = record;

  if (typeof website === "string" && website.trim().length > 0) {
    return NextResponse.json({ ok: true });
  }

  const n = typeof name === "string" ? name.trim() : "";
  const a = typeof age === "string" ? age.trim() : "";
  const ctry = typeof country === "string" ? country.trim() : "";
  const st = typeof status === "string" ? status.trim() : "";
  const spec = typeof specialty === "string" ? specialty.trim() : "";
  const cont = typeof contact === "string" ? contact.trim() : "";
  const crs = typeof course === "string" ? course.trim().slice(0, MAX_LEN.course) : "";
  const vw =
    typeof videos_watched === "string"
      ? videos_watched.trim().slice(0, MAX_LEN.videos_watched)
      : "";
  const wl =
    typeof watch_log === "string" ? watch_log.trim().slice(0, MAX_LEN.watch_log) : "";

  if (!n || n.length > MAX_LEN.name) {
    return NextResponse.json({ ok: false, error: "invalid_name" }, { status: 400 });
  }
  if (!a || a.length > MAX_LEN.age) {
    return NextResponse.json({ ok: false, error: "invalid_age" }, { status: 400 });
  }
  if (!ctry || ctry.length > MAX_LEN.country) {
    return NextResponse.json({ ok: false, error: "invalid_country" }, { status: 400 });
  }
  if (!st || st.length > MAX_LEN.status) {
    return NextResponse.json({ ok: false, error: "invalid_status" }, { status: 400 });
  }
  if (!spec || spec.length > MAX_LEN.specialty) {
    return NextResponse.json({ ok: false, error: "invalid_specialty" }, { status: 400 });
  }
  if (!cont || cont.length < 3 || cont.length > MAX_LEN.contact) {
    return NextResponse.json({ ok: false, error: "invalid_contact" }, { status: 400 });
  }

  const needsCourse = st === "studying" || st === "studying_working";
  if (needsCourse && !crs) {
    return NextResponse.json({ ok: false, error: "invalid_course" }, { status: 400 });
  }

  const payload: LeadPayload = {
    name: n,
    age: a,
    country: ctry,
    status: st,
    course: needsCourse ? crs : null,
    specialty: spec,
    contact: cont,
    videos_watched: vw || "0/7",
    watch_log: wl || "{}",
    submittedAt: new Date().toISOString(),
    source: "elevate-funnel",
  };

  if (!isProd && !hasWebhook) {
    console.log("[api/submit-lead] dev mode — lead accepted (no webhook configured)");
    return NextResponse.json({ ok: true });
  }

  const delivered = await postWebhook(payload);
  if (!delivered) {
    return NextResponse.json({ ok: false, error: "delivery_failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
