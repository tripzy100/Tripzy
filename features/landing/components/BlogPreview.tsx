"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";

const articles = [
  {
    title: "10 Scenic road trips from Bengaluru for a long weekend",
    category: "Travel Guides",
    readTime: "5 min read",
    slug: "scenic-road-trips-bengaluru",
  },
  {
    title: "Understanding EV range limits: Tips for roadtripping in electric vehicles",
    category: "Car Tips",
    readTime: "8 min read",
    slug: "understanding-ev-range-limits",
  },
  {
    title: "The complete checklist for a safe, paperless car rental checkout",
    category: "Rental Guides",
    readTime: "4 min read",
    slug: "safe-car-rental-checkout",
  },
];

export default function BlogPreview() {
  return (
    <section className="bg-card/20 border-t border-border py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-16">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">The Road Log</span>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl text-gradient">
              Latest from the travel blog.
            </h2>
          </div>
          <Link href="/blog" className="text-sm font-semibold hover:underline">
            Read all articles &rarr;
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-between rounded-xl border border-border bg-card/60 p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:bg-card"
            >
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="secondary">{item.category}</Badge>
                  <span className="text-xs text-muted-foreground">{item.readTime}</span>
                </div>
                <h3 className="font-display font-semibold text-base leading-snug text-foreground hover:text-muted-foreground">
                  <Link href={`/blog/${item.slug}`}>{item.title}</Link>
                </h3>
              </div>
              
              <div className="mt-6 pt-4 border-t border-border/50">
                <Link href={`/blog/${item.slug}`} className="text-xs font-bold uppercase tracking-wider text-foreground hover:underline">
                  Read Article &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
