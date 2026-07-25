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
import { Fuel, Star, Users, Car, CheckCircle2 } from "lucide-react";

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

// Full Fallback Fleet for unseeded / empty database state
const FALLBACK_FLEET = [
  {
    id: "v-swift",
    brandName: "Maruti Suzuki",
    modelName: "Swift",
    category: "Hatchback",
    transmission: "MANUAL",
    fuelType: "PETROL",
    seats: 5,
    rate: 1800,
    rating: 4.8,
  },
  {
    id: "v-dzire",
    brandName: "Maruti Suzuki",
    modelName: "Swift Dzire",
    category: "Sedan",
    transmission: "MANUAL",
    fuelType: "PETROL",
    seats: 5,
    rate: 2000,
    rating: 4.9,
  },
  {
    id: "v-baleno",
    brandName: "Maruti Suzuki",
    modelName: "Baleno",
    category: "Premium Hatchback",
    transmission: "MANUAL",
    fuelType: "PETROL",
    seats: 5,
    rate: 2200,
    rating: 4.8,
  },
  {
    id: "v-glanza",
    brandName: "Toyota",
    modelName: "Glanza",
    category: "Premium Hatchback",
    transmission: "MANUAL",
    fuelType: "PETROL",
    seats: 5,
    rate: 2200,
    rating: 4.9,
  },
  {
    id: "v-creta",
    brandName: "Hyundai",
    modelName: "Creta",
    category: "Compact SUV",
    transmission: "AUTOMATIC",
    fuelType: "PETROL",
    seats: 5,
    rate: 3500,
    rating: 4.9,
  },
  {
    id: "v-thar",
    brandName: "Mahindra",
    modelName: "Thar 4x4",
    category: "SUV",
    transmission: "AUTOMATIC",
    fuelType: "DIESEL",
    seats: 4,
    rate: 4200,
    rating: 5.0,
  },
  {
    id: "v-fortuner",
    brandName: "Toyota",
    modelName: "Fortuner 4x4",
    category: "SUV",
    transmission: "AUTOMATIC",
    fuelType: "DIESEL",
    seats: 7,
    rate: 6500,
    rating: 5.0,
  },
  {
    id: "v-verna",
    brandName: "Hyundai",
    modelName: "Verna",
    category: "Sedan",
    transmission: "AUTOMATIC",
    fuelType: "PETROL",
    seats: 5,
    rate: 2800,
    rating: 4.8,
  },
  {
    id: "v-nexon-ev",
    brandName: "Tata",
    modelName: "Nexon EV",
    category: "Compact SUV",
    transmission: "AUTOMATIC",
    fuelType: "ELECTRIC",
    seats: 5,
    rate: 3200,
    rating: 4.9,
  },
  {
    id: "v-scorpio",
    brandName: "Mahindra",
    modelName: "Scorpio-N",
    category: "SUV",
    transmission: "AUTOMATIC",
    fuelType: "DIESEL",
    seats: 7,
    rate: 4500,
    rating: 4.9,
  },
];

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

  let dbVehicles: any[] = [];

  try {
    const where: any = { deletedAt: null };

    if (resolvedParams.transmission) {
      where.transmission = resolvedParams.transmission;
    }
    if (resolvedParams.fuelType) {
      where.fuelType = resolvedParams.fuelType;
    }
    if (resolvedParams.category) {
      const catVal = resolvedParams.category.trim();
      where.category = {
        OR: [
          { name: { contains: catVal, mode: "insensitive" } },
          { slug: { contains: catVal.toLowerCase().replace(/\s+/g, "-"), mode: "insensitive" } },
        ],
      };
    }
    if (resolvedParams.search) {
      const q = resolvedParams.search.trim();
      where.OR = [
        { brand: { name: { contains: q, mode: "insensitive" } } },
        { model: { name: { contains: q, mode: "insensitive" } } },
      ];
    }

    dbVehicles = await db.vehicle.findMany({
      where,
      include: {
        brand: true,
        model: true,
        category: true,
        city: true,
        pricings: true,
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Error fetching db vehicles:", error);
    dbVehicles = [];
  }

  // Format vehicles list
  let formattedList: any[] = [];

  if (dbVehicles.length > 0) {
    formattedList = dbVehicles.map((car: any) => {
      const brandName = car.brand?.name || "Car";
      const modelName = car.model?.name || "";
      const pricing = car.pricings?.[0];
      const rate = pricing
        ? typeof pricing.dailyRate?.toNumber === "function"
          ? pricing.dailyRate.toNumber()
          : Number(pricing.dailyRate) || 2499
        : 2499;

      return {
        id: car.id,
        brandName,
        modelName,
        category: car.category?.name || "Self-Drive",
        transmission: car.transmission || "MANUAL",
        fuelType: car.fuelType || "PETROL",
        seats: 5,
        rate,
        rating: 4.9,
      };
    });
  } else {
    // Apply filters to FALLBACK_FLEET if database has 0 records or no match
    formattedList = FALLBACK_FLEET.filter((car) => {
      if (resolvedParams.transmission && car.transmission !== resolvedParams.transmission) {
        return false;
      }
      if (resolvedParams.fuelType && car.fuelType !== resolvedParams.fuelType) {
        return false;
      }
      if (resolvedParams.seats && String(car.seats) !== String(resolvedParams.seats)) {
        return false;
      }
      if (resolvedParams.category) {
        const catQuery = resolvedParams.category.toLowerCase().replace(/[-\s]/g, "");
        const carCat = car.category.toLowerCase().replace(/[-\s]/g, "");
        if (!carCat.includes(catQuery) && !catQuery.includes(carCat)) {
          return false;
        }
      }
      if (resolvedParams.search) {
        const s = resolvedParams.search.toLowerCase().trim();
        const full = `${car.brandName} ${car.modelName} ${car.category}`.toLowerCase();
        if (!full.includes(s)) {
          return false;
        }
      }
      return true;
    });

    // If active filters produced 0 results, return full fallback list so user is never stuck with an empty view
    if (formattedList.length === 0 && !resolvedParams.search && !resolvedParams.category && !resolvedParams.transmission && !resolvedParams.fuelType) {
      formattedList = FALLBACK_FLEET;
    }
  }

  // Sort list if requested
  if (resolvedParams.sort === "price_asc") {
    formattedList.sort((a, b) => a.rate - b.rate);
  } else if (resolvedParams.sort === "price_desc") {
    formattedList.sort((a, b) => b.rate - a.rate);
  } else if (resolvedParams.sort === "rating") {
    formattedList.sort((a, b) => b.rating - a.rating);
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
              Select your ideal self-drive vehicle for seamless travel across India ({formattedList.length} cars available).
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
            {formattedList.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {formattedList.map((car: any) => {
                  const slug = getVehicleSlug(
                    car.brandName,
                    car.modelName,
                    2024,
                    car.transmission,
                    car.fuelType,
                  );

                  const imgSlug = `${car.brandName}-${car.modelName}`
                    .toLowerCase()
                    .replace(/\s+/g, "-");

                  return (
                    <div
                      key={car.id}
                      className="group overflow-hidden rounded-xl border border-border bg-card/40 shadow-sm transition-all hover:border-border/80 hover:shadow-md"
                    >
                      <div className="relative flex h-44 w-full items-center justify-center overflow-hidden bg-muted">
                        <img
                          src={`/cars/${imgSlug}.png`}
                          alt={`${car.brandName} ${car.modelName}`}
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = "none";
                          }}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <Car className="h-12 w-12 text-muted-foreground/30 absolute" />
                      </div>
                      <div className="space-y-4 p-5">
                        <div className="flex items-center justify-between">
                          <h3 className="font-display text-base font-semibold text-foreground">
                            {car.brandName} {car.modelName}
                          </h3>
                          <div className="flex items-center gap-1 text-xs font-semibold text-amber-500">
                            <Star className="h-3.5 w-3.5 fill-current" /> {car.rating || 4.9}
                          </div>
                        </div>

                        <div className="flex gap-4 border-t border-border/50 pt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" /> {car.seats || 5} Seats
                          </span>
                          <span className="flex items-center gap-1">
                            <Fuel className="h-3 w-3" /> {car.fuelType}
                          </span>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <div>
                            <span className="font-display text-base font-bold text-foreground">
                              &#8377;{car.rate}
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
              <div className="rounded-2xl border border-dashed border-border/80 p-12 text-center space-y-4">
                <Car className="mx-auto h-10 w-10 text-muted-foreground/40" />
                <div className="space-y-1">
                  <h3 className="font-display text-base font-bold text-foreground">
                    No vehicles match selected criteria
                  </h3>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                    Try adjusting your category, transmission, or fuel filter options.
                  </p>
                </div>
                <Link href="/cars" className="inline-block">
                  <Button size="sm">
                    Show All Available Cars
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
