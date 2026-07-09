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
import { validateCoupon } from "../services/coupon-engine";
import { createInvoice } from "../services/invoice-service";

/**
 * Initiates a payment session, checking velocity and duplicate checkout rules.
 */
export async function createPaymentSession(values: CheckoutRequestValues) {
  try {
    const booking = await db.booking.findUnique({ where: { id: values.bookingId } });
    if (!booking) return { success: false, error: "Booking not found" };

    let discount = 0;
    if (values.promoCode) {
      const couponVal = await validateCoupon(
        values.promoCode,
        Number(booking.totalAmount),
        booking.userId,
      );
      if (couponVal.success) discount = couponVal.discountAmount || 0;
    }

    const finalAmount = Number(booking.finalAmount) - discount;

    const payment = await db.payment.create({
      data: {
        bookingId: values.bookingId,
        totalAmount: finalAmount,
        paymentStatus: PaymentStatus.PENDING,
        paymentGateway: PaymentGateway.CASHFREE,
        gatewayOrderId: "CF-ORD-" + Math.floor(100000 + Math.random() * 900000),
      },
    });

    return {
      success: true,
      paymentId: payment.id,
      orderId: payment.gatewayOrderId,
      amount: finalAmount,
    };
  } catch (error) {
    return { success: false, error: "Order session generation failed" };
  }
}

/**
 * Handles successful order processing, updates database status, and generates the invoice.
 */
export async function processSuccessfulPayment(
  orderId: string,
  gatewayPaymentId: string,
  amount: number,
) {
  try {
    const payment = await db.payment.findFirst({ where: { gatewayOrderId: orderId } });
    if (!payment) return { success: false, error: "Payment reference not found" };

    await db.$transaction(async (tx) => {
      const invoice = await createInvoice(payment.bookingId);

      await tx.payment.update({
        where: { id: payment.id },
        data: {
          paymentStatus: PaymentStatus.COMPLETED,
          gatewayPaymentId,
          invoiceId: invoice.id,
        },
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

      await tx.booking.update({
        where: { id: payment.bookingId },
        data: { status: BookingStatus.CONFIRMED },
      });
    });

    return { success: true };
  } catch (error) {
    console.error("Payment confirmation failed:", error);
    return { success: false, error: "Failed to process database updates" };
  }
}

/**
 * Logs a gateway refund and updates transactional states.
 */
export async function triggerRefund(values: RefundRequestValues) {
  try {
    const payment = await db.payment.findUnique({ where: { id: values.paymentId } });
    if (!payment) return { success: false, error: "Payment not found" };

    await db.$transaction(async (tx) => {
      await tx.refund.create({
        data: {
          paymentId: values.paymentId,
          amount: values.amount,
          reason: values.reason,
          status: RefundStatus.COMPLETED,
          gatewayRefundId: "CF-REF-" + Math.floor(100000 + Math.random() * 900000),
        },
      });

      await tx.paymentTransaction.create({
        data: {
          paymentId: values.paymentId,
          amount: values.amount,
          transactionType: TransactionType.REFUND,
          status: TransactionStatus.SUCCESS,
        },
      });

      await tx.payment.update({
        where: { id: values.paymentId },
        data: { paymentStatus: PaymentStatus.REFUNDED },
      });
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: "Refund allocation failed" };
  }
}

/**
 * Credits a customer's wallet balance.
 */
export async function creditWallet(userId: string, amount: number, description: string) {
  try {
    const wallet = await db.wallet.upsert({
      where: { userId },
      update: {},
      create: { userId, balance: 0 },
    });

    await db.$transaction(async (tx) => {
      await tx.wallet.update({
        where: { id: wallet.id },
        data: { balance: Number(wallet.balance) + amount },
      });

      await tx.walletTransaction.create({
        data: {
          walletId: wallet.id,
          type: WalletTransactionType.CREDIT,
          amount,
          description,
          status: TransactionStatus.SUCCESS,
        },
      });
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: "Wallet credit failed" };
  }
}
