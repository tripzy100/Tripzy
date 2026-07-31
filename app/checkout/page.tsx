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

  // 1. Authentication Guard
  const userId = await getCurrentUserId();
  if (!userId) {
    redirect(`/auth/login?callbackUrl=${encodeURIComponent(destUrl)}`);
  }

  const user = await db.user.findUnique({
    where: { id: userId },
    include: {
      profile: {
        include: {
          addresses: true,
        },
      },
      drivingLicence: true,
      identities: true,
      kycRequests: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
      emergencyContacts: true,
    },
  });

  if (!user) {
    redirect(`/auth/login?callbackUrl=${encodeURIComponent(destUrl)}`);
  }

  // 2. Progressive Profile Completion Guard
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

  // 3. Progressive KYC Approval Guard
  const latestKyc = user.kycRequests[0];
  const isKycApproved = user.isKycVerified || latestKyc?.status === "APPROVED";

  if (!isKycApproved) {
    redirect("/dashboard/kyc?reason=kyc_required_for_payment");
  }

  const { vehicleId, pickupLocationId, dropLocationId, pickupDate, returnDate } = params;

  if (!vehicleId || !pickupLocationId || !dropLocationId || !pickupDate || !returnDate) {
    redirect("/cars");
  }

  const [vehicle, pickupLoc, dropLoc] = await Promise.all([
    db.vehicle.findUnique({
      where: { id: vehicleId },
      include: { brand: true, model: true, pricings: true },
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
          user={{
            id: user.id,
            email: user.email,
            phone: user.phone || "",
            name: `${user.profile?.firstName || ""} ${user.profile?.lastName || ""}`.trim(),
            isKycVerified: isKycApproved,
          }}
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
