"use client";
import { useState } from "react";
import { currentUser } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Bell, Mail, Monitor, Check, Info } from "lucide-react";

const isOwnerOrManager = currentUser.role === "Owner" || currentUser.role === "Manager";

interface NotifSetting {
  category: string;
  description: string;
  email: boolean;
  inPortal: boolean;
  emailRequired?: boolean;
  inPortalRequired?: boolean;
  ownerManagerOnly?: boolean;
}

const defaultSettings: NotifSetting[] = [
  { category: "Payment Approved", description: "When a payment request is approved by Dexwin", email: true, inPortal: true },
  { category: "Payment Settled", description: "When payment is settled to your bank/MoMo account", email: true, inPortal: true },
  { category: "Payment Failed", description: "When a settlement to your account fails", email: true, inPortal: true, inPortalRequired: true },
  { category: "Payment Disputed", description: "When a payment is under dispute", email: true, inPortal: true, inPortalRequired: true },
  { category: "Team Changes", description: "Invitations, role changes, and deactivations", email: true, inPortal: true, ownerManagerOnly: true },
  { category: "Support Ticket Updates", description: "Replies and status changes on your tickets", email: true, inPortal: true },
];

function Toggle({ checked, onChange, disabled }: { checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={() => !disabled && onChange(!checked)}
      className={cn(
        "relative w-11 h-6 rounded-full transition-all focus:outline-none",
        checked ? "bg-blue-600" : "bg-slate-200",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <span className={cn("absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform", checked && "translate-x-5")} />
    </button>
  );
}

export default function NotificationsPage() {
  const [settings, setSettings] = useState<NotifSetting[]>(defaultSettings);
  const [saved, setSaved] = useState(false);

  const toggle = (index: number, field: "email" | "inPortal") => {
    setSettings(prev => prev.map((s, i) => {
      if (i !== index) return s;
      if (field === "inPortal" && s.inPortalRequired) return s;
      return { ...s, [field]: !s[field] };
    }));
  };

  const handleSave = async () => {
    await new Promise(r => setTimeout(r, 500));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const visibleSettings = settings.filter(s => !s.ownerManagerOnly || isOwnerOrManager);

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Notification Preferences</h1>
          <p className="text-sm text-slate-500 mt-0.5">Per-user preferences — these apply only to your account.</p>
        </div>
        <button onClick={handleSave} className={cn("inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg shadow-sm transition-all", saved ? "bg-emerald-600 text-white" : "bg-blue-600 text-white hover:bg-blue-700")}>
          {saved ? <><Check size={14} /> Saved!</> : "Save Preferences"}
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Header row */}
        <div className="flex items-center px-5 py-3 border-b border-slate-200 bg-slate-50/50">
          <div className="flex-1 text-xs font-bold text-slate-500 uppercase tracking-wider">Notification</div>
          <div className="flex items-center gap-8 mr-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider w-16 justify-center">
              <Mail size={12} /> Email
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider w-20 justify-center">
              <Monitor size={12} /> In-Portal
            </div>
          </div>
        </div>

        {/* Notification rows */}
        <div className="divide-y divide-slate-100">
          {visibleSettings.map((setting, i) => (
            <div key={setting.category} className="flex items-center px-5 py-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-800">{setting.category}</span>
                  {(setting.emailRequired || setting.inPortalRequired) && (
                    <span className="text-xs bg-red-50 text-red-600 px-1.5 py-0.5 rounded-full font-semibold">Required</span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{setting.description}</p>
              </div>
              <div className="flex items-center gap-8 ml-4">
                <div className="w-16 flex justify-center">
                  <Toggle
                    checked={setting.email}
                    onChange={() => toggle(i, "email")}
                  />
                </div>
                <div className="w-20 flex justify-center">
                  <Toggle
                    checked={setting.inPortal}
                    onChange={() => toggle(i, "inPortal")}
                    disabled={setting.inPortalRequired}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-700">
        <Info size={13} className="mt-0.5 flex-shrink-0" />
        <p>Payment Failed and Payment Disputed in-portal notifications are always on for Owners and Managers and cannot be disabled. Changes take effect immediately and are logged in the Audit Trail.</p>
      </div>
    </div>
  );
}
