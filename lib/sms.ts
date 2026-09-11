import { db } from "@/lib/db";
import { LogStatus, SmsChannelType } from "@prisma/client";
import { env } from "@/config/env";

export interface SendSmsResult {
  success: boolean;
  skipped?: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Provider-agnostic SMS dispatch interface.
 * When SMS_PROVIDER is "none" (default) or unconfigured, it safely acts as a no-op
 * without reporting fake success to users or blocking payment/booking workflows.
 */
export async function sendSms(
  userId: string | null,
  recipientPhone: string,
  message: string,
): Promise<SendSmsResult> {
  const provider = process.env.SMS_PROVIDER || env.SMS_PROVIDER || "none";

  // 1. Safe no-op when SMS is disabled
  if (provider === "none") {
    return {
      success: false,
      skipped: true,
      error: "SMS delivery is disabled (SMS_PROVIDER=none)",
    };
  }

  // 2. Safe console logger for staging / local development
  if (provider === "console") {
    console.log(`[SMS Console Provider] To: ${recipientPhone} | User: ${userId || "anon"} | Message: "${message}"`);
    try {
      await db.smsLog.create({
        data: {
          userId,
          recipientPhone,
          message,
          status: LogStatus.SENT,
          channelType: SmsChannelType.SMS,
          providerMessageId: `CONSOLE-LOG-${Date.now()}`,
          errorReason: "Logged to console (SMS_PROVIDER=console)",
        },
      });
    } catch {
      // Non-blocking log failure
    }
    return { success: true, messageId: `CONSOLE-${Date.now()}` };
  }

  // 3. Fallback for any unsupported provider
  return {
    success: false,
    skipped: true,
    error: `Unsupported SMS provider: ${provider}`,
  };
}
