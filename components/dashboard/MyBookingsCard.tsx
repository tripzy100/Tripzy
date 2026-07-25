"use client";

import * as React from "react";
import Link from "next/link";
import { Calendar, Clock, ArrowUpRight, FileText, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "./StatusBadge";
import { ReceiptModal } from "./ReceiptModal";

interface MyBookingsCardProps {
  bookings: any[];
}

export function MyBookingsCard({ bookings = [] }: MyBookingsCardProps) {
  const [activeTab, setActiveTab] = React.useState<"UPCOMING" | "CURRENT" | "COMPLETED" | "CANCELLED">("UPCOMING");
  const [selectedReceiptBooking, setSelectedReceiptBooking] = React.useState<any | null>(null);

  // Categorize bookings
  const upcomingBookings = bookings.filter((b) => b.status === "CONFIRMED" || b.status === "PENDING");
  const currentBookings = bookings.filter((b) => b.status === "ONGOING" || b.status === "ACTIVE");
  const completedBookings = bookings.filter((b) => b.status === "COMPLETED" || b.status === "FINISHED");
  const cancelledBookings = bookings.filter((b) => b.status === "CANCELLED" || b.status === "REJECTED");

  const getActiveList = () => {
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

  const currentList = getActiveList();

  return (
    <>
      <div className="flex flex-col justify-between space-y-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="rounded-xl bg-blue-500/10 p-2 text-blue-500 dark:bg-blue-500/20">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display text-base font-bold text-foreground">4. My Bookings</h3>
                <p className="text-xs text-muted-foreground">Manage your trips & reservations</p>
              </div>
            </div>
            <StatusBadge status={bookings.length > 0 ? "Active" : "Not Started"} />
          </div>

          {/* Tabbed Navigation */}
          <div className="flex flex-wrap gap-1.5 border-b border-border pb-3 text-xs">
            <button
              onClick={() => setActiveTab("UPCOMING")}
              className={`rounded-lg px-3 py-1.5 font-semibold transition-colors ${
                activeTab === "UPCOMING"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              Upcoming Trips ({upcomingBookings.length})
            </button>
            <button
              onClick={() => setActiveTab("CURRENT")}
              className={`rounded-lg px-3 py-1.5 font-semibold transition-colors ${
                activeTab === "CURRENT"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              Current Booking ({currentBookings.length})
            </button>
            <button
              onClick={() => setActiveTab("COMPLETED")}
              className={`rounded-lg px-3 py-1.5 font-semibold transition-colors ${
                activeTab === "COMPLETED"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              Completed ({completedBookings.length})
            </button>
            <button
              onClick={() => setActiveTab("CANCELLED")}
              className={`rounded-lg px-3 py-1.5 font-semibold transition-colors ${
                activeTab === "CANCELLED"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              Cancelled ({cancelledBookings.length})
            </button>
          </div>

          {/* Booking Items List */}
          <div className="space-y-3">
            {currentList.length > 0 ? (
              currentList.map((b: any) => {
                const vehicleName = b.vehicle
                  ? `${b.vehicle.brand?.name || ""} ${b.vehicle.model?.name || ""}`.trim()
                  : "Self-Drive Vehicle";

                const pickupStr = b.pickupDate ? new Date(b.pickupDate).toLocaleDateString() : "TBD";
                const returnStr = b.returnDate ? new Date(b.returnDate).toLocaleDateString() : "TBD";

                return (
                  <div
                    key={b.id}
                    className="flex flex-col justify-between gap-4 rounded-xl border border-border/80 bg-card/60 p-4 shadow-sm transition-all hover:border-border sm:flex-row sm:items-center"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <StatusBadge status={b.status} />
                        <span className="font-mono text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" /> Booking ID: {b.bookingNumber || b.id.slice(0, 8)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Car className="h-4 w-4 text-primary" />
                        <h4 className="font-display text-sm font-bold text-foreground">{vehicleName}</h4>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" /> Pickup: {pickupStr}
                        </span>
                        <span>&rarr;</span>
                        <span className="flex items-center gap-1">
                          Return: {returnStr}
                        </span>
                      </div>

                      {/* Payment Status badge */}
                      <div className="flex items-center gap-1.5 text-[11px]">
                        <span className="text-muted-foreground font-semibold">Payment:</span>
                        <span className="inline-flex rounded-full bg-emerald-500/10 px-2 py-0.5 font-bold text-emerald-500">
                          {b.paymentStatus || "COMPLETED"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                      <Link href={`/bookings/${b.id}`}>
                        <Button size="sm" variant="outline" className="w-full text-xs">
                          View Details <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="w-full text-xs"
                        onClick={() => setSelectedReceiptBooking(b)}
                      >
                        <FileText className="mr-1 h-3.5 w-3.5" /> Receipt
                      </Button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="rounded-xl border border-dashed border-border/80 p-8 text-center space-y-2">
                <Car className="mx-auto h-8 w-8 text-muted-foreground/40" />
                <div className="text-xs font-semibold text-foreground">
                  No {activeTab.toLowerCase()} bookings found
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Once you reserve a car after KYC clearance, your trip itinerary will appear here.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* View All link */}
        <div className="pt-2 border-t border-border/50 flex justify-between items-center text-xs">
          <span className="text-muted-foreground">Total Reservations: {bookings.length}</span>
          <Link href="/dashboard/bookings" className="font-semibold text-primary hover:underline flex items-center gap-1">
            Open Booking Directory &rarr;
          </Link>
        </div>
      </div>

      {selectedReceiptBooking && (
        <ReceiptModal
          isOpen={!!selectedReceiptBooking}
          onClose={() => setSelectedReceiptBooking(null)}
          booking={selectedReceiptBooking}
        />
      )}
    </>
  );
}
