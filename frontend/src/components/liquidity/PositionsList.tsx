import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import TokenLogo from "@/components/common/TokenLogo";
import { useTokenList } from "@/hooks/useTokenList";

const positions = [
  { pair: "mA / mB", tvl: "$2.4M", apr: "12.2%" },
  { pair: "USDC / mB", tvl: "$1.1M", apr: "8.4%" }
];

export default function PositionsList() {
  const tokens = useTokenList();
  const tokenA = tokens[0];
  const tokenB = tokens[1];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your positions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {positions.length === 0 ? (
          <Skeleton className="h-20" />
        ) : (
          positions.map((position) => (
            <div key={position.pair} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  <TokenLogo token={tokenA} size="sm" />
                  <TokenLogo token={tokenB} size="sm" />
                </div>
                <p className="text-sm font-semibold text-foreground">{position.pair}</p>
                <p className="text-xs text-muted">TVL {position.tvl}</p>
              </div>
              <Badge>{position.apr} APR</Badge>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
