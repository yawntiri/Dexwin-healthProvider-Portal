"use client";

import { useState, useMemo } from "react";
import { mockPatients, mockServices, currentUser } from "@/lib/mock-data";
import { formatGHS, cn, generateRef } from "@/lib/utils";
import type { PatientRecord, BillLineItem, ServiceCategory, VisitType } from "@/lib/types";
import {
  Search, User, Building2, Wallet, CheckCircle2, AlertTriangle, XCircle,
  Plus, Trash2, ChevronRight, ChevronLeft, Send, FileText, Shield,
  ArrowRight, Check, Info, Loader2, ShieldCheck
} from "lucide-react";

const VISIT_TYPES: VisitType[] = [
  "Outpatient consultation", "Follow-up", "Emergency", "Pharmacy pickup",
  "Diagnostic only", "Procedure", "Antenatal", "Postnatal", "Vaccination",
  "Inpatient admission", "Other"
];

const CATEGORIES: ServiceCategory[] = ["Consultation", "Pharmacy", "Diagnostic", "Procedure", "Emergency"];

const categoryColors: Record<ServiceCategory, string> = {
  Consultation: "bg-blue-100 text-blue-700",
  Pharmacy: "bg-violet-100 text-violet-700",
  Diagnostic: "bg-teal-100 text-teal-700",
  Procedure: "bg-orange-100 text-orange-700",
  Emergency: "bg-red-100 text-red-700",
};

const steps = [
  { id: "patient", label: "Patient ID", description: "Identify" },
  { id: "bill", label: "Create Bill", description: "Add Items" },
  { id: "review", label: "Review", description: "Confirm" },
  { id: "submitted", label: "Done", description: "Complete" },
];

interface LineItemDraft {
  id: string;
  description: string;
  category: ServiceCategory;
  amount: string;
  serviceId?: string;
}

export default function GenerateBillPage() {
  const [step, setStep] = useState(0);
  const [dexwinPayId, setDexwinPayId] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [patient, setPatient] = useState<PatientRecord | null>(null);
  const [searchError, setSearchError] = useState("");
  const [identityConfirmed, setIdentityConfirmed] = useState(false);

  const [visitType, setVisitType] = useState<VisitType | "">("");
  const [visitNote, setVisitNote] = useState("");
  const [lineItems, setLineItems] = useState<LineItemDraft[]>([]);
  const [serviceSearch, setServiceSearch] = useState("");

  const [cashConfirmed, setCashConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refNumber, setRefNumber] = useState("");

  const subtotal = useMemo(() => {
    return lineItems.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
  }, [lineItems]);

  const walletBalance = patient?.availableBalance ?? 0;
  const healthWalletShare = Math.min(subtotal, walletBalance);
  const cashOverage = Math.max(0, subtotal - walletBalance);
  const exceedsBalance = subtotal > walletBalance;

  const filteredServices = useMemo(() => {
    if (!serviceSearch) return mockServices.filter(s => s.status === "Active");
    const q = serviceSearch.toLowerCase();
    return mockServices.filter(s =>
      s.status === "Active" && (
        s.name.toLowerCase().includes(q) ||
        s.code.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q)
      )
    );
  }, [serviceSearch]);

  async function handleLookup() {
    if (!dexwinPayId.trim()) return;
    setIsSearching(true);
    setSearchError("");
    setPatient(null);
    await new Promise(r => setTimeout(r, 1200));
    const found = mockPatients.find(p => p.dexwinPayId === dexwinPayId.trim());
    setIsSearching(false);
    if (found) {
      setPatient(found);
    } else {
      setSearchError("No record found");
    }
  }

  function addLineItem() {
    setLineItems(prev => [...prev, {
      id: Math.random().toString(36).slice(2),
      description: "",
      category: "Consultation",
      amount: "",
    }]);
  }

  function addFromCatalog(svcId: string) {
    const svc = mockServices.find(s => s.id === svcId);
    if (!svc) return;
    setLineItems(prev => [...prev, {
      id: Math.random().toString(36).slice(2),
      description: svc.name,
      category: svc.category,
      amount: String(svc.defaultPrice),
      serviceId: svc.id,
    }]);
    setServiceSearch("");
  }

  function updateLineItem(id: string, field: keyof LineItemDraft, value: string) {
    setLineItems(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  }

  function removeLineItem(id: string) {
    setLineItems(prev => prev.filter(item => item.id !== id));
  }

  async function handleSubmit() {
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 2000));
    setRefNumber(generateRef());
    setIsSubmitting(false);
    setStep(3);
  }

  const canProceedFromPatient = patient && patient.benefitStatus === "Ready to use" && identityConfirmed;
  const canProceedFromBill = visitType && lineItems.length > 0 && lineItems.every(i => i.description && i.amount && parseFloat(i.amount) > 0) && (!exceedsBalance || true);
  const canSubmit = !cashOverage || cashConfirmed;

  return (
    <div className="p-4 lg:p-6 max-w-4xl mx-auto">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-900">Generate Bill</h1>
        <p className="text-sm text-slate-500 mt-0.5">Process a HealthWallet payment for a patient</p>
      </div>

      {/* Step indicator */}
      {step < 3 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
          <div className="flex items-center gap-0">
            {steps.slice(0, 3).map((s, i) => {
              const isCompleted = i < step;
              const isActive = i === step;
              return (
                <div key={s.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={cn(
                      "w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all",
                      isCompleted ? "bg-blue-600 border-blue-600 text-white" :
                        isActive ? "border-blue-600 text-blue-600 bg-white" :
                          "border-slate-200 text-slate-400 bg-white"
                    )}>
                      {isCompleted ? <Check size={14} strokeWidth={3} /> : i + 1}
                    </div>
                    <div className="mt-1 text-center">
                      <div className={cn("text-xs font-bold", isActive ? "text-blue-600" : isCompleted ? "text-slate-700" : "text-slate-400")}>{s.label}</div>
                    </div>
                  </div>
                  {i < 2 && (
                    <div className={cn("h-0.5 w-16 mx-3 mb-5", isCompleted ? "bg-blue-600" : "bg-slate-200")} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 1: Patient Identification */}
      {step === 0 && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-base font-bold text-slate-900 mb-1">Patient Identification</h2>
            <p className="text-sm text-slate-500 mb-5">Enter the patient&apos;s DexwinPay ID to verify their eligibility.</p>

            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-700">DexwinPay ID</label>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <Search size={16} />
                  </div>
                  <input
                    type="text"
                    value={dexwinPayId}
                    onChange={e => { setDexwinPayId(e.target.value); setPatient(null); setSearchError(""); }}
                    onKeyDown={e => e.key === "Enter" && handleLookup()}
                    placeholder="e.g. DXW1234567890"
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors font-mono"
                  />
                </div>
                <button
                  onClick={handleLookup}
                  disabled={!dexwinPayId.trim() || isSearching}
                  className="px-5 py-3 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {isSearching ? <Loader2 size={15} className="animate-spin" /> : <Search size={15} />}
                  {isSearching ? "Searching…" : "Look Up"}
                </button>
              </div>

              {searchError && (
                <div className="flex items-start gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <XCircle size={18} className="text-slate-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-slate-700">No record found</p>
                    <p className="text-sm text-slate-500">The DexwinPay ID <span className="font-mono font-semibold">{dexwinPayId}</span> was not found in the Dexwin network. Please verify the ID with the patient or contact Dexwin support.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Patient card */}
            {patient && (
              <div className="mt-5 space-y-4">
                {patient.benefitStatus === "Ready to use" ? (
                  <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                        <User size={22} className="text-emerald-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-base font-bold text-emerald-900">{patient.firstName}</span>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                            <ShieldCheck size={12} /> Ready to use
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-sm text-emerald-700">
                          <Building2 size={13} />
                          {patient.employerName}
                        </div>
                        <div className="mt-3 pt-3 border-t border-emerald-200 grid grid-cols-2 gap-3">
                          <div>
                            <div className="text-xs text-emerald-600 font-medium">Available Balance</div>
                            <div className="text-xl font-bold text-emerald-800 tabular-nums">{formatGHS(patient.availableBalance ?? 0)}</div>
                          </div>
                          <div>
                            <div className="text-xs text-emerald-600 font-medium">DexwinPay ID</div>
                            <div className="text-sm font-mono font-semibold text-emerald-800">{patient.maskedId}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-5 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
                    <AlertTriangle size={18} className="text-amber-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-amber-800">Benefit not currently active</p>
                      <p className="text-sm text-amber-700 mt-0.5">This patient&apos;s HealthWallet benefit is not currently active. You cannot process a HealthWallet payment at this time.</p>
                    </div>
                  </div>
                )}

                {patient.benefitStatus === "Ready to use" && (
                  <label className="flex items-start gap-3 cursor-pointer p-4 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                    <div
                      className={cn(
                        "w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all",
                        identityConfirmed ? "bg-blue-600 border-blue-600" : "bg-white border-slate-300"
                      )}
                      onClick={() => setIdentityConfirmed(v => !v)}
                    >
                      {identityConfirmed && <Check size={12} className="text-white" strokeWidth={3} />}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-800">I have confirmed the patient&apos;s identity using their phone number</div>
                      <div className="text-xs text-slate-500 mt-0.5">Required before proceeding with HealthWallet payment</div>
                    </div>
                  </label>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => setStep(1)}
              disabled={!canProceedFromPatient}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Continue to Bill <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Create Bill */}
      {step === 1 && patient && (
        <div className="space-y-4">
          {/* Patient summary bar */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                <User size={15} className="text-emerald-600" />
              </div>
              <div>
                <span className="text-sm font-bold text-emerald-900">{patient.firstName}</span>
                <span className="text-xs text-emerald-600 ml-2">{patient.maskedId}</span>
              </div>
            </div>
            <div className="text-sm font-bold text-emerald-700">
              Balance: {formatGHS(patient.availableBalance ?? 0)}
            </div>
          </div>

          {/* Visit type */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Visit Type <span className="text-red-500">*</span></h3>
            <select
              value={visitType}
              onChange={e => setVisitType(e.target.value as VisitType)}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="">Select visit type…</option>
              {VISIT_TYPES.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
            {visitType === "Other" && (
              <input
                type="text"
                value={visitNote}
                onChange={e => setVisitNote(e.target.value.slice(0, 100))}
                placeholder="Brief description of visit (max 100 characters)"
                className="mt-2 w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            )}
          </div>

          {/* Line items */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900">Bill Items <span className="text-red-500">*</span></h3>
              <button
                onClick={addLineItem}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Plus size={14} /> Add Item
              </button>
            </div>

            {/* Service catalog search */}
            <div className="mb-4">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={serviceSearch}
                  onChange={e => setServiceSearch(e.target.value)}
                  placeholder="Search services catalog…"
                  className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
              {serviceSearch && (
                <div className="mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                  {filteredServices.length === 0 ? (
                    <div className="py-4 text-center text-sm text-slate-400">No services found</div>
                  ) : (
                    filteredServices.slice(0, 8).map(svc => (
                      <button
                        key={svc.id}
                        onClick={() => addFromCatalog(svc.id)}
                        className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors text-left border-b border-slate-50 last:border-0"
                      >
                        <div>
                          <div className="text-sm font-semibold text-slate-800">{svc.name}</div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-slate-500 font-mono">{svc.code}</span>
                            <span className={cn("text-xs px-1.5 py-0.5 rounded-full font-semibold", categoryColors[svc.category])}>{svc.category}</span>
                          </div>
                        </div>
                        <span className="text-sm font-bold text-slate-700">{formatGHS(svc.defaultPrice)}</span>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            {lineItems.length === 0 ? (
              <div className="py-10 text-center border-2 border-dashed border-slate-200 rounded-xl">
                <FileText size={24} className="text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-400">No items yet. Search the catalog or add a custom item.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {lineItems.map((item, i) => (
                  <div key={item.id} className="flex gap-3 items-start p-3 bg-slate-50 rounded-xl">
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div className="sm:col-span-1">
                        <input
                          type="text"
                          value={item.description}
                          onChange={e => updateLineItem(item.id, "description", e.target.value)}
                          placeholder="Service description"
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <select
                          value={item.category}
                          onChange={e => updateLineItem(item.id, "category", e.target.value)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        >
                          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold">GH₵</span>
                        <input
                          type="number"
                          value={item.amount}
                          onChange={e => updateLineItem(item.id, "amount", e.target.value)}
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                          className="w-full pl-11 pr-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 tabular-nums"
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => removeLineItem(item.id)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors mt-0.5"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Running total */}
            {lineItems.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Subtotal</span>
                  <span className="font-bold text-slate-900">{formatGHS(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Available HealthWallet Balance</span>
                  <span className="font-semibold text-emerald-600">{formatGHS(walletBalance)}</span>
                </div>
                {exceedsBalance && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">HealthWallet Share</span>
                      <span className="font-bold text-blue-600">{formatGHS(healthWalletShare)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-orange-600 font-medium">Cash Overage</span>
                      <span className="font-bold text-orange-600">{formatGHS(cashOverage)}</span>
                    </div>
                    <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl mt-2">
                      <AlertTriangle size={15} className="text-amber-600 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-amber-700">This bill exceeds the patient&apos;s available benefit. The overage of <span className="font-bold">{formatGHS(cashOverage)}</span> must be collected in cash before submission.</p>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setStep(0)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-slate-700 text-sm font-semibold rounded-xl border border-slate-200 hover:bg-slate-50"
            >
              <ChevronLeft size={16} /> Back
            </button>
            <button
              onClick={() => setStep(2)}
              disabled={!canProceedFromBill}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Review Bill <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Review & Confirm */}
      {step === 2 && patient && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
              <h2 className="text-base font-bold text-slate-900">Review Bill</h2>
              <p className="text-sm text-slate-500">Confirm all details before submitting the payment request.</p>
            </div>

            <div className="p-6 space-y-6">
              {/* Patient */}
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Patient</div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                    <User size={18} className="text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">{patient.firstName}</div>
                    <div className="text-xs text-slate-500">{patient.maskedId} · {patient.employerName}</div>
                  </div>
                  <span className="ml-auto inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                    <ShieldCheck size={11} /> Verified
                  </span>
                </div>
              </div>

              {/* Visit type */}
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Visit Type</div>
                <p className="text-sm font-semibold text-slate-800">{visitType}</p>
                {visitNote && <p className="text-xs text-slate-500 mt-0.5">{visitNote}</p>}
              </div>

              {/* Line items */}
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Bill Items</div>
                <div className="space-y-2">
                  {lineItems.map(item => (
                    <div key={item.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                      <div>
                        <div className="text-sm font-medium text-slate-800">{item.description}</div>
                        <span className={cn("text-xs px-1.5 py-0.5 rounded-full font-semibold", categoryColors[item.category])}>{item.category}</span>
                      </div>
                      <span className="text-sm font-bold text-slate-900 tabular-nums">{formatGHS(parseFloat(item.amount) || 0)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial summary */}
              <div className="bg-slate-50 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Bill Subtotal</span>
                  <span className="font-bold text-slate-900">{formatGHS(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Patient&apos;s Available Balance</span>
                  <span className="font-semibold text-emerald-600">{formatGHS(walletBalance)}</span>
                </div>
                <div className="border-t border-slate-200 pt-2 mt-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold text-slate-700">HealthWallet Share</span>
                    <span className="font-bold text-blue-600">{formatGHS(healthWalletShare)}</span>
                  </div>
                  {cashOverage > 0 && (
                    <div className="flex justify-between text-sm mt-1.5">
                      <span className="font-semibold text-orange-600">Cash Overage</span>
                      <span className="font-bold text-orange-600">{formatGHS(cashOverage)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Cash overage confirmation */}
              {cashOverage > 0 && (
                <label className={cn(
                  "flex items-start gap-3 cursor-pointer p-4 rounded-xl border-2 transition-all",
                  cashConfirmed ? "bg-emerald-50 border-emerald-300" : "bg-amber-50 border-amber-300"
                )}>
                  <div
                    className={cn(
                      "w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all",
                      cashConfirmed ? "bg-emerald-600 border-emerald-600" : "bg-white border-amber-400"
                    )}
                    onClick={() => setCashConfirmed(v => !v)}
                  >
                    {cashConfirmed && <Check size={12} className="text-white" strokeWidth={3} />}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-800">Cash payment received from patient for the overage</div>
                    <div className="text-xs text-slate-500 mt-0.5">I confirm that <span className="font-bold text-orange-600">{formatGHS(cashOverage)}</span> has been collected in cash from the patient. Only the HealthWallet share will be submitted to Dexwin.</div>
                  </div>
                </label>
              )}
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-slate-700 text-sm font-semibold rounded-xl border border-slate-200 hover:bg-slate-50"
            >
              <ChevronLeft size={16} /> Edit Bill
            </button>
            <button
              onClick={handleSubmit}
              disabled={!canSubmit || isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-40"
            >
              {isSubmitting ? (
                <><Loader2 size={15} className="animate-spin" /> Submitting…</>
              ) : (
                <><Send size={15} /> Submit Payment Request</>
              )}
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Submitted */}
      {step === 3 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={32} className="text-emerald-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Payment Request Submitted</h2>
          <p className="text-slate-500 mb-2">Awaiting HealthWallet approval</p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg mb-6">
            <Shield size={14} className="text-slate-500" />
            <span className="text-sm font-mono font-semibold text-slate-700">{refNumber}</span>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-left">
            <div className="flex items-start gap-3">
              <Info size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-700">
                <p className="font-semibold mb-1">What happens next?</p>
                <p>The payment request is being processed. You&apos;ll receive an in-portal notification and email when the status changes. Settlement typically completes within minutes of approval.</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="/generate-bill" className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors">
              <Plus size={15} /> Generate Another Bill
            </a>
            <a href="/all-bills" className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-slate-700 text-sm font-semibold rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">
              View All Bills <ArrowRight size={15} />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
