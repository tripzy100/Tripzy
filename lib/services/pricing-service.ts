import { db } from "@/lib/db";
import { validateCoupon } from "@/features/payment/services/coupon-engine";

export interface PricingRequestParams {
  vehicleId: string;
  pickupDate: Date | string;
  returnDate: Date | string;
  couponCode?: string;
  userId?: string;
}

export interface AuthoritativePriceBreakdown {
  rentalDays: number;
  dailyRate: number;
  baseRentalSubtotal: number;
  weekendDaysCount: number;
  weekendMultiplierCharge: number;
  subtotalWithSurcharges: number;
  couponCode?: string;
  discountAmount: number;
  netRentalSubtotal: number;
  convenienceFee: number;
  taxRate: number;
  taxAmount: number;
  securityDeposit: number;
  finalAmount: number;
}

/**
 * Counts the number of weekend days (Saturday=6, Sunday=0) between pickup and return.
 */
function countWeekendDays(start: Date, end: Date): number {
  let count = 0;
  const current = new Date(start.getTime());
  while (current < end) {
    const day = current.getDay();
    if (day === 0 || day === 6) {
      count++;
    }
    current.setDate(current.getDate() + 1);
  }
  return count;
}

/**
 * Single authoritative server-side pricing engine.
 * Calculates all rental fees, weekend multipliers, GST taxes, security deposits,
 * and valid coupon discounts directly from database records.
 */
export async function calculateAuthoritativePrice(
  params: PricingRequestParams,
): Promise<{ success: true; pricing: AuthoritativePriceBreakdown } | { success: false; error: string }> {
  const pDate = new Date(params.pickupDate);
  const rDate = new Date(params.returnDate);

  if (isNaN(pDate.getTime()) || isNaN(rDate.getTime())) {
    return { success: false, error: "Invalid pickup or return date format" };
  }

  if (rDate <= pDate) {
    return { success: false, error: "Return date must be after pickup date" };
  }

  const durationMs = rDate.getTime() - pDate.getTime();
  const rentalDays = Math.max(1, Math.ceil(durationMs / (1000 * 60 * 60 * 24)));

  const vehicle = await db.vehicle.findUnique({
    where: { id: params.vehicleId },
    include: {
      pricings: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  if (!vehicle) {
    return { success: false, error: "Vehicle not found" };
  }

  const pricingRecord = vehicle.pricings[0];
  const dailyRate = pricingRecord ? Number(pricingRecord.dailyRate || pricingRecord.basePrice) : 2500;
  const baseSecurityDeposit = pricingRecord ? Number(pricingRecord.securityDeposit) : 5000;
  const taxRate = pricingRecord ? Number(pricingRecord.taxRate) / 100 : 0.18;
  const weekendMultiplier = pricingRecord ? Number(pricingRecord.weekendMultiplier) : 1.2;

  const baseRentalSubtotal = rentalDays * dailyRate;

  // Weekend multiplier calculation
  const weekendDaysCount = countWeekendDays(pDate, rDate);
  const weekendMarkupRate = Math.max(0, weekendMultiplier - 1.0);
  const weekendMultiplierCharge = Math.round(weekendDaysCount * dailyRate * weekendMarkupRate);

  const subtotalWithSurcharges = baseRentalSubtotal + weekendMultiplierCharge;

  // Coupon validation
  let discountAmount = 0;
  let validCouponCode: string | undefined = undefined;

  if (params.couponCode && params.couponCode.trim() !== "") {
    const cleanCode = params.couponCode.trim().toUpperCase();
    const couponVal = await validateCoupon(
      cleanCode,
      subtotalWithSurcharges,
      params.userId || "anonymous",
    );
    if (couponVal.success) {
      discountAmount = couponVal.discountAmount || 0;
      validCouponCode = cleanCode;
    }
  }

  const netRentalSubtotal = Math.max(0, subtotalWithSurcharges - discountAmount);
  const convenienceFee = 250; // Standard INR platform fee
  const taxAmount = Math.round((netRentalSubtotal + convenienceFee) * taxRate);
  const finalAmount = netRentalSubtotal + convenienceFee + taxAmount + baseSecurityDeposit;

  return {
    success: true,
    pricing: {
      rentalDays,
      dailyRate,
      baseRentalSubtotal,
      weekendDaysCount,
      weekendMultiplierCharge,
      subtotalWithSurcharges,
      couponCode: validCouponCode,
      discountAmount: Math.round(discountAmount),
      netRentalSubtotal: Math.round(netRentalSubtotal),
      convenienceFee,
      taxRate,
      taxAmount,
      securityDeposit: baseSecurityDeposit,
      finalAmount: Math.round(finalAmount),
    },
  };
}
