"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Fuel,
  Users,
  ShieldCheck,
  CheckCircle,
  ChevronRight,
  MapPin,
  Calendar,
  Clock,
  FileText,
  AlertCircle,
  Activity,
  ArrowRight,
  Shield,
  CreditCard,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CarImage } from "@/components/cars/car-image";
import { useToast } from "@/providers/app-provider";
import { createClient } from "@/lib/supabase-browser";
import { AuthoritativePriceBreakdown } from "@/lib/services/pricing-service";

interface DetailViewProps {
  vehicle: {
    id: string;
    plateNumber: string;
    transmission: string;
    fuelType: string;
    color: string;
    status: string;
    brand: { name: string };
    model: { name: string };
    category?: { name: string };
    city: { name: string };
    pricings: Array<{
      basePrice: any;
      dailyRate?: any;
      securityDeposit: any;
      extraKmCharge: any;
    }>;
  };
  pickupLocations: Array<{ id: string; name: string; address: string }>;
  dropLocations: Array<{ id: string; name: string; address: string }>;
  relatedVehicles?: Array<{
    id: string;
    transmission: string;
    fuelType: string;
    brand: { name: string };
    model: { name: string };
    category?: { name: string };
    pricings: Array<{ dailyRate?: any; basePrice?: any }>;
  }>;
}

export function VehicleDetailView({
  vehicle,
  pickupLocations = [],
  dropLocations = [],
  relatedVehicles = [],
}: DetailViewProps) {
  const router = useRouter();
  const { showToast } = useToast();

  const pricing = vehicle.pricings[0];
  const rate = pricing
    ? typeof pricing.dailyRate?.toNumber === "function"
      ? pricing.dailyRate.toNumber()
      : typeof pricing.basePrice?.toNumber === "function"
      ? pricing.basePrice.toNumber()
      : Number(pricing.dailyRate || pricing.basePrice) || 2499
    : 2499;

  const deposit = pricing
    ? typeof pricing.securityDeposit?.toNumber === "function"
      ? pricing.securityDeposit.toNumber()
      : Number(pricing.securityDeposit) || 5000
    : 5000;

  const extraKmCharge = pricing
    ? typeof pricing.extraKmCharge?.toNumber === "function"
      ? pricing.extraKmCharge.toNumber()
      : Number(pricing.extraKmCharge) || 15
    : 15;

  const getDefaultDate = (offsetDays = 1) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    return d.toISOString().split("T")[0];
  };

  const [pickupLocId, setPickupLocId] = React.useState(pickupLocations[0]?.id || "");
  const [dropLocId, setDropLocId] = React.useState(dropLocations[0]?.id || "");
  const [pickupDate, setPickupDate] = React.useState(getDefaultDate(1));
  const [returnDate, setReturnDate] = React.useState(getDefaultDate(3));
  const [pickupTime, setPickupTime] = React.useState("09:00");
  const [returnTime, setReturnTime] = React.useState("18:00");

  // Authoritative Pricing State (Fetched directly from server pricing-service)
  const [authoritativePricing, setAuthoritativePricing] = React.useState<AuthoritativePriceBreakdown | null>(null);
  const [isLoadingPricing, setIsLoadingPricing] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (pickupLocations.length > 0 && !pickupLocId) setPickupLocId(pickupLocations[0].id);
    if (dropLocations.length > 0 && !dropLocId) setDropLocId(dropLocations[0].id);
  }, [pickupLocations, dropLocations]);

  // Fetch Authoritative Server Pricing Estimate whenever dates or times change
  React.useEffect(() => {
    if (!vehicle.id || !pickupDate || !returnDate) return;

    const fullPickup = pickupTime ? `${pickupDate}T${pickupTime}` : pickupDate;
    const fullReturn = returnTime ? `${returnDate}T${returnTime}` : returnDate;

    setIsLoadingPricing(true);
    fetch("/api/booking/price", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        vehicleId: vehicle.id,
        pickupDate: fullPickup,
        returnDate: fullReturn,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.pricing) {
          setAuthoritativePricing(data.pricing);
        }
      })
      .catch((err) => console.error("Error fetching authoritative pricing:", err))
      .finally(() => setIsLoadingPricing(false));
  }, [vehicle.id, pickupDate, pickupTime, returnDate, returnTime]);

  const isAvailable = vehicle.status === "AVAILABLE";

  const handleBookingInitiate = async () => {
    if (!isAvailable) {
      showToast("This vehicle is currently unavailable for booking.", "error");
      return;
    }

    if (!pickupLocId || !dropLocId || !pickupDate || !returnDate || !pickupTime || !returnTime) {
      showToast("Please select pickup/drop locations, rental dates, and times.", "error");
      return;
    }

    const p = new Date(`${pickupDate}T${pickupTime}`);
    const r = new Date(`${returnDate}T${returnTime}`);
    if (p >= r) {
      showToast("Return time must be after pickup time.", "error");
      return;
    }

    // Preserve full pickupDate, pickupTime, returnDate, returnTime parameters
    const checkoutParams = new URLSearchParams({
      vehicleId: vehicle.id,
      pickupLocationId: pickupLocId,
      dropLocationId: dropLocId,
      pickupDate,
      pickupTime,
      returnDate,
      returnTime,
    });

    const destUrl = `/checkout?${checkoutParams.toString()}`;

    const supabaseClient = createClient();
    const {
      data: { session },
    } = await supabaseClient.auth.getSession();

    if (!session) {
      showToast("Please sign in to proceed with your booking.", "info");
      router.push(`/auth/login?callbackUrl=${encodeURIComponent(destUrl)}`);
    } else {
      router.push(destUrl);
    }
  };

  const imgSlug = `${vehicle.brand.name}-${vehicle.model.name}`
    .toLowerCase()
    .replace(/\s+/g, "-");

  function getSlug(bName: string, mName: string) {
    return `${bName.toLowerCase()}-${mName.toLowerCase()}-2024-manual-petrol`.replace(
      /\s+/g,
      "-"
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-3.5 py-4 sm:px-6 sm:py-8 lg:px-8 space-y-6 sm:space-y-8 pb-[calc(6rem+env(safe-area-inset-bottom))] lg:pb-8">
      {/* Breadcrumbs Navigation */}
      <nav className="flex items-center gap-1.5 sm:gap-2 text-xs font-semibold text-muted-foreground truncate" aria-label="Breadcrumb">
        <Link href="/" className="transition-colors hover:text-foreground">
          Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" />
        <Link href="/cars" className="transition-colors hover:text-foreground">
          Fleet
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" />
        <span className="text-foreground font-bold">
          {vehicle.brand.name} {vehicle.model.name}
        </span>
      </nav>

      {/* Hero 2-Column Section */}
      <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
        {/* Left Column: Vehicle Studio Photography & Key Highlights (lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm flex items-center justify-center min-h-[280px] sm:min-h-[380px]">
            <CarImage
              src={`/cars/${imgSlug}.png`}
              alt={`${vehicle.brand.name} ${vehicle.model.name}`}
              aspectRatio="video"
              objectFit="contain"
              priority={true}
              className="max-h-[320px] w-auto mx-auto"
            />

            {/* Category Tag */}
            {vehicle.category && (
              <span className="absolute top-4 left-4 rounded-md bg-background/90 px-3 py-1 text-xs font-bold uppercase tracking-wider text-foreground border border-border/60">
                {vehicle.category.name}
              </span>
            )}

            {/* Availability Status Badge */}
            <div className="absolute top-4 right-4">
              {isAvailable ? (
                <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <CheckCircle className="h-3.5 w-3.5" /> Available for Rent
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-md bg-destructive/10 px-3 py-1 text-xs font-bold text-destructive border border-destructive/20">
                  <AlertCircle className="h-3.5 w-3.5" /> Currently Reserved
                </span>
              )}
            </div>
          </div>

          {/* Quick Specifications Grid */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Vehicle Specifications
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1">
              <div className="space-y-1">
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Users className="h-3.5 w-3.5 text-primary" /> Seating
                </span>
                <p className="text-sm font-bold text-foreground">5 Seater</p>
              </div>

              <div className="space-y-1">
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Fuel className="h-3.5 w-3.5 text-primary" /> Fuel Class
                </span>
                <p className="text-sm font-bold text-foreground">{vehicle.fuelType}</p>
              </div>

              <div className="space-y-1">
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Activity className="h-3.5 w-3.5 text-primary" /> Transmission
                </span>
                <p className="text-sm font-bold text-foreground">{vehicle.transmission}</p>
              </div>

              <div className="space-y-1">
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 text-primary" /> City Hub
                </span>
                <p className="text-sm font-bold text-foreground">{vehicle.city?.name || "Ranchi"}</p>
              </div>
            </div>
          </div>

          {/* Requirements Checklist ("What you'll need") */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" /> What You'll Need at Pickup
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm text-foreground font-medium">
              <li className="flex items-start gap-2.5">
                <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                <span>
                  <strong>Original Driving Licence:</strong> Valid physical Indian driving licence.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                <span>
                  <strong>Government ID Proof:</strong> Original Aadhaar Card or Passport for verification.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                <span>
                  <strong>Digital Paperless KYC:</strong> Online verification completed via your Tripzy account.
                </span>
              </li>
            </ul>
          </div>

          {/* Transparent Policies */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" /> Rental Terms & Policies
            </h3>
            <div className="grid gap-3 sm:grid-cols-2 text-xs text-muted-foreground">
              <div className="rounded-lg border border-border/60 p-3.5 bg-background space-y-1">
                <span className="font-bold text-foreground block">Fuel Policy</span>
                <p>Return vehicle with equivalent fuel level as recorded at pickup.</p>
              </div>

              <div className="rounded-lg border border-border/60 p-3.5 bg-background space-y-1">
                <span className="font-bold text-foreground block">Excess Kilometer Charge</span>
                <p>Additional usage beyond rental duration is charged at &#8377;{extraKmCharge}/km.</p>
              </div>

              <div className="rounded-lg border border-border/60 p-3.5 bg-background space-y-1">
                <span className="font-bold text-foreground block">Security Deposit</span>
                <p>Refundable security deposit of &#8377;{deposit.toLocaleString("en-IN")} released back to original payment method after safe return inspection.</p>
              </div>

              <div className="rounded-lg border border-border/60 p-3.5 bg-background space-y-1">
                <span className="font-bold text-foreground block">Cancellation Policy</span>
                <p>Flexible cancellation terms apply as per standard Tripzy rental terms.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Reservation & Authoritative Pricing Panel (lg:col-span-5) */}
        <div className="lg:col-span-5 sticky top-24 space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-md space-y-6">
            {/* Header Title & Daily Rate */}
            <div className="space-y-2 border-b border-border/60 pb-5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                Self-Drive Car Rental
              </span>
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                {vehicle.brand.name} {vehicle.model.name}
              </h1>
              <div className="flex items-baseline gap-2 pt-1">
                <span className="font-display text-3xl font-black text-foreground">
                  &#8377;{rate.toLocaleString("en-IN")}
                </span>
                <span className="text-xs font-semibold text-muted-foreground">/ day base rate</span>
              </div>
            </div>

            {/* Date & Location Controls Form */}
            <div className="space-y-4">
              {/* Pickup Location */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 text-primary" /> Pickup Location
                </label>
                <select
                  value={pickupLocId}
                  onChange={(e) => setPickupLocId(e.target.value)}
                  className="flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-xs font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {pickupLocations.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Drop Location */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 text-primary" /> Return Location
                </label>
                <select
                  value={dropLocId}
                  onChange={(e) => setDropLocId(e.target.value)}
                  className="flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-xs font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {dropLocations.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Pickup Date & Time */}
              <div className="space-y-1.5 min-w-0">
                <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5 text-primary shrink-0" /> Pickup Window
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="flex h-11 w-full min-w-0 rounded-lg border border-input bg-background px-2.5 py-2 text-xs font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                  <div className="relative flex items-center min-w-0">
                    <Clock className="absolute left-2.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                    <input
                      type="time"
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                      className="flex h-11 w-full min-w-0 rounded-lg border border-input bg-background pl-8 pr-2 py-2 text-xs font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </div>
                </div>
              </div>

              {/* Return Date & Time */}
              <div className="space-y-1.5 min-w-0">
                <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5 text-primary shrink-0" /> Return Window
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    value={returnDate}
                    min={pickupDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="flex h-11 w-full min-w-0 rounded-lg border border-input bg-background px-2.5 py-2 text-xs font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                  <div className="relative flex items-center min-w-0">
                    <Clock className="absolute left-2.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                    <input
                      type="time"
                      value={returnTime}
                      onChange={(e) => setReturnTime(e.target.value)}
                      className="flex h-11 w-full min-w-0 rounded-lg border border-input bg-background pl-8 pr-2 py-2 text-xs font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Authoritative Price Calculation Breakdown (From Server pricing-service) */}
            <div className="rounded-xl border border-border/60 bg-background p-4 space-y-2.5 text-xs">
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <span className="font-bold text-foreground">Authoritative Price Breakdown</span>
                {isLoadingPricing && <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />}
              </div>

              {authoritativePricing ? (
                <>
                  <div className="flex justify-between text-muted-foreground">
                    <span>
                      Rental charges (&#8377;{authoritativePricing.dailyRate.toLocaleString("en-IN")} &times; {authoritativePricing.rentalDays} {authoritativePricing.rentalDays === 1 ? "day" : "days"})
                    </span>
                    <span className="font-semibold text-foreground">&#8377;{authoritativePricing.baseRentalSubtotal.toLocaleString("en-IN")}</span>
                  </div>

                  {authoritativePricing.weekendMultiplierCharge > 0 && (
                    <div className="flex justify-between text-amber-600 dark:text-amber-400">
                      <span>Weekend adjustment ({authoritativePricing.weekendDaysCount} weekend {authoritativePricing.weekendDaysCount === 1 ? "day" : "days"})</span>
                      <span className="font-semibold">+&#8377;{authoritativePricing.weekendMultiplierCharge.toLocaleString("en-IN")}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-muted-foreground">
                    <span>Platform Convenience Fee</span>
                    <span className="font-semibold text-foreground">&#8377;{authoritativePricing.convenienceFee.toLocaleString("en-IN")}</span>
                  </div>

                  <div className="flex justify-between text-muted-foreground">
                    <span>GST Tax (18%)</span>
                    <span className="font-semibold text-foreground">&#8377;{authoritativePricing.taxAmount.toLocaleString("en-IN")}</span>
                  </div>

                  <div className="flex justify-between text-muted-foreground border-t border-border/40 pt-1.5">
                    <span>Refundable Security Deposit</span>
                    <span className="font-semibold text-foreground">&#8377;{authoritativePricing.securityDeposit.toLocaleString("en-IN")}</span>
                  </div>

                  <div className="flex justify-between border-t border-border/60 pt-2 font-bold text-sm text-foreground">
                    <span>Estimated Total Amount</span>
                    <span className="text-primary">&#8377;{authoritativePricing.finalAmount.toLocaleString("en-IN")}</span>
                  </div>
                </>
              ) : (
                <div className="py-2 text-center text-xs text-muted-foreground italic">
                  Calculating authoritative price estimate...
                </div>
              )}
            </div>

            {/* Primary Action Button */}
            {isAvailable ? (
              <Button
                size="lg"
                onClick={handleBookingInitiate}
                className="h-12 w-full font-bold text-sm gap-2"
              >
                <span>Book this car</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                variant="secondary"
                size="lg"
                disabled
                className="h-12 w-full font-bold text-sm"
              >
                Unavailable for these dates
              </Button>
            )}

            {/* Trust Badges Bar */}
            <div className="grid grid-cols-3 gap-2 border-t border-border/60 pt-4 text-[10px] font-semibold text-muted-foreground text-center">
              <div className="flex flex-col items-center gap-1">
                <Shield className="h-3.5 w-3.5 text-primary" />
                <span>15-Min Hold Lock</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <CreditCard className="h-3.5 w-3.5 text-primary" />
                <span>Verified Payment</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                <span>24/7 Roadside Assistance</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* "You may also like" (Related Vehicles Section) */}
      {relatedVehicles.length > 0 && (
        <div className="border-t border-border/60 pt-10 space-y-6">
          <div>
            <h2 className="font-display text-xl font-bold tracking-tight text-foreground">
              You may also like
            </h2>
            <p className="text-xs text-muted-foreground">
              Other verified self-drive vehicles available in Ranchi.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {relatedVehicles.map((rel) => {
              const relSlug = getSlug(rel.brand.name, rel.model.name);
              const relImgSlug = `${rel.brand.name}-${rel.model.name}`
                .toLowerCase()
                .replace(/\s+/g, "-");

              const relPricing = rel.pricings?.[0];
              const relRate = relPricing
                ? typeof relPricing.dailyRate?.toNumber === "function"
                  ? relPricing.dailyRate.toNumber()
                  : Number(relPricing.dailyRate || relPricing.basePrice) || 2499
                : 2499;

              return (
                <div
                  key={rel.id}
                  className="group rounded-xl border border-border bg-card p-4 shadow-sm transition-all hover:border-border/90 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="relative p-2">
                      <CarImage
                        src={`/cars/${relImgSlug}.png`}
                        alt={`${rel.brand.name} ${rel.model.name}`}
                        aspectRatio="video"
                        objectFit="contain"
                        className="rounded-lg bg-muted/20"
                      />
                    </div>
                    <div>
                      <h3 className="font-display text-base font-bold text-foreground">
                        {rel.brand.name} {rel.model.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {rel.category?.name || "Self-Drive"} &bull; {rel.fuelType} &bull; {rel.transmission}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-border/50 pt-3 mt-3">
                    <div>
                      <span className="font-display text-base font-bold text-foreground">
                        &#8377;{relRate.toLocaleString("en-IN")}
                      </span>
                      <span className="text-[10px] text-muted-foreground"> / day</span>
                    </div>
                    <Link href={`/cars/${relSlug}`}>
                      <Button size="sm" variant="outline" className="font-semibold text-xs">
                        View details
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Mobile Sticky Bottom Booking Bar (< 1024px) */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-card/95 backdrop-blur-md border-t border-border/80 px-4 py-3 sm:px-6 pb-[calc(0.75rem+env(safe-area-inset-bottom))] flex items-center justify-between gap-3 shadow-2xl lg:hidden">
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-1 truncate">
            <span className="font-display text-base sm:text-lg font-black text-foreground shrink-0">
              &#8377;{authoritativePricing ? authoritativePricing.finalAmount.toLocaleString("en-IN") : rate.toLocaleString("en-IN")}
            </span>
            <span className="text-[10px] font-semibold text-muted-foreground shrink-0">
              {authoritativePricing ? "est. total" : "/ day"}
            </span>
          </div>
          <p className="text-[10px] font-medium text-primary truncate">
            {authoritativePricing ? `${authoritativePricing.rentalDays} ${authoritativePricing.rentalDays === 1 ? "day" : "days"} selected` : "Select dates"}
          </p>
        </div>

        {isAvailable ? (
          <Button size="sm" onClick={handleBookingInitiate} className="h-10 font-bold text-xs px-4 sm:px-5 gap-1.5 shrink-0">
            <span>Book this car</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        ) : (
          <Button variant="secondary" size="sm" disabled className="h-10 font-bold text-xs px-4 shrink-0">
            Unavailable
          </Button>
        )}
      </div>
    </div>
  );
}
