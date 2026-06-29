import { redis } from "@/lib/redis";

interface ObservabilityMetrics {
  provider: string;
  latency: number;
  tokensUsed: number;
  success: boolean;
}

/**
 * Commits AI latency and cost parameters to Redis metrics trackers.
 */
export async function logAiPerformance(metrics: ObservabilityMetrics) {
  try {
    const pipe = [
      redis.incrby("tripzy:ai:tokens", metrics.tokensUsed),
      redis.lpush("tripzy:ai:latency", JSON.stringify({
        timestamp: new Date(),
        ...metrics,
      })),
    ];
    await Promise.all(pipe);
    
    // Trim latency logs list to keep memory footprint bounded
    await redis.ltrim("tripzy:ai:latency", 0, 99);
  } catch (error) {
    console.error("AI Performance log write failure:", error);
  }
}

/**
 * Retrieves compiled AI performance data from Redis.
 */
export async function getAiObservabilityMetrics() {
  try {
    const totalTokens = await redis.get("tripzy:ai:tokens");
    const rawLogs = await redis.lrange("tripzy:ai:latency", 0, 10);
    
    const logs = (rawLogs || []).map((l) => JSON.parse(l));
    return {
      totalTokens: Number(totalTokens) || 0,
      recentLogs: logs,
    };
  } catch {
    return { totalTokens: 0, recentLogs: [] };
  }
}
