"use client";

import * as React from "react";
import Link from "next/link";
import { Car, Lock, Search, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "./StatusBadge";

interface SelectBookCarCardProps {
  isKycApproved: boolean;
  kycStatusText?: string;
}

export function SelectBookCarCard({ isKycApproved }: SelectBookCarCardProps) {
  const [showTooltip, setShowTooltip] = React.useState(false);

  return (
    <div className="flex flex-col justify-between space-y-6 rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:border-border/80">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`rounded-xl p-2 ${isKycApproved ? "bg-primary/10 text-primary" : "bg-muted p-2 text-muted-foreground"}`}>
              <Car className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-foreground">3. Select & Book Car</h3>
              <p className="text-xs text-muted-foreground">Self-drive vehicle selection</p>
            </div>
          </div>
          <StatusBadge status={isKycApproved ? "Approved" : "Locked"} />
        </div>

        {/* Lock or Unlock state box */}
        {!isKycApproved ? (
          <div className="space-y-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 dark:bg-amber-500/10">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400">
              <Lock className="h-4 w-4" /> KYC Required before booking
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Complete KYC to unlock bookings. Our safety guidelines require verified government ID & valid driving license before reserving a vehicle.
            </p>
          </div>
        ) : (
          <div className="space-y-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 dark:bg-emerald-500/10">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-500">
              <CheckCircle2 className="h-4 w-4" /> Vehicle Booking Unlocked!
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Your profile and KYC credentials are verified. You can now browse our self-drive fleet, compare prices, and reserve immediately.
            </p>
          </div>
        )}

        {/* Vehicle Categories Quick Links */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-lg border border-border/50 bg-card/50 p-2.5 space-y-1">
            <div className="font-semibold text-foreground">SUVs & 4x4s</div>
            <div className="text-[11px] text-muted-foreground">Thar, Creta, Fortuner</div>
          </div>
          <div className="rounded-lg border border-border/50 bg-card/50 p-2.5 space-y-1">
            <div className="font-semibold text-foreground">Sedans & Compact</div>
            <div className="text-[11px] text-muted-foreground">Verna, Swift, Baleno</div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-2 border-t border-border/50">
        {isKycApproved ? (
          <div className="grid grid-cols-2 gap-2">
            <Link href="/cars" className="w-full">
              <Button variant="outline" className="w-full text-xs">
                <Search className="mr-1 h-3.5 w-3.5" /> Search Cars
              </Button>
            </Link>
            <Link href="/cars" className="w-full">
              <Button className="w-full text-xs">
                Book Now <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        ) : (
          <div
            className="relative"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            {showTooltip && (
              <div className="absolute -top-10 left-1/2 z-20 -translate-x-1/2 rounded-md bg-foreground px-3 py-1.5 text-[11px] font-medium text-background shadow-md whitespace-nowrap">
                Complete KYC to unlock car bookings
              </div>
            )}
            <Button
              className="w-full cursor-not-allowed opacity-60"
              disabled
              aria-disabled="true"
            >
              <Lock className="mr-1.5 h-4 w-4" /> Book Car (Complete KYC Required)
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
