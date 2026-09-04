"use client";

import Link from "next/link";
import { formatCurrency } from "@/lib/formatters";
import type { AggregatedMetrics } from "@/lib/data/types";

interface ClientSummaryCardProps {
  name: string;
  slug: string;
  currency: "MXN" | "USD";
  metrics: AggregatedMetrics;
  sparklineData: { value: number }[];
}

function getStatusChip(roas: number) {
  if (roas >= 3) {
    return {
      label: "Excelente",
      className: "bg-emerald-950 text-emerald-400",
    };
  }
  if (roas >= 1.5) {
    return {
      label: "Atencion",
      className: "bg-amber-950 text-amber-400",
    };
  }
  return {
    label: "Critico",
    className: "bg-rose-950 text-rose-400",
  };
}

export function ClientSummaryCard({
  name,
  slug,
  currency,
  metrics,
}: ClientSummaryCardProps) {
  const status = getStatusChip(metrics.avgRoas);
  const cpa =
    metrics.totalPurchases > 0
      ? metrics.totalSpend / metrics.totalPurchases
      : 0;

  return (
    <tr className="hover:bg-[#222a3d] transition-colors">
      <td className="px-4 py-3">
        <Link
          href={`/client/${slug}`}
          className="font-medium text-[#dae2fd] hover:text-[#e9c176] transition-colors"
        >
          {name}
        </Link>
      </td>
      <td className="px-4 py-3 tabular-nums text-[#c6c6cd]">
        {formatCurrency(metrics.totalSpend, currency)}
      </td>
      <td className="px-4 py-3">
        <span className="serif-display font-bold text-[#e9c176]">
          {metrics.avgRoas.toFixed(2)}x
        </span>
      </td>
      <td className="px-4 py-3 tabular-nums text-[#c6c6cd]">
        {formatCurrency(cpa, currency)}
      </td>
      <td className="px-4 py-3">
        <span
          className={`text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full ${status.className}`}
        >
          {status.label}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <Link
            href={`/client/${slug}`}
            className="text-xs font-medium text-[#e9c176] hover:text-[#e9c176]/80 transition-colors"
          >
            Ver detalle →
          </Link>
          <Link
            href={`/portal/${slug}`}
            className="text-xs font-medium text-[#c6c6cd] hover:text-[#dae2fd] transition-colors"
          >
            Portal
          </Link>
        </div>
      </td>
    </tr>
  );
}
