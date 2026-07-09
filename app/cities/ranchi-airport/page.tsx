import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MapPin, Car } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RanchiAirportPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-6 py-12">
        <Link
          href="/cities"
          className="mb-6 inline-block text-xs text-muted-foreground hover:underline"
        >
          &larr; All Cities
        </Link>
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <MapPin className="h-7 w-7" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight">Ranchi Airport</h1>
            <p className="text-sm text-muted-foreground">
              Birsa Munda Airport (IXR) &mdash; 12 vehicles available
            </p>
          </div>
        </div>
        <div className="mb-8 rounded-xl border border-border bg-card/30 p-8">
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Pick up your self-drive rental directly at Birsa Munda Airport. We deliver vehicles to
            the arrivals area for a seamless start to your Jharkhand adventure. Popular routes
            include trips to Hundru Falls, Jonha Falls, and Netarhat hill station.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Link href="/cars?city=ranchi">
            <Button variant="default" className="w-full">
              <Car className="mr-2 h-4 w-4" /> Browse Ranchi Airport cars
            </Button>
          </Link>
          <Link href="/packages">
            <Button variant="outline" className="w-full">
              View packages
            </Button>
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
