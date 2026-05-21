"use client";
import { useState } from "react";
import { mockProvider, currentUser } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Building2, Upload, Lock, Edit2, Check, X, ExternalLink, ShieldCheck, Clock } from "lucide-react";

const canEdit = currentUser.role === "Owner" || currentUser.role === "Manager";

export default function ProfilePage() {
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    facilityName: mockProvider.facilityName,
    facilityType: mockProvider.facilityType,
    primaryContactName: mockProvider.primaryContactName,
    primaryContactPhone: mockProvider.primaryContactPhone,
    businessEmail: mockProvider.businessEmail,
    businessPhone: mockProvider.businessPhone,
    ghanaGpsAddress: mockProvider.ghanaGpsAddress,
    operatingHours: mockProvider.operatingHours ?? "",
    hefraLicenseNumber: mockProvider.hefraLicenseNumber ?? "",
  });

  const handleSave = async () => {
    await new Promise(r => setTimeout(r, 800));
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 3000);
  };

  const inputClass = (disabled: boolean) => cn(
    "w-full px-3 py-2.5 border rounded-lg text-sm transition-colors",
    disabled
      ? "bg-slate-50 border-slate-100 text-slate-500 cursor-not-allowed"
      : "bg-white border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
  );

  return (
    <div className="max-w-2xl space-y-6">
      {saved && (
        <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700 font-semibold">
          <Check size={15} /> Changes submitted for Dexwin Admin review.
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Facility Profile</h1>
          <p className="text-sm text-slate-500 mt-0.5">Updates to most fields require Dexwin Admin review before taking effect.</p>
        </div>
        {canEdit && !editing && (
          <button onClick={() => setEditing(true)} className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 shadow-sm">
            <Edit2 size={14} /> Edit Profile
          </button>
        )}
        {editing && (
          <div className="flex items-center gap-2">
            <button onClick={() => setEditing(false)} className="inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50">
              <X size={14} /> Cancel
            </button>
            <button onClick={handleSave} className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm">
              <Check size={14} /> Save Changes
            </button>
          </div>
        )}
      </div>

      {/* Verified badge */}
      {mockProvider.isVerifiedByDexwin && (
        <div className="flex items-center gap-2 p-3 bg-teal-50 border border-teal-200 rounded-xl">
          <ShieldCheck size={16} className="text-teal-600" />
          <span className="text-sm font-semibold text-teal-700">Verified by Dexwin</span>
          <span className="text-xs text-teal-500 ml-auto">Since {mockProvider.createdAt.getFullYear()}</span>
        </div>
      )}

      {/* Logo */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="text-sm font-bold text-slate-900 mb-4">Facility Logo</h3>
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-2xl bg-blue-100 flex items-center justify-center flex-shrink-0">
            <Building2 size={32} className="text-blue-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-700">Upload a PNG or JPG logo</p>
            <p className="text-xs text-slate-500 mt-0.5">Shown on the provider portal header and employee-facing receipts.</p>
            <button className="inline-flex items-center gap-2 mt-3 px-3 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50">
              <Upload size={13} /> Upload Logo
            </button>
          </div>
        </div>
      </div>

      {/* Facility details */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Facility Details</h3>
        {editing && (
          <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl">
            <Clock size={14} className="text-amber-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-amber-700">Changes to facility details require Dexwin Admin review. Your current details remain active until the update is approved.</p>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Facility Name</label>
            <input value={form.facilityName} onChange={e => setForm(f => ({ ...f, facilityName: e.target.value }))} disabled={!editing} className={inputClass(!editing)} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Facility Type</label>
            <select value={form.facilityType} onChange={e => setForm(f => ({ ...f, facilityType: e.target.value as any }))} disabled={!editing} className={cn(inputClass(!editing), "appearance-none")}>
              {["Hospital", "Clinic", "Pharmacy", "Diagnostic Centre"].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Ghana GPS Address</label>
            <input value={form.ghanaGpsAddress} onChange={e => setForm(f => ({ ...f, ghanaGpsAddress: e.target.value }))} disabled={!editing} className={inputClass(!editing)} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Operating Hours</label>
            <input value={form.operatingHours} onChange={e => setForm(f => ({ ...f, operatingHours: e.target.value }))} disabled={!editing} className={inputClass(!editing)} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">HeFRA License Number</label>
            <input value={form.hefraLicenseNumber} onChange={e => setForm(f => ({ ...f, hefraLicenseNumber: e.target.value }))} disabled={!editing} className={inputClass(!editing)} />
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Contact Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Primary Contact Name</label>
            <input value={form.primaryContactName} onChange={e => setForm(f => ({ ...f, primaryContactName: e.target.value }))} disabled={!editing} className={inputClass(!editing)} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Primary Contact Phone</label>
            <input value={form.primaryContactPhone} onChange={e => setForm(f => ({ ...f, primaryContactPhone: e.target.value }))} disabled={!editing} className={inputClass(!editing)} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Business Email</label>
            <input value={form.businessEmail} onChange={e => setForm(f => ({ ...f, businessEmail: e.target.value }))} disabled={!editing} className={inputClass(!editing)} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Business Phone</label>
            <input value={form.businessPhone} onChange={e => setForm(f => ({ ...f, businessPhone: e.target.value }))} disabled={!editing} className={inputClass(!editing)} />
          </div>
        </div>
      </div>

      {/* Banking */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-900">Banking Information</h3>
          <a href="/settings/settlement" className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
            Manage <ExternalLink size={11} />
          </a>
        </div>
        <p className="text-xs text-slate-500">Only the Owner can modify settlement details. View or update them in <a href="/settings/settlement" className="text-blue-600 hover:underline">Settlement Account settings</a>.</p>
        <div className="mt-3 flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
          <Lock size={14} className="text-slate-400" />
          <div>
            <p className="text-sm font-semibold text-slate-700">GCB Bank · ****7823</p>
            <p className="text-xs text-slate-500">Active settlement account · Verified</p>
          </div>
        </div>
      </div>
    </div>
  );
}
