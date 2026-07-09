import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUserId } from "@/lib/supabase";
import { BookingStatus } from "@prisma/client";

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
    const { vehicleId, pickupLocationId, dropLocationId, pickupDate, returnDate } = body;

    if (!vehicleId || !pickupLocationId || !dropLocationId || !pickupDate || !returnDate) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 },
      );
    }

    const vehicle = await db.vehicle.findUnique({
      where: { id: vehicleId },
      include: { pricings: true },
    });

    if (!vehicle) {
      return NextResponse.json(
        { success: false, message: "Vehicle not found" },
        { status: 404 },
      );
    }

    const pDate = new Date(pickupDate);
    const rDate = new Date(returnDate);
    const timeDiff = rDate.getTime() - pDate.getTime();
    const days = Math.max(1, Math.ceil(timeDiff / (1000 * 3600 * 24)));

    const pricing = vehicle.pricings[0];
    const dailyRate = pricing ? Number(pricing.dailyRate) : 2500;
    const baseDeposit = pricing ? Number(pricing.securityDeposit) : 5000;
    const taxRate = pricing ? Number(pricing.taxRate) / 100 : 0.18;

    const totalAmount = dailyRate * days;
    const taxAmount = totalAmount * taxRate;
    const finalAmount = totalAmount + taxAmount;
    const securityDeposit = baseDeposit;

    const booking = await db.booking.create({
      data: {
        bookingNumber: "BK-" + Math.floor(100000 + Math.random() * 900000),
        userId,
        vehicleId,
        pickupLocationId,
        dropLocationId,
        pickupDate: pDate,
        returnDate: rDate,
        status: BookingStatus.PENDING,
        totalAmount,
        taxAmount,
        finalAmount,
        securityDeposit,
      },
    });

    return NextResponse.json({ success: true, booking });
  } catch (error) {
    console.error("Create draft booking error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
