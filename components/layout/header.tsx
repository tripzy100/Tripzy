"use client";

import * as React from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Car, Menu, Moon, Sun, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { MobileDrawer } from "./mobile-drawer";

export function Header() {
  const { theme, setTheme } = useTheme();
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-200 ${
          isScrolled
            ? "border-b border-border/80 bg-background/95 shadow-xs backdrop-blur-md"
            : "border-b border-border/40 bg-background/80 backdrop-blur-sm"
        }`}
      >
        <div className="mx-auto flex h-14 sm:h-16 max-w-7xl items-center justify-between px-2.5 sm:px-6 lg:px-8">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-1.5 sm:gap-2.5 group focus:outline-none shrink-0">
            <div className="flex h-7.5 w-7.5 sm:h-9 sm:w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs transition-transform duration-200 group-hover:scale-105">
              <Car className="h-4 w-4 sm:h-5 sm:w-5 stroke-[2.2]" />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-[15px] sm:text-xl font-black tracking-tight text-foreground leading-none">
                TRIPZY
              </span>
              <span className="hidden min-[380px]:inline text-[8px] sm:text-[9px] font-bold uppercase tracking-widest text-primary leading-none mt-0.5">
                Tours & Travels
              </span>
            </div>
          </Link>

          {/* Mobile Center Phone Number Badge */}
          <div className="flex flex-1 justify-center px-2 lg:hidden">
            <a
              href={`tel:${siteConfig.contact.phoneRaw}`}
              aria-label={`Call Tripzy: ${siteConfig.contact.phone}`}
              className="inline-flex items-center justify-center h-8 px-2.5 sm:px-3 rounded-full border border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-[12px] sm:text-[13px] gap-1.5 hover:bg-amber-500/20 transition-colors shadow-2xs whitespace-nowrap active:scale-95"
            >
              <Phone className="h-3.5 w-3.5 stroke-[2.2] shrink-0 text-amber-500" />
              <span className="leading-none">{siteConfig.contact.phone}</span>
            </a>
          </div>

          {/* Compact Desktop Navigation */}
          <nav className="hidden items-center gap-6 xl:gap-7 lg:flex">
            <Link
              href="/cars"
              className="text-xs sm:text-sm font-semibold text-foreground/85 transition-colors hover:text-primary"
            >
              Cars
            </Link>
            <Link
              href="/cities"
              className="text-xs sm:text-sm font-semibold text-foreground/85 transition-colors hover:text-primary"
            >
              Locations
            </Link>
            <Link
              href="/packages"
              className="text-xs sm:text-sm font-semibold text-foreground/85 transition-colors hover:text-primary"
            >
              Trips
            </Link>
            <a
              href="#how-it-works"
              className="text-xs sm:text-sm font-semibold text-foreground/85 transition-colors hover:text-primary"
            >
              How it works
            </a>
          </nav>

          {/* Desktop Right Actions: [WhatsApp Now] [Theme] [Sign In] [Register] */}
          <div className="hidden items-center gap-4 xl:gap-5 lg:flex">
            {/* WhatsApp & Call Contact Pill */}
            <div className="inline-flex h-9 items-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 dark:bg-emerald-950/40 text-[13px] font-semibold text-emerald-600 dark:text-emerald-400 shadow-2xs shrink-0 overflow-hidden">
              <a
                href={siteConfig.contact.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat with Tripzy on WhatsApp"
                className="inline-flex items-center gap-1.5 h-full px-3 transition-colors hover:bg-emerald-500/20 hover:text-emerald-700 dark:hover:text-emerald-300"
              >
                <svg
                  className="h-4 w-4 fill-current text-[#25D366]"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.717-1.458L0 24zm6.59-4.846c1.6.95 3.197 1.451 4.887 1.452 5.4 0 9.794-4.39 9.797-9.789.002-2.614-1.012-5.071-2.858-6.917C16.581 2.055 14.122 1.04 11.512 1.04 6.115 1.04 1.72 5.43 1.718 10.83c-.001 1.69.443 3.336 1.286 4.79l-.997 3.639 3.733-.978c1.45.79 3.011 1.205 4.59 1.206-.002 0-.002 0 0 0zm10.155-7.054c-.281-.14-1.662-.82-1.924-.914-.26-.097-.45-.14-.64.14-.19.28-.737.914-.903 1.1-.167.19-.333.21-.615.07-.282-.14-1.19-.439-2.27-1.402-.84-.75-1.41-1.68-1.575-1.96-.166-.28-.018-.43.122-.57.126-.127.28-.33.42-.49.14-.16.19-.28.28-.47.09-.19.04-.35-.02-.49-.06-.14-.54-1.3-.74-1.785-.195-.47-.393-.406-.54-.413-.137-.007-.294-.008-.45-.008-.156 0-.41.06-.625.3-.216.24-.824.81-.824 1.97 0 1.16.843 2.28.96 2.44.118.16 1.658 2.53 4.016 3.55.56.24.998.38 1.34.49.563.18 1.074.15 1.478.09.45-.07 1.396-.57 1.593-1.12.197-.55.197-1.02.138-1.12-.059-.1-.22-.16-.5-.3z" />
                </svg>
                <span>WhatsApp now</span>
              </a>
              <span className="h-4 w-px bg-emerald-500/30 shrink-0" aria-hidden="true" />
              <a
                href={`tel:${siteConfig.contact.phoneRaw}`}
                aria-label={`Call Tripzy: ${siteConfig.contact.phone}`}
                className="inline-flex items-center h-full px-3 font-bold transition-colors hover:bg-emerald-500/20 hover:text-emerald-700 dark:hover:text-emerald-300"
              >
                <span>{siteConfig.contact.phone}</span>
              </a>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-foreground/75 transition-colors hover:text-foreground hover:bg-muted/50 shrink-0"
              aria-label="Toggle Theme"
            >
              {mounted && theme === "dark" ? <Sun className="h-4.5 w-4.5 stroke-[1.8]" /> : <Moon className="h-4.5 w-4.5 stroke-[1.8]" />}
            </button>

            {/* Sign Up Link */}
            <Link
              href="/auth/register"
              className="text-sm font-semibold text-foreground/85 hover:text-primary transition-colors px-1 py-1 shrink-0"
            >
              Sign Up
            </Link>

            {/* Book Now Action */}
            <Link href="/auth/login" className="shrink-0">
              <Button
                size="sm"
                className="h-9 px-5 text-sm font-bold rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs transition-colors whitespace-nowrap"
              >
                Book Now
              </Button>
            </Link>
          </div>

          {/* Mobile Right: [Menu Hamburger Trigger] */}
          <div className="flex items-center lg:hidden shrink-0">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-foreground hover:bg-muted transition-colors active:scale-95"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6 stroke-[2]" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <MobileDrawer
          isOpen={isMobileOpen}
          onClose={() => setIsMobileOpen(false)}
          theme={theme}
          toggleTheme={toggleTheme}
        />
      </header>
    </>
  );
}

