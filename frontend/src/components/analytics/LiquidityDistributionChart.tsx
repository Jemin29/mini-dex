import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import ChartCard from "@/components/analytics/ChartCard";
import { LiquiditySlice } from "@/types/analytics";

const COLORS = ["#22f7d4", "#60a5fa", "#a855f7", "#f97316"];

export default function LiquidityDistributionChart({ data }: { data: LiquiditySlice[] }) {
  return (
    <ChartCard title="Liquidity distribution" subtitle="Allocation by category">
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={4}>
              {data.map((_, index) => (
                <Cell key={`slice-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ background: "#0b0f1a", border: "1px solid rgba(148,163,184,0.2)" }}
              formatter={(value: number) => `${value}%`}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
