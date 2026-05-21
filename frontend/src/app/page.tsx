import PageHeader from "@/components/common/PageHeader";
import StatCard from "@/components/common/StatCard";
import MetricCard from "@/components/common/MetricCard";

export default function LandingPage() {
  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Mini DEX"
        title="Liquidity. Speed. Clarity."
        subtitle="A modern AMM DEX interface built for precision trading and clean liquidity management."
        ctaHref="/swap"
        ctaLabel="Start swapping"
      />

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard label="Total Value Locked" value="$12.4M" trend="+6.2%" />
        <StatCard label="24h Volume" value="$3.8M" trend="+12.4%" />
        <StatCard label="Active Pools" value="48" trend="+3" />
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <MetricCard title="Instant Execution" description="Optimized swap flow with real-time price impact." />
        <MetricCard title="Smart Liquidity" description="Track pools, incentives, and optimized liquidity positions." />
        <MetricCard title="Transparent Fees" description="Built-in fee visibility and accurate slippage control." />
      </section>
    </div>
  );
}
