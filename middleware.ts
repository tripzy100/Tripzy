import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createMiddlewareClient } from "@/lib/supabase";
import { checkRateLimit } from "@/lib/rate-limit";

const PUBLIC_ROUTES = [
  "/", "/cars", "/bookings", "/cities", "/packages", "/support",
  "/vehicles", "/privacy", "/terms", "/cancellation", "/security",
  "/airports", "/auth/login", "/auth/register", "/auth/forgot-password", "/auth/reset-password", "/auth/callback", "/maintenance", "/error",
];
const ADMIN_ROUTES = ["/admin"];

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const ips = forwarded.split(",").map((ip) => ip.trim());
    return ips[ips.length - 1] || "127.0.0.1";
  }
  return request.headers.get("x-real-ip") || "127.0.0.1";
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ip = getClientIp(request);

  // 1. Rate limiting
  const isApi = pathname.startsWith("/api");
  if (isApi) {
    const isAuthApi = pathname.startsWith("/api/auth");
    const limit = isAuthApi ? 10 : 60;
    const { allowed, remaining } = checkRateLimit(ip, limit, 60000);
    if (!allowed) {
      return new NextResponse(JSON.stringify({ error: "Too many requests" }), {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": "60",
          "X-RateLimit-Limit": String(limit),
          "X-RateLimit-Remaining": String(remaining),
        },
      });
    }
  }

  // 2. Authentication & RBAC
  const isStaticAsset = pathname.startsWith("/_next") || pathname.startsWith("/favicon");
  const isPublic = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/"),
  );

  if (isStaticAsset) {
    return NextResponse.next();
  }

  // Create Supabase client that reads cookies from the request
  const response = NextResponse.next();
  const supabase = createMiddlewareClient(request, response);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Extract role from user metadata (set during registration)
  const role = user?.user_metadata?.role || "USER";

  if (!user && !isPublic && !pathname.startsWith("/api/auth")) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (user && ADMIN_ROUTES.some((route) => pathname.startsWith(route))) {
    if (role !== "ADMIN") {
      const forbiddenUrl = new URL("/error", request.url);
      forbiddenUrl.searchParams.set("code", "FORBIDDEN");
      return NextResponse.redirect(forbiddenUrl);
    }
  }

  // 3. Security response headers
  const isDev = process.env.NODE_ENV === "development";
  const cspDirectives = [
    "default-src 'self'",
    "img-src 'self' data: https://res.cloudinary.com https://maps.googleapis.com https://images.unsplash.com",
    isDev ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'" : "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    "font-src 'self' data: https://fonts.gstatic.com",
    "connect-src 'self' https://res.cloudinary.com https://*.supabase.co",
    "frame-src 'self' https://www.google.com https://maps.google.com https://*.google.com https://*.google.co.in",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests",
  ].join("; ");

  response.headers.set("Content-Security-Policy", cspDirectives);

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public).*)"],
};
