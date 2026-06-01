import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RecentTransaction } from "@/types/analytics";
import { formatNumber } from "@/lib/format";

export default function RecentTransactions({ txs }: { txs: RecentTransaction[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent transactions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {txs.map((tx) => (
          <div key={tx.hash} className="grid items-center gap-3 rounded-xl border border-border px-4 py-3 text-xs md:grid-cols-4">
            <Badge className="w-fit">{tx.type}</Badge>
            <p className="text-muted">{tx.pair}</p>
            <p className="text-muted">${formatNumber(tx.value, 0)}</p>
            <p className="text-muted">{tx.time}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
