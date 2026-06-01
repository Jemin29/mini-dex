import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PortfolioOverview } from "@/types/analytics";
import { formatNumber, formatPct } from "@/lib/format";

export default function UserPortfolioCard({ portfolio }: { portfolio: PortfolioOverview }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User portfolio</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-muted">Net value</span>
          <span>${formatNumber(portfolio.netValue, 0)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted">24h PnL</span>
          <span className={portfolio.pnl24h >= 0 ? "text-emerald-400" : "text-red-400"}>
            {formatPct(portfolio.pnl24h, 2)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted">Positions</span>
          <span>{formatNumber(portfolio.positions, 0)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
