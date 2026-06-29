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
        <h1 className="font-display text-2xl font-bold tracking-tight text-gradient">Communication Audit Logs</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Monitor transactional emails dispatched via Resend and review cell SMS logs.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Email Logs Box */}
        <div className="rounded-xl border border-border bg-card/30 p-6 space-y-4">
          <h3 className="font-display font-semibold text-base flex items-center gap-1.5">
            <Mail className="h-4.5 w-4.5 text-primary" /> Outgoing Emails (Resend)
          </h3>
          <div className="divide-y divide-border/50 text-xs">
            {emails.length > 0 ? (
              emails.map((e) => (
                <div key={e.id} className="py-3 flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <span className="font-semibold text-foreground">{e.recipientEmail}</span>
                    <p className="text-muted-foreground leading-snug">{e.subject}</p>
                  </div>
                  <span className={`inline-flex rounded-full px-2 py-0.5 font-bold font-mono text-[9px] uppercase ${
                    e.status === "SENT" ? "bg-emerald-500/10 text-emerald-500" : "bg-destructive/10 text-destructive"
                  }`}>
                    {e.status}
                  </span>
                </div>
              ))
            ) : (
              <span className="text-muted-foreground block py-3">No emails logged.</span>
            )}
          </div>
        </div>

        {/* SMS / WhatsApp Logs */}
        <div className="rounded-xl border border-border bg-card/30 p-6 space-y-4">
          <h3 className="font-display font-semibold text-base flex items-center gap-1.5">
            <MessageSquare className="h-4.5 w-4.5 text-primary" /> Outgoing Text Updates (SMS/WhatsApp)
          </h3>
          <div className="divide-y divide-border/50 text-xs">
            {smsLogs.length > 0 ? (
              smsLogs.map((s) => (
                <div key={s.id} className="py-3 flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <div className="flex gap-2 items-center">
                      <span className="font-semibold text-foreground">{s.recipientPhone}</span>
                      <span className="text-[10px] text-muted-foreground uppercase font-semibold">{s.channelType}</span>
                    </div>
                    <p className="text-muted-foreground leading-snug">{s.message}</p>
                  </div>
                  <span className={`inline-flex rounded-full px-2 py-0.5 font-bold font-mono text-[9px] uppercase ${
                    s.status === "SENT" ? "bg-emerald-500/10 text-emerald-500" : "bg-destructive/10 text-destructive"
                  }`}>
                    {s.status}
                  </span>
                </div>
              ))
            ) : (
              <span className="text-muted-foreground block py-3">No text logs compiled.</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
export type AdminNotificationsDashboardType = typeof AdminNotificationsDashboard;
