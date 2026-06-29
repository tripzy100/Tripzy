import { db } from "@/lib/db";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AdminBookingList } from "@/features/booking/components/admin-booking-list";

export default async function AdminBookingsPage() {
  const bookings = await db.booking.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { email: true } },
      vehicle: {
        include: {
          brand: true,
          model: true,
        },
      },
    },
  });

  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-6 py-12">
        <AdminBookingList initialBookings={bookings as any} />
      </main>
      <Footer />
    </>
  );
}
export type AdminBookingsPageType = typeof AdminBookingsPage;
