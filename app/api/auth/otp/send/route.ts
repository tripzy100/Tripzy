import { NextResponse } from "next/server";
import { sendOtp } from "@/features/auth/services/otp-service";
import { OtpType } from "@prisma/client";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { identifier, type } = body;

    if (!identifier || !type) {
      return NextResponse.json(
        { success: false, message: "Missing identifier or type" },
        { status: 400 },
      );
    }

    if (!Object.values(OtpType).includes(type)) {
      return NextResponse.json({ success: false, message: "Invalid OTP type" }, { status: 400 });
    }

    if (type === "PHONE_VERIFICATION" && !/^\+?\d{10,15}$/.test(identifier)) {
      return NextResponse.json(
        { success: false, message: "Invalid phone number format" },
        { status: 400 },
      );
    }

    if (type === "EMAIL_VERIFICATION" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier)) {
      return NextResponse.json(
        { success: false, message: "Invalid email format" },
        { status: 400 },
      );
    }

    const existingUser = await import("@/lib/db").then(({ db }) =>
      db.user.findFirst({
        where: {
          OR: [
            ...(type === "PHONE_VERIFICATION" ? [{ phone: identifier }] : []),
            ...(type === "EMAIL_VERIFICATION" ? [{ email: identifier }] : []),
          ],
        },
      }),
    );

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "An account with this identifier already exists" },
        { status: 409 },
      );
    }

    const result = await sendOtp(identifier, type);
    const status = result.success ? 200 : 429;
    return NextResponse.json(result, { status });
  } catch (error) {
    console.error("OTP send error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
