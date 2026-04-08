/**
 * Client-side rate limiter using localStorage.
 * Prevents the same browser session from submitting a form
 * more than `maxAttempts` times within `windowMs`.
 */

const STORAGE_PREFIX = "rl_";

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetInSeconds: number;
}

export function checkRateLimit(
  key: string,
  maxAttempts: number = 3,
  windowMs: number = 10 * 60 * 1000 // 10 minutes
): RateLimitResult {
  const storageKey = `${STORAGE_PREFIX}${key}`;
  const now = Date.now();

  let record: { timestamps: number[] } = { timestamps: [] };
  try {
    const raw = localStorage.getItem(storageKey);
    if (raw) record = JSON.parse(raw);
  } catch {
    // Corrupted data — reset
  }

  // Prune expired timestamps
  record.timestamps = record.timestamps.filter((t) => now - t < windowMs);

  const allowed = record.timestamps.length < maxAttempts;
  const oldest = record.timestamps[0] ?? now;
  const resetInSeconds = Math.max(0, Math.ceil((oldest + windowMs - now) / 1000));

  return {
    allowed,
    remaining: Math.max(0, maxAttempts - record.timestamps.length),
    resetInSeconds,
  };
}

export function recordSubmission(key: string): void {
  const storageKey = `${STORAGE_PREFIX}${key}`;
  const now = Date.now();
  const windowMs = 10 * 60 * 1000;

  let record: { timestamps: number[] } = { timestamps: [] };
  try {
    const raw = localStorage.getItem(storageKey);
    if (raw) record = JSON.parse(raw);
  } catch {
    // Reset on corruption
  }

  record.timestamps = record.timestamps.filter((t) => now - t < windowMs);
  record.timestamps.push(now);

  try {
    localStorage.setItem(storageKey, JSON.stringify(record));
  } catch {
    // Storage full — fail open
  }
}
