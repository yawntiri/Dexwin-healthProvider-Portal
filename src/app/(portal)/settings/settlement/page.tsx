"use client";
import { useState } from "react";
import { mockSettlementAccounts, currentUser } from "@/lib/mock-data";
import { formatDateShort, cn } from "@/lib/utils";
import type { SettlementAccount } from "@/lib/types";
import {
  CreditCard, Plus, Star, Trash2, Check, X, Loader2, AlertTriangle,
  ShieldCheck, Lock, CheckCircle2, Wifi, AlertCircle
} from "lucide-react";

const isOwner = currentUser.role === "Owner";

function AddAccountModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [accountType, setAccountType] = useState<"Bank" | "MoMo">("Bank");
  const [step, setStep] = useState<"form" | "verify" | "done">("form");
  const [verifying, setVerifying] = useState(false);
  const [form, setForm] = useState({ accountHolderName: "", accountNumber: "", bankName: "", bankBranch: "", momoNetwork: "MTN", momoNumber: "" });

  if (!open) return null;

  const handleSubmit = async () => {
    setStep("verify");
  };

  const handleVerify = async () => {
    setVerifying(true);
    await new Promise(r => setTimeout(r, 2000));
    setVerifying(false);
    setStep("done");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl animate-slide-up">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">Add Settlement Account</h2>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg">
            <X size={18} />
          </button>
        </div>
        <div className="p-6">
          {step === "form" && (
            <div className="space-y-4">
              <div className="flex gap-3">
                {(["Bank", "MoMo"] as const).map(t => (
                  <button key={t} onClick={() => setAccountType(t)} className={cn("flex-1 py-3 rounded-xl border-2 text-sm font-semibold transition-all", accountType === t ? "border-blue-500 bg-blue-50 text-blue-700" : "border-slate-200 text-slate-600 hover:border-slate-300")}>
                    {t === "Bank" ? "🏦 Bank Account" : "📱 Mobile Money"}
                  </button>
                ))}
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Account Holder Name <span className="text-red-500">*</span></label>
                <input value={form.accountHolderName} onChange={e => setForm(f => ({ ...f, accountHolderName: e.target.value }))} placeholder="Must match facility name" className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                <p className="text-xs text-slate-500 mt-1">Must reasonably match your registered facility name.</p>
              </div>
              {accountType === "Bank" ? (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Bank Name</label>
                    <input value={form.bankName} onChange={e => setForm(f => ({ ...f, bankName: e.target.value }))} placeholder="e.g. GCB Bank" className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Account Number</label>
                    <input value={form.accountNumber} onChange={e => setForm(f => ({ ...f, accountNumber: e.target.value }))} placeholder="Bank account number" className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Branch</label>
                    <input value={form.bankBranch} onChange={e => setForm(f => ({ ...f, bankBranch: e.target.value }))} placeholder="Branch name" className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Network</label>
                    <select value={form.momoNetwork} onChange={e => setForm(f => ({ ...f, momoNetwork: e.target.value }))} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none">
                      {["MTN", "Telecel", "AirtelTigo"].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Mobile Money Number</label>
                    <input value={form.momoNumber} onChange={e => setForm(f => ({ ...f, momoNumber: e.target.value }))} placeholder="+233 XX XXX XXXX" className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono" />
                  </div>
                </>
              )}
            </div>
          )}
          {step === "verify" && (
            <div className="text-center py-4 space-y-4">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto">
                <Wifi size={26} className="text-blue-600" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Micro-credit Verification</h3>
              <p className="text-sm text-slate-500">We&apos;ve sent <span className="font-bold text-emerald-600">GH₵0.01</span> to your account. Please confirm receipt to verify your account.</p>
              <button
                onClick={handleVerify}
                disabled={verifying}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {verifying ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                {verifying ? "Verifying…" : "Confirm Receipt (GH₵0.01)"}
              </button>
            </div>
          )}
          {step === "done" && (
            <div className="text-center py-4 space-y-4">
              <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto">
                <ShieldCheck size={26} className="text-emerald-600" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Account Verified!</h3>
              <p className="text-sm text-slate-500">Your settlement account has been verified and is ready for use.</p>
              <button onClick={onClose} className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
                <Check size={14} /> Done
              </button>
            </div>
          )}
        </div>
        {step === "form" && (
          <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-100">
            <button onClick={onClose} className="px-4 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50">Cancel</button>
            <button onClick={handleSubmit} className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Check size={14} /> Add Account
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SettlementPage() {
  const [accounts, setAccounts] = useState<SettlementAccount[]>(mockSettlementAccounts);
  const [addOpen, setAddOpen] = useState(false);
  const [switchConfirm, setSwitchConfirm] = useState<string | null>(null);

  if (!isOwner) {
    return (
      <div className="max-w-2xl space-y-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Settlement Account</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage your payout account for HealthWallet settlements.</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <Lock size={22} className="text-slate-400" />
          </div>
          <h3 className="text-sm font-semibold text-slate-700 mb-1">Settlement managed by Owner</h3>
          <p className="text-sm text-slate-500">Only the Owner can view and modify settlement account details.</p>
        </div>
      </div>
    );
  }

  const handleSetActive = (id: string) => {
    setSwitchConfirm(id);
  };

  const confirmSwitch = () => {
    if (!switchConfirm) return;
    setAccounts(prev => prev.map(a => ({ ...a, isActive: a.id === switchConfirm })));
    setSwitchConfirm(null);
  };

  const handleRemove = (id: string) => {
    const acct = accounts.find(a => a.id === id);
    if (acct?.isActive) return;
    setAccounts(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Settlement Account</h1>
          <p className="text-sm text-slate-500 mt-0.5">Payments are settled to your active account.</p>
        </div>
        <button onClick={() => setAddOpen(true)} className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm">
          <Plus size={15} /> Add Account
        </button>
      </div>

      {/* Switch confirm */}
      {switchConfirm && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-bold text-amber-800">Confirm Account Switch</p>
              <p className="text-sm text-amber-700 mt-1">Switching takes effect immediately for new approvals. In-flight approved payments at this moment will still route to the current active account.</p>
              <div className="flex gap-3 mt-3">
                <button onClick={confirmSwitch} className="px-3 py-1.5 text-sm font-semibold bg-amber-600 text-white rounded-lg hover:bg-amber-700">Confirm Switch</button>
                <button onClick={() => setSwitchConfirm(null)} className="px-3 py-1.5 text-sm font-semibold text-amber-700 bg-amber-100 rounded-lg hover:bg-amber-200">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {accounts.map(acct => (
          <div key={acct.id} className={cn("bg-white rounded-2xl border shadow-sm p-5", acct.isActive ? "border-blue-300 ring-2 ring-blue-100" : "border-slate-200")}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-lg", acct.type === "Bank" ? "bg-slate-100" : "bg-yellow-50")}>
                  {acct.type === "Bank" ? "🏦" : "📱"}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">
                      {acct.type === "Bank" ? `${acct.bankName} · ****${acct.accountNumber.slice(-4)}` : `${acct.momoNetwork} MoMo · ****${(acct.momoNumber ?? "").slice(-4)}`}
                    </span>
                    {acct.isActive && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                        <Star size={10} fill="currentColor" /> Active
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">{acct.accountHolderName}</div>
                  {acct.status === "Verified" && (
                    <div className="flex items-center gap-1 mt-1 text-xs text-emerald-600 font-semibold">
                      <ShieldCheck size={11} /> Verified {acct.verifiedAt ? formatDateShort(acct.verifiedAt) : ""}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!acct.isActive && acct.status === "Verified" && (
                  <button onClick={() => handleSetActive(acct.id)} className="px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                    Set Active
                  </button>
                )}
                {!acct.isActive && (
                  <button onClick={() => handleRemove(acct.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Remove account">
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500">
        <p className="font-semibold text-slate-600 mb-1">Settlement Policy</p>
        <ul className="space-y-1 list-disc list-inside">
          <li>Only one account can be active at a time.</li>
          <li>In-flight payments at the time of a switch continue to the previous active account.</li>
          <li>Removing the active account requires another verified account to be made active in the same action.</li>
          <li>All settlement account events are logged in the Audit Trail.</li>
        </ul>
      </div>

      <AddAccountModal open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  );
}
