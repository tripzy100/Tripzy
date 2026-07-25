import * as React from "react";
import { CheckCircle2, HelpCircle, Clock, Sparkles } from "lucide-react";

interface Step {
  id: string;
  label: string;
  subLabel?: string;
  completed: boolean;
  active: boolean;
  statusText: string;
}

interface OnboardingTrackerProps {
  isProfileComplete: boolean;
  profileCompletionPercentage: number;
  kycStatus: "NOT_STARTED" | "PENDING" | "IN_REVIEW" | "APPROVED" | "REJECTED";
  hasBookings: boolean;
  hasCompletedBookings: boolean;
}

export function OnboardingTracker({
  isProfileComplete,
  profileCompletionPercentage,
  kycStatus,
  hasBookings,
  hasCompletedBookings,
}: OnboardingTrackerProps) {
  // Calculate percentage:
  // Step 1: Registration (20%)
  // Step 2: Profile (20% if 100% complete, proportional otherwise)
  // Step 3: KYC Approved (20%)
  // Step 4: Booking Placed (20%)
  // Step 5: Trip Completed (20%)

  let totalPercentage = 20; // Registration complete
  totalPercentage += Math.round((profileCompletionPercentage / 100) * 20);
  if (kycStatus === "APPROVED") totalPercentage += 20;
  else if (kycStatus === "IN_REVIEW" || kycStatus === "PENDING") totalPercentage += 10;
  if (hasBookings) totalPercentage += 20;
  if (hasCompletedBookings) totalPercentage += 20;

  totalPercentage = Math.min(100, Math.max(20, totalPercentage));

  const steps: Step[] = [
    {
      id: "registration",
      label: "Registration",
      subLabel: "Account Created",
      completed: true,
      active: false,
      statusText: "Complete ✓",
    },
    {
      id: "profile",
      label: "Profile Details",
      subLabel: `${profileCompletionPercentage}% Fields`,
      completed: isProfileComplete,
      active: !isProfileComplete,
      statusText: isProfileComplete ? "Complete ✓" : "Pending",
    },
    {
      id: "kyc",
      label: "KYC Verification",
      subLabel: kycStatus === "APPROVED" ? "Verified" : kycStatus === "REJECTED" ? "Rejected" : "In Review",
      completed: kycStatus === "APPROVED",
      active: isProfileComplete && kycStatus !== "APPROVED",
      statusText:
        kycStatus === "APPROVED"
          ? "Approved ✓"
          : kycStatus === "REJECTED"
          ? "Rejected"
          : kycStatus === "IN_REVIEW"
          ? "In Review"
          : "Pending",
    },
    {
      id: "booking",
      label: "Car Booking",
      subLabel: hasBookings ? "Vehicle Booked" : "Choose Vehicle",
      completed: hasBookings,
      active: kycStatus === "APPROVED" && !hasBookings,
      statusText: hasBookings ? "Booked ✓" : "Pending",
    },
    {
      id: "trip",
      label: "Trip Completed",
      subLabel: hasCompletedBookings ? "Trip Finished" : "Enjoy Journey",
      completed: hasCompletedBookings,
      active: hasBookings && !hasCompletedBookings,
      statusText: hasCompletedBookings ? "Finished ✓" : "Pending",
    },
  ];

  return (
    <div className="space-y-4 rounded-2xl border border-border bg-card/60 p-6 shadow-sm backdrop-blur-sm">
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-500" />
            <h2 className="font-display text-lg font-bold text-foreground">Onboarding Progress</h2>
          </div>
          <p className="text-xs text-muted-foreground">
            Follow the guided workflow to complete verification and unlock self-drive car bookings.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-2xl font-extrabold text-foreground">{totalPercentage}%</span>
          <div className="h-3 w-32 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
              style={{ width: `${totalPercentage}%` }}
              role="progressbar"
              aria-valuenow={totalPercentage}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        </div>
      </div>

      {/* Steps visualization */}
      <div className="grid grid-cols-2 gap-3 pt-2 sm:grid-cols-3 lg:grid-cols-5">
        {steps.map((step, idx) => (
          <div
            key={step.id}
            className={`relative flex items-center gap-3 rounded-xl border p-3 transition-all ${
              step.completed
                ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-500 dark:bg-emerald-500/10"
                : step.active
                ? "border-primary bg-primary/5 text-foreground dark:bg-primary/10"
                : "border-border/50 bg-muted/20 text-muted-foreground"
            }`}
          >
            <div className="flex-shrink-0">
              {step.completed ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              ) : step.active ? (
                <Clock className="h-5 w-5 animate-pulse text-primary" />
              ) : (
                <HelpCircle className="h-5 w-5 text-muted-foreground/50" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-xs font-semibold text-foreground">
                {idx + 1}. {step.label}
              </div>
              <div className="flex items-center justify-between gap-1 text-[11px] text-muted-foreground">
                <span className="truncate">{step.subLabel}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
