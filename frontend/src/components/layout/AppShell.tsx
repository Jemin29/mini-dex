"use client";

import Link from "next/link";
import { NAV_LINKS } from "@/lib/constants";
import { useMounted } from "@/hooks/useMounted";
import TxToaster from "@/components/notifications/TxToaster";
import WalletMenu from "@/components/wallet/WalletMenu";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const mounted = useMounted();

  return (
    <div className="app-shell min-h-screen">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4">
        Skip to content
      </a>
      <header className="sticky top-0 z-40 border-b border-white/5 bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="text-lg font-semibold text-foreground">
            <span className="text-gradient">Mini DEX</span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-muted md:flex" aria-label="Primary">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-foreground">
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            {mounted && <WalletMenu />}
          </div>
        </div>
      </header>
      <main id="main-content" className="mx-auto w-full max-w-6xl px-4 py-10">
        {children}
      </main>
      <nav
        className="fixed bottom-4 left-1/2 z-40 w-[92vw] max-w-md -translate-x-1/2 rounded-full border border-white/10 bg-background/80 px-6 py-3 backdrop-blur md:hidden"
        aria-label="Mobile"
      >
        <div className="flex items-center justify-between text-xs text-muted">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-foreground">
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
      <TxToaster />
    </div>
  );
}
