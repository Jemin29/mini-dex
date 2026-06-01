import { Card, CardContent } from "@/components/ui/card";
import { AnalyticsSummary } from "@/types/analytics";
import { formatNumber } from "@/lib/format";

export default function StatGrid({ summary }: { summary: AnalyticsSummary }) {
  const stats = [
    { label: "TVL", value: `$${formatNumber(summary.tvl, 2)}B` },
    { label: "24h Volume", value: `$${formatNumber(summary.volume24h, 2)}B` },
    { label: "Active Pools", value: formatNumber(summary.activePools, 0) },
    { label: "24h Swaps", value: formatNumber(summary.swapCount24h, 0) }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="glass">
          <CardContent className="space-y-2">
            <p className="text-xs uppercase tracking-[0.2em] text-muted">{stat.label}</p>
            <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
