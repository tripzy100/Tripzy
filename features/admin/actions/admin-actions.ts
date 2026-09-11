"use server";

import { db } from "@/lib/db";
import { UserStatus } from "@prisma/client";
import { requireAdmin } from "@/lib/auth-utils";

/**
 * Server Action to verify or reject customer KYC status.
 * Requires authenticated user with ADMIN role.
 */
export async function verifyUserKyc(userId: string, approve: boolean) {
  try {
    const adminId = await requireAdmin();

    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) return { success: false, error: "User not found" };

    await db.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: {
          isKycVerified: approve,
          status: approve ? UserStatus.ACTIVE : UserStatus.SUSPENDED,
        },
      });

      await tx.adminAction.create({
        data: {
          adminId,
          actionType: approve ? "KYC_APPROVE" : "KYC_REJECT",
          description: `${approve ? "Approved" : "Rejected"} KYC for user ${userId}`,
          targetEntity: "User",
          targetId: userId,
        },
      });
    });

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "KYC adjustment failed" };
  }
}
export type VerifyUserKycType = typeof verifyUserKyc;

/**
 * Logs a high-security impersonation action to PostgreSQL.
 * Requires authenticated user with ADMIN role.
 */
export async function triggerImpersonationLog(userId: string) {
  try {
    const adminId = await requireAdmin();

    await db.adminAction.create({
      data: {
        adminId,
        actionType: "IMPERSONATION_START",
        description: `Began administrative user impersonation of account ${userId}`,
        targetEntity: "User",
        targetId: userId,
      },
    });

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Audit log execution failed" };
  }
}
export type TriggerImpersonationLogType = typeof triggerImpersonationLog;

