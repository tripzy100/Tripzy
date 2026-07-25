"use client";

import * as React from "react";
import { Upload, CheckCircle2, FileText, UserSquare, CreditCard, ShieldCheck, AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/providers/app-provider";
import { KycModal } from "@/components/dashboard/KycModal";
import { StatusBadge } from "@/components/dashboard/StatusBadge";

export default function KycPage() {
  const { showToast } = useToast();
  const [data, setData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [modalOpen, setModalOpen] = React.useState(false);

  const fetchKycData = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/dashboard/status");
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      }
    } catch (err) {
      showToast("Error loading KYC data", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  React.useEffect(() => {
    fetchKycData();
  }, [fetchKycData]);

  const kycProgress = data?.kycProgress || {};
  const isApproved = kycProgress.overallKycStatus === "APPROVED";
  const isRejected = kycProgress.overallKycStatus === "REJECTED";
  const isInReview = kycProgress.overallKycStatus === "IN_REVIEW" || kycProgress.overallKycStatus === "PENDING";

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-gradient font-display text-2xl font-bold tracking-tight">
            KYC Verification Portal
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Verify your driving license and national identity details to unlock high-performance self-drive rentals.
          </p>
        </div>
        <StatusBadge status={isApproved ? "Approved" : isRejected ? "Rejected" : isInReview ? "In Review" : "Pending"} />
      </div>

      {isRejected && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-xs text-destructive space-y-2">
          <div className="flex items-center gap-2 font-bold text-sm">
            <AlertTriangle className="h-5 w-5" /> KYC Rejection Notice
          </div>
          <p className="text-xs leading-relaxed">
            Reason: {kycProgress.rejectionReason || "Identity document scan unclear or expired. Please re-upload clear photos of your Driving Licence and Aadhaar Card."}
          </p>
          <Button size="sm" variant="destructive" onClick={() => setModalOpen(true)}>
            <RefreshCw className="mr-1.5 h-3.5 w-3.5" /> Re-upload Documents
          </Button>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Document uploads cards */}
        <div className="space-y-4">
          <h3 className="font-display text-base font-bold text-foreground">Required Verification Documents</h3>

          {/* DL Status card */}
          <div className="flex items-center justify-between rounded-xl border border-border bg-card/30 p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2 text-foreground">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-sm font-semibold">Driving Licence</div>
                <div className="text-xs text-muted-foreground">
                  {data?.drivingLicence?.licenceNumber || "Scanned front & back"}
                </div>
              </div>
            </div>
            {kycProgress.dlStatus === "APPROVED" ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-500">
                <CheckCircle2 className="h-3.5 w-3.5" /> Approved
              </span>
            ) : (
              <Button size="sm" variant="outline" onClick={() => setModalOpen(true)}>
                <Upload className="mr-1 h-3.5 w-3.5" /> Upload DL
              </Button>
            )}
          </div>

          {/* Aadhaar Card */}
          <div className="flex items-center justify-between rounded-xl border border-border bg-card/30 p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2 text-foreground">
                <CreditCard className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-sm font-semibold">Aadhaar Card</div>
                <div className="text-xs text-muted-foreground">National Identity Card</div>
              </div>
            </div>
            {kycProgress.aadharStatus === "APPROVED" ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-500">
                <CheckCircle2 className="h-3.5 w-3.5" /> Approved
              </span>
            ) : (
              <Button size="sm" variant="outline" onClick={() => setModalOpen(true)}>
                <Upload className="mr-1 h-3.5 w-3.5" /> Upload Aadhaar
              </Button>
            )}
          </div>

          {/* Selfie Card */}
          <div className="flex items-center justify-between rounded-xl border border-border bg-card/30 p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2 text-foreground">
                <UserSquare className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-sm font-semibold">Verification Selfie</div>
                <div className="text-xs text-muted-foreground">Face matching liveness check</div>
              </div>
            </div>
            {kycProgress.selfieStatus === "APPROVED" || isApproved ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-500">
                <CheckCircle2 className="h-3.5 w-3.5" /> Approved
              </span>
            ) : (
              <Button onClick={() => setModalOpen(true)} size="sm">
                <Upload className="mr-1 h-3.5 w-3.5" /> Upload Selfie
              </Button>
            )}
          </div>
        </div>

        {/* Verification timeline panel */}
        <div className="space-y-6 rounded-xl border border-border bg-card/45 p-6">
          <h3 className="font-display text-base font-bold text-foreground">Status Timeline</h3>

          <div className="relative ml-2 space-y-6 border-l-2 border-border/80 pl-6">
            {/* Step 1 */}
            <div className="relative">
              <span className={`absolute -left-9 top-0.5 flex h-5 w-5 items-center justify-center rounded-full text-white ring-4 ring-background ${data?.drivingLicence ? "bg-emerald-500" : "bg-muted text-muted-foreground"}`}>
                <CheckCircle2 className="h-3.5 w-3.5 fill-current" />
              </span>
              <div className="text-sm font-semibold text-foreground">Documents Submitted</div>
              <p className="mt-1 text-xs text-muted-foreground">
                DL scans and identity documents uploaded into secure vault.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <span className={`absolute -left-9 top-0.5 flex h-5 w-5 items-center justify-center rounded-full text-white ring-4 ring-background ${isInReview || isApproved ? "bg-emerald-500" : "bg-muted text-muted-foreground"}`}>
                <CheckCircle2 className="h-3.5 w-3.5 fill-current" />
              </span>
              <div className="text-sm font-semibold text-foreground">Automated OCR Checks</div>
              <p className="mt-1 text-xs text-muted-foreground">
                Parsed licence names matching registration details.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <span className={`absolute -left-9 top-0.5 flex h-5 w-5 items-center justify-center rounded-full text-white ring-4 ring-background ${isApproved ? "bg-emerald-500" : "bg-muted text-muted-foreground"}`}>
                <CheckCircle2 className="h-3.5 w-3.5 fill-current" />
              </span>
              <div className="text-sm font-semibold text-foreground">
                KYC Verification Cleared
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Profile cleared for self-drive reservations.
              </p>
            </div>
          </div>

          {!isApproved && (
            <Button className="w-full mt-4" onClick={() => setModalOpen(true)}>
              <ShieldCheck className="mr-1.5 h-4 w-4" /> Open Verification Portal
            </Button>
          )}
        </div>
      </div>

      <KycModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={fetchKycData}
        initialDl={data?.drivingLicence?.licenceNumber}
        initialAadhar={data?.identityDocument?.documentNumber}
      />
    </div>
  );
}
