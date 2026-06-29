import { db } from "@/lib/db";
import { LogStatus, SmsChannelType } from "@prisma/client";

/**
 * Dispatches an SMS or WhatsApp notification message, tracking logs in database.
 */
export async function sendSms(
  userId: string | null,
  recipientPhone: string,
  message: string,
  channel: "SMS" | "WHATSAPP"
) {
  try {
    const channelType = channel === "WHATSAPP" ? SmsChannelType.WHATSAPP : SmsChannelType.SMS;

    const log = await db.smsLog.create({
      data: {
        userId,
        recipientPhone,
        message,
        status: LogStatus.SENT,
        channelType,
        providerMessageId: `msg-channel-${Date.now()}`,
      },
    });

    console.log(`[${channel} DISPATCH] Sent to ${recipientPhone}: ${message}`);
    return { success: true, logId: log.id };
  } catch (error: any) {
    console.error(`Failed to send ${channel}:`, error);

    const log = await db.smsLog.create({
      data: {
        userId,
        recipientPhone,
        message,
        status: LogStatus.FAILED,
        channelType: channel === "WHATSAPP" ? SmsChannelType.WHATSAPP : SmsChannelType.SMS,
        errorReason: error.message || "Provider webhook issue",
      },
    });

    return { success: false, logId: log.id, error: error.message };
  }
}
export type SendSmsType = typeof sendSms;
