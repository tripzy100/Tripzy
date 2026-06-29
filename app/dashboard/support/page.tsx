"use client";

import * as React from "react";
import { LifeBuoy, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/providers/app-provider";

export default function SupportPage() {
  const { showToast } = useToast();
  const [loading, setLoading] = React.useState(false);
  const [subject, setSubject] = React.useState("");
  const [tickets, setTickets] = React.useState([
    { id: "t1", subject: "Refund query for Booking BK-902145", priority: "MEDIUM", status: "CLOSED", date: "2026-06-25" },
    { id: "t2", subject: "KYC verification pending document issue", priority: "HIGH", status: "OPEN", date: "2026-06-29" },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const newTicket = {
        id: "t" + (tickets.length + 1),
        subject,
        priority: "MEDIUM",
        status: "OPEN",
        date: new Date().toISOString().split("T")[0],
      };
      setTickets([newTicket, ...tickets]);
      setSubject("");
      showToast("Support ticket logged successfully", "success");
    }, 1000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-gradient">Support Helpdesk</h1>
        <p className="text-sm text-muted-foreground mt-2">
          File support queries, view responses timelines, and track resolution statuses.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Creation Box */}
        <div className="md:col-span-2 rounded-xl border border-border bg-card/30 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="font-display text-base font-bold text-foreground mb-6">Create Support Ticket</h3>
            <div>
              <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1">Subject Description</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Brief summary of query (e.g. DL upload failed)"
                required
                className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1">Detail Explanation</label>
              <textarea
                rows={4}
                placeholder="Explain the problem in detail to help our agent resolve it..."
                className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground focus:outline-none"
              />
            </div>
            <div className="flex justify-end pt-4 border-t border-border mt-6">
              <Button type="submit" isLoading={loading}>
                <Plus className="mr-1.5 h-4 w-4" /> Open Ticket
              </Button>
            </div>
          </form>
        </div>

        {/* Tickets History */}
        <div className="rounded-xl border border-border bg-card/30 p-6 space-y-6">
          <h3 className="font-display text-base font-bold text-foreground flex items-center gap-1.5">
            <LifeBuoy className="h-4 w-4" /> Active Tickets ({tickets.filter(t => t.status === "OPEN").length})
          </h3>

          <div className="space-y-4">
            {tickets.map((t) => (
              <div key={t.id} className="border-b border-border/50 pb-3 space-y-1.5">
                <div className="text-sm font-semibold text-foreground leading-snug">{t.subject}</div>
                <div className="flex items-center gap-2 text-[10px]">
                  <span className="font-mono text-muted-foreground">{t.date}</span>
                  <span className={`inline-flex rounded-full px-2 py-0.5 font-bold ${
                    t.status === "OPEN" ? "bg-amber-500/10 text-amber-500" : "bg-muted text-muted-foreground"
                  }`}>
                    {t.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
export type SupportPagePropsType = typeof SupportPage;
