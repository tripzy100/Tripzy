"use client";

import { motion } from "framer-motion";
import {
  DollarSign,
  ShieldAlert,
  HeartHandshake,
  FileCheck,
  HelpCircle,
  HardDrive,
} from "lucide-react";

const reasons = [
  {
    icon: DollarSign,
    title: "Transparent Pricing",
    description:
      "Zero hidden fees. Tax invoices, security deposits, and clean kilometer charges declared clearly at checkout.",
  },
  {
    icon: HelpCircle,
    title: "24/7 Support",
    description:
      "Roadside assistance and direct agent chat lines are available around the clock to guide your trips.",
  },
  {
    icon: HardDrive,
    title: "Verified Vehicles",
    description:
      "Every listing undergoes safety telemetry audits and cleaning checklists prior to delivery.",
  },
  {
    icon: HeartHandshake,
    title: "Insurance Included",
    description:
      "Rent with absolute peace of mind. Full comprehensive insurance coverage is included standard.",
  },
  {
    icon: FileCheck,
    title: "Paperless KYC",
    description:
      "Submit digital DL credentials and identity verification scans for instant automated approval.",
  },
  {
    icon: ShieldAlert,
    title: "Secure Booking",
    description:
      "Advanced session rate limit protocols and gateway transactions keep card credentials safe.",
  },
];

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function WhyChooseUs() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-12 pt-10 lg:pb-16 lg:pt-12">
      <div className="mx-auto mb-16 max-w-3xl text-center">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Why Choose Tripzy Car Rental
        </span>
        <h2 className="text-gradient mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          What makes Tripzy Ranchi's best self drive car rental service
        </h2>
        <p className="mt-4 text-base text-muted-foreground">
          We combine verified vehicles, transparent pricing, and a fully digital booking experience to deliver
          the most trusted self drive car rental service in Ranchi, Jharkhand.
        </p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        {reasons.map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={idx}
              variants={cardVariants}
              className="rounded-xl border border-border bg-card/45 p-6 transition-shadow hover:shadow-md"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-foreground">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-base font-semibold text-foreground">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
