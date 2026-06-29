"use client";

import { Fuel, Users, ShieldAlert, BadgeInfo, CheckCircle, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DetailViewProps {
  vehicle: {
    plateNumber: string;
    transmission: string;
    fuelType: string;
    color: string;
    brand: { name: string };
    model: { name: string };
    city: { name: string };
    pricings: Array<{
      basePrice: any;
      securityDeposit: any;
      extraKmCharge: any;
    }>;
  };
}

export function VehicleDetailView({ vehicle }: DetailViewProps) {
  const rate = vehicle.pricings[0]?.basePrice?.toNumber() || 2500;
  const deposit = vehicle.pricings[0]?.securityDeposit?.toNumber() || 5000;
  const extraCharge = vehicle.pricings[0]?.extraKmCharge?.toNumber() || 15;

  return (
    <div className="space-y-8">
      {/* Visual Header Banner */}
      <div className="rounded-2xl bg-muted/60 h-64 md:h-96 flex items-center justify-center text-sm font-mono text-muted-foreground">
        {vehicle.brand.name} {vehicle.model.name} Media Gallery Placeholder
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Specs and Details columns */}
        <div className="md:col-span-2 space-y-8">
          <div>
            <h1 className="font-display text-3xl font-extrabold tracking-tight text-gradient">
              {vehicle.brand.name} {vehicle.model.name}
            </h1>
            <p className="text-sm text-muted-foreground mt-2">
              Stationed in {vehicle.city.name} &bull; Verified plate {vehicle.plateNumber}
            </p>
          </div>

          {/* Quick Specs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-b border-border/60 py-6">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-xs text-muted-foreground uppercase">Capacity</div>
                <div className="text-sm font-semibold">5 Seater</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Fuel className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-xs text-muted-foreground uppercase">Fuel Type</div>
                <div className="text-sm font-semibold">{vehicle.fuelType}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <BadgeInfo className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-xs text-muted-foreground uppercase">Transmission</div>
                <div className="text-sm font-semibold">{vehicle.transmission}</div>
              </div>
            </div>
          </div>

          {/* Policies details */}
          <div className="space-y-4">
            <h3 className="font-display text-lg font-bold text-foreground">Rental Policies</h3>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4.5 w-4.5 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Fuel Policy:</strong> Like-to-like. Return the vehicle matching the same tank level as pickup.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4.5 w-4.5 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Kilometer limit:</strong> Includes 120km daily mileage allowance. Excess mileage is charged at &#8377;{extraCharge}/km.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Sticky booking side box */}
        <div className="h-fit rounded-xl border border-border bg-card/45 p-6 shadow-sm">
          <h3 className="font-display text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
            Trip Summary
          </h3>
          <div className="space-y-4 border-b border-border/50 pb-4 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Daily rate</span>
              <span className="font-semibold text-foreground">&#8377;{rate}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Refundable security deposit</span>
              <span className="font-semibold text-foreground">&#8377;{deposit}</span>
            </div>
          </div>
          <Button className="w-full">Initiate Booking Reservation</Button>
          <div className="mt-4 flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground">
            <ShieldAlert className="h-3.5 w-3.5" /> Security deposits released in 5 days
          </div>
        </div>
      </div>
    </div>
  );
}
export type VehicleDetailViewPropsType = DetailViewProps;
