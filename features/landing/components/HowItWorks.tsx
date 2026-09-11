import { Car, ShieldCheck, KeyRound, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const steps = [
  {
    step: "01",
    title: "Choose your car",
    description:
      "Browse verified fleet in Ranchi. Select your pickup hub, rental dates, and preferred vehicle class with zero hidden fees.",
    icon: Car,
    highlight: "Real-time availability",
  },
  {
    step: "02",
    title: "Complete verification",
    description:
      "Submit digital Driving Licence & Aadhaar details for fast paperless administrative approval before departure.",
    icon: ShieldCheck,
    highlight: "Paperless KYC",
  },
  {
    step: "03",
    title: "Pick up & drive",
    description:
      "Collect your sanitized car with verified pickup OTP at Lalpur Hub or Birsa Munda Airport and start your drive.",
    icon: KeyRound,
    highlight: "Instant OTP handover",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="border-t border-border/70 py-12 sm:py-16 lg:py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-5 border-b border-border/50">
          <div className="max-w-xl space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              The Rental Journey
            </span>
            <h2 className="font-display text-3xl font-black tracking-tight text-foreground sm:text-4xl">
              How self-drive works.
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Three seamless steps from choosing your vehicle to taking the wheel in Ranchi.
            </p>
          </div>
          <Link href="/cars" className="hidden sm:inline-flex">
            <Button variant="outline" size="sm" className="font-semibold text-xs h-9 px-4 border-border/80">
              Browse Fleet
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        {/* 3-Step Journey Grid */}
        <div className="grid gap-5 md:grid-cols-3 relative">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="relative flex flex-col justify-between rounded-xl border border-border/70 bg-card/60 p-5 sm:p-6 transition-all duration-200 hover:border-primary/50 hover:bg-card/90 shadow-2xs"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20 shadow-2xs">
                      <Icon className="h-5 w-5 stroke-[2.2]" />
                    </div>
                    <span className="font-display text-2xl sm:text-3xl font-black tracking-tight text-foreground/25">
                      {item.step}
                    </span>
                  </div>

                  <h3 className="font-display text-base sm:text-lg font-bold tracking-tight text-foreground mb-1.5">
                    {item.title}
                  </h3>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-5 pt-3.5 border-t border-border/40 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span className="text-[11px] font-bold text-foreground/80 uppercase tracking-wider">
                    {item.highlight}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

