"use client";

import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { formatMetric } from "@/lib/formatters";

const COLORS = ["#e9c176", "#10b981", "#3b82f6", "#f59e0b", "#ef4444"];

interface BarConfig {
  dataKey: string;
  label: string;
  color?: string;
}

interface DashboardBarChartProps {
  data: object[];
  xKey: string;
  bars: BarConfig[];
  currency?: "MXN" | "USD";
  metricType?: string;
  height?: number;
  stacked?: boolean;
}

export function DashboardBarChart({
  data,
  xKey,
  bars,
  currency = "MXN",
  metricType,
  height = 300,
  stacked = false,
}: DashboardBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart data={data}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="rgba(69, 70, 77, 0.15)"
          vertical={false}
        />
        <XAxis
          dataKey={xKey}
          tick={{ fontSize: 11, fill: "#c6c6cd" }}
          tickLine={false}
          axisLine={{ stroke: "rgba(69, 70, 77, 0.15)" }}
        />
        <YAxis
          tick={{ fontSize: 12, fill: "#c6c6cd" }}
          tickLine={false}
          axisLine={false}
          width={60}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#2d3449",
            border: "none",
            borderRadius: "8px",
            color: "#dae2fd",
            fontSize: "12px",
          }}
          formatter={(value: unknown, name: unknown) => {
            const v = Number(value);
            const n = String(name);
            const bar = bars.find((b) => b.dataKey === n);
            const formatted = metricType
              ? formatMetric(metricType, v, currency)
              : v.toLocaleString("es-MX");
            return [formatted, bar?.label || n];
          }}
        />
        <Legend
          wrapperStyle={{ color: "#c6c6cd", fontSize: "12px" }}
        />
        {bars.map((bar, i) => (
          <Bar
            key={bar.dataKey}
            dataKey={bar.dataKey}
            name={bar.dataKey}
            fill={bar.color || COLORS[i % COLORS.length]}
            stackId={stacked ? "stack" : undefined}
            radius={[4, 4, 0, 0]}
          />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}
