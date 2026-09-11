"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MobileFilterDrawer } from "./mobile-filter-drawer";

const CATEGORIES = [
  { label: "All Vehicles", value: "" },
  { label: "Hatchback", value: "Hatchback" },
  { label: "Sedan", value: "Sedan" },
  { label: "SUV & 4x4", value: "SUV" },
  { label: "Electric", value: "ELECTRIC" },
];

export function CatalogToolbar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  const activeCategory = searchParams.get("category") || "";
  const activeSort = searchParams.get("sort") || "recommended";

  const updateParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/cars?${params.toString()}`);
  };

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/80 pb-6 mb-8">
        {/* Horizontal Category Navigation with mobile scroll cue */}
        <div className="relative max-w-full overflow-hidden">
          <div className="flex items-center gap-2 overflow-x-auto pb-1.5 sm:pb-0 scrollbar-none pr-8 sm:pr-0">
            {CATEGORIES.map((cat) => {
              const isActive =
                cat.value === ""
                  ? !activeCategory
                  : activeCategory.toLowerCase().includes(cat.value.toLowerCase());
              return (
                <button
                  key={cat.label}
                  onClick={() => updateParam("category", cat.value || null)}
                  className={`h-9 px-3.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap border shrink-0 ${
                    isActive
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card text-muted-foreground border-border hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
          {/* Subtle right fade cue on mobile */}
          <div className="pointer-events-none absolute right-0 top-0 bottom-1.5 w-8 bg-gradient-to-l from-background to-transparent sm:hidden" />
        </div>

        {/* Filter Drawer Trigger & Sort Select */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsDrawerOpen(true)}
            className="h-9 w-1/2 sm:w-auto font-bold text-xs gap-1.5 justify-center"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>Filters</span>
          </Button>

          <div className="relative flex items-center w-1/2 sm:w-auto">
            <ArrowUpDown className="absolute left-2.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            <select
              value={activeSort}
              onChange={(e) => updateParam("sort", e.target.value)}
              className="w-full sm:w-auto flex h-9 rounded-lg border border-input bg-card pl-8 pr-3 text-xs font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring truncate cursor-pointer"
            >
              <option value="recommended">Recommended</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Mobile / Slide-Over Filter Drawer */}
      <MobileFilterDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </>
  );
}
