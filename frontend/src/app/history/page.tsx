import PageHeader from "@/components/common/PageHeader";
import TxTable from "@/components/history/TxTable";

export default function HistoryPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="History"
        title="Transaction history"
        subtitle="Track all swaps and liquidity events in one place."
      />
      <TxTable />
    </div>
  );
}
