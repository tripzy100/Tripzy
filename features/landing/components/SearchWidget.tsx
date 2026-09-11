"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { MapPin, Calendar, Search, Sparkles, ChevronDown, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SearchWidget() {
  const router = useRouter();
  const [pickupLocation, setPickupLocation] = React.useState("Ranchi / Lalpur");
  
  const todayObj = new Date();
  const todayStr = todayObj.toISOString().split("T")[0];
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split("T")[0];
  const defaultReturnStr = new Date(Date.now() + 2 * 86400000).toISOString().split("T")[0];

  const [pickupDate, setPickupDate] = React.useState(todayStr);
  const [returnDate, setReturnDate] = React.useState(defaultReturnStr);
  const [pickupTime, setPickupTime] = React.useState("10:00");
  const [returnTime, setReturnTime] = React.useState("10:00");
  const [activePreset, setActivePreset] = React.useState<"today" | "tomorrow" | "weekend" | null>("today");

  // Dynamic Date Preset Handlers
  const selectToday = () => {
    setActivePreset("today");
    setPickupDate(todayStr);
    setReturnDate(tomorrowStr);
  };

  const selectTomorrow = () => {
    setActivePreset("tomorrow");
    setPickupDate(tomorrowStr);
    const dayAfter = new Date(Date.now() + 2 * 86400000).toISOString().split("T")[0];
    setReturnDate(dayAfter);
  };

  const selectThisWeekend = () => {
    setActivePreset("weekend");
    const dayOfWeek = todayObj.getDay(); // 0 = Sun, 6 = Sat
    const daysUntilSaturday = (6 - dayOfWeek + 7) % 7 || 7;
    const satObj = new Date(Date.now() + daysUntilSaturday * 86400000);
    const sunObj = new Date(satObj.getTime() + 86400000);

    setPickupDate(satObj.toISOString().split("T")[0]);
    setReturnDate(sunObj.toISOString().split("T")[0]);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const queryParams = new URLSearchParams({
      location: pickupLocation,
      pickupDate,
      pickupTime,
      returnDate,
      returnTime,
    });
    router.push(`/cars?${queryParams.toString()}`);
  };

  return (
    <div id="search-widget" className="relative z-20 mx-auto mt-2 sm:-mt-10 lg:-mt-16 w-full max-w-7xl px-3 sm:px-6 lg:px-8">
      <form
        onSubmit={handleSearch}
        className="rounded-2xl border border-border/80 bg-card p-3.5 sm:p-5 lg:p-6 shadow-xl backdrop-blur-xl transition-all space-y-3.5 sm:space-y-4"
      >
        {/* Quick Date Presets Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-border/60 pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="text-[10px] sm:text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              QUICK RENTAL SELECT:
            </span>
            <div className="grid grid-cols-3 sm:flex sm:items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={selectToday}
                className={`h-7.5 sm:h-8 px-2 sm:px-3.5 rounded-lg text-[11px] sm:text-xs font-bold transition-all shadow-2xs truncate text-center ${
                  activePreset === "today"
                    ? "bg-[#f59e0b] text-white shadow-xs"
                    : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                Today &rarr; Tomorrow
              </button>
              <button
                type="button"
                onClick={selectTomorrow}
                className={`h-7.5 sm:h-8 px-2 sm:px-3.5 rounded-lg text-[11px] sm:text-xs font-bold transition-all truncate text-center ${
                  activePreset === "tomorrow"
                    ? "bg-[#f59e0b] text-white shadow-xs"
                    : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                Tomorrow
              </button>
              <button
                type="button"
                onClick={selectThisWeekend}
                className={`h-7.5 sm:h-8 px-2 sm:px-3.5 rounded-lg text-[11px] sm:text-xs font-bold transition-all truncate text-center ${
                  activePreset === "weekend"
                    ? "bg-[#f59e0b] text-white shadow-xs"
                    : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                This Weekend
              </button>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-1.5 text-xs font-bold text-[#f59e0b] dark:text-amber-400">
            <Sparkles className="h-4 w-4" />
            <span>Instant booking &bull; Birsa Munda Airport & Lalpur Hub</span>
          </div>
        </div>

        {/* Input Controls Grid (12 Columns Desktop) */}
        <div className="grid gap-3.5 md:grid-cols-2 lg:grid-cols-12 lg:items-end">
          {/* 1. Pickup Location (3 cols) */}
          <div className="space-y-1.5 lg:col-span-3 min-w-0">
            <div className="relative rounded-xl border border-border/80 bg-background/80 px-3.5 py-2 hover:border-primary/50 transition-colors focus-within:ring-2 focus-within:ring-primary shadow-2xs">
              <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 text-[#f59e0b] shrink-0" /> PICKUP LOCATION
              </label>
              <div className="relative flex items-center mt-1">
                <select
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm font-bold text-foreground focus:outline-none cursor-pointer appearance-none pr-6 truncate"
                >
                  <option value="Ranchi / Lalpur">Ranchi / Lalpur Hub</option>
                  <option value="Ranchi Airport / Birsa Chowk">Ranchi Airport (Birsa Chowk)</option>
                  <option value="Ranchi Railway Station">Ranchi Railway Station</option>
                </select>
                <ChevronDown className="absolute right-0 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>
          </div>

          {/* 2. Pickup Date & Time (3 cols) */}
          <div className="space-y-1.5 lg:col-span-3 min-w-0">
            <div className="rounded-xl border border-border/80 bg-background/80 px-3.5 py-2 hover:border-primary/50 transition-colors focus-within:ring-2 focus-within:ring-primary shadow-2xs">
              <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                <Calendar className="h-3.5 w-3.5 text-[#f59e0b] shrink-0" /> PICKUP DATE & TIME
              </label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <input
                  type="date"
                  value={pickupDate}
                  min={todayStr}
                  onChange={(e) => {
                    setPickupDate(e.target.value);
                    setActivePreset(null);
                  }}
                  className="w-full bg-transparent text-xs sm:text-sm font-bold text-foreground focus:outline-none cursor-pointer"
                />
                <input
                  type="time"
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm font-bold text-foreground focus:outline-none cursor-pointer text-right"
                />
              </div>
            </div>
          </div>

          {/* 3. Return Date & Time (3 cols) */}
          <div className="space-y-1.5 lg:col-span-3 min-w-0">
            <div className="rounded-xl border border-border/80 bg-background/80 px-3.5 py-2 hover:border-primary/50 transition-colors focus-within:ring-2 focus-within:ring-primary shadow-2xs">
              <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                <Calendar className="h-3.5 w-3.5 text-[#f59e0b] shrink-0" /> RETURN DATE & TIME
              </label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <input
                  type="date"
                  value={returnDate}
                  min={pickupDate}
                  onChange={(e) => {
                    setReturnDate(e.target.value);
                    setActivePreset(null);
                  }}
                  className="w-full bg-transparent text-xs sm:text-sm font-bold text-foreground focus:outline-none cursor-pointer"
                />
                <input
                  type="time"
                  value={returnTime}
                  onChange={(e) => setReturnTime(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm font-bold text-foreground focus:outline-none cursor-pointer text-right"
                />
              </div>
            </div>
          </div>

          {/* 4. Action Button (3 cols) */}
          <div className="lg:col-span-3">
            <Button
              type="submit"
              size="lg"
              className="h-12 w-full font-bold text-xs sm:text-sm bg-[#f59e0b] hover:bg-[#d97706] text-white shadow-md transition-all active:scale-95 rounded-xl gap-2 whitespace-nowrap"
            >
              <span>Search Available Cars</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

