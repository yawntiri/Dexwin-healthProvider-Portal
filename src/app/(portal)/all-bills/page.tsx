"use client";

import { useState, useMemo } from "react";
import { mockBills } from "@/lib/mock-data";
import { formatGHS, formatDate, formatDateShort, cn } from "@/lib/utils";
import type { Bill, BillStatus, ServiceCategory } from "@/lib/types";
import {
  Search, Filter, Download, ChevronRight, X, AlertCircle,
  Clock, CheckCircle2, DollarSign, XCircle, FileText, ArrowUpRight,
  CreditCard, User, Building2, Calendar, Tag, ChevronDown, ShieldAlert,
  CheckCheck, Send, Activity
} from "lucide-react";

const STATUS_OPTIONS: BillStatus[] = ["Draft", "Pending", "Approved", "Paid", "Failed"];
const CATEGORY_OPTIONS: ServiceCategory[] = ["Consultation", "Pharmacy", "Diagnostic", "Procedure", "Emergency"];

const statusConfig: Record<BillStatus, { label: string; color: string; Icon: any }> = {
  Draft: { label: "Draft", color: "bg-slate-100 text-slate-600", Icon: FileText },
  Pending: { label: "Pending", color: "bg-amber-50 text-amber-700 ring-1 ring-amber-200", Icon: Clock },
  Approved: { label: "Approved", color: "bg-blue-50 text-blue-700 ring-1 ring-blue-200", Icon: CheckCircle2 },
  Paid: { label: "Paid", color: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200", Icon: DollarSign },
  Failed: { label: "Failed", color: "bg-red-50 text-red-700 ring-1 ring-red-200", Icon: XCircle },
};

const categoryColors: Record<ServiceCategory, string> = {
  Consultation: "bg-blue-100 text-blue-700",
  Pharmacy: "bg-violet-100 text-violet-700",
  Diagnostic: "bg-teal-100 text-teal-700",
  Procedure: "bg-orange-100 text-orange-700",
  Emergency: "bg-red-100 text-red-700",
};

function BillTimeline({ bill }: { bill: Bill }) {
  const events = [
    { label: "Bill created", time: bill.createdAt, icon: FileText, done: true },
    { label: "Submitted", time: bill.submittedAt, icon: Send, done: !!bill.submittedAt },
    { label: "Approved", time: bill.approvedAt, icon: CheckCircle2, done: !!bill.approvedAt },
    { label: bill.status === "Failed" ? "Settlement failed" : "Payment settled", time: bill.paidAt ?? bill.failedAt, icon: bill.status === "Failed" ? XCircle : DollarSign, done: !!(bill.paidAt ?? bill.failedAt), failed: bill.status === "Failed" },
  ];

  return (
    <div className="space-y-3">
      {events.map((event, i) => {
        const Icon = event.icon;
        return (
          <div key={i} className="flex items-start gap-3">
            <div className={cn(
              "w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0",
              event.done
                ? event.failed ? "bg-red-100" : "bg-emerald-100"
                : "bg-slate-100"
            )}>
              <Icon size={13} className={cn(event.done ? event.failed ? "text-red-600" : "text-emerald-600" : "text-slate-400")} />
            </div>
            <div className="flex-1 pt-0.5">
              <div className={cn("text-sm font-semibold", event.done ? "text-slate-800" : "text-slate-400")}>{event.label}</div>
              {event.time && <div className="text-xs text-slate-500">{formatDate(event.time)}</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function BillDetail({ bill, onClose }: { bill: Bill; onClose: () => void }) {
  const dominantCategory = (() => {
    const cats = bill.lineItems.map(i => i.category);
    const counts: Record<string, number> = {};
    cats.forEach(c => { counts[c] = (counts[c] ?? 0) + 1; });
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "Consultation";
  })();

  const isStale = bill.status === "Draft" && (Date.now() - bill.createdAt.getTime()) > 7 * 24 * 60 * 60 * 1000;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative ml-auto w-full max-w-xl bg-white h-full overflow-y-auto shadow-2xl animate-slide-in">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-start justify-between z-10">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">Bill Detail</h2>
              {bill.referenceNumber && (
                <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{bill.referenceNumber}</span>
              )}
              {isStale && <span className="text-xs font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Stale Draft</span>}
            </div>
            <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold mt-1", statusConfig[bill.status].color)}>
              {bill.status}
            </span>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Failed alert */}
          {bill.status === "Failed" && (
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
              <ShieldAlert size={18} className="text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-bold text-red-800">Payment settlement failed</p>
                <p className="text-sm text-red-700 mt-0.5">{bill.failureReason}</p>
                <p className="text-sm text-red-600 mt-2 font-medium">The employee will need to pay this bill directly. The HealthWallet was not debited.</p>
                <a href="/settings/settlement" className="inline-flex items-center gap-1 mt-2 text-xs font-semibold text-red-600 hover:text-red-700 underline">
                  Check Settlement Account <ArrowUpRight size={12} />
                </a>
              </div>
            </div>
          )}

          {/* Patient */}
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Patient</div>
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
              <div className="w-10 h-10 rounded-xl bg-slate-200 flex items-center justify-center flex-shrink-0">
                <User size={18} className="text-slate-500" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900">{bill.patientFirstName}</div>
                <div className="text-xs text-slate-500">DXW***{bill.patientDexwinPayId.slice(-4)} · {bill.patientEmployerName}</div>
              </div>
            </div>
          </div>

          {/* Visit */}
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Visit</div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-800">{bill.visitType}</span>
              {bill.visitTypeNote && <span className="text-xs text-slate-500">— {bill.visitTypeNote}</span>}
            </div>
          </div>

          {/* Line items */}
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Bill Items</div>
            <div className="space-y-2">
              {bill.lineItems.map(item => (
                <div key={item.id} className="flex items-center justify-between py-2.5 px-3 bg-slate-50 rounded-lg">
                  <div>
                    <div className="text-sm font-medium text-slate-800">{item.description}</div>
                    <span className={cn("text-xs px-1.5 py-0.5 rounded-full font-semibold mt-0.5 inline-block", categoryColors[item.category])}>{item.category}</span>
                  </div>
                  <span className="text-sm font-bold text-slate-900 tabular-nums">{formatGHS(item.amount)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Financial summary */}
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Financial Summary</div>
            <div className="bg-slate-50 rounded-xl p-4 space-y-2.5">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Subtotal</span>
                <span className="font-bold text-slate-900">{formatGHS(bill.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">HealthWallet Share</span>
                <span className="font-bold text-blue-600">{formatGHS(bill.healthWalletShare)}</span>
              </div>
              {bill.cashOverage > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Cash Overage (collected)</span>
                  <span className="font-bold text-orange-600">{formatGHS(bill.cashOverage)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Timeline */}
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Transaction Timeline</div>
            <BillTimeline bill={bill} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AllBillsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<BillStatus | "">("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [exportToast, setExportToast] = useState("");

  const filteredBills = useMemo(() => {
    return mockBills.filter(bill => {
      if (statusFilter && bill.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!bill.patientFirstName.toLowerCase().includes(q) &&
          !bill.referenceNumber.toLowerCase().includes(q) &&
          !bill.patientDexwinPayId.toLowerCase().includes(q) &&
          !bill.patientEmployerName.toLowerCase().includes(q)) return false;
      }
      if (dateFrom && bill.createdAt < new Date(dateFrom)) return false;
      if (dateTo && bill.createdAt > new Date(dateTo + "T23:59:59")) return false;
      return true;
    });
  }, [search, statusFilter, dateFrom, dateTo]);

  const totalHW = filteredBills.reduce((s, b) => s + b.healthWalletShare, 0);
  const totalCash = filteredBills.reduce((s, b) => s + b.cashOverage, 0);

  const handleExport = (fmt: "CSV" | "PDF") => {
    setExportToast(`Exporting ${filteredBills.length} bills as ${fmt}…`);
    setTimeout(() => setExportToast(""), 3000);
  };

  const isStale = (bill: Bill) =>
    bill.status === "Draft" && (Date.now() - bill.createdAt.getTime()) > 7 * 24 * 60 * 60 * 1000;

  const getBillCategory = (bill: Bill): string => {
    const cats = [...new Set(bill.lineItems.map(i => i.category))];
    return cats.length > 1 ? "Mixed" : cats[0] ?? "—";
  };

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
          <h1 className="text-xl font-bold text-slate-900">All Bills</h1>
          <p className="text-sm text-slate-500 mt-0.5">View, filter, and reconcile all payment requests</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => handleExport("CSV")} className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
            <Download size={14} /> CSV
          </button>
          <button onClick={() => handleExport("PDF")} className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
            <Download size={14} /> PDF
          </button>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Total Bills</div>
          <div className="text-2xl font-bold text-slate-900">{filteredBills.length}</div>
          <div className="text-xs text-slate-500 mt-0.5">filtered results</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">HealthWallet Total</div>
          <div className="text-2xl font-bold text-blue-600 tabular-nums">{formatGHS(totalHW)}</div>
          <div className="text-xs text-slate-500 mt-0.5">submitted to Dexwin</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Cash Overage Total</div>
          <div className="text-2xl font-bold text-orange-600 tabular-nums">{formatGHS(totalCash)}</div>
          <div className="text-xs text-slate-500 mt-0.5">collected directly</div>
        </div>
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
              placeholder="Search by patient name, ID, reference…"
              className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as BillStatus | "")}
            className="px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 min-w-[140px]"
          >
            <option value="">All Statuses</option>
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <input
            type="date"
            value={dateFrom}
            onChange={e => setDateFrom(e.target.value)}
            className="px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
          <input
            type="date"
            value={dateTo}
            onChange={e => setDateTo(e.target.value)}
            className="px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
          {(search || statusFilter || dateFrom || dateTo) && (
            <button onClick={() => { setSearch(""); setStatusFilter(""); setDateFrom(""); setDateTo(""); }} className="flex items-center gap-1.5 px-3 py-2.5 text-sm text-slate-500 hover:text-slate-700">
              <X size={14} /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Bills table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {filteredBills.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
              <FileText size={22} className="text-slate-400" />
            </div>
            <h3 className="text-sm font-semibold text-slate-700 mb-1">No bills found</h3>
            <p className="text-sm text-slate-500">Try adjusting your filters or generate a new bill.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-200 bg-slate-50/50">
                <tr>
                  {["Reference", "Patient", "Visit Type", "Category", "HW Amount", "Cash", "Status", "Date", ""].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBills.map(bill => {
                  const stale = isStale(bill);
                  const category = getBillCategory(bill);
                  return (
                    <tr
                      key={bill.id}
                      onClick={() => setSelectedBill(bill)}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                    >
                      <td className="px-4 py-3.5">
                        <span className="text-xs font-mono font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                          {bill.referenceNumber || "Draft"}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="text-sm font-semibold text-slate-800">{bill.patientFirstName}</div>
                        <div className="text-xs text-slate-500 font-mono">DXW***{bill.patientDexwinPayId.slice(-4)}</div>
                      </td>
                      <td className="px-4 py-3.5 text-sm text-slate-700 whitespace-nowrap max-w-[140px] truncate">{bill.visitType}</td>
                      <td className="px-4 py-3.5">
                        <span className={cn("text-xs px-2 py-0.5 rounded-full font-semibold whitespace-nowrap", categoryColors[category as ServiceCategory] ?? "bg-slate-100 text-slate-600")}>
                          {category}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-sm font-bold text-slate-900 tabular-nums whitespace-nowrap">
                        {formatGHS(bill.healthWalletShare)}
                      </td>
                      <td className="px-4 py-3.5 text-sm text-slate-600 tabular-nums whitespace-nowrap">
                        {bill.cashOverage > 0 ? <span className="font-semibold text-orange-600">{formatGHS(bill.cashOverage)}</span> : <span className="text-slate-300">—</span>}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap", statusConfig[bill.status].color)}>
                            {bill.status}
                          </span>
                          {stale && <span className="text-xs font-bold bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full whitespace-nowrap">Stale</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-xs text-slate-500 whitespace-nowrap">{formatDateShort(bill.createdAt)}</td>
                      <td className="px-4 py-3.5">
                        <ChevronRight size={16} className="text-slate-300" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Bill detail panel */}
      {selectedBill && (
        <BillDetail bill={selectedBill} onClose={() => setSelectedBill(null)} />
      )}
    </div>
  );
}
