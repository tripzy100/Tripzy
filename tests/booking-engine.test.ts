import { describe, it, expect, vi } from "vitest";
import { calculatePricing } from "../features/booking/services/pricing-engine";
import { isValidBusinessHours } from "../features/booking/services/availability-engine";

describe("Tripzy Booking Pricing Engine", () => {
  it("calculates correct base rate daily subtotals and 18% tax charges", () => {
    // 3 days rental * 2000 base daily rate + 5000 security deposit
    const result = calculatePricing(3, 2000, 5000, 0);

    expect(result.rentalDays).toBe(3);
    expect(result.baseRentalSubtotal).toBe(6000);
    expect(result.taxAmount).toBe(1080); // 18% GST of 6000
    expect(result.totalEstimate).toBe(12330); // 6000 subtotal + 5000 deposit + 1080 tax + 250 fee
  });

  it("applies the 20% weekend markup adjustments correctly", () => {
    // 3 days rental * 2000 daily base rate, with 1 weekend day
    const result = calculatePricing(3, 2000, 5000, 1);

    expect(result.baseRentalSubtotal).toBe(6000);
    expect(result.weekendMultiplierCharge).toBe(400); // 1 day * 2000 * 20% markup
    expect(result.taxAmount).toBe(1152); // 18% of (6000 subtotal + 400 markup)
    expect(result.totalEstimate).toBe(12802); // 6400 + 5000 + 1152 + 250 fee
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
