"use client";

import * as React from "react";
import { Gift, Award, Copy, Check, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/providers/app-provider";

export default function LoyaltyPage() {
  const { showToast } = useToast();
  const [copied, setCopied] = React.useState(false);

  const inviteLink = "https://tripzy.com/invite/sachit123";

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    showToast("Referral link copied to clipboard!", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-gradient">Loyalty & Referrals</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Earn credits by inviting friends and climb membership levels to unlock luxury cars.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Points Summary Card */}
        <div className="rounded-xl border border-border bg-card/30 p-6 space-y-4 md:col-span-1">
          <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Award className="h-4 w-4" /> Current Membership
          </span>
          <div className="text-2xl font-extrabold text-foreground">Gold Tier</div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-muted-foreground">750 / 1000 Points</span>
              <span>Platinum at 1000</span>
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: "75%" }} />
            </div>
          </div>
        </div>

        {/* Copy Invite Link */}
        <div className="rounded-xl border border-border bg-card/30 p-6 md:col-span-2 space-y-4">
          <h3 className="font-display font-semibold text-base flex items-center gap-1.5">
            <Gift className="h-4.5 w-4.5" /> Refer & Earn Credits
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Invite friends to Tripzy. They get &#8377;500 off their first booking, and you get &#8377;250 in wallet credits once their trip concludes.
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={inviteLink}
              className="flex-1 rounded-lg border border-input bg-muted/40 px-3 py-2 text-xs font-mono text-foreground focus:outline-none"
            />
            <Button onClick={handleCopy} size="sm" variant="outline">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Referral history */}
      <div className="space-y-4">
        <h3 className="font-display font-bold text-base flex items-center gap-1.5">
          <Users className="h-4.5 w-4.5" /> Referred Connections
        </h3>
        <div className="rounded-xl border border-border bg-card/45 overflow-hidden">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-xs font-semibold uppercase text-muted-foreground">
                <th className="p-4">Friend</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Your Reward</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-foreground/80">
              <tr className="hover:bg-muted/10">
                <td className="p-4 font-semibold text-foreground">Rahul Sharma</td>
                <td className="p-4">
                  <span className="inline-flex rounded-full bg-emerald-500/10 text-emerald-500 px-2 py-0.5 text-xs font-semibold">Completed</span>
                </td>
                <td className="p-4 text-right font-mono text-emerald-500 font-semibold">+&#8377;250</td>
              </tr>
              <tr className="hover:bg-muted/10">
                <td className="p-4 font-semibold text-foreground">Sneha Patil</td>
                <td className="p-4">
                  <span className="inline-flex rounded-full bg-amber-500/10 text-amber-500 px-2 py-0.5 text-xs font-semibold">Joined</span>
                </td>
                <td className="p-4 text-right text-muted-foreground font-mono">&#8377;0 (Pending trip)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
export type LoyaltyPageType = typeof LoyaltyPage;
