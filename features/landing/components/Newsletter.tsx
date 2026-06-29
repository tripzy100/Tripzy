"use client";

import * as React from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/providers/app-provider";

export default function Newsletter() {
  const { showToast } = useToast();
  const [email, setEmail] = React.useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    showToast(`Successfully subscribed: ${email}`, "success");
    setEmail("");
  };

  return (
    <section className="border-t border-border bg-card/25 py-20 lg:py-24">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <h2 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Get mileage bonuses & weekly updates
        </h2>
        <p className="mt-3 text-sm text-muted-foreground max-w-md mx-auto">
          Subscribe to our travel catalog and receive immediate notices on premium dynamic pricing drops and new fleet allocations.
        </p>

        <form onSubmit={handleSubscribe} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter corporate or personal email"
            required
            className="flex-1 rounded-lg border border-input bg-card px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <Button type="submit">
            Subscribe <Send className="ml-2 h-3.5 w-3.5" />
          </Button>
        </form>
        
        <p className="mt-3 text-[10px] text-muted-foreground">
          We protect your privacy. Read our corporate terms. Unsubscribe at any time.
        </p>
      </div>
    </section>
  );
}
