import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="mb-6 font-display text-3xl font-bold tracking-tight">Privacy Policy</h1>
        <div className="prose prose-sm space-y-4 text-muted-foreground">
          <p>Last updated: January 2025</p>
          <h3 className="font-display font-semibold text-foreground">Information We Collect</h3>
          <p>
            We collect personal information such as your name, email, phone number, driving license
            details, and payment information when you create an account or make a booking.
          </p>
          <h3 className="font-display font-semibold text-foreground">
            How We Use Your Information
          </h3>
          <p>
            Your information is used to process rentals, verify your identity, process payments,
            send booking confirmations, and improve our services.
          </p>
          <h3 className="font-display font-semibold text-foreground">Data Security</h3>
          <p>
            We implement encryption, access controls, and regular security audits to protect your
            data. Payment data is processed via PCI-compliant gateways.
          </p>
          <h3 className="font-display font-semibold text-foreground">Contact</h3>
          <p>
            For privacy concerns, email us at{" "}
            <a href="mailto:privacy@tripzy.in" className="text-foreground underline">
              privacy@tripzy.in
            </a>
            .
          </p>
        </div>
        <div className="mt-10 flex gap-4 text-xs">
          <Link href="/terms" className="text-foreground hover:underline">
            Terms of Service
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
