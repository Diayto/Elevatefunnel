import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const RATE_LIMIT_MAX_ENTRIES = 50_000;

const memoryStore = new Map<string, number[]>();

/**
 * Лимиты с одного IP (NAT при таргете). Env: APPLY_RATE_LIMIT_MAX (1–500), APPLY_RATE_LIMIT_WINDOW_MINUTES (1–60).
 * По умолчанию 60 заявок за 10 мин — мягче старых «3 / 10 мин».
 */
export function getApplyRateLimitConfig(): { max: number; windowMinutes: number } {
  const rawMax = Number(process.env.APPLY_RATE_LIMIT_MAX ?? "60");
  const rawWin = Number(process.env.APPLY_RATE_LIMIT_WINDOW_MINUTES ?? "10");
  const max =
    Number.isFinite(rawMax) && rawMax >= 1 ? Math.min(Math.floor(rawMax), 500) : 60;
  const windowMinutes =
    Number.isFinite(rawWin) && rawWin >= 1 ? Math.min(Math.floor(rawWin), 60) : 10;
  return { max, windowMinutes };
}

export function hasDistributedApplyRateLimit(): boolean {
  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  return Boolean(url && token);
}

function checkRateLimitMemory(ip: string): { allowed: boolean; retryAfter: number } {
  const { max, windowMinutes } = getApplyRateLimitConfig();
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

let upstashClient: Ratelimit | null | undefined;
let upstashLimiterKey: string | undefined;
let upstashRedisClient: Redis | null | undefined;

function getUpstashRedis(): Redis | null {
  if (!hasDistributedApplyRateLimit()) {
    upstashRedisClient = null;
    return null;
  }
  if (upstashRedisClient !== undefined) {
    return upstashRedisClient;
  }
  const url = process.env.UPSTASH_REDIS_REST_URL!.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN!.trim();
  upstashRedisClient = new Redis({ url, token });
  return upstashRedisClient;
}

function getUpstashRatelimit(): Ratelimit | null {
  if (!hasDistributedApplyRateLimit()) {
    upstashClient = null;
    upstashLimiterKey = undefined;
    return null;
  }
  const url = process.env.UPSTASH_REDIS_REST_URL!.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN!.trim();

  const { max, windowMinutes } = getApplyRateLimitConfig();
  const key = `${max}@${windowMinutes}m`;
  if (upstashClient !== undefined && upstashLimiterKey === key) {
    return upstashClient;
  }

  const redis = new Redis({ url, token });
  upstashClient = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(max, `${windowMinutes} m`),
    prefix: "elevate-apply",
  });
  upstashLimiterKey = key;
  return upstashClient;
}

/**
 * Лимит заявок с одного IP: при заданных UPSTASH_* — общий счётчик между инстансами Vercel;
 * иначе in-memory.
 */
export async function enforceApplyRateLimit(
  ip: string,
): Promise<{ allowed: boolean; retryAfter: number }> {
  const up = getUpstashRatelimit();
  if (up) {
    const { success, reset } = await up.limit(ip);
    if (!success) {
      const retryAfter = Math.max(1, Math.ceil((reset - Date.now()) / 1000));
      return { allowed: false, retryAfter };
    }
    return { allowed: true, retryAfter: 0 };
  }
  return checkRateLimitMemory(ip);
}

/**
 * Резервирует короткое dedup-окно для заявки (Nx+TTL).
 * true -> можно принимать запрос, false -> дубль в активном окне.
 */
export async function reserveApplyDedupSlot(
  key: string,
  ttlSeconds: number,
): Promise<boolean> {
  const redis = getUpstashRedis();
  if (!redis) return true;
  try {
    const result = await redis.set(key, "1", { nx: true, ex: ttlSeconds });
    return result === "OK";
  } catch {
    // fail-open: не режем заявки при кратковременном сбое Redis dedup-слоя
    return true;
  }
}
