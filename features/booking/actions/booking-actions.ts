"use server";

import { db } from "@/lib/db";
import { BookingStatus } from "@prisma/client";
import {
  BookingRequestValues,
  ExtensionRequestValues,
  CancellationRequestValues,
} from "../validators";
import { checkVehicleAvailability } from "../services/availability-engine";
import { createBookingHold, confirmBookingAuthoritative } from "@/lib/services/booking-service";
import { requireAuth } from "@/lib/auth-utils";

export async function createDraftBooking(values: BookingRequestValues) {
  try {
    const userId = await requireAuth();

    const result = await createBookingHold({
      userId,
      vehicleId: values.vehicleId,
      pickupLocationId: values.pickupBranchId,
      dropLocationId: values.dropBranchId,
      pickupDate: values.pickupDate,
      returnDate: values.returnDate,
    });

    if (!result.success) {
      return { success: false, error: result.error };
    }

    return { success: true, bookingId: result.booking!.id };
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      return { success: false, error: "Please log in to create a reservation." };
    }
    return { success: false, error: "Failed to allocate reservation hold." };
  }
}

export async function confirmBooking(id: string) {
  try {
    const userId = await requireAuth();
    return await confirmBookingAuthoritative(id, userId);
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      return { success: false, error: "Unauthorized session." };
    }
    return { success: false, error: "Failed to confirm reservation" };
  }
}

export async function requestExtension(values: ExtensionRequestValues) {
  try {
    const userId = await requireAuth();

    const book = await db.booking.findUnique({ where: { id: values.bookingId } });
    if (!book) return { success: false, error: "Booking not found" };

    if (book.userId !== userId) {
      return { success: false, error: "Unauthorized access to booking" };
    }

    const currentEnd = new Date(book.returnDate);
    const nextEnd = new Date(currentEnd.getTime() + values.extraDays * 24 * 60 * 60 * 1000);

    const available = await checkVehicleAvailability(book.vehicleId, currentEnd, nextEnd);
    if (!available) return { success: false, error: "Extension conflicts with next booking" };

    await db.$transaction(async (tx) => {
      const extraBase = values.extraDays * 3000;
      const extraTax = extraBase * 0.18;

      await tx.booking.update({
        where: { id: values.bookingId },
        data: {
          returnDate: nextEnd,
          totalAmount: Number(book.totalAmount) + extraBase,
          taxAmount: Number(book.taxAmount) + extraTax,
          finalAmount: Number(book.finalAmount) + extraBase + extraTax,
        },
      });

      await tx.bookingTimeline.create({
        data: {
          bookingId: values.bookingId,
          statusChangedTo: book.status,
          remarks: `Extension of ${values.extraDays} days approved`,
          actionBy: userId,
        },
      });
    });

    return { success: true };
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      return { success: false, error: "Unauthorized session." };
    }
    return { success: false, error: "Extension request failed" };
  }
}

export async function cancelBooking(values: CancellationRequestValues) {
  try {
    const userId = await requireAuth();

    const book = await db.booking.findUnique({ where: { id: values.bookingId } });
    if (!book) return { success: false, error: "Booking not found" };

    if (book.userId !== userId) {
      return { success: false, error: "Unauthorized access to booking" };
    }

    await db.$transaction(async (tx) => {
      await tx.booking.update({
        where: { id: values.bookingId },
        data: { status: BookingStatus.CANCELLED },
      });

      await tx.bookingTimeline.create({
        data: {
          bookingId: values.bookingId,
          statusChangedTo: BookingStatus.CANCELLED,
          remarks: `Cancelled. Reason: ${values.reason}`,
          actionBy: userId,
        },
      });
    });

    return { success: true };
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      return { success: false, error: "Unauthorized session." };
    }
    return { success: false, error: "Cancellation failed" };
  }
}

