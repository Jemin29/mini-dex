"use client";

import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useMounted } from "@/hooks/useMounted";

const stats = [
  { label: "Total Value Locked", value: 42.8, unit: "B", delta: "+7.4%" },
  { label: "24h Volume", value: 2.94, unit: "B", delta: "+13.1%" },
  { label: "Active Pools", value: 612, unit: "", delta: "+18" },
  { label: "Avg. Spread", value: 0.04, unit: "%", delta: "-12 bps" }
];

const marketPairs = [
  { pair: "ETH / USDC", price: "3,214.12", change: "+2.3%", liquidity: "$182M" },
  { pair: "WBTC / ETH", price: "14.82", change: "+1.2%", liquidity: "$96M" },
  { pair: "ARB / ETH", price: "0.00045", change: "-0.4%", liquidity: "$44M" },
  { pair: "OP / USDC", price: "2.51", change: "+3.1%", liquidity: "$52M" }
];

const liquidityStats = [
  { label: "Protocol fees", value: "$4.2M", sub: "Last 30d" },
  { label: "LP yield range", value: "6.4 - 18.2%", sub: "Trailing APR" },
  { label: "Active LPs", value: "24.1k", sub: "Onchain wallets" }
];

const features = [
  {
    title: "Unified routing",
    description: "Smart order routing across pools to maximize output and minimize slippage."
  },
  {
    title: "MEV-aware execution",
    description: "Protected swaps with dynamic tolerance and priority-aware bundling."
  },
  {
    title: "Liquidity intelligence",
    description: "APR forecasting, fee analytics, and pool health monitoring in one view."
  },
  {
    title: "Secure treasury",
    description: "Multi-sig controls, audited contracts, and live risk alerts."
  }
];

const roadmap = [
  {
    quarter: "Q3 2026",
    title: "Cross-chain liquidity",
    items: ["Bridge-integrated swaps", "Unified LP positions", "ZK settlement pilots"]
  },
  {
    quarter: "Q4 2026",
    title: "Pro trading suite",
    items: ["Advanced limit orders", "RFQ liquidity", "Institutional dashboards"]
  },
  {
    quarter: "Q1 2027",
    title: "Governance launch",
    items: ["DEX token distribution", "On-chain voting", "Revenue share vaults"]
  }
];

const faqs = [
  {
    question: "How is pricing determined?",
    answer: "Swaps follow a constant-product curve with adaptive fees and real-time liquidity routing."
  },
  {
    question: "Is my wallet ever custodied?",
    answer: "Never. All trades execute directly from your wallet with explicit signature approval."
  },
  {
    question: "What chains are supported?",
    answer: "The production roadmap targets Ethereum L2s and multi-chain liquidity with unified UX."
  }
];

const tickerTokens = [
  { symbol: "ETH", price: "$3,214.12", change: "+2.3%" },
  { symbol: "USDC", price: "$1.00", change: "+0.01%" },
  { symbol: "ARB", price: "$0.98", change: "-0.4%" },
  { symbol: "OP", price: "$2.51", change: "+3.1%" },
  { symbol: "SOL", price: "$168.22", change: "+1.9%" },
  { symbol: "LINK", price: "$16.42", change: "+0.6%" }
];

function AnimatedStat({ value, unit }: { value: number; unit: string }) {
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { stiffness: 90, damping: 20 });
  const display = useTransform(spring, (latest) => {
    const fixed = value < 1 ? 2 : value < 100 ? 2 : 0;
    return latest.toFixed(fixed);
  });

  useEffect(() => {
    motionValue.set(value);
  }, [motionValue, value]);

  return (
    <span className="text-2xl font-semibold text-foreground">
      <motion.span>{display}</motion.span>
      {unit}
    </span>
  );
}

export default function LandingPage() {
  const mounted = useMounted();

  return (
    <div className="space-y-24">
      <section className="relative overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-br from-[#0c1224] via-[#0b0f1a] to-[#0b1225] px-6 py-16 sm:px-10 lg:px-16">
        <div className="hero-sheen absolute inset-0 opacity-70" aria-hidden="true" />
        <div className="orb left-10 top-10 h-16 w-16 bg-[radial-gradient(circle,#22f7d4,transparent_60%)]" aria-hidden="true" />
        <div className="orb right-12 top-24 h-24 w-24 bg-[radial-gradient(circle,#60a5fa,transparent_60%)]" aria-hidden="true" />
        <div className="orb bottom-10 right-20 h-20 w-20 bg-[radial-gradient(circle,#22f7d4,transparent_60%)]" aria-hidden="true" />

        <div className="relative grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="space-y-6"
          >
            <Badge className="w-fit border-white/10 bg-white/5">Premium DeFi Experience</Badge>
            <h1 className="text-4xl font-semibold leading-tight text-foreground md:text-6xl">
              Next-generation liquidity.
              <span className="block text-gradient">Trade faster with zero friction.</span>
            </h1>
            <p className="max-w-xl text-base text-muted md:text-lg">
              A production-grade decentralized exchange with institutional routing, real-time analytics, and a
              wallet-first experience designed for modern DeFi traders.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Button asChild size="lg">
                <Link href="/swap">Launch app</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/analytics">View analytics</Link>
              </Button>
              <div className="ml-0 lg:ml-3">
                {mounted ? (
                  <ConnectButton.Custom>
                    {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted: ready }) => {
                      const connected = ready && account && chain;
                      if (!connected) {
                        return (
                          <Button size="lg" variant="outline" onClick={openConnectModal}>
                            Connect wallet
                          </Button>
                        );
                      }

                      if (chain?.unsupported) {
                        return (
                          <Button size="lg" variant="outline" onClick={openChainModal}>
                            Wrong network
                          </Button>
                        );
                      }

                      return (
                        <Button size="lg" variant="outline" onClick={openAccountModal}>
                          {account.displayName}
                        </Button>
                      );
                    }}
                  </ConnectButton.Custom>
                ) : (
                  <Button size="lg" variant="outline" disabled>
                    Connect wallet
                  </Button>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-6 text-xs text-muted">
              <div>
                <p className="uppercase tracking-[0.3em]">Network</p>
                <p className="text-sm font-semibold text-foreground">Multi-chain L2 ready</p>
              </div>
              <div>
                <p className="uppercase tracking-[0.3em]">Execution</p>
                <p className="text-sm font-semibold text-foreground">Sub-20s settlement</p>
              </div>
              <div>
                <p className="uppercase tracking-[0.3em]">Security</p>
                <p className="text-sm font-semibold text-foreground">Audited + MEV shield</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <Card className="glass gradient-animated">
              <CardHeader>
                <CardTitle>Live swap preview</CardTitle>
                <CardDescription>Signature-protected swaps with real-time routing.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-muted">
                    <span>You pay</span>
                    <span>Balance 2.31 ETH</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                    <span className="text-lg font-semibold">1.25</span>
                    <span className="text-sm text-muted">ETH</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-muted">
                    <span>You receive</span>
                    <span>Min 4,012.3</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                    <span className="text-lg font-semibold">4,038.9</span>
                    <span className="text-sm text-muted">USDC</span>
                  </div>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted">Price impact</span>
                    <span className="text-foreground">0.08%</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-muted">Estimated fee</span>
                    <span className="text-foreground">0.0028 ETH</span>
                  </div>
                </div>
                <Button className="w-full" size="lg">
                  Preview swap
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      <section className="ticker" aria-label="Token ticker">
        <div className="ticker-track" role="list">
          {[...tickerTokens, ...tickerTokens].map((token, index) => (
            <div key={`${token.symbol}-${index}`} className="ticker-item" role="listitem">
              <span className="text-sm font-semibold text-foreground">{token.symbol}</span>
              <span className="text-sm text-muted">{token.price}</span>
              <span className="text-xs text-accent">{token.change}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
          >
            <Card className="glass">
              <CardHeader>
                <CardDescription>{stat.label}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <AnimatedStat value={stat.value} unit={stat.unit} />
                <p className="text-sm text-accent">{stat.delta}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Card className="glass">
            <CardHeader>
              <CardTitle>Live market preview</CardTitle>
              <CardDescription>Streaming quotes, on-chain liquidity, and execution depth.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3">
                {marketPairs.map((market) => (
                  <div
                    key={market.pair}
                    className="group flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm transition hover:border-accent/40 hover:bg-white/10"
                  >
                    <div>
                      <p className="font-semibold text-foreground">{market.pair}</p>
                      <p className="text-xs text-muted">Liquidity {market.liquidity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">{market.price}</p>
                      <p className="text-xs text-accent">{market.change}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-muted">
                Last refresh: just now · Depth weighted · MEV-aware pricing
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="space-y-4"
        >
          <Card className="glass">
            <CardHeader>
              <CardTitle>Liquidity intelligence</CardTitle>
              <CardDescription>Portfolio-aware insights for active LPs.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {liquidityStats.map((stat) => (
                <div key={stat.label} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted">{stat.label}</p>
                  <p className="text-lg font-semibold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted">{stat.sub}</p>
                </div>
              ))}
              <Button variant="outline" className="w-full">
                Explore liquidity
              </Button>
            </CardContent>
          </Card>
          <Card className="glass">
            <CardHeader>
              <CardTitle>Execution engine</CardTitle>
              <CardDescription>Route protection and confidence scoring.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm">
              <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                <p className="text-muted">Route confidence</p>
                <p className="text-lg font-semibold text-foreground">98.7%</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                <p className="text-muted">Avg. settlement</p>
                <p className="text-lg font-semibold text-foreground">16.4s</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.04 }}
          >
            <Card className="glass h-full">
              <CardHeader>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          </motion.div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="glass">
          <CardHeader>
            <CardTitle>Roadmap</CardTitle>
            <CardDescription>Shipping continuously toward a fully composable DEX.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {roadmap.map((phase) => (
              <div key={phase.quarter} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-muted">{phase.quarter}</p>
                <p className="mt-2 text-lg font-semibold text-foreground">{phase.title}</p>
                <ul className="mt-3 space-y-2 text-sm text-muted">
                  {phase.items.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader>
            <CardTitle>FAQ</CardTitle>
            <CardDescription>Clear answers for fast onboarding.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.question} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="font-semibold text-foreground">{faq.question}</p>
                <p className="mt-2 text-sm text-muted">{faq.answer}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="rounded-3xl border border-white/10 bg-gradient-to-r from-[#111827] via-[#0b0f1a] to-[#0f172a] px-8 py-12">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <h2 className="text-3xl font-semibold text-foreground">Ready to trade on the next-gen DEX?</h2>
            <p className="text-sm text-muted">
              Connect your wallet, preview routes, and experience a premium DeFi interface built for speed and clarity.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <Link href="/swap">Start swapping</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/liquidity">Add liquidity</Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 pb-12 pt-10 text-sm text-muted">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-foreground">Mini DEX</p>
            <p>Institutional-grade swaps, built for everyone.</p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link href="/swap" className="hover:text-foreground">
              Swap
            </Link>
            <Link href="/liquidity" className="hover:text-foreground">
              Liquidity
            </Link>
            <Link href="/analytics" className="hover:text-foreground">
              Analytics
            </Link>
            <Link href="/history" className="hover:text-foreground">
              History
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
