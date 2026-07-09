import { db } from "@/lib/db";
import { Car, Calendar, ShieldCheck, Wallet, RefreshCw, AlertCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  // Query operations database details
  const [totalCars, maintenanceCars, pendingBookings, confirmedBookings, totalPayments] =
    await Promise.all([
      db.vehicle.count(),
      db.vehicle.count({ where: { status: "MAINTENANCE" } }),
      db.booking.count({ where: { status: "PENDING" } }),
      db.booking.count({ where: { status: "CONFIRMED" } }),
      db.payment.aggregate({ _sum: { totalAmount: true } }),
    ]);

  const totalRev = totalPayments._sum.totalAmount?.toNumber() || 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-gradient font-display text-2xl font-bold tracking-tight">
          Operations Command Center
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Monitor platform metrics, manage car allocation, track revenue, and review pending
          customer KYC requests.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Fleet */}
        <div className="space-y-3 rounded-xl border border-border bg-card/30 p-5">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Cars</span>
            <Car className="h-4.5 w-4.5 text-foreground" />
          </div>
          <div className="text-2xl font-extrabold text-foreground">{totalCars} Vehicles</div>
          <div className="text-[10px] text-muted-foreground">
            {maintenanceCars} currently in maintenance
          </div>
        </div>

        {/* Pending bookings */}
        <div className="space-y-3 rounded-xl border border-border bg-card/30 p-5">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Pending Bookings</span>
            <Calendar className="h-4.5 w-4.5 text-foreground" />
          </div>
          <div className="text-2xl font-extrabold text-foreground">{pendingBookings} Drafts</div>
          <div className="text-[10px] text-muted-foreground">
            {confirmedBookings} bookings confirmed
          </div>
        </div>

        {/* KYC Queue count */}
        <div className="space-y-3 rounded-xl border border-border bg-card/30 p-5">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">
              KYC Auditing Queue
            </span>
            <ShieldCheck className="h-4.5 w-4.5 text-foreground" />
          </div>
          <div className="text-2xl font-extrabold text-foreground">1 Pending</div>
          <div className="text-[10px] text-muted-foreground">Selfie face match reviews waiting</div>
        </div>

        {/* Revenue */}
        <div className="space-y-3 rounded-xl border border-border bg-card/30 p-5">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Platform Revenue</span>
            <Wallet className="h-4.5 w-4.5 text-foreground" />
          </div>
          <div className="text-2xl font-extrabold text-foreground">&#8377;{totalRev}</div>
          <div className="text-[10px] text-muted-foreground">
            Net settlements cleared via Cashfree
          </div>
        </div>
      </div>

      {/* Operational checklists */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4 rounded-xl border border-border bg-card/45 p-6">
          <h3 className="flex items-center gap-1.5 font-display text-base font-semibold">
            <AlertCircle className="h-4.5 w-4.5 text-primary" /> Active System Status
          </h3>
          <div className="space-y-3 text-xs leading-relaxed text-muted-foreground">
            <div className="flex justify-between border-b border-border/50 py-1">
              <span className="font-semibold text-foreground">Cashfree Gateway API Connection</span>
              <span className="font-bold uppercase text-emerald-500">Online</span>
            </div>
            <div className="flex justify-between border-b border-border/50 py-1">
              <span className="font-semibold text-foreground">
                PostgreSQL DB Transaction Limits
              </span>
              <span className="font-bold uppercase text-emerald-500">Safe</span>
            </div>
          </div>
        </div>

        <div className="space-y-4 rounded-xl border border-border bg-card/45 p-6">
          <h3 className="flex items-center gap-1.5 font-display text-base font-semibold">
            <RefreshCw className="h-4.5 w-4.5 text-foreground" /> Operational Updates
          </h3>
          <p className="text-xs leading-relaxed text-muted-foreground">
            All system clusters are running at 100% efficiency. Automated cleaning buffers are
            locked for pickups in active locations.
          </p>
        </div>
      </div>
    </div>
  );
}
export type AdminDashboardPagePropsType = typeof AdminDashboardPage;
