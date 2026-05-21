import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle2, Info, AlertTriangle, XCircle } from "lucide-react";

interface AlertProps {
  type: "info" | "success" | "warning" | "error";
  title?: string;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}

const styles = {
  info: { wrapper: "bg-blue-50 border-blue-200", icon: Info, iconColor: "text-blue-500", titleColor: "text-blue-800", textColor: "text-blue-700" },
  success: { wrapper: "bg-emerald-50 border-emerald-200", icon: CheckCircle2, iconColor: "text-emerald-500", titleColor: "text-emerald-800", textColor: "text-emerald-700" },
  warning: { wrapper: "bg-amber-50 border-amber-200", icon: AlertTriangle, iconColor: "text-amber-500", titleColor: "text-amber-800", textColor: "text-amber-700" },
  error: { wrapper: "bg-red-50 border-red-200", icon: XCircle, iconColor: "text-red-500", titleColor: "text-red-800", textColor: "text-red-700" },
};

export function Alert({ type, title, children, className, action }: AlertProps) {
  const s = styles[type];
  const Icon = s.icon;
  return (
    <div className={cn("flex gap-3 p-4 rounded-xl border", s.wrapper, className)}>
      <Icon size={18} className={cn("flex-shrink-0 mt-0.5", s.iconColor)} />
      <div className="flex-1 min-w-0">
        {title && <p className={cn("text-sm font-semibold", s.titleColor)}>{title}</p>}
        <div className={cn("text-sm", s.textColor, title && "mt-0.5")}>{children}</div>
        {action && <div className="mt-2">{action}</div>}
      </div>
    </div>
  );
}
