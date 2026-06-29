"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Shield, Sparkles, MapPin, Zap } from "lucide-react";

interface MegaMenuProps {
  isOpen: boolean;
}

export function MegaMenu({ isOpen }: MegaMenuProps) {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.2 }}
      className="absolute left-0 top-full z-50 w-full border-b border-border bg-background/95 p-8 shadow-xl backdrop-blur-md"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-4 gap-8">
        {/* Vehicles Category */}
        <div className="space-y-4">
          <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Our Fleet
          </h4>
          <ul className="space-y-3">
            <li>
              <Link href="/vehicles?category=suv" className="group flex items-center gap-3 text-sm text-foreground/80 hover:text-foreground">
                <Shield className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                <div>
                  <div className="font-medium">Premium SUVs</div>
                  <div className="text-xs text-muted-foreground">All-terrain safety and space</div>
                </div>
              </Link>
            </li>
            <li>
              <Link href="/vehicles?category=luxury" className="group flex items-center gap-3 text-sm text-foreground/80 hover:text-foreground">
                <Sparkles className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                <div>
                  <div className="font-medium">Luxury Elite</div>
                  <div className="text-xs text-muted-foreground">Executive class comfort</div>
                </div>
              </Link>
            </li>
            <li>
              <Link href="/vehicles?category=ev" className="group flex items-center gap-3 text-sm text-foreground/80 hover:text-foreground">
                <Zap className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                <div>
                  <div className="font-medium">Electric Vehicles</div>
                  <div className="text-xs text-muted-foreground">Zero-emission power</div>
                </div>
              </Link>
            </li>
          </ul>
        </div>

        {/* Hot Destinations */}
        <div className="space-y-4">
          <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Destinations
          </h4>
          <ul className="space-y-3">
            <li>
              <Link href="/cities/blr" className="group flex items-center gap-2 text-sm text-foreground/80 hover:text-foreground">
                <MapPin className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                <span>Bengaluru (Silicon Valley)</span>
              </Link>
            </li>
            <li>
              <Link href="/cities/mum" className="group flex items-center gap-2 text-sm text-foreground/80 hover:text-foreground">
                <MapPin className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                <span>Mumbai (Financial Hub)</span>
              </Link>
            </li>
            <li>
              <Link href="/airports" className="group flex items-center gap-2 text-sm text-foreground/80 hover:text-foreground">
                <MapPin className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                <span>Airport Terminals delivery</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Dynamic packages card */}
        <div className="col-span-2 rounded-xl bg-muted/40 p-6 border border-border/50">
          <h4 className="font-display text-base font-bold text-foreground mb-2">
            Escape the ordinary
          </h4>
          <p className="text-sm text-muted-foreground mb-4 max-w-sm">
            Configure premium weekend packages, corporate pricing plans, and flexible monthly subscriptions.
          </p>
          <Link href="/packages" className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground hover:underline">
            Browse travel packages &rarr;
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
