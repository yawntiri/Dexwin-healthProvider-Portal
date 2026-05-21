"use client";
import { WifiOff, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";

export function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    setIsOffline(!navigator.onLine);
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-orange-600 text-white text-sm font-semibold text-center py-2.5 px-4 flex items-center justify-center gap-2">
      <WifiOff size={16} />
      <span>Connection required. Please reconnect to process HealthWallet payments.</span>
      <a href="#" className="underline flex items-center gap-1 ml-2 font-normal text-orange-100 hover:text-white">
        Status page <ExternalLink size={12} />
      </a>
    </div>
  );
}
