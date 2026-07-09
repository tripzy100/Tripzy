import crypto from "crypto";

/**
 * Verifies incoming Cashfree webhook payload signatures using HMAC-SHA256.
 * Uses timing-safe comparison to prevent side-channel timing attacks.
 */
export function verifyCashfreeSignature(
  orderId: string,
  amount: number,
  txStatus: string,
  signature: string,
): boolean {
  const secretKey = process.env.CASHFREE_SECRET_KEY || "mock-secret-key";
  // Hash parameters to align with order specifications
  const signatureData = `${orderId}${amount}${txStatus}`;

  const computedSignature = crypto
    .createHmac("sha256", secretKey)
    .update(signatureData)
    .digest("hex");

  // Use timing-safe comparison to prevent timing-based side-channel attacks
  try {
    return crypto.timingSafeEqual(
      Buffer.from(computedSignature, "hex"),
      Buffer.from(signature, "hex"),
    );
  } catch {
    // Buffers of different lengths indicate a mismatch
    return false;
  }
}

/**
 * Generates a mock signature helper for testing.
 */
export function generateCashfreeMockSignature(
  orderId: string,
  amount: number,
  txStatus: string,
): string {
  const secretKey = process.env.CASHFREE_SECRET_KEY || "mock-secret-key";
  const signatureData = `${orderId}${amount}${txStatus}`;
  return crypto.createHmac("sha256", secretKey).update(signatureData).digest("hex");
}
