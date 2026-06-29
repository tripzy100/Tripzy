"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function useCatalog() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Create local states from URL query params
  const [search, setSearch] = React.useState(searchParams.get("search") || "");
  const [debouncedSearch, setDebouncedSearch] = React.useState(search);

  // Debounce search inputs
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 4000);
    return () => clearTimeout(timer);
  }, [search]);

  // Update query params when filters change
  const setFilter = React.useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, pathname, router]
  );

  // Synchronize debounced searches to URL query params
  React.useEffect(() => {
    setFilter("search", debouncedSearch || null);
  }, [debouncedSearch, setFilter]);

  return {
    search,
    setSearch,
    setFilter,
    searchParams,
  };
}
export type UseCatalogReturn = ReturnType<typeof useCatalog>;
