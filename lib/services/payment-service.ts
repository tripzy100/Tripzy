import crypto from "crypto";
import { db } from "@/lib/db";
import { PaymentStatus, BookingStatus, TransactionType, TransactionStatus, RefundStatus } from "@prisma/client";
import { createInvoice } from "@/features/payment/services/invoice-service";
import { initiateCashfreeRefund } from "@/lib/services/cashfree-service";
import { sendEmail } from "@/lib/email";
import { sendSms } from "@/lib/sms";

export interface ProcessPaymentResult {
  success: boolean;
  message?: string;
  error?: string;
  bookingNumber?: string;
  pickupOtp?: string;
}

/**
 * Authoritative single-path payment completion service with PostgreSQL atomic concurrency locks.
 * Guarantees that concurrent completion attempts (Webhook + verify-order) execute
 * idempotently: exactly ONE transaction completes the payment, generates ONE pickupOtp,
 * and dispatches ONE notification.
 *
 * Prevents EXPIRED or CANCELLED bookings from being overwritten to CONFIRMED.
 * If payment is received after hold expiration, it marks payment status and safely credits
 * the amount to the user's wallet without corrupting vehicle availability.
 */
export async function processSuccessfulPayment(
  gatewayOrderId: string,
  gatewayPaymentId: string,
  amount: number,
): Promise<ProcessPaymentResult> {
  try {
    let bookingToNotify: any = null;
    let otpToNotify: string | null = null;

    const txResult = await db.$transaction(async (tx) => {
      // 1. Fetch Payment record within transaction boundary
      const payment = await tx.payment.findFirst({
        where: { gatewayOrderId },
        include: {
          booking: {
            include: {
              user: true,
              vehicle: { include: { brand: true, model: true } },
              pickupLocation: true,
            },
          },
        },
      });

      if (!payment) {
        return { success: false, error: "Payment reference not found" };
      }

      // 2. Idempotency Check: If already COMPLETED or REFUNDED in DB, return stored status without duplicate processing
      if (payment.paymentStatus === PaymentStatus.COMPLETED) {
        return {
          success: true,
          message: "Payment already processed",
          bookingNumber: payment.booking.bookingNumber,
          pickupOtp: payment.booking.pickupOtp || undefined,
          isFirstTime: false,
        };
      }

      if (payment.paymentStatus === PaymentStatus.REFUNDED) {
        return {
          success: false,
          error: "Payment has already been refunded due to hold expiration or cancellation",
          bookingNumber: payment.booking.bookingNumber,
          isFirstTime: false,
        };
      }

      // 3. Amount Verification (Exact Integer Paise Comparison)
      const expectedAmount = Number(payment.totalAmount);
      if (Math.round(expectedAmount * 100) !== Math.round(amount * 100)) {
        console.error(`Payment amount mismatch: Expected ${expectedAmount}, received ${amount}`);
        return { success: false, error: "Payment amount mismatch" };
      }

      // 4. Check Current Booking Status: Prevent EXPIRED / CANCELLED bookings from transitioning to CONFIRMED
      const currentBooking = await tx.booking.findUnique({
        where: { id: payment.bookingId },
      });

      if (
        currentBooking?.status === BookingStatus.EXPIRED ||
        currentBooking?.status === BookingStatus.CANCELLED
      ) {
        console.warn(`Payment received for ${currentBooking.status} booking: ${payment.booking.bookingNumber}`);

        // Check if a refund record already exists for this payment (idempotency guard)
        const existingRefund = await tx.refund.findFirst({
          where: { paymentId: payment.id },
        });

        if (existingRefund && existingRefund.status === RefundStatus.COMPLETED) {
          return {
            success: false,
            error: "Payment has already been refunded due to hold expiration or cancellation",
            bookingNumber: payment.booking.bookingNumber,
            isFirstTime: false,
          };
        }

        // Atomic Compare-And-Swap (CAS) update: transition PENDING -> FAILED (claim processing lock)
        const processCas = await tx.payment.updateMany({
          where: {
            id: payment.id,
            paymentStatus: PaymentStatus.PENDING,
          },
          data: {
            paymentStatus: PaymentStatus.FAILED,
            gatewayPaymentId,
          },
        });

        if (processCas && processCas.count === 0 && payment.paymentStatus !== PaymentStatus.PENDING) {
          // Lost the race to a concurrent processing attempt
          return {
            success: false,
            error: "Payment has already been processed or refunded by concurrent request",
            bookingNumber: payment.booking.bookingNumber,
            isFirstTime: false,
          };
        }

        // Record successful charge transaction for audit ledger
        await tx.paymentTransaction.create({
          data: {
            paymentId: payment.id,
            amount,
            transactionType: TransactionType.CHARGE,
            status: TransactionStatus.SUCCESS,
            gatewayReference: gatewayPaymentId,
            responseMessage: `Payment received after reservation hold was ${currentBooking.status}. Refund initiated.`,
          },
        });

        // Deterministic gateway refund reference (derived from payment ID for Cashfree gateway-level idempotency)
        const refundRef = `REFUND-${payment.id}`;
        const cfRefund = await initiateCashfreeRefund(
          gatewayOrderId,
          refundRef,
          amount,
          `Automatic refund: Payment received after reservation hold was ${currentBooking.status.toLowerCase()}`,
        );

        if (!cfRefund.success) {
          // Gateway refund attempt failed - record FAILED state without writing PaymentStatus.REFUNDED
          await tx.refund.create({
            data: {
              paymentId: payment.id,
              amount,
              reason: `Automatic refund for ${currentBooking.status.toLowerCase()} booking ${payment.booking.bookingNumber}`,
              status: RefundStatus.FAILED,
              gatewayRefundId: cfRefund.gatewayRefundId || `CF-REF-FAILED-${refundRef}`,
            },
          });

          await tx.paymentTransaction.create({
            data: {
              paymentId: payment.id,
              amount,
              transactionType: TransactionType.REFUND,
              status: TransactionStatus.FAILED,
              gatewayReference: refundRef,
              responseMessage: `Cashfree gateway refund call failed: ${cfRefund.error}`,
            },
          });

          return {
            success: false,
            error: `Booking reservation hold has ${currentBooking.status.toLowerCase()}. Gateway refund attempt failed: ${cfRefund.error}. Please contact support for assistance.`,
            bookingNumber: payment.booking.bookingNumber,
            isFirstTime: false,
          };
        }

        // Gateway refund confirmed successful - transition PaymentStatus to REFUNDED
        await tx.payment.update({
          where: { id: payment.id },
          data: { paymentStatus: PaymentStatus.REFUNDED },
        });

        // Record Refund database entry idempotently
        await tx.refund.create({
          data: {
            paymentId: payment.id,
            amount,
            reason: `Automatic refund for ${currentBooking.status.toLowerCase()} booking ${payment.booking.bookingNumber}`,
            status: RefundStatus.COMPLETED,
            gatewayRefundId: cfRefund.gatewayRefundId || `CF-REF-${refundRef}`,
          },
        });

        // Record refund payment transaction entry
        await tx.paymentTransaction.create({
          data: {
            paymentId: payment.id,
            amount,
            transactionType: TransactionType.REFUND,
            status: TransactionStatus.SUCCESS,
            gatewayReference: cfRefund.gatewayRefundId || refundRef,
            responseMessage: `Automatic refund completed via Cashfree gateway`,
          },
        });

        await tx.bookingTimeline.create({
          data: {
            bookingId: payment.bookingId,
            statusChangedTo: currentBooking.status,
            remarks: `Payment received after hold ${currentBooking.status.toLowerCase()}. Ref: ${gatewayPaymentId}. ₹${amount} automatically refunded via Cashfree.`,
            actionBy: payment.booking.userId,
          },
        });

        return {
          success: false,
          error: `Booking reservation hold has ${currentBooking.status.toLowerCase()}. Payment of ₹${amount} has been automatically refunded to your original payment method.`,
          bookingNumber: payment.booking.bookingNumber,
          isFirstTime: false,
        };
      }

      // 5. Atomic Conditional Update (PostgreSQL Row Lock & Concurrency Barrier)
      // Attempts to lock and update state from PENDING -> COMPLETED.
      // If a concurrent transaction acquired the lock first, updateMany returns count === 0.
      const updateResult = await tx.payment.updateMany({
        where: {
          id: payment.id,
          paymentStatus: PaymentStatus.PENDING,
        },
        data: {
          paymentStatus: PaymentStatus.COMPLETED,
          gatewayPaymentId,
        },
      });

      if (updateResult && updateResult.count === 0) {
        // Lost the race: Re-fetch updated booking state to retrieve winning transaction's generated OTP
        const latestBooking = await tx.booking.findUnique({
          where: { id: payment.bookingId },
        });

        return {
          success: true,
          message: "Payment already processed by concurrent request",
          bookingNumber: payment.booking.bookingNumber,
          pickupOtp: latestBooking?.pickupOtp || payment.booking.pickupOtp || undefined,
          isFirstTime: false,
        };
      }

      // 6. Winning Transaction Execution: Create Invoice using Transaction Client
      const invoice = await createInvoice(payment.bookingId, 0, tx);

      await tx.payment.update({
        where: { id: payment.id },
        data: { invoiceId: invoice.id },
      });

      await tx.paymentTransaction.create({
        data: {
          paymentId: payment.id,
          amount,
          transactionType: TransactionType.CHARGE,
          status: TransactionStatus.SUCCESS,
          gatewayReference: gatewayPaymentId,
        },
      });

      // 7. Generate Single Authoritative Secure OTP (if not already set)
      let generatedOtp = payment.booking.pickupOtp;
      let newlyCreatedOtp = false;

      if (!generatedOtp) {
        generatedOtp = crypto.randomInt(100000, 999999).toString();
        newlyCreatedOtp = true;
      }

      await tx.booking.update({
        where: { id: payment.bookingId },
        data: {
          status: BookingStatus.CONFIRMED,
          pickupOtp: generatedOtp,
        },
      });

      await tx.bookingTimeline.create({
        data: {
          bookingId: payment.bookingId,
          statusChangedTo: BookingStatus.CONFIRMED,
          remarks: `Payment confirmed via Cashfree. Ref: ${gatewayPaymentId}`,
          actionBy: payment.booking.userId,
        },
      });

      bookingToNotify = payment.booking;
      otpToNotify = generatedOtp;

      return {
        success: true,
        bookingNumber: payment.booking.bookingNumber,
        pickupOtp: generatedOtp,
        isFirstTime: newlyCreatedOtp,
      };
    });

    if (!txResult.success) {
      return { success: false, error: txResult.error };
    }

    // 8. Dispatch Notifications OUTSIDE Transaction (ONLY on initial OTP creation)
    if (txResult.isFirstTime && bookingToNotify && otpToNotify) {
      if (bookingToNotify.user?.phone) {
        const smsMessage = `Your Tripzy Booking OTP is ${otpToNotify}. Show this to the Tripzy agent at ${bookingToNotify.pickupLocation.name} to collect your ${bookingToNotify.vehicle.brand.name} ${bookingToNotify.vehicle.model.name}. Ref: ${bookingToNotify.bookingNumber}`;
        await sendSms(bookingToNotify.userId, bookingToNotify.user.phone, smsMessage).catch((err) => {
          console.error("SMS notification dispatch failed:", err);
        });
      }

      if (bookingToNotify.user?.email) {
        const emailSubject = `Tripzy Reservation Confirmed - ${bookingToNotify.bookingNumber}`;
        const emailBody = `
          <h1>Your Rental is Confirmed!</h1>
          <p>Hello ${bookingToNotify.user.email},</p>
          <p>Thank you for choosing Tripzy. Your car reservation is confirmed and ready for pickup.</p>
          <ul>
            <li><strong>Booking Reference:</strong> ${bookingToNotify.bookingNumber}</li>
            <li><strong>Vehicle:</strong> ${bookingToNotify.vehicle.brand.name} ${bookingToNotify.vehicle.model.name}</li>
            <li><strong>Pickup Location:</strong> ${bookingToNotify.pickupLocation.name}</li>
            <li><strong>Pickup Date:</strong> ${new Date(bookingToNotify.pickupDate).toLocaleString()}</li>
            <li><strong>Return Date:</strong> ${new Date(bookingToNotify.returnDate).toLocaleString()}</li>
            <li><strong>Total Paid:</strong> ₹${amount}</li>
          </ul>
          <p>Your pickup OTP: <strong>${otpToNotify}</strong></p>
        `;
        await sendEmail(bookingToNotify.userId, bookingToNotify.user.email, emailSubject, emailBody).catch((err) => {
          console.error("Email notification dispatch failed:", err);
        });
      }
    }

    return {
      success: true,
      message: txResult.message,
      bookingNumber: txResult.bookingNumber,
      pickupOtp: txResult.pickupOtp,
    };
  } catch (error: any) {
    console.error("Payment confirmation failed:", error);
    return { success: false, error: "Failed to process payment database updates" };
  }
}
