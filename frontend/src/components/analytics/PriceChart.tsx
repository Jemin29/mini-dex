import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip } from "recharts";
import ChartCard from "@/components/analytics/ChartCard";
import { TimeSeriesPoint } from "@/types/analytics";
import { formatNumber } from "@/lib/format";

export default function PriceChart({ data }: { data: TimeSeriesPoint[] }) {
  return (
    <ChartCard title="ETH price" subtitle="Spot price over the last 24h">
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 12, right: 8, left: 0, bottom: 0 }}>
            <XAxis dataKey="time" tick={{ fill: "#8b96a8", fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: "#0b0f1a", border: "1px solid rgba(148,163,184,0.2)" }}
              formatter={(value: number) => `$${formatNumber(value, 0)}`}
            />
            <Area type="monotone" dataKey="value" stroke="#f59e0b" fill="rgba(245,158,11,0.2)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
