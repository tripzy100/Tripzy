import { db } from "@/lib/db";
import { redis } from "@/lib/redis";
import { BookingStatus } from "@prisma/client";

/**
 * Sweeps the database for draft checkouts older than 15 minutes,
 * cancels them, and frees their Redis vehicle checkout locks.
 */
export async function cleanupAbandonedReservations() {
  const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);

  try {
    const expiredDrafts = await db.booking.findMany({
      where: {
        status: BookingStatus.PENDING,
        createdAt: { lte: fifteenMinutesAgo },
      },
    });

    if (expiredDrafts.length === 0) return { cleaned: 0 };

    await db.$transaction(async (tx) => {
      // 1. Bulk cancel expired bookings
      await tx.booking.updateMany({
        where: { id: { in: expiredDrafts.map((b) => b.id) } },
        data: { status: BookingStatus.CANCELLED },
      });

      // 2. Release Redis vehicle availability locks
      for (const draft of expiredDrafts) {
        const lockKey = `tripzy:lock:vehicle:${draft.vehicleId}`;
        await redis.del(lockKey);
      }
    });

    console.log(`[CLEANUP JOB] Automatically cancelled ${expiredDrafts.length} abandoned bookings.`);
    return { success: true, cleaned: expiredDrafts.length };
  } catch (error: any) {
    console.error("Cleanup abandoned checkouts failure:", error);
    return { success: false, error: error.message };
  }
}
export type CleanupAbandonedReservationsType = typeof cleanupAbandonedReservations;
