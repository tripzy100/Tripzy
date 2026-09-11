import { getCurrentUserId } from "@/lib/supabase";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export interface AuthenticatedUser {
  id: string;
  email: string;
  phone: string | null;
  role: string;
}

/**
 * Requires a valid authenticated user session.
 * Returns the user ID or throws an error.
 */
export async function requireAuth(): Promise<string> {
  const userId = await getCurrentUserId();
  if (!userId) {
    throw new Error("UNAUTHORIZED");
  }
  return userId;
}

/**
 * Ensures user is authenticated and has ADMIN role.
 */
export async function requireAdmin(): Promise<string> {
  const userId = await requireAuth();

  const user = await db.user.findUnique({
    where: { id: userId },
    include: {
      userRoles: {
        include: {
          role: true,
        },
      },
    },
  });

  if (!user) {
    throw new Error("UNAUTHORIZED");
  }

  const isAdmin = user.userRoles.some((ur) => ur.role.code === "ADMIN");
  if (!isAdmin) {
    throw new Error("FORBIDDEN");
  }

  return userId;
}

/**
 * Require auth for Server Pages with redirect.
 */
export async function requireAuthPage(callbackUrl?: string): Promise<string> {
  const userId = await getCurrentUserId();
  if (!userId) {
    const loginUrl = callbackUrl
      ? `/auth/login?callbackUrl=${encodeURIComponent(callbackUrl)}`
      : "/auth/login";
    redirect(loginUrl);
  }
  return userId;
}
