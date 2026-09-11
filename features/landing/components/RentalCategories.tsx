import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

const categories = [
  {
    name: "City Hatchbacks",
    categoryTag: "Agile & Efficient",
    subtitle: "Compact, easy to park, and ideal for daily city navigation in Ranchi.",
    models: "Swift, Baleno, Fronx",
    count: "From ₹1,800/day",
    image: "/cars/maruti-suzuki-swift.png",
    href: "/cars?category=hatchback",
  },
  {
    name: "Comfort Sedans",
    categoryTag: "Executive Travel",
    subtitle: "Plush legroom, smooth highway cruising, and executive comfort.",
    models: "Verna, Dzire, Glanza",
    count: "From ₹2,000/day",
    image: "/cars/hyundai-verna.png",
    href: "/cars?category=sedan",
  },
  {
    name: "Adventure & SUVs",
    categoryTag: "4x4 & 7-Seater",
    subtitle: "High ground clearance, 4x4 capability, and full family comfort.",
    models: "Thar 4x4, Safari, Scorpio-N",
    count: "From ₹4,500/day",
    image: "/cars/mahindra-thar-4x4.png",
    href: "/cars?category=suv",
  },
  {
    name: "Electric Vehicles",
    categoryTag: "Zero Emission",
    subtitle: "Whisper-quiet electric drive with minimal running cost in Ranchi.",
    models: "Tata Nexon EV",
    count: "From ₹3,200/day",
    image: "/cars/tata-nexon-ev.png",
    href: "/cars?category=ev",
  },
];

export default function RentalCategories() {
  return (
    <section className="border-t border-border/70 py-12 sm:py-16 lg:py-20 bg-card/25">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end border-b border-border/60 pb-5">
          <div className="space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Category Discovery
            </span>
            <h2 className="font-display text-3xl font-black tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Choose by category.
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
              Purpose-built vehicle classes tailored for city transit, weekend road trips, and rugged trails.
            </p>
          </div>
          <Link
            href="/cars"
            className="text-xs font-bold uppercase tracking-wider text-primary hover:underline flex items-center gap-1 self-start md:self-auto"
          >
            <span>View all categories</span>
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat, idx) => (
            <Link
              key={idx}
              href={cat.href}
              className="group flex flex-col justify-between rounded-xl border border-border/80 bg-card p-4 sm:p-5 transition-all duration-300 hover:border-primary/60 hover:shadow-md"
            >
              <div className="space-y-3">
                {/* Header row: Category tag & arrow icon */}
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                    {cat.categoryTag}
                  </span>
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted/60 text-muted-foreground transition-all group-hover:bg-primary group-hover:text-primary-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </div>
                </div>

                {/* Car Silhouette Accent */}
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg border border-border/50 bg-gradient-to-b from-muted/20 to-muted/5 flex items-center justify-center p-2">
                  <div className="relative h-full w-full">
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 25vw"
                      className="object-contain object-center transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                </div>

                {/* Category Titles */}
                <div className="space-y-0.5">
                  <h3 className="font-display text-base sm:text-lg font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed">
                    {cat.subtitle}
                  </p>
                </div>
              </div>

              {/* Card Footer: Models & Pricing */}
              <div className="pt-3 border-t border-border/60 mt-3 flex items-center justify-between text-xs">
                <span className="font-medium text-[11px] text-muted-foreground truncate max-w-[55%]">
                  {cat.models}
                </span>
                <span className="font-bold text-foreground">
                  {cat.count}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
