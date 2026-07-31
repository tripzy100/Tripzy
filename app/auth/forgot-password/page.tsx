"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Car, Mail, Lock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OtpInput } from "@/components/auth/otp-input";
import { useToast } from "@/providers/app-provider";

type ForgotStep = "email" | "otp" | "reset";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [step, setStep] = React.useState<ForgotStep>("email");
  const [email, setEmail] = React.useState("");
  const [otp, setOtp] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast("Please enter a valid email address", "error");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        setStep("otp");
        showToast(data.message || "Password reset code sent to your email", "info");
      } else {
        showToast(data.message || "Failed to send reset code", "error");
      }
    } catch {
      showToast("Network error. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (code: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: code, type: "PASSWORD_RESET" }),
      });
      const data = await res.json();
      if (data.success) {
        setOtp(code);
        setStep("reset");
        showToast("OTP verified successfully. Please enter your new password.", "success");
      } else {
        showToast(data.message || "Invalid OTP code", "error");
      }
    } catch {
      showToast("Network error. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      showToast("Please fill in both password fields", "error");
      return;
    }
    if (newPassword.length < 8) {
      showToast("Password must be at least 8 characters long", "error");
      return;
    }
    if (!/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword) || !/[0-9]/.test(newPassword) || !/[^A-Za-z0-9]/.test(newPassword)) {
      showToast("Password must contain uppercase, lowercase, number, and special character", "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast("Passwords do not match", "error");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword, confirmPassword }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("Password reset successfully! Please sign in with your new password.", "success");
        router.push("/auth/login");
      } else {
        showToast(data.message || "Failed to reset password", "error");
      }
    } catch {
      showToast("Network error. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 py-12">
      <div className="w-full max-w-sm space-y-8">
        <Link href="/" className="flex items-center justify-center gap-2">
          <Car className="h-8 w-8 text-foreground" />
          <span className="font-display text-2xl font-bold tracking-tight text-foreground">
            TRIPZY
          </span>
        </Link>
        <div className="space-y-6 rounded-2xl border border-border bg-card p-8 shadow-lg">
          {step === "email" && (
            <>
              <div className="space-y-1.5 text-center">
                <h1 className="font-display text-xl font-bold text-foreground">
                  Forgot Password
                </h1>
                <p className="text-sm text-muted-foreground">
                  Enter your email address to receive a 6-digit reset code
                </p>
              </div>

              <form className="space-y-4" onSubmit={handleSendOtp}>
                <div className="space-y-2">
                  <label className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                    <Mail className="h-3.5 w-3.5" /> Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" isLoading={loading}>
                  Send Reset Code
                </Button>
              </form>
            </>
          )}

          {step === "otp" && (
            <div className="space-y-6">
              <div className="space-y-1.5 text-center">
                <h1 className="font-display text-xl font-bold text-foreground">
                  Verify Reset Code
                </h1>
                <p className="text-sm text-muted-foreground">
                  Enter the 6-digit code sent to {email}
                </p>
              </div>
              <OtpInput
                email={email}
                onVerify={handleVerifyOtp}
                onResend={async () => {
                  await fetch("/api/auth/forgot-password", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email }),
                  });
                  showToast("New code sent to your email", "info");
                }}
                onBack={() => setStep("email")}
                loading={loading}
              />
            </div>
          )}

          {step === "reset" && (
            <>
              <div className="space-y-1.5 text-center">
                <h1 className="font-display text-xl font-bold text-foreground">
                  Set New Password
                </h1>
                <p className="text-sm text-muted-foreground">
                  Choose a new strong password for your account
                </p>
              </div>

              <form className="space-y-4" onSubmit={handleResetPassword}>
                <div className="space-y-2">
                  <label className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                    <Lock className="h-3.5 w-3.5" /> New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Min 8 chars, 1 uppercase, 1 lowercase, 1 number & 1 special char.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                    <Lock className="h-3.5 w-3.5" /> Confirm New Password
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

                <Button type="submit" className="w-full" isLoading={loading}>
                  Reset Password
                </Button>
              </form>
            </>
          )}

          <p className="text-center text-xs text-muted-foreground">
            Remembered your password?{" "}
            <Link href="/auth/login" className="font-semibold text-foreground hover:underline">
              Sign In
            </Link>
          </p>
        </div>
        <Link href="/auth/login" className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:underline">
          <ArrowLeft className="h-3 w-3" /> Back to sign in
        </Link>
      </div>
    </div>
  );
}
