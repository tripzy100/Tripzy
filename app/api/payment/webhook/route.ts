import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { PaymentStatus } from "@prisma/client";
import { verifyCashfreeWebhookSignature } from "@/lib/services/cashfree-service";
import { processSuccessfulPayment } from "@/lib/services/payment-service";

export async function POST(request: Request) {
  try {
    // 1. Read raw body string BEFORE parsing JSON for cryptographic signature validation (P0-3)
    const rawBody = await request.text();
    const signatureHeader = request.headers.get("x-webhook-signature");
    const timestampHeader = request.headers.get("x-webhook-timestamp");

    let body: any = {};
    try {
      body = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
    }

    const orderId = body.orderId || body.data?.order?.order_id;
    const amount = Number(body.amount || body.data?.payment?.payment_amount);
    const txStatus = body.txStatus || body.data?.payment?.payment_status || body.event;
    const gatewayPaymentId = body.gatewayPaymentId || body.data?.payment?.cf_payment_id || `CF-PAY-${Date.now()}`;
    const fallbackSignature = body.signature;
    const fallbackTimestamp = body.timestamp;

    if (!orderId) {
      return NextResponse.json({ error: "Missing order reference in webhook" }, { status: 400 });
    }

    // 2. Perform HMAC-SHA256 Cryptographic Signature & Replay Timestamp Verification (P0-3 & P0-4)
    const verification = verifyCashfreeWebhookSignature(
      rawBody,
      signatureHeader,
      timestampHeader,
      fallbackSignature,
      fallbackTimestamp,
      orderId,
      amount,
      txStatus,
    );

    if (!verification.isValid) {
      const reason = verification.reason || "Invalid signature";
      console.warn(`Webhook signature verification failed: ${reason}`);
      return NextResponse.json({ error: `Webhook authorization failed: ${reason}` }, { status: 401 });
    }

    // 3. Find payment record in local database
    const existingPayment = await db.payment.findFirst({
      where: { gatewayOrderId: orderId },
    });

    if (!existingPayment) {
      return NextResponse.json({ error: "Payment order reference not found" }, { status: 404 });
    }

    // 4. Idempotency Check: If already COMPLETED or REFUNDED, return 200 without duplicate side effects (P0-6)
    if (
      existingPayment.paymentStatus === PaymentStatus.COMPLETED ||
      existingPayment.paymentStatus === PaymentStatus.REFUNDED
    ) {
      return NextResponse.json({ success: true, message: `Payment order already processed (${existingPayment.paymentStatus})` });
    }

    // 5. Handle Failed / Cancelled webhook events (P0-5)
    const isSuccess = txStatus === "SUCCESS" || txStatus === "PAYMENT_SUCCESS" || txStatus === "PAID";
    if (!isSuccess) {
      await db.payment.update({
        where: { id: existingPayment.id },
        data: { paymentStatus: PaymentStatus.FAILED },
      });
      return NextResponse.json({ success: true, message: `Payment recorded as ${txStatus}` });
    }

    // 6. Amount Verification (Exact Integer Paise Comparison)
    const expectedAmount = Number(existingPayment.totalAmount);
    if (!isNaN(amount) && Math.round(expectedAmount * 100) !== Math.round(amount * 100)) {
      console.error(`Webhook amount discrepancy: expected ${expectedAmount}, got ${amount}`);
      return NextResponse.json({ error: "Payment amount mismatch" }, { status: 400 });
    }

    // 7. Process successful payment & transition booking state
    const processRes = await processSuccessfulPayment(orderId, String(gatewayPaymentId), expectedAmount);

    if (!processRes.success) {
      return NextResponse.json({ error: processRes.error }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Webhook processed successfully" });
  } catch (error: any) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ error: "Internal server error processing webhook" }, { status: 500 });
  }
}
