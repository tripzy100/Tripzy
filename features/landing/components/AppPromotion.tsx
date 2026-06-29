"use client";

import { Smartphone, QrCode } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function AppPromotion() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20 lg:py-28">
      <div className="rounded-2xl bg-card border border-border overflow-hidden p-8 md:p-12 lg:p-16 flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Pitch text */}
        <div className="space-y-4 max-w-lg">
          <Badge variant="success">Available Now</Badge>
          <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Tripzy in your pocket.
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Download the Tripzy mobile app to unlock instant keyless locks, dynamic IoT route telemetry, and custom loyalty rewards balances.
          </p>
          <div className="flex gap-4 pt-4">
            <div className="flex h-10 w-28 items-center justify-center rounded-lg bg-black text-white text-xs font-semibold border border-white/10 hover:bg-black/80 cursor-pointer">
              App Store
            </div>
            <div className="flex h-10 w-28 items-center justify-center rounded-lg bg-black text-white text-xs font-semibold border border-white/10 hover:bg-black/80 cursor-pointer">
              Google Play
            </div>
          </div>
        </div>

        {/* Mock App Visual */}
        <div className="flex items-center gap-6 rounded-xl border border-border bg-card/60 p-6 shadow-sm">
          <div className="flex h-24 w-24 items-center justify-center rounded-lg bg-muted text-muted-foreground ring-4 ring-muted/10">
            <QrCode className="h-16 w-16" />
          </div>
          <div className="space-y-1 text-sm">
            <span className="font-semibold text-foreground flex items-center gap-1">
              <Smartphone className="h-4 w-4" /> Scan QR to Download
            </span>
            <p className="text-xs text-muted-foreground max-w-[160px]">
              Available standard on iOS and Android devices.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
