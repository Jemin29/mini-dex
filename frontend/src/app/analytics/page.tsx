"use client";

import PageHeader from "@/components/common/PageHeader";
import StatGrid from "@/components/analytics/StatGrid";
import TvlChart from "@/components/analytics/TvlChart";
import VolumeChart from "@/components/analytics/VolumeChart";
import PriceChart from "@/components/analytics/PriceChart";
import LiquidityDistributionChart from "@/components/analytics/LiquidityDistributionChart";
import PoolPerformanceTable from "@/components/analytics/PoolPerformanceTable";
import TopTokensTable from "@/components/analytics/TopTokensTable";
import RecentTransactions from "@/components/analytics/RecentTransactions";
import WalletAnalyticsCard from "@/components/analytics/WalletAnalyticsCard";
import UserPortfolioCard from "@/components/analytics/UserPortfolioCard";
import AnalyticsSkeleton from "@/components/analytics/AnalyticsSkeleton";
import { useAnalyticsData } from "@/hooks/useAnalyticsData";

export default function AnalyticsPage() {
  const { data, isLoading, isError } = useAnalyticsData();

  if (isLoading) {
    return (
      <div className="space-y-8">
        <PageHeader
          eyebrow="Analytics"
          title="DEX analytics"
          subtitle="Real-time protocol metrics, pool performance, and wallet insights."
        />
        <AnalyticsSkeleton />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="space-y-8">
        <PageHeader
          eyebrow="Analytics"
          title="DEX analytics"
          subtitle="Real-time protocol metrics, pool performance, and wallet insights."
        />
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-6 text-sm text-red-200">
          Unable to load analytics right now. Please refresh the page.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Analytics"
        title="DEX analytics"
        subtitle="Real-time protocol metrics, pool performance, and wallet insights."
      />
      <StatGrid summary={data.summary} />

      <div className="grid gap-4 lg:grid-cols-2">
        <TvlChart data={data.tvlSeries} />
        <VolumeChart data={data.volumeSeries} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <PriceChart data={data.priceSeries} />
        <LiquidityDistributionChart data={data.liquidityDistribution} />
        <div className="grid gap-4">
          <WalletAnalyticsCard wallet={data.wallet} />
          <UserPortfolioCard portfolio={data.portfolio} />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <PoolPerformanceTable pools={data.pools} />
        <TopTokensTable tokens={data.topTokens} />
      </div>

      <RecentTransactions txs={data.recentTxs} />
    </div>
  );
}
