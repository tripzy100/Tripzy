import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Navigation, MapPin, Car } from "lucide-react";
import { Button } from "@/components/ui/button";

const airports = [
  { name: "Birsa Munda Airport", code: "IXR", city: "Ranchi", citySlug: "ranchi", vehicles: 12 },
];

export default function AirportsPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-6 py-12">
        <h1 className="mb-2 font-display text-3xl font-bold tracking-tight">Airport Terminals</h1>
        <p className="mb-10 max-w-lg text-sm text-muted-foreground">
          Pick up your rental directly at the airport terminal. We deliver to arrivals for a
          seamless start.
        </p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {airports.map((ap) => (
            <div
              key={ap.code}
              className="rounded-xl border border-border bg-card/40 p-6 transition-shadow hover:shadow-md"
            >
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Navigation className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-sm font-semibold text-foreground">{ap.name}</h3>
                  <span className="text-xs text-muted-foreground">
                    {ap.code} &middot; {ap.vehicles} vehicles
                  </span>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Link href={`/cars?city=${ap.citySlug}`}>
                  <Button size="sm" variant="default">
                    <Car className="mr-1 h-3.5 w-3.5" /> Browse
                  </Button>
                </Link>
                <Link href={`/cities/${ap.citySlug}`}>
                  <Button size="sm" variant="ghost">
                    <MapPin className="mr-1 h-3.5 w-3.5" /> City
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/cars">
            <Button variant="outline">Browse all available cars</Button>
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
