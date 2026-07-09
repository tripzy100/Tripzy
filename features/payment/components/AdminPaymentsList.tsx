"use client";

import * as React from "react";
import { AlertCircle, RotateCcw, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/providers/app-provider";
import { triggerRefund } from "../actions/payment-actions";

interface PaymentItem {
  id: string;
  totalAmount: any;
  paymentStatus: string;
  gatewayOrderId: string | null;
  booking: { bookingNumber: string };
}

export function AdminPaymentsList({ initialPayments }: { initialPayments: PaymentItem[] }) {
  const { showToast } = useToast();
  const [payments, setPayments] = React.useState(initialPayments);

  const handleRefund = async (id: string, amount: number) => {
    const res = await triggerRefund({
      paymentId: id,
      amount,
      reason: "Manual admin refund trigger",
    });

    if (res.success) {
      showToast("Refund completed successfully", "success");
      setPayments((prev) =>
        prev.map((p) => (p.id === id ? { ...p, paymentStatus: "REFUNDED" } : p)),
      );
    } else {
      showToast(res.error || "Refund failure", "error");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
        Payments & Financial Auditing
      </h1>

      {/* Audit table */}
      <div className="overflow-hidden rounded-xl border border-border bg-card/30">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-xs font-semibold uppercase text-muted-foreground">
              <th className="p-4">Gateway Order ID</th>
              <th className="p-4">Booking Ref</th>
              <th className="p-4">Paid Amount</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-sm text-foreground/80">
            {payments.map((p) => (
              <tr key={p.id} className="transition-colors hover:bg-muted/10">
                <td className="p-4 font-mono text-xs font-semibold text-foreground">
                  {p.gatewayOrderId || "N/A"}
                </td>
                <td className="p-4">{p.booking.bookingNumber}</td>
                <td className="p-4 font-semibold text-foreground">
                  &#8377;{Number(p.totalAmount)}
                </td>
                <td className="p-4">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      p.paymentStatus === "COMPLETED"
                        ? "bg-emerald-500/10 text-emerald-500"
                        : "bg-amber-500/10 text-amber-500"
                    }`}
                  >
                    {p.paymentStatus}
                  </span>
                </td>
                <td className="flex justify-end gap-2 p-4 text-right">
                  {p.paymentStatus === "COMPLETED" && (
                    <Button
                      onClick={() => handleRefund(p.id, Number(p.totalAmount))}
                      size="sm"
                      variant="outline"
                    >
                      <RotateCcw className="mr-1 h-3.5 w-3.5" /> Refund
                    </Button>
                  )}
                  {p.paymentStatus === "REFUNDED" && (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <ShieldCheck className="h-4.5 w-4.5 text-emerald-500" /> Refunded Completed
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export type AdminPaymentsListPropsType = { initialPayments: PaymentItem[] };
