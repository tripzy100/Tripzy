"use server";

import { exportPersonalData } from "../services/personal-data-export";
import { requireAuth } from "@/lib/auth-utils";

/**
 * Server Action to retrieve compiled GDPR data report for download.
 * Enforces session authentication to ensure users can only export their own personal data.
 */
export async function getGdprDataReport() {
  try {
    const sessionUserId = await requireAuth();
    const data = await exportPersonalData(sessionUserId);
    return { success: true, report: data };
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      return { success: false, error: "Unauthorized session." };
    }
    return { success: false, error: error.message || "Failed to compile data report" };
  }
}
