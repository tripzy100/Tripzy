"use client";

import * as React from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Car, Menu, Moon, Sun, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

import { MobileDrawer } from "./mobile-drawer";
import { useToast } from "@/providers/app-provider";

export function Header() {
  const { theme, setTheme } = useTheme();
  const { showToast } = useToast();
  const [isScrolled, setIsScrolled] = React.useState(false);

  const [isMobileOpen, setIsMobileOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    showToast(`Theme changed to ${nextTheme}`, "info");
  };

  if (!mounted) return null;

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? "border-b border-border bg-background/80 shadow-sm backdrop-blur-md"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Car className="h-6 w-6 text-foreground" />
            <span className="font-display text-xl font-bold tracking-tight text-foreground">
              TRIPZY
            </span>
          </Link>

          {/* Desktop Links */}
          <nav className="hidden items-center gap-8 lg:flex">
            <Link
              href="/cars"
              className="flex items-center gap-1 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
            >
              Explore Cars
            </Link>
            <Link
              href="/cities"
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
            >
              Locations
            </Link>
            <Link
              href="/packages"
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
            >
              Pricing plans
            </Link>
            <Link
              href="/support"
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
            >
              Support
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-4 lg:flex">
            <div className="flex items-center gap-3 rounded-xl border border-[#25D366]/20 bg-[#25D366]/10 px-3 py-1.5">
              <a
                href="https://wa.me/919234273063"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-1.5 text-xs font-semibold text-[#25D366] transition-colors hover:text-[#1da851]"
                aria-label="Chat on WhatsApp"
              >
                <svg
                  className="h-4 w-4 fill-[#25D366] transition-colors group-hover:fill-[#1da851]"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.717-1.458L0 24zm6.59-4.846c1.6.95 3.197 1.451 4.887 1.452 5.4 0 9.794-4.39 9.797-9.789.002-2.614-1.012-5.071-2.858-6.917C16.581 2.055 14.122 1.04 11.512 1.04 6.115 1.04 1.72 5.43 1.718 10.83c-.001 1.69.443 3.336 1.286 4.79l-.997 3.639 3.733-.978c1.45.79 3.011 1.205 4.59 1.206-.002 0-.002 0 0 0zm10.155-7.054c-.281-.14-1.662-.82-1.924-.914-.26-.097-.45-.14-.64.14-.19.28-.737.914-.903 1.1-.167.19-.333.21-.615.07-.282-.14-1.19-.439-2.27-1.402-.84-.75-1.41-1.68-1.575-1.96-.166-.28-.018-.43.122-.57.126-.127.28-.33.42-.49.14-.16.19-.28.28-.47.09-.19.04-.35-.02-.49-.06-.14-.54-1.3-.74-1.785-.195-.47-.393-.406-.54-.413-.137-.007-.294-.008-.45-.008-.156 0-.41.06-.625.3-.216.24-.824.81-.824 1.97 0 1.16.843 2.28.96 2.44.118.16 1.658 2.53 4.016 3.55.56.24.998.38 1.34.49.563.18 1.074.15 1.478.09.45-.07 1.396-.57 1.593-1.12.197-.55.197-1.02.138-1.12-.059-.1-.22-.16-.5-.3z" />
                </svg>
                <span>WhatsApp now</span>
              </a>

              <div className="h-3 w-px bg-[#25D366]/30" />

              <a
                href="tel:+919234273063"
                className="text-xs font-semibold text-[#25D366] transition-colors hover:text-[#1da851]"
              >
                +91 92342 73063
              </a>
            </div>
            <button
              onClick={toggleTheme}
              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            <Link href="/auth/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/auth/register">
              <Button>Register</Button>
            </Link>
          </div>

          {/* Mobile Navigation Trigger */}
          <div className="flex items-center gap-3 lg:hidden">
            <a
              href="https://wa.me/919234273063"
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-[#25D366]"
              aria-label="Chat on WhatsApp"
            >
              <svg
                className="h-5 w-5 fill-muted-foreground transition-colors group-hover:fill-[#25D366]"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.717-1.458L0 24zm6.59-4.846c1.6.95 3.197 1.451 4.887 1.452 5.4 0 9.794-4.39 9.797-9.789.002-2.614-1.012-5.071-2.858-6.917C16.581 2.055 14.122 1.04 11.512 1.04 6.115 1.04 1.72 5.43 1.718 10.83c-.001 1.69.443 3.336 1.286 4.79l-.997 3.639 3.733-.978c1.45.79 3.011 1.205 4.59 1.206-.002 0-.002 0 0 0zm10.155-7.054c-.281-.14-1.662-.82-1.924-.914-.26-.097-.45-.14-.64.14-.19.28-.737.914-.903 1.1-.167.19-.333.21-.615.07-.282-.14-1.19-.439-2.27-1.402-.84-.75-1.41-1.68-1.575-1.96-.166-.28-.018-.43.122-.57.126-.127.28-.33.42-.49.14-.16.19-.28.28-.47.09-.19.04-.35-.02-.49-.06-.14-.54-1.3-.74-1.785-.195-.47-.393-.406-.54-.413-.137-.007-.294-.008-.45-.008-.156 0-.41.06-.625.3-.216.24-.824.81-.824 1.97 0 1.16.843 2.28.96 2.44.118.16 1.658 2.53 4.016 3.55.56.24.998.38 1.34.49.563.18 1.074.15 1.478.09.45-.07 1.396-.57 1.593-1.12.197-.55.197-1.02.138-1.12-.059-.1-.22-.16-.5-.3z" />
              </svg>
            </a>

            <button
              onClick={toggleTheme}
              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            <button
              onClick={() => setIsMobileOpen(true)}
              className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Mobile Sidebar overlay */}
        <MobileDrawer
          isOpen={isMobileOpen}
          onClose={() => setIsMobileOpen(false)}
          theme={theme}
          toggleTheme={toggleTheme}
        />
      </header>

      {/* Floating Call Now Button */}
      <a
        href="tel:+919234273063"
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2.5 text-xs font-semibold text-white shadow-xl shadow-green-500/20 transition-all duration-300 hover:scale-105 hover:bg-[#1da851] active:scale-95 md:bottom-8 md:right-8 md:px-5 md:py-3 md:text-sm"
        aria-label="Call Now"
      >
        <Phone className="h-3.5 w-3.5 animate-pulse md:h-4 md:w-4" />
        <span className="hidden sm:inline">Call Now: +91 92342 73063</span>
        <span className="sm:hidden">Call Now</span>
      </a>
    </>
  );
}
