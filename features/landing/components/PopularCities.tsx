"use client";

import { MapPin, Navigation, Compass } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const citiesList = [
  {
    name: "Bengaluru",
    airports: ["Kempegowda Int'l Airport (KIA)"],
    routes: ["Bengaluru to Nandi Hills", "Bengaluru to Mysore"],
    tag: "Active Hub",
  },
  {
    name: "Mumbai",
    airports: ["Chhatrapati Shivaji Terminal 2 (CSIA)"],
    routes: ["Mumbai to Lonavala", "Mumbai to Pune"],
    tag: "Hot Area",
  },
  {
    name: "Pune",
    airports: ["Pune Lohegaon Airport"],
    routes: ["Pune to Mahabaleshwar", "Pune to Shirdi"],
    tag: "Active Hub",
  },
];

export default function PopularCities() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20 lg:py-28">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-16">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Regional Centers</span>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl text-gradient">
            Operational across key locations.
          </h2>
        </div>
        <Badge variant="outline" className="text-xs font-semibold">Instant Airport Deliveries</Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {citiesList.map((city, idx) => (
          <div
            key={idx}
            className="group rounded-xl border border-border bg-card/30 p-6 transition-all duration-300 hover:bg-card/75"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/50 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-muted-foreground group-hover:text-foreground" />
                <h3 className="font-display font-bold text-foreground text-lg">{city.name}</h3>
              </div>
              <Badge variant="success" className="text-[10px]">{city.tag}</Badge>
            </div>

            {/* Airports */}
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                <Compass className="h-3.5 w-3.5" /> Airport Terminals
              </span>
              <ul className="text-sm text-foreground/80 pl-4 list-disc space-y-1">
                {city.airports.map((ap, apIdx) => (
                  <li key={apIdx}>{ap}</li>
                ))}
              </ul>
            </div>

            {/* Popular Routes */}
            <div className="mt-6 space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                <Navigation className="h-3.5 w-3.5" /> Popular Roadtrips
              </span>
              <div className="flex flex-wrap gap-2">
                {city.routes.map((rt, rtIdx) => (
                  <span
                    key={rtIdx}
                    className="rounded bg-muted px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted/80"
                  >
                    {rt}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
