import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUserId } from "@/lib/supabase";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { BookingDetailView } from "@/features/booking/components/booking-detail-view";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function BookingPage({ params }: PageProps) {
  const resolvedParams = await params;
  const userId = await getCurrentUserId();

  if (!userId) {
    redirect("/auth/login?redirect=/bookings/" + resolvedParams.id);
  }

  // Retrieve booking details with ownership authorization check
  const booking = await db.booking.findUnique({
    where: { id: resolvedParams.id },
    include: {
      vehicle: {
        include: {
          brand: true,
          model: true,
          pricings: true,
        },
      },
      pickupLocation: true,
      dropLocation: true,
    },
  });

  if (!booking) {
    notFound();
  }

  // Ownership Guard: User must own the booking (or be an admin)
  if (booking.userId !== userId) {
    // Check if user has ADMIN role
    const userRoleRecord = await db.user.findUnique({
      where: { id: userId },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    });

    const isAdmin = userRoleRecord?.userRoles.some((ur) => ur.role.code === "ADMIN");

    if (!isAdmin) {
      notFound(); // Hide existence of another user's booking
    }
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-6 py-12">
        <BookingDetailView booking={booking as any} />
      </main>
      <Footer />
    </>
  );
}
export type BookingPagePropsType = PageProps;
