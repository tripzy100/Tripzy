import { NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/supabase";
import { createBookingHold } from "@/lib/services/booking-service";

export async function POST(request: Request) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const { vehicleId, pickupLocationId, dropLocationId, pickupDate, returnDate, couponCode } = body;

    if (!vehicleId || !pickupLocationId || !dropLocationId || !pickupDate || !returnDate) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 },
      );
    }

    const result = await createBookingHold({
      userId,
      vehicleId,
      pickupLocationId,
      dropLocationId,
      pickupDate,
      returnDate,
      couponCode,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.error },
        { status: 400 },
      );
    }

    return NextResponse.json({ success: true, booking: result.booking });
  } catch (error) {
    console.error("Create draft booking error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

