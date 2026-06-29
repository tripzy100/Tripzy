import { db } from "@/lib/db";
import { LogType } from "@prisma/client";
import { addJobToQueue } from "./job-queue";
import { broadcastRealtimeUpdate } from "./realtime-pubsub";
import { generateEventMetadata } from "./event-metadata";
import { isEventDuplicate } from "./event-idempotency";

/**
 * Dispatches business event payloads safely. Employs exactly-once guards
 * by checking correlation IDs inside Redis caches.
 */
export async function emitEvent(eventName: string, payload: any) {
  try {
    // 1. Generate distributed tracing and correlation metrics
    const metadata = generateEventMetadata(eventName);
    const correlationId = payload.correlationId || metadata.correlationId;

    // 2. Exactly-once execution validation check
    const isDuplicate = await isEventDuplicate(correlationId);
    if (isDuplicate) {
      console.warn(`[EVENT BUS] Duplicate correlation detected. Skipping: ${correlationId}`);
      return { success: true, duplicate: true };
    }

    // 3. Log event audit details in PostgreSQL activity logs
    const logTypeMap: Record<string, LogType> = {
      "BOOKING_CREATED": LogType.BOOKING_CREATE,
      "KYC_SUBMITTED": LogType.KYC_SUBMIT,
    };

    const type = logTypeMap[eventName];
    if (type) {
      await db.activityLog.create({
        data: {
          type,
          description: `Event: ${eventName} (Tracing: ${metadata.tracingId})`,
          metadata: { ...payload, correlationId },
          userId: payload.userId || null,
        },
      });
    }

    // 4. Broadcast realtime socket notifications
    await broadcastRealtimeUpdate(`channel-${eventName}`, { eventName, payload, correlationId });

    // 5. Append transaction job to queue
    await addJobToQueue("run-workflow", { eventName, payload, correlationId });

    return { success: true, correlationId };
  } catch (error: any) {
    console.error(`Failed to emit event ${eventName}:`, error);
    return { success: false, error: error.message };
  }
}
export type EmitEventType = typeof emitEvent;
