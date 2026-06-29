"use client";

import * as React from "react";
import { Check, X, ShieldAlert, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/providers/app-provider";
import { verifyUserKyc } from "../actions/admin-actions";

interface UserItem {
  id: string;
  email: string;
  isKycVerified: boolean;
  profile?: {
    firstName: string;
    lastName: string;
    drivingLicenseNumber?: string;
  };
}

export function KycReviewList({ initialUsers }: { initialUsers: UserItem[] }) {
  const { showToast } = useToast();
  const [users, setUsers] = React.useState(initialUsers);

  const handleReview = async (id: string, approve: boolean) => {
    const res = await verifyUserKyc(id, approve);
    if (res.success) {
      showToast(approve ? "KYC approved successfully" : "KYC application rejected", "success");
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } else {
      showToast(res.error || "Action failed", "error");
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {users.map((u) => {
        const name = u.profile ? `${u.profile.firstName} ${u.profile.lastName}` : "Customer";
        return (
          <div key={u.id} className="rounded-xl border border-border bg-card/30 p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-display font-semibold text-foreground text-base">{name}</h3>
                <span className="text-xs text-muted-foreground block">{u.email}</span>
              </div>
              <span className="inline-flex rounded-full bg-amber-500/10 text-amber-500 px-2.5 py-0.5 text-xs font-semibold">
                PENDING REVIEW
              </span>
            </div>

            <div className="rounded-lg bg-muted/40 p-4 border border-border/50 space-y-2 text-xs">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <FileText className="h-4 w-4" /> DL Document Reference:
              </div>
              <div className="font-mono font-semibold text-foreground">
                {u.profile?.drivingLicenseNumber || "Not Provided"}
              </div>
            </div>

            {/* Actions panel */}
            <div className="flex gap-2 justify-end pt-4 border-t border-border/60">
              <Button onClick={() => handleReview(u.id, false)} variant="outline" size="sm" className="text-destructive hover:bg-destructive/10 border-destructive/20">
                <X className="mr-1 h-3.5 w-3.5" /> Reject
              </Button>
              <Button onClick={() => handleReview(u.id, true)} size="sm">
                <Check className="mr-1 h-3.5 w-3.5" /> Approve
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
export type KycReviewListPropsType = { initialUsers: UserItem[] };
