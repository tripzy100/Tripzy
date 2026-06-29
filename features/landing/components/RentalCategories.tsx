"use client";

import { Shield, Sparkles, Zap, Calendar, HeartHandshake, Compass } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const categories = [
  {
    icon: Shield,
    name: "SUVs",
    description: "Spacious cabins built for families and offroad terrains.",
  },
  {
    icon: Sparkles,
    name: "Luxury Elite",
    description: "Premium sedans and sports models for executive arrivals.",
  },
  {
    icon: Zap,
    name: "Electric Fleet (EV)",
    description: "Eco-friendly zero-emissions modern battery propulsion.",
  },
  {
    icon: Calendar,
    name: "Monthly Subscriptions",
    description: "Flexible long-term rates without lease locks or signups.",
  },
  {
    icon: HeartHandshake,
    name: "Weekend Gateways",
    description: "Pre-configured bundles with unlimited km parameters.",
  },
  {
    icon: Compass,
    name: "Sedans",
    description: "Clean comfortable sedans optimized for city commutes.",
  },
];

export default function RentalCategories() {
  return (
    <section className="bg-card/25 border-y border-border py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Rental Categories</span>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl text-gradient">
            Flexible packages built for every scenario.
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div
                key={idx}
                className="group flex flex-col justify-between rounded-xl border border-border bg-card/65 p-6 transition-all duration-300 hover:shadow-md hover:bg-card"
              >
                <div>
                  <div className="mb-4 w-fit rounded-lg bg-primary/10 p-2.5 text-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display font-semibold text-base text-foreground mb-2">{cat.name}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{cat.description}</p>
                </div>
                <div className="mt-6 flex justify-end">
                  <span className="text-xs font-semibold text-foreground/80 group-hover:underline cursor-pointer">
                    Explore categories &rarr;
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
