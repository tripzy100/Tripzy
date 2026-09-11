import { NextResponse } from "next/server";
import { checkoutRequestSchema } from "@/features/payment/validators";
import { createPaymentSession } from "@/features/payment/actions/payment-actions";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = checkoutRequestSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
    }

    const session = await createPaymentSession(result.data);
    if (!session || !session.success) {
      return NextResponse.json({ error: session?.error || "Payment session generation failed" }, { status: 400 });
    }

    return NextResponse.json(session);
  } catch {
    return NextResponse.json({ error: "Checkout initialization failure" }, { status: 500 });
  }
}
