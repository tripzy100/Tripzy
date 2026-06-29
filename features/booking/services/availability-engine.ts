import { db } from "@/lib/db";
import { BookingStatus } from "@prisma/client";

/**
 * Checks if a vehicle has any schedule overlaps with existing active bookings,
 * including a 3-hour buffer for cleaning and safety inspection.
 */
export async function checkVehicleAvailability(
  vehicleId: string,
  pickupDate: Date,
  returnDate: Date
): Promise<boolean> {
  // Apply a 3-hour buffer to pickup and return windows
  const BUFFER_MS = 3 * 60 * 60 * 1000;
  const startWithBuffer = new Date(pickupDate.getTime() - BUFFER_MS);
  const endWithBuffer = new Date(returnDate.getTime() + BUFFER_MS);

  // Check if any overlapping bookings exist
  const overlaps = await db.booking.findFirst({
    where: {
      vehicleId,
      status: {
        in: [
          BookingStatus.CONFIRMED,
          BookingStatus.ONGOING,
          BookingStatus.PENDING,
        ],
      },
      OR: [
        {
          // Existing booking starts during the new request
          pickupDate: { gte: startWithBuffer, lte: endWithBuffer },
        },
        {
          // Existing booking ends during the new request
          returnDate: { gte: startWithBuffer, lte: endWithBuffer },
        },
        {
          // Existing booking spans across the new request entirely
          pickupDate: { lte: startWithBuffer },
          returnDate: { gte: endWithBuffer },
        },
      ],
    },
  });

  return !overlaps;
}

/**
 * Validates that requested pickup and return hours fall inside standard office timings.
 */
export function isValidBusinessHours(pickup: Date, returnD: Date): boolean {
  const pickupHour = pickup.getHours();
  const returnHour = returnD.getHours();
  // Standard operational window: 07:00 AM to 11:00 PM
  return pickupHour >= 7 && pickupHour <= 23 && returnHour >= 7 && returnHour <= 23;
}
