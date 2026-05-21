"use client";

import { useState } from "react";
import { mockOverviewMetrics, mockBills, mockDailyRevenue, currentUser } from "@/lib/mock-data";
import { formatGHS, formatGHSCompact, formatDate, cn } from "@/lib/utils";
import type { Period, BillStatus } from "@/lib/types";
import {
  TrendingUp, TrendingDown, FileText, Clock, CheckCircle2, DollarSign,
  XCircle, ChevronRight, Plus, ArrowRight, Building2, Bell, Activity,
  BarChart3, Users, AlertCircle, Wifi, Info
} from "lucide-react";
import Link from "next/link";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { format, parseISO } from "date-fns";

const periods: Period[] = ["Today", "This week", "This month", "This year"];

const statusConfig: Record<BillStatus, { icon: React.ElementType; color: string; bg: string; label: string; href: string }> = {
  Pending: { icon: Clock, color: "text-amber-600", bg: "bg-amber-50 border border-amber-200", label: "Pending", href: "/all-bills?status=Pending" },
  Approved: { icon: CheckCircle2, color: "text-blue-600", bg: "bg-blue-50 border border-blue-200", label: "Approved", href: "/all-bills?status=Approved" },
  Paid: { icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50 border border-emerald-200", label: "Paid", href: "/all-bills?status=Paid" },
  Failed: { icon: XCircle, color: "text-red-600", bg: "bg-red-50 border border-red-200", label: "Failed", href: "/all-bills?status=Failed" },
  Draft: { icon: FileText, color: "text-slate-500", bg: "bg-slate-50 border border-slate-200", label: "Draft", href: "/all-bills?status=Draft" },
};

const statusBadgeClass: Record<BillStatus, string> = {
  Draft: "bg-slate-100 text-slate-600",
  Pending: "bg-amber-50 text-amber-700",
  Approved: "bg-blue-50 text-blue-700",
  Paid: "bg-emerald-50 text-emerald-700",
  Failed: "bg-red-50 text-red-700",
};

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-3 text-sm">
      <p className="font-semibold text-slate-700 mb-1">{label}</p>
      <p className="text-emerald-600 font-bold">{formatGHS(payload[0]?.value ?? 0)}</p>
      <p className="text-slate-500 text-xs">{payload[0]?.payload?.count ?? 0} bills</p>
    </div>
  );
}

export default function OverviewPage() {
  const [period, setPeriod] = useState<Period>("This month");
  const metrics = mockOverviewMetrics;
  const isPositive = metrics.periodChange >= 0;

  const chartData = mockDailyRevenue.slice(-30).map(d => ({
    ...d,
    date: format(parseISO(d.date), "MMM d"),
  }));

  const hasNoBills = Object.values(metrics.billsByStatus).every(v => v === 0);

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Overview</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {currentUser.providerName} · {currentUser.role}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/generate-bill"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus size={16} />
            Generate Bill
          </Link>
        </div>
      </div>

      {/* Period selector */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl w-fit">
        {periods.map(p => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={cn(
              "px-3.5 py-2 text-sm font-semibold rounded-lg transition-all",
              period === p
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            )}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Primary metric + status grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Settled balance - prominent */}
        <div className="lg:col-span-2 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-blue-200 text-sm font-medium">Settled Balance</p>
              <p className="text-xs text-blue-300 mt-0.5">{period}</p>
            </div>
            <div className="w-10 h-10 bg-blue-500/50 rounded-xl flex items-center justify-center">
              <DollarSign size={20} className="text-white" />
            </div>
          </div>
          <div className="text-3xl font-bold tabular-nums mb-2">
            {formatGHS(metrics.settledThisPeriod)}
          </div>
          <div className={cn("flex items-center gap-1.5 text-sm font-semibold", isPositive ? "text-emerald-300" : "text-red-300")}>
            {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {Math.abs(metrics.periodChange).toFixed(1)}% vs last period
          </div>
        </div>

        {/* Status breakdown */}
        {(["Pending", "Approved", "Paid", "Failed"] as BillStatus[]).map(status => {
          const config = statusConfig[status];
          const Icon = config.icon;
          const count = metrics.billsByStatus[status as keyof typeof metrics.billsByStatus] ?? 0;
          return (
            <Link
              key={status}
              href={config.href}
              className={cn("rounded-2xl p-5 flex flex-col gap-3 transition-all hover:shadow-md hover:scale-[1.01]", config.bg)}
            >
              <div className="flex items-center justify-between">
                <div className={cn("w-9 h-9 rounded-lg bg-white/70 flex items-center justify-center", config.color)}>
                  <Icon size={18} />
                </div>
                <ChevronRight size={16} className="text-slate-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900 tabular-nums">{count}</div>
                <div className="text-sm text-slate-600 font-medium">{config.label} Bills</div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Revenue chart */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">Revenue Trend</h2>
            <p className="text-sm text-slate-500">Daily settled payments · Last 30 days</p>
          </div>
          <Link href="/reports" className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
            View Reports <ArrowRight size={14} />
          </Link>
        </div>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
                interval={4}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={v => `₵${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="#2563eb"
                strokeWidth={2}
                fill="url(#revenueGrad)"
                dot={false}
                activeDot={{ r: 4, fill: "#2563eb" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent bills */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900">Recent Bills</h2>
          <Link href="/all-bills" className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
            View All <ArrowRight size={14} />
          </Link>
        </div>

        {hasNoBills ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
              <FileText size={22} className="text-slate-400" />
            </div>
            <h3 className="text-sm font-semibold text-slate-700 mb-1">No bills yet</h3>
            <p className="text-sm text-slate-500 max-w-xs mb-4">Start by generating your first bill to process a HealthWallet payment.</p>
            <Link href="/generate-bill" className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700">
              <Plus size={16} /> Generate First Bill
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {metrics.recentBills.map(bill => (
              <Link
                key={bill.id}
                href={`/all-bills/${bill.id}`}
                className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                  <FileText size={16} className="text-slate-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-800">{bill.patientFirstName}</span>
                    <span className="text-xs text-slate-400">·</span>
                    <span className="text-xs text-slate-500">DXW***{bill.patientDexwinPayId.slice(-4)}</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">{bill.visitType} · {bill.patientEmployerName}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-sm font-bold text-slate-900">{formatGHS(bill.healthWalletShare)}</div>
                  <div className="mt-0.5">
                    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold", statusBadgeClass[bill.status])}>
                      {bill.status}
                    </span>
                  </div>
                </div>
                <ChevronRight size={16} className="text-slate-300 flex-shrink-0" />
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon: Plus, label: "Generate Bill", href: "/generate-bill", color: "text-blue-600", bg: "bg-blue-50" },
          { icon: Users, label: "All Patients", href: "/all-patients", color: "text-violet-600", bg: "bg-violet-50" },
          { icon: BarChart3, label: "Reports", href: "/reports", color: "text-emerald-600", bg: "bg-emerald-50" },
          { icon: Activity, label: "Audit Trail", href: "/audit-trail", color: "text-slate-600", bg: "bg-slate-100" },
        ].map(item => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col items-center gap-2 hover:shadow-md hover:border-slate-300 transition-all text-center"
            >
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", item.bg)}>
                <Icon size={18} className={item.color} />
              </div>
              <span className="text-xs font-semibold text-slate-700">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
