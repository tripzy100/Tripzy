"use client";

import { useTransition } from "react";
import { SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FilterSidebarProps {
  currentFilters: URLSearchParams;
  setFilter: (key: string, value: string | null) => void;
}

export function FilterSidebar({ currentFilters, setFilter }: FilterSidebarProps) {
  const [isPending, startTransition] = useTransition();

  const handleSelect = (key: string, value: string | null) => {
    startTransition(() => {
      setFilter(key, value);
    });
  };

  return (
    <div className={`space-y-6 w-full lg:w-64 shrink-0 p-4 border border-border rounded-xl bg-card/20 ${isPending ? "opacity-50" : ""}`}>
      <div className="flex items-center gap-2 pb-4 border-b border-border/50">
        <SlidersHorizontal className="h-4 w-4" />
        <span className="font-display font-semibold text-foreground">Filters</span>
      </div>

      {/* Category Filter */}
      <div className="space-y-2.5">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Category</h4>
        <div className="flex flex-col gap-2">
          {["Hatchback", "Premium Hatchback", "Sedan", "Compact SUV", "SUV"].map((c) => {
            const isActive = currentFilters.get("category") === c;
            return (
              <button
                key={c}
                onClick={() => handleSelect("category", isActive ? null : c)}
                className={`text-left text-sm py-1.5 px-3 rounded-lg border transition-colors ${
                  isActive ? "bg-primary border-primary text-primary-foreground font-semibold" : "border-border hover:bg-muted/40"
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>
      </div>

      {/* Transmission Filter */}
      <div className="space-y-2.5">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Transmission</h4>
        <div className="flex flex-col gap-2">
          {["AUTOMATIC", "MANUAL"].map((t) => {
            const isActive = currentFilters.get("transmission") === t;
            return (
              <button
                key={t}
                onClick={() => handleSelect("transmission", isActive ? null : t)}
                className={`text-left text-sm py-1.5 px-3 rounded-lg border transition-colors ${
                  isActive ? "bg-primary border-primary text-primary-foreground font-semibold" : "border-border hover:bg-muted/40"
                }`}
              >
                {t}
              </button>
            );
          })}
        </div>
      </div>

      {/* Fuel Type Filter */}
      <div className="space-y-2.5">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Fuel Class</h4>
        <div className="flex flex-wrap gap-2">
          {["PETROL", "DIESEL", "ELECTRIC", "HYBRID"].map((f) => {
            const isActive = currentFilters.get("fuelType") === f;
            return (
              <button
                key={f}
                onClick={() => handleSelect("fuelType", isActive ? null : f)}
                className={`text-xs py-1.5 px-3 rounded-full border transition-colors ${
                  isActive ? "bg-primary border-primary text-primary-foreground font-semibold" : "border-border hover:bg-muted"
                }`}
              >
                {f}
              </button>
            );
          })}
        </div>
      </div>

      {/* Seats Filter */}
      <div className="space-y-2.5">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Seats</h4>
        <div className="flex gap-2">
          {[4, 5, 7].map((s) => {
            const isActive = currentFilters.get("seats") === String(s);
            return (
              <button
                key={s}
                onClick={() => handleSelect("seats", isActive ? null : String(s))}
                className={`flex-1 text-center text-sm py-1.5 rounded-lg border transition-colors ${
                  isActive ? "bg-primary border-primary text-primary-foreground font-semibold" : "border-border hover:bg-muted"
                }`}
              >
                {s} Seater
              </button>
            );
          })}
        </div>
      </div>

      {/* Sorting */}
      <div className="space-y-2.5 pt-4 border-t border-border/50">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
          <ArrowUpDown className="h-3 w-3" /> Sort Order
        </h4>
        <select
          value={currentFilters.get("sort") || "popular"}
          onChange={(e) => handleSelect("sort", e.target.value)}
          className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none"
        >
          <option value="popular">Popularity</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating">Rating</option>
        </select>
      </div>
    </div>
  );
}
export type FilterSidebarPropsType = FilterSidebarProps;
