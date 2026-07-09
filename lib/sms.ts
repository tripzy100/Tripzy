import { db } from "@/lib/db";
import { LogStatus, SmsChannelType } from "@prisma/client";
import { env } from "@/config/env";

export async function sendSms(
  userId: string | null,
  recipientPhone: string,
  message: string,
) {
  try {
    // MSG91 integration
    const params = new URLSearchParams({
      authkey: env.MSG91_AUTH_KEY,
      mobiles: recipientPhone.replace("+", ""),
      message,
      sender: env.MSG91_SENDER_ID,
      route: env.MSG91_ROUTE,
    });

    const response = await fetch("https://api.msg91.com/api/v2/sendsms", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });

    const result = await response.json();

    await db.smsLog.create({
      data: {
        userId,
        recipientPhone,
        message,
        status: response.ok ? LogStatus.SENT : LogStatus.FAILED,
        channelType: SmsChannelType.SMS,
        providerMessageId: result?.type || null,
        errorReason: response.ok ? null : JSON.stringify(result),
      },
    });

    return { success: response.ok };
  } catch (error: any) {
    await db.smsLog.create({
      data: {
        userId,
        recipientPhone,
        message,
        status: LogStatus.FAILED,
        channelType: SmsChannelType.SMS,
        errorReason: error.message,
      },
    });
    return { success: false, error: error.message };
  }
}
