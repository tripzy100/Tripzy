"use client";

import { motion } from "framer-motion";

const stats = [
  { label: "Bookings completed", value: "250,000+" },
  { label: "Cities served", value: "18+" },
  { label: "Fleet Vehicles", value: "1,500+" },
  { label: "Customer satisfaction", value: "99.8%" },
];

export default function Statistics() {
  return (
    <section className="bg-card/25 border-y border-border py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 text-center">
          {stats.map((st, idx) => (
            <div key={idx} className="space-y-2">
              <h3 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl text-foreground">
                {st.value}
              </h3>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {st.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
