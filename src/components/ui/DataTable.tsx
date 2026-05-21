"use client";
import { cn } from "@/lib/utils";
import { ChevronUp, ChevronDown } from "lucide-react";
import { useState } from "react";

export interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  className?: string;
  render: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  emptyState?: React.ReactNode;
  loading?: boolean;
  rowKey: (row: T) => string;
  stickyHeader?: boolean;
}

export function DataTable<T>({ columns, data, onRowClick, emptyState, loading, rowKey, stickyHeader }: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(d => d === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse divide-y divide-slate-100">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="px-4 py-4 flex gap-4">
            {columns.map(col => (
              <div key={col.key} className="h-4 bg-slate-100 rounded flex-1" />
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (data.length === 0 && emptyState) return <>{emptyState}</>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className={cn("border-b border-slate-200", stickyHeader && "sticky top-0 bg-white z-10")}>
          <tr>
            {columns.map(col => (
              <th
                key={col.key}
                className={cn("px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap", col.sortable && "cursor-pointer hover:text-slate-700 select-none", col.className)}
                onClick={col.sortable ? () => handleSort(col.key) : undefined}
              >
                <div className="flex items-center gap-1">
                  {col.label}
                  {col.sortable && (
                    <div className="flex flex-col">
                      <ChevronUp size={10} className={cn(sortKey === col.key && sortDir === "asc" ? "text-blue-600" : "text-slate-300")} />
                      <ChevronDown size={10} className={cn(sortKey === col.key && sortDir === "desc" ? "text-blue-600" : "text-slate-300")} />
                    </div>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.map(row => (
            <tr
              key={rowKey(row)}
              className={cn("transition-colors", onRowClick && "hover:bg-slate-50/80 cursor-pointer")}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
            >
              {columns.map(col => (
                <td key={col.key} className={cn("px-4 py-3.5 text-sm text-slate-700 whitespace-nowrap", col.className)}>
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
