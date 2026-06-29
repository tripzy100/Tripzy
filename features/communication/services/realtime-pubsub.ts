import { redis } from "@/lib/redis";

/**
 * Publishes events to Ably/Pusher channels. For this environment,
 * we mock-broadcast and store active channels states in Redis.
 */
export async function broadcastRealtimeUpdate(channel: string, data: any) {
  try {
    const serialized = JSON.stringify(data);
    
    // Save state update in Redis cache for dashboard validation
    await redis.set(`tripzy:realtime:${channel}`, serialized, {
      ex: 300, // 5 minutes TTL
    });

    console.log(`[REALTIME PUB/SUB] Broadcasted on channel: ${channel}`);
    return { success: true };
  } catch (error: any) {
    console.error("Realtime broadcast failure:", error);
    return { success: false, error: error.message };
  }
}
export type BroadcastRealtimeUpdateType = typeof broadcastRealtimeUpdate;
