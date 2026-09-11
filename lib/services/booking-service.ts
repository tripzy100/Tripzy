import { db } from "@/lib/db";
import { BookingStatus } from "@prisma/client";
import { calculateAuthoritativePrice } from "@/lib/services/pricing-service";
import { isValidBusinessHours } from "@/features/booking/services/availability-engine";

export interface CreateBookingParams {
  userId: string;
  vehicleId: string;
  pickupLocationId: string;
  dropLocationId: string;
  pickupDate: Date | string;
  returnDate: Date | string;
  couponCode?: string;
}

/**
 * Generates a collision-resistant unique booking reference.
 * Format: BK-YYYYMMDD-XXXX (e.g. BK-20260824-A9F2)
 */
function generateBookingNumber(): string {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randomChars = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `BK-${dateStr}-${randomChars}`;
}

/**
 * Atomic, race-safe vehicle reservation hold creation.
 * Uses PostgreSQL row-level locking (`SELECT ... FOR UPDATE`) on the Vehicle entity
 * to serialize concurrent booking requests and prevent double bookings.
 */
export async function createBookingHold(params: CreateBookingParams) {
  const pDate = new Date(params.pickupDate);
  const rDate = new Date(params.returnDate);

  if (isNaN(pDate.getTime()) || isNaN(rDate.getTime())) {
    return { success: false, error: "Invalid pickup or return date" };
  }

  if (rDate <= pDate) {
    return { success: false, error: "Return date must be after pickup date" };
  }

  if (!isValidBusinessHours(pDate, rDate)) {
    return { success: false, error: "Pickup and return timings must fall within 7:00 AM - 11:00 PM" };
  }

  // Calculate authoritative pricing
  const priceResult = await calculateAuthoritativePrice({
    vehicleId: params.vehicleId,
    pickupDate: pDate,
    returnDate: rDate,
    couponCode: params.couponCode,
    userId: params.userId,
  });

  if (!priceResult.success) {
    return { success: false, error: priceResult.error };
  }

  const { pricing } = priceResult;

  // 15-minute hold window for PENDING bookings
  const HOLD_DURATION_MS = 15 * 60 * 1000;
  const holdExpiryCutoff = new Date(Date.now() - HOLD_DURATION_MS);

  // 3-hour buffer between consecutive rentals
  const BUFFER_MS = 3 * 60 * 60 * 1000;
  const startWithBuffer = new Date(pDate.getTime() - BUFFER_MS);
  const endWithBuffer = new Date(rDate.getTime() + BUFFER_MS);

  try {
    const booking = await db.$transaction(async (tx) => {
      // Acquire exclusive row lock on Vehicle to prevent race conditions
      await tx.$executeRaw`SELECT id FROM "Vehicle" WHERE id = ${params.vehicleId}::uuid FOR UPDATE`;

      // Check overlapping CONFIRMED, ONGOING, or active PENDING bookings
      const overlapping = await tx.booking.findFirst({
        where: {
          vehicleId: params.vehicleId,
          OR: [
            { status: { in: [BookingStatus.CONFIRMED, BookingStatus.ONGOING] } },
            {
              status: BookingStatus.PENDING,
              createdAt: { gte: holdExpiryCutoff },
            },
          ],
          AND: [
            { pickupDate: { lte: endWithBuffer } },
            { returnDate: { gte: startWithBuffer } },
          ],
        },
      });

      if (overlapping) {
        throw new Error("VEHICLE_UNAVAILABLE");
      }

      // Create PENDING booking with server-calculated price
      const bookingRef = generateBookingNumber();
      const newBooking = await tx.booking.create({
        data: {
          bookingNumber: bookingRef,
          userId: params.userId,
          vehicleId: params.vehicleId,
          pickupLocationId: params.pickupLocationId,
          dropLocationId: params.dropLocationId,
          pickupDate: pDate,
          returnDate: rDate,
          status: BookingStatus.PENDING,
          totalAmount: pricing.subtotalWithSurcharges,
          discountAmount: pricing.discountAmount,
          taxAmount: pricing.taxAmount,
          finalAmount: pricing.finalAmount,
          securityDeposit: pricing.securityDeposit,
        },
      });

      // Log initial timeline
      await tx.bookingTimeline.create({
        data: {
          bookingId: newBooking.id,
          statusChangedTo: BookingStatus.PENDING,
          remarks: `Draft reservation hold created (15-min hold window). Ref: ${bookingRef}`,
          actionBy: params.userId,
        },
      });

      // Upsert VehicleAvailabilityCalendar for calendar date window
      const currentDate = new Date(pDate);
      while (currentDate <= rDate) {
        const dateOnly = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
        await tx.vehicleAvailabilityCalendar.upsert({
          where: {
            vehicleId_date: {
              vehicleId: params.vehicleId,
              date: dateOnly,
            },
          },
          update: {
            isAvailable: false,
            blockReason: `Booking ${bookingRef}`,
            bookingId: newBooking.id,
          },
          create: {
            vehicleId: params.vehicleId,
            date: dateOnly,
            isAvailable: false,
            blockReason: `Booking ${bookingRef}`,
            bookingId: newBooking.id,
          },
        });
        currentDate.setDate(currentDate.getDate() + 1);
      }

      return newBooking;
    });

    return { success: true, booking };
  } catch (error: any) {
    if (error.message === "VEHICLE_UNAVAILABLE") {
      return { success: false, error: "Vehicle is unavailable for the selected dates or another booking is in progress." };
    }
    console.error("Create booking hold error:", error);
    return { success: false, error: "Failed to allocate vehicle reservation hold." };
  }
}

/**
 * Confirms a pending booking after payment authorization.
 * Revalidates hold status and updates booking state to CONFIRMED.
 */
export async function confirmBookingAuthoritative(bookingId: string, userId: string) {
  try {
    const booking = await db.booking.findUnique({
      where: { id: bookingId },
      include: { payments: true },
    });
    if (!booking) return { success: false, error: "Booking reference not found" };

    if (booking.userId !== userId) {
      return { success: false, error: "Unauthorized access to booking record" };
    }

    if (booking.status === BookingStatus.CONFIRMED) {
      return { success: true, message: "Booking already confirmed" };
    }

    if (booking.status === BookingStatus.CANCELLED || booking.status === BookingStatus.EXPIRED) {
      return { success: false, error: "Booking hold has expired or was cancelled" };
    }

    // Payment Verification Guard: Online bookings require a COMPLETED payment record
    const hasCompletedOnlinePayment = booking.payments.some(
      (p) => (p.paymentGateway === "CASHFREE" || p.paymentGateway === "RAZORPAY") && p.paymentStatus === "COMPLETED"
    );
    const isCodBooking = booking.payments.some((p) => p.paymentGateway === "COD");

    if (!hasCompletedOnlinePayment && !isCodBooking) {
      return {
        success: false,
        error: "Cannot confirm booking without a verified online payment or valid COD selection.",
      };
    }

    await db.$transaction(async (tx) => {
      await tx.booking.update({
        where: { id: bookingId },
        data: { status: BookingStatus.CONFIRMED },
      });

      await tx.bookingTimeline.create({
        data: {
          bookingId,
          statusChangedTo: BookingStatus.CONFIRMED,
          remarks: isCodBooking
            ? "Reservation finalized under Pay at Pickup (COD) policy"
            : "Reservation finalized upon verified online payment",
          actionBy: userId,
        },
      });
    });

    return { success: true };
  } catch (error: any) {
    console.error("Confirm booking error:", error);
    return { success: false, error: "Failed to confirm booking state" };
  }
}

