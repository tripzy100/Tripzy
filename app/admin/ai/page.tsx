import { getAiObservabilityMetrics } from "@/lib/ai/ai-observability";
import { Sparkles, Activity, Clock } from "lucide-react";

export default async function AdminAiPage() {
  const { totalTokens, recentLogs } = await getAiObservabilityMetrics();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-gradient flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" /> AI Observability Console
        </h1>
        <p className="text-sm text-muted-foreground mt-2">
          Track latency averages, token metrics, and API cost parameters in real-time.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card/30 p-6 space-y-2">
          <span className="text-xs text-muted-foreground">Tokens Expended</span>
          <h2 className="text-2xl font-bold text-foreground font-mono">{totalTokens}</h2>
        </div>
        <div className="rounded-xl border border-border bg-card/30 p-6 space-y-2">
          <span className="text-xs text-muted-foreground">Active Model Provider</span>
          <h2 className="text-2xl font-bold text-foreground font-mono">Gemini-Pro</h2>
        </div>
        <div className="rounded-xl border border-border bg-card/30 p-6 space-y-2">
          <span className="text-xs text-muted-foreground">Prompt Status</span>
          <h2 className="text-2xl font-bold text-emerald-500 font-mono">Normal</h2>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card/30 p-6 space-y-4">
        <h3 className="font-display font-semibold text-sm flex items-center gap-1.5">
          <Activity className="h-4.5 w-4.5 text-primary" /> Recent Model Request Audits
        </h3>

        <div className="divide-y divide-border/50 text-xs">
          {recentLogs.length > 0 ? (
            recentLogs.map((l: any, idx: number) => (
              <div key={idx} className="py-3 flex justify-between items-center">
                <div className="space-y-1">
                  <div className="flex gap-2 items-center">
                    <span className="font-semibold text-foreground">{l.provider}</span>
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(l.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="text-[10px] text-muted-foreground flex gap-4">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {l.latency}ms
                    </span>
                    <span>Tokens: {l.tokensUsed}</span>
                  </div>
                </div>
                <span className={`inline-flex rounded-full px-2 py-0.5 font-bold font-mono text-[9px] uppercase ${
                  l.success ? "bg-emerald-500/10 text-emerald-500" : "bg-destructive/10 text-destructive"
                }`}>
                  {l.success ? "SUCCESS" : "FAIL"}
                </span>
              </div>
            ))
          ) : (
            <span className="text-muted-foreground block py-3">No AI logs available.</span>
          )}
        </div>
      </div>
    </div>
  );
}
export type AdminAiPagePropsType = Record<string, never>;
