import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 },
      );
    }

    const supabase = await createRouteHandlerClient();
    const requestUrl = new URL(request.url);
    const origin = requestUrl.origin;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/auth/callback?next=/auth/reset-password`,
    });

    if (error) {
      console.error("Supabase resetPasswordForEmail error:", error);
      return NextResponse.json(
        { success: false, message: error.message || "Failed to send password reset email" },
        { status: 400 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Password reset email sent successfully",
    });
  } catch (error) {
    console.error("Forgot Password API error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
