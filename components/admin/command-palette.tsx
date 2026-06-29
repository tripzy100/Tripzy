"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Terminal, Search, Shield, Car } from "lucide-react";

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleNavigate = (path: string) => {
    router.push(path);
    setOpen(false);
    setQuery("");
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-xl border border-border bg-card p-4 shadow-lg space-y-4">
        {/* Search Input */}
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <Search className="h-4.5 w-4.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search commands or pages..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-foreground focus:outline-none"
            autoFocus
          />
          <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded font-mono text-muted-foreground">ESC</span>
        </div>

        {/* Command Options List */}
        <div className="space-y-1 text-sm">
          <button
            onClick={() => handleNavigate("/admin")}
            className="flex w-full items-center gap-2.5 px-3 py-2 rounded-lg text-foreground hover:bg-muted text-left"
          >
            <Terminal className="h-4 w-4 text-muted-foreground" /> Admin Overview Dashboard
          </button>
          <button
            onClick={() => handleNavigate("/admin/fleet")}
            className="flex w-full items-center gap-2.5 px-3 py-2 rounded-lg text-foreground hover:bg-muted text-left"
          >
            <Car className="h-4 w-4 text-muted-foreground" /> Operations Fleet Catalog
          </button>
          <button
            onClick={() => handleNavigate("/admin/kyc")}
            className="flex w-full items-center gap-2.5 px-3 py-2 rounded-lg text-foreground hover:bg-muted text-left"
          >
            <Shield className="h-4 w-4 text-muted-foreground" /> KYC review pending documents
          </button>
        </div>
      </div>
    </div>
  );
}
export type CommandPalettePropsType = Record<string, never>;
