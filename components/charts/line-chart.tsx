"use client";

import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { formatMetric } from "@/lib/formatters";

const COLORS = ["#e9c176", "#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];

interface LineConfig {
  dataKey: string;
  label: string;
  color?: string;
}

interface DashboardLineChartProps {
  data: object[];
  xKey: string;
  lines: LineConfig[];
  currency?: "MXN" | "USD";
  metricType?: string;
  height?: number;
}

export function DashboardLineChart({
  data,
  xKey,
  lines,
  currency = "MXN",
  metricType,
  height = 300,
}: DashboardLineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLineChart data={data}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="rgba(69, 70, 77, 0.15)"
          vertical={false}
        />
        <XAxis
          dataKey={xKey}
          tick={{ fontSize: 12, fill: "#c6c6cd" }}
          tickLine={false}
          axisLine={{ stroke: "rgba(69, 70, 77, 0.15)" }}
          tickFormatter={(v: string) => {
            const d = new Date(v + "T00:00:00");
            return d.toLocaleDateString("es-MX", {
              day: "numeric",
              month: "short",
            });
          }}
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
            const line = lines.find((l) => l.dataKey === n);
            const formatted = metricType
              ? formatMetric(metricType, v, currency)
              : v.toLocaleString("es-MX");
            return [formatted, line?.label || n];
          }}
          labelFormatter={(label: unknown) => {
            const d = new Date(String(label) + "T00:00:00");
            return d.toLocaleDateString("es-MX", {
              weekday: "short",
              day: "numeric",
              month: "long",
            });
          }}
        />
        <Legend
          wrapperStyle={{ color: "#c6c6cd", fontSize: "12px" }}
        />
        {lines.map((line, i) => (
          <Line
            key={line.dataKey}
            type="monotone"
            dataKey={line.dataKey}
            name={line.dataKey}
            stroke={line.color || COLORS[i % COLORS.length]}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: line.color || COLORS[i % COLORS.length] }}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}
