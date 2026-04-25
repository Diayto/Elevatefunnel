/**
 * Серверная проверка Cloudflare Turnstile (опционально, см. TURNSTILE_SECRET_KEY).
 * @see https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
 */
export async function verifyTurnstileToken(args: {
  secret: string;
  token: string;
  remoteip?: string;
}): Promise<boolean> {
  const token = args.token.trim();
  if (!token) return false;

  const body = new URLSearchParams();
  body.set("secret", args.secret);
  body.set("response", token);
  if (args.remoteip?.trim()) {
    body.set("remoteip", args.remoteip.trim());
  }

  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) return false;
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}
