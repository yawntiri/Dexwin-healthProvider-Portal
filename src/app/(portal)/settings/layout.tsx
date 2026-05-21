"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { User, Users, CreditCard, Bell, Shield } from "lucide-react";
import { currentUser } from "@/lib/mock-data";

const settingsNav = [
  { href: "/settings/profile", label: "Facility Profile", icon: User },
  { href: "/settings/team", label: "Team & Roles", icon: Users },
  { href: "/settings/settlement", label: "Settlement Account", icon: CreditCard },
  { href: "/settings/notifications", label: "Notifications", icon: Bell },
  { href: "/settings/security", label: "Security", icon: Shield },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="flex min-h-full">
      {/* Settings sidebar */}
      <aside className="hidden md:flex flex-col w-56 border-r border-slate-200 bg-white p-4 flex-shrink-0">
        <div className="mb-4">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-3">Settings</h2>
        </div>
        <nav className="space-y-0.5">
          {settingsNav.map(item => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} className={cn(
                "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all",
                isActive ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              )}>
                <Icon size={16} className={isActive ? "text-blue-600" : "text-slate-400"} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      {/* Mobile settings nav */}
      <div className="md:hidden flex overflow-x-auto border-b border-slate-200 bg-white px-4">
        {settingsNav.map(item => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className={cn(
              "flex flex-col items-center gap-1 px-3 py-3 text-xs font-medium border-b-2 transition-all whitespace-nowrap",
              isActive ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500"
            )}>
              <Icon size={16} />
              {item.label.split(" ")[0]}
            </Link>
          );
        })}
      </div>
      <div className="flex-1 p-4 lg:p-6 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
