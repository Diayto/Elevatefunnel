import { NextResponse } from "next/server";

const MAX_LEN = { name: 200, phone: 40, email: 320, course: 120 };

function isValidEmail(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

type LeadPayload = {
  name: string;
  phone: string;
  email: string;
  course: string | null;
  submittedAt: string;
  source: "elevate-landing";
};

async function postWebhook(payload: LeadPayload): Promise<boolean> {
  const url = process.env.APPLY_WEBHOOK_URL?.trim();
  if (!url) return false;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  const secret = process.env.APPLY_WEBHOOK_SECRET?.trim();
  if (secret) {
    headers.Authorization = `Bearer ${secret}`;
  }

  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(20_000),
  });
  return res.ok;
}

async function sendViaResend(payload: LeadPayload): Promise<boolean> {
  const key = process.env.RESEND_API_KEY?.trim();
  const toRaw = process.env.APPLY_TO_EMAIL?.trim();
  const from = process.env.APPLY_FROM_EMAIL?.trim();
  if (!key || !toRaw || !from) return false;
  const to = toRaw
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  if (to.length === 0) return false;

  const text = [
    `Новая заявка с лендинга`,
    ``,
    `Имя: ${payload.name}`,
    `Телефон: ${payload.phone}`,
    `Email: ${payload.email}`,
    `Курс / вуз: ${payload.course ?? "-"}`,
    `Время: ${payload.submittedAt}`,
  ].join("\n");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      subject: `Заявка Elevate: ${payload.name}`,
      text,
    }),
    signal: AbortSignal.timeout(20_000),
  });

  if (!res.ok) {
    if (process.env.NODE_ENV === "development") {
      const err = await res.text().catch(() => "");
      console.error("[api/apply] Resend error", res.status, err);
    }
    return false;
  }
  return true;
}

/**
 * Доставка лида в production: задайте один из вариантов (или оба — тогда уходят оба).
 *
 * 1) Webhook: APPLY_WEBHOOK_URL — POST JSON (Zapier, Make, Slack workflow и т.д.)
 *    Опционально: APPLY_WEBHOOK_SECRET → заголовок Authorization: Bearer …
 *
 * 2) Почта через Resend: RESEND_API_KEY, APPLY_TO_EMAIL, APPLY_FROM_EMAIL (verified sender)
 *
 * В development без env заявка логируется в консоль и возвращается ok (как раньше).
 */
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }

  const { name, phone, email, course } = body as Record<string, unknown>;
  const n = typeof name === "string" ? name.trim() : "";
  const p = typeof phone === "string" ? phone.trim() : "";
  const e = typeof email === "string" ? email.trim() : "";
  const c =
    typeof course === "string" ? course.trim().slice(0, MAX_LEN.course) : "";

  if (!n || n.length > MAX_LEN.name) {
    return NextResponse.json({ ok: false, error: "invalid_name" }, { status: 400 });
  }
  if (!p || p.length < 5 || p.length > MAX_LEN.phone) {
    return NextResponse.json({ ok: false, error: "invalid_phone" }, { status: 400 });
  }
  if (!e || e.length > MAX_LEN.email || !isValidEmail(e)) {
    return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
  }

  const payload: LeadPayload = {
    name: n,
    phone: p,
    email: e,
    course: c || null,
    submittedAt: new Date().toISOString(),
    source: "elevate-landing",
  };

  const isProd = process.env.NODE_ENV === "production";
  const hasWebhook = Boolean(process.env.APPLY_WEBHOOK_URL?.trim());
  const hasResend = Boolean(
    process.env.RESEND_API_KEY?.trim() &&
      process.env.APPLY_TO_EMAIL?.trim() &&
      process.env.APPLY_FROM_EMAIL?.trim(),
  );

  if (isProd && !hasWebhook && !hasResend) {
    return NextResponse.json(
      { ok: false, error: "not_configured" },
      { status: 503 },
    );
  }

  if (!isProd && !hasWebhook && !hasResend) {
    console.log("[api/apply] dev (no delivery env)", {
      name: n,
      phone: p,
      email: e,
      course: c || undefined,
    });
    return NextResponse.json({ ok: true });
  }

  const results: boolean[] = [];
  if (hasWebhook) {
    try {
      results.push(await postWebhook(payload));
    } catch {
      results.push(false);
    }
  }
  if (hasResend) {
    try {
      results.push(await sendViaResend(payload));
    } catch {
      results.push(false);
    }
  }

  const anyOk = results.some(Boolean);
  if (!anyOk) {
    return NextResponse.json({ ok: false, error: "delivery_failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
