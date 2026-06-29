"use client";

import * as React from "react";
import { Star, Heart, Fuel, Users, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/providers/app-provider";

const vehiclesList = [
  {
    id: "v1",
    name: "Maruti Suzuki Swift",
    category: "Hatchback",
    transmission: "Manual",
    fuel: "Petrol",
    seats: 5,
    price: 1800,
    rating: 4.9,
    imageUrl: "https://res.cloudinary.com/mock/image/upload/swift.jpg",
  },
  {
    id: "v2",
    name: "Mahindra Thar",
    category: "SUV",
    transmission: "Manual",
    fuel: "Diesel",
    seats: 4,
    price: 5000,
    rating: 4.95,
    imageUrl: "https://res.cloudinary.com/mock/image/upload/thar.jpg",
  },
  {
    id: "v3",
    name: "Tata Safari",
    category: "SUV",
    transmission: "Manual",
    fuel: "Diesel",
    seats: 7,
    price: 7000,
    rating: 4.88,
    imageUrl: "https://res.cloudinary.com/mock/image/upload/safari.jpg",
  },
];

export default function FeaturedVehicles() {
  const { showToast } = useToast();
  const [favorites, setFavorites] = React.useState<Record<string, boolean>>({});

  const toggleFavorite = (id: string, name: string) => {
    const isFav = !favorites[id];
    setFavorites((prev) => ({ ...prev, [id]: isFav }));
    showToast(isFav ? `${name} added to wishlist` : `${name} removed from wishlist`, "success");
  };

  return (
    <section className="bg-card/20 border-y border-border py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Featured Fleet</span>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl text-gradient">
              Experience absolute performance.
            </h2>
          </div>
          <Button variant="outline">View entire fleet</Button>
        </div>

        {/* Vehicles Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {vehiclesList.map((car) => {
            const isFav = !!favorites[car.id];
            return (
              <div
                key={car.id}
                className="group rounded-xl border border-border bg-card/60 overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1"
              >
                {/* Image Placeholder Box */}
                <div className="relative flex h-48 w-full items-center justify-center bg-muted/60 p-6">
                  {/* Favorite trigger */}
                  <button
                    onClick={() => toggleFavorite(car.id, car.name)}
                    className="absolute right-4 top-4 rounded-full bg-background/80 p-2 text-muted-foreground shadow-sm transition-colors hover:text-red-500"
                    aria-label="Add to wishlist"
                  >
                    <Heart className={`h-4.5 w-4.5 ${isFav ? "fill-red-500 text-red-500" : ""}`} />
                  </button>

                  <div className="flex flex-col items-center gap-1.5 text-xs text-muted-foreground font-mono">
                    <span className="font-semibold text-foreground uppercase">{car.category}</span>
                    <span>Fleet preview placeholder</span>
                  </div>
                </div>

                {/* Specs Box */}
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display font-bold text-foreground text-base tracking-tight">{car.name}</h3>
                    <div className="flex items-center gap-1 text-sm font-semibold text-amber-500">
                      <Star className="h-4 w-4 fill-current" />
                      <span>{car.rating}</span>
                    </div>
                  </div>

                  {/* Specification items */}
                  <div className="mt-4 flex gap-4 border-t border-border pt-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5" /> {car.seats} Seats
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Fuel className="h-3.5 w-3.5" /> {car.fuel}
                    </span>
                    <span>{car.transmission}</span>
                  </div>

                  {/* Pricing action block */}
                  <div className="mt-6 flex items-center justify-between">
                    <div>
                      <span className="font-display text-lg font-bold text-foreground">&#8377;{car.price}</span>
                      <span className="text-xs text-muted-foreground"> / day</span>
                    </div>
                    
                    <Button variant="secondary" size="sm" className="group">
                      <Eye className="mr-1.5 h-3.5 w-3.5" /> Inspect Specs
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
