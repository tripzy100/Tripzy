import { db } from "@/lib/db";
import { Activity, Laptop } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminAuditsPage() {
  const auditLogs = await db.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      user: { select: { email: true } },
    },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-gradient">System Audit Trail</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Verify chronological compliance logs, track administrative adjustments, and audit authorization role assignments.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card/30 overflow-hidden">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-xs font-semibold uppercase text-muted-foreground">
              <th className="p-4">Action</th>
              <th className="p-4">Entity</th>
              <th className="p-4">Modified By</th>
              <th className="p-4">IP Address</th>
              <th className="p-4 text-right">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-foreground/80">
            {auditLogs.length > 0 ? (
              auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-muted/10">
                  <td className="p-4 font-semibold text-foreground flex items-center gap-1.5 font-mono text-xs">
                    <Activity className="h-3.5 w-3.5 text-primary" /> {log.action}
                  </td>
                  <td className="p-4">
                    <span className="font-semibold text-foreground/90">{log.entityName}</span>
                    <span className="text-[10px] text-muted-foreground block font-mono mt-0.5">{log.entityId || "N/A"}</span>
                  </td>
                  <td className="p-4 text-xs font-mono">{log.user?.email || "System/Cron"}</td>
                  <td className="p-4 font-mono text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Laptop className="h-3 w-3" /> {log.ipAddress || "Internal"}
                    </span>
                  </td>
                  <td className="p-4 text-right text-xs text-muted-foreground font-mono">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center p-8 text-xs text-muted-foreground">
                  No system audit trail entries logged.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export type AdminAuditsPagePropsType = typeof AdminAuditsPage;
