import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="mb-6 font-display text-3xl font-bold tracking-tight">Terms of Service</h1>
        <div className="prose prose-sm space-y-4 text-muted-foreground">
          <p>Last updated: January 2025</p>
          <h3 className="font-display font-semibold text-foreground">Rental Agreement</h3>
          <p>
            By renting a vehicle through Tripzy, you agree to provide a valid driving license,
            adhere to traffic laws, and return the vehicle in the same condition.
          </p>
          <h3 className="font-display font-semibold text-foreground">Eligibility</h3>
          <p>
            You must be at least 21 years old and hold a valid driving license issued in India to
            rent a vehicle.
          </p>
          <h3 className="font-display font-semibold text-foreground">Liability</h3>
          <p>
            The renter is responsible for any traffic violations, toll charges, and damage incurred
            during the rental period. Comprehensive insurance is included in all plans.
          </p>
          <h3 className="font-display font-semibold text-foreground">Modifications</h3>
          <p>
            We reserve the right to update these terms at any time. Users will be notified of
            material changes via email.
          </p>
        </div>
        <div className="mt-10 flex gap-4 text-xs">
          <Link href="/privacy" className="text-foreground hover:underline">
            Privacy Policy
          </Link>
          <Link href="/cancellation" className="text-foreground hover:underline">
            Refund &amp; Cancellation
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
