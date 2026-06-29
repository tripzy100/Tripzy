"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Car, LayoutDashboard, Calendar, Wallet, ShieldCheck, Tag, FileText, Activity, Menu, LogOut, ChevronLeft, ChevronRight, Users, ShieldAlert, Mail, Brain, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CommandPalette } from "@/components/admin/command-palette";

const adminNavItems = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Fleet CRUD", href: "/admin/fleet", icon: Car },
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

  return (
    <div className="flex min-h-screen bg-muted/10">
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex flex-col border-r border-border bg-card p-4 space-y-6 sticky top-0 h-screen transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}>
        <div className="flex items-center justify-between px-2">
          {!collapsed && (
            <Link href="/" className="flex items-center gap-2">
              <Car className="h-6 w-6 text-foreground" />
              <span className="font-display text-xl font-bold tracking-tight text-foreground">Tripzy Admin</span>
            </Link>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded hover:bg-muted text-muted-foreground ml-auto"
            aria-label="Collapse sidebar"
          >
            {collapsed ? <ChevronRight className="h-4.5 w-4.5" /> : <ChevronLeft className="h-4.5 w-4.5" />}
          </button>
        </div>

        {/* Role overview */}
        {!collapsed && (
          <div className="rounded-lg bg-muted/40 p-4 border border-border/50">
            <div className="font-semibold text-xs text-foreground font-mono uppercase tracking-wider">Sachit Bhatia</div>
            <div className="text-[10px] text-emerald-500 font-semibold mt-0.5">Super Administrator</div>
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
                className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive ? "bg-primary text-primary-foreground font-semibold" : "text-muted-foreground hover:bg-muted hover:text-foreground"
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
        <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10">
          <LogOut className="mr-2 h-4 w-4 shrink-0" /> {!collapsed && <span>Sign Out</span>}
        </Button>
      </aside>

      {/* Main Panel */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header Bar */}
        <header className="lg:hidden flex items-center justify-between border-b border-border bg-card px-6 py-4 sticky top-0 z-30">
          <Link href="/" className="flex items-center gap-2">
            <Car className="h-5 w-5 text-foreground" />
            <span className="font-display font-bold text-foreground">Tripzy Ops</span>
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground rounded"
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </header>

        {/* Mobile Nav Drawer */}
        {mobileOpen && (
          <nav className="lg:hidden border-b border-border bg-card px-6 py-4 space-y-2">
            {adminNavItems.map((item) => {
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

        <main className="flex-1 p-6 md:p-8 lg:p-10 max-w-7xl w-full mx-auto">
          {children}
          <CommandPalette />
        </main>
      </div>
    </div>
  );
}
export type AdminLayoutPropsType = { children: React.ReactNode };
