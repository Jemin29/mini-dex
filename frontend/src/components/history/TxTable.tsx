import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const txs = [
  { type: "Swap", pair: "mA / mB", status: "Confirmed", amount: "200 mA" },
  { type: "Add", pair: "USDC / mB", status: "Pending", amount: "1,000 USDC" }
];

export default function TxTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {txs.map((tx) => (
            <div key={tx.type + tx.amount} className="grid items-center gap-3 rounded-xl border border-border px-4 py-3 md:grid-cols-4">
              <p className="text-sm font-semibold text-foreground">{tx.type}</p>
              <p className="text-xs text-muted">{tx.pair}</p>
              <Badge className="w-fit" aria-label={`Status ${tx.status}`}>{tx.status}</Badge>
              <p className="text-xs text-muted">{tx.amount}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
