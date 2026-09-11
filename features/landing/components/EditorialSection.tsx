import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Compass, MapPin, Shield, ArrowRight } from "lucide-react";

export default function EditorialSection() {
  return (
    <section className="relative overflow-hidden border-t border-border/80 bg-gradient-to-b from-card/40 via-muted/20 to-card/40 py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
          {/* Left Editorial Copy (7 cols) */}
          <div className="space-y-4 lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
              <span>Road Trip Experience</span>
            </div>

            <h2 className="font-display text-3xl font-black tracking-tight text-foreground sm:text-4xl lg:text-5xl leading-[1.08]">
              Made for the road.
            </h2>

            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-2xl">
              Whether it&apos;s a weekend drive down Patratu Valley hairpin bends, an escape to Netarhat hills, or executive city transit in Ranchi, drive a self-drive car that commands every kilometer.
            </p>

            {/* Travel Highlights Grid */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 pt-3 border-t border-border/60">
              <div className="space-y-1.5 rounded-xl border border-border/70 bg-card/80 p-3.5 shadow-2xs">
                <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Compass className="h-3.5 w-3.5 stroke-[2.2]" />
                  </div>
                  <span>Unlimited Freedom</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Self-drive flexibility across Jharkhand and inter-state travel.
                </p>
              </div>

              <div className="space-y-1.5 rounded-xl border border-border/70 bg-card/80 p-3.5 shadow-2xs">
                <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <MapPin className="h-3.5 w-3.5 stroke-[2.2]" />
                  </div>
                  <span>Verified Hubs</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Fast handover at Birsa Munda Airport & Lalpur Hub station.
                </p>
              </div>

              <div className="space-y-1.5 rounded-xl border border-border/70 bg-card/80 p-3.5 shadow-2xs">
                <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Shield className="h-3.5 w-3.5 stroke-[2.2]" />
                  </div>
                  <span>Total Protection</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Standard comprehensive insurance and 24/7 on-road support.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <Link href="/cars">
                <Button size="lg" className="h-11 sm:h-12 px-6 font-bold text-xs sm:text-sm shadow-md transition-transform active:scale-95">
                  Explore available cars
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Travel Photo Presentation (5 cols) */}
          <div className="lg:col-span-5">
            <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-gradient-to-br from-card via-card to-muted/40 aspect-[16/11] shadow-lg flex items-center justify-center p-3">
              <div className="relative h-full w-full">
                <Image
                  src="/cars/mahindra-thar-roxx.png"
                  alt="Tripzy Travel Journey Ranchi Patratu Netarhat"
                  fill
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-contain object-center transition-transform duration-700 hover:scale-105"
                />
              </div>

              {/* Bottom Caption Overlay */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-card/95 via-card/85 to-transparent p-3 sm:p-4 pt-6 flex flex-col min-[380px]:flex-row min-[380px]:items-center justify-between gap-2 border-t border-border/30">
                <div>
                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest block">
                    Ranchi &bull; Patratu &bull; Netarhat
                  </span>
                  <p className="text-xs font-bold text-foreground">
                    Ready for your next highway journey?
                  </p>
                </div>
                <Link href="/cars" className="shrink-0 self-start min-[380px]:self-auto">
                  <Button size="sm" variant="outline" className="text-xs font-bold h-7.5 px-3">
                    Book Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
