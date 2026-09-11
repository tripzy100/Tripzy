import { describe, it, expect, vi, beforeEach } from "vitest";
import { verifyCashfreeWebhookSignature, fetchCashfreeOrderStatus } from "../lib/services/cashfree-service";
import { processSuccessfulPayment } from "../lib/services/payment-service";
import { isValidBusinessHours } from "../features/booking/services/availability-engine";
import { db } from "../lib/db";

vi.mock("@/lib/db", () => {
  return {
    db: {
      payment: {
        findFirst: vi.fn(),
        update: vi.fn(),
      },
      vehicle: {
        findUnique: vi.fn(),
      },
      booking: {
        findFirst: vi.fn(),
        findUnique: vi.fn(),
        update: vi.fn(),
      },
      $transaction: vi.fn().mockImplementation(async (cb) => {
        return cb({
          payment: {
            findFirst: (...args: any[]) => (db.payment.findFirst as any)(...args),
            update: (...args: any[]) => (db.payment.update as any)(...args),
            updateMany: vi.fn().mockResolvedValue({ count: 1 }),
          },
          paymentTransaction: { create: vi.fn() },
          booking: {
            findUnique: (...args: any[]) => (db.booking.findUnique as any)(...args),
            update: (...args: any[]) => (db.booking.update as any)(...args),
          },
          bookingTimeline: { create: vi.fn() },
        });
      }),
    },
  };
});

describe("P0 Payment Security & Authoritative Cashfree Verification", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // 1. Invalid webhook signatures are rejected
  it("rejects invalid webhook signatures", () => {
    const res = verifyCashfreeWebhookSignature("raw_body", "invalid_sig", "1700000000000");
    expect(res.isValid).toBe(false);
  });

  // 2. Replayed webhooks outside timestamp tolerance window are rejected
  it("rejects replayed webhooks outside 5-minute tolerance window", () => {
    const oldTimestamp = Date.now() - (10 * 60 * 1000); // 10 minutes old
    const res = verifyCashfreeWebhookSignature("raw_body", "sig", String(oldTimestamp));
    expect(res.isValid).toBe(false);
    expect(res.reason).toBe("TIMESTAMP_EXPIRED_REPLAY_ATTACK");
  });

  // 3. Valid timestamp & HMAC signature succeeds
  it("validates authentic webhook HMAC signatures with fresh timestamp", () => {
    const crypto = require("crypto");
    const secret = process.env.CASHFREE_SECRET_KEY || "mock-secret-key";
    const timestamp = Date.now();
    const rawBody = JSON.stringify({ orderId: "CF-100", amount: 3540, txStatus: "SUCCESS" });
    const signature = crypto.createHmac("sha256", secret).update(`${timestamp}${rawBody}`).digest("hex");

    const res = verifyCashfreeWebhookSignature(rawBody, signature, String(timestamp));
    expect(res.isValid).toBe(true);
  });

  // 4. processSuccessfulPayment fails on amount mismatch
  it("rejects payment processing when expected and received amounts mismatch", async () => {
    vi.mocked(db.payment.findFirst).mockResolvedValueOnce({
      id: "pay-1",
      gatewayOrderId: "CF-ORD-100",
      totalAmount: 5000 as any,
      paymentStatus: "PENDING" as any,
      bookingId: "book-1",
      booking: { bookingNumber: "BK-100", userId: "u-1" },
    } as any);

    const result = await processSuccessfulPayment("CF-ORD-100", "CF-PAY-123", 1000); // 1000 vs 5000
    expect(result.success).toBe(false);
    expect(result.error).toBe("Payment amount mismatch");
  });

  // 5. Duplicate processSuccessfulPayment calls are idempotent
  it("processes successful payments idempotently", async () => {
    vi.mocked(db.payment.findFirst).mockResolvedValueOnce({
      id: "pay-1",
      gatewayOrderId: "CF-ORD-100",
      totalAmount: 3540 as any,
      paymentStatus: "COMPLETED" as any,
      bookingId: "book-1",
      booking: { bookingNumber: "BK-100", userId: "u-1" },
    } as any);

    const result = await processSuccessfulPayment("CF-ORD-100", "CF-PAY-123", 3540);
    expect(result.success).toBe(true);
    expect(result.message).toBe("Payment already processed");
  });

  // 6. Cashfree API network failure never confirms payment
  it("does not mark payment as completed when Cashfree API cannot be reached", async () => {
    const cfRes = await fetchCashfreeOrderStatus("CF-ORD-UNCONFIGURED");
    expect(cfRes.success).toBe(false);
    expect(cfRes.orderStatus).toBeUndefined();
  });
});

describe("P0 Exact Integer-Paise Amount Validation", () => {
  const checkPaiseEquality = (expectedAmount: number, actualAmount: number): boolean => {
    return Math.round(expectedAmount * 100) === Math.round(actualAmount * 100);
  };

  it("1. accepts exact match 3540.00 vs 3540.00", () => {
    expect(checkPaiseEquality(3540.00, 3540.00)).toBe(true);
  });

  it("2. accepts format variation 3540 vs 3540.0", () => {
    expect(checkPaiseEquality(3540, 3540.0)).toBe(true);
  });

  it("3. rejects 1-paise mismatch 3540.01 vs 3540.00", () => {
    expect(checkPaiseEquality(3540.01, 3540.00)).toBe(false);
  });

  it("4. rejects 50-paise mismatch 3540.50 vs 3540.00", () => {
    expect(checkPaiseEquality(3540.50, 3540.00)).toBe(false);
  });

  it("5. rejects ₹1 lower amount 3539.00 vs 3540.00", () => {
    expect(checkPaiseEquality(3539.00, 3540.00)).toBe(false);
  });

  it("6. rejects ₹1 higher amount 3541.00 vs 3540.00", () => {
    expect(checkPaiseEquality(3541.00, 3540.00)).toBe(false);
  });
});

describe("P0 Concurrency & Business Rules", () => {
  it("enforces business operating hours (7 AM - 11 PM)", () => {
    const validPickup = new Date("2026-08-25T09:00:00");
    const validReturn = new Date("2026-08-27T18:00:00");
    expect(isValidBusinessHours(validPickup, validReturn)).toBe(true);

    const midnightPickup = new Date("2026-08-25T02:00:00");
    expect(isValidBusinessHours(midnightPickup, validReturn)).toBe(false);
  });
});
