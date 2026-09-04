"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { formatCurrency } from "@/lib/formatters";

const COLORS = [
  "#e9c176",
  "#10b981",
  "#3b82f6",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
  "#84cc16",
];

interface DonutChartProps {
  data: { name: string; value: number }[];
  currency?: "MXN" | "USD";
  height?: number;
}

export function DonutChart({
  data,
  currency = "MXN",
  height = 300,
}: DonutChartProps) {
  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={2}
          dataKey="value"
          label={(props: { name?: string; percent?: number }) =>
            `${props.name ?? ""} (${((props.percent ?? 0) * 100).toFixed(0)}%)`
          }
          labelLine={false}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "#2d3449",
            border: "none",
            borderRadius: "8px",
            color: "#dae2fd",
            fontSize: "12px",
          }}
          formatter={(value: unknown) => formatCurrency(Number(value), currency)}
        />
        <Legend
          wrapperStyle={{ color: "#c6c6cd", fontSize: "12px" }}
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-[#dae2fd] text-sm font-semibold"
        >
          {formatCurrency(total, currency)}
        </text>
      </PieChart>
    </ResponsiveContainer>
  );
}
