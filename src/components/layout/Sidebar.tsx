"use client";
import { cn } from "@/lib/utils";
import { currentUser, mockNotifications } from "@/lib/mock-data";
import { Avatar } from "@/components/ui/Avatar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, FileText, Users, Grid3X3, BarChart3, Shield,
  Settings, HeadphonesIcon, ChevronRight, Bell, Wifi, WifiOff,
  Activity, CreditCard, Building2, LogOut, X
} from "lucide-react";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/Badge";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string | number;
  roles?: string[];
}

const mainNavItems: NavItem[] = [
  { label: "Overview", href: "/overview", icon: LayoutDashboard },
  { label: "Generate Bill", href: "/generate-bill", icon: FileText },
  { label: "All Bills", href: "/all-bills", icon: Activity },
  { label: "All Patients", href: "/all-patients", icon: Users },
  { label: "Services Catalog", href: "/services", icon: Grid3X3 },
];

const reportingNavItems: NavItem[] = [
  { label: "Reports & Insights", href: "/reports", icon: BarChart3, roles: ["Owner", "Manager"] },
  { label: "Audit Trail", href: "/audit-trail", icon: Shield, roles: ["Owner", "Manager"] },
];

const settingsNavItems: NavItem[] = [
  { label: "Settings", href: "/settings/profile", icon: Settings },
  { label: "Support", href: "/support", icon: HeadphonesIcon },
];

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const [isOnline, setIsOnline] = useState(true);
  const unreadCount = mockNotifications.filter(n => !n.isRead).length;

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const isActive = (href: string) => {
    if (href === "/settings/profile") return pathname.startsWith("/settings");
    return pathname === href || pathname.startsWith(href + "/");
  };

  const canView = (item: NavItem) => {
    if (!item.roles) return true;
    return item.roles.includes(currentUser.role);
  };

  const NavLink = ({ item }: { item: NavItem }) => {
    if (!canView(item)) return null;
    const active = isActive(item.href);
    const Icon = item.icon;
    return (
      <Link
        href={item.href}
        onClick={onMobileClose}
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all group",
          active
            ? "bg-blue-50 text-blue-700"
            : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
        )}
      >
        <Icon size={17} className={cn(active ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600")} />
        <span className="flex-1">{item.label}</span>
        {item.badge && (
          <span className="px-1.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-600">{item.badge}</span>
        )}
      </Link>
    );
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <Building2 size={16} className="text-white" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900 leading-none">Dexwin</div>
            <div className="text-xs text-slate-400 mt-0.5">Provider Portal</div>
          </div>
        </div>
        {onMobileClose && (
          <button onClick={onMobileClose} className="lg:hidden p-1 text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        )}
      </div>

      {/* Connectivity status */}
      <div className="mx-3 mt-3">
        <div className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium",
          isOnline ? "bg-emerald-50 text-emerald-700" : "bg-orange-50 text-orange-700"
        )}>
          {isOnline ? <Wifi size={13} /> : <WifiOff size={13} />}
          {isOnline ? "Connected — ready to process" : "Offline — cannot process payments"}
        </div>
      </div>

      {/* Provider Status */}
      {currentUser.providerStatus !== "Active" && (
        <div className="mx-3 mt-2 p-3 rounded-lg bg-amber-50 border border-amber-200">
          <div className="text-xs font-semibold text-amber-700">Account Under Review</div>
          <div className="text-xs text-amber-600 mt-0.5">Billing is disabled until approved.</div>
        </div>
      )}

      {/* Suspension banner */}
      {currentUser.providerStatus === "Suspended" && (
        <div className="mx-3 mt-2 p-3 rounded-lg bg-red-50 border border-red-200">
          <div className="text-xs font-semibold text-red-700">Account Suspended</div>
          <div className="text-xs text-red-600 mt-0.5">New bill submissions are blocked. Contact support.</div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
        <div className="space-y-0.5">
          {mainNavItems.map(item => <NavLink key={item.href} item={item} />)}
        </div>

        <div className="pt-4 pb-1">
          <div className="px-3 text-xs font-bold text-slate-400 uppercase tracking-widest">Reporting</div>
        </div>
        <div className="space-y-0.5">
          {reportingNavItems.map(item => <NavLink key={item.href} item={item} />)}
        </div>

        <div className="pt-4 pb-1">
          <div className="px-3 text-xs font-bold text-slate-400 uppercase tracking-widest">Account</div>
        </div>
        <div className="space-y-0.5">
          {settingsNavItems.map(item => <NavLink key={item.href} item={item} />)}
        </div>
      </nav>

      {/* User footer */}
      <div className="border-t border-slate-100 p-3">
        <div className="flex items-center gap-3 px-2 py-2">
          <Avatar name={currentUser.name} size="sm" />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-slate-800 truncate">{currentUser.name}</div>
            <div className="text-xs text-slate-400 truncate">{currentUser.role} · {currentUser.providerName.split(" ")[0]}</div>
          </div>
          <div className="relative">
            <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
              <Bell size={16} />
            </button>
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                {unreadCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 bg-white border-r border-slate-200 h-screen sticky top-0 flex-shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onMobileClose} />
          <aside className="relative w-60 bg-white h-full shadow-xl">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
