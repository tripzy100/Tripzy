"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Fuel,
  Users,
  ShieldAlert,
  BadgeInfo,
  CheckCircle,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/providers/app-provider";
import { createClient } from "@/lib/supabase-browser";

interface DetailViewProps {
  vehicle: {
    id: string;
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
  pickupLocations: Array<{ id: string; name: string; address: string }>;
  dropLocations: Array<{ id: string; name: string; address: string }>;
}

export function VehicleDetailView({ vehicle, pickupLocations = [], dropLocations = [] }: DetailViewProps) {
  const router = useRouter();
  const { showToast } = useToast();

  const rate = vehicle.pricings[0]?.basePrice?.toNumber() || 2500;
  const deposit = vehicle.pricings[0]?.securityDeposit?.toNumber() || 5000;
  const extraCharge = vehicle.pricings[0]?.extraKmCharge?.toNumber() || 15;

  const getTomorrowString = (offset = 1) => {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    return d.toISOString().split("T")[0];
  };

  const [pickupLocId, setPickupLocId] = React.useState(pickupLocations[0]?.id || "");
  const [dropLocId, setDropLocId] = React.useState(dropLocations[0]?.id || "");
  const [pickupDate, setPickupDate] = React.useState(getTomorrowString(1));
  const [returnDate, setReturnDate] = React.useState(getTomorrowString(2));

  React.useEffect(() => {
    if (pickupLocations.length > 0 && !pickupLocId) setPickupLocId(pickupLocations[0].id);
    if (dropLocations.length > 0 && !dropLocId) setDropLocId(dropLocations[0].id);
  }, [pickupLocations, dropLocations]);

  return (
    <div className="space-y-8">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link href="/" className="transition-colors hover:text-foreground">
          Home
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/cars" className="transition-colors hover:text-foreground">
          Fleet
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="font-medium text-foreground">
          {vehicle.brand.name} {vehicle.model.name}
        </span>
      </nav>

      {/* Visual Header Banner */}
      <div className="relative flex h-64 items-center justify-center overflow-hidden rounded-2xl bg-muted/60 md:h-96">
        <img
          src={`/cars/${(vehicle.brand.name + "-" + vehicle.model.name).toLowerCase().replace(/\s+/g, "-")}.png`}
          alt={`${vehicle.brand.name} ${vehicle.model.name}`}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Specs and Details columns */}
        <div className="space-y-8 md:col-span-2">
          <div>
            <h1 className="text-gradient font-display text-3xl font-extrabold tracking-tight">
              {vehicle.brand.name} {vehicle.model.name}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Stationed in {vehicle.city.name} &bull; Verified plate {vehicle.plateNumber}
            </p>
          </div>

          {/* Quick Specs Grid */}
          <div className="grid grid-cols-2 gap-4 border-b border-t border-border/60 py-6 sm:grid-cols-3">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-xs uppercase text-muted-foreground">Capacity</div>
                <div className="text-sm font-semibold">5 Seater</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Fuel className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-xs uppercase text-muted-foreground">Fuel Type</div>
                <div className="text-sm font-semibold">{vehicle.fuelType}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <BadgeInfo className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-xs uppercase text-muted-foreground">Transmission</div>
                <div className="text-sm font-semibold">{vehicle.transmission}</div>
              </div>
            </div>
          </div>

          {/* Policies details */}
          <div className="space-y-4">
            <h3 className="font-display text-lg font-bold text-foreground">Rental Policies</h3>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4.5 w-4.5 mt-0.5 shrink-0 text-emerald-500" />
                <span>
                  <strong>Fuel Policy:</strong> Like-to-like. Return the vehicle matching the same
                  tank level as pickup.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4.5 w-4.5 mt-0.5 shrink-0 text-emerald-500" />
                <span>
                  <strong>Kilometer limit:</strong> Includes 120km daily mileage allowance. Excess
                  mileage is charged at &#8377;{extraCharge}/km.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Sticky booking side box */}
        <div className="h-fit rounded-xl border border-border bg-card/45 p-6 shadow-sm space-y-4">
          <h3 className="font-display text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Reserve Vehicle
          </h3>

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Pickup Location</label>
              <select
                value={pickupLocId}
                onChange={(e) => setPickupLocId(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {pickupLocations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Drop Location</label>
              <select
                value={dropLocId}
                onChange={(e) => setDropLocId(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {dropLocations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Pickup Date</label>
                <input
                  type="date"
                  value={pickupDate}
                  min={getTomorrowString(1)}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Return Date</label>
                <input
                  type="date"
                  value={returnDate}
                  min={pickupDate || getTomorrowString(2)}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2 border-t border-border/50 pt-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Daily rate</span>
              <span className="font-semibold text-foreground">&#8377;{rate}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Refundable security deposit</span>
              <span className="font-semibold text-foreground">&#8377;{deposit}</span>
            </div>
          </div>

          <Button
            className="w-full"
            onClick={async () => {
              if (!pickupLocId || !dropLocId || !pickupDate || !returnDate) {
                showToast("Please fill in all booking details", "error");
                return;
              }
              const p = new Date(pickupDate);
              const r = new Date(returnDate);
              if (p >= r) {
                showToast("Return date must be after pickup date", "error");
                return;
              }

              const supabaseClient = createClient();
              const { data: { session } } = await supabaseClient.auth.getSession();
              const destUrl = `/checkout?vehicleId=${vehicle.id}&pickupLocationId=${pickupLocId}&dropLocationId=${dropLocId}&pickupDate=${pickupDate}&returnDate=${returnDate}`;

              if (!session) {
                showToast("Please sign in to complete your booking", "info");
                router.push(`/auth/login?callbackUrl=${encodeURIComponent(destUrl)}`);
              } else {
                router.push(destUrl);
              }
            }}
          >
            Initiate Booking Reservation
          </Button>
          <div className="mt-4 flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground">
            <ShieldAlert className="h-3.5 w-3.5" /> Security deposits released in 5 days
          </div>
        </div>
      </div>
    </div>
  );
}

export type VehicleDetailViewPropsType = DetailViewProps;
