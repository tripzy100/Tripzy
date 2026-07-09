import { resend } from "@/lib/resend";
import { db } from "@/lib/db";
import { LogStatus } from "@prisma/client";

export async function sendEmail(
  userId: string | null,
  recipientEmail: string,
  subject: string,
  body: string,
) {
  try {
    const { data, error } = await resend.emails.send({
      from: "Tripzy <notifications@tripzy.com>",
      to: [recipientEmail],
      subject,
      html: body,
    });

    await db.emailSent.create({
      data: {
        userId,
        recipientEmail,
        subject,
        body,
        status: error ? LogStatus.FAILED : LogStatus.SENT,
        providerMessageId: data?.id || null,
        errorReason: error?.message || null,
      },
    });

    return { success: !error, error: error?.message };
  } catch (error: any) {
    await db.emailSent.create({
      data: {
        userId,
        recipientEmail,
        subject,
        body,
        status: LogStatus.FAILED,
        errorReason: error.message,
      },
    });
    return { success: false, error: error.message };
  }
}
