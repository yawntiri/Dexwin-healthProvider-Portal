"use client";

import { useState, useMemo } from "react";
import { mockPatients } from "@/lib/mock-data";
import { formatGHS, formatDateShort, formatDate, cn } from "@/lib/utils";
import type { PatientRecord, Bill, BillStatus } from "@/lib/types";
import {
  Search, User, Building2, ChevronRight, X, FileText, Plus,
  Calendar, Clock, DollarSign, ArrowUpRight, ShieldCheck
} from "lucide-react";
import Link from "next/link";

const statusColors: Record<BillStatus, string> = {
  Draft: "bg-slate-100 text-slate-600",
  Pending: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  Approved: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  Paid: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  Failed: "bg-red-50 text-red-700 ring-1 ring-red-200",
};

function PatientDetail({ patient, onClose }: { patient: PatientRecord; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative ml-auto w-full max-w-xl bg-white h-full overflow-y-auto shadow-2xl animate-slide-in">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-start justify-between z-10">
          <div>
            <h2 className="text-base font-bold text-slate-900">{patient.firstName}</h2>
            <p className="text-xs font-mono text-slate-500">{patient.maskedId} · {patient.employerName}</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
            <div className="w-12 h-12 rounded-xl bg-slate-200 flex items-center justify-center">
              <User size={22} className="text-slate-500" />
            </div>
            <div>
              <div className="text-base font-bold text-slate-900">{patient.firstName}</div>
              <div className="text-sm text-slate-500 flex items-center gap-1.5">
                <Building2 size={13} /> {patient.employerName}
              </div>
              <div className="text-xs font-mono text-slate-400 mt-0.5">{patient.maskedId}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white border border-slate-200 rounded-xl p-3">
              <div className="text-xs text-slate-500 mb-1">Total Visits</div>
              <div className="text-xl font-bold text-slate-900">{patient.totalVisits}</div>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-3">
              <div className="text-xs text-slate-500 mb-1">Last Visit</div>
              <div className="text-sm font-bold text-slate-900">{patient.lastVisitDate ? formatDateShort(patient.lastVisitDate) : "—"}</div>
            </div>
          </div>

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-700">
            <span className="font-semibold">Note:</span> Wallet balance and eligibility are not shown here. Re-run eligibility check when generating a new bill.
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Bills at This Facility</div>
              <Link
                href={`/generate-bill?patientId=${patient.dexwinPayId}`}
                onClick={onClose}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700"
              >
                <Plus size={12} /> Generate New Bill
              </Link>
            </div>
            {patient.bills.length === 0 ? (
              <p className="text-sm text-slate-400 py-4 text-center">No bills on record at this facility.</p>
            ) : (
              <div className="space-y-2">
                {patient.bills.map(bill => (
                  <div key={bill.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <div>
                      <div className="text-sm font-semibold text-slate-800">{bill.visitType}</div>
                      <div className="text-xs text-slate-500">{formatDateShort(bill.createdAt)}</div>
                      {bill.referenceNumber && <div className="text-xs font-mono text-slate-400">{bill.referenceNumber}</div>}
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-slate-900 tabular-nums">{formatGHS(bill.healthWalletShare)}</div>
                      <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold mt-0.5", statusColors[bill.status])}>
                        {bill.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AllPatientsPage() {
  const [search, setSearch] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<PatientRecord | null>(null);

  const filteredPatients = useMemo(() => {
    if (!search) return mockPatients;
    const q = search.toLowerCase();
    return mockPatients.filter(p =>
      p.firstName.toLowerCase().includes(q) ||
      p.dexwinPayId.toLowerCase().includes(q) ||
      p.maskedId.toLowerCase().includes(q) ||
      p.employerName.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <div className="p-4 lg:p-6 space-y-5 max-w-7xl mx-auto">
      <div>
        <h1 className="text-xl font-bold text-slate-900">All Patients</h1>
        <p className="text-sm text-slate-500 mt-0.5">Patients served at {"{your facility}"}. Search by name or DexwinPay ID.</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by patient name or DexwinPay ID…"
            className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>
        <p className="text-xs text-slate-400 mt-2">
          <ShieldCheck size={11} className="inline mr-1" />
          Search returns only patients already on file at this facility — not the wider Dexwin patient base.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {filteredPatients.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
              <User size={22} className="text-slate-400" />
            </div>
            <h3 className="text-sm font-semibold text-slate-700 mb-1">No patients found</h3>
            <p className="text-sm text-slate-500">No patients match your search at this facility.</p>
          </div>
        ) : (
          <>
            <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/50">
              <span className="text-xs font-bold text-slate-500">{filteredPatients.length} patient{filteredPatients.length !== 1 ? "s" : ""}</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-slate-100">
                  <tr>
                    {["Patient", "Employer", "Last Visit", "Total Visits", ""].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredPatients.map(patient => (
                    <tr
                      key={patient.dexwinPayId}
                      onClick={() => setSelectedPatient(patient)}
                      className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                            <User size={15} className="text-slate-500" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-slate-800">{patient.firstName}</div>
                            <div className="text-xs font-mono text-slate-400">{patient.maskedId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-sm text-slate-600">{patient.employerName}</td>
                      <td className="px-4 py-3.5 text-sm text-slate-600 whitespace-nowrap">
                        {patient.lastVisitDate ? formatDateShort(patient.lastVisitDate) : "—"}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-sm font-bold text-slate-900">{patient.totalVisits}</span>
                        <span className="text-xs text-slate-400 ml-1">visit{patient.totalVisits !== 1 ? "s" : ""}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <ChevronRight size={16} className="text-slate-300" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {selectedPatient && (
        <PatientDetail patient={selectedPatient} onClose={() => setSelectedPatient(null)} />
      )}
    </div>
  );
}
