import { notFound } from "next/navigation";
import { db } from "@/lib/db";
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

  // Retrieve details including vehicle specs and pricing
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
