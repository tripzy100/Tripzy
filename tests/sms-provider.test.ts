import { describe, it, expect, vi, beforeEach } from "vitest";
import { sendSms } from "../lib/sms";
import { db } from "../lib/db";

vi.mock("../lib/db", () => ({
  db: {
    smsLog: {
      create: vi.fn().mockResolvedValue({ id: "log-1" }),
    },
  },
}));

describe("Provider-Agnostic SMS Dispatch & Non-Blocking Behavior Suite", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...originalEnv };
  });

  it("1. safely no-ops and skips delivery when SMS_PROVIDER is 'none'", async () => {
    process.env.SMS_PROVIDER = "none";

    const result = await sendSms("user-1", "+919876543210", "Test OTP: 123456");

    expect(result.success).toBe(false);
    expect(result.skipped).toBe(true);
    expect(result.error).toContain("SMS delivery is disabled");
    expect(db.smsLog.create).not.toHaveBeenCalled();
  });

  it("2. safely no-ops when SMS_PROVIDER is unconfigured in environment", async () => {
    delete process.env.SMS_PROVIDER;

    const result = await sendSms("user-1", "+919876543210", "Test OTP: 123456");

    expect(result.skipped).toBe(true);
    expect(db.smsLog.create).not.toHaveBeenCalled();
  });

  it("3. logs to console and records log without external API call when SMS_PROVIDER is 'console'", async () => {
    process.env.SMS_PROVIDER = "console";

    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    const result = await sendSms("user-1", "+919876543210", "Your OTP is 654321");

    expect(result.success).toBe(true);
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("SMS Console Provider"));
    expect(db.smsLog.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        recipientPhone: "+919876543210",
        message: "Your OTP is 654321",
        status: "SENT",
      }),
    });

    consoleSpy.mockRestore();
  });

  it("4. handles unsupported or unknown provider gracefully with non-blocking skip", async () => {
    process.env.SMS_PROVIDER = "unknown_vendor";

    const result = await sendSms("user-1", "+919876543210", "Test OTP: 999999");

    expect(result.success).toBe(false);
    expect(result.skipped).toBe(true);
    expect(result.error).toContain("Unsupported SMS provider: unknown_vendor");
    expect(db.smsLog.create).not.toHaveBeenCalled();
  });
});
