import { NextResponse } from "next/server";

/**
 * Direct client-initiated payment completion endpoint is disabled for payment security (P0-1).
 * All payments must be verified authoritatively via Cashfree Webhook or /api/payment/verify-order.
 */
export async function POST() {
  return NextResponse.json(
    {
      success: false,
      message:
        "Direct client payment completion is disabled for security reasons. Payments are confirmed authoritatively via Cashfree gateway webhooks.",
    },
    { status: 403 },
  );
}
