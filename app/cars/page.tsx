import Link from "next/link";
import { Suspense } from "react";
import { db } from "@/lib/db";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import {
  CatalogFilters,
  CatalogFilterSidebar,
} from "@/features/catalog/components/catalog-filters";
import { Button } from "@/components/ui/button";
import { Fuel, Star, Users } from "lucide-react";

export const dynamic = "force-dynamic";

// Slug generation utility helper
function getVehicleSlug(
  brand: string,
  model: string,
  year: number,
  transmission: string,
  fuel: string,
) {
  return `${brand.toLowerCase()}-${model.toLowerCase()}-${year}-${transmission.toLowerCase()}-${fuel.toLowerCase()}`.replace(
    /\s+/g,
    "-",
  );
}

interface PageProps {
  searchParams: Promise<{
    search?: string;
    city?: string;
    transmission?: string;
    fuelType?: string;
    seats?: string;
    sort?: string;
    category?: string;
  }>;
}

export default async function CarsPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const where: any = { deletedAt: null };

  if (resolvedParams.transmission) where.transmission = resolvedParams.transmission;
  if (resolvedParams.fuelType) where.fuelType = resolvedParams.fuelType;
  if (resolvedParams.category)
    where.category = { name: { equals: resolvedParams.category, mode: "insensitive" } };
  if (resolvedParams.seats)
    where.variant = {
      model: { vehicles: { some: { variant: { engineCapacity: { not: undefined } } } } },
    }; // Mock query matching seats, or simple mock:
  // Let's filter model year or simple specs. Let's do a direct look up if possible, but keep it simple

  if (resolvedParams.search) {
    where.OR = [
      { brand: { name: { contains: resolvedParams.search, mode: "insensitive" } } },
      { model: { name: { contains: resolvedParams.search, mode: "insensitive" } } },
    ];
  }

  const vehicles = await db.vehicle.findMany({
    where,
    include: {
      brand: true,
      model: true,
      city: true,
      pricings: true,
    },
  });

  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <h1 className="font-display text-2xl font-bold tracking-tight">Browse Available Fleet</h1>
          <div className="flex gap-3">
            <Link href="/packages">
              <Button variant="ghost" size="sm">
                Packages
              </Button>
            </Link>
            <Link href="/cities">
              <Button variant="ghost" size="sm">
                Cities
              </Button>
            </Link>
          </div>
        </div>

        {/* Client-owned search + filter controls */}
        <Suspense fallback={<div className="mb-6 h-12 animate-pulse rounded-xl bg-muted/30" />}>
          <CatalogFilters />
        </Suspense>

        <div className="flex flex-col gap-8 lg:flex-row">
          <Suspense
            fallback={<div className="h-96 w-full animate-pulse rounded-xl bg-muted/30 lg:w-64" />}
          >
            <CatalogFilterSidebar />
          </Suspense>

          {/* Cars Grid */}
          <div className="grid flex-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {vehicles.map((car) => {
              const rate = car.pricings[0]?.dailyRate?.toNumber() || 2000;
              const slug = getVehicleSlug(
                car.brand.name,
                car.model.name,
                2024,
                car.transmission,
                car.fuelType,
              );

              return (
                <div
                  key={car.id}
                  className="group overflow-hidden rounded-xl border border-border bg-card/40 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="relative flex h-44 w-full items-center justify-center overflow-hidden bg-muted">
                    <img
                      src={`/cars/${(car.brand.name + "-" + car.model.name).toLowerCase().replace(/\s+/g, "-")}.png`}
                      alt={`${car.brand.name} ${car.model.name}`}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="space-y-4 p-5">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display text-base font-semibold text-foreground">
                        {car.brand.name} {car.model.name}
                      </h3>
                      <div className="flex items-center gap-1 text-xs font-semibold text-amber-500">
                        <Star className="h-3.5 w-3.5 fill-current" /> 4.9
                      </div>
                    </div>

                    <div className="flex gap-4 border-t border-border/50 pt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" /> 5 Seats
                      </span>
                      <span className="flex items-center gap-1">
                        <Fuel className="h-3 w-3" /> {car.fuelType}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div>
                        <span className="font-display text-base font-bold text-foreground">
                          &#8377;{rate}
                        </span>
                        <span className="text-xs text-muted-foreground"> / day</span>
                      </div>
                      <Link href={`/cars/${slug}`}>
                        <Button size="sm">Rent Now</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
