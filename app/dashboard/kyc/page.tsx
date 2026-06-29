"use client";

import * as React from "react";
import { Upload, CheckCircle2, FileText, UserSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/providers/app-provider";

export default function KycPage() {
  const { showToast } = useToast();
  const [selfieStatus, setSelfieStatus] = React.useState("PENDING");

  const handleUpload = (docName: string) => {
    showToast(`${docName} upload process started`, "info");
    if (docName === "Selfie") {
      setSelfieStatus("VERIFIED");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-gradient">KYC Verification Portal</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Verify your driving license and national identity details to unlock high-performance vehicles.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Document uploads cards */}
        <div className="space-y-4">
          <h3 className="font-display text-base font-bold text-foreground">Required Documents</h3>

          {/* DL Status card */}
          <div className="rounded-xl border border-border bg-card/30 p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2 text-foreground">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-semibold">Driving Licence</div>
                <div className="text-xs text-muted-foreground">Original license scan front & back</div>
              </div>
            </div>
            <span className="inline-flex rounded-full bg-emerald-500/10 text-emerald-500 px-2.5 py-0.5 text-xs font-semibold items-center gap-1">
              <CheckCircle2 className="h-3 w-3" /> Approved
            </span>
          </div>

          {/* Selfie Card */}
          <div className="rounded-xl border border-border bg-card/30 p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2 text-foreground">
                <UserSquare className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-semibold">Verification Selfie</div>
                <div className="text-xs text-muted-foreground">Recent headshot selfie check</div>
              </div>
            </div>
            {selfieStatus === "VERIFIED" ? (
              <span className="inline-flex rounded-full bg-emerald-500/10 text-emerald-500 px-2.5 py-0.5 text-xs font-semibold items-center gap-1">
                <CheckCircle2 className="h-3 w-3" /> Approved
              </span>
            ) : (
              <Button onClick={() => handleUpload("Selfie")} size="sm">
                <Upload className="mr-1 h-3.5 w-3.5" /> Upload
              </Button>
            )}
          </div>
        </div>

        {/* Verification timeline panel */}
        <div className="rounded-xl border border-border bg-card/45 p-6 space-y-6">
          <h3 className="font-display text-base font-bold text-foreground">Status Timeline</h3>
          
          <div className="relative border-l-2 border-border/80 pl-6 space-y-6 ml-2">
            {/* Step 1 */}
            <div className="relative">
              <span className="absolute -left-9 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white ring-4 ring-background">
                <CheckCircle2 className="h-3.5 w-3.5 fill-current" />
              </span>
              <div className="text-sm font-semibold text-foreground">Documents Submitted</div>
              <p className="text-xs text-muted-foreground mt-1">
                DL scans and phone verify codes entered successfully.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <span className="absolute -left-9 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white ring-4 ring-background">
                <CheckCircle2 className="h-3.5 w-3.5 fill-current" />
              </span>
              <div className="text-sm font-semibold text-foreground">Automated OCR Checks</div>
              <p className="text-xs text-muted-foreground mt-1">
                Parsed licence names matching registration vectors.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <span className="absolute -left-9 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white ring-4 ring-background">
                <CheckCircle2 className="h-3.5 w-3.5 fill-current" />
              </span>
              <div className="text-sm font-semibold text-foreground">KYC Verification Completed</div>
              <p className="text-xs text-muted-foreground mt-1">
                Profile cleared. Ready to rent standard fleet.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export type KycPagePropsType = typeof KycPage;
