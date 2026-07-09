"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { SearchHeader } from "./search-header";
import { FilterSidebar } from "./filter-sidebar";

/**
 * Client wrapper that owns filter state & URL updates.
 * Renders SearchHeader + FilterSidebar without the server component
 * needing to pass any event-handler functions.
 */
export function CatalogFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const setFilter = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`/cars?${params.toString()}`);
    },
    [router, searchParams],
  );

  const handleSearchChange = useCallback(
    (val: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (val) {
        params.set("search", val);
      } else {
        params.delete("search");
      }
      router.push(`/cars?${params.toString()}`);
    },
    [router, searchParams],
  );

  return (
    <>
      <SearchHeader
        value={searchParams.get("search") || ""}
        onChange={handleSearchChange}
        currentFilters={new URLSearchParams(searchParams.toString())}
        setFilter={setFilter}
      />
    </>
  );
}

export function CatalogFilterSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const setFilter = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`/cars?${params.toString()}`);
    },
    [router, searchParams],
  );

  return (
    <FilterSidebar
      currentFilters={new URLSearchParams(searchParams.toString())}
      setFilter={setFilter}
    />
  );
}
