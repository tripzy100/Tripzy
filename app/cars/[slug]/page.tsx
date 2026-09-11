import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { VehicleDetailView } from "@/features/catalog/components/vehicle-detail-view";
import { constructMetadata } from "@/utils/metadata";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Dynamic SEO metadata generation
export async function generateMetadata({ params }: PageProps) {
  try {
    const resolvedParams = await params;
    const tokens = resolvedParams.slug.split("-");
    const brandName = tokens[0] || "";
    const modelName = tokens[1] || "";

    const vehicle = await db.vehicle.findFirst({
      where: {
        deletedAt: null,
        brand: { name: { contains: brandName, mode: "insensitive" } },
        model: { name: { contains: modelName, mode: "insensitive" } },
      },
      include: { brand: true, model: true },
    });

    if (!vehicle) return constructMetadata({ title: "Vehicle Not Found | Tripzy" });

    const title = `${vehicle.brand.name} ${vehicle.model.name} Self Drive Rental in Ranchi | Tripzy`;
    const description = `Rent a self-drive ${vehicle.brand.name} ${vehicle.model.name} in Ranchi. Verified vehicle, paperless KYC, transparent pricing, and 24/7 roadside assistance.`;
    return constructMetadata({ title, description, canonical: `/cars/${resolvedParams.slug}` });
  } catch {
    return constructMetadata({ title: "Self Drive Car Rental | Tripzy" });
  }
}

export default async function CarDetailPage({ params }: PageProps) {
  let vehicle: any = null;
  let pickupLocations: any[] = [];
  let dropLocations: any[] = [];
  let relatedVehicles: any[] = [];

  try {
    const resolvedParams = await params;
    const tokens = resolvedParams.slug.split("-");
    const brandName = tokens[0] || "";
    const modelName = tokens[1] || "";

    vehicle = await db.vehicle.findFirst({
      where: {
        deletedAt: null,
        brand: { name: { contains: brandName, mode: "insensitive" } },
        model: { name: { contains: modelName, mode: "insensitive" } },
      },
      include: {
        brand: true,
        model: true,
        category: true,
        city: true,
        pricings: true,
      },
    });

    if (vehicle) {
      const [pickups, drops, related] = await Promise.all([
        db.pickupLocation.findMany({ where: { isActive: true } }),
        db.dropLocation.findMany({ where: { isActive: true } }),
        db.vehicle.findMany({
          where: {
            deletedAt: null,
            id: { not: vehicle.id },
          },
          take: 3,
          include: { brand: true, model: true, category: true, pricings: true },
        }),
      ]);

      pickupLocations = pickups;
      dropLocations = drops;
      relatedVehicles = related;
    }
  } catch (error) {
    console.error("Error loading vehicle detail:", error);
  }

  // Proper 404 experience if vehicle is not found
  if (!vehicle) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pb-20">
        <VehicleDetailView
          vehicle={vehicle as any}
          pickupLocations={pickupLocations}
          dropLocations={dropLocations}
          relatedVehicles={relatedVehicles}
        />
      </main>
      <Footer />
    </>
  );
}
