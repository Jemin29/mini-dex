import PageHeader from "@/components/common/PageHeader";
import PoolTable from "@/components/analytics/PoolTable";

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Analytics"
        title="Pool analytics"
        subtitle="Monitor TVL, fees, and volume across your pools."
      />
      <PoolTable />
    </div>
  );
}
