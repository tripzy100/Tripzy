"use client";

import * as React from "react";
import { Plus, Minus } from "lucide-react";
import { faqItems } from "@/config/faq";

export default function Faqs() {
  const [openIdx, setOpenIdx] = React.useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className="mx-auto max-w-4xl px-6 py-12 lg:py-16">
      <div className="mx-auto mb-16 max-w-2xl text-center">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Self Drive Car Rental FAQs
        </span>
        <h2 className="text-gradient mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Frequently asked questions about car rental
        </h2>
      </div>

      <div className="space-y-4">
        {faqItems.map((item, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="overflow-hidden rounded-xl border border-border bg-card/30 transition-all duration-300"
            >
              {/* Accordion trigger button */}
              <button
                onClick={() => toggleFaq(idx)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between p-5 text-left font-display font-medium text-foreground hover:bg-card/75"
              >
                <span>{item.question}</span>
                {isOpen ? (
                  <Minus className="h-4 w-4 shrink-0" />
                ) : (
                  <Plus className="h-4 w-4 shrink-0" />
                )}
              </button>

              {/* Accordion collapse panel */}
              {isOpen && (
                <div className="border-t border-border/50 bg-muted/10 p-5 text-sm leading-relaxed text-muted-foreground">
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
