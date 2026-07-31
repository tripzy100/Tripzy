import { NextResponse } from "next/server";
import { verifyEmailOtp } from "@/lib/services/auth-service";
import { verifyOtp } from "@/features/auth/services/otp-service";
import { otpVerifySchema } from "@/lib/services/validation-service";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const identifier = body.email || body.identifier;
    const { otp, type } = body;

    const parsed = otpVerifySchema.safeParse({ identifier, otp, type });
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0]?.message || "Invalid OTP parameters" },
        { status: 400 },
      );
    }

    if (type === "EMAIL_VERIFICATION") {
      const result = await verifyEmailOtp(parsed.data.identifier, parsed.data.otp);
      if (!result.success) {
        return NextResponse.json(result, { status: 400 });
      }

      // Auto sign-in if credentials are provided in verification result
      const cookieStore = await cookies();
      const response = new NextResponse();

      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll() {
              return cookieStore.getAll();
            },
            setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
              cookiesToSet.forEach(({ name, value, options }) => {
                response.cookies.set(name, value, options);
              });
            },
          },
        },
      );

      if (result.credentials) {
        await supabase.auth.signInWithPassword({
          email: result.credentials.email,
          password: result.credentials.password,
        });
      }

      const jsonResponse = NextResponse.json(
        {
          success: true,
          message: result.message,
          user: result.user,
        },
        { status: 200 },
      );

      const setCookies = response.cookies.getAll();
      for (const cookie of setCookies) {
        jsonResponse.cookies.set(cookie.name, cookie.value, cookie);
      }

      return jsonResponse;
    }

    // For PASSWORD_RESET
    const result = await verifyOtp(parsed.data.identifier, parsed.data.otp, parsed.data.type);
    const status = result.success ? 200 : 400;
    return NextResponse.json(result, { status });
  } catch (error: any) {
    console.error("OTP verify API error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
