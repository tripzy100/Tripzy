import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const cities = [
  {
    name: "Ranchi",
    slug: "ranchi",
    description: "Capital of Jharkhand, gateway to waterfalls and hills",
    vehicles: 24,
  },
  {
    name: "Ranchi Airport",
    slug: "ranchi-airport",
    description: "Birsa Munda Airport pickup and drop-off point",
    vehicles: 12,
  },
];

export default function CitiesPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-6 py-12">
        <h1 className="mb-2 font-display text-3xl font-bold tracking-tight">Our Cities</h1>
        <p className="mb-10 max-w-lg text-sm text-muted-foreground">
          Pick up and drop off across multiple cities. Expanding to new locations every quarter.
        </p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cities.map((city) => (
            <Link
              key={city.slug}
              href={`/cities/${city.slug}`}
              className="group rounded-xl border border-border bg-card/40 p-6 transition-shadow hover:shadow-md"
            >
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-foreground transition-colors group-hover:text-primary">
                    {city.name}
                  </h3>
                  <span className="text-xs text-muted-foreground">{city.vehicles} vehicles</span>
                </div>
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">{city.description}</p>
            </Link>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/cars">
            <Button variant="outline">Browse all available cars</Button>
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
