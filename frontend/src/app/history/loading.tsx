import PageHeader from "@/components/common/PageHeader";
import HistorySkeleton from "@/components/history/HistorySkeleton";

export default function Loading() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="History"
        title="Transaction history"
        subtitle="Track all swaps and liquidity events in one place."
      />
      <HistorySkeleton />
    </div>
  );
}
