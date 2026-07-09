import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Check, Zap, Award, Briefcase } from "lucide-react";

const plans = [
  {
    name: "Hourly Flex",
    price: "299",
    icon: Zap,
    features: ["Pay-per-hour", "No commitment", "Basic insurance", "24/7 support"],
  },
  {
    name: "Daily Pass",
    price: "1,499",
    icon: Award,
    features: [
      "Unlimited km*",
      "Zero security deposit",
      "Comprehensive insurance",
      "Free cancellation",
      "Priority support",
    ],
  },
  {
    name: "Monthly Pro",
    price: "24,999",
    icon: Briefcase,
    features: [
      "30-day rental",
      "5000 km included",
      "Full insurance cover",
      "Free maintenance",
      "Dedicated account manager",
    ],
  },
];

export default function PackagesPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-12 text-center">
          <h1 className="mb-3 font-display text-3xl font-bold tracking-tight">
            Pricing &amp; Plans
          </h1>
          <p className="mx-auto max-w-lg text-sm text-muted-foreground">
            Flexible rental plans designed for every kind of traveller. No hidden charges,
            transparent pricing.
          </p>
        </div>
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <div
                key={plan.name}
                className="flex flex-col rounded-xl border border-border bg-card/40 p-6 transition-shadow hover:shadow-md"
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display font-semibold text-foreground">{plan.name}</h3>
                </div>
                <div className="mb-6">
                  <span className="font-display text-3xl font-bold text-foreground">
                    &#8377;{plan.price}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {" "}
                    /{" "}
                    {plan.name.includes("Hourly")
                      ? "hr"
                      : plan.name.includes("Monthly")
                        ? "mo"
                        : "day"}
                  </span>
                </div>
                <ul className="mb-8 flex-1 space-y-2.5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs text-foreground/80">
                      <Check className="h-3.5 w-3.5 shrink-0 text-emerald-500" /> {f}
                    </li>
                  ))}
                </ul>
                <Link href="/cars">
                  <Button variant="default" className="w-full">
                    Get Started
                  </Button>
                </Link>
              </div>
            );
          })}
        </div>
        <div className="mt-12 space-y-2 text-center">
          <p className="text-xs text-muted-foreground">*Terms and conditions apply. GST extra.</p>
          <div className="flex justify-center gap-4">
            <Link href="/cars" className="text-xs text-foreground hover:underline">
              Browse cars
            </Link>
            <Link href="/support" className="text-xs text-foreground hover:underline">
              Contact us
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
