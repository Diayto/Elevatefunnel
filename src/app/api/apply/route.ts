import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import {
  enforceApplyRateLimit,
  hasDistributedApplyRateLimit,
  reserveApplyDedupSlot,
} from "@/lib/applyRateLimit";
import { verifyTurnstileToken } from "@/lib/verifyTurnstile";

/** Фоновая доставка в Google может занять минуту (холодный старт Apps Script). */
export const maxDuration = 120;
const WEBHOOK_TIMEOUT_MS = 15_000;
const DEDUP_TTL_SECONDS = 180;

const MAX_LEN = { name: 200, phone: 40, email: 320, course: 120 };
const MAX_BODY_BYTES = 4096;

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

/** Только официальные хосты веб-приложений Google Apps Script (снижает SSRF при подмене env). */
function isGoogleAppsScriptWebhookHost(hostname: string): boolean {
  const h = hostname.toLowerCase();
  return h === "script.google.com" || h === "script.googleusercontent.com";
}

/** Дополнительные хосты webhook через APPLY_WEBHOOK_EXTRA_HOSTS (точное совпадение, через запятую). */
function parseExtraWebhookHosts(): Set<string> {
  const raw = process.env.APPLY_WEBHOOK_EXTRA_HOSTS?.trim();
  if (!raw) return new Set();
  const set = new Set<string>();
  for (const part of raw.split(",")) {
    const h = part.trim().toLowerCase();
    if (!h || h.length > 253) continue;
    if (/[^a-z0-9.-]/.test(h) || h.includes("..") || h.startsWith(".") || h.endsWith(".")) {
      continue;
    }
    if (isBlockedHostname(h)) continue;
    set.add(h);
  }
  return set;
}

function isWebhookHostnameAllowed(hostname: string): boolean {
  const h = hostname.toLowerCase();
  if (isGoogleAppsScriptWebhookHost(h)) return true;
  return parseExtraWebhookHosts().has(h);
}

function isAllowedWebhookUrl(raw: string): boolean {
  try {
    const u = new URL(raw.trim());
    if (u.protocol !== "https:") return false;
    if (!u.hostname) return false;
    if (isBlockedHostname(u.hostname)) return false;
    if (!isWebhookHostnameAllowed(u.hostname)) return false;
    return true;
  } catch {
    return false;
  }
}

function isValidEmail(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  const real = req.headers.get("x-real-ip");
  if (real) return real.trim();
  return "unknown";
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
  if (!url || !isAllowedWebhookUrl(url)) {
    if (process.env.NODE_ENV === "development") {
      console.error(
        "[api/apply] webhook URL missing or not allowed (https + Google Script hosts or APPLY_WEBHOOK_EXTRA_HOSTS)",
      );
    }
    return false;
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  const secret = process.env.APPLY_WEBHOOK_SECRET?.trim();
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
      console.error("[api/apply] webhook HTTP error", res.status);
      if (process.env.NODE_ENV === "development") {
        console.error("[api/apply] webhook body", text.slice(0, 800));
      }
      return false;
    }
    // Apps Script часто отвечает HTTP 200 и телом {"ok":false} при неверном секрете / ошибке doPost
    try {
      const parsed = JSON.parse(text) as { ok?: unknown };
      if (parsed && typeof parsed === "object" && parsed.ok === true) {
        return true;
      }
    } catch {
      /* не JSON */
    }
    console.error(
      "[api/apply] webhook returned 200 but not ok:true (check secret, sheet «Лист1», Apps Script logs)",
    );
    if (process.env.NODE_ENV === "development") {
      console.error("[api/apply] webhook body", text.slice(0, 800));
    }
    return false;
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.error("[api/apply] webhook fetch error", err);
    }
    return false;
  }
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

  const subjectSafe = `Заявка Elevate: ${payload.name.replace(/[\r\n\u0000]/g, " ").slice(0, 200)}`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      subject: subjectSafe,
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
 * 1) Webhook: APPLY_WEBHOOK_URL — https и хосты Google Apps Script или список APPLY_WEBHOOK_EXTRA_HOSTS
 *    (точные имена хостов через запятую; защита от SSRF при подмене env).
 *    Опционально: APPLY_WEBHOOK_SECRET → Authorization: Bearer … и поле _webhookVerify в JSON
 *    (Google Apps Script не видит произвольные HTTP-заголовки — проверяйте _webhookVerify в теле).
 *
 *    Распределённый лимит: UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN (иначе in-memory).
 *    Лимит с IP (реклама / NAT): APPLY_RATE_LIMIT_MAX (1–500, по умолч. 60), APPLY_RATE_LIMIT_WINDOW_MINUTES (1–60, по умолч. 10).
 *    Антибот (prod): TURNSTILE_SECRET_KEY + NEXT_PUBLIC_TURNSTILE_SITE_KEY → поле turnstileToken в JSON.
 *
 * 2) Почта через Resend: RESEND_API_KEY, APPLY_TO_EMAIL, APPLY_FROM_EMAIL (verified sender)
 *
 * В development без env заявка логируется в консоль и возвращается ok (как раньше).
 *
 * Webhook (таблица) и Resend дожидаются в этом запросе: иначе ответ «успех» приходит
 * до записи, а фон на serverless может не завершиться — строка в таблице не появляется.
 * Холодный старт Apps Script допускается за счёт maxDuration и индикатора отправки в UI.
 */
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
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY?.trim();
  const turnstileSite = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();
  const webhookUrlRaw = process.env.APPLY_WEBHOOK_URL?.trim();
  const hasWebhook = Boolean(webhookUrlRaw);
  const hasResend = Boolean(
    process.env.RESEND_API_KEY?.trim() &&
      process.env.APPLY_TO_EMAIL?.trim() &&
      process.env.APPLY_FROM_EMAIL?.trim(),
  );

  if (isProd && !hasDistributedApplyRateLimit()) {
    return NextResponse.json(
      { ok: false, error: "not_configured" },
      { status: 503 },
    );
  }
  if (isProd && (!turnstileSecret || !turnstileSite)) {
    return NextResponse.json(
      { ok: false, error: "not_configured" },
      { status: 503 },
    );
  }
  if (isProd && !hasWebhook && !hasResend) {
    return NextResponse.json(
      { ok: false, error: "not_configured" },
      { status: 503 },
    );
  }

  const ct = req.headers.get("content-type") ?? "";
  if (!ct.toLowerCase().includes("application/json")) {
    return NextResponse.json({ ok: false, error: "unsupported_media_type" }, { status: 415 });
  }

  const ip = getClientIp(req);
  const rl = await enforceApplyRateLimit(ip);
  if (!rl.allowed) {
    return NextResponse.json(
      { ok: false, error: "rate_limited" },
      {
        status: 429,
        headers: { "Retry-After": String(rl.retryAfter) },
      },
    );
  }

  if (
    isProd &&
    webhookUrlRaw &&
    !isAllowedWebhookUrl(webhookUrlRaw)
  ) {
    return NextResponse.json(
      { ok: false, error: "not_configured" },
      { status: 503 },
    );
  }

  const clHeader = req.headers.get("content-length");
  let declaredContentLength: number | null = null;
  if (clHeader !== null && clHeader.trim() !== "") {
    const n = Number(clHeader);
    if (!Number.isFinite(n) || n <= 0) {
      return NextResponse.json(
        { ok: false, error: "invalid_content_length" },
        { status: 400 },
      );
    }
    if (n > MAX_BODY_BYTES) {
      return NextResponse.json(
        { ok: false, error: "payload_too_large" },
        { status: 413 },
      );
    }
    declaredContentLength = n;
  }

  let body: unknown;
  try {
    const raw = await req.text();
    const byteLen = new TextEncoder().encode(raw).length;
    if (byteLen > MAX_BODY_BYTES) {
      return NextResponse.json(
        { ok: false, error: "payload_too_large" },
        { status: 413 },
      );
    }
    if (
      declaredContentLength !== null &&
      byteLen !== declaredContentLength
    ) {
      return NextResponse.json(
        { ok: false, error: "payload_too_large" },
        { status: 413 },
      );
    }
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }

  const record = body as Record<string, unknown>;
  const { name, phone, email, course, website } = record;
  const turnstileToken =
    typeof record.turnstileToken === "string" ? record.turnstileToken.trim() : "";

  if (typeof website === "string" && website.trim().length > 0) {
    return NextResponse.json({ ok: true });
  }
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

  const phoneDigits = p.replace(/\D+/g, "");
  const dedupBasis = `${e.toLowerCase()}|${phoneDigits}`;
  const dedupHash = createHash("sha256").update(dedupBasis).digest("hex");
  const dedupKey = `apply-dedup:${dedupHash}`;
  const isFreshAttempt = await reserveApplyDedupSlot(dedupKey, DEDUP_TTL_SECONDS);
  if (!isFreshAttempt) {
    return NextResponse.json(
      { ok: false, error: "duplicate_request" },
      { status: 429, headers: { "Retry-After": String(DEDUP_TTL_SECONDS) } },
    );
  }

  if (isProd) {
    const captchaOk = await verifyTurnstileToken({
      secret: turnstileSecret!,
      token: turnstileToken,
      remoteip: ip !== "unknown" ? ip : undefined,
    });
    if (!captchaOk) {
      return NextResponse.json({ ok: false, error: "captcha_failed" }, { status: 400 });
    }
  }

  const payload: LeadPayload = {
    name: n,
    phone: p,
    email: e,
    course: c || null,
    submittedAt: new Date().toISOString(),
    source: "elevate-landing",
  };

  if (!isProd && !hasWebhook && !hasResend) {
    console.log("[api/apply] dev (no delivery env) — lead not logged (avoid PII in console)");
    return NextResponse.json({ ok: true });
  }

  const deliveries: Promise<boolean>[] = [];
  if (hasWebhook) deliveries.push(postWebhook(payload));
  if (hasResend) deliveries.push(sendViaResend(payload));

  try {
    const outcomes = await Promise.all(deliveries);
    if (outcomes.some((ok) => !ok)) {
      console.error("[api/apply] delivery failed (webhook and/or Resend)");
      return NextResponse.json(
        { ok: false, error: "delivery_failed" },
        { status: 502 },
      );
    }
  } catch (err) {
    console.error("[api/apply] delivery error", err);
    return NextResponse.json(
      { ok: false, error: "delivery_failed" },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
