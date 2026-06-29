"use client";

import * as React from "react";
import { Check, X, ShieldAlert, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/providers/app-provider";

export default function HumanReviewQueuePage() {
  const { showToast } = useToast();
  const [queue, setQueue] = React.useState([
    {
      id: "ocr-1",
      user: "suresh@example.com",
      ocrDetails: { name: "Suresh Kumar", dob: "1991-03-14", licenseNumber: "DL-11-20199842", expiry: "2032-04-12" },
      confidence: 0.88,
    },
  ]);

  const handleUpdateField = (id: string, field: string, value: string) => {
    setQueue((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              ocrDetails: { ...item.ocrDetails, [field]: value },
            }
          : item
      )
    );
  };

  const handleResolveOCR = (id: string, approve: boolean) => {
    setQueue((prev) => prev.filter((item) => item.id !== id));
    showToast(approve ? "OCR verification approved" : "OCR document rejected", "success");
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-gradient flex items-center gap-2">
          <ShieldAlert className="h-6 w-6 text-destructive" /> Human Review Queue
        </h1>
        <p className="text-sm text-muted-foreground mt-2">
          Manually review and override high-risk document OCR details that fell below confidence thresholds.
        </p>
      </div>

      <div className="grid gap-6">
        {queue.map((item) => (
          <div key={item.id} className="rounded-xl border border-border bg-card/30 p-6 space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs text-muted-foreground">User Address Coordinates</span>
                <h4 className="font-display font-semibold text-foreground text-sm flex items-center gap-1">
                  <User className="h-4.5 w-4.5 text-primary" /> {item.user}
                </h4>
              </div>
              <span className="text-xs font-bold text-destructive font-mono bg-destructive/10 px-2 py-0.5 rounded-full">
                Confidence: {Math.round(item.confidence * 100)}%
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-1.5">
                <label className="text-[10px] text-muted-foreground uppercase font-bold">Name</label>
                <input
                  value={item.ocrDetails.name}
                  onChange={(e) => handleUpdateField(item.id, "name", e.target.value)}
                  className="w-full rounded-lg border border-border bg-card/30 px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] text-muted-foreground uppercase font-bold">Licence Number</label>
                <input
                  value={item.ocrDetails.licenseNumber}
                  onChange={(e) => handleUpdateField(item.id, "licenseNumber", e.target.value)}
                  className="w-full rounded-lg border border-border bg-card/30 px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] text-muted-foreground uppercase font-bold">DOB</label>
                <input
                  value={item.ocrDetails.dob}
                  onChange={(e) => handleUpdateField(item.id, "dob", e.target.value)}
                  className="w-full rounded-lg border border-border bg-card/30 px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] text-muted-foreground uppercase font-bold">Expiry Date</label>
                <input
                  value={item.ocrDetails.expiry}
                  onChange={(e) => handleUpdateField(item.id, "expiry", e.target.value)}
                  className="w-full rounded-lg border border-border bg-card/30 px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-4 border-t border-border/60">
              <Button onClick={() => handleResolveOCR(item.id, false)} variant="outline" size="sm">
                <X className="mr-1 h-3.5 w-3.5" /> Reject Doc
              </Button>
              <Button onClick={() => handleResolveOCR(item.id, true)} size="sm">
                <Check className="mr-1 h-3.5 w-3.5" /> Confirm Override
              </Button>
            </div>
          </div>
        ))}

        {queue.length === 0 && (
          <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground text-xs">
            No high-risk documents pending human validation. All clear!
          </div>
        )}
      </div>
    </div>
  );
}
export type HumanReviewQueuePagePropsType = Record<string, never>;
