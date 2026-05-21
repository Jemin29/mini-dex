import { Card } from "@/components/ui/card";

type MetricCardProps = {
  title: string;
  description: string;
};

export default function MetricCard({ title, description }: MetricCardProps) {
  return (
    <Card className="space-y-3">
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="text-sm text-muted">{description}</p>
    </Card>
  );
}
