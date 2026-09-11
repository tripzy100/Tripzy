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
    pickupTime?: string;
    returnDate?: string;
    returnTime?: string;
  }>;
}

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const params = await searchParams;

  const { vehicleId, pickupLocationId, dropLocationId, pickupDate, pickupTime, returnDate, returnTime } = params;

  const destUrl = `/checkout?vehicleId=${vehicleId || ""}&pickupLocationId=${pickupLocationId || ""}&dropLocationId=${dropLocationId || ""}&pickupDate=${pickupDate || ""}&pickupTime=${pickupTime || ""}&returnDate=${returnDate || ""}&returnTime=${returnTime || ""}`;

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

  if (!vehicleId || !pickupLocationId || !dropLocationId || !pickupDate || !returnDate) {
    redirect("/cars");
  }

  const [vehicle, pickupLoc, dropLoc, allPickups, allDrops] = await Promise.all([
    db.vehicle.findUnique({
      where: { id: vehicleId },
      include: { brand: true, model: true, pricings: true },
    }),
    db.pickupLocation.findUnique({ where: { id: pickupLocationId } }),
    db.dropLocation.findUnique({ where: { id: dropLocationId } }),
    db.pickupLocation.findMany({ select: { id: true, name: true, address: true } }),
    db.dropLocation.findMany({ select: { id: true, name: true, address: true } }),
  ]);

  if (!vehicle || !pickupLoc || !dropLoc) {
    redirect("/cars");
  }

  // Format full pickupDate and returnDate with times if pickupTime/returnTime are present
  const fullPickupDate = pickupTime && !pickupDate.includes("T") ? `${pickupDate}T${pickupTime}` : pickupDate;
  const fullReturnDate = returnTime && !returnDate.includes("T") ? `${returnDate}T${returnTime}` : returnDate;

  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
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
          pickupDate={fullPickupDate}
          returnDate={fullReturnDate}
          allPickupLocations={allPickups}
          allDropLocations={allDrops}
        />
      </main>
      <Footer />
    </>
  );
}
