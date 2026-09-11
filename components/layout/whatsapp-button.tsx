"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
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
    ? "bottom-[calc(5rem+env(safe-area-inset-bottom))] lg:bottom-6"
    : "bottom-[calc(1.25rem+env(safe-area-inset-bottom))] sm:bottom-6";

  return (
    <aside aria-label="WhatsApp quick chat" className="contents">
      <a
        href={siteConfig.contact.whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Tripzy on WhatsApp"
        className={`fixed ${bottomClass} right-4 sm:right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl shadow-emerald-600/30 transition-all duration-300 hover:scale-110 hover:bg-[#20bd5a] hover:shadow-2xl active:scale-95 group focus:outline-none focus:ring-4 focus:ring-emerald-500/30`}
      >
        <span className="sr-only">Chat on WhatsApp</span>
        {/* Animated pulse ring */}
        <span className="absolute -inset-0.5 rounded-full bg-[#25D366]/40 animate-ping pointer-events-none opacity-75 group-hover:opacity-100" />
        
        <svg
          className="h-7 w-7 fill-current relative z-10 transition-transform duration-300 group-hover:scale-105"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.717-1.458L0 24zm6.59-4.846c1.6.95 3.197 1.451 4.887 1.452 5.4 0 9.794-4.39 9.797-9.789.002-2.614-1.012-5.071-2.858-6.917C16.581 2.055 14.122 1.04 11.512 1.04 6.115 1.04 1.72 5.43 1.718 10.83c-.001 1.69.443 3.336 1.286 4.79l-.997 3.639 3.733-.978c1.45.79 3.011 1.205 4.59 1.206-.002 0-.002 0 0 0zm10.155-7.054c-.281-.14-1.662-.82-1.924-.914-.26-.097-.45-.14-.64.14-.19.28-.737.914-.903 1.1-.167.19-.333.21-.615.07-.282-.14-1.19-.439-2.27-1.402-.84-.75-1.41-1.68-1.575-1.96-.166-.28-.018-.43.122-.57.126-.127.28-.33.42-.49.14-.16.19-.28.28-.47.09-.19.04-.35-.02-.49-.06-.14-.54-1.3-.74-1.785-.195-.47-.393-.406-.54-.413-.137-.007-.294-.008-.45-.008-.156 0-.41.06-.625.3-.216.24-.824.81-.824 1.97 0 1.16.843 2.28.96 2.44.118.16 1.658 2.53 4.016 3.55.56.24.998.38 1.34.49.563.18 1.074.15 1.478.09.45-.07 1.396-.57 1.593-1.12.197-.55.197-1.02.138-1.12-.059-.1-.22-.16-.5-.3z" />
        </svg>
      </a>
    </aside>
  );
}
