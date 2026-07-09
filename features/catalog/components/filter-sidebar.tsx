"use client";

import { useTransition, useState } from "react";
import { SlidersHorizontal, ArrowUpDown, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FilterSidebarProps {
  currentFilters: URLSearchParams;
  setFilter: (key: string, value: string | null) => void;
}

export function FilterSidebar({ currentFilters, setFilter }: FilterSidebarProps) {
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (key: string, value: string | null) => {
    startTransition(() => {
      setFilter(key, value);
    });
  };

  return (
    <div
      className={`w-full shrink-0 rounded-xl border border-border bg-card/20 p-4 transition-all lg:w-64 ${isPending ? "opacity-50" : ""}`}
    >
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-1 lg:hidden"
        type="button"
      >
        <span className="flex items-center gap-2 font-display font-semibold text-foreground">
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </span>
        <span className="flex items-center gap-1 text-xs font-medium text-primary">
          {isOpen ? "Hide Options" : "Show Options"}
          <ChevronDown
            className={`h-3.5 w-3.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </span>
      </button>

      {/* Desktop Header */}
      <div className="hidden items-center gap-2 border-b border-border/50 pb-4 lg:flex">
        <SlidersHorizontal className="h-4 w-4" />
        <span className="font-display font-semibold text-foreground">Filters</span>
      </div>

      {/* Filter Body (collapsible on mobile, always visible on desktop) */}
      <div
        className={`${isOpen ? "mt-6 block space-y-6" : "hidden"} lg:mt-6 lg:block lg:space-y-6`}
      >
        {/* Category Filter */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Category
          </h4>
          <div className="flex flex-col gap-2">
            {["Hatchback", "Premium Hatchback", "Sedan", "Compact SUV", "SUV"].map((c) => {
              const isActive = currentFilters.get("category") === c;
              return (
                <button
                  key={c}
                  onClick={() => handleSelect("category", isActive ? null : c)}
                  className={`rounded-lg border px-3 py-1.5 text-left text-sm transition-colors ${
                    isActive
                      ? "border-primary bg-primary font-semibold text-primary-foreground"
                      : "border-border hover:bg-muted/40"
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
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Transmission
          </h4>
          <div className="flex flex-col gap-2">
            {["AUTOMATIC", "MANUAL"].map((t) => {
              const isActive = currentFilters.get("transmission") === t;
              return (
                <button
                  key={t}
                  onClick={() => handleSelect("transmission", isActive ? null : t)}
                  className={`rounded-lg border px-3 py-1.5 text-left text-sm transition-colors ${
                    isActive
                      ? "border-primary bg-primary font-semibold text-primary-foreground"
                      : "border-border hover:bg-muted/40"
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
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Fuel Class
          </h4>
          <div className="flex flex-wrap gap-2">
            {["PETROL", "DIESEL", "ELECTRIC", "HYBRID"].map((f) => {
              const isActive = currentFilters.get("fuelType") === f;
              return (
                <button
                  key={f}
                  onClick={() => handleSelect("fuelType", isActive ? null : f)}
                  className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                    isActive
                      ? "border-primary bg-primary font-semibold text-primary-foreground"
                      : "border-border hover:bg-muted"
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
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Seats
          </h4>
          <div className="flex gap-2">
            {[4, 5, 7].map((s) => {
              const isActive = currentFilters.get("seats") === String(s);
              return (
                <button
                  key={s}
                  onClick={() => handleSelect("seats", isActive ? null : String(s))}
                  className={`flex-1 rounded-lg border py-1.5 text-center text-sm transition-colors ${
                    isActive
                      ? "border-primary bg-primary font-semibold text-primary-foreground"
                      : "border-border hover:bg-muted"
                  }`}
                >
                  {s} Seater
                </button>
              );
            })}
          </div>
        </div>

        {/* Sorting */}
        <div className="space-y-2.5 border-t border-border/50 pt-4">
          <h4 className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
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
    </div>
  );
}
export type FilterSidebarPropsType = FilterSidebarProps;
