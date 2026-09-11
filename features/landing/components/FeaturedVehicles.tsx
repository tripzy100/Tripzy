"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CarImage } from "@/components/cars/car-image";
import { Users, Fuel, Activity, ArrowRight, MapPin, ShieldCheck, Sparkles } from "lucide-react";

type VehicleCategoryKey = "all" | "hatchback" | "sedan" | "suv" | "7seater" | "ev";

interface CuratedVehicle {
  id: string;
  name: string;
  category: string;
  categoryKey: VehicleCategoryKey | VehicleCategoryKey[];
  routeTag: string;
  transmission: string;
  fuel: string;
  seats: number;
  price: number;
  deposit: number;
  imageUrl: string;
  slug: string;
  hub: string;
  isAvailable: boolean;
}

const curatedVehicles: CuratedVehicle[] = [
  {
    id: "v1",
    name: "Mahindra Thar 4x4",
    category: "4x4 / Adventure",
    categoryKey: "suv",
    routeTag: "Great for weekend escapes & rough roads",
    transmission: "Manual",
    fuel: "Diesel",
    seats: 4,
    price: 5000,
    deposit: 5000,
    imageUrl: "/cars/mahindra-thar-4x4.png",
    slug: "mahindra-thar-4x4",
    hub: "Lalpur & Airport Hubs",
    isAvailable: true,
  },
  {
    id: "v2",
    name: "Tata Safari",
    category: "Premium 7-Seater",
    categoryKey: ["7seater", "suv"],
    routeTag: "Spacious luxury for family & group trips",
    transmission: "Manual",
    fuel: "Diesel",
    seats: 7,
    price: 7000,
    deposit: 5000,
    imageUrl: "/cars/tata-safari.png",
    slug: "tata-safari",
    hub: "Lalpur & Airport Hubs",
    isAvailable: true,
  },
  {
    id: "v3",
    name: "Hyundai Verna",
    category: "Executive Sedan",
    categoryKey: "sedan",
    routeTag: "Smooth executive highway comfort",
    transmission: "Automatic",
    fuel: "Petrol",
    seats: 5,
    price: 3500,
    deposit: 5000,
    imageUrl: "/cars/hyundai-verna.png",
    slug: "hyundai-verna",
    hub: "Lalpur Hub",
    isAvailable: true,
  },
  {
    id: "v4",
    name: "Maruti Suzuki Swift",
    category: "City Hatchback",
    categoryKey: "hatchback",
    routeTag: "City-friendly, agile & fuel efficient",
    transmission: "Manual",
    fuel: "Petrol",
    seats: 5,
    price: 1800,
    deposit: 3000,
    imageUrl: "/cars/maruti-suzuki-swift.png",
    slug: "maruti-suzuki-swift",
    hub: "Lalpur Hub",
    isAvailable: true,
  },
  {
    id: "v5",
    name: "Mahindra Scorpio-N",
    category: "Full Size SUV (7-Seater)",
    categoryKey: ["suv", "7seater"],
    routeTag: "Dominant road presence & 7 seats",
    transmission: "Manual",
    fuel: "Diesel",
    seats: 7,
    price: 6000,
    deposit: 5000,
    imageUrl: "/cars/mahindra-scorpio-n.png",
    slug: "mahindra-scorpio-n",
    hub: "Airport & Lalpur Hubs",
    isAvailable: true,
  },
  {
    id: "v6",
    name: "Tata Nexon EV",
    category: "Electric SUV",
    categoryKey: ["ev", "suv"],
    routeTag: "Clean, silent & sustainable city drives",
    transmission: "Automatic",
    fuel: "Electric",
    seats: 5,
    price: 3200,
    deposit: 5000,
    imageUrl: "/cars/tata-nexon-ev.png",
    slug: "tata-nexon-ev",
    hub: "Lalpur Hub",
    isAvailable: true,
  },
];

const categoryTabs: { key: VehicleCategoryKey; label: string }[] = [
  { key: "all", label: "All Fleet" },
  { key: "hatchback", label: "Hatchbacks" },
  { key: "sedan", label: "Sedans" },
  { key: "suv", label: "SUVs" },
  { key: "7seater", label: "7-Seaters" },
  { key: "ev", label: "EVs" },
];

export default function FeaturedVehicles() {
  const [activeCategory, setActiveCategory] = React.useState<VehicleCategoryKey>("all");

  const filteredVehicles = React.useMemo(() => {
    if (activeCategory === "all") return curatedVehicles;
    return curatedVehicles.filter((car) => {
      if (Array.isArray(car.categoryKey)) {
        return car.categoryKey.includes(activeCategory);
      }
      return car.categoryKey === activeCategory;
    });
  }, [activeCategory]);

  return (
    <section id="cars" className="py-12 sm:py-16 lg:py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end border-b border-border/60 pb-5">
          <div className="space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Verified Self-Drive Fleet
            </span>
            <h2 className="font-display text-3xl font-black tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Find your perfect ride.
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
              Choose from Tripzy&apos;s verified self-drive fleet in Ranchi. All cars sanitized and safety-inspected.
            </p>
          </div>

          <Link href="/cars">
            <Button variant="outline" className="font-bold text-xs h-9 px-4 border-border/80 hover:border-primary/60 self-start md:self-auto">
              Explore full fleet
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        {/* Category Discovery Switcher Controls */}
        <div className="mb-6 flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categoryTabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveCategory(tab.key)}
              className={`h-8 sm:h-8.5 px-3 sm:px-4 rounded-lg text-xs font-bold whitespace-nowrap shrink-0 transition-all duration-200 ${
                activeCategory === tab.key
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-card text-muted-foreground border border-border/70 hover:border-border hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Automotive Catalogue Grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredVehicles.map((car) => (
            <div
              key={car.id}
              className="group overflow-hidden rounded-xl border border-border/80 bg-card text-card-foreground shadow-xs transition-all duration-300 hover:border-primary/50 hover:shadow-md flex flex-col justify-between"
            >
              {/* Vehicle Showcase Frame */}
              <div>
                <div className="relative p-3 sm:p-3.5 bg-gradient-to-b from-muted/30 to-muted/5 border-b border-border/50">
                  <div className="relative aspect-[16/10] w-full flex items-center justify-center">
                    <CarImage
                      src={car.imageUrl}
                      alt={car.name}
                      aspectRatio="video"
                      objectFit="contain"
                      className="transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* Category Pill */}
                  <span className="absolute top-3 left-3 sm:top-3.5 sm:left-3.5 rounded-md bg-background/95 px-2 sm:px-2.5 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-foreground border border-border/70 backdrop-blur-sm shadow-2xs">
                    {car.category}
                  </span>

                  {/* Availability Badge */}
                  <span className="absolute top-3 right-3 sm:top-3.5 sm:right-3.5 inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-[9px] sm:text-[10px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 backdrop-blur-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Available
                  </span>
                </div>

                {/* Specs & Information */}
                <div className="p-4 sm:p-5 pt-3.5 space-y-3">
                  <div>
                    <h3 className="font-display text-base sm:text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                      {car.name}
                    </h3>
                    <p className="text-xs font-medium text-primary mt-0.5">
                      {car.routeTag}
                    </p>
                  </div>

                  {/* 3-Col Specs Row */}
                  <div className="grid grid-cols-3 gap-1 border-y border-border/60 py-2 text-[11px] sm:text-xs font-semibold text-muted-foreground">
                    <div className="flex items-center gap-1 min-w-0">
                      <Users className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span className="truncate">{car.seats} Seats</span>
                    </div>
                    <div className="flex items-center gap-1 min-w-0">
                      <Fuel className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span className="truncate">{car.fuel}</span>
                    </div>
                    <div className="flex items-center gap-1 min-w-0">
                      <Activity className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span className="truncate">{car.transmission}</span>
                    </div>
                  </div>

                  {/* Pickup Hub Location */}
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground min-w-0">
                    <MapPin className="h-3.5 w-3.5 text-primary/80 shrink-0" />
                    <span className="truncate">{car.hub}</span>
                  </div>
                </div>
              </div>

              {/* Pricing & Conversion CTA */}
              <div className="p-4 sm:p-5 pt-0">
                <div className="flex items-center justify-between gap-2 border-t border-border/60 pt-3.5">
                  <div className="min-w-0">
                    <div className="flex items-baseline gap-1">
                      <span className="font-display text-lg sm:text-2xl font-black text-foreground">
                        &#8377;{car.price.toLocaleString("en-IN")}
                      </span>
                      <span className="text-[10px] sm:text-xs text-muted-foreground font-semibold shrink-0"> / day</span>
                    </div>
                    <p className="text-[10px] sm:text-[11px] font-medium text-muted-foreground truncate">
                      &#8377;{car.deposit.toLocaleString("en-IN")} deposit
                    </p>
                  </div>

                  <Link href={`/cars/${car.slug}`} className="shrink-0">
                    <Button size="sm" className="font-bold text-xs h-8.5 sm:h-9 px-3 sm:px-4 shadow-2xs">
                      View car
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
