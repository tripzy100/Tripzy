"use client";

import * as React from "react";
import { Calendar, MapPin, Search, Clock, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/providers/app-provider";

export default function SearchWidget() {
  const { showToast } = useToast();
  const [city, setCity] = React.useState("Ranchi / Lalpur");
  const [vehicleType, setVehicleType] = React.useState("SUV");
  const today = new Date().toISOString().split("T")[0];
  const futureDate = new Date(Date.now() + 4 * 86400000).toISOString().split("T")[0];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(`Searching for ${vehicleType}s in ${city} matching dates...`, "info");
  };

  return (
    <div className="relative z-20 mx-auto -mt-16 w-full max-w-6xl px-6">
      <form
        onSubmit={handleSearch}
        className="glassmorphism rounded-2xl border border-border p-6 shadow-2xl backdrop-blur-xl"
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Pickup City and Location */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" /> Pickup City & Location
            </label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="Ranchi / Lalpur">Ranchi / Lalpur</option>
              <option value="Ranchi Airpot / Birsa Chowk">Ranchi Airpot / Birsa Chowk</option>
            </select>
          </div>

          {/* Dates Selection */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" /> Date Window
            </label>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <input
                type="date"
                defaultValue={today}
                className="w-full rounded-lg border border-input bg-card px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <input
                type="date"
                defaultValue={futureDate}
                className="w-full rounded-lg border border-input bg-card px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          {/* Times Selection */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Clock className="h-3.5 w-3.5" /> Hours Window
            </label>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <input
                type="time"
                defaultValue="09:00"
                className="w-full rounded-lg border border-input bg-card px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <input
                type="time"
                defaultValue="18:00"
                className="w-full rounded-lg border border-input bg-card px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          {/* Vehicle Class & Promo */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5" /> Category & Promo
            </label>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <select
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                className="w-full rounded-lg border border-input bg-card px-2 py-1.5 text-xs text-foreground focus:outline-none"
              >
                <option value="SUV">SUV</option>
                <option value="Sedan">Sedan</option>
                <option value="EV">EV Class</option>
              </select>
            </div>
          </div>
        </div>

        {/* Search Submit button */}
        <div className="mt-6 flex justify-end">
          <Button type="submit" className="w-full px-8 sm:w-auto">
            <Search className="mr-2 h-4 w-4" /> Find Available Vehicles
          </Button>
        </div>
      </form>
    </div>
  );
}
