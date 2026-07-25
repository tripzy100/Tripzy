"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  Shield,
  CreditCard,
  MapPin,
  Calendar,
  DollarSign,
  Smartphone,
  Mail,
  Loader2,
  FileText,
  Key,
  ChevronRight,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/providers/app-provider";

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
      securityDeposit: any;
      taxRate: any;
    }>;
  };
  pickupLocation: { id: string; name: string; address: string };
  dropLocation: { id: string; name: string; address: string };
  pickupDate: string;
  returnDate: string;
}

type StepType = "DETAILS" | "KYC" | "PAYMENT" | "SUCCESS";

export default function CheckoutWizard({
  user,
  vehicle,
  pickupLocation,
  dropLocation,
  pickupDate,
  returnDate,
}: WizardProps) {
  const router = useRouter();
  const { showToast } = useToast();

  const [step, setStep] = React.useState<StepType>("DETAILS");
  const [bookingId, setBookingId] = React.useState<string>("");
  const [bookingNumber, setBookingNumber] = React.useState<string>("");
  const [pickupOtp, setPickupOtp] = React.useState<string>("");

  // Booking calculations
  const pDate = new Date(pickupDate);
  const rDate = new Date(returnDate);
  const days = Math.max(1, Math.ceil((rDate.getTime() - pDate.getTime()) / (1000 * 3600 * 24)));

  const pricing = vehicle.pricings[0];
  const rate = pricing ? Number(pricing.basePrice) : 2500;
  const deposit = pricing ? Number(pricing.securityDeposit) : 5000;
  const taxRate = pricing ? Number(pricing.taxRate) / 100 : 0.18;

  const subtotal = rate * days;
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  // KYC States
  const [aadhar, setAadhar] = React.useState("");
  const [dlNumber, setDlNumber] = React.useState("");
  const [verifyingKyc, setVerifyingKyc] = React.useState(false);
  const [kycDone, setKycDone] = React.useState(user.isKycVerified);

  // Payment States
  const [paymentMethod, setPaymentMethod] = React.useState<"UPI" | "CARD" | "NET">("UPI");
  const [coupon, setCoupon] = React.useState("");
  const [discount, setDiscount] = React.useState(0);
  const [processingPayment, setProcessingPayment] = React.useState(false);

  const applyCoupon = () => {
    if (coupon.toUpperCase() === "TRIPZY10") {
      setDiscount(subtotal * 0.1);
      showToast("Coupon TRIPZY10 applied! 10% discount on base price.", "success");
    } else {
      showToast("Invalid coupon code.", "error");
    }
  };

  // Step 1: Create draft booking
  const [creatingDraft, setCreatingDraft] = React.useState(false);
  const handleConfirmDetails = async () => {
    setCreatingDraft(true);
    try {
      const res = await fetch("/api/booking/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehicleId: vehicle.id,
          pickupLocationId: pickupLocation.id,
          dropLocationId: dropLocation.id,
          pickupDate,
          returnDate,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setBookingId(data.booking.id);
        showToast("Reservation draft generated!", "success");
        setStep(kycDone ? "PAYMENT" : "KYC");
      } else {
        showToast(data.message || "Failed to create draft booking", "error");
      }
    } catch {
      showToast("Network error. Please try again.", "error");
    } finally {
      setCreatingDraft(false);
    }
  };

  // Step 2: Verify documents
  const handleVerifyKyc = async () => {
    if (!aadhar || !dlNumber) {
      showToast("Please enter Aadhar and Driving License details", "error");
      return;
    }
    if (aadhar.replace(/\s+/g, "").length !== 12) {
      showToast("Aadhar Card must be 12 digits", "error");
      return;
    }

    setVerifyingKyc(true);
    // Simulate high-fidelity OCR scanning and government verification
    await new Promise((resolve) => setTimeout(resolve, 2500));

    try {
      const res = await fetch("/api/kyc/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          aadharNumber: aadhar,
          drivingLicenseNumber: dlNumber,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setKycDone(true);
        showToast("Documents verified through Digilocker successfully!", "success");
        setStep("PAYMENT");
      } else {
        showToast(data.message || "Document verification failed.", "error");
      }
    } catch {
      showToast("KYC server connection failed.", "error");
    } finally {
      setVerifyingKyc(false);
    }
  };

  // Step 3: Complete Cashfree Payment
  const handlePayment = async () => {
    setProcessingPayment(true);
    // Simulate redirect and Cashfree processing check
    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      const res = await fetch("/api/payment/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
          promoCode: discount > 0 ? "TRIPZY10" : undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setBookingNumber(data.bookingNumber);
        setPickupOtp(data.pickupOtp);
        showToast("Payment processed via Cashfree!", "success");
        setStep("SUCCESS");
      } else {
        showToast(data.message || "Payment processing failed.", "error");
      }
    } catch {
      showToast("Payment processing server error.", "error");
    } finally {
      setProcessingPayment(false);
    }
  };

  const currentFinalPrice = total - discount;

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Wizard Steps Header Indicator */}
      <div className="flex justify-between items-center bg-card/45 border border-border p-4 rounded-xl shadow-sm">
        <div className="flex items-center gap-1.5 md:gap-3">
          <div
            className={`flex h-7 w-7 md:h-8 md:w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${
              step === "DETAILS" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            } ${bookingId ? "bg-emerald-500 text-white" : ""}`}
          >
            {bookingId ? <Check className="h-4 w-4" /> : "1"}
          </div>
          <span className="text-xs md:text-sm font-semibold">Details</span>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
        <div className="flex items-center gap-1.5 md:gap-3">
          <div
            className={`flex h-7 w-7 md:h-8 md:w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${
              step === "KYC" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            } ${kycDone ? "bg-emerald-500 text-white" : ""}`}
          >
            {kycDone ? <Check className="h-4 w-4" /> : "2"}
          </div>
          <span className="text-xs md:text-sm font-semibold">KYC Verification</span>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
        <div className="flex items-center gap-1.5 md:gap-3">
          <div
            className={`flex h-7 w-7 md:h-8 md:w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${
              step === "PAYMENT" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            } ${step === "SUCCESS" ? "bg-emerald-500 text-white" : ""}`}
          >
            {step === "SUCCESS" ? <Check className="h-4 w-4" /> : "3"}
          </div>
          <span className="text-xs md:text-sm font-semibold">Payment</span>
        </div>
      </div>

      {/* STEP 1: DETAILS CONFIRMATION */}
      {step === "DETAILS" && (
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <div className="rounded-xl border border-border bg-card p-6 space-y-4">
              <h2 className="font-display text-xl font-bold flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" /> Booking Summary
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="bg-background/60 p-4 rounded-lg border border-border/40">
                  <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider flex items-center gap-1.5">
                    <MapPin className="h-3 w-3 text-red-500" /> Pickup Location
                  </div>
                  <div className="text-sm font-bold mt-1 text-foreground">{pickupLocation.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{pickupLocation.address}</div>
                </div>
                <div className="bg-background/60 p-4 rounded-lg border border-border/40">
                  <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider flex items-center gap-1.5">
                    <MapPin className="h-3 w-3 text-red-500" /> Drop Location
                  </div>
                  <div className="text-sm font-bold mt-1 text-foreground">{dropLocation.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{dropLocation.address}</div>
                </div>
                <div className="bg-background/60 p-4 rounded-lg border border-border/40">
                  <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Pickup Date</div>
                  <div className="text-sm font-bold mt-1 text-foreground">{new Date(pickupDate).toLocaleDateString()}</div>
                </div>
                <div className="bg-background/60 p-4 rounded-lg border border-border/40">
                  <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Return Date</div>
                  <div className="text-sm font-bold mt-1 text-foreground">{new Date(returnDate).toLocaleDateString()}</div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 flex flex-col sm:flex-row gap-4 items-center">
              <div className="w-full sm:w-1/3 bg-muted/30 rounded-lg overflow-hidden flex items-center justify-center p-2">
                <img
                  src={`/cars/${(vehicle.brand.name + "-" + vehicle.model.name).toLowerCase().replace(/\s+/g, "-")}.png`}
                  alt={`${vehicle.brand.name} ${vehicle.model.name}`}
                  className="w-full object-contain max-h-28"
                />
              </div>
              <div className="w-full sm:w-2/3 space-y-2">
                <h3 className="font-display text-lg font-bold">
                  {vehicle.brand.name} {vehicle.model.name}
                </h3>
                <div className="flex gap-2 flex-wrap">
                  <span className="text-[10px] font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-full">{vehicle.transmission}</span>
                  <span className="text-[10px] font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-full">{vehicle.fuelType}</span>
                  <span className="text-[10px] font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-full">{vehicle.color}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-6 space-y-4">
              <h3 className="font-display text-base font-bold flex items-center gap-1.5"><DollarSign className="h-5 w-5 text-primary" /> Fare Breakdown</h3>
              <div className="space-y-2.5 text-sm border-b border-border/60 pb-4">
                <div className="flex justify-between text-muted-foreground">
                  <span>Daily Rate</span>
                  <span className="font-medium text-foreground">₹{rate}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Rental Days</span>
                  <span className="font-medium text-foreground">{days} days</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="font-medium text-foreground">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>GST (18%)</span>
                  <span className="font-medium text-foreground">₹{tax.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Refundable Deposit</span>
                  <span className="font-medium text-foreground">₹{deposit}</span>
                </div>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="font-bold text-foreground">Total Due</span>
                <span className="text-xl font-extrabold text-primary">₹{total.toFixed(0)}</span>
              </div>
              <Button className="w-full" onClick={handleConfirmDetails} isLoading={creatingDraft}>
                Confirm & Proceed
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: DOCUMENT VERIFICATION */}
      {step === "KYC" && (
        <div className="max-w-2xl mx-auto rounded-xl border border-border bg-card p-8 space-y-6">
          <div className="text-center space-y-2">
            <Shield className="h-12 w-12 text-primary mx-auto" />
            <h2 className="font-display text-2xl font-bold">Government Document Verification</h2>
            <p className="text-sm text-muted-foreground">
              To proceed with booking, Indian regulations require verification of your Aadhar Card and Driving License through Digilocker.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                Aadhar Card Number (12 digits)
              </label>
              <input
                type="text"
                value={aadhar}
                maxLength={14} // to allow spaces
                onChange={(e) => {
                  // Format input as XXXX XXXX XXXX
                  const raw = e.target.value.replace(/\D/g, "");
                  const formatted = raw.match(/.{1,4}/g)?.join(" ") || raw;
                  setAadhar(formatted.substring(0, 14));
                }}
                className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                Driving License Number
              </label>
              <input
                type="text"
                value={dlNumber}
                onChange={(e) => setDlNumber(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm text-foreground uppercase focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="pt-4 flex gap-4">
            <Button variant="outline" className="w-1/2" onClick={() => setStep("DETAILS")}>
              Back
            </Button>
            <Button className="w-1/2" onClick={handleVerifyKyc} isLoading={verifyingKyc}>
              {verifyingKyc ? "Connecting UIDAI..." : "Verify via Digilocker"}
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3: PAYMENT */}
      {step === "PAYMENT" && (
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <div className="rounded-xl border border-border bg-card p-6 space-y-4">
              <h2 className="font-display text-xl font-bold flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" /> Cashfree Payments
              </h2>

              {/* Coupon input */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground">Promo Coupon</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter coupon code (e.g. TRIPZY10)"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <Button variant="outline" size="sm" onClick={applyCoupon}>
                    Apply
                  </Button>
                </div>
                <p className="text-[10px] text-muted-foreground">Use code <strong className="text-primary font-bold">TRIPZY10</strong> to get 10% off base rental.</p>
              </div>

              {/* Payment Methods */}
              <div className="space-y-3 pt-2">
                <label className="text-xs font-semibold text-foreground block">Select Payment Method</label>
                <div className="grid grid-cols-3 gap-3">
                  <div
                    onClick={() => setPaymentMethod("UPI")}
                    className={`border p-4 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                      paymentMethod === "UPI" ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:bg-muted/35"
                    }`}
                  >
                    <Smartphone className="h-5 w-5 text-muted-foreground" />
                    <span className="text-[10px] font-bold">UPI / GPay</span>
                  </div>
                  <div
                    onClick={() => setPaymentMethod("CARD")}
                    className={`border p-4 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                      paymentMethod === "CARD" ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:bg-muted/35"
                    }`}
                  >
                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                    <span className="text-[10px] font-bold">Card</span>
                  </div>
                  <div
                    onClick={() => setPaymentMethod("NET")}
                    className={`border p-4 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                      paymentMethod === "NET" ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:bg-muted/35"
                    }`}
                  >
                    <Loader2 className="h-5 w-5 text-muted-foreground" />
                    <span className="text-[10px] font-bold">Net Banking</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-6 space-y-4">
              <h3 className="font-display text-base font-bold flex items-center gap-1.5"><DollarSign className="h-5 w-5 text-primary" /> Bill Breakdown</h3>
              <div className="space-y-2.5 text-sm border-b border-border/60 pb-4">
                <div className="flex justify-between text-muted-foreground">
                  <span>Base Booking</span>
                  <span className="font-medium text-foreground">₹{(subtotal + tax).toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Security Deposit</span>
                  <span className="font-medium text-foreground">₹{deposit}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-500 font-medium">
                    <span>Discount Applied</span>
                    <span>-₹{discount.toFixed(0)}</span>
                  </div>
                )}
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="font-bold text-foreground">Grand Total</span>
                <span className="text-xl font-extrabold text-primary">₹{currentFinalPrice.toFixed(0)}</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="w-1/3" onClick={() => setStep(kycDone ? "DETAILS" : "KYC")}>
                  Back
                </Button>
                <Button className="w-2/3" onClick={handlePayment} isLoading={processingPayment}>
                  {processingPayment ? "Processing..." : "Pay ₹" + currentFinalPrice.toFixed(0)}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: SUCCESS */}
      {step === "SUCCESS" && (
        <div className="max-w-2xl mx-auto rounded-xl border border-border bg-card p-8 space-y-8 shadow-sm">
          <div className="text-center space-y-3">
            <div className="h-16 w-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto border border-emerald-500/25">
              <Check className="h-8 w-8" />
            </div>
            <h2 className="font-display text-3xl font-extrabold text-foreground">Booking Confirmed!</h2>
            <p className="text-sm text-muted-foreground">
              Your vehicle has been successfully reserved. We have sent the confirmation receipt to <strong className="text-foreground">{user.email}</strong>.
            </p>
          </div>

          <div className="bg-background/50 rounded-xl border border-border p-6 space-y-4">
            <div className="flex justify-between border-b border-border pb-3 text-sm">
              <span className="text-muted-foreground">Booking ID</span>
              <span className="font-bold text-foreground">{bookingNumber}</span>
            </div>
            <div className="flex justify-between border-b border-border pb-3 text-sm">
              <span className="text-muted-foreground">Vehicle Model</span>
              <span className="font-bold text-foreground">{vehicle.brand.name} {vehicle.model.name} ({vehicle.color})</span>
            </div>
            <div className="flex justify-between border-b border-border pb-3 text-sm">
              <span className="text-muted-foreground">Pickup Location</span>
              <span className="font-bold text-foreground">{pickupLocation.name}</span>
            </div>
            <div className="flex justify-between pb-1 text-sm">
              <span className="text-muted-foreground">Total Paid</span>
              <span className="font-bold text-primary">₹{currentFinalPrice.toFixed(0)}</span>
            </div>
          </div>

          {/* Pickup instructions & OTP */}
          <div className="border border-primary/20 bg-primary/5 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <Key className="h-6 w-6 text-primary" />
              <div>
                <h3 className="text-sm font-bold text-foreground">Pickup Verification Code (OTP)</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Please show this code to the station agent when collecting your keys.</p>
              </div>
            </div>
            <div className="flex items-center justify-between bg-card border border-border px-4 py-3 rounded-lg">
              <span className="font-mono text-3xl font-extrabold text-foreground tracking-widest">{pickupOtp}</span>
              <span className="text-[10px] font-bold uppercase text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full flex items-center gap-1.5">
                <Smartphone className="h-3 w-3" /> Sent to Phone
              </span>
            </div>
            <div className="flex gap-2.5 items-start text-xs text-muted-foreground border-t border-border/40 pt-3">
              <Mail className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <span>Full station mapping details, contacts, and invoice PDF have also been emailed to you at {user.email}.</span>
            </div>
          </div>

          {/* Interactive Coordinates Map Placeholder */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5 uppercase tracking-wider">
              <MapPin className="h-4 w-4 text-red-500" /> Station Mapping
            </h3>
            <div className="h-44 w-full rounded-xl bg-muted/40 border border-border/60 flex flex-col items-center justify-center gap-2 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-60"></div>
              <div className="z-10 bg-card border border-border p-3 rounded-lg shadow-sm text-center">
                <div className="text-xs font-bold">{pickupLocation.name}</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">{pickupLocation.address}</div>
                <div className="text-[10px] text-primary font-semibold mt-1">Coordinates: 23.34&deg;N, 85.31&deg;E</div>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button variant="outline" className="w-1/2 flex items-center justify-center gap-2" onClick={() => showToast("Opening Invoice PDF download...", "success")}>
              <FileText className="h-4 w-4" /> Download Receipt
            </Button>
            <Button className="w-1/2 flex items-center justify-center gap-2" onClick={() => router.push("/dashboard")}>
              <UserCheck className="h-4 w-4" /> Go to Dashboard
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
