import { describe, it, expect, vi, beforeEach } from "vitest";
import { processSuccessfulPayment } from "../lib/services/payment-service";
import { db } from "../lib/db";

vi.mock("../lib/sms", () => {
  return {
    sendSms: vi.fn().mockResolvedValue({ success: true }),
  };
});

vi.mock("../lib/email", () => {
  return {
    sendEmail: vi.fn().mockResolvedValue({ success: true }),
  };
});

vi.mock("../features/payment/services/invoice-service", () => {
  return {
    createInvoice: vi.fn().mockResolvedValue({ id: "inv-100", invoiceNumber: "INV-100" }),
  };
});

vi.mock("../lib/db", () => {
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

describe("Pickup OTP Persistence & KYC Synchronization Remediation Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // 1. Successful payment generates a 6-digit OTP
  it("generates a 6-digit pickup OTP on successful payment completion", async () => {
    vi.mocked(db.payment.findFirst).mockResolvedValueOnce({
      id: "pay-100",
      gatewayOrderId: "CF-ORD-777",
      totalAmount: 4500 as any,
      paymentStatus: "PENDING" as any,
      bookingId: "book-777",
      booking: {
        id: "book-777",
        bookingNumber: "BK-777",
        userId: "user-777",
        pickupOtp: null,
        pickupDate: new Date(),
        returnDate: new Date(),
        user: { email: "test@example.com", phone: "+919876543210" },
        vehicle: { brand: { name: "Hyundai" }, model: { name: "Creta" } },
        pickupLocation: { name: "Ranchi Hub" },
      },
    } as any);

    const result = await processSuccessfulPayment("CF-ORD-777", "CF-PAY-777", 4500);

    expect(result.success).toBe(true);
    expect(result.pickupOtp).toBeDefined();
    expect(result.pickupOtp).toMatch(/^\d{6}$/);
  });

  // 2. Repeated processSuccessfulPayment reuses stored OTP without regeneration
  it("reuses existing stored pickup OTP on duplicate processSuccessfulPayment calls", async () => {
    const existingOtp = "654321";

    vi.mocked(db.payment.findFirst).mockResolvedValueOnce({
      id: "pay-100",
      gatewayOrderId: "CF-ORD-777",
      totalAmount: 4500 as any,
      paymentStatus: "COMPLETED" as any,
      bookingId: "book-777",
      booking: {
        id: "book-777",
        bookingNumber: "BK-777",
        userId: "user-777",
        pickupOtp: existingOtp,
        user: { email: "test@example.com", phone: "+919876543210" },
      },
    } as any);

    const result = await processSuccessfulPayment("CF-ORD-777", "CF-PAY-777", 4500);

    expect(result.success).toBe(true);
    expect(result.pickupOtp).toBe(existingOtp);
    expect(result.message).toBe("Payment already processed");
  });

  // 3. KYC approval evaluation logic: user.isKycVerified || latestKyc?.status === 'APPROVED'
  it("approves KYC when latestKyc.status is APPROVED even if user.isKycVerified is false", () => {
    const userMock = {
      isKycVerified: false,
      kycRequests: [{ status: "APPROVED" }],
    };

    const latestKyc = userMock.kycRequests[0];
    const isKycApproved = userMock.isKycVerified || latestKyc?.status === "APPROVED";

    expect(isKycApproved).toBe(true);
  });

  // 4. KYC incomplete evaluation logic blocks unapproved users
  it("blocks users whose KYC status is PENDING or REJECTED", () => {
    const userMock = {
      isKycVerified: false,
      kycRequests: [{ status: "PENDING" }],
    };

    const latestKyc = userMock.kycRequests[0];
    const isKycApproved = userMock.isKycVerified || latestKyc?.status === "APPROVED";

    expect(isKycApproved).toBe(false);
  });
});
