import { z } from "zod";

export const checkoutRequestSchema = z.object({
  bookingId: z.string().uuid("Booking ID must be a valid UUID"),
  promoCode: z.string().optional(),
  paymentMethod: z.enum(["UPI", "CREDIT_CARD", "DEBIT_CARD", "NET_BANKING", "COD"]),
});

export type CheckoutRequestValues = z.infer<typeof checkoutRequestSchema>;

export const webhookPayloadSchema = z.object({
  orderId: z.string().min(1, "Order ID is required"),
  gatewayPaymentId: z.string().min(1, "Gateway Payment ID is required"),
  txStatus: z.enum(["SUCCESS", "FAILED", "PENDING"]),
  signature: z.string().min(1, "Signature hash is required"),
  amount: z.coerce.number().positive(),
});

export type WebhookPayloadValues = z.infer<typeof webhookPayloadSchema>;

export const refundRequestSchema = z.object({
  paymentId: z.string().uuid("Payment ID must be a valid UUID"),
  amount: z.coerce.number().positive("Refund amount must be positive"),
  reason: z.string().min(5, "Refund reason must specify at least 5 characters"),
});

export type RefundRequestValues = z.infer<typeof refundRequestSchema>;
