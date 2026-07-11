import { NextResponse } from "next/server";
import { toSheetsRow, type LeadSubmissionInput } from "@/lib/funnel/leadFormLabels";
import { enforceLeadRateLimit, getClientIp } from "@/lib/leadRateLimit";

export const maxDuration = 120;
const WEBHOOK_TIMEOUT_MS = 15_000;
const MAX_BODY_BYTES = 24_576;

const MAX_LEN = {
  name: 200,
  age: 40,
  country: 120,
  specialty: 200,
  contact: 120,
  course: 80,
  status: 40,
  interest_reason: 2000,
  internship_understanding: 2000,
  career_importance: 2000,
  experience: 2000,
  english_level: 40,
  english_certificate: 40,
  internship_field: 200,
  target_countries: 300,
  start_timing: 40,
  financial_situation: 80,
  financial_decision: 80,
  career_blockers: 2000,
  consultation_goals: 500,
  additional_notes: 2000,
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

async function postWebhook(payload: ReturnType<typeof toSheetsRow>): Promise<boolean> {
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

function clip(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
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

  const clientIp = getClientIp(req);
  const rate = enforceLeadRateLimit(clientIp);
  if (!rate.allowed) {
    return NextResponse.json(
      { ok: false, error: "rate_limited" },
      {
        status: 429,
        headers: { "Retry-After": String(rate.retryAfter) },
      },
    );
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
  const { website } = record;

  if (typeof website === "string" && website.trim().length > 0) {
    return NextResponse.json({ ok: true });
  }

  const n = clip(record.name, MAX_LEN.name);
  const a = clip(record.age, MAX_LEN.age);
  const ctry = clip(record.country, MAX_LEN.country);
  const st = clip(record.status, MAX_LEN.status);
  const spec = clip(record.specialty, MAX_LEN.specialty);
  const cont = clip(record.contact, MAX_LEN.contact);
  const crs = clip(record.course, MAX_LEN.course);
  const vw = clip(record.videos_watched, MAX_LEN.videos_watched) || "0/7";
  const wl = clip(record.watch_log, MAX_LEN.watch_log) || "{}";

  const interestReason = clip(record.interest_reason, MAX_LEN.interest_reason);
  const internshipUnderstanding = clip(
    record.internship_understanding,
    MAX_LEN.internship_understanding,
  );
  const careerImportance = clip(record.career_importance, MAX_LEN.career_importance);
  const experience = clip(record.experience, MAX_LEN.experience);
  const englishLevel = clip(record.english_level, MAX_LEN.english_level);
  const englishCertificate = clip(record.english_certificate, MAX_LEN.english_certificate);
  const internshipField = clip(record.internship_field, MAX_LEN.internship_field);
  const targetCountries = clip(record.target_countries, MAX_LEN.target_countries);
  const startTiming = clip(record.start_timing, MAX_LEN.start_timing);
  const financialSituation = clip(record.financial_situation, MAX_LEN.financial_situation);
  const financialDecision = clip(record.financial_decision, MAX_LEN.financial_decision);
  const careerBlockers = clip(record.career_blockers, MAX_LEN.career_blockers);
  const consultationGoals = clip(record.consultation_goals, MAX_LEN.consultation_goals);
  const additionalNotes = clip(record.additional_notes, MAX_LEN.additional_notes);

  if (!n) {
    return NextResponse.json({ ok: false, error: "invalid_name" }, { status: 400 });
  }
  if (!a) {
    return NextResponse.json({ ok: false, error: "invalid_age" }, { status: 400 });
  }
  if (!ctry) {
    return NextResponse.json({ ok: false, error: "invalid_country" }, { status: 400 });
  }
  if (!st) {
    return NextResponse.json({ ok: false, error: "invalid_status" }, { status: 400 });
  }
  if (!spec) {
    return NextResponse.json({ ok: false, error: "invalid_specialty" }, { status: 400 });
  }
  if (!cont || cont.length < 3) {
    return NextResponse.json({ ok: false, error: "invalid_contact" }, { status: 400 });
  }

  const needsCourse = st === "studying" || st === "studying_working";
  if (needsCourse && !crs) {
    return NextResponse.json({ ok: false, error: "invalid_course" }, { status: 400 });
  }

  const requiredLong = [
    interestReason,
    internshipUnderstanding,
    careerImportance,
    experience,
    internshipField,
    targetCountries,
    careerBlockers,
    additionalNotes,
  ];
  if (requiredLong.some((v) => v.length < 2)) {
    return NextResponse.json({ ok: false, error: "invalid_answers" }, { status: 400 });
  }

  if (!englishLevel || !englishCertificate || !startTiming || !financialSituation || !financialDecision) {
    return NextResponse.json({ ok: false, error: "invalid_choices" }, { status: 400 });
  }

  if (!consultationGoals) {
    return NextResponse.json({ ok: false, error: "invalid_goals" }, { status: 400 });
  }

  const ageValue = clip(record.age_value, MAX_LEN.age);

  const submission: LeadSubmissionInput = {
    name: n,
    age: a,
    age_value: ageValue,
    country: ctry,
    status: st,
    course: needsCourse ? crs : "",
    specialty: spec,
    interest_reason: interestReason,
    internship_understanding: internshipUnderstanding,
    career_importance: careerImportance,
    experience,
    english_level: englishLevel,
    english_certificate: englishCertificate,
    internship_field: internshipField,
    target_countries: targetCountries,
    start_timing: startTiming,
    financial_situation: financialSituation,
    financial_decision: financialDecision,
    career_blockers: careerBlockers,
    consultation_goals: consultationGoals,
    additional_notes: additionalNotes,
    contact: cont,
    videos_watched: vw,
    watch_log: wl,
  };

  const payload = toSheetsRow(submission);

  if (!isProd && !hasWebhook) {
    console.log("[api/submit-lead] dev mode — lead accepted (no webhook configured)", payload.name);
    return NextResponse.json({ ok: true });
  }

  const delivered = await postWebhook(payload);
  if (!delivered) {
    return NextResponse.json({ ok: false, error: "delivery_failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
