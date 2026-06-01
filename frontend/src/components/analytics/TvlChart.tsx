import { ResponsiveContainer, LineChart, Line, XAxis, Tooltip } from "recharts";
import ChartCard from "@/components/analytics/ChartCard";
import { TimeSeriesPoint } from "@/types/analytics";
import { formatNumber } from "@/lib/format";

export default function TvlChart({ data }: { data: TimeSeriesPoint[] }) {
  return (
    <ChartCard title="Total value locked" subtitle="Real-time TVL (USD)">
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 12, right: 8, left: 0, bottom: 0 }}>
            <XAxis dataKey="time" tick={{ fill: "#8b96a8", fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: "#0b0f1a", border: "1px solid rgba(148,163,184,0.2)" }}
              formatter={(value: number) => `$${formatNumber(value, 2)}B`}
            />
            <Line type="monotone" dataKey="value" stroke="#60a5fa" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
