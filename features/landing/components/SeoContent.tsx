"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

export default function SeoContent() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <section className="py-12 bg-card/10 border-t border-border/60" aria-label="About Tripzy Self Drive Car Rental">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full items-center justify-between py-2 text-left font-display text-sm font-bold text-foreground hover:text-primary transition-colors"
        >
          <span>About Tripzy Self Drive Car Rental in Ranchi</span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            {isOpen ? "Collapse information" : "Read full guide"}
            <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
          </span>
        </button>

        {isOpen && (
          <div className="pt-6 space-y-6 text-xs sm:text-sm leading-relaxed text-muted-foreground border-t border-border/40 mt-4">
            <p>
              Welcome to <strong className="text-foreground">Tripzy</strong>, Ranchi&apos;s homegrown{" "}
              <strong className="text-foreground">self drive car rental service</strong>. Whether you need a{" "}
              <Link href="/cars" className="font-semibold text-foreground underline decoration-primary/50 underline-offset-4 hover:text-primary">
                car rental near you
              </Link>{" "}
              for a weekend highway drive to Netarhat, a business trip across Jharkhand, or convenient local commuting,
              Tripzy Tours and Travels provides transparent, verified self-drive vehicles.
            </p>

            <div className="grid gap-6 sm:grid-cols-2 pt-2">
              <div className="space-y-2">
                <h3 className="font-display text-sm font-bold text-foreground">
                  Verified Cars & Transparent Terms
                </h3>
                <p>
                  Our fleet includes popular models like the Maruti Suzuki Swift, Hyundai Verna, Mahindra Thar 4x4,
                  Mahindra Scorpio N, Tata Safari, and Tata Nexon EV. Every car undergoes safety checks and sanitization
                  prior to pickup.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-display text-sm font-bold text-foreground">
                  Key Pickup Hubs in Ranchi
                </h3>
                <p>
                  Convenient handover points located at Birsa Munda Airport (IXR) and Lalpur Hub ensure quick access whether
                  you arrive by air or reside in Ranchi.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
