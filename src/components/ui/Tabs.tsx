"use client";
import { cn } from "@/lib/utils";

interface Tab {
  id: string;
  label: string;
  count?: number;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
  variant?: "underline" | "pill";
}

export function Tabs({ tabs, activeTab, onChange, variant = "underline" }: TabsProps) {
  if (variant === "pill") {
    return (
      <div className="flex gap-1 p-1 bg-slate-100 rounded-lg w-fit">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-md transition-all",
              activeTab === tab.id
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            )}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className={cn("px-1.5 py-0.5 rounded-full text-xs", activeTab === tab.id ? "bg-slate-100 text-slate-600" : "bg-slate-200 text-slate-500")}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="flex border-b border-slate-200 gap-0">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            "flex items-center gap-1.5 px-4 py-3 text-sm font-semibold border-b-2 transition-all -mb-px",
            activeTab === tab.id
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
          )}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span className={cn("px-1.5 py-0.5 rounded-full text-xs font-bold", activeTab === tab.id ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-500")}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
