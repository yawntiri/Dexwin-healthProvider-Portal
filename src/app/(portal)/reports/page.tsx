"use client";

import { useState } from "react";
import { mockRevenueByCategory, mockRevenueByEmployer, mockTopServices, mockDailyRevenue, currentUser } from "@/lib/mock-data";
import { formatGHS, formatNumber, cn } from "@/lib/utils";
import type { ServiceCategory } from "@/lib/types";
import {
  BarChart3, Download, TrendingUp, TrendingDown, AlertCircle,
  Building2, Activity, ShieldAlert, ArrowRight, Sparkles, Calendar
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, Legend
} from "recharts";
import { format, parseISO } from "date-fns";

const categoryColors: Record<ServiceCategory, string> = {
  Consultation: "#3b82f6",
  Pharmacy: "#8b5cf6",
  Diagnostic: "#14b8a6",
  Procedure: "#f97316",
  Emergency: "#ef4444",
};

const PIE_COLORS = ["#3b82f6", "#8b5cf6", "#14b8a6", "#f97316", "#ef4444"];

type ReportTab = "revenue" | "employer" | "services" | "trends";

const isOwnerOrManager = currentUser.role === "Owner" || currentUser.role === "Manager";

function CustomBarTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-3 text-sm">
      <p className="font-semibold text-slate-700 mb-1">{label}</p>
      <p className="text-blue-600 font-bold">{formatGHS(payload[0]?.value ?? 0)}</p>
      {payload[1] && <p className="text-slate-500 text-xs">{payload[1]?.value} bills</p>}
    </div>
  );
}

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<ReportTab>("revenue");
  const [dateRange, setDateRange] = useState("This month");
  const [exportToast, setExportToast] = useState("");

  if (!isOwnerOrManager) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center mb-4">
          <ShieldAlert size={22} className="text-red-500" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 mb-2">Access Restricted</h2>
        <p className="text-slate-500 text-sm max-w-xs">Reports & Insights are available to Owners and Managers only.</p>
      </div>
    );
  }

  const handleExport = (fmt: "CSV" | "PDF") => {
    setExportToast(`Exporting ${activeTab} report as ${fmt}…`);
    setTimeout(() => setExportToast(""), 3000);
  };

  const tabs: { id: ReportTab; label: string }[] = [
    { id: "revenue", label: "Revenue by Category" },
    { id: "employer", label: "Revenue by Employer" },
    { id: "services", label: "Top Services" },
    { id: "trends", label: "Trends" },
  ];

  const trendData = mockDailyRevenue.slice(-30).map(d => ({
    ...d,
    date: format(parseISO(d.date), "MMM d"),
  }));

  const totalRevenue = mockRevenueByCategory.reduce((s, r) => s + r.amount, 0);
  const totalBills = mockRevenueByCategory.reduce((s, r) => s + r.count, 0);
  const avgBillSize = totalBills > 0 ? totalRevenue / totalBills : 0;

  // Insights
  const topCat = [...mockRevenueByCategory].sort((a, b) => b.percentChange - a.percentChange)[0];
  const declineRate = mockRevenueByCategory.filter(r => r.percentChange < 0).length;

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
          <h1 className="text-xl font-bold text-slate-900">Reports & Insights</h1>
          <p className="text-sm text-slate-500 mt-0.5">Aggregate analytics for your facility</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={dateRange}
            onChange={e => setDateRange(e.target.value)}
            className="px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none bg-white"
          >
            {["Today", "This week", "This month", "Last 3 months", "Last 6 months", "This year"].map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          <button onClick={() => handleExport("CSV")} className="inline-flex items-center gap-1.5 px-3 py-2.5 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50">
            <Download size={14} /> CSV
          </button>
          <button onClick={() => handleExport("PDF")} className="inline-flex items-center gap-1.5 px-3 py-2.5 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50">
            <Download size={14} /> PDF
          </button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Total Revenue</div>
          <div className="text-3xl font-bold text-slate-900 tabular-nums">{formatGHS(totalRevenue)}</div>
          <div className="flex items-center gap-1 mt-2 text-xs font-semibold text-emerald-600">
            <TrendingUp size={12} /> +14.2% vs last period
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Total Bills</div>
          <div className="text-3xl font-bold text-slate-900 tabular-nums">{formatNumber(totalBills)}</div>
          <div className="flex items-center gap-1 mt-2 text-xs font-semibold text-emerald-600">
            <TrendingUp size={12} /> +8.1% vs last period
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Avg Bill Size</div>
          <div className="text-3xl font-bold text-slate-900 tabular-nums">{formatGHS(avgBillSize)}</div>
          <div className="flex items-center gap-1 mt-2 text-xs font-semibold text-emerald-600">
            <TrendingUp size={12} /> +5.3% vs last period
          </div>
        </div>
      </div>

      {/* Insights panel */}
      <div className="bg-gradient-to-r from-blue-50 to-violet-50 border border-blue-200 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={16} className="text-blue-500" />
          <span className="text-sm font-bold text-blue-800">Auto-Generated Insights</span>
          <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-semibold">{dateRange}</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {topCat && (
            <div className="bg-white/80 rounded-xl p-3 border border-blue-100">
              <div className="flex items-start gap-2">
                <TrendingUp size={14} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-slate-700">
                  Revenue from <span className="font-bold">{topCat.category}</span> services is up{" "}
                  <span className="font-bold text-emerald-600">+{topCat.percentChange.toFixed(1)}%</span> vs the previous period.
                </p>
              </div>
            </div>
          )}
          <div className="bg-white/80 rounded-xl p-3 border border-blue-100">
            <div className="flex items-start gap-2">
              <BarChart3 size={14} className="text-blue-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-slate-700">
                Your top employer by revenue is <span className="font-bold">{mockRevenueByEmployer[0]?.employerName}</span> with{" "}
                <span className="font-bold text-blue-600">{formatGHS(mockRevenueByEmployer[0]?.amount ?? 0)}</span>.
              </p>
            </div>
          </div>
          <div className="bg-white/80 rounded-xl p-3 border border-blue-100">
            <div className="flex items-start gap-2">
              <Activity size={14} className="text-violet-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-slate-700">
                Most popular service: <span className="font-bold">{mockTopServices[0]?.serviceName}</span> with{" "}
                <span className="font-bold text-violet-600">{mockTopServices[0]?.volume}</span> transactions.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-0">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-4 py-3 text-sm font-semibold border-b-2 transition-all -mb-px",
              activeTab === tab.id
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-700"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Revenue by Category */}
      {activeTab === "revenue" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Revenue by Category</h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockRevenueByCategory} margin={{ left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="category" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={v => `₵${(v/1000).toFixed(0)}k`} />
                  <Tooltip content={<CustomBarTooltip />} />
                  <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                    {mockRevenueByCategory.map((entry, i) => (
                      <Cell key={i} fill={categoryColors[entry.category]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Category Breakdown</h3>
            <div className="space-y-3">
              {mockRevenueByCategory.map(cat => (
                <div key={cat.category} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: categoryColors[cat.category] }} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold text-slate-700">{cat.category}</span>
                      <span className="text-sm font-bold text-slate-900 tabular-nums">{formatGHS(cat.amount)}</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${(cat.amount / mockRevenueByCategory[0].amount) * 100}%`,
                          backgroundColor: categoryColors[cat.category]
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-0.5">
                      <span className="text-xs text-slate-400">{cat.count} bills</span>
                      <span className={cn("text-xs font-semibold flex items-center gap-0.5", cat.percentChange >= 0 ? "text-emerald-600" : "text-red-500")}>
                        {cat.percentChange >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                        {Math.abs(cat.percentChange).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Revenue by Employer */}
      {activeTab === "employer" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="border-b border-slate-200 bg-slate-50/50">
              <tr>
                {["Rank", "Employer", "Bills", "Revenue", "Share"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockRevenueByEmployer.map((emp, i) => {
                const share = (emp.amount / totalRevenue) * 100;
                return (
                  <tr key={emp.employerName} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className={cn("w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold", i === 0 ? "bg-amber-100 text-amber-700" : i === 1 ? "bg-slate-100 text-slate-600" : "bg-slate-50 text-slate-500")}>
                        {i + 1}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                          <Building2 size={14} className="text-slate-500" />
                        </div>
                        <span className="text-sm font-semibold text-slate-800">{emp.employerName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-slate-600">{emp.count}</td>
                    <td className="px-4 py-3.5 text-sm font-bold text-slate-900 tabular-nums">{formatGHS(emp.amount)}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden max-w-[80px]">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: `${share}%` }} />
                        </div>
                        <span className="text-xs font-semibold text-slate-500">{share.toFixed(1)}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Top Services */}
      {activeTab === "services" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
            <span className="text-sm font-bold text-slate-900">Top 10 Services</span>
            <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">by volume</span>
          </div>
          <table className="w-full">
            <thead className="border-b border-slate-200 bg-slate-50/50">
              <tr>
                {["Rank", "Service", "Category", "Volume", "Revenue"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockTopServices.map((svc, i) => (
                <tr key={svc.serviceCode} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-4 py-3.5">
                    <div className={cn("w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold", i === 0 ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600")}>
                      {i + 1}
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="text-sm font-semibold text-slate-800">{svc.serviceName}</div>
                    <div className="text-xs font-mono text-slate-400">{svc.serviceCode}</div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: categoryColors[svc.category] + "20", color: categoryColors[svc.category] }}>
                      {svc.category}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-sm font-bold text-slate-900">{svc.volume}</td>
                  <td className="px-4 py-3.5 text-sm font-bold text-slate-900 tabular-nums">{formatGHS(svc.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Trends */}
      {activeTab === "trends" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-sm font-bold text-slate-900 mb-4">Daily Revenue — Last 30 Days</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ left: -20 }}>
                <defs>
                  <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} interval={4} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={v => `₵${(v/1000).toFixed(0)}k`} />
                <Tooltip content={({ active, payload, label }: any) => active && payload?.length ? (
                  <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-3 text-sm">
                    <p className="font-semibold text-slate-700 mb-1">{label}</p>
                    <p className="text-blue-600 font-bold">{formatGHS(payload[0]?.value ?? 0)}</p>
                    <p className="text-slate-500 text-xs">{payload[0]?.payload?.count} bills</p>
                  </div>
                ) : null} />
                <Area type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={2} fill="url(#trendGrad)" dot={false} activeDot={{ r: 4, fill: "#3b82f6" }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
