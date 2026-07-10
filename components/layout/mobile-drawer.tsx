"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Moon, Sun, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer container */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 right-0 top-0 flex w-full max-w-sm flex-col border-l border-border bg-background p-6 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border pb-4">
              <span className="font-display font-bold text-foreground">Menu</span>
              <button
                onClick={onClose}
                className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label="Close drawer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Main Content Area (Aligned to the Top) */}
            <div className="flex-1 py-8 space-y-8">
              {/* Links */}
              <nav>
                <ul className="space-y-6">
                  <li>
                    <Link
                      href="/#cars"
                      onClick={onClose}
                      className="block font-display text-lg font-medium text-foreground hover:text-muted-foreground"
                    >
                      Browse Cars
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/packages"
                      onClick={onClose}
                      className="block font-display text-lg font-medium text-foreground hover:text-muted-foreground"
                    >
                      Packages & Plans
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/support"
                      onClick={onClose}
                      className="block font-display text-lg font-medium text-foreground hover:text-muted-foreground"
                    >
                      Get Support
                    </Link>
                  </li>
                </ul>
              </nav>

              {/* Actions */}
              <div className="space-y-4 border-t border-border pt-6">
                <a
                  href="tel:+919234273063"
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#25D366] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1da851]"
                  onClick={onClose}
                >
                  <Phone className="h-4 w-4" />
                  <span>Call Now: +91 92342 73063</span>
                </a>

                <a
                  href="https://wa.me/919234273063"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm font-semibold text-[#25D366] transition-colors hover:bg-green-500/20 hover:text-[#25D366]/80"
                  onClick={onClose}
                >
                  <svg
                    className="h-5 w-5 fill-[#25D366]"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.717-1.458L0 24zm6.59-4.846c1.6.95 3.197 1.451 4.887 1.452 5.4 0 9.794-4.39 9.797-9.789.002-2.614-1.012-5.071-2.858-6.917C16.581 2.055 14.122 1.04 11.512 1.04 6.115 1.04 1.72 5.43 1.718 10.83c-.001 1.69.443 3.336 1.286 4.79l-.997 3.639 3.733-.978c1.45.79 3.011 1.205 4.59 1.206-.002 0-.002 0 0 0zm10.155-7.054c-.281-.14-1.662-.82-1.924-.914-.26-.097-.45-.14-.64.14-.19.28-.737.914-.903 1.1-.167.19-.333.21-.615.07-.282-.14-1.19-.439-2.27-1.402-.84-.75-1.41-1.68-1.575-1.96-.166-.28-.018-.43.122-.57.126-.127.28-.33.42-.49.14-.16.19-.28.28-.47.09-.19.04-.35-.02-.49-.06-.14-.54-1.3-.74-1.785-.195-.47-.393-.406-.54-.413-.137-.007-.294-.008-.45-.008-.156 0-.41.06-.625.3-.216.24-.824.81-.824 1.97 0 1.16.843 2.28.96 2.44.118.16 1.658 2.53 4.016 3.55.56.24.998.38 1.34.49.563.18 1.074.15 1.478.09.45-.07 1.396-.57 1.593-1.12.197-.55.197-1.02.138-1.12-.059-.1-.22-.16-.5-.3z" />
                  </svg>
                  <span>Chat on WhatsApp</span>
                </a>

                <div className="grid grid-cols-2 gap-3">
                  <Link href="/auth/login" className="w-full" onClick={onClose}>
                    <Button variant="outline" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth/register" className="w-full" onClick={onClose}>
                    <Button className="w-full">Sign Up</Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Bottom Actions (Theme switcher only) */}
            <div className="border-t border-border pt-4">
              <button
                onClick={toggleTheme}
                className="flex w-full items-center justify-between rounded-lg bg-muted px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted/80"
              >
                <span>Change Layout Theme</span>
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
