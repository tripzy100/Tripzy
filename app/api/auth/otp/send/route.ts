import { NextResponse } from "next/server";
import { sendOtp } from "@/features/auth/services/otp-service";
import { otpSendSchema } from "@/lib/services/validation-service";
import { resendVerificationCode } from "@/lib/services/auth-service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Support either email or identifier
    const identifier = body.email || body.identifier;
    const type = body.type || "EMAIL_VERIFICATION";

    const parsed = otpSendSchema.safeParse({ identifier, type });
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0]?.message || "Invalid input parameters" },
        { status: 400 },
      );
    }

    if (type === "EMAIL_VERIFICATION") {
      const res = await resendVerificationCode(parsed.data.identifier);
      const status = res.success ? 200 : 400;
      return NextResponse.json(res, { status });
    }

    const result = await sendOtp(parsed.data.identifier, parsed.data.type);
    const status = result.success ? 200 : 429;
    return NextResponse.json(result, { status });
  } catch (error) {
    console.error("OTP send error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
