import Link from "next/link";
import { db } from "@/lib/db";
import { Wallet, ShieldCheck, Bell, ArrowUpRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  // Query details for mock user
  const user = await db.user.findFirst({
    include: {
      wallet: true,
      profile: true,
      bookings: {
        orderBy: { createdAt: "desc" },
        take: 3,
        include: { vehicle: { include: { brand: true, model: true } } },
      },
    },
  });

  if (!user) {
    return <div className="text-sm text-muted-foreground">User session not allocated. Please run seed.</div>;
  }

  const kycStatus = "VERIFIED";
  const walletBalance = user.wallet?.balance?.toNumber() || 0;
  const recentBookings = user.bookings;
  const fullName = user.profile ? `${user.profile.firstName} ${user.profile.lastName}` : "Customer";

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-2xl bg-card border border-border p-6 md:p-8 space-y-2">
        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          Welcome back, {fullName}!
        </h1>
        <p className="text-sm text-muted-foreground max-w-lg">
          Manage your self-drive reservations, audit transaction details, and upload driving credentials.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Wallet Overview Card */}
        <div className="rounded-xl border border-border bg-card/30 p-5 space-y-4">
          <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Wallet className="h-4 w-4" /> Wallet Balance
          </span>
          <div className="text-2xl font-extrabold text-foreground">&#8377;{walletBalance}</div>
          <Link href="/dashboard/wallet" className="block text-xs font-semibold hover:underline">
            View transaction history &rarr;
          </Link>
        </div>

        {/* KYC Status Card */}
        <div className="rounded-xl border border-border bg-card/30 p-5 space-y-4">
          <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <ShieldCheck className="h-4 w-4" /> KYC Status
          </span>
          <div>
            <span className="inline-flex rounded-full bg-emerald-500/10 text-emerald-500 px-3 py-1 text-xs font-semibold">
              {kycStatus}
            </span>
          </div>
          <Link href="/dashboard/kyc" className="block text-xs font-semibold hover:underline">
            View documents &rarr;
          </Link>
        </div>

        {/* Notifications Card */}
        <div className="rounded-xl border border-border bg-card/30 p-5 space-y-4">
          <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Bell className="h-4 w-4" /> Notifications
          </span>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Your verification documents have been audited and approved standard.
          </p>
          <span className="text-xs font-semibold text-foreground/80 cursor-default">0 unread updates</span>
        </div>
      </div>

      {/* Bookings Overview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-bold text-foreground">Recent Reservations</h3>
          <Link href="/dashboard/bookings">
            <Button size="sm" variant="ghost">View All</Button>
          </Link>
        </div>

        <div className="grid gap-4">
          {recentBookings.length > 0 ? (
            recentBookings.map((b: any) => (
              <div
                key={b.id}
                className="flex items-center justify-between rounded-xl border border-border bg-card/45 p-5 shadow-sm"
              >
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground flex items-center gap-1 font-mono">
                    <Clock className="h-3 w-3" /> Booking Ref: {b.bookingNumber}
                  </span>
                  <div className="font-semibold text-foreground text-sm">
                    {b.vehicle.brand.name} {b.vehicle.model.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(b.pickupDate).toLocaleDateString()} to {new Date(b.returnDate).toLocaleDateString()}
                  </div>
                </div>
                <Link href={`/bookings/${b.id}`}>
                  <Button size="sm" variant="outline" className="group">
                    Details <ArrowUpRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Button>
                </Link>
              </div>
            ))
          ) : (
            <div className="rounded-xl border border-dashed border-border p-8 text-center text-xs text-muted-foreground">
              No recent reservations logged in your history.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export type DashboardPageType = typeof DashboardPage;
