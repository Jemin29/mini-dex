import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PoolSparkline from "@/components/analytics/PoolSparkline";

export default function PoolTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pool overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-xl border border-border px-4 py-6 text-sm text-muted">
          Pool table has moved to the full analytics dashboard.
        </div>
        <div className="mt-4 flex items-center gap-3 text-xs text-muted">
          <span>Sample trend</span>
          <PoolSparkline />
        </div>
      </CardContent>
    </Card>
  );
}
