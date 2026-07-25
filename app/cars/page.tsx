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
import { Fuel, Star, Users, Car } from "lucide-react";

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
  let resolvedParams: any = {};
  try {
    resolvedParams = await searchParams;
  } catch {
    resolvedParams = {};
  }

  let vehicles: any[] = [];

  try {
    const where: any = { deletedAt: null };

    if (resolvedParams.transmission) {
      where.transmission = resolvedParams.transmission;
    }
    if (resolvedParams.fuelType) {
      where.fuelType = resolvedParams.fuelType;
    }
    if (resolvedParams.category) {
      where.category = { name: { equals: resolvedParams.category, mode: "insensitive" } };
    }
    if (resolvedParams.search) {
      where.OR = [
        { brand: { name: { contains: resolvedParams.search, mode: "insensitive" } } },
        { model: { name: { contains: resolvedParams.search, mode: "insensitive" } } },
      ];
    }

    vehicles = await db.vehicle.findMany({
      where,
      include: {
        brand: true,
        model: true,
        city: true,
        pricings: true,
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Error fetching vehicles in CarsPage:", error);
    try {
      vehicles = await db.vehicle.findMany({
        where: { deletedAt: null },
        include: {
          brand: true,
          model: true,
          city: true,
          pricings: true,
        },
        take: 20,
      });
    } catch {
      vehicles = [];
    }
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              Browse Available Fleet
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Select your ideal self-drive vehicle for seamless travel across India.
            </p>
          </div>
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
          <div className="flex-1">
            {vehicles.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {vehicles.map((car: any) => {
                  const brandName = car.brand?.name || "Car";
                  const modelName = car.model?.name || "";
                  const pricing = car.pricings?.[0];
                  const rate = pricing
                    ? typeof pricing.dailyRate?.toNumber === "function"
                      ? pricing.dailyRate.toNumber()
                      : Number(pricing.dailyRate) || 2499
                    : 2499;
                  const slug = getVehicleSlug(
                    brandName,
                    modelName,
                    2024,
                    car.transmission || "MANUAL",
                    car.fuelType || "PETROL",
                  );

                  return (
                    <div
                      key={car.id}
                      className="group overflow-hidden rounded-xl border border-border bg-card/40 shadow-sm transition-all hover:border-border/80 hover:shadow-md"
                    >
                      <div className="relative flex h-44 w-full items-center justify-center overflow-hidden bg-muted">
                        <img
                          src={`/cars/${(brandName + "-" + modelName).toLowerCase().replace(/\s+/g, "-")}.png`}
                          alt={`${brandName} ${modelName}`}
                          onError={(e) => {
                            // Fallback image handling
                            (e.target as HTMLElement).style.display = "none";
                          }}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <Car className="h-12 w-12 text-muted-foreground/30 absolute" />
                      </div>
                      <div className="space-y-4 p-5">
                        <div className="flex items-center justify-between">
                          <h3 className="font-display text-base font-semibold text-foreground">
                            {brandName} {modelName}
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
                            <Fuel className="h-3 w-3" /> {car.fuelType || "PETROL"}
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
            ) : (
              <div className="rounded-2xl border border-dashed border-border/80 p-12 text-center space-y-3">
                <Car className="mx-auto h-10 w-10 text-muted-foreground/40" />
                <h3 className="font-display text-base font-bold text-foreground">
                  No vehicles match selected criteria
                </h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  Try adjusting your filter options or search term to view available self-drive cars.
                </p>
                <Link href="/cars" className="inline-block pt-2">
                  <Button variant="outline" size="sm">
                    Reset Filters
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
