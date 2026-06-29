"use client";

import * as React from "react";
import { Clock, ShieldAlert, Sparkles, MapPin, BadgeCheck, Ban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/providers/app-provider";
import { confirmBooking, cancelBooking, requestExtension } from "../actions/booking-actions";
import { calculatePricing } from "../services/pricing-engine";

interface DetailProps {
  booking: {
    id: string;
    pickupDate: Date;
    returnDate: Date;
    status: string;
    baseAmount: any;
    totalAmount: any;
    vehicle: {
      brand: { name: string };
      model: { name: string };
      pricings: Array<{ basePrice: any; securityDeposit: any }>;
    };
    pickupLocation: { name: string };
    dropLocation: { name: string };
  };
}

export function BookingDetailView({ booking }: DetailProps) {
  const { showToast } = useToast();
  const [status, setStatus] = React.useState(booking.status);
  const [timeLeft, setTimeLeft] = React.useState(600); // 10 minute lock countdown mock

  const dailyRate = booking.vehicle.pricings[0]?.basePrice?.toNumber() || 3000;
  const deposit = booking.vehicle.pricings[0]?.securityDeposit?.toNumber() || 5000;

  const durationDays = Math.max(
    1,
    Math.ceil((booking.returnDate.getTime() - booking.pickupDate.getTime()) / (1000 * 60 * 60 * 24))
  );

  const pricingBreakdown = calculatePricing(durationDays, dailyRate, deposit);

  React.useEffect(() => {
    if (status !== "PENDING") return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [status]);

  const handleConfirm = async () => {
    const res = await confirmBooking(booking.id);
    if (res.success) {
      setStatus("CONFIRMED");
      showToast("Reservation confirmed successfully", "success");
    }
  };

  const handleCancel = async () => {
    const res = await cancelBooking({ bookingId: booking.id, reason: "User request" });
    if (res.success) {
      setStatus("CANCELLED");
      showToast("Booking cancelled", "info");
    }
  };

  const handleExtend = async () => {
    const res = await requestExtension({ bookingId: booking.id, extraDays: 2 });
    if (res.success) {
      showToast("Booking extended by 2 days", "success");
      setTimeout(() => window.location.reload(), 1500);
    } else {
      showToast(res.error || "Extension conflicted", "error");
    }
  };

  return (
    <div className="grid gap-8 md:grid-cols-3">
      {/* Summary Box */}
      <div className="md:col-span-2 space-y-6">
        <div className="rounded-xl border border-border bg-card/30 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="font-display text-xl font-bold">Booking Details</h1>
            <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
              status === "CONFIRMED" ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
            }`}>
              {status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm text-foreground/80">
            <div>
              <span className="text-xs text-muted-foreground block">Vehicle</span>
              <span className="font-semibold">{booking.vehicle.brand.name} {booking.vehicle.model.name}</span>
            </div>
            <div>
              <span className="text-xs text-muted-foreground block">City Route</span>
              <span className="font-semibold flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" /> {booking.pickupLocation.name} &rarr; {booking.dropLocation.name}
              </span>
            </div>
          </div>
        </div>

        {/* Pricing breakdown list */}
        <div className="rounded-xl border border-border bg-card/30 p-6 space-y-4">
          <h3 className="font-display font-semibold text-base">Cost Breakdown</h3>
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex justify-between">
              <span>Rental duration ({pricingBreakdown.rentalDays} Days)</span>
              <span>&#8377;{pricingBreakdown.baseRentalSubtotal}</span>
            </div>
            {pricingBreakdown.weekendMultiplierCharge > 0 && (
              <div className="flex justify-between text-amber-500">
                <span>Weekend pricing multiplier (20%)</span>
                <span>+&#8377;{pricingBreakdown.weekendMultiplierCharge}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>GST (18% standard)</span>
              <span>&#8377;{pricingBreakdown.taxAmount}</span>
            </div>
            <div className="flex justify-between border-t border-border/50 pt-3 text-foreground font-bold">
              <span>Total estimate</span>
              <span>&#8377;{pricingBreakdown.totalEstimate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Lock Sidebar triggers */}
      <div className="h-fit rounded-xl border border-border bg-card/45 p-6 space-y-4">
        {status === "PENDING" && (
          <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4 text-center space-y-2">
            <span className="text-xs font-semibold text-amber-500 flex items-center justify-center gap-1">
              <Clock className="h-4 w-4" /> Checkout Reservation Lock
            </span>
            <div className="text-xl font-bold font-mono text-foreground">
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
            </div>
            <p className="text-[10px] text-muted-foreground">
              Complete payment checkouts before lock expires to secure vehicle.
            </p>
          </div>
        )}

        {status === "PENDING" ? (
          <Button onClick={handleConfirm} className="w-full">
            <BadgeCheck className="mr-1.5 h-4 w-4" /> Confirm Booking
          </Button>
        ) : (
          <Button onClick={handleExtend} variant="outline" className="w-full">
            Request Trip Extension (+2 Days)
          </Button>
        )}

        {status !== "CANCELLED" && (
          <Button onClick={handleCancel} variant="ghost" className="w-full text-destructive hover:bg-destructive/10">
            <Ban className="mr-1.5 h-4 w-4" /> Cancel Booking
          </Button>
        )}
      </div>
    </div>
  );
}
export type BookingDetailViewPropsType = DetailProps;
