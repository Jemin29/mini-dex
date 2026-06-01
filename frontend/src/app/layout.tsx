import type { Metadata } from "next";
import { Sora, Space_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import AppShell from "@/components/layout/AppShell";
import AnalyticsProvider from "@/components/analytics/AnalyticsProvider";

const sora = Sora({ subsets: ["latin"], variable: "--font-sora" });
const spaceMono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-space-mono" });

export const metadata: Metadata = {
  title: "Mini DEX",
  description: "Modern Mini DEX interface"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${sora.variable} ${spaceMono.variable} font-sans`}> 
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
        <AnalyticsProvider />
      </body>
    </html>
  );
}
