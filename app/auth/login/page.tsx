"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Car, Mail, Shield, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OtpInput } from "@/components/auth/otp-input";
import { useToast } from "@/providers/app-provider";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = React.useState<string | null>(null);
  const [showOtpScreen, setShowOtpScreen] = React.useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast("Please enter both email and password", "error");
      return;
    }

    setLoading(true);
    setUnverifiedEmail(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (data.success) {
        showToast("Signed in successfully!", "success");
        const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
        router.refresh();
        setTimeout(() => {
          router.push(callbackUrl);
        }, 100);
      } else if (data.requiresVerification) {
        setUnverifiedEmail(data.email || email);
        showToast("Please verify your email before logging in.", "error");
      } else {
        showToast(data.message || "Invalid credentials", "error");
      }
    } catch {
      showToast("Network error. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    const targetEmail = unverifiedEmail || email;
    if (!targetEmail) return;

    setLoading(true);
    try {
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: targetEmail, type: "EMAIL_VERIFICATION" }),
      });
      const data = await res.json();
      if (data.success) {
        setShowOtpScreen(true);
        showToast("Verification code sent to your email", "info");
      } else {
        showToast(data.message || "Failed to send verification code", "error");
      }
    } catch {
      showToast("Network error. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (otp: string) => {
    const targetEmail = unverifiedEmail || email;
    setLoading(true);
    try {
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: targetEmail, otp, type: "EMAIL_VERIFICATION" }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("Email verified successfully! Logging you in...", "success");
        router.refresh();
        setTimeout(() => {
          router.push("/dashboard");
        }, 800);
      } else {
        showToast(data.message || "Invalid verification code", "error");
      }
    } catch {
      showToast("Network error. Please try again.", "error");
    } finally {
      setLoading(false);
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
        <div className="space-y-6 rounded-2xl border border-border bg-card p-8 shadow-lg">
          {showOtpScreen ? (
            <div className="space-y-6">
              <div className="space-y-1.5 text-center">
                <h1 className="font-display text-xl font-bold text-foreground">Verify Your Email</h1>
                <p className="text-sm text-muted-foreground">
                  Enter the 6-digit code sent to {unverifiedEmail || email}
                </p>
              </div>
              <OtpInput
                email={unverifiedEmail || email}
                onVerify={handleVerifyOtp}
                onResend={handleResendCode}
                onBack={() => setShowOtpScreen(false)}
                loading={loading}
              />
            </div>
          ) : (
            <>
              <div className="space-y-1.5 text-center">
                <h1 className="font-display text-xl font-bold text-foreground">Welcome back</h1>
                <p className="text-sm text-muted-foreground">Sign in to manage your rentals</p>
              </div>

              {unverifiedEmail && (
                <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-600 dark:text-amber-400 space-y-2">
                  <div className="flex items-center gap-2 font-semibold">
                    <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                    Please verify your email before logging in.
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full text-xs h-8 border-amber-500/30 hover:bg-amber-500/20"
                    onClick={handleResendCode}
                    isLoading={loading}
                  >
                    Resend Verification Code
                  </Button>
                </div>
              )}

              <form className="space-y-4" onSubmit={handleLogin}>
                <div className="space-y-2">
                  <label className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                    <Mail className="h-3.5 w-3.5" /> Email
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
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                      <Shield className="h-3.5 w-3.5" /> Password
                    </label>
                    <Link
                      href="/auth/forgot-password"
                      className="text-xs font-medium text-foreground/80 hover:text-foreground hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <Button type="submit" className="w-full" isLoading={loading}>
                  Sign In
                </Button>
              </form>
              <p className="text-center text-xs text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link href="/auth/register" className="font-semibold text-foreground hover:underline">
                  Register
                </Link>
              </p>
            </>
          )}
        </div>
        <Link href="/" className="block text-center text-xs text-muted-foreground hover:underline">
          &larr; Back to home
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground text-sm">Loading portal...</div>}>
      <LoginContent />
    </React.Suspense>
  );
}
