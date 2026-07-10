import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@/lib/supabase";

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get("code");
    const next = requestUrl.searchParams.get("next") || "/dashboard";

    if (code) {
      const supabase = await createRouteHandlerClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        return NextResponse.redirect(new URL(next, request.url));
      }
      console.error("Auth callback exchange error:", error);
    }

    // If exchange fails, redirect to login page with error
    return NextResponse.redirect(new URL("/auth/login?error=Invalid session code", request.url));
  } catch (error) {
    console.error("Callback route error:", error);
    return NextResponse.redirect(new URL("/auth/login?error=Server callback error", request.url));
  }
}
