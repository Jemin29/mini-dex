import SwapCard from "@/components/swap/SwapCard";
import SwapPreview from "@/components/swap/SwapPreview";
import PageHeader from "@/components/common/PageHeader";
import WalletPanel from "@/components/wallet/WalletPanel";

export default function SwapPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Swap"
        title="Swap tokens with confidence"
        subtitle="Preview price impact, slippage, and fees in real time before you commit."
      />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
        <div className="space-y-6">
          <SwapCard />
          <WalletPanel />
        </div>
        <SwapPreview />
      </div>
    </div>
  );
}
