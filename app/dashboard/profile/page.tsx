"use client";

import * as React from "react";
import { Laptop, KeyRound, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/providers/app-provider";

export default function ProfilePage() {
  const { showToast } = useToast();
  const [loading, setLoading] = React.useState(false);
  const [sessions, setSessions] = React.useState([
    { id: "s1", browser: "Chrome on Windows", ip: "192.168.1.1", active: true },
    { id: "s2", browser: "Safari on iPhone", ip: "10.0.0.4", active: false },
  ]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showToast("Profile settings saved successfully", "success");
    }, 1000);
  };

  const revokeSession = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    showToast("Session credentials revoked", "info");
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-gradient font-display text-2xl font-bold tracking-tight">
          Profile & Session Settings
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Update contact details, save emergency references, and review active session connections.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Profile update form */}
        <div className="rounded-xl border border-border bg-card/30 p-6 md:col-span-2">
          <form onSubmit={handleSave} className="space-y-4">
            <h3 className="mb-6 flex items-center gap-1.5 font-display text-base font-bold text-foreground">
              Contact Information
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">
                  Full Name
                </label>
                <input
                  type="text"
                  defaultValue="Sachit Bhatia"
                  className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">
                  Email Address
                </label>
                <input
                  type="email"
                  defaultValue="sachit@example.com"
                  disabled
                  className="w-full cursor-not-allowed rounded-lg border border-input bg-card/50 px-3 py-2 text-sm text-muted-foreground"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">
                  Phone Number
                </label>
                <input
                  type="tel"
                  defaultValue="+91 98765 43210"
                  className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">
                  Emergency Contact
                </label>
                <input
                  type="tel"
                  placeholder="Contact coordinates"
                  defaultValue="+91 91234 56789"
                  className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end border-t border-border pt-4">
              <Button type="submit" isLoading={loading}>
                <Save className="mr-1.5 h-4 w-4" /> Save Modifications
              </Button>
            </div>
          </form>
        </div>

        {/* Sessions logs */}
        <div className="space-y-6 rounded-xl border border-border bg-card/30 p-6">
          <h3 className="flex items-center gap-1.5 font-display text-base font-bold text-foreground">
            <KeyRound className="h-4 w-4" /> Device Connections
          </h3>

          <div className="space-y-4">
            {sessions.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between border-b border-border/50 pb-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-sm font-semibold text-foreground">
                    <Laptop className="h-3.5 w-3.5 text-muted-foreground" /> {s.browser}
                  </div>
                  <div className="font-mono text-[10px] text-muted-foreground">{s.ip}</div>
                </div>
                {s.active ? (
                  <span className="text-[10px] font-semibold uppercase text-emerald-500">
                    Current
                  </span>
                ) : (
                  <Button
                    onClick={() => revokeSession(s.id)}
                    variant="ghost"
                    size="sm"
                    className="text-xs text-destructive hover:bg-destructive/10"
                  >
                    Revoke
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
export type ProfilePagePropsType = typeof ProfilePage;
