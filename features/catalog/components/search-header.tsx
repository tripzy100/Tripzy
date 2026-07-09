"use client";

import { Search, MapPin } from "lucide-react";

interface SearchHeaderProps {
  value: string;
  onChange: (val: string) => void;
  currentFilters: URLSearchParams;
  setFilter: (key: string, value: string | null) => void;
}

export function SearchHeader({ value, onChange, currentFilters, setFilter }: SearchHeaderProps) {
  return (
    <div className="mb-6 flex w-full flex-col gap-4 rounded-xl border border-border bg-card/20 p-4 md:flex-row">
      {/* Search Input */}
      <div className="relative flex-1">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search brand, model, or variant (e.g. Thar, Tesla Plaid)..."
          className="w-full rounded-lg border border-input bg-card py-2 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
        />
        <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-muted-foreground" />
      </div>

      {/* City Pick Selector */}
      <div className="relative w-full md:w-56">
        <select
          value={currentFilters.get("city") || ""}
          onChange={(e) => setFilter("city", e.target.value || null)}
          className="w-full appearance-none rounded-lg border border-input bg-card py-2 pl-10 pr-4 text-sm text-foreground focus:outline-none"
        >
          <option value="">All Cities</option>
          <option value="Ranchi">Ranchi</option>
          <option value="Ranchi Airport">Ranchi Airport</option>
        </select>
        <MapPin className="absolute left-3.5 top-2.5 h-4 w-4 text-muted-foreground" />
      </div>
    </div>
  );
}
export type SearchHeaderPropsType = SearchHeaderProps;
