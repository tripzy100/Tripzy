"use client";

import { motion } from "framer-motion";
import { ArrowRight, Star, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="relative flex min-h-[85vh] w-full flex-col items-center justify-center overflow-hidden px-6 pt-16 pb-36 text-center">
      {/* Visual Ambient Background Gradient */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]" />
      
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
          <span>Rated 4.9/5 by 500+ users</span>
        </motion.div>

        {/* Dynamic Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-8 font-display text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl text-gradient"
        >
          Drive the vehicle <br />
          that matches your story.
        </motion.h1>

        {/* Supporting description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg md:text-xl"
        >
          Premium self-drive car rentals with paperless KYC, verified vehicle statuses, 
          fully inclusive insurance policies, and absolute pricing transparency.
        </motion.p>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 flex flex-col gap-4 sm:flex-row"
        >
          <Button size="lg" className="group">
            Reserve Fleet
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
          <Button variant="outline" size="lg">Explore Subscriptions</Button>
        </motion.div>
      </div>
    </section>
  );
}
