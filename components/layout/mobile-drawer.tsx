"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Moon,
  Sun,
  Phone,
  Car,
  MapPin,
  Plane,
  Compass,
  HelpCircle,
  User,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  theme: string | undefined;
  toggleTheme: () => void;
}

export function MobileDrawer({ isOpen, onClose, theme, toggleTheme }: MobileDrawerProps) {
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const navLinks = [
    { href: "/cars", label: "Browse Cars", icon: Car, desc: "Verified self-drive fleet" },
    { href: "/cities", label: "Pickup Locations", icon: MapPin, desc: "Hubs across Ranchi" },
    { href: "/airports", label: "Airport Rentals", icon: Plane, desc: "Birsa Munda Airport" },
    { href: "/packages", label: "Packages & Outstation", icon: Compass, desc: "Multi-day road trips" },
    { href: "/dashboard", label: "My Bookings", icon: Calendar, desc: "Manage active trips" },
    { href: "/support", label: "24/7 Support & FAQs", icon: HelpCircle, desc: "Assistance & roadside help" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
          />

          {/* Drawer container */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 right-0 top-0 z-50 flex w-full max-w-xs sm:max-w-sm flex-col border-l border-border bg-background text-foreground p-5 sm:p-6 shadow-2xl overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/70 pb-4">
              <Link href="/" onClick={onClose} className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Car className="h-4.5 w-4.5 stroke-[2.2]" />
                </div>
                <div className="flex flex-col">
                  <span className="font-display font-black text-base tracking-tight text-foreground leading-none">
                    TRIPZY
                  </span>
                  <span className="text-[8px] font-bold uppercase tracking-wider text-primary leading-none mt-0.5">
                    Self Drive Rentals
                  </span>
                </div>
              </Link>
              <button
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                aria-label="Close drawer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Quick Auth Actions */}
            <div className="grid grid-cols-2 gap-2 pt-4">
              <Link href="/auth/login" className="w-full" onClick={onClose}>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full font-bold text-xs h-9 rounded-xl flex items-center justify-center gap-1.5"
                >
                  <User className="h-3.5 w-3.5" />
                  <span>Sign In</span>
                </Button>
              </Link>
              <Link href="/auth/register" className="w-full" onClick={onClose}>
                <Button
                  size="sm"
                  className="w-full font-bold text-xs h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <User className="h-3.5 w-3.5" />
                  <span>Sign Up</span>
                </Button>
              </Link>
            </div>

            {/* Main Navigation Links */}
            <div className="flex-1 py-5 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground px-1">
                Explore & Travel
              </span>
              <nav className="space-y-1 pt-1">
                {navLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-foreground transition-colors hover:bg-muted/80 hover:text-primary group"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                        <Icon className="h-4 w-4 stroke-[2]" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold leading-tight">{item.label}</span>
                        <span className="text-[11px] text-muted-foreground leading-tight">{item.desc}</span>
                      </div>
                    </Link>
                  );
                })}
              </nav>

              {/* Instant CTAs */}
              <div className="space-y-2.5 border-t border-border/70 pt-4 mt-4">
                <a
                  href={`tel:${siteConfig.contact.phoneRaw}`}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500/15 border border-amber-500/30 px-4 py-2.5 text-xs font-bold text-amber-600 dark:text-amber-400 transition-colors hover:bg-amber-500/25"
                  onClick={onClose}
                >
                  <Phone className="h-4 w-4 stroke-[2.2]" />
                  <span>Call Us: {siteConfig.contact.phone}</span>
                </a>

                <a
                  href={siteConfig.contact.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 transition-colors hover:bg-emerald-500/20"
                  onClick={onClose}
                >
                  <svg
                    className="h-4 w-4 fill-current text-[#25D366]"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.717-1.458L0 24zm6.59-4.846c1.6.95 3.197 1.451 4.887 1.452 5.4 0 9.794-4.39 9.797-9.789.002-2.614-1.012-5.071-2.858-6.917C16.581 2.055 14.122 1.04 11.512 1.04 6.115 1.04 1.72 5.43 1.718 10.83c-.001 1.69.443 3.336 1.286 4.79l-.997 3.639 3.733-.978c1.45.79 3.011 1.205 4.59 1.206-.002 0-.002 0 0 0zm10.155-7.054c-.281-.14-1.662-.82-1.924-.914-.26-.097-.45-.14-.64.14-.19.28-.737.914-.903 1.1-.167.19-.333.21-.615.07-.282-.14-1.19-.439-2.27-1.402-.84-.75-1.41-1.68-1.575-1.96-.166-.28-.018-.43.122-.57.126-.127.28-.33.42-.49.14-.16.19-.28.28-.47.09-.19.04-.35-.02-.49-.06-.14-.54-1.3-.74-1.785-.195-.47-.393-.406-.54-.413-.137-.007-.294-.008-.45-.008-.156 0-.41.06-.625.3-.216.24-.824.81-.824 1.97 0 1.16.843 2.28.96 2.44.118.16 1.658 2.53 4.016 3.55.56.24.998.38 1.34.49.563.18 1.074.15 1.478.09.45-.07 1.396-.57 1.593-1.12.197-.55.197-1.02.138-1.12-.059-.1-.22-.16-.5-.3z" />
                  </svg>
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Bottom Actions (Theme switcher) */}
            <div className="border-t border-border/70 pt-4">
              <button
                onClick={toggleTheme}
                className="flex w-full min-h-[44px] items-center justify-between rounded-xl bg-muted/60 px-4 py-2.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
              >
                <span>Theme Mode</span>
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  {theme === "dark" ? (
                    <>
                      <span>Dark</span>
                      <Moon className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      <span>Light</span>
                      <Sun className="h-4 w-4" />
                    </>
                  )}
                </span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
