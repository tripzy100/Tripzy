import { redis } from "@/lib/redis";
import { db } from "@/lib/db";
import { BookingStatus } from "@prisma/client";

/**
 * Validates that a user is not triggering too many payment attempts in a short timeframe.
 * Allowed limit: Max 5 attempts per minute.
 */
export async function checkPaymentVelocity(userId: string): Promise<boolean> {
  const key = `tripzy:risk:velocity:user:${userId}`;
  try {
    const attempts = await redis.incr(key);
    if (attempts === 1) {
      await redis.expire(key, 60); // 1 minute window
    }
    return attempts <= 5;
  } catch (error) {
    console.error("Redis checkPaymentVelocity error:", error);
    return true; // Fallback to true if Redis fails to prevent blocks in dev
  }
}

/**
 * Scans active checkouts to confirm a user does not have duplicate booking attempts.
 */
export async function detectDuplicateCheckouts(
  userId: string,
  pickup: Date,
  returnD: Date
): Promise<boolean> {
  const overlaps = await db.booking.findFirst({
    where: {
      userId,
      status: {
        in: [BookingStatus.PENDING, BookingStatus.CONFIRMED, BookingStatus.ONGOING],
      },
      OR: [
        { pickupDate: { gte: pickup, lte: returnD } },
        { returnDate: { gte: pickup, lte: returnD } },
      ],
    },
  });

  return !overlaps;
}
export type VelocityCheckType = typeof checkPaymentVelocity;
