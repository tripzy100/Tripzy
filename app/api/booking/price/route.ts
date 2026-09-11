import { NextResponse } from "next/server";
import { calculateAuthoritativePrice } from "@/lib/services/pricing-service";
import { getCurrentUserId } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { vehicleId, pickupDate, returnDate, couponCode } = body;

    if (!vehicleId || !pickupDate || !returnDate) {
      return NextResponse.json(
        { success: false, message: "vehicleId, pickupDate, and returnDate are required" },
        { status: 400 },
      );
    }

    const userId = await getCurrentUserId();

    const result = await calculateAuthoritativePrice({
      vehicleId,
      pickupDate,
      returnDate,
      couponCode,
      userId: userId || undefined,
    });

    if (!result.success) {
      return NextResponse.json({ success: false, message: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, pricing: result.pricing });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to calculate pricing" },
      { status: 500 },
    );
  }
}
