"use client";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
}

export function Checkbox({ checked, onChange, label, description, disabled }: CheckboxProps) {
  return (
    <label className={cn("flex items-start gap-3 cursor-pointer group", disabled && "opacity-50 cursor-not-allowed")}>
      <div
        className={cn(
          "w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all",
          checked
            ? "bg-blue-600 border-blue-600"
            : "bg-white border-slate-300 group-hover:border-slate-400"
        )}
        onClick={() => !disabled && onChange(!checked)}
      >
        {checked && <Check size={12} className="text-white" strokeWidth={3} />}
      </div>
      {(label || description) && (
        <div>
          {label && <div className="text-sm font-medium text-slate-700 leading-5">{label}</div>}
          {description && <div className="text-xs text-slate-500 mt-0.5">{description}</div>}
        </div>
      )}
    </label>
  );
}
