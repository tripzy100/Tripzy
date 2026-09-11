"use server";

import { db } from "@/lib/db";
import {
  PaymentStatus,
  PaymentGateway,
  TransactionType,
  TransactionStatus,
  RefundStatus,
  WalletTransactionType,
  BookingStatus,
} from "@prisma/client";
import { CheckoutRequestValues, RefundRequestValues } from "../validators";
import { createInvoice } from "../services/invoice-service";
import { calculateAuthoritativePrice } from "@/lib/services/pricing-service";
import { getCurrentUserId } from "@/lib/supabase";
import { processSuccessfulPayment as processSuccessfulPaymentInternal } from "@/lib/services/payment-service";

import crypto from "crypto";
import { requireAuth, requireAdmin } from "@/lib/auth-utils";
import { initiateCashfreeRefund } from "@/lib/services/cashfree-service";

/**
 * Initiates a payment session, calculating authoritative server prices.
 * Supports Cashfree online payment methods (UPI, Cards, Netbanking) and Cash on Delivery (COD).
 */
export async function createPaymentSession(values: CheckoutRequestValues) {
  try {
    const authenticatedUserId = await getCurrentUserId();
    if (!authenticatedUserId) {
      return { success: false, error: "Unauthorized" };
    }

    const booking = await db.booking.findUnique({ where: { id: values.bookingId } });
    if (!booking) return { success: false, error: "Booking not found" };

    if (booking.userId !== authenticatedUserId) {
      return { success: false, error: "Unauthorized access to booking" };
    }

    if (booking.status === BookingStatus.EXPIRED || booking.status === BookingStatus.CANCELLED) {
      return { success: false, error: "Booking hold has expired or was cancelled" };
    }

    const priceResult = await calculateAuthoritativePrice({
      vehicleId: booking.vehicleId,
      pickupDate: booking.pickupDate,
      returnDate: booking.returnDate,
      couponCode: values.promoCode,
      userId: booking.userId,
    });

    if (!priceResult.success) {
      return { success: false, error: priceResult.error };
    }

    const finalAmount = priceResult.pricing.finalAmount;

    // Handle COD (Pay at Pickup) Flow
    if (values.paymentMethod === "COD") {
      const existingCodPayment = await db.payment.findFirst({
        where: { bookingId: values.bookingId, paymentGateway: PaymentGateway.COD },
      });

      let paymentId = existingCodPayment?.id;

      if (!existingCodPayment) {
        const codPayment = await db.payment.create({
          data: {
            bookingId: values.bookingId,
            totalAmount: finalAmount,
            paymentStatus: PaymentStatus.PENDING,
            paymentGateway: PaymentGateway.COD,
            gatewayOrderId: null,
          },
        });
        paymentId = codPayment.id;
      }

      // Generate single authoritative secure OTP for COD pickup
      let generatedOtp = booking.pickupOtp;
      if (!generatedOtp) {
        generatedOtp = crypto.randomInt(100000, 999999).toString();
      }

      // Transition booking to CONFIRMED for COD
      await db.booking.update({
        where: { id: values.bookingId },
        data: {
          status: BookingStatus.CONFIRMED,
          pickupOtp: generatedOtp,
        },
      });

      await db.bookingTimeline.create({
        data: {
          bookingId: values.bookingId,
          statusChangedTo: BookingStatus.CONFIRMED,
          remarks: "Reservation confirmed under Pay at Pickup (COD) policy. Payment due at pickup.",
          actionBy: authenticatedUserId,
        },
      });

      return {
        success: true,
        paymentId: paymentId!,
        isCod: true,
        amount: finalAmount,
        bookingNumber: booking.bookingNumber,
        pickupOtp: generatedOtp,
        message: "Reservation confirmed! Payment of ₹" + finalAmount + " is due at vehicle pickup.",
      };
    }

    // Cashfree Online Payment Flow
    // Check if an existing PENDING payment exists for this booking
    const existingPayment = await db.payment.findFirst({
      where: { bookingId: values.bookingId, paymentStatus: PaymentStatus.PENDING, paymentGateway: PaymentGateway.CASHFREE },
      orderBy: { createdAt: "desc" },
    });

    if (existingPayment && existingPayment.gatewayOrderId) {
      return {
        success: true,
        paymentId: existingPayment.id,
        orderId: existingPayment.gatewayOrderId,
        amount: Number(existingPayment.totalAmount),
      };
    }

    const orderId = "CF-ORD-" + Date.now() + "-" + Math.floor(1000 + Math.random() * 9000);
    const payment = await db.payment.create({
      data: {
        bookingId: values.bookingId,
        totalAmount: finalAmount,
        paymentStatus: PaymentStatus.PENDING,
        paymentGateway: PaymentGateway.CASHFREE,
        gatewayOrderId: orderId,
      },
    });

    return {
      success: true,
      paymentId: payment.id,
      orderId: payment.gatewayOrderId,
      amount: finalAmount,
    };
  } catch (error) {
    console.error("Payment session generation error:", error);
    return { success: false, error: "Payment session generation failed" };
  }
}

/**
 * Authoritatively marks order as COMPLETED upon Cashfree verification / Webhook confirmation.
 * Verifies exact payment amount before transitioning booking to CONFIRMED.
 */
export async function processSuccessfulPayment(
  orderId: string,
  gatewayPaymentId: string,
  amount: number,
) {
  return processSuccessfulPaymentInternal(orderId, gatewayPaymentId, amount);
}

/**
 * Logs a gateway refund and updates transactional states authoritatively.
 * Enforces server-side authentication, user/admin authorization, and database-level refund idempotency.
 */
export async function triggerRefund(values: RefundRequestValues) {
  try {
    const authenticatedUserId = await requireAuth();

    const payment = await db.payment.findUnique({
      where: { id: values.paymentId },
      include: {
        booking: {
          select: { userId: true, bookingNumber: true },
        },
      },
    });

    if (!payment) return { success: false, error: "Payment reference not found" };

    // Check authorization: User must own the booking OR have ADMIN role
    const isOwner = payment.booking.userId === authenticatedUserId;
    let isAdmin = false;
    if (!isOwner) {
      try {
        await requireAdmin();
        isAdmin = true;
      } catch {
        return { success: false, error: "Unauthorized access to payment refund" };
      }
    }

    // Idempotency check: Check if refund already exists for this payment
    const existingRefund = await db.refund.findFirst({
      where: { paymentId: values.paymentId },
    });

    if (existingRefund) {
      return {
        success: true,
        message: "Refund already processed for this payment",
        refundId: existingRefund.id,
        status: existingRefund.status,
      };
    }

    const refundRef = `REFUND-MAN-${values.paymentId}`;
    const gatewayOrderId = payment.gatewayOrderId || `CF-ORD-${payment.id}`;

    // Call Cashfree Refund API if online payment
    let cfRefundId = `CF-REF-${refundRef}`;
    if (payment.paymentGateway === PaymentGateway.CASHFREE && payment.gatewayOrderId) {
      const cfRes = await initiateCashfreeRefund(
        payment.gatewayOrderId,
        refundRef,
        values.amount,
        values.reason,
      );
      if (!cfRes.success) {
        return { success: false, error: cfRes.error || "Cashfree refund processing failed" };
      }
      if (cfRes.gatewayRefundId) {
        cfRefundId = cfRes.gatewayRefundId;
      }
    }

    await db.$transaction(async (tx) => {
      await tx.refund.create({
        data: {
          paymentId: values.paymentId,
          amount: values.amount,
          reason: values.reason,
          status: RefundStatus.COMPLETED,
          gatewayRefundId: cfRefundId,
        },
      });

      await tx.paymentTransaction.create({
        data: {
          paymentId: values.paymentId,
          amount: values.amount,
          transactionType: TransactionType.REFUND,
          status: TransactionStatus.SUCCESS,
          gatewayReference: cfRefundId,
          responseMessage: values.reason,
        },
      });

      await tx.payment.update({
        where: { id: values.paymentId },
        data: { paymentStatus: PaymentStatus.REFUNDED },
      });
    });

    return { success: true, message: "Refund completed successfully", refundId: cfRefundId };
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN") {
      return { success: false, error: "Unauthorized refund request" };
    }
    console.error("Trigger refund error:", error);
    return { success: false, error: "Refund allocation failed" };
  }
}

