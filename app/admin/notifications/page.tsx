import { db } from "@/lib/db";
import { Mail, MessageSquare } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminNotificationsDashboard() {
  const [emails, smsLogs] = await Promise.all([
    db.emailSent.findMany({ orderBy: { createdAt: "desc" }, take: 25 }),
    db.smsLog.findMany({ orderBy: { createdAt: "desc" }, take: 25 }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-gradient font-display text-2xl font-bold tracking-tight">
          Communication Audit Logs
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Monitor transactional emails dispatched via Resend and review cell SMS logs.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Email Logs Box */}
        <div className="space-y-4 rounded-xl border border-border bg-card/30 p-6">
          <h3 className="flex items-center gap-1.5 font-display text-base font-semibold">
            <Mail className="h-4.5 w-4.5 text-primary" /> Outgoing Emails (Resend)
          </h3>
          <div className="divide-y divide-border/50 text-xs">
            {emails.length > 0 ? (
              emails.map((e) => (
                <div key={e.id} className="flex items-start justify-between gap-4 py-3">
                  <div className="space-y-1">
                    <span className="font-semibold text-foreground">{e.recipientEmail}</span>
                    <p className="leading-snug text-muted-foreground">{e.subject}</p>
                  </div>
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 font-mono text-[9px] font-bold uppercase ${
                      e.status === "SENT"
                        ? "bg-emerald-500/10 text-emerald-500"
                        : "bg-destructive/10 text-destructive"
                    }`}
                  >
                    {e.status}
                  </span>
                </div>
              ))
            ) : (
              <span className="block py-3 text-muted-foreground">No emails logged.</span>
            )}
          </div>
        </div>

        {/* SMS / WhatsApp Logs */}
        <div className="space-y-4 rounded-xl border border-border bg-card/30 p-6">
          <h3 className="flex items-center gap-1.5 font-display text-base font-semibold">
            <MessageSquare className="h-4.5 w-4.5 text-primary" /> Outgoing Text Updates
            (SMS/WhatsApp)
          </h3>
          <div className="divide-y divide-border/50 text-xs">
            {smsLogs.length > 0 ? (
              smsLogs.map((s) => (
                <div key={s.id} className="flex items-start justify-between gap-4 py-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">{s.recipientPhone}</span>
                      <span className="text-[10px] font-semibold uppercase text-muted-foreground">
                        {s.channelType}
                      </span>
                    </div>
                    <p className="leading-snug text-muted-foreground">{s.message}</p>
                  </div>
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 font-mono text-[9px] font-bold uppercase ${
                      s.status === "SENT"
                        ? "bg-emerald-500/10 text-emerald-500"
                        : "bg-destructive/10 text-destructive"
                    }`}
                  >
                    {s.status}
                  </span>
                </div>
              ))
            ) : (
              <span className="block py-3 text-muted-foreground">No text logs compiled.</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
export type AdminNotificationsDashboardType = typeof AdminNotificationsDashboard;
