"use client";

import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section
      className="relative flex min-h-[80vh] w-full flex-col items-center justify-center overflow-hidden px-6 pb-20 pt-16 text-center"
      aria-label="Tripzy Self Drive Car Rental Hero"
    >
      {/* Animated Car Background Image */}
      <motion.div
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute inset-0 -z-20"
      >
        <motion.div
          animate={{
            x: [0, 8, 0, -8, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070&auto=format&fit=crop')",
          }}
        />
      </motion.div>

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background/60 via-background/40 to-background" />

      {/* Foreground Content */}
      <div className="mx-auto flex max-w-4xl flex-col items-center">
        {/* Trusted rating flag */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-500"
        >
          <Star className="h-3.5 w-3.5 fill-current" />
          <span>Rated 4.9/5 by 500+ customers in Ranchi</span>
        </motion.div>

        {/* Dynamic Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-gradient mt-8 font-display text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl"
        >
          Self Drive Car Rental <br />
          Company in Ranchi
        </motion.h1>

        {/* Supporting description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg md:text-xl"
        >
          Tripzy offers premium self drive car rental services in Ranchi with paperless KYC,
          fully inclusive insurance, verified vehicles, and transparent pricing. Your trusted
          car rental near you.
        </motion.p>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 flex flex-col gap-4 sm:flex-row"
        >
          <Link href="/cars">
            <Button size="lg" className="group">
              Browse Cars
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link href="/packages">
            <Button variant="outline" size="lg">
              View Rental Packages
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
