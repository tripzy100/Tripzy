import { redis } from "@/lib/redis";

/**
 * Checks if a business event has already been processed using its Correlation ID.
 * Returns true if duplicate, false if safe to execute.
 */
export async function isEventDuplicate(correlationId: string): Promise<boolean> {
  if (!correlationId) return false;
  
  const redisKey = `tripzy:events:correlation:${correlationId}`;
  try {
    const result = await redis.set(redisKey, "processed", {
      nx: true,
      ex: 86400, // 24 hour TTL holding window
    });
    return result !== "OK";
  } catch (error) {
    console.error("Redis isEventDuplicate check error:", error);
    return false; // Fallback to safe execution in case of Redis cache outages
  }
}
export type IsEventDuplicateType = typeof isEventDuplicate;
