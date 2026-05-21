import { Card } from "@/components/ui/card";

type StatCardProps = {
  label: string;
  value: string;
  trend: string;
};

export default function StatCard({ label, value, trend }: StatCardProps) {
  return (
    <Card className="space-y-3">
      <p className="text-xs uppercase tracking-[0.2em] text-muted">{label}</p>
      <div className="flex items-end justify-between">
        <p className="text-2xl font-semibold text-foreground">{value}</p>
        <span className="text-xs text-accent">{trend}</span>
      </div>
    </Card>
  );
}
