import { z } from "zod";

export const bookingRequestSchema = z
  .object({
    vehicleId: z.string().uuid("Vehicle ID must be a valid UUID"),
    pickupBranchId: z.string().uuid("Pickup branch must be a valid UUID"),
    dropBranchId: z.string().uuid("Drop branch must be a valid UUID"),
    pickupDate: z.coerce.date().refine((d) => d > new Date(), {
      message: "Pickup date must be in the future",
    }),
    returnDate: z.coerce.date(),
  })
  .refine((data) => data.returnDate > data.pickupDate, {
    message: "Return date must be after pickup date",
    path: ["returnDate"],
  });

export type BookingRequestValues = z.infer<typeof bookingRequestSchema>;

export const extensionRequestSchema = z.object({
  bookingId: z.string().uuid("Booking ID must be a valid UUID"),
  extraDays: z.number().int().positive("Extension duration must be positive"),
});

export type ExtensionRequestValues = z.infer<typeof extensionRequestSchema>;

export const cancellationRequestSchema = z.object({
  bookingId: z.string().uuid("Booking ID must be a valid UUID"),
  reason: z.string().min(5, "Cancellation reason must specify at least 5 characters"),
});

export type CancellationRequestValues = z.infer<typeof cancellationRequestSchema>;
