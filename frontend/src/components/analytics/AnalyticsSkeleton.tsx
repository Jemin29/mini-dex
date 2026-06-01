import { Skeleton } from "@/components/ui/skeleton";

export default function AnalyticsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[...Array(4)].map((_, index) => (
          <Skeleton key={`stat-${index}`} className="h-24" />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {[...Array(2)].map((_, index) => (
          <Skeleton key={`chart-${index}`} className="h-64" />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {[...Array(3)].map((_, index) => (
          <Skeleton key={`card-${index}`} className="h-48" />
        ))}
      </div>
    </div>
  );
}
