"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Car, Shield, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/providers/app-provider";

export default function ResetPasswordPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      showToast("Please fill in both fields", "error");
      return;
    }

    if (password !== confirmPassword) {
      showToast("Passwords do not match", "error");
      return;
    }

    if (password.length < 6) {
      showToast("Password must be at least 6 characters long", "error");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
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
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm space-y-8">
        <Link href="/" className="flex items-center justify-center gap-2">
          <Car className="h-8 w-8 text-foreground" />
          <span className="font-display text-2xl font-bold tracking-tight text-foreground">
            TRIPZY
          </span>
        </Link>
        <div className="space-y-6 rounded-2xl border border-border bg-card p-8">
          <div className="space-y-1.5 text-center">
            <h1 className="font-display text-xl font-bold text-foreground">
              Reset Password
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your new password below
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                <Shield className="h-3.5 w-3.5" /> New Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                <Shield className="h-3.5 w-3.5" /> Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                required
              />
            </div>

            <Button type="submit" className="w-full" isLoading={loading}>
              Reset Password
            </Button>
          </form>

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
