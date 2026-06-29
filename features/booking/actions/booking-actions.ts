"use server";

import { db } from "@/lib/db";
import { BookingStatus } from "@prisma/client";
import { BookingRequestValues, ExtensionRequestValues, CancellationRequestValues } from "../validators";
import { acquireLock, releaseLock } from "../services/reservation-locks";
import { checkVehicleAvailability, isValidBusinessHours } from "../services/availability-engine";

/**
 * Creates a PENDING booking and acquires a Redis checkout lock.
 */
export async function createDraftBooking(values: BookingRequestValues) {
  if (!isValidBusinessHours(values.pickupDate, values.returnDate)) {
    return { success: false, error: "Timings must fall within 7AM-11PM" };
  }

  const lockAcquired = await acquireLock(values.vehicleId);
  if (!lockAcquired) {
    return { success: false, error: "Vehicle is currently locked by another checkout" };
  }

  const available = await checkVehicleAvailability(values.vehicleId, values.pickupDate, values.returnDate);
  if (!available) {
    await releaseLock(values.vehicleId);
    return { success: false, error: "Vehicle is unavailable for this date window" };
  }

  try {
    const result = await db.$transaction(async (tx) => {
      const mockUser = await tx.user.findFirst();
      if (!mockUser) throw new Error("No users found");

      const book = await tx.booking.create({
        data: {
          bookingNumber: "BK-" + Math.floor(100000 + Math.random() * 900000),
          userId: mockUser.id,
          vehicleId: values.vehicleId,
          pickupLocationId: values.pickupBranchId,
          dropLocationId: values.dropBranchId,
          pickupDate: values.pickupDate,
          returnDate: values.returnDate,
          status: BookingStatus.PENDING,
          totalAmount: 3000,
          taxAmount: 540,
          finalAmount: 3540,
          securityDeposit: 5000,
        },
      });

      await tx.bookingTimeline.create({
        data: {
          bookingId: book.id,
          statusChangedTo: BookingStatus.PENDING,
          remarks: "Draft reservation check lock created",
          actionBy: mockUser.id,
        },
      });

      return book;
    });

    return { success: true, bookingId: result.id };
  } catch (err) {
    await releaseLock(values.vehicleId);
    return { success: false, error: "Failed to allocate reservation" };
  }
}

/**
 * Confirms a booking reservation and releases the Redis lock.
 */
export async function confirmBooking(id: string) {
  try {
    const book = await db.booking.findUnique({ where: { id } });
    if (!book) return { success: false, error: "Booking not found" };

    await db.$transaction(async (tx) => {
      await tx.booking.update({
        where: { id },
        data: { status: BookingStatus.CONFIRMED },
      });

      await tx.bookingTimeline.create({
        data: {
          bookingId: id,
          statusChangedTo: BookingStatus.CONFIRMED,
          remarks: "Reservation finalized successfully",
          actionBy: book.userId,
        },
      });
    });

    await releaseLock(book.vehicleId);
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to confirm reservation" };
  }
}

/**
 * Handles extension requests, checking for schedule overrides.
 */
export async function requestExtension(values: ExtensionRequestValues) {
  try {
    const book = await db.booking.findUnique({ where: { id: values.bookingId } });
    if (!book) return { success: false, error: "Booking not found" };

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
          actionBy: book.userId,
        },
      });
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: "Extension request failed" };
  }
}

/**
 * Cancels a booking, logging timelines.
 */
export async function cancelBooking(values: CancellationRequestValues) {
  try {
    const book = await db.booking.findUnique({ where: { id: values.bookingId } });
    if (!book) return { success: false, error: "Booking not found" };

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
          actionBy: book.userId,
        },
      });
    });

    await releaseLock(book.vehicleId);
    return { success: true };
  } catch (error) {
    return { success: false, error: "Cancellation failed" };
  }
}
