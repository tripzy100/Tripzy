"use client";

import * as React from "react";
import { Check, X, BadgeCent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/providers/app-provider";

export default function AdminApprovalsPage() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = React.useState<"REFUNDS" | "POLICIES">("REFUNDS");
  const [refunds, setRefunds] = React.useState([
    { id: "r1", user: "rahul@example.com", amount: 15400, reason: "Monsoon trip cancel safety rules" },
  ]);
  const [policies, setPolicies] = React.useState([
    { id: "p1", action: "Waive clean fee", user: "sneha@example.com", reason: "Loyalty Gold customer request" },
  ]);

  const handleResolveRefund = (id: string, approve: boolean) => {
    setRefunds((prev) => prev.filter((r) => r.id !== id));
    showToast(approve ? "Refund override approved" : "Refund override denied", "success");
  };

  const handleResolvePolicy = (id: string, approve: boolean) => {
    setPolicies((prev) => prev.filter((p) => p.id !== id));
    showToast(approve ? "Policy exception approved" : "Policy exception denied", "success");
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-gradient">Sensitive Action Approvals</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Review high-value refunds and policy exception overrides requesting dual-authorization clearance.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border pb-px">
        <button
          onClick={() => setActiveTab("REFUNDS")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "REFUNDS" ? "border-primary text-foreground font-bold" : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          High-Value Refunds ({refunds.length})
        </button>
        <button
          onClick={() => setActiveTab("POLICIES")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "POLICIES" ? "border-primary text-foreground font-bold" : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Policy Exceptions ({policies.length})
        </button>
      </div>

      {/* Content queue */}
      <div className="grid gap-6 md:grid-cols-2">
        {activeTab === "REFUNDS" &&
          refunds.map((r) => (
            <div key={r.id} className="rounded-xl border border-border bg-card/30 p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-display font-semibold text-foreground text-sm flex items-center gap-1">
                    <BadgeCent className="h-4.5 w-4.5 text-primary" /> Refund Request
                  </h4>
                  <span className="text-xs text-muted-foreground">{r.user}</span>
                </div>
                <span className="text-sm font-bold text-foreground">&#8377;{r.amount}</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Reason: {r.reason}
              </p>
              <div className="flex gap-2 justify-end pt-4 border-t border-border/60">
                <Button onClick={() => handleResolveRefund(r.id, false)} variant="outline" size="sm">
                  <X className="mr-1 h-3.5 w-3.5" /> Deny
                </Button>
                <Button onClick={() => handleResolveRefund(r.id, true)} size="sm">
                  <Check className="mr-1 h-3.5 w-3.5" /> Approve Override
                </Button>
              </div>
            </div>
          ))}

        {activeTab === "POLICIES" &&
          policies.map((p) => (
            <div key={p.id} className="rounded-xl border border-border bg-card/30 p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-display font-semibold text-foreground text-sm">{p.action}</h4>
                  <span className="text-xs text-muted-foreground">{p.user}</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Justification: {p.reason}
              </p>
              <div className="flex gap-2 justify-end pt-4 border-t border-border/60">
                <Button onClick={() => handleResolvePolicy(p.id, false)} variant="outline" size="sm">
                  <X className="mr-1 h-3.5 w-3.5" /> Deny
                </Button>
                <Button onClick={() => handleResolvePolicy(p.id, true)} size="sm">
                  <Check className="mr-1 h-3.5 w-3.5" /> Approve Override
                </Button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
export type AdminApprovalsPagePropsType = Record<string, never>;
