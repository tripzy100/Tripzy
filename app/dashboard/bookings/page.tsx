"use client";

import * as React from "react";
import Link from "next/link";
import { Clock, CalendarRange, Car, FileText, ArrowUpRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { ReceiptModal } from "@/components/dashboard/ReceiptModal";

export default function CustomerBookingsPage() {
  const [bookings, setBookings] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState<"UPCOMING" | "CURRENT" | "COMPLETED" | "CANCELLED">("UPCOMING");
  const [selectedReceipt, setSelectedReceipt] = React.useState<any | null>(null);

  const fetchBookings = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/dashboard/status");
      const json = await res.json();
      if (json.success) {
        setBookings(json.data.bookings || []);
      }
    } catch (err) {
      console.error("Failed to load bookings", err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const upcomingBookings = bookings.filter((b) => b.status === "CONFIRMED" || b.status === "PENDING");
  const currentBookings = bookings.filter((b) => b.status === "ONGOING" || b.status === "ACTIVE");
  const completedBookings = bookings.filter((b) => b.status === "COMPLETED" || b.status === "FINISHED");
  const cancelledBookings = bookings.filter((b) => b.status === "CANCELLED" || b.status === "REJECTED");

  const getFilteredBookings = () => {
    switch (activeTab) {
      case "UPCOMING":
        return upcomingBookings;
      case "CURRENT":
        return currentBookings;
      case "COMPLETED":
        return completedBookings;
      case "CANCELLED":
        return cancelledBookings;
      default:
        return upcomingBookings;
    }
  };

  const filtered = getFilteredBookings();

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-gradient font-display text-2xl font-bold tracking-tight">
            My Rental Directory
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Review details of upcoming bookings, trip itineraries, and official tax invoices.
          </p>
        </div>
        <Link href="/cars">
          <Button size="sm">
            <Search className="mr-1.5 h-3.5 w-3.5" /> Browse Fleet
          </Button>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-border pb-3">
        <button
          onClick={() => setActiveTab("UPCOMING")}
          className={`rounded-lg px-4 py-2 text-xs font-semibold transition-colors ${
            activeTab === "UPCOMING"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          Upcoming Trips ({upcomingBookings.length})
        </button>
        <button
          onClick={() => setActiveTab("CURRENT")}
          className={`rounded-lg px-4 py-2 text-xs font-semibold transition-colors ${
            activeTab === "CURRENT"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          Current Booking ({currentBookings.length})
        </button>
        <button
          onClick={() => setActiveTab("COMPLETED")}
          className={`rounded-lg px-4 py-2 text-xs font-semibold transition-colors ${
            activeTab === "COMPLETED"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          Completed Trips ({completedBookings.length})
        </button>
        <button
          onClick={() => setActiveTab("CANCELLED")}
          className={`rounded-lg px-4 py-2 text-xs font-semibold transition-colors ${
            activeTab === "CANCELLED"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          Cancelled ({cancelledBookings.length})
        </button>
      </div>

      {/* List */}
      <div className="grid gap-4">
        {loading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-24 rounded-xl bg-muted/60" />
            <div className="h-24 rounded-xl bg-muted/60" />
          </div>
        ) : filtered.length > 0 ? (
          filtered.map((b: any) => {
            const vehicleName = b.vehicle
              ? `${b.vehicle.brand?.name || ""} ${b.vehicle.model?.name || ""}`.trim()
              : "Self-Drive Vehicle";

            return (
              <div
                key={b.id}
                className="flex flex-col justify-between gap-4 rounded-xl border border-border bg-card/40 p-6 sm:flex-row sm:items-center"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={b.status} />
                    <span className="flex items-center gap-1 font-mono text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" /> Ref: {b.bookingNumber || b.id.slice(0, 8)}
                    </span>
                  </div>
                  <h3 className="font-display text-base font-semibold text-foreground flex items-center gap-2">
                    <Car className="h-4 w-4 text-primary" /> {vehicleName}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CalendarRange className="h-3.5 w-3.5" />
                    <span>
                      {new Date(b.pickupDate).toLocaleDateString()} &rarr;{" "}
                      {new Date(b.returnDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Link href={`/bookings/${b.id}`}>
                    <Button size="sm" variant="outline">
                      Details <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
                    </Button>
                  </Link>
                  <Button size="sm" variant="ghost" onClick={() => setSelectedReceipt(b)}>
                    <FileText className="mr-1 h-3.5 w-3.5" /> Download Receipt
                  </Button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="rounded-xl border border-dashed border-border p-12 text-center text-xs text-muted-foreground space-y-2">
            <Car className="mx-auto h-8 w-8 text-muted-foreground/40" />
            <div>No reservations found in {activeTab.toLowerCase()} list.</div>
          </div>
        )}
      </div>

      {selectedReceipt && (
        <ReceiptModal
          isOpen={!!selectedReceipt}
          onClose={() => setSelectedReceipt(null)}
          booking={selectedReceipt}
        />
      )}
    </div>
  );
}
