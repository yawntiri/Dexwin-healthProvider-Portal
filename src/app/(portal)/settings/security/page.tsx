"use client";
import { useState } from "react";
import { mockSessions, currentUser } from "@/lib/mock-data";
import { formatTimeAgo, cn, isStrongPassword } from "@/lib/utils";
import type { Session } from "@/lib/types";
import {
  Lock, ShieldCheck, Monitor, Smartphone, Globe, LogOut, Eye, EyeOff,
  Check, X, AlertTriangle, Loader2, Shield, Key, RefreshCw
} from "lucide-react";

export default function SecurityPage() {
  const [sessions, setSessions] = useState<Session[]>(mockSessions);
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwSaving, setPwSaving] = useState(false);
  const [pwSaved, setPwSaved] = useState(false);
  const [pwError, setPwError] = useState("");

  const pwStrong = isStrongPassword(newPw);
  const pwMatch = newPw === confirmPw && newPw.length > 0;

  const handleChangePassword = async () => {
    setPwError("");
    if (!currentPw) { setPwError("Enter your current password."); return; }
    if (!pwStrong) { setPwError("Password does not meet strength requirements."); return; }
    if (!pwMatch) { setPwError("Passwords do not match."); return; }
    setPwSaving(true);
    await new Promise(r => setTimeout(r, 1500));
    setPwSaving(false);
    setPwSaved(true);
    setCurrentPw(""); setNewPw(""); setConfirmPw("");
    setTimeout(() => setPwSaved(false), 3000);
  };

  const signOutSession = (sessionId: string) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId));
  };

  const signOutAll = () => {
    setSessions(prev => prev.filter(s => s.isCurrent));
  };

  const getDeviceIcon = (device: string) => {
    if (device.toLowerCase().includes("iphone") || device.toLowerCase().includes("android")) return Smartphone;
    return Monitor;
  };

  const strengthChecks = [
    { label: "At least 8 characters", pass: newPw.length >= 8 },
    { label: "Uppercase letter", pass: /[A-Z]/.test(newPw) },
    { label: "Lowercase letter", pass: /[a-z]/.test(newPw) },
    { label: "Number", pass: /\d/.test(newPw) },
    { label: "Symbol", pass: /[^A-Za-z0-9]/.test(newPw) },
  ];

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Security</h1>
        <p className="text-sm text-slate-500 mt-0.5">Manage your password, two-factor authentication, and active sessions.</p>
      </div>

      {/* Password */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
            <Key size={16} className="text-blue-600" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Change Password</h2>
            <p className="text-xs text-slate-500">Cannot match any of your last 3 passwords.</p>
          </div>
        </div>

        {pwSaved && (
          <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700 font-semibold">
            <Check size={14} /> Password changed successfully.
          </div>
        )}
        {pwError && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
            <AlertTriangle size={14} /> {pwError}
          </div>
        )}

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Current Password</label>
            <div className="relative">
              <input
                type={showCurrentPw ? "text" : "password"}
                value={currentPw}
                onChange={e => setCurrentPw(e.target.value)}
                className="w-full px-3 py-2.5 pr-10 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
              <button onClick={() => setShowCurrentPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                {showCurrentPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">New Password</label>
            <div className="relative">
              <input
                type={showNewPw ? "text" : "password"}
                value={newPw}
                onChange={e => setNewPw(e.target.value)}
                className="w-full px-3 py-2.5 pr-10 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
              <button onClick={() => setShowNewPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                {showNewPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {newPw.length > 0 && (
              <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                {strengthChecks.map(check => (
                  <div key={check.label} className={cn("flex items-center gap-1 text-xs", check.pass ? "text-emerald-600" : "text-slate-400")}>
                    {check.pass ? <Check size={10} strokeWidth={3} /> : <X size={10} />}
                    {check.label}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Confirm New Password</label>
            <input
              type="password"
              value={confirmPw}
              onChange={e => setConfirmPw(e.target.value)}
              className={cn("w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2", confirmPw.length > 0 && !pwMatch ? "border-red-300 focus:ring-red-500/20" : "border-slate-200 focus:ring-blue-500/20 focus:border-blue-500")}
            />
            {confirmPw.length > 0 && !pwMatch && <p className="text-xs text-red-500 mt-1">Passwords do not match.</p>}
          </div>
        </div>
        <button
          onClick={handleChangePassword}
          disabled={pwSaving || !currentPw || !newPw || !confirmPw}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {pwSaving ? <Loader2 size={14} className="animate-spin" /> : <Lock size={14} />}
          {pwSaving ? "Changing…" : "Change Password"}
        </button>
      </div>

      {/* 2FA */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
              <Shield size={16} className="text-emerald-600" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Two-Factor Authentication</h2>
              <p className="text-xs text-slate-500">Required for Owners and Managers.</p>
            </div>
          </div>
          {currentUser.twoFaEnabled ? (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg">
              <ShieldCheck size={12} /> Enabled
            </span>
          ) : (
            <button className="px-3 py-1.5 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700">Enable 2FA</button>
          )}
        </div>
        <div className="mt-4 p-3 bg-slate-50 rounded-xl text-xs text-slate-600">
          2FA is sent via email to <span className="font-semibold">{currentUser.email}</span>. You are prompted on every new login.
        </div>
      </div>

      {/* Active Sessions */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center">
              <Globe size={16} className="text-slate-600" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Active Sessions</h2>
              <p className="text-xs text-slate-500">{sessions.length} session{sessions.length !== 1 ? "s" : ""} active</p>
            </div>
          </div>
          {sessions.length > 1 && (
            <button onClick={signOutAll} className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
              <LogOut size={12} /> Sign Out All Other Sessions
            </button>
          )}
        </div>
        <div className="space-y-3">
          {sessions.map(session => {
            const DeviceIcon = getDeviceIcon(session.device);
            return (
              <div key={session.id} className={cn("flex items-center gap-3 p-3 rounded-xl border", session.isCurrent ? "bg-blue-50 border-blue-200" : "bg-slate-50 border-slate-200")}>
                <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0", session.isCurrent ? "bg-blue-100" : "bg-slate-200")}>
                  <DeviceIcon size={16} className={session.isCurrent ? "text-blue-600" : "text-slate-500"} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-800">{session.device}</span>
                    {session.isCurrent && <span className="text-xs bg-blue-100 text-blue-700 font-semibold px-1.5 py-0.5 rounded-full">Current</span>}
                  </div>
                  <div className="text-xs text-slate-500">{session.browser} · {session.location}</div>
                  <div className="text-xs text-slate-400 mt-0.5">Last active {formatTimeAgo(session.lastActiveAt)}</div>
                </div>
                {!session.isCurrent && (
                  <button onClick={() => signOutSession(session.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Sign out this session">
                    <LogOut size={14} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Account lockout info */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
        <AlertTriangle size={15} className="text-amber-600 mt-0.5 flex-shrink-0" />
        <div className="text-xs text-amber-700">
          <span className="font-semibold">Account Lockout Policy:</span> 5 consecutive failed login attempts will lock your account for 15 minutes. You will be notified by email. The Owner can request an immediate unlock through Dexwin support.
        </div>
      </div>
    </div>
  );
}
