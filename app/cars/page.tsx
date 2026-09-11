import Link from "next/link";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUserId } from "@/lib/supabase";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CarImage } from "@/components/cars/car-image";
import { Button } from "@/components/ui/button";
import { TripSearchBar } from "@/features/catalog/components/trip-search-bar";
import { CatalogToolbar } from "@/features/catalog/components/catalog-toolbar";
import { Fuel, Users, Activity, MapPin, CheckCircle, AlertCircle, ArrowRight } from "lucide-react";
import { constructMetadata } from "@/utils/metadata";

export const dynamic = "force-dynamic";

export const metadata = constructMetadata({
  title: "Self Drive Cars for Rent in Ranchi | Tripzy Fleet",
  description:
    "Choose from verified self-drive cars in Ranchi. Rent Swift, Thar 4x4, Verna, Safari & Nexon EV with paperless KYC, transparent pricing, and 24/7 roadside assistance.",
  canonical: "/cars",
});

// Helper for generating vehicle URL slug
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

// Fallback Fleet array for unseeded/empty database environments
const FALLBACK_FLEET = [
  {
    id: "v-swift",
    brandName: "Maruti Suzuki",
    modelName: "Swift",
    category: "Hatchback",
    routeTag: "City-friendly & efficient",
    transmission: "MANUAL",
    fuelType: "PETROL",
    seats: 5,
    rate: 1800,
    isAvailable: true,
  },
  {
    id: "v-dzire",
    brandName: "Maruti Suzuki",
    modelName: "Swift Dzire",
    category: "Sedan",
    routeTag: "Smooth sedan comfort",
    transmission: "MANUAL",
    fuelType: "PETROL",
    seats: 5,
    rate: 2000,
    isAvailable: true,
  },
  {
    id: "v-baleno",
    brandName: "Maruti Suzuki",
    modelName: "Baleno",
    category: "Premium Hatchback",
    routeTag: "Spacious premium hatch",
    transmission: "MANUAL",
    fuelType: "PETROL",
    seats: 5,
    rate: 2200,
    isAvailable: true,
  },
  {
    id: "v-glanza",
    brandName: "Toyota",
    modelName: "Glanza",
    category: "Premium Hatchback",
    routeTag: "Refined Toyota drive",
    transmission: "MANUAL",
    fuelType: "PETROL",
    seats: 5,
    rate: 2200,
    isAvailable: true,
  },
  {
    id: "v-creta",
    brandName: "Hyundai",
    modelName: "Creta",
    category: "Compact SUV",
    routeTag: "High clearance comfort",
    transmission: "AUTOMATIC",
    fuelType: "PETROL",
    seats: 5,
    rate: 3500,
    isAvailable: true,
  },
  {
    id: "v-thar",
    brandName: "Mahindra",
    modelName: "Thar 4x4",
    category: "SUV",
    routeTag: "Great for weekend escapes",
    transmission: "AUTOMATIC",
    fuelType: "DIESEL",
    seats: 4,
    rate: 4200,
    isAvailable: true,
  },
  {
    id: "v-fortuner",
    brandName: "Toyota",
    modelName: "Fortuner 4x4",
    category: "SUV",
    routeTag: "Full size luxury SUV",
    transmission: "AUTOMATIC",
    fuelType: "DIESEL",
    seats: 7,
    rate: 6500,
    isAvailable: true,
  },
  {
    id: "v-verna",
    brandName: "Hyundai",
    modelName: "Verna",
    category: "Sedan",
    routeTag: "Executive highway comfort",
    transmission: "AUTOMATIC",
    fuelType: "PETROL",
    seats: 5,
    rate: 2800,
    isAvailable: true,
  },
  {
    id: "v-nexon-ev",
    brandName: "Tata",
    modelName: "Nexon EV",
    category: "Compact SUV",
    routeTag: "Clean eco city drives",
    transmission: "AUTOMATIC",
    fuelType: "ELECTRIC",
    seats: 5,
    rate: 3200,
    isAvailable: true,
  },
  {
    id: "v-scorpio",
    brandName: "Mahindra",
    modelName: "Scorpio-N",
    category: "SUV",
    routeTag: "Spacious group trips",
    transmission: "AUTOMATIC",
    fuelType: "DIESEL",
    seats: 7,
    rate: 4500,
    isAvailable: true,
  },
];

interface PageProps {
  searchParams: Promise<{
    search?: string;
    city?: string;
    location?: string;
    pickupDate?: string;
    pickupTime?: string;
    returnDate?: string;
    returnTime?: string;
    transmission?: string;
    fuelType?: string;
    seats?: string;
    sort?: string;
    category?: string;
  }>;
}

export default async function CarsPage({ searchParams }: PageProps) {
  // Server-side Route Guard: Require profile completion for logged-in users
  const userId = await getCurrentUserId();
  if (userId) {
    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        profile: {
          include: {
            addresses: true,
          },
        },
        emergencyContacts: true,
      },
    });

    if (user) {
      const emergencyContact = user.emergencyContacts[0];
      const primaryAddress = user.profile?.addresses[0];

      const completedFieldsCount = [
        !!(user.profile?.firstName && user.profile?.lastName),
        !!user.email,
        !!user.phone,
        !!user.profile?.dateOfBirth,
        !!user.profile?.gender,
        !!(primaryAddress?.street || primaryAddress?.zipCode),
        !!(emergencyContact?.name && emergencyContact?.phone),
      ].filter(Boolean).length;

      const isProfileComplete = completedFieldsCount === 7;
      if (!isProfileComplete) {
        redirect("/dashboard?reason=profile_required");
      }
    }
  }

  let resolvedParams: any = {};
  try {
    resolvedParams = await searchParams;
  } catch {
    resolvedParams = {};
  }

  // Calculate rental duration if dates are provided
  let rentalDays = 0;
  if (resolvedParams.pickupDate && resolvedParams.returnDate) {
    try {
      const pDate = new Date(resolvedParams.pickupDate);
      const rDate = new Date(resolvedParams.returnDate);
      const diffMs = rDate.getTime() - pDate.getTime();
      rentalDays = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
    } catch {
      rentalDays = 0;
    }
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
        is: {
          OR: [
            { name: { contains: catVal, mode: "insensitive" } },
            { slug: { contains: catVal.toLowerCase().replace(/\s+/g, "-"), mode: "insensitive" } },
          ],
        },
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
      const deposit = pricing
        ? typeof pricing.securityDeposit?.toNumber === "function"
          ? pricing.securityDeposit.toNumber()
          : Number(pricing.securityDeposit) || 5000
        : 5000;

      return {
        id: car.id,
        brandName,
        modelName,
        category: car.category?.name || "Self-Drive",
        transmission: car.transmission || "MANUAL",
        fuelType: car.fuelType || "PETROL",
        seats: 5,
        rate,
        deposit,
        isAvailable: car.status === "AVAILABLE",
      };
    });
  } else {
    formattedList = FALLBACK_FLEET.map((f) => ({ ...f, deposit: 5000 })).filter((car) => {
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

    if (
      formattedList.length === 0 &&
      !resolvedParams.search &&
      !resolvedParams.category &&
      !resolvedParams.transmission &&
      !resolvedParams.fuelType
    ) {
      formattedList = FALLBACK_FLEET;
    }
  }

  // Authoritative sorting
  if (resolvedParams.sort === "price_asc") {
    formattedList.sort((a, b) => a.rate - b.rate);
  } else if (resolvedParams.sort === "price_desc") {
    formattedList.sort((a, b) => b.rate - a.rate);
  }

  const selectedLocation = resolvedParams.location || resolvedParams.city || "Ranchi";

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
          {/* Page Header (Restrained Editorial Heading) */}
          <div className="mb-8 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Fleet Catalogue
            </span>
            <h1 className="font-display text-3xl font-black tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Find your car.
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground max-w-xl">
              Choose the right car for your next drive around Ranchi and beyond.
            </p>

            {/* Current Search Context Badge */}
            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 font-semibold text-foreground">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                <span>{selectedLocation}</span>
              </div>

              {resolvedParams.pickupDate && resolvedParams.returnDate ? (
                <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 font-semibold text-foreground">
                  <span>
                    {resolvedParams.pickupDate} → {resolvedParams.returnDate}
                  </span>
                  {rentalDays > 0 && (
                    <span className="text-primary">({rentalDays} {rentalDays === 1 ? "day" : "days"})</span>
                  )}
                </div>
              ) : (
                <span className="text-muted-foreground italic">
                  Select pickup & return dates to check exact vehicle availability.
                </span>
              )}
            </div>
          </div>

          {/* Search / Trip Controls Bar */}
          <Suspense fallback={<div className="mb-8 h-16 animate-pulse rounded-xl bg-card" />}>
            <TripSearchBar />
          </Suspense>

          {/* Category Pills & Filters Toolbar */}
          <Suspense fallback={<div className="mb-8 h-12 animate-pulse rounded-xl bg-card" />}>
            <CatalogToolbar />
          </Suspense>

          {/* Vehicle Catalogue Grid */}
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

                const totalPrice = rentalDays > 0 ? car.rate * rentalDays : 0;

                return (
                  <div
                    key={car.id}
                    className="group overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm transition-all duration-200 hover:border-border/90 hover:shadow-md flex flex-col justify-between"
                  >
                    {/* Studio Cutout Vehicle Image */}
                    <div>
                      <div className="relative p-3">
                        <CarImage
                          src={`/cars/${imgSlug}.png`}
                          alt={`${car.brandName} ${car.modelName}`}
                          aspectRatio="video"
                          objectFit="contain"
                          className="rounded-lg bg-muted/20"
                        />

                        {/* Category Pill */}
                        <span className="absolute top-5 left-5 rounded-md bg-background/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-foreground border border-border/50">
                          {car.category}
                        </span>

                        {/* Availability Status Badge */}
                        <div className="absolute top-5 right-5">
                          {car.isAvailable ? (
                            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                              <CheckCircle className="h-3 w-3" /> Available
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-md bg-destructive/10 px-2.5 py-1 text-[10px] font-bold text-destructive border border-destructive/20">
                              <AlertCircle className="h-3 w-3" /> Unavailable
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Specs & Information */}
                      <div className="p-5 pt-1 space-y-3">
                        <div>
                          <h3 className="font-display text-lg font-bold tracking-tight text-foreground">
                            {car.brandName} {car.modelName}
                          </h3>
                          {car.routeTag && (
                            <p className="text-[11px] font-medium text-primary">
                              {car.routeTag}
                            </p>
                          )}
                        </div>

                        {/* Specifications Pill Bar */}
                        <div className="grid grid-cols-3 gap-2 border-y border-border/60 py-2.5 text-xs font-semibold text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <Users className="h-3.5 w-3.5 text-primary" />
                            <span>{car.seats || 5} Seats</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Fuel className="h-3.5 w-3.5 text-primary" />
                            <span>{car.fuelType}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Activity className="h-3.5 w-3.5 text-primary" />
                            <span>{car.transmission}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Authoritative Pricing & Conversion Actions */}
                    <div className="p-5 pt-0 space-y-3">
                      <div className="flex items-baseline justify-between border-t border-border/50 pt-3">
                        <div>
                          <div className="flex items-baseline gap-1">
                            <span className="font-display text-xl font-extrabold text-foreground">
                              &#8377;{car.rate.toLocaleString("en-IN")}
                            </span>
                            <span className="text-xs text-muted-foreground font-medium"> / day</span>
                          </div>
                          <p className="text-[11px] font-medium text-muted-foreground">
                            &#8377;{car.deposit.toLocaleString("en-IN")} refundable deposit
                          </p>
                        </div>

                        {totalPrice > 0 && (
                          <div className="text-right">
                            <span className="text-xs font-bold text-primary">
                              &#8377;{totalPrice.toLocaleString("en-IN")} total
                            </span>
                            <p className="text-[10px] text-muted-foreground">for {rentalDays} days</p>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2.5">
                        <Link href={`/cars/${slug}`}>
                          <Button variant="outline" size="sm" className="w-full font-semibold text-xs">
                            View details
                          </Button>
                        </Link>

                        {car.isAvailable ? (
                          <Link href={`/checkout?vehicleId=${car.id}`}>
                            <Button size="sm" className="w-full font-bold text-xs">
                              Book now
                            </Button>
                          </Link>
                        ) : (
                          <Button variant="secondary" size="sm" disabled className="w-full text-xs font-semibold">
                            Unavailable
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Elegant Empty State */
            <div className="rounded-2xl border border-dashed border-border/80 bg-card p-12 text-center space-y-4 my-8">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <AlertCircle className="h-6 w-6 text-muted-foreground" />
              </div>

              <div className="space-y-1">
                <h3 className="font-display text-lg font-bold text-foreground">
                  No cars available for these dates.
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
                  Try adjusting your rental dates, transmission, or category filters.
                </p>
              </div>

              <div className="pt-2 flex justify-center gap-3">
                <Link href="/cars">
                  <Button size="sm" className="font-bold gap-1.5">
                    Clear all filters
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
