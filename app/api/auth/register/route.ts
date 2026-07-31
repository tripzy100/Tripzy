import { NextResponse } from "next/server";
import { registerUser } from "@/lib/services/auth-service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await registerUser(body);
    const status = result.success ? 200 : 400;
    return NextResponse.json(result, { status });
  } catch (error: any) {
    console.error("Registration API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error during registration." },
      { status: 500 },
    );
  }
}
