import { db } from "@/lib/db";
import { CouponType } from "@prisma/client";

/**
 * Validates a discount coupon code against user and booking parameters.
 */
export async function validateCoupon(code: string, bookingValue: number, userId: string) {
  const coupon = await db.coupon.findUnique({
    where: { code: code.toUpperCase() },
    include: { usages: { where: { userId } } },
  });

  if (!coupon || !coupon.active) return { success: false, error: "Invalid or inactive coupon" };

  const now = new Date();
  if (now < coupon.startDate || now > coupon.endDate) {
    return { success: false, error: "Coupon has expired or is not yet active" };
  }

  if (coupon.minBookingValue && bookingValue < Number(coupon.minBookingValue)) {
    return { success: false, error: `Minimum booking value of ${coupon.minBookingValue} required` };
  }

  if (coupon.usages.length >= coupon.usageLimitPerUser) {
    return { success: false, error: "Per-user usage limit reached for this coupon" };
  }

  const discountAmount = calculateDiscount(coupon, bookingValue);
  return { success: true, couponId: coupon.id, discountAmount };
}

/**
 * Evaluates flat vs percentage coupon discounts.
 */
function calculateDiscount(coupon: any, bookingValue: number): number {
  if (coupon.type === CouponType.FLAT) {
    return Math.min(Number(coupon.value), bookingValue);
  }

  // PERCENTAGE type discount
  const computed = bookingValue * (Number(coupon.value) / 100);
  if (coupon.maxDiscountAmount) {
    return Math.min(computed, Number(coupon.maxDiscountAmount));
  }
  return computed;
}
export type ValidateCouponType = typeof validateCoupon;
