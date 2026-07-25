"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Car, User, Mail, Shield, Smartphone, CheckCircle, ArrowLeft, Lock, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OtpInput } from "@/components/auth/otp-input";
import { useToast } from "@/providers/app-provider";

type RegisterStep = "details" | "otp" | "password" | "success";

export default function RegisterPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [step, setStep] = React.useState<RegisterStep>("details");
  const [loading, setLoading] = React.useState(false);
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) {
      showToast("Please fill in all fields", "error");
      return;
    }

    const cleanPhone = phone.replace(/[\s-]/g, "");
    if (!/^\+?\d{10,15}$/.test(cleanPhone)) {
      showToast("Please enter a valid phone number", "error");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast("Please enter a valid email address", "error");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: cleanPhone, type: "PHONE_VERIFICATION" }),
      });
      const data = await res.json();
      if (data.success) {
        setStep("otp");
        showToast("OTP sent to your mobile number", "info");
      } else {
        showToast(data.message || "Failed to send OTP", "error");
      }
    } catch {
      showToast("Network error. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (otp: string) => {
    setLoading(true);
    const cleanPhone = phone.replace(/[\s-]/g, "");
    try {
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: cleanPhone, otp, type: "PHONE_VERIFICATION" }),
      });
      const data = await res.json();
      if (data.success) {
        setStep("password");
        showToast("Phone verified successfully!", "success");
      } else {
        showToast(data.message || "Invalid OTP", "error");
      }
    } catch {
      showToast("Network error. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      showToast("Please choose a password", "error");
      return;
    }
    if (password.length < 8) {
      showToast("Password must be at least 8 characters", "error");
      return;
    }

    setLoading(true);
    const cleanPhone = phone.replace(/[\s-]/g, "");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone: cleanPhone, password }),
      });
      const data = await res.json();
      if (data.success) {
        setStep("success");
        showToast("Account created successfully!", "success");
        setTimeout(() => {
          router.push("/dashboard");
          router.refresh();
        }, 1500);
      } else {
        showToast(data.message || "Registration failed", "error");
      }
    } catch {
      showToast("Network error. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    const cleanPhone = phone.replace(/[\s-]/g, "");
    try {
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: cleanPhone, type: "PHONE_VERIFICATION" }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("OTP resent to your mobile number", "info");
      } else {
        showToast(data.message || "Failed to resend OTP", "error");
      }
    } catch {
      showToast("Network error", "error");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6">
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

                <form className="space-y-4" onSubmit={handleSendOtp}>
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
                      placeholder="you@example.com"
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                      <Smartphone className="h-3.5 w-3.5 text-muted-foreground" /> Phone
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <Button type="submit" className="w-full mt-2" isLoading={loading}>
                    Send OTP <ArrowRight className="ml-2 h-4 w-4" />
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
                    Verify your phone
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    We sent a code to your mobile number
                  </p>
                </div>
                <OtpInput
                  phone={phone}
                  onVerify={handleVerifyOtp}
                  onResend={handleResendOtp}
                  onBack={() => setStep("details")}
                  loading={loading}
                />
              </motion.div>
            )}

            {step === "password" && (
              <motion.div
                key="password"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => setStep("details")}
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                  >
                    <ArrowLeft className="h-3 w-3" /> Change details
                  </button>
                  <h1 className="font-display text-xl font-bold text-foreground text-center">
                    Secure your account
                  </h1>
                  <p className="text-sm text-muted-foreground text-center">
                    Choose a strong password for logging in
                  </p>
                </div>

                <form className="space-y-4" onSubmit={handleCreateAccount}>
                  <div className="space-y-2">
                    <label className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                      <Lock className="h-3.5 w-3.5 text-muted-foreground" /> Choose Password
                    </label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 8 characters"
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <Button type="submit" className="w-full mt-2" isLoading={loading}>
                    Create Account
                  </Button>
                </form>
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
                    Account Created!
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Automatically logging you in...
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
