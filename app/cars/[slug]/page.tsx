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

// Dynamic SEO metadata mapping
export async function generateMetadata({ params }: PageProps) {
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

  if (!vehicle) return constructMetadata();

  const title = `${vehicle.brand.name} ${vehicle.model.name} for Rent`;
  const description = `Rent a self-drive ${vehicle.brand.name} ${vehicle.model.name} in ${vehicle.color}. Clean, fully insured, and verified.`;
  return constructMetadata({ title, description });
}

export default async function CarDetailPage({ params }: PageProps) {
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
    include: {
      brand: true,
      model: true,
      city: true,
      pricings: true,
    },
  });

  if (!vehicle) {
    notFound();
  }

  const [pickupLocations, dropLocations] = await Promise.all([
    db.pickupLocation.findMany({ where: { isActive: true } }),
    db.dropLocation.findMany({ where: { isActive: true } }),
  ]);

  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-6 py-12">
        <VehicleDetailView
          vehicle={vehicle as any}
          pickupLocations={pickupLocations}
          dropLocations={dropLocations}
        />
      </main>
      <Footer />
    </>
  );
}
export type CarDetailPagePropsType = PageProps;
