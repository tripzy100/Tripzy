import { db } from "@/lib/db";
import { UserCheck, ShieldAlert } from "lucide-react";
import { ImpersonateUserList } from "@/features/admin/components/ImpersonateUserList";

export const dynamic = "force-dynamic";

export default async function AdminImpersonationPage() {
  // Query all users that can be impersonated
  const users = await db.user.findMany({
    orderBy: { email: "asc" },
  });

  return (
    <div className="space-y-8">
      <div className="flex items-start gap-4 rounded-2xl border border-destructive/20 bg-destructive/5 p-6">
        <ShieldAlert className="mt-0.5 h-6 w-6 shrink-0 text-destructive" />
        <div className="space-y-1">
          <h2 className="font-display text-sm font-bold uppercase tracking-wider text-destructive">
            High-Security Administrative Impersonation
          </h2>
          <p className="max-w-2xl text-xs leading-relaxed text-muted-foreground">
            By impersonating a customer account, you gain full access to view their dashboard
            layouts, wallet records, and ticket history. Every transaction, navigation click, and
            session launch is cryptographically recorded in the immutable audit log.
          </p>
        </div>
      </div>

      <div>
        <h3 className="flex items-center gap-1.5 font-display text-lg font-bold text-foreground">
          <UserCheck className="h-5 w-5 text-primary" /> Active Platform Accounts
        </h3>
      </div>

      <ImpersonateUserList initialUsers={users as any} />
    </div>
  );
}
export type AdminImpersonationPageType = typeof AdminImpersonationPage;
