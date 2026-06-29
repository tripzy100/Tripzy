import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { redis } from "@/lib/redis";

// Define route access definitions
const PUBLIC_ROUTES = ["/", "/auth/login", "/auth/register", "/maintenance"];
const ADMIN_ROUTES = ["/admin"];

/**
 * Basic token bucket rate limiting using Upstash Redis.
 */
async function rateLimiter(ip: string, limit = 60, windowSeconds = 60): Promise<{ allowed: boolean; remaining: number }> {
  const key = `ratelimit:${ip}`;
  try {
    const current = await redis.incr(key);
    if (current === 1) {
      await redis.expire(key, windowSeconds);
    }
    return {
      allowed: current <= limit,
      remaining: Math.max(0, limit - current),
    };
  } catch (error) {
    console.error("Rate limiter failure (bypassing):", error);
    // Fail-open in dev to prevent blocking traffic if Redis is down
    return { allowed: true, remaining: 999 };
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";

  // 1. Rate Limiting Check
  const isApi = pathname.startsWith("/api");
  if (isApi) {
    const { allowed, remaining } = await rateLimiter(ip, 60, 60);
    if (!allowed) {
      return new NextResponse(JSON.stringify({ error: "Too many requests" }), {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "X-RateLimit-Limit": "60",
          "X-RateLimit-Remaining": String(remaining),
        },
      });
    }
  }

  // 2. Authentication & RBAC (Role-Based Access Control)
  // Retrieve token cookie (Better Auth standard cookie)
  const token = request.cookies.get("better-auth.session-token")?.value;

  // Skeletons for path validation
  const isPublic = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
  const isAdmin = ADMIN_ROUTES.some((route) => pathname.startsWith(route));

  if (!token && !isPublic) {
    // Redirect unauthenticated traffic to login
    const loginUrl = new URL("/auth/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (token && isAdmin) {
    // In actual implementation, we would decode or query user role from cache/token
    // and verify role === "ADMIN". Redirect to forbidden page if not admin.
    const userRole = request.cookies.get("user-role")?.value;
    if (userRole !== "ADMIN") {
      const forbiddenUrl = new URL("/error", request.url);
      forbiddenUrl.searchParams.set("code", "FORBIDDEN");
      return NextResponse.redirect(forbiddenUrl);
    }
  }

  // 3. CSP and security response headers
  const response = NextResponse.next();
  response.headers.set("Content-Security-Policy", "default-src 'self'; img-src 'self' data: https:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; font-src 'self' data:; connect-src 'self' https:;");

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to add public asset routes here if required
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
