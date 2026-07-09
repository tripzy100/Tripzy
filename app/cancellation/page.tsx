import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function CancellationPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="mb-6 font-display text-3xl font-bold tracking-tight">
          Refund &amp; Cancellation Policy
        </h1>
        <div className="prose prose-sm space-y-4 text-muted-foreground">
          <p>Last updated: January 2025</p>
          <h3 className="font-display font-semibold text-foreground">Free Cancellation</h3>
          <p>
            You can cancel your booking free of charge up to 24 hours before the scheduled pickup
            time.
          </p>
          <h3 className="font-display font-semibold text-foreground">Late Cancellation</h3>
          <p>
            Cancellations made within 24 hours of pickup will incur a charge equivalent to one
            day&apos;s rental.
          </p>
          <h3 className="font-display font-semibold text-foreground">No-Show</h3>
          <p>
            If you do not pick up the vehicle at the scheduled time, the full rental amount will be
            charged.
          </p>
          <h3 className="font-display font-semibold text-foreground">Refund Processing</h3>
          <p>Refunds are processed within 5-7 business days to the original payment method.</p>
        </div>
        <div className="mt-10 flex gap-4 text-xs">
          <Link href="/privacy" className="text-foreground hover:underline">
            Privacy Policy
          </Link>
          <Link href="/terms" className="text-foreground hover:underline">
            Terms of Service
          </Link>
          <Link href="/security" className="text-foreground hover:underline">
            Security Standards
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
