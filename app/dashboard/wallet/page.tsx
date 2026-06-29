import { db } from "@/lib/db";
import { Wallet, ArrowDownLeft, ArrowUpRight, TrendingUp } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function WalletPage() {
  const user = await db.user.findFirst({
    include: {
      wallet: {
        include: {
          transactions: { orderBy: { createdAt: "desc" } },
        },
      },
    },
  });

  if (!user) {
    return <div className="text-sm text-muted-foreground">Session expired. Please seed.</div>;
  }

  const wallet = user.wallet;
  const balance = wallet?.balance?.toNumber() || 0;
  const transactions = wallet?.transactions || [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-gradient">Wallet Ledger</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Manage digital balances, review refund logs, and track platform promotion credits.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Balance Card */}
        <div className="rounded-xl border border-border bg-card/30 p-6 space-y-4 md:col-span-1">
          <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Wallet className="h-4 w-4" /> Available Credits
          </span>
          <div className="text-3xl font-extrabold text-foreground">&#8377;{balance}</div>
          <div className="text-[10px] text-muted-foreground flex items-center gap-1">
            <TrendingUp className="h-3.5 w-3.5 text-emerald-500" /> INR standard currency
          </div>
        </div>

        {/* Transactions list */}
        <div className="rounded-xl border border-border bg-card/30 p-6 md:col-span-2 space-y-4">
          <h3 className="font-display font-semibold text-base">Ledger Statements</h3>
          
          <div className="divide-y divide-border/60">
            {transactions.length > 0 ? (
              transactions.map((tx: any) => (
                <div key={tx.id} className="flex items-center justify-between py-3">
                  <div className="space-y-1">
                    <div className="text-sm font-semibold text-foreground">{tx.description}</div>
                    <div className="text-xs text-muted-foreground">{new Date(tx.createdAt).toLocaleDateString()}</div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {tx.type === "CREDIT" ? (
                      <span className="text-emerald-500 font-semibold text-sm flex items-center">
                        <ArrowDownLeft className="h-4 w-4" /> +&#8377;{Number(tx.amount)}
                      </span>
                    ) : (
                      <span className="text-muted-foreground font-semibold text-sm flex items-center">
                        <ArrowUpRight className="h-4 w-4" /> -&#8377;{Number(tx.amount)}
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-xs text-muted-foreground">
                No recent wallet operations logged in your profile.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
export type WalletPagePropsType = typeof WalletPage;
