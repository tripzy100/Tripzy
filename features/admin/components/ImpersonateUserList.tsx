"use client";

import * as React from "react";
import { User, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/providers/app-provider";
import { triggerImpersonationLog } from "../actions/admin-actions";

interface UserItem {
  id: string;
  email: string;
  isKycVerified: boolean;
}

export function ImpersonateUserList({ initialUsers }: { initialUsers: UserItem[] }) {
  const { showToast } = useToast();
  const [loadingId, setLoadingId] = React.useState<string | null>(null);

  const startImpersonation = async (u: UserItem) => {
    setLoadingId(u.id);
    const res = await triggerImpersonationLog(u.id);
    setLoadingId(null);

    if (res.success) {
      showToast(`Now impersonating ${u.email}. Audit log saved!`, "info");
      // Simulated redirect to dashboard
      window.location.href = "/dashboard";
    } else {
      showToast(res.error || "Impersonation setup failed", "error");
    }
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {initialUsers.map((u) => (
        <div
          key={u.id}
          className="flex items-center justify-between rounded-xl border border-border bg-card/30 p-5"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
              <User className="h-4 w-4 text-muted-foreground" /> {u.email.split("@")[0]}
            </div>
            <div className="max-w-[150px] truncate text-[10px] text-muted-foreground">
              {u.email}
            </div>
          </div>
          <Button
            onClick={() => startImpersonation(u)}
            size="sm"
            variant="outline"
            isLoading={loadingId === u.id}
          >
            <Eye className="mr-1 h-3.5 w-3.5" /> View
          </Button>
        </div>
      ))}
    </div>
  );
}
export type ImpersonateUserListPropsType = { initialUsers: UserItem[] };
