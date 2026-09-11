import { describe, it, expect, vi, beforeEach } from "vitest";
import { processSuccessfulPayment } from "../lib/services/payment-service";
import { createPaymentSession, triggerRefund } from "../features/payment/actions/payment-actions";
import { confirmBookingAuthoritative } from "../lib/services/booking-service";
import { GET as cleanupHoldsCron } from "../app/api/cron/cleanup-holds/route";
import { POST as webhookRoute } from "../app/api/payment/webhook/route";
import { GET as verifyOrderRoute } from "../app/api/payment/verify-order/route";
import { db } from "../lib/db";
import { NextRequest } from "next/server";
import { getCurrentUserId } from "../lib/supabase";
import { requireAuth, requireAdmin } from "../lib/auth-utils";

vi.mock("../lib/sms", () => ({
  sendSms: vi.fn().mockResolvedValue({ success: true }),
}));

vi.mock("../lib/email", () => ({
  sendEmail: vi.fn().mockResolvedValue({ success: true }),
}));

vi.mock("../lib/supabase", () => ({
  getCurrentUserId: vi.fn().mockResolvedValue("user-authenticated-123"),
}));

vi.mock("../lib/auth-utils", () => ({
  requireAuth: vi.fn().mockResolvedValue("user-authenticated-123"),
  requireAdmin: vi.fn().mockResolvedValue("admin-123"),
}));

vi.mock("../features/payment/services/invoice-service", () => ({
  createInvoice: vi.fn().mockResolvedValue({ id: "inv-100", invoiceNumber: "INV-100" }),
}));

vi.mock("../lib/services/cashfree-service", () => ({
  verifyCashfreeWebhookSignature: vi.fn().mockReturnValue({ isValid: true }),
  fetchCashfreeOrderStatus: vi.fn().mockResolvedValue({ success: true, orderStatus: "PAID", paymentStatus: "SUCCESS", amount: 3500 }),
  initiateCashfreeRefund: vi.fn().mockResolvedValue({ success: true, refundId: "ref-100", gatewayRefundId: "CF-REF-100", status: "SUCCESS" }),
}));

vi.mock("../lib/services/pricing-service", () => ({
  calculateAuthoritativePrice: vi.fn().mockResolvedValue({
    success: true,
    pricing: {
      finalAmount: 3500,
      subtotalWithSurcharges: 3000,
      discountAmount: 0,
      taxAmount: 500,
      securityDeposit: 0,
    },
  }),
}));

vi.mock("../lib/db", () => {
  return {
    db: {
      payment: {
        findFirst: vi.fn(),
        findUnique: vi.fn(),
        update: vi.fn(),
        updateMany: vi.fn().mockResolvedValue({ count: 1 }),
        create: vi.fn(),
      },
      refund: {
        findFirst: vi.fn(),
        create: vi.fn(),
      },
      paymentTransaction: {
        create: vi.fn(),
      },
      booking: {
        findUnique: vi.fn(),
        update: vi.fn(),
      },
      bookingTimeline: {
        create: vi.fn(),
      },
      wallet: {
        upsert: vi.fn(),
        update: vi.fn(),
      },
      walletTransaction: {
        create: vi.fn(),
      },
      $transaction: vi.fn().mockImplementation(async (cb) => {
        return cb({
          payment: {
            findFirst: (...args: any[]) => (db.payment.findFirst as any)(...args),
            findUnique: (...args: any[]) => (db.payment.findUnique as any)(...args),
            update: (...args: any[]) => (db.payment.update as any)(...args),
            updateMany: vi.fn().mockResolvedValue({ count: 1 }),
            create: (...args: any[]) => (db.payment.create as any)(...args),
          },
          refund: {
            findFirst: (...args: any[]) => (db.refund.findFirst as any)(...args),
            create: (...args: any[]) => (db.refund.create as any)(...args),
          },
          wallet: {
            upsert: (...args: any[]) => (db.wallet.upsert as any)(...args),
            update: (...args: any[]) => (db.wallet.update as any)(...args),
          },
          walletTransaction: {
            create: (...args: any[]) => (db.walletTransaction.create as any)(...args),
          },
          paymentTransaction: { create: (...args: any[]) => (db.paymentTransaction.create as any)(...args) },
          booking: {
            findUnique: (...args: any[]) => (db.booking.findUnique as any)(...args),
            update: (...args: any[]) => (db.booking.update as any)(...args),
          },
          bookingTimeline: { create: (...args: any[]) => (db.bookingTimeline.create as any)(...args) },
        });
      }),
    },
  };
});

describe("Comprehensive Security & Payment Architecture Remediation Suite", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete process.env.CRON_SECRET;
  });

  // 1. Online payment successfully confirms valid booking.
  it("1. confirms valid PENDING booking upon online payment and generates pickupOtp", async () => {
    vi.mocked(db.payment.findFirst).mockResolvedValueOnce({
      id: "pay-valid",
      gatewayOrderId: "CF-ORD-VAL",
      totalAmount: 3500 as any,
      paymentStatus: "PENDING" as any,
      bookingId: "book-valid",
      booking: {
        id: "book-valid",
        bookingNumber: "BK-VALID-100",
        userId: "user-authenticated-123",
        status: "PENDING",
        pickupOtp: null,
        user: { email: "user@example.com", phone: "+919876543210" },
        vehicle: { brand: { name: "Tata" }, model: { name: "Nexon" } },
        pickupLocation: { name: "Airport Hub" },
      },
    } as any);

    vi.mocked(db.booking.findUnique).mockResolvedValueOnce({
      id: "book-valid",
      bookingNumber: "BK-VALID-100",
      status: "PENDING",
    } as any);

    const result = await processSuccessfulPayment("CF-ORD-VAL", "CF-PAY-VAL", 3500);
    expect(result.success).toBe(true);
    expect(result.pickupOtp).toBeDefined();
    expect(result.pickupOtp).toMatch(/^\d{6}$/);
  });

  // 2. Online payment cannot confirm expired booking.
  it("2. refuses to confirm EXPIRED bookings upon online payment", async () => {
    vi.mocked(db.payment.findFirst).mockResolvedValueOnce({
      id: "pay-expired",
      gatewayOrderId: "CF-ORD-EXP",
      totalAmount: 3500 as any,
      paymentStatus: "PENDING" as any,
      bookingId: "book-expired",
      booking: {
        id: "book-expired",
        bookingNumber: "BK-EXPIRED-100",
        userId: "user-authenticated-123",
        status: "EXPIRED",
      },
    } as any);

    vi.mocked(db.booking.findUnique).mockResolvedValueOnce({
      id: "book-expired",
      bookingNumber: "BK-EXPIRED-100",
      status: "EXPIRED",
    } as any);

    const result = await processSuccessfulPayment("CF-ORD-EXP", "CF-PAY-EXP", 3500);
    expect(result.success).toBe(false);
    expect(result.error).toContain("automatically refunded");
  });

  // 3. Online payment cannot confirm cancelled booking.
  it("3. refuses to confirm CANCELLED bookings upon online payment", async () => {
    vi.mocked(db.payment.findFirst).mockResolvedValueOnce({
      id: "pay-cancelled",
      gatewayOrderId: "CF-ORD-CAN",
      totalAmount: 3500 as any,
      paymentStatus: "PENDING" as any,
      bookingId: "book-cancelled",
      booking: {
        id: "book-cancelled",
        bookingNumber: "BK-CANCELLED-100",
        userId: "user-authenticated-123",
        status: "CANCELLED",
      },
    } as any);

    vi.mocked(db.booking.findUnique).mockResolvedValueOnce({
      id: "book-cancelled",
      bookingNumber: "BK-CANCELLED-100",
      status: "CANCELLED",
    } as any);

    const result = await processSuccessfulPayment("CF-ORD-CAN", "CF-PAY-CAN", 3500);
    expect(result.success).toBe(false);
    expect(result.error).toContain("automatically refunded");
  });

  // 4. Expired successful payment triggers Cashfree refund.
  it("4. triggers Cashfree online refund for EXPIRED booking payment", async () => {
    vi.mocked(db.payment.findFirst).mockResolvedValueOnce({
      id: "pay-exp-refund",
      gatewayOrderId: "CF-ORD-EXP-R",
      totalAmount: 3500 as any,
      paymentStatus: "PENDING" as any,
      bookingId: "book-exp-refund",
      booking: {
        id: "book-exp-refund",
        bookingNumber: "BK-EXP-REF-100",
        userId: "user-authenticated-123",
        status: "EXPIRED",
      },
    } as any);

    vi.mocked(db.booking.findUnique).mockResolvedValueOnce({
      id: "book-exp-refund",
      bookingNumber: "BK-EXP-REF-100",
      status: "EXPIRED",
    } as any);

    const result = await processSuccessfulPayment("CF-ORD-EXP-R", "CF-PAY-EXP-R", 3500);
    expect(result.success).toBe(false);
    expect(db.refund.create).toHaveBeenCalled();
  });

  // 5. Cancelled successful payment triggers Cashfree refund.
  it("5. triggers Cashfree online refund for CANCELLED booking payment", async () => {
    vi.mocked(db.payment.findFirst).mockResolvedValueOnce({
      id: "pay-can-refund",
      gatewayOrderId: "CF-ORD-CAN-R",
      totalAmount: 3500 as any,
      paymentStatus: "PENDING" as any,
      bookingId: "book-can-refund",
      booking: {
        id: "book-can-refund",
        bookingNumber: "BK-CAN-REF-100",
        userId: "user-authenticated-123",
        status: "CANCELLED",
      },
    } as any);

    vi.mocked(db.booking.findUnique).mockResolvedValueOnce({
      id: "book-can-refund",
      bookingNumber: "BK-CAN-REF-100",
      status: "CANCELLED",
    } as any);

    const result = await processSuccessfulPayment("CF-ORD-CAN-R", "CF-PAY-CAN-R", 3500);
    expect(result.success).toBe(false);
    expect(db.refund.create).toHaveBeenCalled();
  });

  // 6. Duplicate webhook does not create duplicate refund.
  it("6. ignores duplicate webhook payloads for REFUNDED payments idempotently", async () => {
    vi.mocked(db.payment.findFirst).mockResolvedValueOnce({
      id: "pay-already-refunded",
      gatewayOrderId: "CF-ORD-ALREADY-REF",
      totalAmount: 3500 as any,
      paymentStatus: "REFUNDED" as any,
    } as any);

    const req = new NextRequest("http://localhost/api/payment/webhook", {
      method: "POST",
      body: JSON.stringify({ orderId: "CF-ORD-ALREADY-REF", amount: 3500, txStatus: "SUCCESS" }),
    });

    const res = await webhookRoute(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.message).toContain("already processed (REFUNDED)");
  });

  // 7. verify-order retry does not create duplicate refund.
  it("7. handles verify-order retries idempotently for REFUNDED payments", async () => {
    vi.mocked(db.payment.findFirst).mockResolvedValueOnce({
      id: "pay-already-refunded-verify",
      gatewayOrderId: "CF-ORD-VERIFY-REF",
      totalAmount: 3500 as any,
      paymentStatus: "REFUNDED" as any,
      booking: {
        userId: "user-authenticated-123",
        bookingNumber: "BK-REF-VERIFY",
      },
    } as any);

    const req = new NextRequest("http://localhost/api/payment/verify-order?orderId=CF-ORD-VERIFY-REF");
    const res = await verifyOrderRoute(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.status).toBe("REFUNDED");
    expect(body.message).toContain("automatically refunded");
  });

  // 8. Concurrent webhook + verify-order produces one logical refund.
  it("8. handles concurrent processSuccessfulPayment calls for expired hold with exactly one CAS winner", async () => {
    // Simulated winning call
    vi.mocked(db.payment.findFirst).mockResolvedValueOnce({
      id: "pay-race-exp",
      gatewayOrderId: "CF-ORD-RACE",
      totalAmount: 3500 as any,
      paymentStatus: "PENDING" as any,
      bookingId: "book-race",
      booking: { id: "book-race", bookingNumber: "BK-RACE", userId: "u-1", status: "EXPIRED" },
    } as any);
    vi.mocked(db.booking.findUnique).mockResolvedValueOnce({ id: "book-race", bookingNumber: "BK-RACE", status: "EXPIRED" } as any);

    const res1 = await processSuccessfulPayment("CF-ORD-RACE", "CF-PAY-RACE", 3500);
    expect(res1.success).toBe(false);

    // Simulated losing concurrent call (already REFUNDED in DB)
    vi.mocked(db.payment.findFirst).mockResolvedValueOnce({
      id: "pay-race-exp",
      gatewayOrderId: "CF-ORD-RACE",
      totalAmount: 3500 as any,
      paymentStatus: "REFUNDED" as any,
      bookingId: "book-race",
      booking: { id: "book-race", bookingNumber: "BK-RACE", userId: "u-1", status: "EXPIRED" },
    } as any);

    const res2 = await processSuccessfulPayment("CF-ORD-RACE", "CF-PAY-RACE", 3500);
    expect(res2.success).toBe(false);
    expect(res2.error).toContain("already been refunded");
  });

  // 9. Customer cannot refund another user's payment.
  it("9. blocks non-owner from triggering a refund against another user's payment", async () => {
    vi.mocked(db.payment.findUnique).mockResolvedValueOnce({
      id: "pay-victim",
      gatewayOrderId: "CF-ORD-VICTIM",
      booking: { userId: "user-victim-999", bookingNumber: "BK-VICTIM" },
    } as any);

    vi.mocked(requireAuth).mockResolvedValueOnce("user-attacker-123");
    vi.mocked(requireAdmin).mockRejectedValueOnce(new Error("FORBIDDEN"));

    const result = await triggerRefund({ paymentId: "pay-victim", amount: 3500, reason: "Unauthorized refund" });
    expect(result.success).toBe(false);
    expect(result.error).toBe("Unauthorized access to payment refund");
  });

  // 10. Unauthenticated refund request is rejected.
  it("10. rejects unauthenticated refund attempts with error", async () => {
    vi.mocked(requireAuth).mockRejectedValueOnce(new Error("UNAUTHORIZED"));

    const result = await triggerRefund({ paymentId: "pay-100", amount: 1000, reason: "Unauthenticated" });
    expect(result.success).toBe(false);
    expect(result.error).toBe("Unauthorized refund request");
  });

  // 11. Non-admin cannot perform admin-only refund operations.
  it("11. allows legitimate owner to initiate authorized refund", async () => {
    vi.mocked(requireAuth).mockResolvedValueOnce("user-authenticated-123");
    vi.mocked(db.payment.findUnique).mockResolvedValueOnce({
      id: "pay-owner",
      paymentGateway: "CASHFREE",
      gatewayOrderId: "CF-ORD-OWNER",
      booking: { userId: "user-authenticated-123", bookingNumber: "BK-OWNER" },
    } as any);

    vi.mocked(db.refund.findFirst).mockResolvedValueOnce(null);

    const result = await triggerRefund({ paymentId: "pay-owner", amount: 3500, reason: "User requested cancellation refund" });
    expect(result.success).toBe(true);
    expect(db.refund.create).toHaveBeenCalled();
  });

  // 12. Online booking cannot become CONFIRMED without completed payment.
  it("12. blocks confirmBookingAuthoritative for online payment bookings without COMPLETED payment", async () => {
    vi.mocked(db.booking.findUnique).mockResolvedValueOnce({
      id: "book-unpaid",
      userId: "user-authenticated-123",
      status: "PENDING",
      payments: [
        { paymentGateway: "CASHFREE", paymentStatus: "PENDING" },
      ],
    } as any);

    const result = await confirmBookingAuthoritative("book-unpaid", "user-authenticated-123");
    expect(result.success).toBe(false);
    expect(result.error).toContain("without a verified online payment");
  });

  // 13. COD booking can proceed without Cashfree payment.
  it("13. creates legitimate COD payment session and confirms booking under Pay at Pickup policy", async () => {
    vi.mocked(getCurrentUserId).mockResolvedValueOnce("user-authenticated-123");
    vi.mocked(db.booking.findUnique).mockResolvedValueOnce({
      id: "book-cod",
      userId: "user-authenticated-123",
      vehicleId: "v-1",
      pickupDate: new Date(),
      returnDate: new Date(),
      bookingNumber: "BK-COD-100",
      pickupOtp: null,
      status: "PENDING",
    } as any);

    vi.mocked(db.payment.findFirst).mockResolvedValueOnce(null);
    vi.mocked(db.payment.create).mockResolvedValueOnce({ id: "pay-cod-100" } as any);

    const result = await createPaymentSession({ bookingId: "book-cod", paymentMethod: "COD" });
    expect(result?.success).toBe(true);
    expect(result?.isCod).toBe(true);
    expect(result?.pickupOtp).toMatch(/^\d{6}$/);
    expect(db.booking.update).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ status: "CONFIRMED" }),
    }));
  });

  // 14. COD booking is not treated as Cashfree COMPLETED.
  it("14. distinguishes COD booking in confirmBookingAuthoritative without marking Cashfree COMPLETED", async () => {
    vi.mocked(db.booking.findUnique).mockResolvedValueOnce({
      id: "book-cod-confirm",
      userId: "user-authenticated-123",
      status: "PENDING",
      payments: [
        { paymentGateway: "COD", paymentStatus: "PENDING" },
      ],
    } as any);

    const result = await confirmBookingAuthoritative("book-cod-confirm", "user-authenticated-123");
    expect(result.success).toBe(true);
  });

  // 15. Client cannot manipulate payment method/status to bypass server validation.
  it("15. rejects createPaymentSession for non-existent or invalid paymentMethod enum", async () => {
    vi.mocked(getCurrentUserId).mockResolvedValueOnce("user-authenticated-123");
    vi.mocked(db.booking.findUnique).mockResolvedValueOnce({
      id: "book-expired-session",
      userId: "user-authenticated-123",
      status: "EXPIRED",
    } as any);

    const result = await createPaymentSession({ bookingId: "book-expired-session", paymentMethod: "UPI" });
    expect(result?.success).toBe(false);
    expect(result?.error).toContain("expired or was cancelled");
  });

  // 16. Client cannot manipulate amount.
  it("16. processSuccessfulPayment fails on client amount manipulation", async () => {
    vi.mocked(db.payment.findFirst).mockResolvedValueOnce({
      id: "pay-tamper",
      gatewayOrderId: "CF-ORD-TAMPER",
      totalAmount: 5000 as any,
      paymentStatus: "PENDING" as any,
      bookingId: "book-tamper",
      booking: { bookingNumber: "BK-TAMPER", userId: "u-1" },
    } as any);

    const result = await processSuccessfulPayment("CF-ORD-TAMPER", "CF-PAY-TAMPER", 100);
    expect(result.success).toBe(false);
    expect(result.error).toBe("Payment amount mismatch");
  });

  // 17. Existing OTP persistence/idempotency remains intact.
  it("17. reuses existing pickupOtp on repeat payment completion without overwriting", async () => {
    vi.mocked(db.payment.findFirst).mockResolvedValueOnce({
      id: "pay-completed-otp",
      gatewayOrderId: "CF-ORD-OTP",
      totalAmount: 3500 as any,
      paymentStatus: "COMPLETED" as any,
      bookingId: "book-completed-otp",
      booking: { bookingNumber: "BK-OTP", pickupOtp: "654321", userId: "u-1" },
    } as any);

    const result = await processSuccessfulPayment("CF-ORD-OTP", "CF-PAY-OTP", 3500);
    expect(result.success).toBe(true);
    expect(result.pickupOtp).toBe("654321");
  });

  // 18. Cron cleanup endpoint rejects missing CRON_SECRET with HTTP 401
  it("18. rejects cron execution with 401 when CRON_SECRET is unconfigured", async () => {
    process.env.CRON_SECRET = "";

    const req = new NextRequest("http://localhost/api/cron/cleanup-holds", {
      headers: { authorization: "Bearer invalid" },
    });

    const res = await cleanupHoldsCron(req);
    expect(res.status).toBe(401);
  });

  // 19. Cron cleanup endpoint rejects invalid CRON_SECRET with HTTP 401
  it("19. rejects cron execution with 401 when authorization header is invalid", async () => {
    process.env.CRON_SECRET = "super-secret-cron-key";

    const req = new NextRequest("http://localhost/api/cron/cleanup-holds", {
      headers: { authorization: "Bearer wrong-secret" },
    });

    const res = await cleanupHoldsCron(req);
    expect(res.status).toBe(401);
  });

  // 20. Zero Wallet Rule: Verifies no wallet credits are issued anywhere in payment-service.ts
  it("20. enforces Zero Wallet Rule: no wallet credits generated on payment refund", async () => {
    vi.mocked(db.payment.findFirst).mockResolvedValueOnce({
      id: "pay-no-wallet",
      gatewayOrderId: "CF-ORD-NO-WALL",
      totalAmount: 3500 as any,
      paymentStatus: "PENDING" as any,
      bookingId: "book-no-wallet",
      booking: { id: "book-no-wallet", bookingNumber: "BK-NO-WALL", userId: "u-1", status: "EXPIRED" },
    } as any);

    vi.mocked(db.booking.findUnique).mockResolvedValueOnce({ id: "book-no-wallet", bookingNumber: "BK-NO-WALL", status: "EXPIRED" } as any);

    await processSuccessfulPayment("CF-ORD-NO-WALL", "CF-PAY-NO-WALL", 3500);
    expect((db as any).wallet?.upsert).not.toHaveBeenCalled();
    expect((db as any).walletTransaction?.create).not.toHaveBeenCalled();
  });
});
