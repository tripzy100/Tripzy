import { db } from "@/lib/db";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CarsDashboard } from "@/features/cars/components/CarsDashboard";

export const dynamic = "force-dynamic";

export default async function AdminCarsPage() {
  // Query all active vehicles from database (where deletedAt is null)
  const vehicles = await db.vehicle.findMany({
    where: {
      deletedAt: null,
    },
    select: {
      id: true,
      plateNumber: true,
      status: true,
      brand: { select: { name: true } },
      model: { select: { name: true } },
      city: { select: { name: true } },
    },
  });

  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-6 py-12">
        <CarsDashboard initialVehicles={vehicles} />
      </main>
      <Footer />
    </>
  );
}
