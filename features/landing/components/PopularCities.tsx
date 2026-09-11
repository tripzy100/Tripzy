"use client";

import { MapPin, Navigation, Compass, Phone, Star, ShieldCheck, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

const hubsList = [
  {
    name: "Lalpur Main Hub",
    address: "Rebloon Implex, near Maruti Clinic, Bargaon, Basudeb Nagar, Lalpur, Ranchi 834001",
    tag: "Central Hub",
    timing: "Open 6:00 AM - 11:00 PM",
    features: ["Instant Vehicle Handover", "Verified KYC Desk", "Secure Parking"],
  },
  {
    name: "Birsa Munda Airport (IXR)",
    address: "Terminal 1 Arrival Gate / Dedicated Airport Parking, Hinoo, Ranchi",
    tag: "Airport Express",
    timing: "24/7 Flight Delivery",
    features: ["Flight Delayed Protection", "Curbside Handover", "Luggage Assistance"],
  },
];

export default function PopularCities() {
  return (
    <section id="locations" className="relative border-t border-border/70 bg-gradient-to-b from-background via-muted/10 to-background py-14 sm:py-18 lg:py-22">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-10 sm:mb-14 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <MapPin className="h-3.5 w-3.5" />
              <span>Ranchi Hubs & Google Maps</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-foreground">
              Pickup & Drop Locations in Ranchi
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
              Convenient pickup hubs at Lalpur and Birsa Munda Airport with instant doorstep delivery across Ranchi.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold text-xs py-1 px-3 gap-1.5">
              <Star className="h-3.5 w-3.5 fill-current text-amber-500" />
              <span>4.9 / 5 Rated in Ranchi</span>
            </Badge>
          </div>
        </div>

        {/* Hub Cards Grid */}
        <div className="grid gap-5 md:grid-cols-2">
          {hubsList.map((hub, idx) => (
            <div
              key={idx}
              className="group rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs transition-all duration-300 hover:border-primary/40 hover:shadow-md"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-border/60 pb-3.5 mb-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <MapPin className="h-4.5 w-4.5 stroke-[2]" />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-bold text-foreground leading-tight">{hub.name}</h3>
                    <span className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Clock className="h-3 w-3" /> {hub.timing}
                    </span>
                  </div>
                </div>
                <Badge variant="secondary" className="text-[11px] font-semibold">
                  {hub.tag}
                </Badge>
              </div>

              {/* Address */}
              <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                {hub.address}
              </p>

              {/* Features Pill */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {hub.features.map((feat, fIdx) => (
                  <span
                    key={fIdx}
                    className="inline-flex items-center gap-1 rounded-lg border border-border/60 bg-muted/50 px-2.5 py-1 text-[11px] font-medium text-foreground/80"
                  >
                    <ShieldCheck className="h-3 w-3 text-primary shrink-0" />
                    {feat}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Google Maps Embed Container */}
        <div className="mt-8 overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3662.063236270557!2d85.34529821496924!3d23.367644284594247!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f4e1e545109e3d%3A0xa1c5cc6959e096a9!2sTripzy%20Tours%20and%20Travels!5e0!3m2!1sen!2sin!4v1710000000000!5m2!1sen!2sin"
            width="100%"
            height="420"
            className="w-full h-[360px] sm:h-[420px] lg:h-[460px] border-0"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Tripzy Tours and Travels - Ranchi Location Google Maps"
          />
        </div>

        {/* Assistance & Direct Support Card */}
        <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-2xl border border-border/80 bg-card p-5 sm:p-6 text-center sm:flex-row sm:text-left shadow-xs">
          <div className="space-y-1">
            <h3 className="font-display text-sm sm:text-base font-bold text-foreground">
              Need assistance with your self drive booking?
            </h3>
            <p className="text-xs text-muted-foreground">
              Speak directly with our Ranchi support desk for instant vehicle queries and doorstep delivery.
            </p>
          </div>
          <a
            href={`tel:${siteConfig.contact.phoneRaw}`}
            aria-label={`Call Tripzy: ${siteConfig.contact.phone}`}
            className="w-full sm:w-auto shrink-0"
          >
            <Button
              size="lg"
              className="w-full sm:w-auto h-11 px-6 font-bold text-xs sm:text-sm bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs gap-2 rounded-xl"
            >
              <Phone className="h-4 w-4 stroke-[2.2]" />
              <span>Call Now: {siteConfig.contact.phone}</span>
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
