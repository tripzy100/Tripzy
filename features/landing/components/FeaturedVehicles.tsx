"use client";

import * as React from "react";
import { Star, Heart, Fuel, Users, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/providers/app-provider";
import Link from "next/link";

const carImageMap: Record<string, string> = {
  "Maruti Suzuki Swift": "/cars/maruti-suzuki-swift.png",
  "Mahindra Thar": "/cars/mahindra-thar.png",
  "Tata Safari": "/cars/tata-safari.png",
};

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
    imageUrl: carImageMap["Maruti Suzuki Swift"],
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
    imageUrl: carImageMap["Mahindra Thar"],
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
    imageUrl: carImageMap["Tata Safari"],
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
    <section id="cars" className="border-y border-border bg-card/20 py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Our Cars for Rent
            </span>
            <h2 className="text-gradient mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Popular self drive cars available in Ranchi
            </h2>
          </div>
          <Link href="/cars">
            <Button variant="outline">View all cars</Button>
          </Link>
        </div>

        {/* Vehicles Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {vehiclesList.map((car) => {
            const isFav = !!favorites[car.id];
            return (
              <div
                key={car.id}
                className="group overflow-hidden rounded-xl border border-border bg-card/60 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                {/* Car Image */}
                <div className="relative h-48 w-full overflow-hidden bg-muted">
                  <img
                    src={car.imageUrl}
                    alt={car.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Favorite trigger */}
                  <button
                    onClick={() => toggleFavorite(car.id, car.name)}
                    className="absolute right-3 top-3 rounded-full bg-background/80 p-2 text-muted-foreground shadow-sm backdrop-blur-sm transition-colors hover:text-red-500"
                    aria-label="Add to wishlist"
                  >
                    <Heart className={`h-4.5 w-4.5 ${isFav ? "fill-red-500 text-red-500" : ""}`} />
                  </button>

                  {/* Category badge */}
                  <span className="absolute bottom-3 left-3 rounded-full bg-background/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-foreground backdrop-blur-sm">
                    {car.category}
                  </span>
                </div>

                {/* Specs Box */}
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-base font-bold tracking-tight text-foreground">
                      {car.name}
                    </h3>
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
                      <span className="font-display text-lg font-bold text-foreground">
                        &#8377;{car.price}
                      </span>
                      <span className="text-xs text-muted-foreground"> / day</span>
                    </div>

                    <Link href="/auth/login">
                      <Button variant="secondary" size="sm" className="group">
                        Book Now
                      </Button>
                    </Link>
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
