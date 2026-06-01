import PageHeader from "@/components/common/PageHeader";
import AnalyticsSkeleton from "@/components/analytics/AnalyticsSkeleton";

export default function Loading() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Analytics"
        title="DEX analytics"
        subtitle="Real-time protocol metrics, pool performance, and wallet insights."
      />
      <AnalyticsSkeleton />
    </div>
  );
}
