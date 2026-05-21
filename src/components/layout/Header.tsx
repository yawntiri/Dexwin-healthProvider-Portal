"use client";
import { cn } from "@/lib/utils";
import { currentUser, mockNotifications, mockProvider } from "@/lib/mock-data";
import { Avatar } from "@/components/ui/Avatar";
import { Badge, ProviderStatusBadge } from "@/components/ui/Badge";
import { Bell, Menu, Search, ChevronDown, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { formatTimeAgo } from "@/lib/utils";
import Link from "next/link";

interface HeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  onMenuClick?: () => void;
}

export function Header({ title, subtitle, actions, onMenuClick }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const unread = mockNotifications.filter(n => !n.isRead);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const getNotifIcon = (type: string) => {
    if (type === "payment") return <CheckCircle size={15} className="text-emerald-500" />;
    if (type === "security") return <AlertCircle size={15} className="text-red-500" />;
    return <Clock size={15} className="text-blue-500" />;
  };

  return (
    <header className="bg-white border-b border-slate-200 px-4 lg:px-6 py-3.5 flex items-center gap-4 sticky top-0 z-40">
      {/* Mobile menu button */}
      <button onClick={onMenuClick} className="lg:hidden p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg">
        <Menu size={18} />
      </button>

      {/* Title */}
      <div className="flex-1 min-w-0">
        <h1 className="text-lg font-bold text-slate-900 leading-tight">{title}</h1>
        {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {actions}

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(s => !s)}
            className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Bell size={18} />
            {unread.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 z-50 animate-slide-up overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                <span className="text-sm font-bold text-slate-900">Notifications</span>
                {unread.length > 0 && <Badge variant="pending">{unread.length} new</Badge>}
              </div>
              <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
                {mockNotifications.length === 0 ? (
                  <div className="py-8 text-center text-sm text-slate-400">No notifications</div>
                ) : (
                  mockNotifications.map(notif => (
                    <div
                      key={notif.id}
                      className={cn(
                        "px-4 py-3 flex gap-3 hover:bg-slate-50 transition-colors cursor-pointer",
                        !notif.isRead && "bg-blue-50/40"
                      )}
                    >
                      <div className="mt-0.5 flex-shrink-0">{getNotifIcon(notif.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <span className={cn("text-sm font-semibold text-slate-800", !notif.isRead && "text-blue-900")}>{notif.title}</span>
                          {!notif.isRead && <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{notif.message}</p>
                        <span className="text-xs text-slate-400 mt-1 block">{formatTimeAgo(notif.createdAt)}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="px-4 py-2.5 border-t border-slate-100 text-center">
                <button className="text-xs font-semibold text-blue-600 hover:text-blue-700">Mark all as read</button>
              </div>
            </div>
          )}
        </div>

        {/* User profile */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
          <Avatar name={currentUser.name} size="sm" />
          <div className="hidden sm:block">
            <div className="text-sm font-semibold text-slate-800 leading-none">{currentUser.name}</div>
            <div className="text-xs text-slate-400 mt-0.5">{currentUser.role}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
