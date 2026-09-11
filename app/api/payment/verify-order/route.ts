import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUserId } from "@/lib/supabase";
import { PaymentStatus, BookingStatus } from "@prisma/client";
import { fetchCashfreeOrderStatus } from "@/lib/services/cashfree-service";
import { processSuccessfulPayment } from "@/lib/services/payment-service";

export async function GET(request: Request) {
  try {
    // 1. Authenticate User
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    // 2. Extract orderId query parameter
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("orderId");

    if (!orderId) {
      return NextResponse.json({ success: false, message: "orderId is required" }, { status: 400 });
    }

    // 3. Find payment record by server gatewayOrderId
    const payment = await db.payment.findFirst({
      where: { gatewayOrderId: orderId },
      include: {
        booking: {
          include: {
            vehicle: { include: { brand: true, model: true } },
            pickupLocation: true,
          },
        },
      },
    });

    if (!payment) {
      return NextResponse.json({ success: false, message: "Order reference not found" }, { status: 404 });
    }

    // 4. IDOR Check: Ensure booking belongs to authenticated user
    if (payment.booking.userId !== userId) {
      return NextResponse.json({ success: false, message: "Unauthorized access to order" }, { status: 403 });
    }

    // 5. If already COMPLETED or REFUNDED in DB, return stored state idempotently
    if (payment.paymentStatus === PaymentStatus.COMPLETED && payment.booking.status === BookingStatus.CONFIRMED) {
      return NextResponse.json({
        success: true,
        status: "COMPLETED",
        bookingNumber: payment.booking.bookingNumber,
        pickupOtp: payment.booking.pickupOtp || undefined,
        amountPaid: Number(payment.totalAmount),
      });
    }

    if (payment.paymentStatus === PaymentStatus.REFUNDED) {
      return NextResponse.json({
        success: false,
        status: "REFUNDED",
        message: "Payment has been automatically refunded to original payment method",
        bookingNumber: payment.booking.bookingNumber,
      });
    }

    // 6. Authoritative Server-to-Server Cashfree API verification
    if (payment.paymentStatus === PaymentStatus.PENDING) {
      const cfRes = await fetchCashfreeOrderStatus(orderId);

      if (cfRes.success && (cfRes.orderStatus === "PAID" || cfRes.paymentStatus === "SUCCESS")) {
        const expectedAmount = Number(payment.totalAmount);
        const actualAmount = cfRes.amount ?? expectedAmount;

        if (Math.round(expectedAmount * 100) === Math.round(actualAmount * 100)) {
          const gatewayPaymentId = cfRes.gatewayPaymentId || `CF-PAY-${orderId}`;
          const processRes = await processSuccessfulPayment(orderId, gatewayPaymentId, expectedAmount);

          if (processRes.success) {
            return NextResponse.json({
              success: true,
              status: "COMPLETED",
              bookingNumber: payment.booking.bookingNumber,
              pickupOtp: processRes.pickupOtp,
              amountPaid: expectedAmount,
            });
          }
        }
      } else if (cfRes.success && (cfRes.orderStatus === "EXPIRED" || cfRes.paymentStatus === "FAILED" || cfRes.paymentStatus === "CANCELLED")) {
        await db.payment.update({
          where: { id: payment.id },
          data: { paymentStatus: PaymentStatus.FAILED },
        });

        return NextResponse.json({
          success: true,
          status: "FAILED",
          message: "Payment failed at gateway",
          bookingNumber: payment.booking.bookingNumber,
        });
      }
    }

    return NextResponse.json({
      success: true,
      status: payment.paymentStatus,
      bookingNumber: payment.booking.bookingNumber,
    });
  } catch (error: any) {
    console.error("Verify order error:", error);
    return NextResponse.json({ success: false, message: "Failed to verify order" }, { status: 500 });
  }
}
