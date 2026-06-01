import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip } from "recharts";
import ChartCard from "@/components/analytics/ChartCard";
import { TimeSeriesPoint } from "@/types/analytics";
import { formatNumber } from "@/lib/format";

export default function VolumeChart({ data }: { data: TimeSeriesPoint[] }) {
  return (
    <ChartCard title="Swap volume" subtitle="24h aggregated volume (USD)">
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 12, right: 8, left: 0, bottom: 0 }}>
            <XAxis dataKey="time" tick={{ fill: "#8b96a8", fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: "#0b0f1a", border: "1px solid rgba(148,163,184,0.2)" }}
              formatter={(value: number) => `$${formatNumber(value, 2)}B`}
            />
            <Area type="monotone" dataKey="value" stroke="#22f7d4" fill="rgba(34,247,212,0.2)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
