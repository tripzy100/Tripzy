import { NextResponse } from "next/server";
import { checkoutRequestSchema } from "@/features/payment/validators";
import { createPaymentSession } from "@/features/payment/actions/payment-actions";
import { verifyIdempotency } from "@/features/payment/services/idempotency";

export async function POST(request: Request) {
  try {
    // Read and verify Idempotency header key
    const idempotencyKey = request.headers.get("x-idempotency-key");
    if (idempotencyKey) {
      const isFresh = await verifyIdempotency(idempotencyKey);
      if (!isFresh) {
        return NextResponse.json({ error: "Duplicate checkout request detected" }, { status: 409 });
      }
    }

    const body = await request.json();
    const result = checkoutRequestSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
    }

    const session = await createPaymentSession(result.data);
    if (!session.success) {
      return NextResponse.json({ error: session.error }, { status: 400 });
    }

    return NextResponse.json(session);
  } catch {
    return NextResponse.json({ error: "Checkout initialization failure" }, { status: 500 });
  }
}
export type CheckoutApiRouteType = typeof POST;
