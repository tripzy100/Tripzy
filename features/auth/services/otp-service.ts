import { db } from "@/lib/db";
import { OtpType } from "@prisma/client";
import crypto from "crypto";
import {
  sendEmailVerificationOtp,
  sendPasswordResetOtp,
} from "@/lib/services/email-service";

const OTP_EXPIRY_MINUTES = 10;
const OTP_MAX_ATTEMPTS = 5;
const RESEND_COOLDOWN_SECONDS = 60;
const MAX_OTP_PER_HOUR = 5;

// Encryption key derived from server secret
function getEncryptionKey(): Buffer {
  const secret =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.RESEND_API_KEY ||
    "tripzy_default_secure_key_32_bytes!!";
  return crypto.createHash("sha256").update(secret).digest();
}

/**
 * Encrypt a JSON object using AES-256-GCM
 */
export function encryptPayload(data: Record<string, any>): {
  iv: string;
  tag: string;
  ciphertext: string;
} {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const jsonStr = JSON.stringify(data);
  let encrypted = cipher.update(jsonStr, "utf8", "hex");
  encrypted += cipher.final("hex");
  const tag = cipher.getAuthTag().toString("hex");
  return {
    iv: iv.toString("hex"),
    tag,
    ciphertext: encrypted,
  };
}

/**
 * Decrypt a JSON payload using AES-256-GCM
 */
export function decryptPayload(ivHex: string, tagHex: string, ciphertextHex: string): Record<string, any> | null {
  try {
    const key = getEncryptionKey();
    const iv = Buffer.from(ivHex, "hex");
    const tag = Buffer.from(tagHex, "hex");
    const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
    decipher.setAuthTag(tag);
    let decrypted = decipher.update(ciphertextHex, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return JSON.parse(decrypted);
  } catch (error) {
    console.error("[OtpService] Payload decryption failed:", error);
    return null;
  }
}

/**
 * Generate a 6-digit numeric string
 */
function generateNumericOtp(): string {
  return crypto.randomInt(100000, 999999).toString();
}

/**
 * Hash OTP using SHA-256
 */
export function hashOtp(otp: string): string {
  return crypto.createHash("sha256").update(otp.trim()).digest("hex");
}

/**
 * Clean up expired or marked-deleted OTPs for a given identifier
 */
export async function cleanupExpiredOtps(identifier: string): Promise<void> {
  try {
    await db.otpCode.deleteMany({
      where: {
        identifier,
        OR: [
          { expiresAt: { lt: new Date() } },
          { attempts: { gte: OTP_MAX_ATTEMPTS } },
          { deletedAt: { not: null } },
        ],
      },
    });
  } catch (error) {
    console.error("[OtpService] Cleanup error:", error);
  }
}

/**
 * Send an Email OTP with optional encrypted pending payload
 */
export async function sendOtp(
  identifier: string,
  type: OtpType,
  userId: string | null = null,
  payloadData?: Record<string, any>,
): Promise<{ success: boolean; message: string; retryAfter?: number }> {
  const email = identifier.trim().toLowerCase();

  // 1. Clean up old/expired OTPs
  await cleanupExpiredOtps(email);

  // 2. Check 60-second resend cooldown
  const recentOtp = await db.otpCode.findFirst({
    where: {
      identifier: email,
      type,
      createdAt: { gte: new Date(Date.now() - RESEND_COOLDOWN_SECONDS * 1000) },
      verifiedAt: null,
      deletedAt: null,
    },
    orderBy: { createdAt: "desc" },
  });

  if (recentOtp) {
    const elapsed = Math.floor((Date.now() - recentOtp.createdAt.getTime()) / 1000);
    const retryAfter = Math.max(1, RESEND_COOLDOWN_SECONDS - elapsed);
    return {
      success: false,
      message: `Please wait ${retryAfter} seconds before requesting a new code.`,
      retryAfter,
    };
  }

  // 3. Rate limit: check maximum OTP requests per email in past 1 hour
  const hourlyCount = await db.otpCode.count({
    where: {
      identifier: email,
      createdAt: { gte: new Date(Date.now() - 60 * 60 * 1000) },
    },
  });

  if (hourlyCount >= MAX_OTP_PER_HOUR) {
    return {
      success: false,
      message: "Too many code requests for this email. Please try again in an hour.",
    };
  }

  // 4. Generate 6-digit numeric OTP & hash it
  const otp = generateNumericOtp();
  const rawHash = hashOtp(otp);

  let combinedCodeHash = rawHash;
  if (payloadData) {
    const enc = encryptPayload(payloadData);
    combinedCodeHash = `${rawHash}:${enc.iv}:${enc.tag}:${enc.ciphertext}`;
  }

  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  // Soft delete any active previous unverified OTPs for this email and type
  await db.otpCode.updateMany({
    where: {
      identifier: email,
      type,
      verifiedAt: null,
      deletedAt: null,
    },
    data: { deletedAt: new Date() },
  });

  // 5. Store in Prisma DB
  await db.otpCode.create({
    data: {
      identifier: email,
      codeHash: combinedCodeHash,
      type,
      expiresAt,
      maxAttempts: OTP_MAX_ATTEMPTS,
      attempts: 0,
    },
  });

  console.log(`[OTP SERVICE] Generated OTP for ${email} (${type}): ${otp}`);

  // 6. Send email via Resend
  let emailResult: { success: boolean; error?: string };
  if (type === "EMAIL_VERIFICATION") {
    emailResult = await sendEmailVerificationOtp(userId, email, otp);
  } else {
    emailResult = await sendPasswordResetOtp(userId, email, otp);
  }

  if (!emailResult.success) {
    return {
      success: false,
      message: emailResult.error || "Failed to send email code. Please verify your email address.",
    };
  }

  return {
    success: true,
    message: process.env.NODE_ENV !== "production"
      ? `Verification code sent to ${email}. (Dev OTP: ${otp})`
      : `Verification code sent to ${email}.`,
  };
}

/**
 * Verify an Email OTP server-side and return decrypted payload if available
 */
export async function verifyOtp(
  identifier: string,
  otp: string,
  type: OtpType,
): Promise<{ success: boolean; message: string; payload?: Record<string, any> | null }> {
  const email = identifier.trim().toLowerCase();
  const cleanOtp = otp.trim();

  // Find active OTP record
  const otpRecord = await db.otpCode.findFirst({
    where: {
      identifier: email,
      type,
      verifiedAt: null,
      deletedAt: null,
      expiresAt: { gte: new Date() },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!otpRecord) {
    return {
      success: false,
      message: "Verification code is invalid or has expired. Please request a new code.",
    };
  }

  // Check attempt limit
  if (otpRecord.attempts >= otpRecord.maxAttempts) {
    await db.otpCode.update({
      where: { id: otpRecord.id },
      data: { deletedAt: new Date() },
    });
    return {
      success: false,
      message: "Maximum verification attempts exceeded. Please request a new code.",
    };
  }

  // Increment attempt counter
  const updatedAttempts = otpRecord.attempts + 1;
  await db.otpCode.update({
    where: { id: otpRecord.id },
    data: { attempts: updatedAttempts },
  });

  // Extract hash and optional encrypted payload
  const parts = otpRecord.codeHash.split(":");
  const expectedHash = parts[0];

  const inputHash = hashOtp(cleanOtp);
  if (expectedHash !== inputHash) {
    const remaining = otpRecord.maxAttempts - updatedAttempts;
    if (remaining <= 0) {
      await db.otpCode.update({
        where: { id: otpRecord.id },
        data: { deletedAt: new Date() },
      });
      return {
        success: false,
        message: "Maximum verification attempts exceeded. Please request a new code.",
      };
    }
    return {
      success: false,
      message: `Invalid verification code. ${remaining} attempt(s) remaining.`,
    };
  }

  // Decrypt payload if present
  let payload: Record<string, any> | null = null;
  if (parts.length === 4) {
    const [, ivHex, tagHex, ciphertextHex] = parts;
    payload = decryptPayload(ivHex, tagHex, ciphertextHex);
  }

  // Mark as verified and one-time consumed
  await db.otpCode.update({
    where: { id: otpRecord.id },
    data: {
      verifiedAt: new Date(),
      deletedAt: new Date(),
    },
  });

  return {
    success: true,
    message: "OTP verified successfully.",
    payload,
  };
}
