const RATE_LIMIT_MAX_ENTRIES = 50_000;
const memoryStore = new Map<string, number[]>();

export function getLeadRateLimitConfig(): { max: number; windowMinutes: number } {
  const rawMax = Number(process.env.LEAD_RATE_LIMIT_MAX ?? "15");
  const rawWin = Number(process.env.LEAD_RATE_LIMIT_WINDOW_MINUTES ?? "10");
  const max =
    Number.isFinite(rawMax) && rawMax >= 1 ? Math.min(Math.floor(rawMax), 200) : 15;
  const windowMinutes =
    Number.isFinite(rawWin) && rawWin >= 1 ? Math.min(Math.floor(rawWin), 60) : 10;
  return { max, windowMinutes };
}

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first.slice(0, 64);
  }
  const realIp = req.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp.slice(0, 64);
  return "unknown";
}

export function enforceLeadRateLimit(ip: string): { allowed: boolean; retryAfter: number } {
  const { max, windowMinutes } = getLeadRateLimitConfig();
  const windowMs = windowMinutes * 60 * 1000;
  const now = Date.now();
  const windowStart = now - windowMs;
  const existing = memoryStore.get(ip) ?? [];
  const recent = existing.filter((ts) => ts > windowStart);

  if (recent.length >= max) {
    const oldest = recent[0] ?? now;
    const retryAfter = Math.max(1, Math.ceil((oldest + windowMs - now) / 1000));
    return { allowed: false, retryAfter };
  }

  recent.push(now);
  memoryStore.set(ip, recent);

  if (memoryStore.size > RATE_LIMIT_MAX_ENTRIES) {
    for (const [key, timestamps] of memoryStore) {
      const fresh = timestamps.filter((ts) => ts > windowStart);
      if (fresh.length === 0) memoryStore.delete(key);
      else memoryStore.set(key, fresh);
      if (memoryStore.size <= RATE_LIMIT_MAX_ENTRIES) break;
    }
  }

  return { allowed: true, retryAfter: 0 };
}
