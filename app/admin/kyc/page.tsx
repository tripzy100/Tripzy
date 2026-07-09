import { db } from "@/lib/db";
import { ShieldCheck } from "lucide-react";
import { KycReviewList } from "@/features/admin/components/KycReviewList";

export const dynamic = "force-dynamic";

export default async function AdminKycQueuePage() {
  // Query users who are not yet KYC-verified
  const pendingUsers = await db.user.findMany({
    where: { isKycVerified: false },
    include: {
      profile: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-gradient font-display text-2xl font-bold tracking-tight">
          KYC Document Review Queue
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Verify uploaded credentials, inspect licence numbers, and confirm identity facial
          verification reviews.
        </p>
      </div>

      {pendingUsers.length > 0 ? (
        <KycReviewList initialUsers={pendingUsers as any} />
      ) : (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border p-12 text-center text-xs text-muted-foreground">
          <ShieldCheck className="h-8 w-8 text-emerald-500" />
          <span>All customer KYC documents are fully audited and cleared!</span>
        </div>
      )}
    </div>
  );
}
export type AdminKycQueuePageType = typeof AdminKycQueuePage;
