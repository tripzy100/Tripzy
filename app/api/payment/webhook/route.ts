import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { webhookPayloadSchema } from "@/features/payment/validators";
import { verifyCashfreeSignature } from "@/features/payment/services/cashfree";
import { processSuccessfulPayment } from "@/features/payment/actions/payment-actions";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = webhookPayloadSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
    }

    const { orderId, signature, amount, txStatus, gatewayPaymentId } = result.data;

    const isValid = verifyCashfreeSignature(orderId, amount, txStatus, signature);
    if (!isValid) {
      return NextResponse.json({ error: "Cryptographic signature mismatch" }, { status: 401 });
    }

    // Database-based idempotency check
    const existingPayment = await db.payment.findFirst({
      where: { gatewayOrderId: orderId },
    });

    if (existingPayment) {
      return NextResponse.json({ success: true, message: "Already processed" });
    }

    if (txStatus === "SUCCESS") {
      const dbResult = await processSuccessfulPayment(orderId, gatewayPaymentId, amount);
      if (!dbResult.success) {
        return NextResponse.json({ error: dbResult.error }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Webhook parsing error" }, { status: 500 });
  }
}
