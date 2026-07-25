"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShieldCheck, FileText, CreditCard, UserSquare, Upload, CheckCircle2, AlertCircle } from "lucide-react";
import { useToast } from "@/providers/app-provider";

interface KycModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialDl?: string;
  initialAadhar?: string;
}

export function KycModal({ isOpen, onClose, onSuccess, initialDl = "", initialAadhar = "" }: KycModalProps) {
  const { showToast } = useToast();
  const [step, setStep] = React.useState<1 | 2 | 3>(1);
  const [loading, setLoading] = React.useState(false);

  const [dlNumber, setDlNumber] = React.useState(initialDl || "DL-0420110098765");
  const [aadharNumber, setAadharNumber] = React.useState(initialAadhar || "5432 8765 1092");
  const [selfieCaptured, setSelfieCaptured] = React.useState(true);

  React.useEffect(() => {
    if (initialDl) setDlNumber(initialDl);
    if (initialAadhar) setAadharNumber(initialAadhar);
  }, [initialDl, initialAadhar, isOpen]);

  const handleSubmitAll = async (autoApprove: boolean = true) => {
    setLoading(true);
    try {
      const res = await fetch("/api/kyc/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          drivingLicenseNumber: dlNumber,
          aadharNumber: aadharNumber,
          selfieUploaded: selfieCaptured,
          autoApprove,
        }),
      });

      const data = await res.json();
      if (data.success) {
        showToast(data.message || "KYC submitted successfully!", "success");
        onSuccess();
        onClose();
      } else {
        showToast(data.message || "Failed to submit KYC", "error");
      }
    } catch (err: any) {
      showToast("Network error submitting KYC", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-display text-xl font-bold text-foreground">
            <ShieldCheck className="h-5 w-5 text-emerald-500" /> KYC Verification Portal
          </DialogTitle>
          <DialogDescription>
            Follow the 3-step document submission to verify your driving credentials.
          </DialogDescription>
        </DialogHeader>

        {/* Step Indicator */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div
            className={`flex items-center gap-2 text-xs font-semibold ${
              step >= 1 ? "text-primary font-bold" : "text-muted-foreground"
            }`}
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
              1
            </span>
            Driving Licence
          </div>
          <div
            className={`flex items-center gap-2 text-xs font-semibold ${
              step >= 2 ? "text-primary font-bold" : "text-muted-foreground"
            }`}
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
              2
            </span>
            Aadhaar Card
          </div>
          <div
            className={`flex items-center gap-2 text-xs font-semibold ${
              step >= 3 ? "text-primary font-bold" : "text-muted-foreground"
            }`}
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
              3
            </span>
            Live Selfie
          </div>
        </div>

        <div className="py-2 space-y-4">
          {/* STEP 1: DRIVING LICENCE */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                  <FileText className="h-4 w-4 text-primary" /> Step 1: Upload Driving Licence
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                    Driving Licence Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={dlNumber}
                    onChange={(e) => setDlNumber(e.target.value)}
                    placeholder="e.g. DL-0420110098765"
                    className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="rounded-lg border border-dashed border-border/80 bg-card p-4 text-center">
                  <Upload className="mx-auto h-6 w-6 text-muted-foreground" />
                  <span className="mt-1 block text-xs font-medium text-foreground">
                    DL Front & Back Scans Uploaded (Mock OCR Active)
                  </span>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button onClick={() => setStep(2)}>
                  Next: Aadhaar Card &rarr;
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2: AADHAAR CARD */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                  <CreditCard className="h-4 w-4 text-primary" /> Step 2: Upload Aadhaar Card
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                    Aadhaar Number (12 Digits) *
                  </label>
                  <input
                    type="text"
                    required
                    value={aadharNumber}
                    onChange={(e) => setAadharNumber(e.target.value)}
                    placeholder="e.g. 5432 8765 1092"
                    className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="rounded-lg border border-dashed border-border/80 bg-card p-4 text-center">
                  <Upload className="mx-auto h-6 w-6 text-muted-foreground" />
                  <span className="mt-1 block text-xs font-medium text-foreground">
                    Aadhaar Card Front Scan Uploaded
                  </span>
                </div>
              </div>
              <div className="flex justify-between gap-3">
                <Button variant="outline" onClick={() => setStep(1)}>
                  &larr; Back
                </Button>
                <Button onClick={() => setStep(3)}>
                  Next: Verification Selfie &rarr;
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: SELFIE CHECK */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-3 text-center">
                <div className="flex items-center justify-center gap-2 text-sm font-bold text-foreground">
                  <UserSquare className="h-4 w-4 text-primary" /> Step 3: Face Verification Selfie
                </div>
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 ring-4 ring-emerald-500/20">
                  <CheckCircle2 className="h-12 w-12" />
                </div>
                <p className="text-xs text-muted-foreground">
                  Liveness facial verification active. Image matches Driving Licence photo vector.
                </p>
              </div>

              <div className="flex items-center gap-2 rounded-lg bg-blue-500/10 p-3 text-xs text-blue-500">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>Submitting will instantly process automated verification and update your status.</span>
              </div>

              <div className="flex justify-between gap-3">
                <Button variant="outline" onClick={() => setStep(2)}>
                  &larr; Back
                </Button>
                <Button isLoading={loading} onClick={() => handleSubmitAll(true)}>
                  Submit KYC For Verification
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
