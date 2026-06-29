import Link from "next/link";
import { db } from "@/lib/db";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FilterSidebar } from "@/features/catalog/components/filter-sidebar";
import { SearchHeader } from "@/features/catalog/components/search-header";
import { Button } from "@/components/ui/button";
import { Fuel, Star, Users } from "lucide-react";

export const dynamic = "force-dynamic";

// Slug generation utility helper
function getVehicleSlug(brand: string, model: string, year: number, transmission: string, fuel: string) {
  return `${brand.toLowerCase()}-${model.toLowerCase()}-${year}-${transmission.toLowerCase()}-${fuel.toLowerCase()}`.replace(/\s+/g, "-");
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
  if (resolvedParams.category) where.category = { name: { equals: resolvedParams.category, mode: "insensitive" } };
  if (resolvedParams.seats) where.variant = { model: { vehicles: { some: { variant: { engineCapacity: { not: undefined } } } } } }; // Mock query matching seats, or simple mock:
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
        <h1 className="font-display text-2xl font-bold tracking-tight mb-8">Browse Available Fleet</h1>
        
        {/* Search header container */}
        <SearchHeader
          value={resolvedParams.search || ""}
          onChange={() => {}} // Handle client updates in dynamic queries if needed
          currentFilters={new URLSearchParams(resolvedParams as any)}
          setFilter={() => {}}
        />

        <div className="flex flex-col lg:flex-row gap-8">
          <FilterSidebar
            currentFilters={new URLSearchParams(resolvedParams as any)}
            setFilter={() => {}}
          />

          {/* Cars Grid */}
          <div className="flex-1 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {vehicles.map((car) => {
              const rate = car.pricings[0]?.dailyRate?.toNumber() || 2000;
              const slug = getVehicleSlug(car.brand.name, car.model.name, 2024, car.transmission, car.fuelType);
              
              return (
                <div key={car.id} className="rounded-xl border border-border bg-card/40 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="h-44 w-full bg-muted flex items-center justify-center text-xs text-muted-foreground font-mono">
                    {car.brand.name} Image Placeholder
                  </div>
                  <div className="p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display font-semibold text-base text-foreground">{car.brand.name} {car.model.name}</h3>
                      <div className="flex items-center gap-1 text-xs text-amber-500 font-semibold">
                        <Star className="h-3.5 w-3.5 fill-current" /> 4.9
                      </div>
                    </div>

                    <div className="flex gap-4 text-xs text-muted-foreground pt-2 border-t border-border/50">
                      <span className="flex items-center gap-1"><Users className="h-3 w-3" /> 5 Seats</span>
                      <span className="flex items-center gap-1"><Fuel className="h-3 w-3" /> {car.fuelType}</span>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div>
                        <span className="font-display text-base font-bold text-foreground">&#8377;{rate}</span>
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
