"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Phone } from "lucide-react";
import { siteConfig } from "@/config/site";

export function WhatsAppFloatingButton() {
  const pathname = usePathname();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Detect pages with mobile sticky bottom action bars to avoid overlay collision
  const isVehicleDetailPage = pathname && pathname.startsWith("/cars/") && pathname !== "/cars";
  const isCheckoutPage = pathname && pathname.startsWith("/checkout");

  // Bottom positioning logic:
  // When mobile sticky booking bar is active (< 1024px on vehicle detail or checkout), elevate above bar
  const bottomClass = isVehicleDetailPage || isCheckoutPage
    ? "bottom-20 lg:bottom-6"
    : "bottom-5 sm:bottom-6";

  return (
    <aside aria-label="Customer direct call support" className="contents">
      <a
        href={`tel:${siteConfig.contact.phoneRaw}`}
        aria-label={`Call Tripzy at ${siteConfig.contact.phone}`}
        className={`fixed ${bottomClass} right-3 sm:right-6 z-40 inline-flex items-center gap-2 rounded-full bg-[#22c55e] hover:bg-[#16a34a] text-white px-3.5 py-2.5 sm:px-5 sm:py-3 text-xs sm:text-base font-bold shadow-xl shadow-emerald-600/30 transition-all duration-300 hover:scale-105 active:scale-95 group cursor-pointer`}
      >
        <Phone className="h-3.5 w-3.5 sm:h-5 sm:w-5 fill-none stroke-[2.5] shrink-0" />
        <span className="whitespace-nowrap tracking-wide">
          <span className="hidden min-[380px]:inline">Call Now: </span>
          <span className="min-[380px]:hidden">Call: </span>
          {siteConfig.contact.phone}
        </span>
      </a>
    </aside>
  );
}

