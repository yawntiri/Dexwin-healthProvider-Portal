"use client";
import { cn } from "@/lib/utils";

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  description?: string;
  size?: "sm" | "md";
}

export function Switch({ checked, onChange, disabled, label, description, size = "md" }: SwitchProps) {
  return (
    <label className={cn("flex items-center gap-3 cursor-pointer", disabled && "opacity-50 cursor-not-allowed")}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => !disabled && onChange(!checked)}
        className={cn(
          "relative rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/30",
          size === "sm" ? "w-8 h-4" : "w-11 h-6",
          checked ? "bg-blue-600" : "bg-slate-200"
        )}
      >
        <span className={cn(
          "absolute top-0.5 left-0.5 bg-white rounded-full shadow transition-transform",
          size === "sm" ? "w-3 h-3" : "w-5 h-5",
          checked && (size === "sm" ? "translate-x-4" : "translate-x-5")
        )} />
      </button>
      {(label || description) && (
        <div>
          {label && <div className="text-sm font-medium text-slate-700">{label}</div>}
          {description && <div className="text-xs text-slate-500">{description}</div>}
        </div>
      )}
    </label>
  );
}
