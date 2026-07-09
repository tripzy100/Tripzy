"use client";

import { motion } from "framer-motion";

const stats = [
  { label: "Self drive trips completed", value: "500+" },
  { label: "Cars available for rent", value: "20+" },
  { label: "Customer satisfaction rate", value: "99.8%" },
];

export default function Statistics() {
  return (
    <section className="border-y border-border bg-card/25 py-10 lg:py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-8 text-center sm:grid-cols-3">
          {stats.map((st, idx) => (
            <div key={idx} className="space-y-2">
              <h3 className="font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
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
