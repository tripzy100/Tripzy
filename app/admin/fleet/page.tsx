import { db } from "@/lib/db";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FleetDashboard } from "@/features/fleet/components/FleetDashboard";

export default async function AdminFleetPage() {
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
        <FleetDashboard initialVehicles={vehicles} />
      </main>
      <Footer />
    </>
  );
}
