"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText, Download, Printer, CheckCircle2, Car } from "lucide-react";
import { useToast } from "@/providers/app-provider";

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: any;
}

export function ReceiptModal({ isOpen, onClose, booking }: ReceiptModalProps) {
  const { showToast } = useToast();

  if (!booking) return null;

  const vehicleName = booking.vehicle
    ? `${booking.vehicle.brand?.name || ""} ${booking.vehicle.model?.name || ""}`.trim()
    : "Self-Drive Vehicle";

  const pickupDateStr = booking.pickupDate ? new Date(booking.pickupDate).toLocaleDateString() : "N/A";
  const returnDateStr = booking.returnDate ? new Date(booking.returnDate).toLocaleDateString() : "N/A";

  const handleDownload = () => {
    showToast(`Downloading receipt PDF for ${booking.bookingNumber || booking.id}`, "success");
    window.print();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-display text-lg font-bold text-foreground">
            <FileText className="h-5 w-5 text-primary" /> Booking Receipt
          </DialogTitle>
          <DialogDescription>
            Official tax receipt and reservation confirmation.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-xl border border-border bg-card p-5 space-y-4 text-xs">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <div className="font-display text-lg font-bold tracking-tight text-foreground">TRIPZY</div>
              <div className="text-[11px] text-muted-foreground">Self-Drive Rentals India</div>
            </div>
            <div className="text-right">
              <span className="inline-flex rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-500">
                PAID & CONFIRMED
              </span>
              <div className="mt-1 font-mono text-[10px] text-muted-foreground">
                Ref: {booking.bookingNumber || booking.id.slice(0, 8)}
              </div>
            </div>
          </div>

          {/* Vehicle info */}
          <div className="flex items-center gap-3 rounded-lg bg-muted/40 p-3">
            <div className="rounded-md bg-primary/10 p-2 text-primary">
              <Car className="h-5 w-5" />
            </div>
            <div>
              <div className="font-semibold text-foreground">{vehicleName}</div>
              <div className="text-[11px] text-muted-foreground">Unlimited KMs • Standard Insurance</div>
            </div>
          </div>

          {/* Dates & Locations */}
          <div className="grid grid-cols-2 gap-3 border-b border-border pb-3">
            <div>
              <span className="text-[10px] uppercase text-muted-foreground font-semibold">Pickup Date</span>
              <div className="font-medium text-foreground">{pickupDateStr}</div>
            </div>
            <div>
              <span className="text-[10px] uppercase text-muted-foreground font-semibold">Return Date</span>
              <div className="font-medium text-foreground">{returnDateStr}</div>
            </div>
          </div>

          {/* Payment summary */}
          <div className="space-y-1.5 border-b border-border pb-3">
            <div className="flex justify-between text-muted-foreground">
              <span>Rental Charges</span>
              <span>&#8377;3,499.00</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Refundable Security Deposit</span>
              <span>&#8377;2,000.00</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>GST & Taxes (18%)</span>
              <span>&#8377;629.82</span>
            </div>
            <div className="flex justify-between pt-2 font-bold text-sm text-foreground">
              <span>Total Amount Paid</span>
              <span>&#8377;6,128.82</span>
            </div>
          </div>

          {/* Footer note */}
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-4 w-4" /> Valid proof of rental payment for tax compliance.
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={handleDownload}>
            <Download className="mr-1.5 h-4 w-4" /> Download / Print PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
