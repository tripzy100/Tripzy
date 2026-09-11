"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { X, SlidersHorizontal, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileFilterDrawer({ isOpen, onClose }: MobileFilterDrawerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (!isOpen) return null;

  const currentTransmission = searchParams.get("transmission") || "";
  const currentFuelType = searchParams.get("fuelType") || "";
  const currentSeats = searchParams.get("seats") || "";

  const applyFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/cars?${params.toString()}`);
  };

  const resetAllFilters = () => {
    const params = new URLSearchParams();
    if (searchParams.get("location")) params.set("location", searchParams.get("location")!);
    if (searchParams.get("pickupDate")) params.set("pickupDate", searchParams.get("pickupDate")!);
    if (searchParams.get("returnDate")) params.set("returnDate", searchParams.get("returnDate")!);
    router.push(`/cars?${params.toString()}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center p-0 sm:p-4">
      <div className="w-full max-w-lg rounded-t-2xl sm:rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/60 pb-4">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-primary" />
            <h3 className="font-display text-lg font-bold text-foreground">Filter Vehicles</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* 1. Transmission Filter */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Transmission
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "All", value: "" },
              { label: "Automatic", value: "AUTOMATIC" },
              { label: "Manual", value: "MANUAL" },
            ].map((t) => {
              const isActive = currentTransmission === t.value;
              return (
                <button
                  key={t.label}
                  onClick={() => applyFilter("transmission", t.value || null)}
                  className={`h-10 rounded-lg border text-xs font-bold transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-foreground border-border hover:bg-muted"
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Fuel Type Filter */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Fuel Class
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { label: "All", value: "" },
              { label: "Petrol", value: "PETROL" },
              { label: "Diesel", value: "DIESEL" },
              { label: "Electric", value: "ELECTRIC" },
            ].map((f) => {
              const isActive = currentFuelType === f.value;
              return (
                <button
                  key={f.label}
                  onClick={() => applyFilter("fuelType", f.value || null)}
                  className={`h-10 rounded-lg border text-xs font-bold transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-foreground border-border hover:bg-muted"
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Seating Capacity Filter */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Seating Capacity
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: "All", value: "" },
              { label: "4 Seats", value: "4" },
              { label: "5 Seats", value: "5" },
              { label: "7 Seats", value: "7" },
            ].map((s) => {
              const isActive = currentSeats === s.value;
              return (
                <button
                  key={s.label}
                  onClick={() => applyFilter("seats", s.value || null)}
                  className={`h-10 rounded-lg border text-xs font-bold transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-foreground border-border hover:bg-muted"
                  }`}
                >
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center gap-3 border-t border-border/60 pt-4">
          <Button variant="outline" size="lg" onClick={resetAllFilters} className="w-1/2 font-bold text-xs gap-1.5">
            <RotateCcw className="h-3.5 w-3.5" /> Reset Filters
          </Button>
          <Button size="lg" onClick={onClose} className="w-1/2 font-bold text-xs">
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  );
}
