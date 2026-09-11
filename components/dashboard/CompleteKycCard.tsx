"use client";

import * as React from "react";
import { ShieldCheck, FileText, CreditCard, UserSquare, CheckCircle2, AlertTriangle, ArrowRight, RefreshCw, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "./StatusBadge";
import { KycModal } from "./KycModal";

interface KycProgress {
  dlStatus: string;
  aadharStatus: string;
  selfieStatus: string;
  overallKycStatus: "NOT_STARTED" | "PENDING" | "IN_REVIEW" | "APPROVED" | "REJECTED";
  rejectionReason: string | null;
}

interface CompleteKycCardProps {
  kycProgress: KycProgress;
  isProfileComplete: boolean;
  onRefresh: () => void;
}

export function CompleteKycCard({ kycProgress, isProfileComplete, onRefresh }: CompleteKycCardProps) {
  const [modalOpen, setModalOpen] = React.useState(false);

  const { overallKycStatus, rejectionReason, dlStatus, aadharStatus, selfieStatus } = kycProgress;

  const isApproved = overallKycStatus === "APPROVED";
  const isRejected = overallKycStatus === "REJECTED";
  const isInReview = overallKycStatus === "IN_REVIEW" || overallKycStatus === "PENDING";

  const badgeStatus = isApproved
    ? "Approved"
    : isRejected
    ? "Rejected"
    : isInReview
    ? "In Review"
    : "Pending";

  const docs = [
    {
      id: "dl",
      label: "Driving Licence",
      icon: FileText,
      status: dlStatus === "APPROVED" ? "Approved" : dlStatus === "PENDING" ? "Uploaded" : "Pending",
      done: dlStatus === "APPROVED" || dlStatus === "PENDING",
    },
    {
      id: "aadhar",
      label: "Aadhaar Card",
      icon: CreditCard,
      status: aadharStatus === "APPROVED" ? "Approved" : aadharStatus === "PENDING" ? "Uploaded" : "Pending",
      done: aadharStatus === "APPROVED" || aadharStatus === "PENDING",
    },
    {
      id: "selfie",
      label: "Verification Selfie",
      icon: UserSquare,
      status: selfieStatus === "APPROVED" ? "Approved" : selfieStatus === "PENDING" ? "Uploaded" : "Pending",
      done: selfieStatus === "APPROVED" || selfieStatus === "PENDING",
    },
  ];

  return (
    <>
      <div
        className={`flex flex-col justify-between space-y-6 rounded-2xl p-6 shadow-sm transition-all ${
          !isApproved && isProfileComplete && !isInReview
            ? "border-2 border-primary/50 bg-primary/[0.03] shadow-primary/5"
            : "border border-border bg-card hover:border-border/80"
        }`}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="rounded-xl bg-emerald-500/10 p-2 text-emerald-500 dark:bg-emerald-500/20">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display text-base font-bold text-foreground">2. Complete KYC</h3>
                <p className="text-xs text-muted-foreground">Identity & license audit</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {!isApproved && isProfileComplete && !isInReview && (
                <span className="hidden sm:inline-flex items-center rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold text-primary border border-primary/30">
                  Action Required
                </span>
              )}
              <StatusBadge status={badgeStatus} />
            </div>
          </div>

          {/* Workflow Sequence Steps */}
          <div className="space-y-2 rounded-xl bg-muted/40 p-3">
            <div className="text-[11px] font-semibold uppercase text-muted-foreground">
              Workflow Sequence
            </div>
            <div className="flex items-center justify-between text-[11px] font-medium text-foreground">
              <span className={dlStatus !== "NOT_STARTED" ? "text-emerald-500 font-bold" : ""}>
                DL Upload
              </span>
              <span>&rarr;</span>
              <span className={aadharStatus !== "NOT_STARTED" ? "text-emerald-500 font-bold" : ""}>
                Aadhaar
              </span>
              <span>&rarr;</span>
              <span className={selfieStatus !== "NOT_STARTED" ? "text-emerald-500 font-bold" : ""}>
                Selfie
              </span>
              <span>&rarr;</span>
              <span className={isApproved ? "text-emerald-500 font-bold" : isInReview ? "text-amber-500 font-bold" : ""}>
                {isApproved ? "Approved ✓" : "Review"}
              </span>
            </div>
          </div>

          {/* Rejection Banner */}
          {isRejected && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-3.5 text-xs text-destructive space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <AlertTriangle className="h-4 w-4" /> Verification Rejected
              </div>
              <p className="text-[11px] leading-relaxed">
                {rejectionReason || "Uploaded documents were blurry or invalid. Please re-upload legible front and back scans."}
              </p>
            </div>
          )}

          {/* Profile Incomplete Notice */}
          {!isProfileComplete && !isApproved && (
            <div className="flex items-center gap-2 rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-xs text-amber-600 dark:text-amber-400">
              <Lock className="h-4 w-4 flex-shrink-0" />
              <span>Complete your profile first before submitting KYC documents.</span>
            </div>
          )}

          {/* Documents status list */}
          <div className="space-y-2">
            {docs.map((d) => {
              const Icon = d.icon;
              return (
                <div
                  key={d.id}
                  className="flex items-center justify-between rounded-lg border border-border/50 bg-card/50 p-2.5 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-foreground">{d.label}</span>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 font-semibold ${
                      d.done ? "text-emerald-500" : "text-muted-foreground"
                    }`}
                  >
                    {d.done ? <CheckCircle2 className="h-3.5 w-3.5" /> : null}
                    {d.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 border-t border-border/50">
          {isApproved ? (
            <div className="flex items-center justify-between text-xs font-semibold text-emerald-500">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" /> KYC Verified & Cleared
              </span>
              <Button size="sm" variant="outline" onClick={() => setModalOpen(true)}>
                View Documents
              </Button>
            </div>
          ) : isRejected ? (
            <Button
              className="w-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => setModalOpen(true)}
              disabled={!isProfileComplete}
            >
              <RefreshCw className="mr-1.5 h-4 w-4" /> Re-upload KYC Documents
            </Button>
          ) : (
            <Button
              className="w-full"
              onClick={() => setModalOpen(true)}
              disabled={!isProfileComplete}
              title={!isProfileComplete ? "Complete Profile before KYC" : ""}
            >
              Submit KYC Documents <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <KycModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={onRefresh}
      />
    </>
  );
}
