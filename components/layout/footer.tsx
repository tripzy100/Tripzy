import Link from "next/link";
import { Car, ShieldCheck, MapPin, Phone, MessageCircle } from "lucide-react";
import { siteConfig } from "@/config/site";

export function Footer() {
  return (
    <footer className="border-t border-border/80 bg-card py-10 lg:py-14 text-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 min-[380px]:grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand Info Column */}
          <div className="col-span-1 min-[380px]:col-span-2 space-y-3.5">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs">
                <Car className="h-4 w-4 stroke-[2.2]" />
              </div>
              <div className="flex flex-col">
                <span className="font-display text-base sm:text-lg font-black tracking-wider text-foreground leading-none">
                  TRIPZY
                </span>
                <span className="text-[9px] font-bold uppercase tracking-widest text-primary leading-none mt-0.5">
                  Tours & Travels
                </span>
              </div>
            </Link>
            <p className="max-w-sm text-xs leading-relaxed text-muted-foreground">
              Tripzy Tours and Travels — Premium self-drive car rental platform in Ranchi, Jharkhand.
              Verified fleet with 15-minute booking hold, paperless KYC, and transparent pricing.
            </p>
            <div className="flex items-center gap-2 pt-0.5 text-xs font-semibold text-foreground/80">
              <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
              <span>Lalpur Hub & Birsa Munda Airport, Ranchi</span>
            </div>
          </div>

          {/* Fleet & Services */}
          <div>
            <h3 className="font-display text-xs font-bold uppercase tracking-wider text-foreground">
              Fleet & Services
            </h3>
            <ul className="mt-3 space-y-2.5 text-xs text-muted-foreground font-medium">
              <li>
                <Link href="/cars" className="hover:text-primary transition-colors">
                  All Cars
                </Link>
              </li>
              <li>
                <Link href="/cities" className="hover:text-primary transition-colors">
                  Pickup Locations
                </Link>
              </li>
              <li>
                <Link href="/packages" className="hover:text-primary transition-colors">
                  Trips & Rates
                </Link>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-primary transition-colors">
                  How It Works
                </a>
              </li>
            </ul>
          </div>

          {/* Support & Contact */}
          <div>
            <h3 className="font-display text-xs font-bold uppercase tracking-wider text-foreground">
              Support & Contact
            </h3>
            <ul className="mt-3 space-y-2.5 text-xs text-muted-foreground font-medium">
              <li>
                <Link href="/support" className="hover:text-primary transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <a
                  href={siteConfig.contact.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-primary transition-colors"
                >
                  <MessageCircle className="h-3.5 w-3.5 text-[#25D366]" />
                  <span>WhatsApp Help</span>
                </a>
              </li>
              <li>
                <a
                  href={`tel:${siteConfig.contact.phoneRaw}`}
                  className="inline-flex items-center gap-1.5 hover:text-primary transition-colors"
                >
                  <Phone className="h-3.5 w-3.5 text-primary" />
                  <span>{siteConfig.contact.phone}</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Policies & Legal */}
          <div>
            <h3 className="font-display text-xs font-bold uppercase tracking-wider text-foreground">
              Policies & Legal
            </h3>
            <ul className="mt-3 space-y-2.5 text-xs text-muted-foreground font-medium">
              <li>
                <Link href="/terms" className="hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/cancellation" className="hover:text-primary transition-colors">
                  Cancellation Policy
                </Link>
              </li>
              <li>
                <Link href="/security" className="hover:text-primary transition-colors">
                  Security Standards
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border/60 pt-6 pb-16 lg:pb-0 text-xs text-muted-foreground md:flex-row">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
            <span>&copy; {new Date().getFullYear()} {siteConfig.name} Inc. All rights reserved.</span>
          </div>
          <div>
            Ranchi Self Drive Car Rental &bull; Jharkhand
          </div>
        </div>
      </div>
    </footer>
  );
}
