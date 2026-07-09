"use client";

import { Star, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const feedbacks = [
  {
    name: "Amit Kumar",
    role: "Business Owner, Ranchi",
    comment:
      "Rented a Hyundai Verna from Tripzy for a client meeting in Jamshedpur. The car was spotless, KYC took just 2 minutes, and the pricing was exactly what was shown — no hidden charges. Best self drive car rental in Ranchi!",
    rating: 5,
  },
  {
    name: "Sneha Gupta",
    role: "College Student, Ranchi",
    comment:
      "Booked a Maruti Swift for a weekend trip to Hundru Falls with friends. Pickup from Birsa Munda Airport was super smooth. The car was well-maintained and fuel-efficient. Will definitely use Tripzy again!",
    rating: 5,
  },
  {
    name: "Rahul Sinha",
    role: "Travel Enthusiast, Dhanbad",
    comment:
      "Took a Mahindra Thar from Tripzy for a Netarhat and Patratu Valley road trip. The SUV handled the hill roads perfectly. 24/7 support gave us total peace of mind throughout. Highly recommend Tripzy Ranchi!",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-12 lg:py-16">
      <div className="mx-auto mb-16 max-w-3xl text-center">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Customer Reviews
        </span>
        <h2 className="text-gradient mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          What our customers say about Tripzy car rental
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {feedbacks.map((item, idx) => (
          <div
            key={idx}
            className="flex flex-col justify-between rounded-xl border border-border bg-card/30 p-6"
          >
            <div>
              {/* Stars */}
              <div className="mb-4 flex gap-1 text-amber-500">
                {[...Array(item.rating)].map((_, starIdx) => (
                  <Star key={starIdx} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="text-sm italic leading-relaxed text-muted-foreground">
                "{item.comment}"
              </p>
            </div>

            {/* Author */}
            <div className="mt-6 flex items-center gap-3 border-t border-border/50 pt-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted font-display text-sm font-semibold text-foreground">
                {item.name[0]}
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                  <span>{item.name}</span>
                  <ShieldCheck
                    className="h-4 w-4 text-emerald-500"
                    aria-label="Verified Customer"
                  />
                </div>
                <div className="text-xs text-muted-foreground">{item.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Review us on Google block */}
      <div className="mt-12 flex flex-col items-center justify-center text-center">
        <p className="text-sm text-muted-foreground mb-4">
          Loved our Ranchi self drive car service? Share your review on Google.
        </p>
        <a
          href="https://www.google.com/maps/place/Tripzy+Tours+and+Travels/@23.3676623,85.3474608,17.75z/data=!4m8!3m7!1s0x39f4e1e545109e3d:0xa1c5cc6959e096a9!8m2!3d23.3676443!4d85.3474869!9m1!1b1!16s%2Fg%2F11zfs185qk"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="outline" className="gap-2 border-primary/30 hover:border-primary">
            <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.555 0-6.435-2.88-6.435-6.435s2.88-6.435 6.435-6.435c1.637 0 3.136.608 4.29 1.625l3.207-3.208C19.294 2.147 15.932 1 12.24 1 6.033 1 1 6.033 1 12.24s4.981 11.24 11.24 11.24c6.48 0 11.24-4.56 11.24-11.24 0-.765-.082-1.507-.2-2.24H12.24z"/>
            </svg>
            Review us on Google
          </Button>
        </a>
      </div>
    </section>
  );
}
