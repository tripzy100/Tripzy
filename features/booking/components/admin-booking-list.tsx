"use client";

import * as React from "react";
import { Trash2, AlertCircle, CheckCircle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/providers/app-provider";
import { cancelBooking, confirmBooking } from "../actions/booking-actions";

interface AdminBooking {
  id: string;
  pickupDate: Date;
  returnDate: Date;
  status: string;
  totalAmount: any;
  user: { email: string };
  vehicle: {
    brand: { name: string };
    model: { name: string };
  };
}

export function AdminBookingList({ initialBookings }: { initialBookings: AdminBooking[] }) {
  const { showToast } = useToast();
  const [bookings, setBookings] = React.useState(initialBookings);

  const handleForceCancel = async (id: string) => {
    const res = await cancelBooking({ bookingId: id, reason: "Admin override cancellation" });
    if (res.success) {
      showToast("Reservation force cancelled by admin", "success");
      setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: "CANCELLED" } : b)));
    }
  };

  const handleForceConfirm = async (id: string) => {
    const res = await confirmBooking(id);
    if (res.success) {
      showToast("Reservation force confirmed by admin", "success");
      setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: "CONFIRMED" } : b)));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
          Platform Bookings Control
        </h1>
        <Button onClick={() => window.location.reload()} variant="outline">
          <RefreshCcw className="mr-1.5 h-4 w-4" /> Refresh Lists
        </Button>
      </div>

      {/* Bookings table */}
      <div className="overflow-hidden rounded-xl border border-border bg-card/30">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-xs font-semibold uppercase text-muted-foreground">
              <th className="p-4">Customer Email</th>
              <th className="p-4">Vehicle Reserved</th>
              <th className="p-4">Rental Duration</th>
              <th className="p-4">Billing</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-sm text-foreground/80">
            {bookings.map((b) => (
              <tr key={b.id} className="transition-colors hover:bg-muted/10">
                <td className="p-4 font-medium text-foreground">{b.user.email}</td>
                <td className="p-4">
                  {b.vehicle.brand.name} {b.vehicle.model.name}
                </td>
                <td className="p-4 font-mono text-xs">
                  {new Date(b.pickupDate).toLocaleDateString()} -{" "}
                  {new Date(b.returnDate).toLocaleDateString()}
                </td>
                <td className="p-4 font-semibold text-foreground">
                  &#8377;{Number(b.totalAmount)}
                </td>
                <td className="p-4">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      b.status === "CONFIRMED"
                        ? "bg-emerald-500/10 text-emerald-500"
                        : "bg-amber-500/10 text-amber-500"
                    }`}
                  >
                    {b.status}
                  </span>
                </td>
                <td className="flex justify-end gap-2 p-4 text-right">
                  {b.status === "PENDING" && (
                    <Button onClick={() => handleForceConfirm(b.id)} size="sm">
                      <CheckCircle className="mr-1 h-3.5 w-3.5" /> Force Confirm
                    </Button>
                  )}
                  {b.status !== "CANCELLED" && (
                    <Button onClick={() => handleForceCancel(b.id)} variant="destructive" size="sm">
                      <Trash2 className="h-3.5 w-3.5" /> Override
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export type AdminBookingListPropsType = { initialBookings: AdminBooking[] };
