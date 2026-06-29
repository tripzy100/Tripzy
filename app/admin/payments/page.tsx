import { db } from "@/lib/db";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AdminPaymentsList } from "@/features/payment/components/AdminPaymentsList";

export const dynamic = "force-dynamic";

export default async function AdminPaymentsPage() {
  // Query all payments from database
  const payments = await db.payment.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      booking: { select: { bookingNumber: true } },
    },
  });

  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-6 py-12">
        <AdminPaymentsList initialPayments={payments as any} />
      </main>
      <Footer />
    </>
  );
}
export type AdminPaymentsPageType = typeof AdminPaymentsPage;
