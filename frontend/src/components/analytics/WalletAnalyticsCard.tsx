import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WalletAnalytics } from "@/types/analytics";
import { formatNumber, formatPct } from "@/lib/format";

export default function WalletAnalyticsCard({ wallet }: { wallet: WalletAnalytics }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Wallet analytics</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-muted">Active wallets</span>
          <span>{formatNumber(wallet.activeWallets, 0)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted">New wallets (24h)</span>
          <span>{formatNumber(wallet.newWallets, 0)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted">Retention (7d)</span>
          <span>{formatPct(wallet.retention, 0)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
