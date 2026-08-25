const buckets = new Map<string, { count: number; resetAt: number }>();

// ponytail: per-instance limiter; use a shared edge/Redis limiter if abuse appears.
export function isRateLimited(key: string, limit: number, windowMs = 60_000, now = Date.now()) {
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }
  bucket.count += 1;
  return bucket.count > limit;
}
