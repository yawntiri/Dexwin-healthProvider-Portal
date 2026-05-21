"use client";

import { useState, useMemo } from "react";
import { mockAuditEntries, currentUser } from "@/lib/mock-data";
import { formatDate, cn } from "@/lib/utils";
import type { AuditEntry, AuditEventCategory } from "@/lib/types";
import {
  Shield, Search, Download, X, Filter, ShieldAlert, Activity,
  User, Settings, CreditCard, Users, Lock, FileText, Eye,
  BarChart3, HeadphonesIcon, Building2, ChevronRight, ArrowUpDown
} from "lucide-react";

const isOwnerOrManager = currentUser.role === "Owner" || currentUser.role === "Manager";

const CATEGORIES: AuditEventCategory[] = [
  "Registration", "Profile", "Settlement Account", "Team", "Security",
  "Service Catalog", "Bill", "Patient", "Report", "Support"
];

const categoryConfig: Record<AuditEventCategory, { icon: React.ElementType; color: string; bg: string }> = {
  Registration: { icon: Building2, color: "text-blue-600", bg: "bg-blue-50" },
  Profile: { icon: Settings, color: "text-slate-600", bg: "bg-slate-100" },
  "Settlement Account": { icon: CreditCard, color: "text-emerald-600", bg: "bg-emerald-50" },
  Team: { icon: Users, color: "text-violet-600", bg: "bg-violet-50" },
  Security: { icon: Lock, color: "text-red-600", bg: "bg-red-50" },
  "Service Catalog": { icon: FileText, color: "text-orange-600", bg: "bg-orange-50" },
  Bill: { icon: Activity, color: "text-blue-600", bg: "bg-blue-50" },
  Patient: { icon: User, color: "text-teal-600", bg: "bg-teal-50" },
  Report: { icon: BarChart3, color: "text-indigo-600", bg: "bg-indigo-50" },
  Support: { icon: HeadphonesIcon, color: "text-pink-600", bg: "bg-pink-50" },
};

const roleColors: Record<string, string> = {
  Owner: "bg-indigo-50 text-indigo-700",
  Manager: "bg-blue-50 text-blue-700",
  Staff: "bg-slate-100 text-slate-600",
  System: "bg-amber-50 text-amber-700",
};

export default function AuditTrailPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<AuditEventCategory | "">("");
  const [actorFilter, setActorFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [exportToast, setExportToast] = useState("");

  if (!isOwnerOrManager) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center mb-4">
          <ShieldAlert size={22} className="text-red-500" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 mb-2">Access Restricted</h2>
        <p className="text-slate-500 text-sm max-w-xs">The Audit Trail is available to Owners and Managers only. This access attempt has been logged.</p>
      </div>
    );
  }

  const uniqueActors = useMemo(() => {
    const actors = [...new Set(mockAuditEntries.map(e => e.actorName))];
    return actors.sort();
  }, []);

  const filtered = useMemo(() => {
    return mockAuditEntries
      .filter(entry => {
        if (categoryFilter && entry.eventCategory !== categoryFilter) return false;
        if (actorFilter && entry.actorName !== actorFilter) return false;
        if (dateFrom && entry.timestamp < new Date(dateFrom)) return false;
        if (dateTo && entry.timestamp > new Date(dateTo + "T23:59:59")) return false;
        if (search) {
          const q = search.toLowerCase();
          return (
            entry.eventType.toLowerCase().includes(q) ||
            entry.actorName.toLowerCase().includes(q) ||
            (entry.affectedResource ?? "").toLowerCase().includes(q) ||
            entry.eventCategory.toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }, [search, categoryFilter, actorFilter, dateFrom, dateTo]);

  const handleExport = (fmt: "CSV" | "PDF") => {
    setExportToast(`Exporting ${filtered.length} audit entries as ${fmt}…`);
    setTimeout(() => setExportToast(""), 3000);
  };

  const hasFilters = search || categoryFilter || actorFilter || dateFrom || dateTo;

  return (
    <div className="p-4 lg:p-6 space-y-5 max-w-7xl mx-auto">
      {/* Export toast */}
      {exportToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl text-sm font-medium flex items-center gap-2 animate-slide-up">
          <Activity size={14} className="text-blue-400" />
          {exportToast}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Audit Trail</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Read-only log of all notable events · {filtered.length} entries
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => handleExport("CSV")} className="inline-flex items-center gap-1.5 px-3 py-2.5 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 shadow-sm">
            <Download size={14} /> CSV
          </button>
          <button onClick={() => handleExport("PDF")} className="inline-flex items-center gap-1.5 px-3 py-2.5 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 shadow-sm">
            <Download size={14} /> PDF
          </button>
        </div>
      </div>

      {/* Immutability notice */}
      <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <Shield size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-blue-700">
          <span className="font-semibold">Audit entries are immutable.</span> No edit or delete is possible from the provider portal. All entries are written automatically by the system.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search event type, actor, resource…"
              className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value as AuditEventCategory | "")}
            className="px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none min-w-[180px]"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select
            value={actorFilter}
            onChange={e => setActorFilter(e.target.value)}
            className="px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none min-w-[160px]"
          >
            <option value="">All Actors</option>
            {uniqueActors.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
          <input
            type="date"
            value={dateFrom}
            onChange={e => setDateFrom(e.target.value)}
            className="px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none"
          />
          <input
            type="date"
            value={dateTo}
            onChange={e => setDateTo(e.target.value)}
            className="px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none"
          />
          {hasFilters && (
            <button
              onClick={() => { setSearch(""); setCategoryFilter(""); setActorFilter(""); setDateFrom(""); setDateTo(""); }}
              className="flex items-center gap-1.5 px-3 py-2.5 text-sm text-slate-500 hover:text-slate-700 whitespace-nowrap"
            >
              <X size={14} /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Audit entries */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
              <Shield size={22} className="text-slate-400" />
            </div>
            <h3 className="text-sm font-semibold text-slate-700 mb-1">No audit entries found</h3>
            <p className="text-sm text-slate-500">Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-200 bg-slate-50/50">
                <tr>
                  {["Timestamp", "Category", "Event", "Actor", "Resource", "Changes"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(entry => {
                  const config = categoryConfig[entry.eventCategory];
                  const Icon = config.icon;
                  return (
                    <tr key={entry.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="text-xs font-mono text-slate-600">{formatDate(entry.timestamp)}</div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", config.bg)}>
                          <Icon size={14} className={config.color} />
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="text-sm font-semibold text-slate-800 whitespace-nowrap">{entry.eventType}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{entry.eventCategory}</div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="text-sm font-medium text-slate-700 whitespace-nowrap">{entry.actorName}</div>
                        <span className={cn("text-xs px-1.5 py-0.5 rounded-full font-semibold mt-0.5 inline-block", roleColors[entry.actorRole] ?? "bg-slate-100 text-slate-600")}>
                          {entry.actorRole}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        {entry.affectedResource ? (
                          <span className="text-xs font-mono text-slate-600 bg-slate-100 px-2 py-1 rounded whitespace-nowrap">{entry.affectedResource}</span>
                        ) : (
                          <span className="text-slate-300 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        {entry.beforeValue || entry.afterValue ? (
                          <div className="flex items-center gap-2 text-xs">
                            {entry.beforeValue && (
                              <span className="bg-red-50 text-red-600 px-1.5 py-0.5 rounded font-mono">{entry.beforeValue}</span>
                            )}
                            {entry.beforeValue && entry.afterValue && <ChevronRight size={12} className="text-slate-400" />}
                            {entry.afterValue && (
                              <span className="bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded font-mono">{entry.afterValue}</span>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-300 text-xs">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
