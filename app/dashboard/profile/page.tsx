"use client";

import * as React from "react";
import { Laptop, KeyRound, Save, User, Activity, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/providers/app-provider";

export default function ProfilePage() {
  const { showToast } = useToast();
  const [loading, setLoading] = React.useState(false);
  const [fetching, setFetching] = React.useState(true);

  const [formData, setFormData] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "MALE",
    street: "",
    zipCode: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelationship: "Parent/Spouse",
  });

  const [sessions, setSessions] = React.useState([
    { id: "s1", browser: "Chrome on Windows", ip: "192.168.1.1", active: true },
    { id: "s2", browser: "Safari on iPhone", ip: "10.0.0.4", active: false },
  ]);

  const loadProfile = React.useCallback(async () => {
    setFetching(true);
    try {
      const res = await fetch("/api/dashboard/status");
      const json = await res.json();
      if (json.success) {
        const { profile, user, emergencyContact } = json.data;
        const addrParts = profile?.address ? profile.address.split(",") : [];
        setFormData({
          firstName: profile?.firstName || "",
          lastName: profile?.lastName || "",
          email: user?.email || "",
          phone: user?.phone || "",
          dateOfBirth: profile?.dateOfBirth ? profile.dateOfBirth.split("T")[0] : "",
          gender: profile?.gender || "MALE",
          street: addrParts[0]?.trim() || "",
          zipCode: addrParts[1]?.trim() || "",
          emergencyContactName: emergencyContact?.name || "",
          emergencyContactPhone: emergencyContact?.phone || "",
          emergencyContactRelationship: emergencyContact?.relationship || "Parent/Spouse",
        });
      }
    } catch (err) {
      console.error("Failed to load profile:", err);
    } finally {
      setFetching(false);
    }
  }, []);

  React.useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        showToast("Profile details updated successfully!", "success");
      } else {
        showToast(data.message || "Failed to update profile", "error");
      }
    } catch (err: any) {
      showToast("Error connecting to server", "error");
    } finally {
      setLoading(false);
    }
  };

  const revokeSession = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    showToast("Session credentials revoked", "info");
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-gradient font-display text-2xl font-bold tracking-tight">
          Profile & Account Settings
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Update contact details, save emergency references, and manage active device sessions.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Profile update form */}
        <div className="rounded-xl border border-border bg-card/30 p-6 md:col-span-2">
          {fetching ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-6 w-36 rounded bg-muted" />
              <div className="grid grid-cols-2 gap-4">
                <div className="h-10 rounded bg-muted" />
                <div className="h-10 rounded bg-muted" />
                <div className="h-10 rounded bg-muted" />
                <div className="h-10 rounded bg-muted" />
              </div>
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-6">
              <h3 className="flex items-center gap-1.5 font-display text-base font-bold text-foreground">
                <User className="h-4 w-4 text-primary" /> Personal Information
              </h3>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    disabled
                    value={formData.email}
                    className="w-full cursor-not-allowed rounded-lg border border-input bg-card/50 px-3 py-2 text-sm text-muted-foreground"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">
                    Mobile Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    required
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">
                    Gender *
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>

              {/* Address */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 pt-2">
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-semibold uppercase text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> Street Address *
                  </label>
                  <input
                    type="text"
                    name="street"
                    required
                    value={formData.street}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">
                    Pincode / Zip *
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    required
                    value={formData.zipCode}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-3">
                <h4 className="flex items-center gap-1.5 font-display text-xs font-bold uppercase text-foreground">
                  <Activity className="h-3.5 w-3.5 text-rose-500" /> Emergency Contact
                </h4>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div>
                    <label className="mb-1 block text-[11px] font-semibold text-muted-foreground">Name *</label>
                    <input
                      type="text"
                      name="emergencyContactName"
                      required
                      value={formData.emergencyContactName}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-input bg-card px-3 py-1.5 text-xs text-foreground focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[11px] font-semibold text-muted-foreground">Phone *</label>
                    <input
                      type="tel"
                      name="emergencyContactPhone"
                      required
                      value={formData.emergencyContactPhone}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-input bg-card px-3 py-1.5 text-xs text-foreground focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[11px] font-semibold text-muted-foreground">Relationship</label>
                    <input
                      type="text"
                      name="emergencyContactRelationship"
                      value={formData.emergencyContactRelationship}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-input bg-card px-3 py-1.5 text-xs text-foreground focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end border-t border-border pt-4">
                <Button type="submit" isLoading={loading}>
                  <Save className="mr-1.5 h-4 w-4" /> Save Profile Modifications
                </Button>
              </div>
            </form>
          )}
        </div>

        {/* Sessions logs */}
        <div className="space-y-6 rounded-xl border border-border bg-card/30 p-6">
          <h3 className="flex items-center gap-1.5 font-display text-base font-bold text-foreground">
            <KeyRound className="h-4 w-4" /> Device Connections
          </h3>

          <div className="space-y-4">
            {sessions.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between border-b border-border/50 pb-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-sm font-semibold text-foreground">
                    <Laptop className="h-3.5 w-3.5 text-muted-foreground" /> {s.browser}
                  </div>
                  <div className="font-mono text-[10px] text-muted-foreground">{s.ip}</div>
                </div>
                {s.active ? (
                  <span className="text-[10px] font-semibold uppercase text-emerald-500">
                    Current
                  </span>
                ) : (
                  <Button
                    onClick={() => revokeSession(s.id)}
                    variant="ghost"
                    size="sm"
                    className="text-xs text-destructive hover:bg-destructive/10"
                  >
                    Revoke
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
