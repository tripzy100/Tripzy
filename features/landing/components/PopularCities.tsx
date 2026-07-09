"use client";

import { MapPin, Navigation, Compass, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const citiesList = [
  {
    name: "Ranchi",
    airports: ["Birsa Munda Airport (IXR)"],
    routes: ["Ranchi to Hundru Falls", "Ranchi to Netarhat"],
    tag: "Active Hub",
  },
  {
    name: "Ranchi Airport",
    airports: ["Birsa Munda Airport"],
    routes: ["Airport to Ranchi City", "Airport to Patratu Valley"],
    tag: "Airport Hub",
  },
];

export default function PopularCities() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-12 lg:py-16">
      <div className="mb-16 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Car Rental Ranchi Locations
          </span>
          <h2 className="text-gradient mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Pickup and drop locations across Ranchi
          </h2>
        </div>
        <Badge variant="outline" className="text-xs font-semibold">
          Instant Airport Deliveries
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {citiesList.map((city, idx) => (
          <div
            key={idx}
            className="group rounded-xl border border-border bg-card/30 p-6 transition-all duration-300 hover:bg-card/75"
          >
            {/* Header */}
            <div className="mb-4 flex items-center justify-between border-b border-border/50 pb-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-muted-foreground group-hover:text-foreground" />
                <h3 className="font-display text-lg font-bold text-foreground">{city.name}</h3>
              </div>
              <Badge variant="success" className="text-[10px]">
                {city.tag}
              </Badge>
            </div>

            {/* Airports */}
            <div className="space-y-2">
              <span className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <Compass className="h-3.5 w-3.5" /> Airport Terminals
              </span>
              <ul className="list-disc space-y-1 pl-4 text-sm text-foreground/80">
                {city.airports.map((ap, apIdx) => (
                  <li key={apIdx}>{ap}</li>
                ))}
              </ul>
            </div>

            {/* Popular Routes */}
            <div className="mt-6 space-y-2">
              <span className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
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

      {/* Google Maps Embed */}
      <div className="mt-10 overflow-hidden rounded-xl border border-border">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3662.063236270557!2d85.34529821496924!3d23.367644284594247!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f4e1e545109e3d%3A0xa1c5cc6959e096a9!2sTripzy%20Tours%20and%20Travels!5e0!3m2!1sen!2sin!4v1710000000000!5m2!1sen!2sin"
          width="100%"
          height="400"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Tripzy Tours and Travels - Ranchi Location"
        />
      </div>

      {/* Call Now Box */}
      <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-xl border border-border bg-card/40 p-6 text-center sm:flex-row sm:text-left">
        <div>
          <h3 className="font-display text-base font-semibold text-foreground">Need assistance with your self drive booking?</h3>
          <p className="text-xs text-muted-foreground">Speak directly with our Ranchi support desk for instant vehicle queries.</p>
        </div>
        <a href="tel:+919234273063" className="w-full sm:w-auto">
          <Button className="w-full gap-2 sm:w-auto" size="lg">
            <Phone className="h-4 w-4" />
            Call Now: +91 92342 73063
          </Button>
        </a>
      </div>
    </section>
  );
}
