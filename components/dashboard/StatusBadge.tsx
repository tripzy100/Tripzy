import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, AlertTriangle, X, Zap, Lock } from "lucide-react";

export type DashboardStatusType =
  | "Completed"
  | "Pending"
  | "In Review"
  | "Approved"
  | "Rejected"
  | "Cancelled"
  | "Upcoming"
  | "Active"
  | "Finished"
  | "Not Started"
  | "Locked";

interface StatusBadgeProps {
  status: DashboardStatusType | string;
  className?: string;
}

export function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const normalized = (status || "").toString().trim().toUpperCase();

  if (normalized === "COMPLETED" || normalized === "APPROVED" || normalized === "FINISHED") {
    return (
      <Badge variant="success" className={`gap-1 font-semibold ${className}`}>
        <CheckCircle2 className="h-3 w-3" />
        {status}
      </Badge>
    );
  }

  if (normalized === "PENDING" || normalized === "IN REVIEW" || normalized === "IN_REVIEW" || normalized === "UPCOMING") {
    return (
      <Badge variant="warning" className={`gap-1 font-semibold ${className}`}>
        <Clock className="h-3 w-3" />
        {status === "IN_REVIEW" ? "In Review" : status}
      </Badge>
    );
  }

  if (normalized === "ACTIVE" || normalized === "ONGOING") {
    return (
      <Badge variant="info" className={`gap-1 font-semibold ${className}`}>
        <Zap className="h-3 w-3" />
        {status === "ONGOING" ? "Active" : status}
      </Badge>
    );
  }

  if (normalized === "REJECTED" || normalized === "CANCELLED" || normalized === "FAILED") {
    return (
      <Badge variant="destructive" className={`gap-1 font-semibold ${className}`}>
        <X className="h-3 w-3" />
        {status}
      </Badge>
    );
  }

  if (normalized === "LOCKED") {
    return (
      <Badge variant="outline" className={`gap-1 text-muted-foreground ${className}`}>
        <Lock className="h-3 w-3 text-muted-foreground" />
        Locked
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className={`gap-1 text-muted-foreground ${className}`}>
      <AlertTriangle className="h-3 w-3 text-muted-foreground" />
      {status || "Not Started"}
    </Badge>
  );
}
