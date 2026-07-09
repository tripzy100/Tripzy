import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUserId } from "@/lib/supabase";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import CheckoutWizard from "./checkout-wizard";

export const dynamic = "force-dynamic";

interface CheckoutPageProps {
  searchParams: Promise<{
    vehicleId?: string;
    pickupLocationId?: string;
    dropLocationId?: string;
    pickupDate?: string;
    returnDate?: string;
  }>;
}

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const params = await searchParams;

  const destUrl = `/checkout?vehicleId=${params.vehicleId || ""}&pickupLocationId=${params.pickupLocationId || ""}&dropLocationId=${params.dropLocationId || ""}&pickupDate=${params.pickupDate || ""}&returnDate=${params.returnDate || ""}`;

  const userId = await getCurrentUserId();
  if (!userId) {
    redirect(`/auth/login?callbackUrl=${encodeURIComponent(destUrl)}`);
  }

  const user = await db.user.findUnique({
    where: { id: userId },
    include: { drivingLicence: true, identities: true },
  });

  if (!user) {
    redirect(`/auth/login?callbackUrl=${encodeURIComponent(destUrl)}`);
  }

  const { vehicleId, pickupLocationId, dropLocationId, pickupDate, returnDate } = params;

  if (!vehicleId || !pickupLocationId || !dropLocationId || !pickupDate || !returnDate) {
    redirect("/cars");
  }

  const [vehicle, pickupLoc, dropLoc] = await Promise.all([
    db.vehicle.findUnique({
      where: { id: vehicleId },
      include: { brand: true, model: true },
    }),
    db.pickupLocation.findUnique({ where: { id: pickupLocationId } }),
    db.dropLocation.findUnique({ where: { id: dropLocationId } }),
  ]);

  if (!vehicle || !pickupLoc || !dropLoc) {
    redirect("/cars");
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-6 py-12">
        <CheckoutWizard
          user={user as any}
          vehicle={vehicle as any}
          pickupLocation={pickupLoc as any}
          dropLocation={dropLoc as any}
          pickupDate={pickupDate}
          returnDate={returnDate}
        />
      </main>
      <Footer />
    </>
  );
}
