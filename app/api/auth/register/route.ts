import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createServiceClient } from "@/lib/supabase";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, password } = body;

    if (!name || !email || !phone || !password) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 },
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { success: false, message: "Password must be at least 8 characters" },
        { status: 400 },
      );
    }

    const existingUser = await db.user.findFirst({
      where: { OR: [{ email }, { phone }] },
    });

    if (existingUser) {
      const field = existingUser.email === email ? "email" : "phone";
      return NextResponse.json(
        { success: false, message: `An account with this ${field} already exists` },
        { status: 409 },
      );
    }

    const otpRecord = await db.otpCode.findFirst({
      where: {
        identifier: phone,
        type: "PHONE_VERIFICATION",
        verifiedAt: { not: null },
        deletedAt: null,
      },
      orderBy: { createdAt: "desc" },
    });

    if (!otpRecord) {
      return NextResponse.json(
        { success: false, message: "Phone number not verified. Please verify OTP first." },
        { status: 403 },
      );
    }

    const supabaseAdmin = createServiceClient();
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name, role: "USER" },
    });

    if (authError || !authData.user) {
      return NextResponse.json(
        { success: false, message: authError?.message || "Failed to create account" },
        { status: 400 },
      );
    }

    const user = await db.user.create({
      data: {
        id: authData.user.id,
        email,
        passwordHash: "",
        phone,
        phoneVerified: true,
        emailVerified: true,
        status: "ACTIVE",
        profile: {
          create: {
            firstName: name.split(" ")[0] || name,
            lastName: name.split(" ").slice(1).join(" ") || "",
          },
        },
      },
    });

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

    await supabase.auth.signInWithPassword({ email, password });

    const jsonResponse = NextResponse.json({
      success: true,
      message: "Account created successfully",
      user: { id: user.id, email: user.email, phone: user.phone },
    });

    const setCookies = response.cookies.getAll();
    for (const cookie of setCookies) {
      jsonResponse.cookies.set(cookie.name, cookie.value, cookie);
    }

    return jsonResponse;
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
