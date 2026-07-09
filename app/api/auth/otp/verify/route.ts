import { NextResponse } from "next/server";
import { verifyOtp } from "@/features/auth/services/otp-service";
import { OtpType } from "@prisma/client";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { identifier, otp, type } = body;

    if (!identifier || !otp || !type) {
      return NextResponse.json(
        { success: false, message: "Missing identifier, otp, or type" },
        { status: 400 },
      );
    }

    if (!Object.values(OtpType).includes(type)) {
      return NextResponse.json({ success: false, message: "Invalid OTP type" }, { status: 400 });
    }

    if (!/^\d{6}$/.test(otp)) {
      return NextResponse.json(
        { success: false, message: "OTP must be a 6-digit number" },
        { status: 400 },
      );
    }

    const result = await verifyOtp(identifier, otp, type);
    const status = result.success ? 200 : 400;
    return NextResponse.json(result, { status });
  } catch (error) {
    console.error("OTP verify error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
