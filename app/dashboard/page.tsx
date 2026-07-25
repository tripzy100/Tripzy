"use client";

import * as React from "react";
import { OnboardingTracker } from "@/components/dashboard/OnboardingTracker";
import { CompleteProfileCard } from "@/components/dashboard/CompleteProfileCard";
import { CompleteKycCard } from "@/components/dashboard/CompleteKycCard";
import { SelectBookCarCard } from "@/components/dashboard/SelectBookCarCard";
import { MyBookingsCard } from "@/components/dashboard/MyBookingsCard";
import { RefreshCw, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchDashboardStatus = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/dashboard/status");
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      } else {
        setError(json.message || "Failed to load dashboard data");
      }
    } catch {
      setError("Network error fetching dashboard details");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchDashboardStatus();
  }, [fetchDashboardStatus]);

  if (loading && !data) {
    return (
      <div className="space-y-8 animate-pulse">
        {/* Banner Skeleton */}
        <div className="h-28 w-full rounded-2xl bg-muted/60" />
        {/* Onboarding Skeleton */}
        <div className="h-40 w-full rounded-2xl bg-muted/60" />
        {/* Workflow Cards Grid Skeleton */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="h-64 rounded-2xl bg-muted/60" />
          <div className="h-64 rounded-2xl bg-muted/60" />
          <div className="h-64 rounded-2xl bg-muted/60" />
          <div className="h-64 rounded-2xl bg-muted/60" />
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-8 text-center space-y-4">
        <h2 className="font-display text-lg font-bold text-destructive">Error Loading Dashboard</h2>
        <p className="text-sm text-muted-foreground">{error}</p>
        <Button onClick={fetchDashboardStatus} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" /> Retry Data Sync
        </Button>
      </div>
    );
  }

  const {
    profile,
    user,
    profileFields,
    completedFieldsCount,
    totalFields,
    profileCompletionPercentage,
    isProfileComplete,
    kycProgress,
    bookings = [],
  } = data || {};

  const fullName = profile?.fullName || "Valued Guest";
  const isKycApproved = kycProgress?.overallKycStatus === "APPROVED";
  const hasBookings = bookings.length > 0;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const hasCompletedBookings = bookings.some(
    (b: any) => b.status === "COMPLETED" || b.status === "FINISHED"
  );

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden space-y-2 rounded-2xl border border-border bg-gradient-to-r from-card via-card/80 to-card p-6 md:p-8 shadow-sm">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                Welcome to Tripzy, {fullName}!
              </h1>
              {isKycApproved && (
                <span title="Verified Account">
                  <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                </span>
              )}
            </div>
            <p className="mt-1 max-w-xl text-sm text-muted-foreground">
              Complete your profile and KYC verification to unlock seamless self-drive rentals across India.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button size="sm" variant="ghost" onClick={fetchDashboardStatus} title="Refresh Live Data">
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Sync State
            </Button>
          </div>
        </div>
      </div>

      {/* Onboarding Progress Tracker */}
      <OnboardingTracker
        isProfileComplete={isProfileComplete}
        profileCompletionPercentage={profileCompletionPercentage}
        kycStatus={kycProgress?.overallKycStatus || "NOT_STARTED"}
        hasBookings={hasBookings}
        hasCompletedBookings={hasCompletedBookings}
      />

      {/* Primary 4 Workflow Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Card 1: Complete Profile */}
        <CompleteProfileCard
          isProfileComplete={isProfileComplete}
          profileCompletionPercentage={profileCompletionPercentage}
          completedFieldsCount={completedFieldsCount}
          totalFields={totalFields}
          profileFields={profileFields}
          initialData={{
            firstName: profile?.firstName,
            lastName: profile?.lastName,
            email: user?.email,
            phone: user?.phone,
            dateOfBirth: profile?.dateOfBirth,
            gender: profile?.gender,
            street: profile?.address?.split(",")[0],
            zipCode: profile?.address?.split(",")[1]?.trim(),
            emergencyContactName: data?.emergencyContact?.name,
            emergencyContactPhone: data?.emergencyContact?.phone,
            emergencyContactRelationship: data?.emergencyContact?.relationship,
          }}
          onRefresh={fetchDashboardStatus}
        />

        {/* Card 2: Complete KYC */}
        <CompleteKycCard
          kycProgress={
            kycProgress || {
              dlStatus: "NOT_STARTED",
              aadharStatus: "NOT_STARTED",
              selfieStatus: "NOT_STARTED",
              overallKycStatus: "NOT_STARTED",
              rejectionReason: null,
            }
          }
          isProfileComplete={isProfileComplete}
          onRefresh={fetchDashboardStatus}
        />

        {/* Card 3: Select & Book Car */}
        <SelectBookCarCard
          isKycApproved={isKycApproved}
          kycStatusText={kycProgress?.overallKycStatus || "PENDING"}
        />

        {/* Card 4: My Bookings */}
        <MyBookingsCard bookings={bookings} />
      </div>
    </div>
  );
}
