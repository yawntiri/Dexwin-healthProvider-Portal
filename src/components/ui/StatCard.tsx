import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  change?: number;
  period?: string;
  icon?: LucideIcon;
  iconColor?: string;
  onClick?: () => void;
  loading?: boolean;
  className?: string;
}

export function StatCard({ label, value, change, period, icon: Icon, iconColor = "text-blue-600", onClick, loading, className }: StatCardProps) {
  return (
    <div
      className={cn("card p-5", onClick && "hover:shadow-md hover:border-slate-300 cursor-pointer transition-all", className)}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-sm font-medium text-slate-500">{label}</span>
        {Icon && (
          <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center">
            <Icon size={18} className={iconColor} />
          </div>
        )}
      </div>
      {loading ? (
        <div className="skeleton h-8 w-32 rounded mb-2" />
      ) : (
        <div className="text-2xl font-bold text-slate-900 tabular-nums mb-1">{value}</div>
      )}
      {(change !== undefined || period) && (
        <div className="flex items-center gap-1.5">
          {change !== undefined && (
            <span className={cn("flex items-center gap-0.5 text-xs font-semibold", change >= 0 ? "text-emerald-600" : "text-red-500")}>
              {change >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {Math.abs(change).toFixed(1)}%
            </span>
          )}
          {period && <span className="text-xs text-slate-400">vs last period</span>}
        </div>
      )}
    </div>
  );
}
