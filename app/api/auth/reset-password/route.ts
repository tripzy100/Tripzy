import { NextResponse } from "next/server";
import { resetPassword } from "@/lib/services/auth-service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = body.email;
    const otp = body.otp;
    const newPassword = body.newPassword || body.password;
    const confirmPassword = body.confirmPassword || newPassword;

    const result = await resetPassword({
      email,
      otp,
      newPassword,
      confirmPassword,
    });

    const status = result.success ? 200 : 400;
    return NextResponse.json(result, { status });
  } catch (error: any) {
    console.error("Reset password API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error during password reset." },
      { status: 500 },
    );
  }
}
