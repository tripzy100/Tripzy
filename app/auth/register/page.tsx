"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Car, User, Mail, Shield, Smartphone, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OtpInput } from "@/components/auth/otp-input";
import { useToast } from "@/providers/app-provider";

type RegisterStep = "form" | "otp" | "success";

export default function RegisterPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [step, setStep] = React.useState<RegisterStep>("form");
  const [loading, setLoading] = React.useState(false);
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !password) {
      showToast("Please fill in all fields", "error");
      return;
    }
    if (password.length < 8) {
      showToast("Password must be at least 8 characters", "error");
      return;
    }
    if (!/^\+?\d{10,15}$/.test(phone)) {
      showToast("Please enter a valid phone number", "error");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: phone, type: "PHONE_VERIFICATION" }),
      });
      const data = await res.json();
      if (data.success) {
        setStep("otp");
        showToast("OTP sent to your phone", "info");
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
    try {
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: phone, otp, type: "PHONE_VERIFICATION" }),
      });
      const data = await res.json();
      if (data.success) {
        await completeRegistration();
      } else {
        showToast(data.message || "Invalid OTP", "error");
      }
    } catch {
      showToast("Network error. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const completeRegistration = async () => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password }),
      });
      const data = await res.json();
      if (data.success) {
        setStep("success");
        showToast("Account created successfully!", "info");
        setTimeout(() => router.push("/auth/login"), 2000);
      } else {
        showToast(data.message || "Registration failed", "error");
      }
    } catch {
      showToast("Network error. Please try again.", "error");
    }
  };

  const handleResendOtp = async () => {
    try {
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: phone, type: "PHONE_VERIFICATION" }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("OTP resent", "info");
      } else {
        showToast(data.message || "Failed to resend OTP", "error");
      }
    } catch {
      showToast("Network error", "error");
    }
  };

  if (step === "success") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6">
        <div className="w-full max-w-sm space-y-6 text-center">
          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
              <CheckCircle className="h-8 w-8" />
            </div>
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground">Account Created!</h1>
          <p className="text-sm text-muted-foreground">Redirecting you to sign in...</p>
        </div>
      </div>
    );
  }

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
          {step === "form" && (
            <>
              <div className="space-y-1.5 text-center">
                <h1 className="font-display text-xl font-bold text-foreground">
                  Create your account
                </h1>
                <p className="text-sm text-muted-foreground">Start your self-drive journey</p>
              </div>

              <form className="space-y-4" onSubmit={handleSendOtp}>
                <div className="space-y-2">
                  <label className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                    <User className="h-3.5 w-3.5" /> Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                    <Mail className="h-3.5 w-3.5" /> Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                    <Smartphone className="h-3.5 w-3.5" /> Phone
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                    <Shield className="h-3.5 w-3.5" /> Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a strong password"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <Button type="submit" className="w-full" isLoading={loading}>
                  Send OTP
                </Button>
              </form>
            </>
          )}

          {step === "otp" && (
            <>
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
                onBack={() => setStep("form")}
                loading={loading}
              />
            </>
          )}
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Already have an account?{" "}
          <Link href="/auth/login" className="font-semibold text-foreground hover:underline">
            Sign In
          </Link>
        </p>
        <Link href="/" className="block text-center text-xs text-muted-foreground hover:underline">
          &larr; Back to home
        </Link>
      </div>
    </div>
  );
}
