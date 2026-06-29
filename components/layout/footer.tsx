import Link from "next/link";
import { Car, Facebook, Github, Instagram, Twitter } from "lucide-react";
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
                Tripzy
              </span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              Premium self-drive car rentals on-demand. Experience a seamless rental workflow
              modeled for modern mobility.
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
              <Link
                href={siteConfig.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground"
              >
                <Github className="h-5 w-5" />
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
                  href="/vehicles?category=luxury"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Luxury Fleet
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
              Top Cities
            </h3>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link
                  href="/cities/blr"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Bengaluru
                </Link>
              </li>
              <li>
                <Link
                  href="/cities/mum"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Mumbai
                </Link>
              </li>
              <li>
                <Link
                  href="/cities/pune"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Pune
                </Link>
              </li>
              <li>
                <Link
                  href="/cities/delhi"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Delhi NCR
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

        {/* Corporate Base Info block */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-xs text-muted-foreground md:flex-row">
          <div>
            &copy; {new Date().getFullYear()} {siteConfig.name} Inc. All rights reserved.
          </div>
          <div className="flex gap-4">
            <span>
              Corporate Office: {siteConfig.business.address.streetAddress},{" "}
              {siteConfig.business.address.addressLocality}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
