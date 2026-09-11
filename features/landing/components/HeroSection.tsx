"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, Clock, MapPin } from "lucide-react";

export default function HeroSection() {
  const scrollToSearch = () => {
    const searchEl = document.getElementById("search-widget");
    if (searchEl) {
      searchEl.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <section
      className="relative w-full overflow-hidden pt-4 pb-12 sm:pt-6 sm:pb-16 lg:pt-8 lg:pb-20"
      aria-label="Tripzy Self Drive Car Rental Hero"
    >
      {/* ───────────────────────────────────────────────────────────
          LAYER 1: CINEMATIC AIRPORT SUNSET WITH WHITE HYUNDAI VERNA (All Screen Sizes)
      ──────────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 z-0 overflow-hidden select-none pointer-events-none">
        <Image
          src="/hero/hero-verna-white-banner.jpg"
          alt="Tripzy White Hyundai Verna Self-Drive Car Rental Ranchi Airport"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[70%_center] sm:object-[75%_center] lg:object-[center_center] brightness-[0.98] contrast-[1.02]"
        />

        {/* Atmospheric Gradient Fade */}
        <div className="absolute inset-y-0 left-0 w-full sm:w-[62%] lg:w-[48%] bg-gradient-to-r from-background via-background/95 sm:via-background/80 to-transparent z-10" />
        
        {/* Bottom soft fade for natural search console transition */}
        <div className="absolute inset-x-0 bottom-0 h-24 sm:h-32 bg-gradient-to-t from-background via-background/40 to-transparent z-10" />
        
        {/* Top subtle fade */}
        <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-background/30 to-transparent z-10" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-12 lg:items-center min-h-[380px] sm:min-h-[420px] lg:min-h-[460px]">
          
          {/* ───────────────────────────────────────────────────────────
              LAYER 2: EDITORIAL BRAND MESSAGING & CTAs (Left 5-6 Cols)
          ──────────────────────────────────────────────────────────── */}
          <div className="space-y-3 sm:space-y-4 lg:col-span-6 xl:col-span-5 max-w-2xl pb-2 lg:pb-4">
            {/* Location & Trust Eyebrow Badge */}
            <div className="inline-flex max-w-full items-center gap-1.5 sm:gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-3.5 py-1 text-[11px] sm:text-xs font-bold text-amber-600 dark:text-amber-400 shadow-2xs backdrop-blur-md">
              <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
              <span className="truncate">Best Self Drive Car Rental Company in Ranchi</span>
            </div>

            {/* Main Headline: "Your drive. Your way." with fluid typography */}
            <h1 
              className="font-display font-black tracking-tight text-slate-900 dark:text-white leading-[1.04]"
              style={{ fontSize: "clamp(2.1rem, 1.4rem + 3.4vw, 4.6rem)" }}
            >
              Your drive. <br />
              <span className="text-[#f59e0b]">
                Your way.
              </span>
            </h1>

            {/* Subtitle Description */}
            <p className="text-xs sm:text-sm lg:text-base text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed font-medium">
              Tripzy offers Best and Premium Self Drive Car Rental Services in Ranchi with paperless KYC, fully inclusive insurance, verified vehicles, and transparent pricing. Your trusted car rental near you.
            </p>

            {/* Primary & Secondary Action Buttons */}
            <div className="flex flex-row items-stretch sm:items-center gap-2.5 pt-1">
              <Button
                size="lg"
                onClick={scrollToSearch}
                className="flex-1 sm:flex-initial h-11 sm:h-12 px-4 sm:px-7 font-bold text-xs sm:text-sm bg-[#f59e0b] hover:bg-[#d97706] text-white shadow-md transition-all active:scale-95 rounded-xl gap-1.5 sm:gap-2 whitespace-nowrap cursor-pointer justify-center"
              >
                Find your car
                <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </Button>

              <Link href="/cars" className="flex-1 sm:flex-initial">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full h-11 sm:h-12 px-3.5 sm:px-6 font-bold text-xs sm:text-sm bg-card/90 border-border hover:border-primary/50 hover:bg-card rounded-xl backdrop-blur-xs shadow-2xs justify-center"
                >
                  Explore the fleet
                </Button>
              </Link>
            </div>

            {/* Feature Value Checkpoints */}
            <div className="pt-2.5 border-t border-border/60 flex items-center justify-between gap-1 text-[11px] sm:text-xs font-semibold text-slate-700 dark:text-slate-200">
              <div className="flex items-center gap-1 sm:gap-1.5">
                <div className="flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full border border-amber-500/50 bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold text-[9px] sm:text-[11px] shrink-0">
                  ₹
                </div>
                <span className="truncate">Zero Hidden Charges</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-1.5">
                <div className="flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full border border-amber-500/50 bg-amber-500/15 text-amber-600 dark:text-amber-400 shrink-0">
                  <Clock className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-amber-600 dark:text-amber-400 stroke-[2.5]" />
                </div>
                <span className="truncate">15-Min Hold</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-1.5">
                <div className="flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full border border-amber-500/50 bg-amber-500/15 text-amber-600 dark:text-amber-400 shrink-0">
                  <MapPin className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-amber-600 dark:text-amber-400 stroke-[2.5]" />
                </div>
                <span className="truncate">Ranchi</span>
              </div>
            </div>
          </div>

          {/* Right Spacer Column for Desktop */}
          <div className="hidden lg:block lg:col-span-6 xl:col-span-7 h-full min-h-[460px] pointer-events-none select-none" />

        </div>
      </div>
    </section>
  );
}
