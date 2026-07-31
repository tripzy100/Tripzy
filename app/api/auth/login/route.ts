import { NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { loginSchema } from "@/lib/services/validation-service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 },
      );
    }

    const { email, password } = parsed.data;

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

    // 1. Authenticate with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData.user) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 },
      );
    }

    // 2. Check email verification status in Prisma DB
    const dbUser = await db.user.findUnique({
      where: { email },
    });

    if (dbUser && !dbUser.emailVerified) {
      // Prevent login for unverified users and sign out Supabase session
      await supabase.auth.signOut();
      return NextResponse.json(
        {
          success: false,
          requiresVerification: true,
          message: "Please verify your email before logging in.",
          email,
        },
        { status: 403 },
      );
    }

    const jsonResponse = NextResponse.json({
      success: true,
      message: "Signed in successfully",
      user: {
        id: authData.user.id,
        email: authData.user.email,
        name: dbUser?.email,
      },
    });

    // Forward Supabase Auth session cookies to response
    const setCookies = response.cookies.getAll();
    for (const cookie of setCookies) {
      jsonResponse.cookies.set(cookie.name, cookie.value, cookie);
    }

    return jsonResponse;
  } catch (error: any) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
