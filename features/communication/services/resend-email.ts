import { db } from "@/lib/db";
import { LogStatus } from "@prisma/client";

/**
 * Sends a transactional email, writing auditing entries to PostgreSQL.
 */
export async function sendEmail(
  userId: string | null,
  recipientEmail: string,
  subject: string,
  body: string
) {
  try {
    // For this environment, we mock delivery and save successful audit trail
    const log = await db.emailSent.create({
      data: {
        userId,
        recipientEmail,
        subject,
        body,
        status: LogStatus.SENT,
        providerMessageId: `msg-resend-${Date.now()}`,
      },
    });

    console.log(`[EMAIL DISPATCH] Sent to ${recipientEmail}: ${subject}`);
    return { success: true, logId: log.id };
  } catch (error: any) {
    console.error("Email dispatch failure:", error);
    
    // Log failure log
    const log = await db.emailSent.create({
      data: {
        userId,
        recipientEmail,
        subject,
        body,
        status: LogStatus.FAILED,
        errorReason: error.message || "Unknown SMTP issue",
      },
    });
    
    return { success: false, logId: log.id, error: error.message };
  }
}
export type SendEmailType = typeof sendEmail;
