"use client";
import { cn } from "@/lib/utils";
import type { BillStatus, UserStatus, ProviderStatus, ServiceStatus } from "@/lib/types";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "draft" | "pending" | "approved" | "paid" | "failed" | "active" | "inactive" | "suspended" | "invited" | "deactivated" | "verified" | "owner" | "manager" | "staff";
  className?: string;
  dot?: boolean;
}

const variantStyles: Record<string, string> = {
  default: "bg-slate-100 text-slate-600",
  draft: "bg-slate-100 text-slate-600",
  pending: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  approved: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  paid: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  failed: "bg-red-50 text-red-700 ring-1 ring-red-200",
  active: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  inactive: "bg-slate-100 text-slate-500",
  suspended: "bg-orange-50 text-orange-700 ring-1 ring-orange-200",
  invited: "bg-violet-50 text-violet-700 ring-1 ring-violet-200",
  deactivated: "bg-slate-100 text-slate-400",
  verified: "bg-teal-50 text-teal-700 ring-1 ring-teal-200",
  owner: "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200",
  manager: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  staff: "bg-slate-100 text-slate-600",
};

const dotColors: Record<string, string> = {
  pending: "bg-amber-500",
  approved: "bg-blue-500",
  paid: "bg-emerald-500",
  failed: "bg-red-500",
  active: "bg-emerald-500",
  suspended: "bg-orange-500",
  invited: "bg-violet-500",
};

export function Badge({ children, variant = "default", className, dot }: BadgeProps) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold", variantStyles[variant], className)}>
      {dot && dotColors[variant] && (
        <span className={cn("w-1.5 h-1.5 rounded-full", dotColors[variant])} />
      )}
      {children}
    </span>
  );
}

export function BillStatusBadge({ status }: { status: BillStatus }) {
  return <Badge variant={status.toLowerCase() as never}>{status}</Badge>;
}

export function UserStatusBadge({ status }: { status: UserStatus }) {
  return <Badge variant={status.toLowerCase() as never}>{status}</Badge>;
}

export function ProviderStatusBadge({ status }: { status: ProviderStatus }) {
  const variant = status === "Active" ? "active" : status === "Suspended" ? "suspended" : status === "Rejected" ? "failed" : "pending";
  return <Badge variant={variant}>{status}</Badge>;
}

export function RoleBadge({ role }: { role: string }) {
  return <Badge variant={role.toLowerCase() as never}>{role}</Badge>;
}

export function ServiceStatusBadge({ status }: { status: ServiceStatus }) {
  return <Badge variant={status.toLowerCase() as never}>{status}</Badge>;
}
