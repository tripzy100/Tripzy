"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";
import { AuthProvider } from "@/providers/auth-provider";

// 1. Toast Type Definitions
type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextProps {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = React.createContext<ToastContextProps | undefined>(undefined);

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

// 2. Main Provider Component
export function AppProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const showToast = React.useCallback((message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <NextThemesProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <ToastContext.Provider value={{ showToast }}>
        <AuthProvider>{children}</AuthProvider>

        {/* Toast Container Overlay */}
        <div className="fixed bottom-4 right-4 z-50 flex w-full max-w-sm flex-col gap-2">
          <AnimatePresence>
            {toasts.map((toast) => (
              <motion.div
                key={toast.id}
                layout
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                className="glassmorphism flex items-start gap-3 rounded-lg p-4 shadow-lg"
              >
                <div className="mt-0.5">
                  {toast.type === "success" && (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  )}
                  {toast.type === "error" && <AlertCircle className="h-5 w-5 text-destructive" />}
                  {toast.type === "info" && <Info className="h-5 w-5 text-blue-500" />}
                </div>
                <div className="flex-1 text-sm font-medium text-foreground">{toast.message}</div>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="rounded p-0.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  aria-label="Dismiss notification"
                >
                  <X className="h-4 w-4" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </ToastContext.Provider>
    </NextThemesProvider>
  );
}
