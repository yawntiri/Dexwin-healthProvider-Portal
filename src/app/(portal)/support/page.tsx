"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { mockSupportTickets, currentUser } from "@/lib/mock-data";
import { cn, formatDate, formatTimeAgo } from "@/lib/utils";
import type { SupportTicket, SupportMessage, SupportTicketStatus, SupportTicketCategory } from "@/lib/types";
import {
  LifeBuoy, MessageSquare, Mail, Phone, Plus, X, Paperclip,
  Send, Clock, CheckCircle, AlertCircle, Search, ChevronDown,
  ExternalLink, User, Tag,
} from "lucide-react";

// ─── Static data ──────────────────────────────────────────────────────────────

const CATEGORY_OPTIONS: { value: SupportTicketCategory; label: string }[] = [
  { value: "Transaction", label: "Transaction" },
  { value: "Settlement", label: "Settlement" },
  { value: "Account", label: "Account" },
  { value: "Other", label: "Other" },
];

const STATUS_FILTER_OPTIONS: Array<{ value: SupportTicketStatus | "All"; label: string }> = [
  { value: "All", label: "All" },
  { value: "Open", label: "Open" },
  { value: "In Progress", label: "In Progress" },
  { value: "Waiting on You", label: "Waiting on You" },
  { value: "Resolved", label: "Resolved" },
];

type Priority = "low" | "medium" | "high";

const PRIORITY_OPTIONS: Array<{ value: Priority; label: string }> = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

// ─── Seed tickets (merged with mockSupportTickets in state) ───────────────────

const EXTRA_TICKETS: SupportTicket[] = [
  {
    id: "tkt-002",
    ticketNumber: "TKT-20250519-002",
    providerId: "prov-001",
    createdBy: "usr-001",
    category: "Transaction",
    subject: "Patient benefit showing 'No record found' for DXW-PAY-8833",
    description:
      "A patient presented today with DexwinPay ID DXW8833 but our system returned 'No record found'. The patient's employer confirmed active coverage. Please investigate.",
    status: "Open",
    messages: [
      {
        id: "msg-010",
        ticketId: "tkt-002",
        senderName: "Kwame Mensah",
        senderType: "provider",
        message:
          "A patient presented with DXW8833 but verification failed with 'No record found'. Can you check if there is an issue on your end?",
        sentAt: new Date(Date.now() - 19 * 60 * 60 * 1000),
      },
    ],
    createdAt: new Date(Date.now() - 19 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 19 * 60 * 60 * 1000),
  },
  {
    id: "tkt-003",
    ticketNumber: "TKT-20250515-003",
    providerId: "prov-001",
    createdBy: "usr-002",
    category: "Account",
    subject: "Request to update facility operating hours on provider profile",
    description:
      "We have extended our operating hours to 7am–9pm Monday to Saturday effective June 1st. Please update this on our provider profile.",
    status: "Resolved",
    messages: [
      {
        id: "msg-020",
        ticketId: "tkt-003",
        senderName: "Ama Boateng",
        senderType: "provider",
        message: "Please update our operating hours to Mon–Sat 7:00 AM – 9:00 PM effective June 1st.",
        sentAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      },
      {
        id: "msg-021",
        ticketId: "tkt-003",
        senderName: "Dexwin Support",
        senderType: "dexwin_support",
        message:
          "Thank you! We have updated your operating hours. The change will reflect in the portal within 24 hours.",
        sentAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
    ],
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: "tkt-004",
    ticketNumber: "TKT-20250510-004",
    providerId: "prov-001",
    createdBy: "usr-001",
    category: "Settlement",
    subject: "Clarification on GH₵775.00 settlement split for DXW-REF-002",
    description:
      "The settlement for DXW-REF-002 shows GH₵600.00 credited but the bill total was GH₵775.00 with GH₵175.00 cash overage collected. Please confirm this split is correct.",
    status: "Waiting on You",
    linkedBillRef: "DXW-REF-002",
    linkedAmount: 775,
    messages: [
      {
        id: "msg-030",
        ticketId: "tkt-004",
        senderName: "Kwame Mensah",
        senderType: "provider",
        message: "Can you confirm the settlement split for DXW-REF-002? We received GH₵600 but billed GH₵775.",
        sentAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000),
      },
      {
        id: "msg-031",
        ticketId: "tkt-004",
        senderName: "Dexwin Support",
        senderType: "dexwin_support",
        message:
          "The GH₵175.00 difference is the cash overage collected directly from the patient — this is not settled through Dexwin. GH₵600.00 is the HealthWallet share. Could you confirm whether you collected the GH₵175 directly?",
        sentAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      },
    ],
    createdAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
  },
];

const SEED_TICKETS: SupportTicket[] = [...mockSupportTickets, ...EXTRA_TICKETS];

// ─── Helper utilities ─────────────────────────────────────────────────────────

function getStatusBadgeClass(status: SupportTicketStatus): string {
  switch (status) {
    case "Open":            return "badge-pending";
    case "In Progress":     return "badge-approved";
    case "Waiting on You":  return "badge-invited";
    case "Resolved":        return "badge-paid";
    default:                return "badge-inactive";
  }
}

function getStatusIcon(status: SupportTicketStatus) {
  switch (status) {
    case "Open":            return <AlertCircle size={11} />;
    case "In Progress":     return <Clock size={11} />;
    case "Waiting on You":  return <User size={11} />;
    case "Resolved":        return <CheckCircle size={11} />;
    default:                return null;
  }
}

function getCategoryColor(category: SupportTicketCategory): string {
  switch (category) {
    case "Transaction": return "bg-blue-100 text-blue-700";
    case "Settlement":  return "bg-emerald-100 text-emerald-700";
    case "Account":     return "bg-violet-100 text-violet-700";
    case "Other":       return "bg-slate-100 text-slate-600";
    default:            return "bg-slate-100 text-slate-600";
  }
}

function getPriorityClass(priority: Priority): string {
  switch (priority) {
    case "high":   return "bg-orange-100 text-orange-700";
    case "medium": return "bg-amber-100 text-amber-700";
    case "low":    return "bg-slate-100 text-slate-600";
    default:       return "bg-slate-100 text-slate-600";
  }
}

function getPriorityRingClass(priority: Priority): string {
  switch (priority) {
    case "high":   return "ring-orange-400";
    case "medium": return "ring-amber-400";
    case "low":    return "ring-slate-300";
    default:       return "ring-slate-300";
  }
}

// WAT = UTC+1. Mon–Fri 8am–6pm WAT
function isLiveChatOpen(): boolean {
  const now = new Date();
  const day = now.getUTCDay(); // 0=Sun, 6=Sat
  const hourWAT = now.getUTCHours() + 1;
  return day >= 1 && day <= 5 && hourWAT >= 8 && hourWAT < 18;
}

// ─── Contact strip ────────────────────────────────────────────────────────────

function ContactStrip() {
  const chatOpen = isLiveChatOpen();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 px-4 lg:px-6 py-4 bg-white border-b border-slate-200">
      {/* Live Chat */}
      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
        <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
          <MessageSquare size={17} className="text-blue-600" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-700">Live Chat</span>
            <span
              className={cn(
                "inline-flex items-center gap-1 text-xs font-semibold px-1.5 py-0.5 rounded-full",
                chatOpen ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
              )}
            >
              <span
                className={cn(
                  "w-1.5 h-1.5 rounded-full",
                  chatOpen ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
                )}
              />
              {chatOpen ? "Online" : "Offline"}
            </span>
          </div>
          <p className="text-xs text-slate-500">Mon–Fri 8am–6pm WAT</p>
        </div>
      </div>

      {/* Email */}
      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
        <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
          <Mail size={17} className="text-slate-600" />
        </div>
        <div>
          <span className="text-xs font-semibold text-slate-700">Email Support</span>
          <a
            href="mailto:providers@dexwin.com"
            className="block text-xs text-blue-600 hover:underline mt-0.5 truncate"
          >
            providers@dexwin.com
          </a>
        </div>
      </div>

      {/* Phone */}
      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
        <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
          <Phone size={17} className="text-slate-600" />
        </div>
        <div>
          <span className="text-xs font-semibold text-slate-700">Phone</span>
          <p className="text-xs text-slate-700 font-mono mt-0.5">+233 30 000 0000</p>
          <p className="text-xs text-slate-500">Mon–Fri 9am–5pm WAT</p>
        </div>
      </div>
    </div>
  );
}

// ─── Ticket list row ──────────────────────────────────────────────────────────

function TicketRow({
  ticket,
  selected,
  onClick,
}: {
  ticket: SupportTicket;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full text-left px-4 py-3.5 border-b border-slate-100 transition-colors",
        selected
          ? "bg-blue-50 border-l-2 border-l-blue-600"
          : "hover:bg-slate-50/80 border-l-2 border-l-transparent"
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <span className={cn("badge", getStatusBadgeClass(ticket.status))}>
          {getStatusIcon(ticket.status)}
          {ticket.status}
        </span>
        <span className="text-xs text-slate-400 whitespace-nowrap flex-shrink-0">
          {formatTimeAgo(ticket.updatedAt)}
        </span>
      </div>
      <p className="text-sm font-semibold text-slate-800 line-clamp-2 mb-1.5">{ticket.subject}</p>
      <div className="flex items-center justify-between gap-2">
        <span
          className={cn(
            "inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-full font-semibold",
            getCategoryColor(ticket.category)
          )}
        >
          <Tag size={9} />
          {ticket.category}
        </span>
        <span className="text-xs font-mono text-slate-400">{ticket.ticketNumber}</span>
      </div>
    </button>
  );
}

// ─── Message bubble ───────────────────────────────────────────────────────────

function MessageBubble({ msg }: { msg: SupportMessage }) {
  const isProvider = msg.senderType === "provider";
  return (
    <div className={cn("flex gap-2.5 mb-4", isProvider ? "flex-row-reverse" : "flex-row")}>
      <div
        className={cn(
          "w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold",
          isProvider ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-600"
        )}
      >
        {msg.senderName.charAt(0)}
      </div>
      <div className="max-w-[76%]">
        <div
          className={cn(
            "px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed",
            isProvider
              ? "bg-blue-600 text-white rounded-tr-sm"
              : "bg-slate-100 text-slate-800 rounded-tl-sm"
          )}
        >
          {msg.message}
        </div>
        <div
          className={cn(
            "flex items-center gap-1.5 mt-1 text-xs text-slate-400",
            isProvider ? "flex-row-reverse" : "flex-row"
          )}
        >
          <span>{msg.senderName}</span>
          <span>·</span>
          <span>{formatTimeAgo(msg.sentAt)}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Ticket detail pane ───────────────────────────────────────────────────────

function TicketDetail({
  ticket,
  ticketMessages,
  onSendReply,
  onClose,
  onOpenNewTicket,
}: {
  ticket: SupportTicket;
  ticketMessages: SupportMessage[];
  onSendReply: (ticketId: string, message: string) => void;
  onClose?: () => void;
  onOpenNewTicket: () => void;
}) {
  const [replyText, setReplyText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setReplyText("");
  }, [ticket.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [ticketMessages.length]);

  const handleSend = () => {
    const trimmed = replyText.trim();
    if (!trimmed) return;
    onSendReply(ticket.id, trimmed);
    setReplyText("");
  };

  const isResolved = ticket.status === "Resolved";

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 flex-shrink-0">
        <div className="flex items-start justify-between gap-3 mb-2">
          <p className="text-sm font-bold text-slate-900 leading-snug flex-1">{ticket.subject}</p>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg flex-shrink-0"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Badges row */}
        <div className="flex flex-wrap items-center gap-2">
          <span className={cn("badge", getStatusBadgeClass(ticket.status))}>
            {getStatusIcon(ticket.status)}
            {ticket.status}
          </span>
          <span
            className={cn(
              "inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-full font-semibold",
              getCategoryColor(ticket.category)
            )}
          >
            <Tag size={9} />
            {ticket.category}
          </span>
        </div>

        {/* Meta */}
        <div className="mt-2 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Clock size={10} className="text-slate-400" />
            Opened {formatDate(ticket.createdAt)}
          </div>
          <div className="text-xs font-mono text-slate-400">#{ticket.ticketNumber}</div>
          {ticket.linkedBillRef && (
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <ExternalLink size={10} className="text-slate-400" />
              Linked bill:
              <span className="font-mono font-semibold text-blue-600">{ticket.linkedBillRef}</span>
              {ticket.linkedAmount && (
                <span className="text-slate-400">· GH₵{ticket.linkedAmount.toLocaleString()}</span>
              )}
            </div>
          )}
        </div>

        {/* Description */}
        <div className="mt-3 bg-slate-50 rounded-lg p-3">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Description</p>
          <p className="text-sm text-slate-700 leading-relaxed">{ticket.description}</p>
        </div>
      </div>

      {/* Message thread */}
      <div className="flex-1 overflow-y-auto p-4">
        {ticketMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            <MessageSquare size={26} className="text-slate-300 mb-2" />
            <p className="text-sm text-slate-400">No messages yet. Start the conversation below.</p>
          </div>
        ) : (
          ticketMessages.map(msg => <MessageBubble key={msg.id} msg={msg} />)
        )}

        {isResolved && (
          <div className="flex items-center gap-2 my-3">
            <div className="flex-1 border-t border-slate-200" />
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1 flex-shrink-0">
              <CheckCircle size={11} /> Ticket resolved
            </span>
            <div className="flex-1 border-t border-slate-200" />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Resolved footer */}
      {isResolved ? (
        <div className="p-4 border-t border-slate-200 bg-emerald-50 flex-shrink-0">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-emerald-600" />
              <div>
                <p className="text-sm font-semibold text-emerald-800">Resolved</p>
                <p className="text-xs text-emerald-600">{formatDate(ticket.updatedAt)}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onOpenNewTicket}
              className="btn-primary text-xs px-3 py-2"
            >
              <Plus size={13} />
              Open New Ticket
            </button>
          </div>
        </div>
      ) : (
        // Reply box
        <div className="p-4 border-t border-slate-200 flex-shrink-0">
          <div className="flex items-end gap-2">
            <textarea
              value={replyText}
              onChange={e => setReplyText(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleSend();
              }}
              placeholder="Write a reply… (Ctrl+Enter to send)"
              rows={3}
              className="input-base resize-none flex-1 text-sm"
            />
            <div className="flex flex-col gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                title="Attach file"
              >
                <Paperclip size={16} />
              </button>
              <button
                type="button"
                onClick={handleSend}
                disabled={!replyText.trim()}
                className="btn-primary px-3 py-2 disabled:opacity-40"
                title="Send (Ctrl+Enter)"
              >
                <Send size={15} />
              </button>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-1.5">Ctrl+Enter to send</p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png,.docx"
            className="hidden"
          />
        </div>
      )}
    </div>
  );
}

// ─── New Ticket Modal ─────────────────────────────────────────────────────────

interface NewTicketFormState {
  category: SupportTicketCategory;
  subject: string;
  description: string;
  priority: Priority;
  files: File[];
}

function NewTicketModal({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (ticket: SupportTicket) => void;
}) {
  const initialForm: NewTicketFormState = {
    category: "Transaction",
    subject: "",
    description: "",
    priority: "medium",
    files: [],
  };
  const [form, setForm] = useState<NewTicketFormState>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof NewTicketFormState, string>>>({});
  const [dragging, setDragging] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setForm(initialForm);
    setErrors({});
    setDragging(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const validate = (): boolean => {
    const errs: Partial<Record<keyof NewTicketFormState, string>> = {};
    if (!form.subject.trim()) errs.subject = "Subject is required.";
    if (form.description.trim().length < 20)
      errs.description = "Description must be at least 20 characters.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 900));
    const now = new Date();
    const num = `TKT-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${String(Math.floor(Math.random() * 900 + 100))}`;
    const id = `tkt-${Date.now()}`;
    const newTicket: SupportTicket = {
      id,
      ticketNumber: num,
      providerId: currentUser.providerId,
      createdBy: currentUser.id,
      category: form.category,
      subject: form.subject.trim(),
      description: form.description.trim(),
      status: "Open",
      attachmentUrl: form.files.length > 0 ? form.files[0].name : undefined,
      messages: [
        {
          id: `msg-${Date.now()}`,
          ticketId: id,
          senderName: currentUser.name,
          senderType: "provider",
          message: form.description.trim(),
          sentAt: now,
        },
      ],
      createdAt: now,
      updatedAt: now,
    };
    setSubmitting(false);
    resetForm();
    onSubmit(newTicket);
    onClose();
  };

  const addFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    const allowed = Array.from(incoming).filter(f =>
      /\.(pdf|jpg|jpeg|png|docx)$/i.test(f.name)
    );
    setForm(prev => ({ ...prev, files: [...prev.files, ...allowed] }));
  };

  const removeFile = (idx: number) => {
    setForm(prev => ({ ...prev, files: prev.files.filter((_, i) => i !== idx) }));
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl animate-slide-up flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <LifeBuoy size={16} className="text-blue-600" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">New Support Ticket</h2>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Auto-link note */}
          <div className="flex items-start gap-2.5 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <AlertCircle size={14} className="text-amber-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-amber-700 leading-relaxed">
              Tickets related to failed transactions are auto-linked to the bill reference for faster resolution.
            </p>
          </div>

          {/* Category */}
          <div>
            <label className="form-label">
              Category <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={form.category}
                onChange={e => setForm(prev => ({ ...prev, category: e.target.value as SupportTicketCategory }))}
                className="input-base appearance-none pr-8"
              >
                {CATEGORY_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="form-label">
              Subject <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.subject}
              onChange={e => setForm(prev => ({ ...prev, subject: e.target.value }))}
              placeholder="Brief summary of your issue"
              className={cn("input-base", errors.subject && "border-red-400 focus:border-red-500")}
            />
            {errors.subject && <p className="form-error">{errors.subject}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="form-label">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={form.description}
              onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your issue in detail. Include bill references, dates, or error messages…"
              rows={5}
              className={cn("input-base resize-none", errors.description && "border-red-400 focus:border-red-500")}
            />
            <div className="flex items-center justify-between mt-1">
              {errors.description
                ? <p className="form-error">{errors.description}</p>
                : <p className="form-hint">Min. 20 characters</p>
              }
              <span
                className={cn(
                  "text-xs tabular-nums",
                  form.description.trim().length < 20 ? "text-slate-400" : "text-emerald-600"
                )}
              >
                {form.description.trim().length}
              </span>
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="form-label">Priority</label>
            <div className="flex gap-2">
              {PRIORITY_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, priority: opt.value }))}
                  className={cn(
                    "flex-1 py-2 rounded-lg text-xs font-semibold border transition-all",
                    form.priority === opt.value
                      ? cn(getPriorityClass(opt.value), "border-transparent ring-2 ring-offset-1", getPriorityRingClass(opt.value))
                      : "border-slate-200 text-slate-500 hover:bg-slate-50"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* File attachment */}
          <div>
            <label className="form-label">Attachments <span className="text-slate-400 font-normal">(optional)</span></label>
            <div
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={e => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files); }}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-colors",
                dragging
                  ? "border-blue-400 bg-blue-50"
                  : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              )}
            >
              <Paperclip size={20} className="mx-auto text-slate-400 mb-2" />
              <p className="text-sm text-slate-600 font-medium">Drag & drop files here or click to browse</p>
              <p className="text-xs text-slate-400 mt-1">Accepts .pdf, .jpg, .png, .docx</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png,.docx"
              className="hidden"
              onChange={e => addFiles(e.target.files)}
            />
            {form.files.length > 0 && (
              <ul className="mt-2 space-y-1.5">
                {form.files.map((file, idx) => (
                  <li
                    key={idx}
                    className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-2"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Paperclip size={11} className="text-slate-400 flex-shrink-0" />
                      <span className="text-xs text-slate-700 truncate">{file.name}</span>
                      <span className="text-xs text-slate-400 flex-shrink-0">
                        {(file.size / 1024).toFixed(0)} KB
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={e => { e.stopPropagation(); removeFile(idx); }}
                      className="p-1 text-slate-400 hover:text-red-500 flex-shrink-0"
                    >
                      <X size={12} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 flex-shrink-0">
          <button type="button" onClick={handleClose} className="btn-secondary">
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="btn-primary"
          >
            {submitting ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Submitting…
              </>
            ) : (
              <>
                <Send size={15} />
                Submit Ticket
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>(SEED_TICKETS);
  const [selectedId, setSelectedId] = useState<string | null>(SEED_TICKETS[0]?.id ?? null);
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<SupportTicketStatus | "All">("All");

  const selectedTicket = useMemo(
    () => tickets.find(t => t.id === selectedId) ?? null,
    [tickets, selectedId]
  );

  const filteredTickets = useMemo(() => {
    return tickets.filter(t => {
      if (statusFilter !== "All" && t.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          t.subject.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          t.ticketNumber.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [tickets, statusFilter, search]);

  const handleSelectTicket = (ticket: SupportTicket) => {
    setSelectedId(ticket.id);
    setMobileDetailOpen(true);
  };

  const handleSendReply = (ticketId: string, message: string) => {
    const newMsg: SupportMessage = {
      id: `msg-${Date.now()}`,
      ticketId,
      senderName: currentUser.name,
      senderType: "provider",
      message,
      sentAt: new Date(),
    };
    setTickets(prev =>
      prev.map(t =>
        t.id !== ticketId
          ? t
          : { ...t, messages: [...t.messages, newMsg], updatedAt: new Date() }
      )
    );
  };

  const handleAddTicket = (ticket: SupportTicket) => {
    setTickets(prev => [ticket, ...prev]);
    setSelectedId(ticket.id);
    setMobileDetailOpen(true);
  };

  const handleOpenNewTicket = () => {
    setMobileDetailOpen(false);
    setShowModal(true);
  };

  // Ticket messages derived from live tickets state (so replies are reflected)
  const selectedMessages = selectedTicket?.messages ?? [];

  return (
    <div className="flex flex-col h-full max-h-full overflow-hidden">
      {/* ── Page header ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 lg:px-6 py-4 bg-white border-b border-slate-200 flex-shrink-0">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <LifeBuoy size={21} className="text-blue-600" />
            Support
          </h1>
          <p className="page-subtitle">Get help from the Dexwin team</p>
        </div>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="btn-primary"
        >
          <Plus size={16} />
          New Ticket
        </button>
      </div>

      {/* ── Contact strip ────────────────────────────────────────────────────── */}
      <ContactStrip />

      {/* ── Main content ─────────────────────────────────────────────────────── */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Ticket list pane (~60% on desktop) */}
        <div
          className={cn(
            "flex flex-col bg-white border-r border-slate-200 flex-shrink-0 overflow-hidden",
            "w-full lg:w-[58%]",
            mobileDetailOpen ? "hidden lg:flex" : "flex"
          )}
        >
          {/* Search + filters */}
          <div className="p-3 border-b border-slate-100 space-y-2 flex-shrink-0">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search tickets…"
                className="input-base pl-9 py-2 text-sm"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X size={13} />
                </button>
              )}
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {STATUS_FILTER_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setStatusFilter(opt.value)}
                  className={cn(
                    "px-2.5 py-1 rounded-lg text-xs font-semibold transition-all",
                    statusFilter === opt.value
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Rows */}
          <div className="flex-1 overflow-y-auto">
            {filteredTickets.length === 0 ? (
              <div className="empty-state px-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
                  <LifeBuoy size={22} className="text-slate-400" />
                </div>
                <p className="text-sm font-semibold text-slate-700 mb-1">No tickets found</p>
                <p className="text-sm text-slate-500">
                  {search || statusFilter !== "All"
                    ? "Try adjusting your search or filters."
                    : "Submit a ticket to get help from our team."}
                </p>
                {!search && statusFilter === "All" && (
                  <button
                    type="button"
                    onClick={() => setShowModal(true)}
                    className="btn-primary mt-4"
                  >
                    <Plus size={15} />
                    New Ticket
                  </button>
                )}
              </div>
            ) : (
              filteredTickets.map(ticket => (
                <TicketRow
                  key={ticket.id}
                  ticket={ticket}
                  selected={selectedId === ticket.id}
                  onClick={() => handleSelectTicket(ticket)}
                />
              ))
            )}
          </div>

          {/* Footer count */}
          {filteredTickets.length > 0 && (
            <div className="px-4 py-2 border-t border-slate-100 flex-shrink-0">
              <p className="text-xs text-slate-400">
                {filteredTickets.length} ticket{filteredTickets.length !== 1 ? "s" : ""}
                {statusFilter !== "All" ? ` · ${statusFilter}` : ""}
              </p>
            </div>
          )}
        </div>

        {/* Ticket detail pane (~40% on desktop) */}
        <div className="hidden lg:flex lg:flex-col flex-1 min-w-0 bg-white overflow-hidden">
          {selectedTicket ? (
            <TicketDetail
              ticket={selectedTicket}
              ticketMessages={selectedMessages}
              onSendReply={handleSendReply}
              onOpenNewTicket={handleOpenNewTicket}
            />
          ) : (
            <div className="empty-state h-full">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                <MessageSquare size={26} className="text-slate-300" />
              </div>
              <p className="text-sm font-semibold text-slate-600 mb-1">Select a ticket to view details</p>
              <p className="text-sm text-slate-400">Or create a new ticket to get started.</p>
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="btn-primary mt-5"
              >
                <Plus size={15} />
                New Ticket
              </button>
            </div>
          )}
        </div>

        {/* Mobile: slide-in overlay for detail */}
        {mobileDetailOpen && selectedTicket && (
          <div className="fixed inset-0 z-40 lg:hidden flex">
            <div
              className="absolute inset-0 bg-black/30 backdrop-blur-sm"
              onClick={() => setMobileDetailOpen(false)}
            />
            <div className="relative ml-auto w-full max-w-sm bg-white h-full flex flex-col shadow-2xl animate-slide-in">
              <div className="px-4 py-3 border-b border-slate-200 flex items-center gap-2 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setMobileDetailOpen(false)}
                  className="btn-ghost p-2 text-slate-500"
                >
                  <X size={15} />
                </button>
                <span className="text-sm font-semibold text-slate-700">Ticket Detail</span>
              </div>
              <div className="flex-1 overflow-hidden flex flex-col">
                <TicketDetail
                  ticket={selectedTicket}
                  ticketMessages={selectedMessages}
                  onSendReply={handleSendReply}
                  onClose={() => setMobileDetailOpen(false)}
                  onOpenNewTicket={handleOpenNewTicket}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* New Ticket Modal */}
      <NewTicketModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleAddTicket}
      />
    </div>
  );
}
