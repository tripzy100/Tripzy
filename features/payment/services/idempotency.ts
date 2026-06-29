import { redis } from "@/lib/redis";

/**
 * Checks request idempotency using Redis key expiration.
 * Returns true if this request is fresh and can execute, false if it's a duplicate.
 */
export async function verifyIdempotency(key: string): Promise<boolean> {
  if (!key) return true; // skip validation if no idempotency key supplied
  
  const redisKey = `tripzy:idempotency:${key}`;
  try {
    const result = await redis.set(redisKey, "processed", {
      nx: true,
      ex: 86400, // 24 hours in seconds
    });
    return result === "OK";
  } catch (error) {
    console.error("Redis verifyIdempotency error:", error);
    return true; // Fallback to allow execution in dev
  }
}
export type IdempotencyCheckType = typeof verifyIdempotency;
