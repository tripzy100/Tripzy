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
    <div className="flex flex-col md:flex-row gap-4 w-full p-4 border border-border rounded-xl bg-card/20 mb-6">
      {/* Search Input */}
      <div className="relative flex-1">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search brand, model, or variant (e.g. Thar, Tesla Plaid)..."
          className="w-full rounded-lg border border-input bg-card pl-10 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
        />
        <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-muted-foreground" />
      </div>

      {/* City Pick Selector */}
      <div className="relative w-full md:w-56">
        <select
          value={currentFilters.get("city") || ""}
          onChange={(e) => setFilter("city", e.target.value || null)}
          className="w-full rounded-lg border border-input bg-card pl-10 pr-4 py-2 text-sm text-foreground focus:outline-none appearance-none"
        >
          <option value="">All Cities</option>
          <option value="Bengaluru">Bengaluru</option>
          <option value="Mumbai">Mumbai</option>
          <option value="Pune">Pune</option>
        </select>
        <MapPin className="absolute left-3.5 top-2.5 h-4 w-4 text-muted-foreground" />
      </div>
    </div>
  );
}
export type SearchHeaderPropsType = SearchHeaderProps;
