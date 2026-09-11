"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  Shield,
  CreditCard,
  MapPin,
  Calendar,
  Clock,
  Smartphone,
  Mail,
  Loader2,
  FileText,
  Key,
  ChevronRight,
  ChevronDown,
  UserCheck,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  Tag,
  Lock,
  Fuel,
  Users,
  Activity,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CarImage } from "@/components/cars/car-image";
import { useToast } from "@/providers/app-provider";

interface LocationItem {
  id: string;
  name: string;
  address: string;
}

interface WizardProps {
  user: {
    id: string;
    email: string;
    phone: string;
    name?: string;
    isKycVerified: boolean;
  };
  vehicle: {
    id: string;
    brand: { name: string };
    model: { name: string };
    color: string;
    transmission: string;
    fuelType: string;
    pricings: Array<{
      basePrice: any;
      dailyRate?: any;
      securityDeposit: any;
      taxRate: any;
      extraKmCharge?: any;
    }>;
  };
  pickupLocation: LocationItem;
  dropLocation: LocationItem;
  pickupDate: string;
  returnDate: string;
  allPickupLocations?: LocationItem[];
  allDropLocations?: LocationItem[];
}

type StepType = "TRIP" | "VERIFICATION" | "PAYMENT" | "SUCCESS";

export default function CheckoutWizard({
  user,
  vehicle,
  pickupLocation: initialPickupLoc,
  dropLocation: initialDropLoc,
  pickupDate: initialPickupDate,
  returnDate: initialReturnDate,
  allPickupLocations = [],
  allDropLocations = [],
}: WizardProps) {
  const router = useRouter();
  const { showToast } = useToast();

  // Active Step State
  const [step, setStep] = React.useState<StepType>("TRIP");

  // Editable Trip Parameters
  const [pickupLoc, setPickupLoc] = React.useState<LocationItem>(initialPickupLoc);
  const [dropLoc, setDropLoc] = React.useState<LocationItem>(initialDropLoc);

  // Separate Date & Time parsing helper
  const parseDateTime = (dtStr: string) => {
    if (dtStr.includes("T")) {
      const [d, t] = dtStr.split("T");
      return { date: d, time: t.substring(0, 5) };
    }
    return { date: dtStr, time: "09:00" };
  };

  const initPickupParsed = parseDateTime(initialPickupDate);
  const initReturnParsed = parseDateTime(initialReturnDate);

  const [pickupDateOnly, setPickupDateOnly] = React.useState(initPickupParsed.date);
  const [pickupTimeOnly, setPickupTimeOnly] = React.useState(initPickupParsed.time);
  const [returnDateOnly, setReturnDateOnly] = React.useState(initReturnParsed.date);
  const [returnTimeOnly, setReturnTimeOnly] = React.useState(initReturnParsed.time);

  // Authoritative Server Pricing State
  const [serverPricing, setServerPricing] = React.useState<{
    rentalDays: number;
    dailyRate: number;
    baseRentalSubtotal: number;
    weekendDaysCount: number;
    weekendMultiplierCharge: number;
    subtotalWithSurcharges: number;
    discountAmount: number;
    convenienceFee: number;
    taxAmount: number;
    securityDeposit: number;
    finalAmount: number;
  } | null>(null);

  const [isPricingLoading, setIsPricingLoading] = React.useState<boolean>(true);
  const [pricingError, setPricingError] = React.useState<string | null>(null);

  // Draft Hold Booking State
  const [bookingId, setBookingId] = React.useState<string>("");
  const [bookingNumber, setBookingNumber] = React.useState<string>("");
  const [holdExpiresAt, setHoldExpiresAt] = React.useState<Date | null>(null);
  const [remainingTimeSeconds, setRemainingTimeSeconds] = React.useState<number | null>(null);
  const [creatingDraft, setCreatingDraft] = React.useState(false);

  // Document Verification State
  const [aadhar, setAadhar] = React.useState("");
  const [dlNumber, setDlNumber] = React.useState("");
  const [verifyingKyc, setVerifyingKyc] = React.useState(false);
  const [kycDone, setKycDone] = React.useState(user.isKycVerified);

  // Payment State
  const [coupon, setCoupon] = React.useState("");
  const [paymentMethod, setPaymentMethod] = React.useState<"UPI" | "CARD" | "NET">("UPI");
  const [processingPayment, setProcessingPayment] = React.useState(false);
  const [paymentError, setPaymentError] = React.useState<string | null>(null);
  const [pickupOtp, setPickupOtp] = React.useState<string>("");

  // Mobile Collapsible Summary Drawer Toggle
  const [isMobileSummaryOpen, setIsMobileSummaryOpen] = React.useState(false);

  // Fetch Authoritative Server Pricing
  const fetchAuthoritativePricing = React.useCallback(
    async (couponCodeToUse?: string) => {
      setIsPricingLoading(true);
      setPricingError(null);

      const fullPickup = `${pickupDateOnly}T${pickupTimeOnly}`;
      const fullReturn = `${returnDateOnly}T${returnTimeOnly}`;

      try {
        const res = await fetch("/api/booking/price", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            vehicleId: vehicle.id,
            pickupDate: fullPickup,
            returnDate: fullReturn,
            couponCode: couponCodeToUse !== undefined ? couponCodeToUse : coupon,
          }),
        });

        const data = await res.json();
        if (data.success && data.pricing) {
          setServerPricing(data.pricing);
          if (couponCodeToUse && data.pricing.discountAmount > 0) {
            showToast(`Coupon ${couponCodeToUse.toUpperCase()} applied! Discount: ₹${data.pricing.discountAmount}`, "success");
          } else if (couponCodeToUse) {
            showToast("Coupon code is invalid or minimum booking subtotal not met.", "error");
          }
        } else {
          setPricingError(data.message || "Failed to calculate pricing");
          setServerPricing(null);
        }
      } catch (err: any) {
        setPricingError("Network connection error. Could not calculate pricing.");
        setServerPricing(null);
      } finally {
        setIsPricingLoading(false);
      }
    },
    [vehicle.id, pickupDateOnly, pickupTimeOnly, returnDateOnly, returnTimeOnly, coupon, showToast]
  );

  React.useEffect(() => {
    fetchAuthoritativePricing();
  }, [fetchAuthoritativePricing]);

  // Hold Expiry Countdown Timer Effect
  React.useEffect(() => {
    if (!holdExpiresAt) return;

    const updateTimer = () => {
      const now = new Date().getTime();
      const diff = Math.floor((holdExpiresAt.getTime() - now) / 1000);

      if (diff <= 0) {
        setRemainingTimeSeconds(0);
      } else {
        setRemainingTimeSeconds(diff);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [holdExpiresAt]);

  const formatCountdown = (seconds: number | null) => {
    if (seconds === null) return "15:00";
    if (seconds <= 0) return "Expired";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Step 1 Action: Create Server-Side Draft Booking Hold
  const handleConfirmAndReserve = async () => {
    if (!serverPricing) {
      showToast("Cannot create reservation without authoritative pricing.", "error");
      return;
    }

    const fullPickup = `${pickupDateOnly}T${pickupTimeOnly}`;
    const fullReturn = `${returnDateOnly}T${returnTimeOnly}`;

    if (new Date(fullPickup) >= new Date(fullReturn)) {
      showToast("Return date/time must be strictly after pickup date/time.", "error");
      return;
    }

    setCreatingDraft(true);

    try {
      const res = await fetch("/api/booking/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehicleId: vehicle.id,
          pickupLocationId: pickupLoc.id,
          dropLocationId: dropLoc.id,
          pickupDate: fullPickup,
          returnDate: fullReturn,
          couponCode: coupon || undefined,
        }),
      });

      const data = await res.json();
      if (data.success && data.booking) {
        setBookingId(data.booking.id);
        setBookingNumber(data.booking.bookingNumber || "PENDING");

        // 15-Minute Hold Calculation
        const createdAtTime = new Date(data.booking.createdAt || Date.now()).getTime();
        const expiresAt = new Date(createdAtTime + 15 * 60 * 1000);
        setHoldExpiresAt(expiresAt);

        showToast("Reservation hold created! Your vehicle is reserved for 15 minutes.", "success");
        setStep(kycDone ? "PAYMENT" : "VERIFICATION");
      } else {
        showToast(data.message || "Failed to create draft booking hold. Vehicle may be unavailable.", "error");
      }
    } catch {
      showToast("Network error creating draft reservation. Please try again.", "error");
    } finally {
      setCreatingDraft(false);
    }
  };

  // Step 2 Action: Submit Documents for Paperless KYC
  const handleVerifyKyc = async () => {
    if (!aadhar || !dlNumber) {
      showToast("Please enter both Aadhaar Card and Driving Licence details", "error");
      return;
    }
    const cleanAadhaar = aadhar.replace(/\s+/g, "");
    if (cleanAadhaar.length !== 12) {
      showToast("Aadhaar Card must be exactly 12 digits", "error");
      return;
    }

    setVerifyingKyc(true);

    try {
      const res = await fetch("/api/kyc/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          aadharNumber: cleanAadhaar,
          drivingLicenseNumber: dlNumber,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setKycDone(true);
        showToast("KYC documents submitted successfully for review!", "success");
        setStep("PAYMENT");
      } else {
        showToast(data.message || "Document submission failed.", "error");
      }
    } catch {
      showToast("KYC server connection failed.", "error");
    } finally {
      setVerifyingKyc(false);
    }
  };

  // Step 3 Action: Initiate Cashfree Payment & Verify Order
  const handleInitiatePayment = async () => {
    if (!bookingId) {
      showToast("No active booking hold found. Please restart checkout.", "error");
      setStep("TRIP");
      return;
    }

    setProcessingPayment(true);
    setPaymentError(null);

    try {
      // 1. Create server-side Cashfree payment session
      const checkoutRes = await fetch("/api/payment/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
          promoCode: coupon || undefined,
          paymentMethod,
        }),
      });

      const checkoutData = await checkoutRes.json();
      if (!checkoutData.success) {
        setPaymentError(checkoutData.message || "Payment session creation failed.");
        showToast(checkoutData.message || "Payment session creation failed", "error");
        setProcessingPayment(false);
        return;
      }

      const orderId = checkoutData.orderId;

      // 2. Verify payment status with server verification endpoint
      const verifyRes = await fetch(`/api/payment/verify-order?orderId=${encodeURIComponent(orderId)}`);
      const verifyData = await verifyRes.json();

      if (verifyData.success && verifyData.status === "COMPLETED") {
        setBookingNumber(verifyData.bookingNumber || bookingNumber);
        if (verifyData.pickupOtp) {
          setPickupOtp(verifyData.pickupOtp);
        }
        showToast("Payment verified successfully via Cashfree gateway!", "success");
        setStep("SUCCESS");
      } else {
        setPaymentError(verifyData.message || "Payment status pending verification.");
        showToast(verifyData.message || "Payment verification pending.", "error");
      }
    } catch {
      setPaymentError("Network error connecting to payment gateway.");
      showToast("Network error connecting to payment gateway.", "error");
    } finally {
      setProcessingPayment(false);
    }
  };

  const imgSlug = `${vehicle.brand.name}-${vehicle.model.name}`
    .toLowerCase()
    .replace(/\s+/g, "-");

  return (
    <div className="mx-auto max-w-6xl space-y-6 sm:space-y-8 pb-[calc(6rem+env(safe-area-inset-bottom))] lg:pb-12">
      {/* 3-Step Visual Progression Bar */}
      <div className="rounded-2xl border border-border bg-card p-3 sm:p-4 shadow-sm">
        <div className="flex items-center justify-between max-w-2xl mx-auto gap-1 sm:gap-2">
          {/* Step 1: Trip */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div
              className={`flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full text-xs font-bold transition-all shrink-0 ${
                step === "TRIP"
                  ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                  : bookingId
                  ? "bg-emerald-500 text-white"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {bookingId ? <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : "1"}
            </div>
            <div className="block">
              <span className="text-[11px] sm:text-xs font-bold text-foreground block leading-tight">Trip</span>
              <span className="text-[9px] sm:text-[10px] text-muted-foreground hidden min-[360px]:block leading-tight">Dates & Location</span>
            </div>
          </div>

          <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground/60 shrink-0" />

          {/* Step 2: Details & Verification */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div
              className={`flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full text-xs font-bold transition-all shrink-0 ${
                step === "VERIFICATION"
                  ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                  : kycDone
                  ? "bg-emerald-500 text-white"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {kycDone ? <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : "2"}
            </div>
            <div className="block">
              <span className="text-[11px] sm:text-xs font-bold text-foreground block leading-tight">Verify</span>
              <span className="text-[9px] sm:text-[10px] text-muted-foreground hidden min-[360px]:block leading-tight">Profile & KYC</span>
            </div>
          </div>

          <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground/60 shrink-0" />

          {/* Step 3: Payment */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div
              className={`flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full text-xs font-bold transition-all shrink-0 ${
                step === "PAYMENT"
                  ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                  : step === "SUCCESS"
                  ? "bg-emerald-500 text-white"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {step === "SUCCESS" ? <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : "3"}
            </div>
            <div className="block">
              <span className="text-[11px] sm:text-xs font-bold text-foreground block leading-tight">Pay</span>
              <span className="text-[9px] sm:text-[10px] text-muted-foreground hidden min-[360px]:block leading-tight">Cashfree</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reservation Hold Active Timer Banner */}
      {bookingId && step !== "SUCCESS" && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-amber-700 dark:text-amber-300">
          <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold">
            <Lock className="h-4 w-4 text-amber-500 shrink-0" />
            <span>
              Your vehicle hold is active! Reservation held for <strong>{bookingNumber}</strong>.
            </span>
          </div>
          <div className="flex items-center gap-2 bg-background/80 px-3 py-1.5 rounded-lg border border-amber-500/30 font-mono text-sm font-bold text-amber-600 dark:text-amber-400 shrink-0">
            <Clock className="h-4 w-4 animate-pulse text-amber-500" />
            <span>{formatCountdown(remainingTimeSeconds)}</span>
          </div>
        </div>
      )}

      {/* Main 2-Column Responsive Layout (Desktop: lg:grid-cols-12, Mobile: 1 Column) */}
      <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
        {/* Left Column: Form & Step Content (lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Mobile Collapsible Booking Summary Drawer (<1024px) */}
          <div className="lg:hidden rounded-xl border border-border bg-card p-4 shadow-sm space-y-3">
            <button
              type="button"
              onClick={() => setIsMobileSummaryOpen(!isMobileSummaryOpen)}
              className="flex w-full items-center justify-between text-xs font-bold text-foreground py-0.5 group focus:outline-none"
              aria-expanded={isMobileSummaryOpen}
            >
              <div className="flex flex-col items-start text-left">
                <span className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary shrink-0" /> Booking & Price Summary
                </span>
                <span className="text-[11px] font-medium text-primary ml-6 group-hover:underline">
                  {isMobileSummaryOpen ? "Hide Price Breakdown" : "View Price Breakdown"}
                </span>
              </div>
              <div className="flex items-center gap-2.5 shrink-0">
                <span className="font-extrabold text-primary text-sm">
                  &#8377;{serverPricing ? serverPricing.finalAmount.toLocaleString("en-IN") : "---"}
                </span>
                <ChevronDown
                  className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
                    isMobileSummaryOpen ? "rotate-180 text-primary" : ""
                  }`}
                />
              </div>
            </button>

            {isMobileSummaryOpen && (
              <div className="pt-3 border-t border-border/60 space-y-3 text-xs">
                <div className="flex gap-3 items-center">
                  <div className="w-16 h-12 bg-muted/20 rounded-lg p-1 shrink-0 flex items-center justify-center">
                    <CarImage src={`/cars/${imgSlug}.png`} alt={`${vehicle.brand.name}`} aspectRatio="video" objectFit="contain" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">{vehicle.brand.name} {vehicle.model.name}</h4>
                    <p className="text-[10px] text-muted-foreground">{vehicle.transmission} &bull; {vehicle.fuelType}</p>
                  </div>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-border/40">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Pickup:</span>
                    <span className="font-medium text-foreground">{pickupLoc.name} ({pickupDateOnly} {pickupTimeOnly})</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Return:</span>
                    <span className="font-medium text-foreground">{dropLoc.name} ({returnDateOnly} {returnTimeOnly})</span>
                  </div>
                </div>

                {serverPricing && (
                  <div className="space-y-1.5 pt-2 border-t border-border/40 font-medium">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Rental charges:</span>
                      <span className="text-foreground">&#8377;{serverPricing.baseRentalSubtotal.toLocaleString("en-IN")}</span>
                    </div>
                    {serverPricing.weekendMultiplierCharge > 0 && (
                      <div className="flex justify-between text-amber-600">
                        <span>Weekend charge:</span>
                        <span>+&#8377;{serverPricing.weekendMultiplierCharge.toLocaleString("en-IN")}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-muted-foreground">
                      <span>GST (18%):</span>
                      <span className="text-foreground">&#8377;{serverPricing.taxAmount.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Refundable Deposit:</span>
                      <span className="text-foreground">&#8377;{serverPricing.securityDeposit.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* STEP 1: TRIP DETAILS & DATES EDITING */}
          {step === "TRIP" && (
            <div className="space-y-6">
              {/* Vehicle Banner */}
              <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <div className="w-full sm:w-2/5 bg-muted/20 rounded-xl p-3 flex items-center justify-center border border-border/60">
                    <CarImage
                      src={`/cars/${imgSlug}.png`}
                      alt={`${vehicle.brand.name} ${vehicle.model.name}`}
                      aspectRatio="video"
                      objectFit="contain"
                      className="max-h-28"
                    />
                  </div>
                  <div className="w-full sm:w-3/5 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Selected Rental Vehicle</span>
                    <h2 className="font-display text-xl font-extrabold text-foreground">
                      {vehicle.brand.name} {vehicle.model.name}
                    </h2>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="rounded-md bg-muted px-2.5 py-1 font-semibold text-foreground">{vehicle.transmission}</span>
                      <span className="rounded-md bg-muted px-2.5 py-1 font-semibold text-foreground">{vehicle.fuelType}</span>
                      <span className="rounded-md bg-muted px-2.5 py-1 font-semibold text-foreground">{vehicle.color}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Editable Trip Dates & Locations */}
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-5">
                <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" /> Rental Dates & Station Locations
                </h3>

                {pricingError && (
                  <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs font-semibold text-destructive flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{pricingError}</span>
                  </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  {/* Pickup Station */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-primary" /> Pickup Location
                    </label>
                    <select
                      value={pickupLoc.id}
                      onChange={(e) => {
                        const found = allPickupLocations.find((l) => l.id === e.target.value);
                        if (found) setPickupLoc(found);
                      }}
                      className="flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-xs font-semibold text-foreground focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      {allPickupLocations.length > 0
                        ? allPickupLocations.map((loc) => (
                            <option key={loc.id} value={loc.id}>
                              {loc.name}
                            </option>
                          ))
                        : <option value={pickupLoc.id}>{pickupLoc.name}</option>}
                    </select>
                  </div>

                  {/* Drop Station */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-primary" /> Return Location
                    </label>
                    <select
                      value={dropLoc.id}
                      onChange={(e) => {
                        const found = allDropLocations.find((l) => l.id === e.target.value);
                        if (found) setDropLoc(found);
                      }}
                      className="flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-xs font-semibold text-foreground focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      {allDropLocations.length > 0
                        ? allDropLocations.map((loc) => (
                            <option key={loc.id} value={loc.id}>
                              {loc.name}
                            </option>
                          ))
                        : <option value={dropLoc.id}>{dropLoc.name}</option>}
                    </select>
                  </div>

                  {/* Pickup Date & Time */}
                  <div className="space-y-1.5 min-w-0">
                    <label className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-primary shrink-0" /> Pickup Window
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="date"
                        value={pickupDateOnly}
                        onChange={(e) => setPickupDateOnly(e.target.value)}
                        className="flex h-11 w-full min-w-0 rounded-lg border border-input bg-background px-2.5 py-2 text-xs font-semibold text-foreground focus-visible:ring-2 focus-visible:ring-primary"
                      />
                      <input
                        type="time"
                        value={pickupTimeOnly}
                        onChange={(e) => setPickupTimeOnly(e.target.value)}
                        className="flex h-11 w-full min-w-0 rounded-lg border border-input bg-background px-2.5 py-2 text-xs font-semibold text-foreground focus-visible:ring-2 focus-visible:ring-primary"
                      />
                    </div>
                  </div>

                  {/* Return Date & Time */}
                  <div className="space-y-1.5 min-w-0">
                    <label className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-primary shrink-0" /> Return Window
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="date"
                        value={returnDateOnly}
                        min={pickupDateOnly}
                        onChange={(e) => setReturnDateOnly(e.target.value)}
                        className="flex h-11 w-full min-w-0 rounded-lg border border-input bg-background px-2.5 py-2 text-xs font-semibold text-foreground focus-visible:ring-2 focus-visible:ring-primary"
                      />
                      <input
                        type="time"
                        value={returnTimeOnly}
                        onChange={(e) => setReturnTimeOnly(e.target.value)}
                        className="flex h-11 w-full min-w-0 rounded-lg border border-input bg-background px-2.5 py-2 text-xs font-semibold text-foreground focus-visible:ring-2 focus-visible:ring-primary"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Primary Action Button */}
              <Button
                size="lg"
                onClick={handleConfirmAndReserve}
                disabled={isPricingLoading || !!pricingError}
                isLoading={creatingDraft}
                className="h-12 w-full font-bold text-sm gap-2"
              >
                <span>Confirm & Reserve Hold</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* STEP 2: PROFILE & DOCUMENT VERIFICATION */}
          {step === "VERIFICATION" && (
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-6">
              <div className="space-y-2 border-b border-border/60 pb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Government Requirement</span>
                <h2 className="font-display text-xl font-bold text-foreground">Driver & Document Verification</h2>
                <p className="text-xs text-muted-foreground">
                  Indian self-drive regulations require physical Driving Licence and ID verification prior to key handover.
                </p>
              </div>

              {/* Authenticated User Profile Summary */}
              <div className="rounded-xl border border-border/60 bg-background p-4 space-y-3 text-xs">
                <h3 className="font-bold text-foreground flex items-center gap-1.5">
                  <UserCheck className="h-4 w-4 text-emerald-500" /> Authenticated Renter Profile
                </h3>
                <div className="grid gap-2 sm:grid-cols-2 text-muted-foreground">
                  <div>
                    <span>Full Name: </span>
                    <strong className="text-foreground">{user.name || "Verified Renter"}</strong>
                  </div>
                  <div>
                    <span>Email Address: </span>
                    <strong className="text-foreground">{user.email}</strong>
                  </div>
                  <div>
                    <span>Phone Number: </span>
                    <strong className="text-foreground">{user.phone || "+91 Verified"}</strong>
                  </div>
                  <div>
                    <span>KYC Account Status: </span>
                    <strong className={user.isKycVerified ? "text-emerald-500" : "text-amber-500"}>
                      {user.isKycVerified ? "Approved Renter" : "Action Required"}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Document Status Cards */}
              <div className="space-y-3">
                {/* Driving Licence Card */}
                <div className="rounded-xl border border-border/60 p-4 bg-background flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
                      DL
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-foreground">Physical Driving Licence</h4>
                      <p className="text-[10px] text-muted-foreground">Required at vehicle pickup station</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2.5 py-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Verified
                  </span>
                </div>

                {/* Aadhaar / Govt ID Input Form */}
                <div className="rounded-xl border border-border/60 p-5 bg-background space-y-4">
                  <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Shield className="h-4 w-4 text-primary" /> Govt Identity Verification (Aadhaar / Passport)
                  </h4>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-muted-foreground">Aadhaar Card Number (12 digits)</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="XXXX XXXX XXXX"
                        value={aadhar}
                        maxLength={14}
                        onChange={(e) => {
                          const raw = e.target.value.replace(/\D/g, "");
                          const formatted = raw.match(/.{1,4}/g)?.join(" ") || raw;
                          setAadhar(formatted.substring(0, 14));
                        }}
                        className="flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-xs font-semibold text-foreground focus-visible:ring-2 focus-visible:ring-primary"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-muted-foreground">Driving Licence Number</label>
                      <input
                        type="text"
                        placeholder="JH01 20230012345"
                        value={dlNumber}
                        onChange={(e) => setDlNumber(e.target.value.toUpperCase())}
                        className="flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-xs font-semibold text-foreground uppercase focus-visible:ring-2 focus-visible:ring-primary"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2 Action Controls */}
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep("TRIP")} className="h-12 w-1/3 font-bold text-xs">
                  Back
                </Button>
                <Button onClick={handleVerifyKyc} isLoading={verifyingKyc} className="h-12 w-2/3 font-bold text-xs gap-1.5">
                  <span>Verify Documents & Continue</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: PAYMENT EXECUTION */}
          {step === "PAYMENT" && (
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-6">
              <div className="space-y-2 border-b border-border/60 pb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Final Step</span>
                <h2 className="font-display text-xl font-bold text-foreground">Cashfree Payment Gateway</h2>
                <p className="text-xs text-muted-foreground">
                  Encrypted 256-bit payment verification handled directly by Cashfree Payments.
                </p>
              </div>

              {paymentError && (
                <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-xs font-semibold text-destructive space-y-2">
                  <div className="flex items-center gap-2 font-bold">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>Payment couldn't be completed</span>
                  </div>
                  <p className="text-muted-foreground">{paymentError}</p>
                </div>
              )}

              {/* Promo Coupon Code Input */}
              <div className="rounded-xl border border-border/60 bg-background p-4 space-y-3">
                <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Tag className="h-3.5 w-3.5 text-primary" /> Apply Promo Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter coupon code (e.g. TRIPZY10)"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                    className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-xs font-semibold uppercase text-foreground focus-visible:ring-2 focus-visible:ring-primary"
                  />
                  <Button
                    variant="outline"
                    onClick={() => fetchAuthoritativePricing(coupon.trim())}
                    className="h-10 px-4 text-xs font-bold shrink-0"
                  >
                    Apply
                  </Button>
                </div>
                <p className="text-[10px] text-muted-foreground">
                  Use coupon <strong className="text-primary font-bold">TRIPZY10</strong> for 10% off base rental charges.
                </p>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-foreground block">Select Payment Method</label>
                <div className="grid grid-cols-3 gap-3">
                  <div
                    onClick={() => setPaymentMethod("UPI")}
                    className={`border p-4 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                      paymentMethod === "UPI"
                        ? "border-primary bg-primary/10 ring-2 ring-primary text-foreground"
                        : "border-border/70 hover:bg-muted/30 text-muted-foreground"
                    }`}
                  >
                    <Smartphone className="h-5 w-5 text-primary" />
                    <span className="text-xs font-bold">UPI / GPay</span>
                  </div>

                  <div
                    onClick={() => setPaymentMethod("CARD")}
                    className={`border p-4 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                      paymentMethod === "CARD"
                        ? "border-primary bg-primary/10 ring-2 ring-primary text-foreground"
                        : "border-border/70 hover:bg-muted/30 text-muted-foreground"
                    }`}
                  >
                    <CreditCard className="h-5 w-5 text-primary" />
                    <span className="text-xs font-bold">Cards</span>
                  </div>

                  <div
                    onClick={() => setPaymentMethod("NET")}
                    className={`border p-4 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                      paymentMethod === "NET"
                        ? "border-primary bg-primary/10 ring-2 ring-primary text-foreground"
                        : "border-border/70 hover:bg-muted/30 text-muted-foreground"
                    }`}
                  >
                    <Shield className="h-5 w-5 text-primary" />
                    <span className="text-xs font-bold">NetBanking</span>
                  </div>
                </div>
              </div>

              {/* Payment Action Controls */}
              <div className="flex gap-3 pt-2">
                <Button variant="outline" onClick={() => setStep(kycDone ? "TRIP" : "VERIFICATION")} className="h-12 w-1/3 font-bold text-xs">
                  Back
                </Button>
                <Button
                  onClick={handleInitiatePayment}
                  isLoading={processingPayment}
                  className="h-12 w-2/3 font-bold text-xs gap-2"
                >
                  <span>
                    Pay &#8377;{serverPricing ? serverPricing.finalAmount.toLocaleString("en-IN") : "---"} & Confirm
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 4: SUCCESS RECEIPT */}
          {step === "SUCCESS" && (
            <div className="rounded-2xl border border-border bg-card p-8 shadow-md space-y-8">
              <div className="text-center space-y-3">
                <div className="h-16 w-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
                  <Check className="h-8 w-8" />
                </div>
                <h2 className="font-display text-3xl font-extrabold text-foreground tracking-tight">
                  Booking Confirmed!
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Your vehicle reservation is confirmed. Receipt emailed to <strong className="text-foreground">{user.email}</strong>.
                </p>
              </div>

              {/* Summary Details */}
              <div className="rounded-xl border border-border/60 bg-background p-6 space-y-3 text-xs">
                <div className="flex justify-between border-b border-border/40 pb-2.5">
                  <span className="text-muted-foreground">Booking Number:</span>
                  <strong className="font-mono text-sm text-foreground">{bookingNumber}</strong>
                </div>
                <div className="flex justify-between border-b border-border/40 pb-2.5">
                  <span className="text-muted-foreground">Vehicle Model:</span>
                  <strong className="text-foreground">{vehicle.brand.name} {vehicle.model.name} ({vehicle.color})</strong>
                </div>
                <div className="flex justify-between border-b border-border/40 pb-2.5">
                  <span className="text-muted-foreground">Pickup Location:</span>
                  <strong className="text-foreground">{pickupLoc.name} ({pickupDateOnly} at {pickupTimeOnly})</strong>
                </div>
                <div className="flex justify-between border-b border-border/40 pb-2.5">
                  <span className="text-muted-foreground">Return Location:</span>
                  <strong className="text-foreground">{dropLoc.name} ({returnDateOnly} at {returnTimeOnly})</strong>
                </div>
                <div className="flex justify-between pt-1 font-bold text-sm">
                  <span className="text-muted-foreground">Total Paid:</span>
                  <span className="text-primary">&#8377;{serverPricing ? serverPricing.finalAmount.toLocaleString("en-IN") : "---"}</span>
                </div>
              </div>

              {/* Key Pickup OTP Badge */}
              <div className="rounded-xl border border-primary/30 bg-primary/5 p-5 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                  <Key className="h-4 w-4 text-primary" /> Key Pickup OTP Verification Code
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3">
                  {pickupOtp ? (
                    <span className="font-mono text-2xl font-black tracking-widest text-foreground">{pickupOtp}</span>
                  ) : (
                    <span className="text-xs font-semibold text-muted-foreground italic">Pickup OTP processing — check Email or Dashboard</span>
                  )}
                  <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    Show at Station
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button variant="outline" onClick={() => router.push("/dashboard")} className="h-12 w-full sm:w-1/2 font-bold text-xs gap-2">
                  <UserCheck className="h-4 w-4" /> Renter Dashboard
                </Button>
                <Button onClick={() => router.push("/cars")} className="h-12 w-full sm:w-1/2 font-bold text-xs gap-2">
                  <span>Browse Fleet</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Sticky Authoritative Order Summary Panel (Desktop 1024px+) */}
        <div className="hidden lg:block lg:col-span-5 sticky top-24 space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-md space-y-6">
            <h3 className="font-display text-base font-bold text-foreground border-b border-border/60 pb-3 flex items-center justify-between">
              <span>Booking & Price Summary</span>
              {isPricingLoading && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
            </h3>

            {/* Vehicle Cutout Preview */}
            <div className="space-y-3">
              <div className="relative rounded-xl border border-border/60 bg-muted/20 p-3 flex items-center justify-center min-h-[140px]">
                <CarImage
                  src={`/cars/${imgSlug}.png`}
                  alt={`${vehicle.brand.name} ${vehicle.model.name}`}
                  aspectRatio="video"
                  objectFit="contain"
                  className="max-h-28"
                />
              </div>
              <div>
                <h4 className="font-display text-lg font-bold text-foreground">
                  {vehicle.brand.name} {vehicle.model.name}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {vehicle.transmission} &bull; {vehicle.fuelType} &bull; {vehicle.color}
                </p>
              </div>
            </div>

            {/* Trip Itinerary Card */}
            <div className="rounded-xl border border-border/60 bg-background p-4 space-y-2.5 text-xs">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-primary" /> Pickup Station
                </span>
                <p className="font-bold text-foreground">{pickupLoc.name}</p>
                <p className="text-muted-foreground">{pickupDateOnly} at {pickupTimeOnly}</p>
              </div>

              <div className="space-y-1 border-t border-border/40 pt-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-primary" /> Return Station
                </span>
                <p className="font-bold text-foreground">{dropLoc.name}</p>
                <p className="text-muted-foreground">{returnDateOnly} at {returnTimeOnly}</p>
              </div>
            </div>

            {/* Authoritative Price Breakdown */}
            <div className="rounded-xl border border-border/60 bg-background p-4 space-y-2.5 text-xs">
              <div className="font-bold text-foreground border-b border-border/40 pb-2">
                Fare Breakdown
              </div>

              {serverPricing ? (
                <>
                  <div className="flex justify-between text-muted-foreground">
                    <span>
                      Base Rental Charges (&#8377;{serverPricing.dailyRate.toLocaleString("en-IN")} &times; {serverPricing.rentalDays} {serverPricing.rentalDays === 1 ? "day" : "days"})
                    </span>
                    <span className="font-semibold text-foreground">&#8377;{serverPricing.baseRentalSubtotal.toLocaleString("en-IN")}</span>
                  </div>

                  {serverPricing.weekendMultiplierCharge > 0 && (
                    <div className="flex justify-between text-amber-600 dark:text-amber-400 font-medium">
                      <span>Weekend adjustment ({serverPricing.weekendDaysCount} weekend {serverPricing.weekendDaysCount === 1 ? "day" : "days"})</span>
                      <span>+&#8377;{serverPricing.weekendMultiplierCharge.toLocaleString("en-IN")}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-muted-foreground">
                    <span>Platform Convenience Fee</span>
                    <span className="font-semibold text-foreground">&#8377;{serverPricing.convenienceFee.toLocaleString("en-IN")}</span>
                  </div>

                  <div className="flex justify-between text-muted-foreground">
                    <span>GST Tax (18%)</span>
                    <span className="font-semibold text-foreground">&#8377;{serverPricing.taxAmount.toLocaleString("en-IN")}</span>
                  </div>

                  {serverPricing.discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-500 font-bold">
                      <span>Promo Discount Applied</span>
                      <span>-&#8377;{serverPricing.discountAmount.toLocaleString("en-IN")}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-muted-foreground border-t border-border/40 pt-1.5">
                    <span>Refundable Security Deposit</span>
                    <span className="font-semibold text-foreground">&#8377;{serverPricing.securityDeposit.toLocaleString("en-IN")}</span>
                  </div>

                  <div className="flex justify-between border-t border-border/60 pt-2 font-bold text-sm text-foreground">
                    <span>Total Amount Due</span>
                    <span className="text-primary">&#8377;{serverPricing.finalAmount.toLocaleString("en-IN")}</span>
                  </div>
                </>
              ) : (
                <div className="py-3 text-center text-xs text-muted-foreground italic">
                  Calculating authoritative fare...
                </div>
              )}
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-2 border-t border-border/60 pt-4 text-[10px] font-semibold text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Verified Clean Fleet</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Lock className="h-4 w-4 text-primary shrink-0" />
                <span>256-Bit SSL Encrypted</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
