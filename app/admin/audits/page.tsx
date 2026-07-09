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
        <h1 className="text-gradient font-display text-2xl font-bold tracking-tight">
          System Audit Trail
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Verify chronological compliance logs, track administrative adjustments, and audit
          authorization role assignments.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card/30">
        <table className="w-full border-collapse text-left text-sm">
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
                  <td className="flex items-center gap-1.5 p-4 font-mono text-xs font-semibold text-foreground">
                    <Activity className="h-3.5 w-3.5 text-primary" /> {log.action}
                  </td>
                  <td className="p-4">
                    <span className="font-semibold text-foreground/90">{log.entityName}</span>
                    <span className="mt-0.5 block font-mono text-[10px] text-muted-foreground">
                      {log.entityId || "N/A"}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-xs">{log.user?.email || "System/Cron"}</td>
                  <td className="p-4 font-mono text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Laptop className="h-3 w-3" /> {log.ipAddress || "Internal"}
                    </span>
                  </td>
                  <td className="p-4 text-right font-mono text-xs text-muted-foreground">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-8 text-center text-xs text-muted-foreground">
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
