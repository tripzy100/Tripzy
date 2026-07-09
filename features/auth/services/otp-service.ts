import { db } from "@/lib/db";
import { OtpType } from "@prisma/client";
import crypto from "crypto";

const OTP_LENGTH = 6;
const OTP_EXPIRY_MINUTES = 10;
const OTP_MAX_ATTEMPTS = 3;
const RESEND_COOLDOWN_SECONDS = 30;

function generateOtp(): string {
  return crypto.randomInt(100000, 999999).toString();
}

function hashOtp(otp: string): string {
  return crypto.createHash("sha256").update(otp).digest("hex");
}

export async function sendOtp(
  identifier: string,
  type: OtpType,
): Promise<{ success: boolean; message: string; retryAfter?: number }> {
  const recentOtp = await db.otpCode.findFirst({
    where: {
      identifier,
      type,
      createdAt: { gte: new Date(Date.now() - RESEND_COOLDOWN_SECONDS * 1000) },
      verifiedAt: null,
      deletedAt: null,
    },
    orderBy: { createdAt: "desc" },
  });

  if (recentOtp) {
    const elapsed = Math.floor((Date.now() - recentOtp.createdAt.getTime()) / 1000);
    const retryAfter = RESEND_COOLDOWN_SECONDS - elapsed;
    if (retryAfter > 0) {
      return {
        success: false,
        message: `Please wait ${retryAfter}s before requesting a new OTP`,
        retryAfter,
      };
    }
  }

  const otp = generateOtp();
  const codeHash = hashOtp(otp);
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  await db.otpCode.create({
    data: { identifier, codeHash, type, expiresAt, maxAttempts: OTP_MAX_ATTEMPTS },
  });

  const message = `Your Tripzy OTP is ${otp}. Valid for ${OTP_EXPIRY_MINUTES} minutes. Do not share this code.`;

  console.log(`[OTP] To ${identifier}: ${message}`);

  if (type === "PHONE_VERIFICATION") {
    const { sendSms } = await import("@/lib/sms");
    await sendSms(null, identifier, message);
  }

  return { success: true, message: "OTP sent successfully" };
}

export async function verifyOtp(
  identifier: string,
  otp: string,
  type: OtpType,
): Promise<{ success: boolean; message: string }> {
  const otpRecord = await db.otpCode.findFirst({
    where: {
      identifier,
      type,
      verifiedAt: null,
      deletedAt: null,
      expiresAt: { gte: new Date() },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!otpRecord) {
    return { success: false, message: "OTP not found or expired. Request a new one." };
  }

  if (otpRecord.attempts >= otpRecord.maxAttempts) {
    await db.otpCode.update({ where: { id: otpRecord.id }, data: { deletedAt: new Date() } });
    return { success: false, message: "Too many incorrect attempts. Request a new OTP." };
  }

  await db.otpCode.update({
    where: { id: otpRecord.id },
    data: { attempts: { increment: 1 } },
  });

  if (otpRecord.codeHash !== hashOtp(otp)) {
    const remaining = otpRecord.maxAttempts - (otpRecord.attempts + 1);
    if (remaining <= 0) {
      await db.otpCode.update({ where: { id: otpRecord.id }, data: { deletedAt: new Date() } });
      return { success: false, message: "Too many incorrect attempts. Request a new OTP." };
    }
    return { success: false, message: `Incorrect OTP. ${remaining} attempt(s) remaining.` };
  }

  await db.otpCode.update({
    where: { id: otpRecord.id },
    data: { verifiedAt: new Date() },
  });

  return { success: true, message: "OTP verified successfully" };
}
