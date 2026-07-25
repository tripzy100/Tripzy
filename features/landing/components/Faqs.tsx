"use client";

import * as React from "react";
import { Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { faqItems } from "@/config/faq";

export default function Faqs() {
  const [openIdx, setOpenIdx] = React.useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faqs" className="mx-auto w-full max-w-4xl px-6 py-12 lg:py-16">
      <div className="mx-auto mb-16 max-w-2xl text-center">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Self Drive Car Rental FAQs
        </span>
        <h2 className="text-gradient mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Frequently asked questions about car rental
        </h2>
      </div>

      <div className="w-full space-y-4">
        {faqItems.map((item, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="w-full overflow-hidden rounded-xl border border-border bg-card/30"
            >
              {/* Accordion trigger button */}
              <button
                onClick={() => toggleFaq(idx)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between p-5 text-left font-display font-medium text-foreground hover:bg-card/75 transition-colors duration-200"
              >
                <span className="pr-4">{item.question}</span>
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted/50 text-muted-foreground transition-colors hover:text-foreground">
                  {isOpen ? (
                    <Minus className="h-4 w-4" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                </span>
              </button>

              {/* Accordion collapse panel with Framer Motion for smooth height animation */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-border/50 bg-muted/10 p-5 text-sm leading-relaxed text-muted-foreground">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}


