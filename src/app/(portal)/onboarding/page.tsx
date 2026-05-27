"use client";
import { useState, useEffect } from "react";
import { currentUser } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  CheckCircle, Circle, ChevronRight, Building2, CreditCard,
  Grid3X3, X, Loader2, Eye, EyeOff, Upload, Clock, Mail,
  AlertCircle, ArrowRight, Sparkles, Check, Info,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type StepId = 1 | 2 | 3;
type AccountType = "bank" | "momo";

const BANKS = [
  "GCB Bank", "Absa Ghana", "Stanbic Bank Ghana", "Ecobank Ghana",
  "Fidelity Bank Ghana", "Cal Bank", "Access Bank Ghana", "UMB Bank",
  "Agricultural Development Bank", "First Atlantic Bank", "Zenith Bank Ghana",
];

const MOMO_NETWORKS = [
  { value: "MTN", label: "MTN MoMo" },
  { value: "Telecel", label: "Telecel Cash" },
  { value: "AirtelTigo", label: "AirtelTigo Money" },
];

const SERVICE_CATEGORIES = [
  "Consultation", "Diagnostic", "Pharmacy", "Procedure", "Emergency",
];

// ─── Step 1 Modal — Facility Profile ─────────────────────────────────────────

function ProfileModal({ onClose, onComplete }: { onClose: () => void; onComplete: () => void }) {
  const [form, setForm] = useState({
    facilityName: currentUser.providerName,
    operatingHours: "Mon–Fri 8:00 AM – 8:00 PM · Sat 9:00 AM – 4:00 PM",
    description: "",
    contactPhone: "+233302123456",
    emergencyPhone: "",
    website: "",
  });
  const [saving, setSaving] = useState(false);
  const [logoFile, setLogoFile] = useState<string | null>(null);

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 1400));
    setSaving(false);
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh] animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
              <Building2 size={16} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Complete Facility Profile</h2>
              <p className="text-xs text-slate-500">Help Dexwin verify your account faster</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg">
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-4">
          {/* Logo upload */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Facility Logo</label>
            <div
              className={cn(
                "flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed rounded-xl cursor-pointer transition-colors",
                logoFile ? "border-emerald-300 bg-emerald-50" : "border-slate-200 hover:border-blue-300 hover:bg-blue-50/30"
              )}
              onClick={() => setLogoFile(logoFile ? null : "logo-uploaded")}
            >
              {logoFile ? (
                <>
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                    <Check size={20} className="text-emerald-600" />
                  </div>
                  <span className="text-sm font-medium text-emerald-700">Logo uploaded</span>
                  <span className="text-xs text-slate-400">Click to remove</span>
                </>
              ) : (
                <>
                  <Upload size={20} className="text-slate-400" />
                  <span className="text-sm text-slate-600 font-medium">Click to upload logo</span>
                  <span className="text-xs text-slate-400">PNG, JPG up to 2 MB</span>
                </>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Facility Name</label>
            <input
              type="text"
              value={form.facilityName}
              onChange={e => setForm(f => ({ ...f, facilityName: e.target.value }))}
              className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Operating Hours</label>
            <input
              type="text"
              value={form.operatingHours}
              onChange={e => setForm(f => ({ ...f, operatingHours: e.target.value }))}
              placeholder="e.g. Mon–Fri 8:00 AM – 6:00 PM"
              className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Facility Description <span className="text-slate-400 font-normal">(optional)</span></label>
            <textarea
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Briefly describe your facility, services offered, and specialisations..."
              rows={3}
              className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Contact Phone</label>
              <input
                type="text"
                value={form.contactPhone}
                onChange={e => setForm(f => ({ ...f, contactPhone: e.target.value }))}
                className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Emergency Line <span className="text-slate-400 font-normal">(opt.)</span></label>
              <input
                type="text"
                value={form.emergencyPhone}
                onChange={e => setForm(f => ({ ...f, emergencyPhone: e.target.value }))}
                placeholder="+233..."
                className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Website <span className="text-slate-400 font-normal">(optional)</span></label>
            <input
              type="url"
              value={form.website}
              onChange={e => setForm(f => ({ ...f, website: e.target.value }))}
              placeholder="https://yourfacility.com"
              className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-2 text-xs text-blue-700">
            <Info size={13} className="mt-0.5 flex-shrink-0" />
            This information helps Dexwin verify your facility and will be visible to HealthWallet users and employers.
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 flex-shrink-0">
          <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50 transition-colors"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
            {saving ? "Saving…" : "Save Profile"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Step 2 Modal — Settlement Account ───────────────────────────────────────

function SettlementModal({ onClose, onComplete }: { onClose: () => void; onComplete: () => void }) {
  const [accountType, setAccountType] = useState<AccountType>("bank");
  const [step, setStep] = useState<"form" | "verify" | "done">("form");
  const [form, setForm] = useState({ bankName: "", accountNumber: "", accountName: "", network: "MTN", momoNumber: "", momoName: "" });
  const [saving, setSaving] = useState(false);
  const [verifyCode, setVerifyCode] = useState("");

  const handleSubmitForm = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 1200));
    setSaving(false);
    setStep("verify");
  };

  const handleVerify = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    setSaving(false);
    setStep("done");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
              <CreditCard size={16} className="text-emerald-600" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Add Settlement Account</h2>
              <p className="text-xs text-slate-500">Where Dexwin sends your payments</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg">
            <X size={16} />
          </button>
        </div>

        <div className="p-6">
          {step === "form" && (
            <div className="space-y-4">
              {/* Account type tabs */}
              <div className="flex bg-slate-100 rounded-xl p-1">
                {(["bank", "momo"] as AccountType[]).map(t => (
                  <button
                    key={t}
                    onClick={() => setAccountType(t)}
                    className={cn("flex-1 py-2 text-sm font-semibold rounded-lg transition-all", accountType === t ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700")}
                  >
                    {t === "bank" ? "Bank Account" : "Mobile Money"}
                  </button>
                ))}
              </div>

              {accountType === "bank" ? (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Bank</label>
                    <select value={form.bankName} onChange={e => setForm(f => ({ ...f, bankName: e.target.value }))} className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                      <option value="">Select bank…</option>
                      {BANKS.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Account Number</label>
                    <input type="text" value={form.accountNumber} onChange={e => setForm(f => ({ ...f, accountNumber: e.target.value }))} placeholder="0123456789" className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Account Name</label>
                    <input type="text" value={form.accountName} onChange={e => setForm(f => ({ ...f, accountName: e.target.value }))} placeholder="Name on account" className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Network</label>
                    <div className="flex gap-2">
                      {MOMO_NETWORKS.map(n => (
                        <button key={n.value} onClick={() => setForm(f => ({ ...f, network: n.value }))} className={cn("flex-1 py-2.5 text-xs font-semibold rounded-xl border-2 transition-all", form.network === n.value ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-slate-200 text-slate-500 hover:border-slate-300")}>
                          {n.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">MoMo Number</label>
                    <input type="tel" value={form.momoNumber} onChange={e => setForm(f => ({ ...f, momoNumber: e.target.value }))} placeholder="024XXXXXXX" className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Account Name</label>
                    <input type="text" value={form.momoName} onChange={e => setForm(f => ({ ...f, momoName: e.target.value }))} placeholder="Registered name" className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                  </div>
                </>
              )}

              <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl flex items-start gap-2 text-xs text-amber-700">
                <AlertCircle size={13} className="mt-0.5 flex-shrink-0" />
                Dexwin will send a micro-credit of <strong>GH₵0.01</strong> to verify the account. This takes 1–2 minutes.
              </div>

              <button onClick={handleSubmitForm} disabled={saving} className="w-full inline-flex items-center justify-center gap-2 py-2.5 text-sm font-semibold bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50 transition-colors">
                {saving ? <Loader2 size={14} className="animate-spin" /> : <ArrowRight size={14} />}
                {saving ? "Sending verification…" : "Continue to Verify"}
              </button>
            </div>
          )}

          {step === "verify" && (
            <div className="space-y-4 text-center">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto">
                <CreditCard size={24} className="text-emerald-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Check your account</h3>
                <p className="text-sm text-slate-500 mt-1">We sent <strong className="text-slate-700">GH₵0.01</strong> to your account. Enter the last 2 digits of the credit amount to confirm.</p>
              </div>
              <div className="flex gap-2 justify-center">
                <span className="flex items-center justify-center w-12 h-12 border-2 border-slate-200 rounded-xl text-lg font-bold text-slate-400">0</span>
                <span className="flex items-center justify-center w-12 h-12 border-2 border-slate-200 rounded-xl text-lg font-bold text-slate-400">.</span>
                <span className="flex items-center justify-center w-12 h-12 border-2 border-slate-200 rounded-xl text-lg font-bold text-slate-400">0</span>
                <input
                  type="text"
                  value={verifyCode}
                  onChange={e => setVerifyCode(e.target.value.replace(/\D/g, "").slice(0, 1))}
                  maxLength={1}
                  placeholder="?"
                  className="w-12 h-12 text-center text-lg font-bold border-2 border-blue-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                />
              </div>
              <p className="text-xs text-slate-400">Enter the last digit of the GH₵0.0? amount you received.</p>
              <div className="flex gap-2 pt-2">
                <button onClick={() => setStep("form")} className="flex-1 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors">Back</button>
                <button onClick={handleVerify} disabled={saving || !verifyCode} className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 text-sm font-semibold bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50 transition-colors">
                  {saving ? <Loader2 size={14} className="animate-spin" /> : null}
                  {saving ? "Verifying…" : "Confirm"}
                </button>
              </div>
            </div>
          )}

          {step === "done" && (
            <div className="text-center space-y-4 py-2">
              <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mx-auto">
                <CheckCircle size={28} className="text-emerald-500" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Account verified!</h3>
                <p className="text-sm text-slate-500 mt-1">Your settlement account has been added and set as active.</p>
              </div>
              <button onClick={onComplete} className="w-full py-2.5 text-sm font-semibold bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors">
                Continue
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Step 3 Modal — Service Catalog ──────────────────────────────────────────

function ServiceModal({ onClose, onComplete }: { onClose: () => void; onComplete: () => void }) {
  const [services, setServices] = useState([{ name: "", category: "Consultation", code: "", price: "" }]);
  const [saving, setSaving] = useState(false);

  const addRow = () => setServices(s => [...s, { name: "", category: "Consultation", code: "", price: "" }]);
  const removeRow = (i: number) => setServices(s => s.filter((_, idx) => idx !== i));
  const update = (i: number, key: string, val: string) => setServices(s => s.map((row, idx) => idx === i ? { ...row, [key]: val } : row));

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 1200));
    setSaving(false);
    onComplete();
  };

  const isValid = services.some(s => s.name.trim() && s.price.trim());

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh] animate-slide-up">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center">
              <Grid3X3 size={16} className="text-violet-600" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Setup Service Catalog</h2>
              <p className="text-xs text-slate-500">Add the services your facility offers</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg">
            <X size={16} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-3">
          <p className="text-sm text-slate-500">Add at least one service to start generating bills. You can always add more later from the Services page.</p>

          {services.map((row, i) => (
            <div key={i} className="p-4 bg-slate-50 rounded-xl space-y-3 relative">
              {services.length > 1 && (
                <button onClick={() => removeRow(i)} className="absolute top-3 right-3 p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                  <X size={14} />
                </button>
              )}
              <div className="grid grid-cols-2 gap-2">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Service Name</label>
                  <input type="text" value={row.name} onChange={e => update(i, "name", e.target.value)} placeholder="e.g. General Consultation" className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Category</label>
                  <select value={row.category} onChange={e => update(i, "category", e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                    {SERVICE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Service Code</label>
                  <input type="text" value={row.code} onChange={e => update(i, "code", e.target.value)} placeholder="e.g. CONS-001" className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Price (GH₵)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-medium">GH₵</span>
                    <input type="number" value={row.price} onChange={e => update(i, "price", e.target.value)} placeholder="0.00" className="w-full pl-12 pr-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                  </div>
                </div>
              </div>
            </div>
          ))}

          <button onClick={addRow} className="w-full py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center justify-center gap-2">
            + Add another service
          </button>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 flex-shrink-0">
          <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
          <button onClick={handleSave} disabled={saving || !isValid} className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50 transition-colors">
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
            {saving ? "Saving…" : `Save ${services.filter(s => s.name.trim()).length || ""} Service${services.filter(s => s.name.trim()).length !== 1 ? "s" : ""}`}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Checklist Item ───────────────────────────────────────────────────────────

interface ChecklistItemProps {
  step: StepId;
  icon: React.ElementType;
  title: string;
  description: string;
  completed: boolean;
  onBegin: () => void;
  isLast?: boolean;
}

function ChecklistItem({ step, icon: Icon, title, description, completed, onBegin, isLast }: ChecklistItemProps) {
  return (
    <div className={cn("flex items-center gap-4 py-5 px-6", !isLast && "border-b border-slate-100")}>
      {/* Step indicator */}
      <div className={cn(
        "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold transition-all",
        completed ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-500 border-2 border-slate-200"
      )}>
        {completed ? <Check size={16} strokeWidth={3} /> : step}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className={cn("text-sm font-bold", completed ? "text-slate-500 line-through" : "text-slate-900")}>{title}</p>
          {completed && <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full"><Check size={9} strokeWidth={3} /> Done</span>}
        </div>
        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{description}</p>
      </div>

      {/* Action */}
      {!completed ? (
        <button
          onClick={onBegin}
          className="flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white text-sm font-semibold rounded-full hover:bg-slate-700 active:scale-95 transition-all"
        >
          Begin <ArrowRight size={14} />
        </button>
      ) : (
        <button
          onClick={onBegin}
          className="flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 text-slate-500 text-sm font-medium rounded-full hover:bg-slate-200 transition-all"
        >
          Edit
        </button>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const [completed, setCompleted] = useState<Set<StepId>>(new Set());
  const [activeModal, setActiveModal] = useState<StepId | null>(null);

  const completedCount = completed.size;
  const allDone = completedCount === 3;
  const progressPct = (completedCount / 3) * 100;

  const markComplete = (step: StepId) => {
    setCompleted(prev => new Set([...prev, step]));
    setActiveModal(null);
    // Auto-open next step
    if (step < 3 && !completed.has((step + 1) as StepId)) {
      setTimeout(() => setActiveModal((step + 1) as StepId), 400);
    }
  };

  const steps = [
    {
      step: 1 as StepId,
      icon: Building2,
      title: "Complete facility profile",
      description: "Add your facility details, operating information, and verification records to help Dexwin validate and activate your account.",
    },
    {
      step: 2 as StepId,
      icon: CreditCard,
      title: "Add settlement account",
      description: "Set up and verify your bank account or Mobile Money wallet to securely receive HealthWallet settlements.",
    },
    {
      step: 3 as StepId,
      icon: Grid3X3,
      title: "Setup service catalog",
      description: "Create and manage your facility's healthcare services and pricing to enable faster and more accurate billing.",
    },
  ];

  return (
    <div className="flex flex-col min-h-full bg-slate-50">
      {/* Modals */}
      {activeModal === 1 && <ProfileModal onClose={() => setActiveModal(null)} onComplete={() => markComplete(1)} />}
      {activeModal === 2 && <SettlementModal onClose={() => setActiveModal(null)} onComplete={() => markComplete(2)} />}
      {activeModal === 3 && <ServiceModal onClose={() => setActiveModal(null)} onComplete={() => markComplete(3)} />}

      {/* Page header */}
      <div className="bg-white border-b border-slate-200 px-6 py-5">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-700 text-xs font-semibold rounded-full ring-1 ring-amber-200 mb-3">
            <Clock size={11} /> Account under review · 2–3 business days
          </div>
          <h1 className="text-xl font-bold text-slate-900">Welcome, {currentUser.providerName}!</h1>
          <p className="text-sm text-slate-500 mt-1">
            Your registration is being reviewed by the Dexwin team. While you wait, complete the steps below to be ready to start billing the moment your account is approved.
          </p>
        </div>
      </div>

      <div className="flex-1 px-6 py-6 max-w-2xl w-full space-y-5">

        {/* ── Checklist Card ── */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Card header */}
          <div className="px-6 pt-5 pb-4 border-b border-slate-100">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Onboarding checklist</h2>
                <p className="text-sm text-slate-500 mt-0.5">Complete all steps to unlock payroll disbursements.</p>
              </div>
              <div className="text-right flex-shrink-0">
                <span className="text-sm font-bold text-slate-700">{completedCount} of 3 completed</span>
                {/* Progress bar */}
                <div className="mt-2 w-32 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Steps */}
          {steps.map((s, i) => (
            <ChecklistItem
              key={s.step}
              {...s}
              completed={completed.has(s.step)}
              onBegin={() => setActiveModal(s.step)}
              isLast={i === steps.length - 1}
            />
          ))}
        </div>

        {/* ── All Done State ── */}
        {allDone && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 flex items-start gap-4 animate-slide-up">
            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
              <Sparkles size={18} className="text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-emerald-900">You're all set!</h3>
              <p className="text-sm text-emerald-700 mt-0.5 leading-relaxed">
                All setup steps are complete. Dexwin is reviewing your account and will notify you at <strong>{currentUser.email}</strong> once approved. This typically takes 2–3 business days.
              </p>
              <div className="mt-3 flex items-center gap-2">
                <Link href="/support" className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 underline underline-offset-2">
                  Contact support <ChevronRight size={12} />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ── What happens next ── */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Info size={15} className="text-slate-400" /> What happens next?
          </h3>
          <div className="space-y-4">
            {[
              { icon: CheckCircle, color: "text-blue-500 bg-blue-50", title: "Dexwin reviews your application", body: "Our team verifies your Ghana Health Service license number, facility GPS address, and submitted documents. This takes 2–3 business days." },
              { icon: Mail, color: "text-violet-500 bg-violet-50", title: "You receive an approval email", body: `An email will be sent to ${currentUser.email} with your account activation confirmation and onboarding guide.` },
              { icon: Sparkles, color: "text-emerald-500 bg-emerald-50", title: "Start billing patients", body: "Once active, you can generate bills for HealthWallet patients immediately. Settlements are processed within 24–48 hours of bill approval." },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5", item.color)}>
                  <item.icon size={15} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{item.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Need help ── */}
        <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 text-sm">
          <span className="text-slate-500">Have questions about the review process?</span>
          <Link href="/support" className="inline-flex items-center gap-1.5 font-semibold text-blue-600 hover:text-blue-700 transition-colors">
            Contact support <ChevronRight size={14} />
          </Link>
        </div>

      </div>
    </div>
  );
}
