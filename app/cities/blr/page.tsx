import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MapPin, Car } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BengaluruPage() {
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
            <h1 className="font-display text-3xl font-bold tracking-tight">Bengaluru</h1>
            <p className="text-sm text-muted-foreground">Karnataka &mdash; 56 vehicles available</p>
          </div>
        </div>
        <div className="mb-8 rounded-xl border border-border bg-card/30 p-8">
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Navigate the Garden City with Tripzy. Perfect for tech professionals, weekend trips to
            Nandi Hills, Mysore, and Coorg. Pickup from Kempegowda International Airport, MG Road,
            and Electronic City.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Link href="/cars?city=blore">
            <Button variant="default" className="w-full">
              <Car className="mr-2 h-4 w-4" /> Browse Bengaluru cars
            </Button>
          </Link>
          <Link href="/packages">
            <Button variant="outline" className="w-full">
              View packages in Bengaluru
            </Button>
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
