"use client";

import { DashboardLineChart } from "@/components/charts/line-chart";
import type { DailyTrend } from "@/lib/data/types";

interface HomeChartsProps {
  chartData: { clientName: string; trends: DailyTrend[] }[];
}

export function HomeCharts({ chartData }: HomeChartsProps) {
  // Merge all client trends into a single dataset by date
  const dateMap = new Map<string, Record<string, number>>();

  for (const { clientName, trends } of chartData) {
    for (const t of trends) {
      const existing = dateMap.get(t.date) || { date: 0 };
      existing[clientName] = t.spend;
      dateMap.set(t.date, existing);
    }
  }

  const merged = Array.from(dateMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, values]) => ({ date, ...values }));

  const chartColors = ["#e9c176", "#10b981", "#3b82f6", "#f59e0b", "#ef4444"];
  const lines = chartData.map((d, i) => ({
    dataKey: d.clientName,
    label: d.clientName,
    color: chartColors[i % chartColors.length],
  }));

  return (
    <div className="bg-[#131b2e] rounded-xl shadow-lg p-6">
      <h3 className="serif-display text-lg font-bold text-[#dae2fd] mb-4">
        Gasto diario por cliente
      </h3>
      <DashboardLineChart
        data={merged}
        xKey="date"
        lines={lines}
        metricType="spend"
        height={320}
      />
    </div>
  );
}
