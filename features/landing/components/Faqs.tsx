"use client";

import * as React from "react";
import { Plus, Minus } from "lucide-react";
import { faqItems } from "@/config/faq";

export default function Faqs() {
  const [openIdx, setOpenIdx] = React.useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faqs" className="py-12 sm:py-16 lg:py-20 bg-card/20">
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 space-y-1.5 border-b border-border/60 pb-5">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            Questions & Answers
          </span>
          <h2 className="font-display text-3xl font-black tracking-tight text-foreground sm:text-4xl">
            Frequently asked questions.
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
            Everything you need to know about self-drive car rentals in Ranchi.
          </p>
        </div>

        {/* Clean Editorial Accordion List */}
        <div className="divide-y divide-border/70 border-y border-border/70">
          {faqItems.slice(0, 6).map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div key={idx} className="py-4 transition-colors">
                <button
                  onClick={() => toggleFaq(idx)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between text-left font-display text-sm sm:text-base font-bold text-foreground transition-colors hover:text-primary"
                >
                  <span className="pr-4">{item.question}</span>
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border bg-background text-muted-foreground">
                    {isOpen ? <Minus className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
                  </span>
                </button>

                {isOpen && (
                  <div className="pt-2.5 text-xs sm:text-sm leading-relaxed text-muted-foreground max-w-3xl">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
