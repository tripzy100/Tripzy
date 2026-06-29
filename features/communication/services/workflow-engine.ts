import { db } from "@/lib/db";
import { NotificationType } from "@prisma/client";
import { sendEmail } from "./resend-email";
import { sendSms } from "./sms-service";

/**
 * Orchestrates multi-channel notification sequences based on business event signals.
 */
export async function executeWorkflow(eventName: string, payload: any) {
  try {
    const { userId, recipientEmail, recipientPhone, details } = payload;
    if (!userId) return { success: false, error: "Missing recipient details" };

    if (eventName === "BOOKING_CREATED") {
      // 1. Create In-App Notification entry
      await db.notification.create({
        data: {
          userId,
          title: "Booking Initiated!",
          message: `Your reservation reference ${details.bookingNumber} is pending confirm payment holds.`,
          type: NotificationType.IN_APP,
        },
      });

      // 2. Dispatch Email alert
      if (recipientEmail) {
        await sendEmail(
          userId,
          recipientEmail,
          "Tripzy Rental Booking Initiated",
          `Hi! Your reservation draft ${details.bookingNumber} has been received. Please complete checkout locks.`
        );
      }

      // 3. Dispatch SMS alert
      if (recipientPhone) {
        await sendSms(
          userId,
          recipientPhone,
          `Tripzy Alert: Booking ${details.bookingNumber} is pending checkout completion.`,
          "SMS"
        );
      }
    }

    return { success: true };
  } catch (error: any) {
    console.error(`Workflow automation engine execution failure:`, error);
    return { success: false, error: error.message };
  }
}
export type ExecuteWorkflowType = typeof executeWorkflow;
