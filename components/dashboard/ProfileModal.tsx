"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Save, User, Phone, Mail, Calendar, MapPin, Activity } from "lucide-react";
import { useToast } from "@/providers/app-provider";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    dateOfBirth?: string;
    gender?: string;
    street?: string;
    zipCode?: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
    emergencyContactRelationship?: string;
  };
}

export function ProfileModal({ isOpen, onClose, onSuccess, initialData }: ProfileModalProps) {
  const { showToast } = useToast();
  const [loading, setLoading] = React.useState(false);

  const [formData, setFormData] = React.useState({
    firstName: initialData?.firstName || "",
    lastName: initialData?.lastName || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    dateOfBirth: initialData?.dateOfBirth ? initialData.dateOfBirth.split("T")[0] : "",
    gender: initialData?.gender || "MALE",
    street: initialData?.street || "",
    zipCode: initialData?.zipCode || "",
    emergencyContactName: initialData?.emergencyContactName || "",
    emergencyContactPhone: initialData?.emergencyContactPhone || "",
    emergencyContactRelationship: initialData?.emergencyContactRelationship || "Parent/Spouse",
  });

  React.useEffect(() => {
    if (initialData) {
      setFormData({
        firstName: initialData.firstName || "",
        lastName: initialData.lastName || "",
        email: initialData.email || "",
        phone: initialData.phone || "",
        dateOfBirth: initialData.dateOfBirth ? initialData.dateOfBirth.split("T")[0] : "",
        gender: initialData.gender || "MALE",
        street: initialData.street || "",
        zipCode: initialData.zipCode || "",
        emergencyContactName: initialData.emergencyContactName || "",
        emergencyContactPhone: initialData.emergencyContactPhone || "",
        emergencyContactRelationship: initialData.emergencyContactRelationship || "Parent/Spouse",
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
        showToast("Profile details saved successfully!", "success");
        onSuccess();
        onClose();
      } else {
        showToast(data.message || "Failed to update profile", "error");
      }
    } catch {
      showToast("Network error updating profile", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-display text-xl font-bold text-foreground">
            <User className="h-5 w-5 text-primary" /> Complete Your Profile
          </DialogTitle>
          <DialogDescription>
            Provide your contact, address, and emergency details to verify your identity.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Name */}
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
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase text-muted-foreground flex items-center gap-1">
                <Mail className="h-3 w-3" /> Email Address
              </label>
              <input
                type="email"
                name="email"
                disabled
                value={formData.email}
                className="w-full cursor-not-allowed rounded-lg border border-input bg-muted/50 px-3 py-2 text-sm text-muted-foreground"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase text-muted-foreground flex items-center gap-1">
                <Phone className="h-3 w-3" /> Mobile Phone Number *
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
          </div>

          {/* DOB & Gender */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" /> Date of Birth *
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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
          <div className="rounded-xl border border-border/80 bg-muted/20 p-4 space-y-3">
            <h4 className="flex items-center gap-1.5 font-display text-xs font-bold uppercase text-foreground">
              <Activity className="h-3.5 w-3.5 text-rose-500" /> Emergency Contact Details
            </h4>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div>
                <label className="mb-1 block text-[11px] font-semibold text-muted-foreground">
                  Contact Name *
                </label>
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
                <label className="mb-1 block text-[11px] font-semibold text-muted-foreground">
                  Emergency Phone *
                </label>
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
                <label className="mb-1 block text-[11px] font-semibold text-muted-foreground">
                  Relationship
                </label>
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

          <div className="flex justify-end gap-3 border-t border-border pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" isLoading={loading}>
              <Save className="mr-1.5 h-4 w-4" /> Save Profile
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
