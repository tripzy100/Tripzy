import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { BookingStatus } from "@prisma/client";

const HOLD_DURATION_MS = 15 * 60 * 1000; // 15 minutes

export async function GET(request: NextRequest) {
  try {
    // 1. Authenticate Cron execution via Vercel CRON_SECRET header
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized cron invocation" }, { status: 401 });
    }

    const cutoffTime = new Date(Date.now() - HOLD_DURATION_MS);

    // 2. Identify expired PENDING booking holds
    const expiredHolds = await db.booking.findMany({
      where: {
        status: BookingStatus.PENDING,
        createdAt: { lt: cutoffTime },
      },
      select: {
        id: true,
        bookingNumber: true,
        vehicleId: true,
        pickupDate: true,
        returnDate: true,
      },
    });

    if (expiredHolds.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No expired booking holds found.",
        cleanedCount: 0,
      });
    }

    const expiredBookingIds = expiredHolds.map((b) => b.id);

    // 3. Execute atomic transaction to transition status & release calendar entries
    const result = await db.$transaction(async (tx) => {
      // Mark bookings as EXPIRED
      const updatedBookings = await tx.booking.updateMany({
        where: {
          id: { in: expiredBookingIds },
          status: BookingStatus.PENDING, // Guard against concurrent status changes
        },
        data: {
          status: BookingStatus.EXPIRED,
        },
      });

      // Release availability calendar slots for expired holds
      await tx.vehicleAvailabilityCalendar.updateMany({
        where: {
          bookingId: { in: expiredBookingIds },
        },
        data: {
          isAvailable: true,
          bookingId: null,
        },
      });

      const SYSTEM_CRON_USER_ID = "00000000-0000-0000-0000-000000000000";
      // Insert audit log timeline entries
      await tx.bookingTimeline.createMany({
        data: expiredBookingIds.map((bId) => ({
          bookingId: bId,
          statusChangedTo: BookingStatus.EXPIRED,
          remarks: "Hold expired after 15 minutes of payment inactivity",
          actionBy: SYSTEM_CRON_USER_ID,
        })),
      });

      return updatedBookings.count;
    });

    return NextResponse.json({
      success: true,
      message: `Cleaned up ${result} expired booking holds.`,
      cleanedCount: result,
    });
  } catch (error: unknown) {
    console.error("Cron hold cleanup error");
    return NextResponse.json(
      { error: "Internal error executing hold cleanup cron job" },
      { status: 500 }
    );
  }
}

// Support POST requests from manual webhooks / external schedulers
export async function POST(request: NextRequest) {
  return GET(request);
}
