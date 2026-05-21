import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow, isToday, isYesterday } from "date-fns";
import type { BillStatus, ServiceCategory, UserStatus, ProviderStatus, SettlementAccountStatus } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─── Currency ─────────────────────────────────────────────────────────────────

export function formatGHS(amount: number): string {
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatGHSCompact(amount: number): string {
  if (amount >= 1_000_000) return `GH₵${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `GH₵${(amount / 1_000).toFixed(1)}K`;
  return `GH₵${amount.toFixed(2)}`;
}

// ─── Dates ────────────────────────────────────────────────────────────────────

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  if (isToday(d)) return `Today, ${format(d, "h:mm a")}`;
  if (isYesterday(d)) return `Yesterday, ${format(d, "h:mm a")}`;
  return format(d, "MMM d, yyyy · h:mm a");
}

export function formatDateShort(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, "MMM d, yyyy");
}

export function formatTimeAgo(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return formatDistanceToNow(d, { addSuffix: true });
}

export function formatTimestamp(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, "MMM d, yyyy 'at' h:mm a 'GMT+0'");
}

// ─── ID Masking ───────────────────────────────────────────────────────────────

export function maskDexwinPayId(id: string): string {
  if (id.length <= 4) return id;
  return `DXW***${id.slice(-4)}`;
}

export function maskAccountNumber(num: string): string {
  if (num.length <= 4) return num;
  return `****${num.slice(-4)}`;
}

export function maskPhoneNumber(phone: string): string {
  if (phone.length <= 4) return phone;
  return `${phone.slice(0, 3)}****${phone.slice(-3)}`;
}

// ─── Status Utilities ─────────────────────────────────────────────────────────

export function getBillStatusClass(status: BillStatus): string {
  const map: Record<BillStatus, string> = {
    Draft: "badge-draft",
    Pending: "badge-pending",
    Approved: "badge-approved",
    Paid: "badge-paid",
    Failed: "badge-failed",
  };
  return map[status] ?? "badge-draft";
}

export function getUserStatusClass(status: UserStatus): string {
  const map: Record<UserStatus, string> = {
    Invited: "badge-invited",
    Active: "badge-active",
    Deactivated: "badge-deactivated",
  };
  return map[status] ?? "badge-inactive";
}

export function getProviderStatusClass(status: ProviderStatus): string {
  const map: Record<ProviderStatus, string> = {
    "Pending Admin Approval": "badge-pending",
    Active: "badge-active",
    Suspended: "badge-suspended",
    Rejected: "badge-failed",
  };
  return map[status] ?? "badge-inactive";
}

export function getAccountStatusClass(status: SettlementAccountStatus): string {
  const map: Record<SettlementAccountStatus, string> = {
    "Pending Verification": "badge-pending",
    Verified: "badge-verified",
    Failed: "badge-failed",
  };
  return map[status] ?? "badge-inactive";
}

export function getCategoryColor(category: ServiceCategory): string {
  const map: Record<ServiceCategory, string> = {
    Consultation: "bg-blue-100 text-blue-700",
    Pharmacy: "bg-violet-100 text-violet-700",
    Diagnostic: "bg-teal-100 text-teal-700",
    Procedure: "bg-orange-100 text-orange-700",
    Emergency: "bg-red-100 text-red-700",
  };
  return map[category] ?? "bg-slate-100 text-slate-700";
}

// ─── Number formatting ────────────────────────────────────────────────────────

export function formatPercent(value: number, decimals = 1): string {
  return `${value >= 0 ? "+" : ""}${value.toFixed(decimals)}%`;
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-GH").format(value);
}

// ─── Validation ───────────────────────────────────────────────────────────────

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPhoneGH(phone: string): boolean {
  return /^(\+233|0)[23589]\d{8}$/.test(phone.replace(/\s/g, ""));
}

export function isStrongPassword(password: string): boolean {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /\d/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  );
}

// ─── Misc ─────────────────────────────────────────────────────────────────────

export function generateRef(): string {
  return `DXW-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

export function pluralize(count: number, singular: string, plural?: string): string {
  return `${count} ${count === 1 ? singular : (plural ?? singular + "s")}`;
}

export function truncate(str: string, max: number): string {
  if (str.length <= max) return str;
  return str.slice(0, max - 3) + "...";
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
