"use client";

import { formatMetric, formatTrend, getTrendDirection } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  DollarSign,
  ShoppingCart,
  Users,
  Target,
  BarChart3,
  Repeat,
  MousePointer,
  type LucideIcon,
} from "lucide-react";
import type { AlertThresholds } from "@/lib/data/types";

const metricIcons: Record<string, LucideIcon> = {
  spend: DollarSign,
  roas: Target,
  purchases: ShoppingCart,
  leads: Users,
  ctr: MousePointer,
  cpc: DollarSign,
  cpm: BarChart3,
  frequency: Repeat,
};

function getSemaphore(
  metric: string,
  value: number,
  thresholds: AlertThresholds
): "green" | "yellow" | "red" {
  switch (metric) {
    case "ctr":
      if (value >= thresholds.ctrMin * 1.5) return "green";
      if (value >= thresholds.ctrMin) return "yellow";
      return "red";
    case "cpc":
      if (value <= thresholds.cpcMax * 0.5) return "green";
      if (value <= thresholds.cpcMax) return "yellow";
      return "red";
    case "frequency":
      if (value <= thresholds.frequencyMax * 0.5) return "green";
      if (value <= thresholds.frequencyMax) return "yellow";
      return "red";
    case "roas":
      if (value >= thresholds.roasWinner) return "green";
      if (value >= thresholds.roasWinner * 0.5) return "yellow";
      return "red";
    default:
      return "green";
  }
}

interface MetricCardProps {
  label: string;
  value: number;
  previousValue?: number;
  metric: string;
  currency?: "MXN" | "USD";
  sparklineData?: { value: number }[];
  thresholds?: AlertThresholds;
  accentBorder?: boolean;
}

export function MetricCard({
  label,
  value,
  previousValue,
  metric,
  currency = "MXN",
  thresholds,
  accentBorder = false,
}: MetricCardProps) {
  const formattedValue = formatMetric(metric, value, currency);
  const direction =
    previousValue !== undefined
      ? getTrendDirection(value, previousValue, metric)
      : "neutral";
  const trend =
    previousValue !== undefined ? formatTrend(value, previousValue) : null;
  const semaphore = thresholds ? getSemaphore(metric, value, thresholds) : null;
  const Icon = metricIcons[metric] || BarChart3;

  return (
    <div
      className={cn(
        "bg-[#131b2e] rounded-xl shadow-lg p-5 flex flex-col gap-3",
        accentBorder && "border-l-2 border-[#e9c176]/40"
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-widest font-semibold text-[#c6c6cd]">
          {label}
        </span>
        <div className="h-8 w-8 rounded-lg bg-[#e9c176]/10 flex items-center justify-center">
          <Icon className="h-4 w-4 text-[#e9c176]" />
        </div>
      </div>
      <div className="flex items-end gap-2">
        <p className="serif-display text-3xl font-bold text-[#dae2fd]">
          {formattedValue}
        </p>
        {semaphore && (
          <span
            className={cn(
              "h-2 w-2 rounded-full mb-2",
              semaphore === "green" && "bg-emerald-400",
              semaphore === "yellow" && "bg-amber-400",
              semaphore === "red" && "bg-red-400"
            )}
          />
        )}
      </div>
      {trend && (
        <div
          className={cn(
            "flex items-center gap-1 text-xs font-medium",
            direction === "up" && "text-emerald-400",
            direction === "down" && "text-rose-400",
            direction === "neutral" && "text-[#c6c6cd]"
          )}
        >
          {direction === "up" && <TrendingUp className="h-3 w-3" />}
          {direction === "down" && <TrendingDown className="h-3 w-3" />}
          {direction === "neutral" && <Minus className="h-3 w-3" />}
          <span>{trend} vs anterior</span>
        </div>
      )}
    </div>
  );
}
