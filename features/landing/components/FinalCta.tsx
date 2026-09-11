import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, MapPin, Sparkles } from "lucide-react";

export default function FinalCta() {
  return (
    <section className="relative overflow-hidden border-t border-border/70 bg-gradient-to-b from-background to-muted/20 py-12 sm:py-16 lg:py-20">
      {/* Subtle Background Ambience */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-80" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card p-6 sm:p-10 lg:p-12 shadow-sm">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
            {/* Left Content Column */}
            <div className="space-y-4 lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Ready for the road</span>
              </div>

              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground leading-[1.1]">
                Where are you going next?
              </h2>

              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-xl">
                Find the car that gets you there. Choose from our verified fleet of hatchbacks, sedans, and 4x4 SUVs in Ranchi with zero hidden charges and paperless KYC.
              </p>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center gap-y-2 gap-x-5 pt-1 text-xs font-medium text-foreground/85">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
                  <span>100% Verified Fleet</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-primary shrink-0" />
                  <span>Dual Pickup Hubs</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span>Instant 15-Min Hold</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link href="/cars">
                  <Button size="lg" className="h-11 sm:h-12 px-6 font-bold text-xs sm:text-sm shadow-md">
                    Explore cars
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/packages">
                  <Button variant="outline" size="lg" className="h-11 sm:h-12 px-5 font-semibold text-xs sm:text-sm border-border/80">
                    View Outstation Packages
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Vehicle Visual */}
            <div className="relative flex items-center justify-center lg:col-span-5">
              <div className="relative w-full max-w-md aspect-[16/10] overflow-hidden rounded-xl border border-border/80 shadow-md bg-gradient-to-br from-card to-muted/30 p-2 flex items-center justify-center">
                <div className="relative h-full w-full">
                  <Image
                    src="/cars/mahindra-scorpio-n.png"
                    alt="Tripzy Mahindra Scorpio-N Self Drive Ranchi"
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-contain object-center transition-transform duration-500 hover:scale-105"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

