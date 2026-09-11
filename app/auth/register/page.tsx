"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Car, User, Mail, Lock, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OtpInput } from "@/components/auth/otp-input";
import { useToast } from "@/providers/app-provider";

type RegisterStep = "details" | "otp" | "success";

export default function RegisterPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [step, setStep] = React.useState<RegisterStep>("details");
  const [loading, setLoading] = React.useState(false);
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  const validateInputs = () => {
    if (!name.trim()) {
      showToast("Please enter your full name", "error");
      return false;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast("Please enter a valid email address", "error");
      return false;
    }
    if (!password) {
      showToast("Please enter a password", "error");
      return false;
    }
    if (password.length < 8) {
      showToast("Password must be at least 8 characters long", "error");
      return false;
    }
    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password) || !/[^A-Za-z0-9]/.test(password)) {
      showToast("Password must contain uppercase, lowercase, number, and special character", "error");
      return false;
    }
    if (password !== confirmPassword) {
      showToast("Passwords do not match", "error");
      return false;
    }
    return true;
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateInputs()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, confirmPassword }),
      });
      const data = await res.json();
      if (data.success) {
        setStep("otp");
        showToast(data.message || "Verification code sent to your email", "info");
      } else {
        showToast(data.message || "Registration failed", "error");
      }
    } catch {
      showToast("Network error. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (otp: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, type: "EMAIL_VERIFICATION" }),
      });
      const data = await res.json();
      if (data.success) {
        setStep("success");
        showToast("Email verified successfully!", "success");
        router.refresh();
        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      } else {
        showToast(data.message || "Invalid OTP verification code", "error");
      }
    } catch {
      showToast("Network error. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, type: "EMAIL_VERIFICATION" }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message || "Verification code resent to your email", "info");
      } else {
        showToast(data.message || "Failed to resend code", "error");
      }
    } catch {
      showToast("Network error. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-6 py-10 pb-28 sm:py-12 sm:pb-16">
      <div className="w-full max-w-sm space-y-8">
        <Link href="/" className="flex items-center justify-center gap-2">
          <Car className="h-8 w-8 text-foreground" />
          <span className="font-display text-2xl font-bold tracking-tight text-foreground">
            TRIPZY
          </span>
        </Link>

        <div className="overflow-hidden rounded-2xl border border-border bg-card p-8 shadow-lg">
          <AnimatePresence mode="wait">
            {step === "details" && (
              <motion.div
                key="details"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="space-y-1.5 text-center">
                  <h1 className="font-display text-xl font-bold text-foreground">
                    Create your account
                  </h1>
                  <p className="text-sm text-muted-foreground">Start your self-drive journey</p>
                </div>

                <form className="space-y-4" onSubmit={handleRegisterSubmit}>
                  <div className="space-y-2">
                    <label className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                      <User className="h-3.5 w-3.5 text-muted-foreground" /> Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                      <Mail className="h-3.5 w-3.5 text-muted-foreground" /> Email
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                      <Lock className="h-3.5 w-3.5 text-muted-foreground" /> Password
                    </label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <p className="text-[11px] text-muted-foreground">
                      Min 8 chars, 1 uppercase, 1 lowercase, 1 number & 1 special char.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                      <Lock className="h-3.5 w-3.5 text-muted-foreground" /> Confirm Password
                    </label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <Button type="submit" className="w-full mt-2" isLoading={loading}>
                    Register
                  </Button>
                </form>
              </motion.div>
            )}

            {step === "otp" && (
              <motion.div
                key="otp"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="space-y-1.5 text-center">
                  <h1 className="font-display text-xl font-bold text-foreground">
                    Verify your email
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    We sent a 6-digit verification code to your email
                  </p>
                </div>
                <OtpInput
                  email={email}
                  onVerify={handleVerifyOtp}
                  onResend={handleResendOtp}
                  onBack={() => setStep("details")}
                  loading={loading}
                />
              </motion.div>
            )}

            {step === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                className="space-y-6 text-center py-4"
              >
                <div className="flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                    <CheckCircle className="h-10 w-10 animate-bounce" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h1 className="font-display text-2xl font-bold text-foreground">
                    Email Verified!
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Account activated. Automatically logging you in...
                  </p>
                </div>
                <div className="flex justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-emerald-500" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {step !== "success" && (
          <p className="text-center text-xs text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-semibold text-foreground hover:underline">
              Sign In
            </Link>
          </p>
        )}
        <Link href="/" className="block text-center text-xs text-muted-foreground hover:underline">
          &larr; Back to home
        </Link>
      </div>
    </div>
  );
}
