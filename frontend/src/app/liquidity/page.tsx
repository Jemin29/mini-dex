import PageHeader from "@/components/common/PageHeader";
import LiquidityCard from "@/components/liquidity/LiquidityCard";
import PositionsList from "@/components/liquidity/PositionsList";

export default function LiquidityPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Liquidity"
        title="Manage liquidity positions"
        subtitle="Deposit, withdraw, and monitor pool performance with detailed stats."
      />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
        <LiquidityCard />
        <PositionsList />
      </div>
    </div>
  );
}
