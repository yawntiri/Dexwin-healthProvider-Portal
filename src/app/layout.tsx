import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dexwin Provider Portal",
  description: "Healthcare provider management and HealthWallet payment portal",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="h-full">{children}</body>
    </html>
  );
}
