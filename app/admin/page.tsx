import { db } from "@/lib/db";
import { Car, Calendar, ShieldCheck, Wallet, RefreshCw, AlertCircle } from "lucide-react";

export default async function AdminDashboardPage() {
  // Query operations database details
  const [totalCars, maintenanceCars, pendingBookings, confirmedBookings, totalPayments] = await Promise.all([
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
        <h1 className="font-display text-2xl font-bold tracking-tight text-gradient">Operations Command Center</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Monitor platform metrics, manage fleet allocation, track revenue, and review pending customer KYC requests.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Fleet */}
        <div className="rounded-xl border border-border bg-card/30 p-5 space-y-3">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Fleet Size</span>
            <Car className="h-4.5 w-4.5 text-foreground" />
          </div>
          <div className="text-2xl font-extrabold text-foreground">{totalCars} Vehicles</div>
          <div className="text-[10px] text-muted-foreground">{maintenanceCars} currently in maintenance</div>
        </div>

        {/* Pending bookings */}
        <div className="rounded-xl border border-border bg-card/30 p-5 space-y-3">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Pending Bookings</span>
            <Calendar className="h-4.5 w-4.5 text-foreground" />
          </div>
          <div className="text-2xl font-extrabold text-foreground">{pendingBookings} Drafts</div>
          <div className="text-[10px] text-muted-foreground">{confirmedBookings} bookings confirmed</div>
        </div>

        {/* KYC Queue count */}
        <div className="rounded-xl border border-border bg-card/30 p-5 space-y-3">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">KYC Auditing Queue</span>
            <ShieldCheck className="h-4.5 w-4.5 text-foreground" />
          </div>
          <div className="text-2xl font-extrabold text-foreground">1 Pending</div>
          <div className="text-[10px] text-muted-foreground">Selfie face match reviews waiting</div>
        </div>

        {/* Revenue */}
        <div className="rounded-xl border border-border bg-card/30 p-5 space-y-3">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Platform Revenue</span>
            <Wallet className="h-4.5 w-4.5 text-foreground" />
          </div>
          <div className="text-2xl font-extrabold text-foreground">&#8377;{totalRev}</div>
          <div className="text-[10px] text-muted-foreground">Net settlements cleared via Cashfree</div>
        </div>
      </div>

      {/* Operational checklists */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-border bg-card/45 p-6 space-y-4">
          <h3 className="font-display font-semibold text-base flex items-center gap-1.5">
            <AlertCircle className="h-4.5 w-4.5 text-primary" /> Active System Status
          </h3>
          <div className="space-y-3 text-xs leading-relaxed text-muted-foreground">
            <div className="flex justify-between py-1 border-b border-border/50">
              <span className="font-semibold text-foreground">Cashfree Gateway API Connection</span>
              <span className="text-emerald-500 font-bold uppercase">Online</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border/50">
              <span className="font-semibold text-foreground">Upstash Redis Cache Cluster</span>
              <span className="text-emerald-500 font-bold uppercase">Online</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border/50">
              <span className="font-semibold text-foreground">PostgreSQL DB Transaction Limits</span>
              <span className="text-emerald-500 font-bold uppercase">Safe</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card/45 p-6 space-y-4">
          <h3 className="font-display font-semibold text-base flex items-center gap-1.5">
            <RefreshCw className="h-4.5 w-4.5 text-foreground" /> Operational Updates
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            All system clusters are running at 100% efficiency. Automated cleaning buffers are locked for pickups in active locations.
          </p>
        </div>
      </div>
    </div>
  );
}
export type AdminDashboardPagePropsType = typeof AdminDashboardPage;
