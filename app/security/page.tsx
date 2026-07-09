import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Shield, Lock, Eye, Server } from "lucide-react";

const standards = [
  {
    icon: Lock,
    title: "Encryption",
    description:
      "All data in transit and at rest is encrypted using AES-256 and TLS 1.3 protocols.",
  },
  {
    icon: Shield,
    title: "Authentication",
    description: "Two-factor authentication and session management via secure HTTP-only cookies.",
  },
  {
    icon: Eye,
    title: "Privacy by Design",
    description: "We collect only essential data. You can request deletion anytime.",
  },
  {
    icon: Server,
    title: "Infrastructure",
    description: "Hosted on secure cloud infrastructure with daily backups and DDoS protection.",
  },
];

export default function SecurityPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="mb-2 font-display text-3xl font-bold tracking-tight">Security Standards</h1>
        <p className="mb-10 text-sm text-muted-foreground">
          How we protect your data and ensure safe transactions.
        </p>
        <div className="grid gap-6 sm:grid-cols-2">
          {standards.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.title} className="rounded-xl border border-border bg-card/40 p-5">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <h3 className="mb-1 font-display text-sm font-semibold text-foreground">
                  {s.title}
                </h3>
                <p className="text-xs leading-relaxed text-muted-foreground">{s.description}</p>
              </div>
            );
          })}
        </div>
        <div className="mt-10 flex gap-4 text-xs">
          <Link href="/privacy" className="text-foreground hover:underline">
            Privacy Policy
          </Link>
          <Link href="/terms" className="text-foreground hover:underline">
            Terms of Service
          </Link>
          <Link href="/cancellation" className="text-foreground hover:underline">
            Refund &amp; Cancellation
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
