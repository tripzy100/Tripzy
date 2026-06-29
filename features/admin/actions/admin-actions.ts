"use server";

import { db } from "@/lib/db";
import { UserStatus } from "@prisma/client";

/**
 * Server Action to verify or reject customer KYC status.
 */
export async function verifyUserKyc(userId: string, approve: boolean) {
  try {
    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) return { success: false, error: "User not found" };

    await db.user.update({
      where: { id: userId },
      data: {
        isKycVerified: approve,
        status: approve ? UserStatus.ACTIVE : UserStatus.SUSPENDED,
      },
    });

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "KYC adjustment failed" };
  }
}
export type VerifyUserKycType = typeof verifyUserKyc;

/**
 * Logs a high-security impersonation action to PostgreSQL.
 */
export async function triggerImpersonationLog(userId: string) {
  try {
    // Lookup first user as mock admin executor coordinates
    const admin = await db.user.findFirst();
    if (!admin) return { success: false, error: "Executor session missing" };

    await db.adminAction.create({
      data: {
        adminId: admin.id,
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
