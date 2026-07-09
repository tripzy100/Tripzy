"use client";

import * as React from "react";
import { Check, X, BadgeCent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/providers/app-provider";

export default function AdminApprovalsPage() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = React.useState<"REFUNDS" | "POLICIES">("REFUNDS");
  const [refunds, setRefunds] = React.useState([
    {
      id: "r1",
      user: "rahul@example.com",
      amount: 15400,
      reason: "Monsoon trip cancel safety rules",
    },
  ]);
  const [policies, setPolicies] = React.useState([
    {
      id: "p1",
      action: "Waive clean fee",
      user: "sneha@example.com",
      reason: "Loyalty Gold customer request",
    },
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
        <h1 className="text-gradient font-display text-2xl font-bold tracking-tight">
          Sensitive Action Approvals
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Review high-value refunds and policy exception overrides requesting dual-authorization
          clearance.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border pb-px">
        <button
          onClick={() => setActiveTab("REFUNDS")}
          className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "REFUNDS"
              ? "border-primary font-bold text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          High-Value Refunds ({refunds.length})
        </button>
        <button
          onClick={() => setActiveTab("POLICIES")}
          className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "POLICIES"
              ? "border-primary font-bold text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Policy Exceptions ({policies.length})
        </button>
      </div>

      {/* Content queue */}
      <div className="grid gap-6 md:grid-cols-2">
        {activeTab === "REFUNDS" &&
          refunds.map((r) => (
            <div key={r.id} className="space-y-4 rounded-xl border border-border bg-card/30 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="flex items-center gap-1 font-display text-sm font-semibold text-foreground">
                    <BadgeCent className="h-4.5 w-4.5 text-primary" /> Refund Request
                  </h4>
                  <span className="text-xs text-muted-foreground">{r.user}</span>
                </div>
                <span className="text-sm font-bold text-foreground">&#8377;{r.amount}</span>
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">Reason: {r.reason}</p>
              <div className="flex justify-end gap-2 border-t border-border/60 pt-4">
                <Button
                  onClick={() => handleResolveRefund(r.id, false)}
                  variant="outline"
                  size="sm"
                >
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
            <div key={p.id} className="space-y-4 rounded-xl border border-border bg-card/30 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-display text-sm font-semibold text-foreground">{p.action}</h4>
                  <span className="text-xs text-muted-foreground">{p.user}</span>
                </div>
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Justification: {p.reason}
              </p>
              <div className="flex justify-end gap-2 border-t border-border/60 pt-4">
                <Button
                  onClick={() => handleResolvePolicy(p.id, false)}
                  variant="outline"
                  size="sm"
                >
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
