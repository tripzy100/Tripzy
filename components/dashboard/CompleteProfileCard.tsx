"use client";

import * as React from "react";
import { User, CheckCircle2, UserCheck, ArrowRight, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "./StatusBadge";
import { ProfileModal } from "./ProfileModal";

interface ProfileFields {
  fullName: boolean;
  email: boolean;
  phone: boolean;
  dateOfBirth: boolean;
  gender: boolean;
  address: boolean;
  emergencyContact: boolean;
}

interface CompleteProfileCardProps {
  isProfileComplete: boolean;
  profileCompletionPercentage: number;
  completedFieldsCount: number;
  totalFields: number;
  profileFields: ProfileFields;
  initialData?: any;
  onRefresh: () => void;
}

export function CompleteProfileCard({
  isProfileComplete,
  profileCompletionPercentage,
  completedFieldsCount,
  totalFields,
  profileFields,
  initialData,
  onRefresh,
}: CompleteProfileCardProps) {
  const [modalOpen, setModalOpen] = React.useState(false);

  const status = isProfileComplete
    ? "Completed"
    : completedFieldsCount > 0
    ? "Pending"
    : "Not Started";

  const fieldsList = [
    { key: "fullName", label: "Full Name", done: profileFields?.fullName },
    { key: "email", label: "Email Address", done: profileFields?.email },
    { key: "phone", label: "Mobile Number", done: profileFields?.phone },
    { key: "dateOfBirth", label: "Date of Birth", done: profileFields?.dateOfBirth },
    { key: "gender", label: "Gender", done: profileFields?.gender },
    { key: "address", label: "Address", done: profileFields?.address },
    { key: "emergencyContact", label: "Emergency Contact", done: profileFields?.emergencyContact },
  ];

  return (
    <>
      <div className="flex flex-col justify-between space-y-6 rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:border-border/80">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="rounded-xl bg-primary/10 p-2 text-primary dark:bg-primary/20">
                <User className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display text-base font-bold text-foreground">1. Complete Profile</h3>
                <p className="text-xs text-muted-foreground">Personal & contact details</p>
              </div>
            </div>
            <StatusBadge status={status} />
          </div>

          {/* Completion Progress Gauge */}
          <div className="space-y-2 rounded-xl bg-muted/40 p-4">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-muted-foreground">Profile Completion</span>
              <span className="font-mono text-sm font-bold text-foreground">
                {profileCompletionPercentage}% ({completedFieldsCount}/{totalFields})
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className={`h-full transition-all duration-500 ${
                  isProfileComplete ? "bg-emerald-500" : "bg-primary"
                }`}
                style={{ width: `${profileCompletionPercentage}%` }}
              />
            </div>
          </div>

          {/* Checklist of required 7 fields */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            {fieldsList.map((f) => (
              <div
                key={f.key}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 transition-colors ${
                  f.done
                    ? "bg-emerald-500/5 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                    : "bg-muted/30 text-muted-foreground"
                }`}
              >
                <CheckCircle2
                  className={`h-3.5 w-3.5 flex-shrink-0 ${
                    f.done ? "text-emerald-500" : "text-muted-foreground/40"
                  }`}
                />
                <span className="truncate font-medium">{f.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 border-t border-border/50">
          {isProfileComplete ? (
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-500">
                <UserCheck className="h-4 w-4" /> Profile Verified & Ready
              </span>
              <Button size="sm" variant="outline" onClick={() => setModalOpen(true)}>
                <Edit2 className="mr-1 h-3.5 w-3.5" /> Edit Profile
              </Button>
            </div>
          ) : (
            <Button className="w-full" onClick={() => setModalOpen(true)}>
              Complete Profile <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <ProfileModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={onRefresh}
        initialData={initialData}
      />
    </>
  );
}
