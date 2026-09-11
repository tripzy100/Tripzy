import { Car, ShieldCheck, Phone, Star } from "lucide-react";

const trustItems = [
  { icon: Car, label: "Wide Range of Cars" },
  { icon: ShieldCheck, label: "Verified & Safe" },
  { icon: Phone, label: "24/7 Support" },
  { icon: Star, label: "Best Prices" },
];

export default function TrustStrip() {
  return (
    <section className="py-4 sm:py-6 bg-transparent" aria-label="Tripzy Value Guarantees">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center gap-3.5 sm:gap-8 lg:gap-14 text-xs sm:text-sm font-semibold text-muted-foreground">
          {trustItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="flex items-center gap-2 text-foreground/80 hover:text-foreground transition-colors justify-start sm:justify-center">
                <Icon className="h-4 w-4 sm:h-4.5 sm:w-4.5 stroke-[2] text-[#f59e0b] sm:text-foreground/70 shrink-0" />
                <span className="truncate">{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

