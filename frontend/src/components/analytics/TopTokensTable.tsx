import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TopToken } from "@/types/analytics";
import { formatNumber, formatPct } from "@/lib/format";

export default function TopTokensTable({ tokens }: { tokens: TopToken[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top tokens</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {tokens.map((token) => (
          <div key={token.symbol} className="flex items-center justify-between rounded-xl border border-border px-4 py-3 text-sm">
            <div>
              <p className="font-semibold text-foreground">{token.symbol}</p>
              <p className="text-xs text-muted">Liquidity ${formatNumber(token.liquidity, 2)}B</p>
            </div>
            <div className="text-right">
              <p className="text-foreground">${formatNumber(token.price, 2)}</p>
              <p className={token.change24h >= 0 ? "text-emerald-400 text-xs" : "text-red-400 text-xs"}>
                {formatPct(token.change24h, 2)}
              </p>
            </div>
            <div className="text-right text-xs text-muted">
              24h vol ${formatNumber(token.volume24h, 2)}B
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
