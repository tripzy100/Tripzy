import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json(
        { success: false, message: "Password is required" },
        { status: 400 },
      );
    }

    const supabase = await createRouteHandlerClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      console.error("Supabase update password error:", error);
      return NextResponse.json(
        { success: false, message: error.message || "Failed to update password" },
        { status: 400 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Reset Password API error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
