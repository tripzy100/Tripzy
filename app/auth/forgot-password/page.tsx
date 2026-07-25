"use client";

import * as React from "react";
import Link from "next/link";
import { Car, Mail, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/providers/app-provider";

export default function ForgotPasswordPage() {
  const { showToast } = useToast();
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      showToast("Please enter your email address", "error");
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
        setSuccess(true);
        showToast("Password reset email sent!", "success");
      } else {
        showToast(data.message || "Failed to send reset link", "error");
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
              Forgot Password
            </h1>
            <p className="text-sm text-muted-foreground">
              {success
                ? "Check your inbox for a password reset link"
                : "Enter your email to receive a password reset link"}
            </p>
          </div>

          {!success ? (
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                  <Mail className="h-3.5 w-3.5" /> Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>
              <Button type="submit" className="w-full" isLoading={loading}>
                Send Reset Link
              </Button>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <div className="rounded-lg bg-green-500/10 p-3 text-xs font-medium text-green-600 dark:text-green-400">
                A password reset email has been sent to <strong>{email}</strong>. Please follow the instructions in the email to reset your password.
              </div>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setSuccess(false)}
              >
                Resend Link
              </Button>
            </div>
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
