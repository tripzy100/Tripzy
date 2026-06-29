"use server";

import { exportPersonalData } from "../services/personal-data-export";

/**
 * Server Action to retrieve compiled GDPR data report for download.
 */
export async function getGdprDataReport(userId: string) {
  try {
    const data = await exportPersonalData(userId);
    return { success: true, report: data };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to compile data report" };
  }
}
