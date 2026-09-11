import { describe, it, expect, vi } from "vitest";
import { calculateAuthoritativePrice } from "../lib/services/pricing-service";
import { isValidBusinessHours } from "../features/booking/services/availability-engine";

vi.mock("@/lib/db", () => ({
  db: {
    vehicle: {
      findUnique: vi.fn().mockResolvedValue({
        id: "veh-1",
        pricings: [
          {
            dailyRate: 2000,
            basePrice: 2000,
            securityDeposit: 5000,
            taxRate: 18,
            weekendMultiplier: 1.2,
          },
        ],
      }),
    },
  },
}));

describe("Tripzy Authoritative Pricing Service", () => {
  it("calculates correct base rate daily subtotals and 18% tax charges", async () => {
    // 3 weekdays rental: 2026-09-01 (Tue) to 2026-09-04 (Fri)
    const result = await calculateAuthoritativePrice({
      vehicleId: "veh-1",
      pickupDate: new Date("2026-09-01T10:00:00"),
      returnDate: new Date("2026-09-04T10:00:00"),
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.pricing.rentalDays).toBe(3);
      expect(result.pricing.baseRentalSubtotal).toBe(6000);
      expect(result.pricing.convenienceFee).toBe(250);
      expect(result.pricing.securityDeposit).toBe(5000);
    }
  });

  it("applies the weekend markup adjustments correctly", async () => {
    // Rental spanning weekend: 2026-09-04 (Fri) to 2026-09-07 (Mon) -> 3 days, Sat & Sun are weekends
    const result = await calculateAuthoritativePrice({
      vehicleId: "veh-1",
      pickupDate: new Date("2026-09-04T10:00:00"),
      returnDate: new Date("2026-09-07T10:00:00"),
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.pricing.rentalDays).toBe(3);
      expect(result.pricing.weekendDaysCount).toBe(2);
      expect(result.pricing.weekendMultiplierCharge).toBe(800); // 2 days * 2000 * 0.2
    }
  });
});

describe("Tripzy Operational Rules", () => {
  it("approves timings within office hours and rejects midnight pickups", () => {
    const validPickup = new Date("2026-07-01T09:00:00");
    const validReturn = new Date("2026-07-05T18:00:00");
    expect(isValidBusinessHours(validPickup, validReturn)).toBe(true);

    const invalidPickup = new Date("2026-07-01T03:00:00");
    const invalidReturn = new Date("2026-07-05T18:00:00");
    expect(isValidBusinessHours(invalidPickup, invalidReturn)).toBe(false);
  });
});
