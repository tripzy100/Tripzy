"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Car,
  LayoutDashboard,
  User,
  ShieldCheck,
  Calendar,
  Wallet,
  LifeBuoy,
  Menu,
  LogOut,
  Award,
  Shield,
  Sparkles,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth-provider";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "My Bookings", href: "/dashboard/bookings", icon: Calendar },
  { label: "Wallet & Ledger", href: "/dashboard/wallet", icon: Wallet },
  { label: "KYC Verification", href: "/dashboard/kyc", icon: ShieldCheck },
  { label: "Loyalty & Referrals", href: "/dashboard/loyalty", icon: Award },
  { label: "Account Security", href: "/dashboard/security", icon: Shield },
  { label: "Profile Settings", href: "/dashboard/profile", icon: User },
  { label: "Support Tickets", href: "/dashboard/support", icon: LifeBuoy },
  { label: "AI Copilot", href: "/dashboard/assistant", icon: Sparkles },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { user, loading: authLoading, signOut } = useAuth();
  const [signingOut, setSigningOut] = React.useState(false);

  const displayName = user?.user_metadata?.name || user?.email?.split("@")[0] || "User";
  const displayEmail = user?.email || "";

  const handleSignOut = async () => {
    setSigningOut(true);
    await signOut();
    // signOut handles redirect
  };

  return (
    <div className="flex min-h-screen bg-muted/20">
      {/* Desktop Sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 flex-col space-y-8 border-r border-border bg-card p-6 lg:flex">
        <Link href="/" className="flex items-center gap-2">
          <Car className="h-6 w-6 text-foreground" />
          <span className="font-display text-xl font-bold tracking-tight text-foreground">
            TRIPZY
          </span>
        </Link>

        {/* Profile Card Summary */}
        <div className="rounded-lg border border-border/50 bg-muted/40 p-4">
          {authLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Loading...</span>
            </div>
          ) : (
            <>
              <div className="text-sm font-semibold text-foreground">{displayName}</div>
              <div className="truncate text-xs text-muted-foreground">{displayEmail}</div>
            </>
          )}
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
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary font-semibold text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="h-4.5 w-4.5" /> {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          onClick={handleSignOut}
          disabled={signingOut}
        >
          {signingOut ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <LogOut className="mr-2 h-4 w-4" />
          )}
          {signingOut ? "Signing out..." : "Sign Out"}
        </Button>
      </aside>

      {/* Main Content Area */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile Header Bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-card px-4 sm:px-6 py-3.5 sm:py-4 lg:hidden">
          <Link href="/" className="flex items-center gap-2">
            <Car className="h-5 w-5 text-foreground" />
            <span className="font-display font-bold text-foreground">TRIPZY</span>
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </header>

        {/* Mobile Navigation Panel */}
        {mobileOpen && (
          <nav className="space-y-1.5 border-b border-border bg-card px-4 sm:px-6 py-4 lg:hidden">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-foreground/80 hover:bg-muted"
                >
                  <Icon className="h-4.5 w-4.5 text-muted-foreground" /> {item.label}
                </Link>
              );
            })}
            <button
              onClick={handleSignOut}
              disabled={signingOut}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-destructive/10"
            >
              {signingOut ? (
                <Loader2 className="h-4.5 w-4.5 animate-spin" />
              ) : (
                <LogOut className="h-4.5 w-4.5" />
              )}
              {signingOut ? "Signing out..." : "Sign Out"}
            </button>
          </nav>
        )}

        {/* Dynamic page children */}
        <main className="mx-auto w-full max-w-6xl flex-1 p-4 sm:p-6 md:p-8 lg:p-10">{children}</main>
      </div>
    </div>
  );
}
export type DashboardLayoutType = typeof DashboardLayout;
