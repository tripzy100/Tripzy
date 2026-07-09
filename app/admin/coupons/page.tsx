import { db } from "@/lib/db";
import { Tag, Check, X } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminCouponsPage() {
  const coupons = await db.coupon.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-gradient font-display text-2xl font-bold tracking-tight">
          Promotional Vouchers
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage flat discounts, percentage referral vouchers, minimum booking value restrictions,
          and coupon campaigns.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card/30">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-xs font-semibold uppercase text-muted-foreground">
              <th className="p-4">Coupon Code</th>
              <th className="p-4">Discount Type</th>
              <th className="p-4">Value</th>
              <th className="p-4">Min Booking Value</th>
              <th className="p-4">Active</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-foreground/80">
            {coupons.length > 0 ? (
              coupons.map((c) => (
                <tr key={c.id} className="hover:bg-muted/10">
                  <td className="flex items-center gap-1.5 p-4 font-mono font-semibold text-foreground">
                    <Tag className="h-3.5 w-3.5 text-primary" /> {c.code}
                  </td>
                  <td className="p-4">{c.type}</td>
                  <td className="p-4 font-semibold">
                    {c.type === "PERCENTAGE" ? `${c.value}%` : `₹${c.value}`}
                  </td>
                  <td className="p-4">
                    {c.minBookingValue ? `₹${Number(c.minBookingValue)}` : "None"}
                  </td>
                  <td className="p-4">
                    {c.active ? (
                      <span className="inline-flex rounded-full bg-emerald-500/10 p-1 text-emerald-500">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                    ) : (
                      <span className="inline-flex rounded-full bg-destructive/10 p-1 text-destructive">
                        <X className="h-3.5 w-3.5" />
                      </span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-8 text-center text-xs text-muted-foreground">
                  No promotional voucher rules configured in database.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export type AdminCouponsPagePropsType = typeof AdminCouponsPage;
