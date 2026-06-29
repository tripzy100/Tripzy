"use client";

import { Star, ShieldCheck } from "lucide-react";

const feedbacks = [
  {
    name: "Amit Sharma",
    role: "Business Consultant",
    comment: "The Tesla Model S was immaculate. Automated paperless KYC DL check took less than 2 minutes. Easiest self drive checkout I have ever done.",
    rating: 5,
  },
  {
    name: "Priya Nair",
    role: "Software Architect",
    comment: "Excellent transparent pricing. No sudden add-ons or cleaning charge debits at dropoff. Support coordinates were helpful on my airport delivery.",
    rating: 5,
  },
  {
    name: "Rohan Verma",
    role: "Travel Vlogger",
    comment: "Booked a Q8 SUV for a weekend roadtrip to Lonavala. Car telemetry OBD details were fully updated. Absolutely loved the drive.",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20 lg:py-28">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">User Reviews</span>
        <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl text-gradient">
          What our driver community says.
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {feedbacks.map((item, idx) => (
          <div
            key={idx}
            className="flex flex-col justify-between rounded-xl border border-border bg-card/30 p-6"
          >
            <div>
              {/* Stars */}
              <div className="flex gap-1 text-amber-500 mb-4">
                {[...Array(item.rating)].map((_, starIdx) => (
                  <Star key={starIdx} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed italic">
                "{item.comment}"
              </p>
            </div>

            {/* Author */}
            <div className="mt-6 flex items-center gap-3 border-t border-border/50 pt-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted font-display font-semibold text-foreground text-sm">
                {item.name[0]}
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                  <span>{item.name}</span>
                  <ShieldCheck className="h-4 w-4 text-emerald-500" aria-label="Verified Customer" />
                </div>
                <div className="text-xs text-muted-foreground">{item.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
