import { Decimal } from "@prisma/client/runtime/library";

export interface PricingBreakdown {
  rentalDays: number;
  baseRateDaily: number;
  baseRentalSubtotal: number;
  weekendMultiplierCharge: number;
  securityDeposit: number;
  convenienceFee: number;
  taxAmount: number;
  totalEstimate: number;
}

/**
 * Calculates a detailed pricing breakdown for a booking duration.
 */
export function calculatePricing(
  days: number,
  dailyRate: number,
  securityDeposit: number,
  weekendDaysCount = 0
): PricingBreakdown {
  const baseSubtotal = days * dailyRate;
  
  // Apply 20% multiplier markup to weekend rental segments
  const weekendSubtotal = weekendDaysCount * dailyRate * 0.2;
  const subtotalWithMarkup = baseSubtotal + weekendSubtotal;
  
  const convenienceFee = 250; // standard platform fee in INR
  const taxRate = 0.18; // 18% GST standard in India
  const taxAmount = Math.round(subtotalWithMarkup * taxRate);
  
  const totalEstimate = subtotalWithMarkup + convenienceFee + taxAmount + securityDeposit;

  return {
    rentalDays: days,
    baseRateDaily: dailyRate,
    baseRentalSubtotal: baseSubtotal,
    weekendMultiplierCharge: Math.round(weekendSubtotal),
    securityDeposit,
    convenienceFee,
    taxAmount,
    totalEstimate: Math.round(totalEstimate),
  };
}
export type CalculatePricingType = typeof calculatePricing;
