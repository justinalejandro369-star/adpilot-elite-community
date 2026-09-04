"use client";

import { LineChart, Line, ResponsiveContainer } from "recharts";

interface SparklineProps {
  data: { value: number }[];
  color?: string;
  width?: number;
  height?: number;
}

export function Sparkline({
  data,
  color,
  width = 80,
  height = 30,
}: SparklineProps) {
  if (data.length < 2) return null;

  const first = data[0].value;
  const last = data[data.length - 1].value;
  const trendColor = color || (last >= first ? "#10b981" : "#ef4444");

  return (
    <div style={{ width, height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line
            type="monotone"
            dataKey="value"
            stroke={trendColor}
            strokeWidth={1.5}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
