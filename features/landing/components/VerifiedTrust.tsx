import { ShieldCheck, FileCheck, MapPin, Clock } from "lucide-react";

const businessFacts = [
  {
    icon: FileCheck,
    title: "Paperless KYC Verification",
    description: "Submit digital DL & Aadhaar for administrative approval queue.",
  },
  {
    icon: ShieldCheck,
    title: "Comprehensive Protection",
    description: "Standard insurance coverage included with transparent terms.",
  },
  {
    icon: MapPin,
    title: "Dual Ranchi Pickup Hubs",
    description: "Key handover available at Ranchi Airport (Birsa Chowk) & Lalpur Hub.",
  },
  {
    icon: Clock,
    title: "15-Minute Hold Protection",
    description: "Atomic reservation hold prevents double-booking while you verify.",
  },
];

export default function VerifiedTrust() {
  return (
    <section className="border-t border-border/80 py-16 lg:py-20 bg-card/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 space-y-2 text-center max-w-xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            Trust & Security
          </span>
          <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Built for reliability.
          </h2>
          <p className="text-sm text-muted-foreground">
            Clear rental terms, verified vehicles, and transparent customer service.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {businessFacts.map((fact, idx) => {
            const Icon = fact.icon;
            return (
              <div
                key={idx}
                className="space-y-3 rounded-xl border border-border bg-card p-6"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-5 w-5 stroke-[2]" />
                </div>
                <h3 className="font-display text-base font-bold text-foreground">
                  {fact.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {fact.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
