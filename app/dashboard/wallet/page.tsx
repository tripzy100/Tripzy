import { db } from "@/lib/db";
import { Wallet, ArrowDownLeft, ArrowUpRight, TrendingUp } from "lucide-react";
import { requireAuthPage } from "@/lib/auth-utils";

export const dynamic = "force-dynamic";

export default async function WalletPage() {
  const userId = await requireAuthPage("/dashboard/wallet");

  const user = await db.user.findUnique({
    where: { id: userId },
    include: {
      wallet: {
        include: {
          transactions: { orderBy: { createdAt: "desc" } },
        },
      },
    },
  });

  if (!user) {
    return <div className="text-sm text-muted-foreground">User account not found. Please log in again.</div>;
  }

  const wallet = user.wallet;
  const balance = wallet?.balance?.toNumber() || 0;
  const transactions = wallet?.transactions || [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-gradient font-display text-2xl font-bold tracking-tight">
          Wallet Ledger
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage digital balances, review refund logs, and track platform promotion credits.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Balance Card */}
        <div className="space-y-4 rounded-xl border border-border bg-card/30 p-6 md:col-span-1">
          <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Wallet className="h-4 w-4" /> Available Credits
          </span>
          <div className="text-3xl font-extrabold text-foreground">&#8377;{balance}</div>
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <TrendingUp className="h-3.5 w-3.5 text-emerald-500" /> INR standard currency
          </div>
        </div>

        {/* Transactions list */}
        <div className="space-y-4 rounded-xl border border-border bg-card/30 p-6 md:col-span-2">
          <h3 className="font-display text-base font-semibold">Ledger Statements</h3>

          <div className="divide-y divide-border/60">
            {transactions.length > 0 ? (
              transactions.map((tx: any) => (
                <div key={tx.id} className="flex items-center justify-between py-3">
                  <div className="space-y-1">
                    <div className="text-sm font-semibold text-foreground">{tx.description}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(tx.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {tx.type === "CREDIT" ? (
                      <span className="flex items-center text-sm font-semibold text-emerald-500">
                        <ArrowDownLeft className="h-4 w-4" /> +&#8377;{Number(tx.amount)}
                      </span>
                    ) : (
                      <span className="flex items-center text-sm font-semibold text-muted-foreground">
                        <ArrowUpRight className="h-4 w-4" /> -&#8377;{Number(tx.amount)}
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="py-6 text-center text-xs text-muted-foreground">
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
