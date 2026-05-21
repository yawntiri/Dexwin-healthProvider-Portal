"use client";
import { useState } from "react";
import { mockTeam, currentUser } from "@/lib/mock-data";
import { formatTimeAgo, cn } from "@/lib/utils";
import type { TeamMember, UserRole, UserStatus } from "@/lib/types";
import {
  UserPlus, PowerOff, Power, X, Check,
  Loader2, Mail, Crown
} from "lucide-react";

const isOwner = currentUser.role === "Owner";
const isManager = currentUser.role === "Manager";
const canInvite = isOwner || isManager;

const statusColors: Record<UserStatus, string> = {
  Active: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  Invited: "bg-violet-50 text-violet-700 ring-1 ring-violet-200",
  Deactivated: "bg-slate-100 text-slate-400",
};

const roleColors: Record<UserRole, string> = {
  Owner: "bg-indigo-50 text-indigo-700",
  Manager: "bg-blue-50 text-blue-700",
  Staff: "bg-slate-100 text-slate-600",
};

function InviteModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"Manager" | "Staff">("Staff");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  if (!open) return null;

  const handleSend = async () => {
    if (!email) return;
    setSending(true);
    await new Promise(r => setTimeout(r, 1200));
    setSending(false);
    setSent(true);
    setTimeout(() => { setSent(false); onClose(); setEmail(""); }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl animate-slide-up">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">Invite Team Member</h2>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg">
            <X size={18} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          {sent ? (
            <div className="flex flex-col items-center py-6 text-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center mb-3">
                <Check size={22} className="text-emerald-600" />
              </div>
              <p className="text-sm font-bold text-slate-900">Invitation sent!</p>
              <p className="text-sm text-slate-500 mt-1">An invitation was sent to <span className="font-semibold">{email}</span>. It expires in 7 days.</p>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="colleague@hospital.com"
                    className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Role</label>
                <div className="flex gap-3">
                  {(isOwner ? ["Manager", "Staff"] : ["Staff"]).map(r => (
                    <button
                      key={r}
                      onClick={() => setRole(r as "Manager" | "Staff")}
                      className={cn(
                        "flex-1 flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all",
                        role === r ? "border-blue-500 bg-blue-50" : "border-slate-200 hover:border-slate-300"
                      )}
                    >
                      <div className={cn("text-sm font-bold", role === r ? "text-blue-700" : "text-slate-700")}>{r}</div>
                      <div className="text-xs text-slate-500 text-center">
                        {r === "Manager" ? "Can manage team, bills, reports" : "Can generate bills and view patients"}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-xs text-slate-500">Invitations are sent by email and expire after 7 days. The invited user sets a password and enrolls 2FA on first login.</p>
            </>
          )}
        </div>
        {!sent && (
          <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-100">
            <button onClick={onClose} className="px-4 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50">Cancel</button>
            <button
              onClick={handleSend}
              disabled={!email || sending}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {sending ? <Loader2 size={14} className="animate-spin" /> : <Mail size={14} />}
              {sending ? "Sending…" : "Send Invitation"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TeamPage() {
  const [team, setTeam] = useState<TeamMember[]>(mockTeam);
  const [inviteOpen, setInviteOpen] = useState(false);

  const toggleStatus = (id: string) => {
    setTeam(prev => prev.map(m => m.id === id ? { ...m, status: m.status === "Active" ? "Deactivated" : "Active" } : m));
  };

  const canDeactivate = (member: TeamMember) => {
    if (member.id === currentUser.id) return false;
    if (member.role === "Owner") return false;
    if (member.role === "Manager" && !isOwner) return false;
    return canInvite;
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Team & Roles</h1>
          <p className="text-sm text-slate-500 mt-0.5">{team.filter(m => m.status === "Active").length} active · {team.filter(m => m.status === "Invited").length} invited</p>
        </div>
        {canInvite && (
          <button onClick={() => setInviteOpen(true)} className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm">
            <UserPlus size={15} /> Invite Member
          </button>
        )}
      </div>

      {/* Role permissions summary */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Role Permissions</h3>
        <div className="grid grid-cols-3 gap-3 text-xs">
          {[
            { role: "Owner", color: "bg-indigo-100 text-indigo-700", perms: ["All Manager permissions", "Transfer ownership", "Manage settlement accounts", "Deactivate managers"] },
            { role: "Manager", color: "bg-blue-100 text-blue-700", perms: ["Generate bills", "View all bills & patients", "Manage services catalog", "View reports & audit trail", "Invite Staff"] },
            { role: "Staff", color: "bg-slate-200 text-slate-700", perms: ["Generate bills", "View bills & patients", "View services catalog", "Cannot access reports or audit"] },
          ].map(r => (
            <div key={r.role}>
              <span className={cn("inline-block px-2 py-0.5 rounded-full font-semibold mb-2", r.color)}>{r.role}</span>
              <ul className="space-y-1">
                {r.perms.map(p => (
                  <li key={p} className="flex items-start gap-1 text-slate-600">
                    <Check size={11} className="text-emerald-500 mt-0.5 flex-shrink-0" /> {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Team list */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <span className="text-sm font-bold text-slate-900">Team Members</span>
        </div>
        <div className="divide-y divide-slate-100">
          {team.map(member => (
            <div key={member.id} className={cn("flex items-center gap-4 px-5 py-4 transition-colors", member.status === "Deactivated" && "opacity-50")}>
              <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0 text-sm font-bold text-slate-600">
                {member.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-800 truncate">{member.name}</span>
                  {member.id === currentUser.id && <span className="text-xs text-slate-400">(you)</span>}
                  {member.role === "Owner" && <Crown size={13} className="text-amber-500" />}
                </div>
                <div className="text-xs text-slate-500 truncate">{member.email}</div>
                {member.lastActiveAt && (
                  <div className="text-xs text-slate-400 mt-0.5">
                    Last active {formatTimeAgo(member.lastActiveAt)}
                  </div>
                )}
                {member.status === "Invited" && member.invitedAt && (
                  <div className="text-xs text-violet-500 mt-0.5">
                    Invited {formatTimeAgo(member.invitedAt)} · expires in 7 days
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={cn("text-xs px-2 py-0.5 rounded-full font-semibold", roleColors[member.role])}>{member.role}</span>
                <span className={cn("text-xs px-2 py-0.5 rounded-full font-semibold", statusColors[member.status])}>{member.status}</span>
              </div>
              {canDeactivate(member) && (
                <button
                  onClick={() => toggleStatus(member.id)}
                  className={cn(
                    "p-2 rounded-lg transition-colors",
                    member.status === "Active"
                      ? "text-slate-400 hover:text-red-500 hover:bg-red-50"
                      : "text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"
                  )}
                  title={member.status === "Active" ? "Deactivate" : "Reactivate"}
                >
                  {member.status === "Active" ? <PowerOff size={15} /> : <Power size={15} />}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <InviteModal open={inviteOpen} onClose={() => setInviteOpen(false)} />
    </div>
  );
}
