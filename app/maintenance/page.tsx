import { ShieldAlert } from "lucide-react";
import { siteConfig } from "@/config/site";

export const metadata = {
  title: `Under Maintenance | ${siteConfig.name}`,
  description: "Our systems are undergoing scheduled maintenance. We'll be back online shortly.",
};

export default function MaintenancePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
      <main className="mx-auto flex max-w-md flex-col items-center justify-center">
        {/* Animated server warning shield */}
        <div className="flex h-16 w-16 animate-pulse items-center justify-center rounded-full bg-amber-500/10 text-amber-500 ring-8 ring-amber-500/5">
          <ShieldAlert className="h-8 w-8" />
        </div>

        <h1 className="mt-6 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Scheduled Maintenance
        </h1>

        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          We are currently upgrading our infrastructure to provide a faster, more premium self-drive
          booking experience. We appreciate your patience and will be back online shortly.
        </p>

        <div className="mt-8 w-full border-t border-border pt-6 text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </div>
      </main>
    </div>
  );
}
