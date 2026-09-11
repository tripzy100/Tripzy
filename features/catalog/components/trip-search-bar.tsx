"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MapPin, Calendar, Clock, Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

export function TripSearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [location, setLocation] = React.useState(
    searchParams.get("location") || searchParams.get("city") || "Ranchi / Lalpur"
  );
  const [pickupDate, setPickupDate] = React.useState(
    searchParams.get("pickupDate") || new Date().toISOString().split("T")[0]
  );
  const [pickupTime, setPickupTime] = React.useState(
    searchParams.get("pickupTime") || "09:00"
  );
  const [returnDate, setReturnDate] = React.useState(
    searchParams.get("returnDate") || new Date(Date.now() + 2 * 86400000).toISOString().split("T")[0]
  );
  const [returnTime, setReturnTime] = React.useState(
    searchParams.get("returnTime") || "18:00"
  );

  const [isMobileExpanded, setIsMobileExpanded] = React.useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    params.set("location", location);
    params.set("pickupDate", pickupDate);
    params.set("pickupTime", pickupTime);
    params.set("returnDate", returnDate);
    params.set("returnTime", returnTime);
    router.push(`/cars?${params.toString()}`);
    setIsMobileExpanded(false);
  };

  const formatDateLabel = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="w-full mb-8">
      {/* Mobile Compact Trip Summary Bar (< 768px) */}
      <div className="flex md:hidden items-center justify-between rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
            <MapPin className="h-3.5 w-3.5 text-primary" />
            <span>{location}</span>
          </div>
          <p className="text-[11px] text-muted-foreground">
            {formatDateLabel(pickupDate)} ({pickupTime}) → {formatDateLabel(returnDate)} ({returnTime})
          </p>
        </div>

        <Button
          size="sm"
          variant="outline"
          onClick={() => setIsMobileExpanded(!isMobileExpanded)}
          className="h-9 px-3 text-xs font-bold gap-1"
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          <span>{isMobileExpanded ? "Close" : "Change"}</span>
        </Button>
      </div>

      {/* Full Trip Controls (Always Visible on Desktop, Expandable on Mobile) */}
      <div
        className={`${
          isMobileExpanded ? "block mt-3" : "hidden"
        } md:block rounded-xl border border-border bg-card p-4 sm:p-5 shadow-sm`}
      >
        <form onSubmit={handleSearchSubmit} className="grid gap-4 md:grid-cols-4 md:items-end">
          {/* Pickup Location */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 text-primary" /> Location
            </label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-xs font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="Ranchi / Lalpur">Ranchi / Lalpur Hub</option>
              <option value="Ranchi Airport / Birsa Chowk">Ranchi Airport (Birsa Chowk)</option>
              <option value="Ranchi Railway Station">Ranchi Railway Station</option>
            </select>
          </div>

          {/* Pickup Date & Time */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              <Calendar className="h-3.5 w-3.5 text-primary" /> Pickup Window
            </label>
            <div className="grid grid-cols-1 min-[390px]:grid-cols-2 gap-2">
              <input
                type="date"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                className="flex h-11 w-full rounded-lg border border-input bg-background px-2.5 py-2 text-xs font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <div className="relative flex items-center">
                <Clock className="absolute left-2.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                <input
                  type="time"
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  className="flex h-11 w-full rounded-lg border border-input bg-background pl-8 pr-2 py-2 text-xs font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
            </div>
          </div>

          {/* Return Date & Time */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              <Calendar className="h-3.5 w-3.5 text-primary" /> Return Window
            </label>
            <div className="grid grid-cols-1 min-[390px]:grid-cols-2 gap-2">
              <input
                type="date"
                value={returnDate}
                min={pickupDate}
                onChange={(e) => setReturnDate(e.target.value)}
                className="flex h-11 w-full rounded-lg border border-input bg-background px-2.5 py-2 text-xs font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <div className="relative flex items-center">
                <Clock className="absolute left-2.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                <input
                  type="time"
                  value={returnTime}
                  onChange={(e) => setReturnTime(e.target.value)}
                  className="flex h-11 w-full rounded-lg border border-input bg-background pl-8 pr-2 py-2 text-xs font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
            </div>
          </div>

          {/* Action */}
          <div>
            <Button type="submit" size="lg" className="h-11 w-full font-bold text-xs sm:text-sm">
              <Search className="mr-2 h-4 w-4" /> Update Search
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
