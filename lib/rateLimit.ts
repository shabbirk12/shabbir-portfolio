const attempts = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 8;

/**
 * Best-effort brute-force throttle keyed by IP. This is in-memory, so it resets
 * on server restart and doesn't share state across serverless instances — fine
 * for a single small Node server, not a substitute for a real rate-limit service
 * (e.g. Upstash/Redis) if this is deployed at scale.
 */
export function checkRateLimit(key: string): { allowed: boolean; retryAfterSeconds?: number } {
  const now = Date.now();
  const entry = attempts.get(key);

  if (!entry || now > entry.resetAt) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true };
  }

  if (entry.count >= MAX_ATTEMPTS) {
    return { allowed: false, retryAfterSeconds: Math.ceil((entry.resetAt - now) / 1000) };
  }

  entry.count += 1;
  return { allowed: true };
}

export function resetRateLimit(key: string) {
  attempts.delete(key);
}
