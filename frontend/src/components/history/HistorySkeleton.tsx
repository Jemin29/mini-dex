import { Skeleton } from "@/components/ui/skeleton";

export default function HistorySkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-12" />
      <Skeleton className="h-72" />
    </div>
  );
}
