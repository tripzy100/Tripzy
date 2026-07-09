import Link from "next/link";
import { Car, Facebook, Instagram, Twitter } from "lucide-react";
import { siteConfig } from "@/config/site";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/30">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand Info Column */}
          <div className="col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Car className="h-6 w-6 text-foreground" />
              <span className="font-display text-xl font-bold tracking-tight text-foreground">
                TRIPZY
              </span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              Tripzy Tours and Travels — Ranchi&apos;s leading self drive car rental company. Rent verified
              cars with transparent pricing, inclusive insurance, and 24/7 support.
            </p>
            <div className="flex gap-4 pt-2">
              <Link
                href="https://twitter.com"
                className="text-muted-foreground hover:text-foreground"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link
                href="https://instagram.com"
                className="text-muted-foreground hover:text-foreground"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                href="https://facebook.com"
                className="text-muted-foreground hover:text-foreground"
              >
                <Facebook className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Catalog Columns */}
          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground">
              Services
            </h3>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link
                  href="/vehicles?category=suv"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  SUV Rentals
                </Link>
              </li>
              <li>
                <Link
                  href="/vehicles?category=ev"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  EV Rentals
                </Link>
              </li>
              <li>
                <Link
                  href="/packages"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Monthly Subscriptions
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground">
              Our City
            </h3>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link
                  href="/cities/ranchi"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Ranchi
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground">
              Legal
            </h3>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/cancellation"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Refund & Cancellation
                </Link>
              </li>
              <li>
                <Link
                  href="/security"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Security Standards
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-xs text-muted-foreground md:flex-row">
          <div>
            &copy; {new Date().getFullYear()} {siteConfig.name} Inc. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
