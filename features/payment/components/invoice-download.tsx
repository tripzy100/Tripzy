"use client";

import { Printer, Car, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InvoiceProps {
  invoice: {
    invoiceNumber: string;
    subtotal: any;
    discount: any;
    tax: any;
    total: any;
    issuedAt: Date;
    booking: {
      bookingNumber: string;
      pickupDate: Date;
      returnDate: Date;
      vehicle: { brand: { name: string }; model: { name: string } };
    };
  };
}

export function InvoiceDownload({ invoice }: InvoiceProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-3xl mx-auto rounded-xl border border-border bg-card p-8 shadow-sm print:border-none print:shadow-none space-y-8">
      {/* Top bar with actions */}
      <div className="flex justify-between items-center border-b border-border/60 pb-6 print:hidden">
        <div className="flex items-center gap-2">
          <Car className="h-5 w-5 text-foreground" />
          <span className="font-display font-semibold">Tripzy Invoicing</span>
        </div>
        <Button onClick={handlePrint} variant="outline" size="sm">
          <Printer className="mr-1.5 h-4 w-4" /> Print Invoice
        </Button>
      </div>

      {/* Header Info */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="font-display font-bold text-lg text-foreground">Tax Invoice</h2>
          <span className="text-xs text-muted-foreground block">Invoice Number: {invoice.invoiceNumber}</span>
          <span className="text-xs text-muted-foreground block">Date: {new Date(invoice.issuedAt).toLocaleDateString()}</span>
        </div>
        <div className="text-right">
          <span className="inline-flex rounded-full bg-emerald-500/10 text-emerald-500 px-3 py-1 text-xs font-semibold items-center gap-1">
            <Check className="h-3 w-3" /> PAID
          </span>
        </div>
      </div>

      {/* Details layout */}
      <div className="grid grid-cols-2 gap-8 text-sm border-t border-b border-border/60 py-6">
        <div>
          <span className="text-xs text-muted-foreground block uppercase font-semibold">Rent Details</span>
          <span className="font-medium text-foreground">{invoice.booking.vehicle.brand.name} {invoice.booking.vehicle.model.name}</span>
          <span className="text-xs text-muted-foreground block mt-1">Booking reference: {invoice.booking.bookingNumber}</span>
        </div>
        <div>
          <span className="text-xs text-muted-foreground block uppercase font-semibold">Rental Window</span>
          <span className="text-foreground">{new Date(invoice.booking.pickupDate).toLocaleDateString()} to {new Date(invoice.booking.returnDate).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Totals Sheet */}
      <div className="space-y-4 max-w-sm ml-auto text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Rental Subtotal</span>
          <span className="text-foreground">&#8377;{Number(invoice.subtotal)}</span>
        </div>
        {Number(invoice.discount) > 0 && (
          <div className="flex justify-between text-emerald-500">
            <span>Voucher Discount</span>
            <span>-&#8377;{Number(invoice.discount)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span>GST (18% standard)</span>
          <span>&#8377;{Number(invoice.tax)}</span>
        </div>
        <div className="flex justify-between border-t border-border/60 pt-4 text-base font-bold text-foreground">
          <span>Total Paid</span>
          <span>&#8377;{Number(invoice.total)}</span>
        </div>
      </div>

      {/* Terms */}
      <p className="text-[10px] text-muted-foreground text-center pt-8 border-t border-border/60">
        This is a system generated e-invoice from Tripzy Inc. GST Details are processed based on booking registration coordinates.
      </p>
    </div>
  );
}
export type InvoiceDownloadPropsType = InvoiceProps;
