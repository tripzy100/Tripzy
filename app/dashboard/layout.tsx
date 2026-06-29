"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Car, LayoutDashboard, User, ShieldCheck, Calendar, Wallet, LifeBuoy, Menu, LogOut, Award, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "My Bookings", href: "/dashboard/bookings", icon: Calendar },
  { label: "Wallet & Ledger", href: "/dashboard/wallet", icon: Wallet },
  { label: "KYC Verification", href: "/dashboard/kyc", icon: ShieldCheck },
  { label: "Loyalty & Referrals", href: "/dashboard/loyalty", icon: Award },
  { label: "Account Security", href: "/dashboard/security", icon: Shield },
  { label: "Profile Settings", href: "/dashboard/profile", icon: User },
  { label: "Support Tickets", href: "/dashboard/support", icon: LifeBuoy },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <div className="flex min-h-screen bg-muted/20">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-border bg-card p-6 space-y-8 sticky top-0 h-screen">
        <Link href="/" className="flex items-center gap-2">
          <Car className="h-6 w-6 text-foreground" />
          <span className="font-display text-xl font-bold tracking-tight text-foreground">Tripzy</span>
        </Link>

        {/* Profile Card Summary */}
        <div className="rounded-lg bg-muted/40 p-4 border border-border/50">
          <div className="font-semibold text-sm text-foreground">Sachit Bhatia</div>
          <div className="text-xs text-muted-foreground truncate">sachit@example.com</div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive ? "bg-primary text-primary-foreground font-semibold" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="h-4.5 w-4.5" /> {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10">
          <LogOut className="mr-2 h-4 w-4" /> Sign Out
        </Button>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header Bar */}
        <header className="lg:hidden flex items-center justify-between border-b border-border bg-card px-6 py-4 sticky top-0 z-30">
          <Link href="/" className="flex items-center gap-2">
            <Car className="h-5 w-5 text-foreground" />
            <span className="font-display font-bold text-foreground">Tripzy</span>
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground rounded"
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </header>

        {/* Mobile Navigation Panel */}
        {mobileOpen && (
          <nav className="lg:hidden border-b border-border bg-card px-6 py-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 text-sm text-foreground/80 hover:bg-muted rounded"
                >
                  <Icon className="h-4.5 w-4.5 text-muted-foreground" /> {item.label}
                </Link>
              );
            })}
          </nav>
        )}

        {/* Dynamic page children */}
        <main className="flex-1 p-6 md:p-8 lg:p-10 max-w-6xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
export type DashboardLayoutType = typeof DashboardLayout;
