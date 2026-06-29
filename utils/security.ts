import crypto from "crypto";

// Key generation for symmetric encryption (must be exactly 32 bytes)
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY 
  ? crypto.createHash("sha256").update(process.env.ENCRYPTION_KEY).digest() 
  : crypto.randomBytes(32); // fallback for dev

const IV_LENGTH = 16; // For AES-256-CBC

/**
 * Encrypts sensitive text using AES-256-CBC.
 */
export function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

/**
 * Decrypts sensitive text encrypted with AES-256-CBC.
 */
export function decrypt(text: string): string {
  const textParts = text.split(":");
  const ivString = textParts.shift();
  if (!ivString) throw new Error("Invalid decryption format: missing IV");
  const iv = Buffer.from(ivString, "hex");
  const encryptedText = Buffer.from(textParts.join(":"), "hex");
  const decipher = crypto.createDecipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

/**
 * Strips HTML script tags to prevent XSS payloads.
 */
export function sanitizeXss(input: string): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/[<>]/g, (char) => (char === "<" ? "&lt;" : "&gt;"));
}

/**
 * Generates a random secure token for CSRF or state.
 */
export function generateCsrfToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Double-submit cookie verification.
 */
export function verifyCsrf(tokenInBody: string, tokenInCookie: string): boolean {
  if (!tokenInBody || !tokenInCookie) return false;
  // Timing-safe verification prevents side-channel analysis
  return crypto.timingSafeEqual(
    Buffer.from(tokenInBody, "hex"),
    Buffer.from(tokenInCookie, "hex")
  );
}

/**
 * Standard secure cookie definition options.
 */
export const secureCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
};
