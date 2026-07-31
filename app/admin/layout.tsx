"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Car,
  LayoutDashboard,
  Calendar,
  Wallet,
  ShieldCheck,
  Tag,
  FileText,
  Activity,
  Menu,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Users,
  ShieldAlert,
  Mail,
  Brain,
  UserCheck,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CommandPalette } from "@/components/admin/command-palette";
import { useAuth } from "@/providers/auth-provider";

const adminNavItems = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Cars CRUD", href: "/admin/cars", icon: Car },
  { label: "Bookings", href: "/admin/bookings", icon: Calendar },
  { label: "Payments", href: "/admin/payments", icon: Wallet },
  { label: "KYC Queue", href: "/admin/kyc", icon: ShieldCheck },
  { label: "Approvals", href: "/admin/approvals", icon: ShieldAlert },
  { label: "Impersonation", href: "/admin/impersonation", icon: Users },
  { label: "Notification Logs", href: "/admin/notifications", icon: Mail },
  { label: "AI Observability", href: "/admin/ai", icon: Brain },
  { label: "AI Human Review", href: "/admin/ai/human-review", icon: UserCheck },
  { label: "Coupons", href: "/admin/coupons", icon: Tag },
  { label: "Blog CMS", href: "/admin/cms", icon: FileText },
  { label: "Audit Trail", href: "/admin/audits", icon: Activity },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { user, signOut } = useAuth();
  const [signingOut, setSigningOut] = React.useState(false);

  const displayName = user?.user_metadata?.name || user?.email?.split("@")[0] || "Admin";

  const handleSignOut = async () => {
    setSigningOut(true);
    await signOut();
  };

  return (
    <div className="flex min-h-screen bg-muted/10">
      {/* Desktop Sidebar */}
      <aside
        className={`sticky top-0 hidden h-screen flex-col space-y-6 border-r border-border bg-card p-4 transition-all duration-300 lg:flex ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        <div className="flex items-center justify-between px-2">
          {!collapsed && (
            <Link href="/" className="flex items-center gap-2">
              <Car className="h-6 w-6 text-foreground" />
              <span className="font-display text-xl font-bold tracking-tight text-foreground">
                Tripzy Admin
              </span>
            </Link>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="ml-auto rounded p-1 text-muted-foreground hover:bg-muted"
            aria-label="Collapse sidebar"
          >
            {collapsed ? (
              <ChevronRight className="h-4.5 w-4.5" />
            ) : (
              <ChevronLeft className="h-4.5 w-4.5" />
            )}
          </button>
        </div>

        {/* Role overview */}
        {!collapsed && (
          <div className="rounded-lg border border-border/50 bg-muted/40 p-4">
            <div className="font-mono text-xs font-semibold uppercase tracking-wider text-foreground">
              {displayName}
            </div>
            <div className="mt-0.5 text-[10px] font-semibold text-emerald-500">
              Administrator
            </div>
          </div>
        )}

        {/* Navigation list */}
        <nav className="flex-1 space-y-1">
          {adminNavItems.map((item) => {
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
                title={item.label}
              >
                <Icon className="h-4.5 w-4.5 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
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
            <Loader2 className="mr-2 h-4 w-4 shrink-0 animate-spin" />
          ) : (
            <LogOut className="mr-2 h-4 w-4 shrink-0" />
          )}
          {!collapsed && <span>{signingOut ? "Signing out..." : "Sign Out"}</span>}
        </Button>
      </aside>

      {/* Main Panel */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile Header Bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-card px-6 py-4 lg:hidden">
          <Link href="/" className="flex items-center gap-2">
            <Car className="h-5 w-5 text-foreground" />
            <span className="font-display font-bold text-foreground">Tripzy Ops</span>
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </header>

        {/* Mobile Nav Drawer */}
        {mobileOpen && (
          <nav className="space-y-2 border-b border-border bg-card px-6 py-4 lg:hidden">
            {adminNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 rounded px-3 py-2 text-sm text-foreground/80 hover:bg-muted"
                >
                  <Icon className="h-4.5 w-4.5 text-muted-foreground" /> {item.label}
                </Link>
              );
            })}
          </nav>
        )}

        <main className="mx-auto w-full max-w-7xl flex-1 p-6 md:p-8 lg:p-10">
          {children}
          <CommandPalette />
        </main>
      </div>
    </div>
  );
}
export type AdminLayoutPropsType = { children: React.ReactNode };
