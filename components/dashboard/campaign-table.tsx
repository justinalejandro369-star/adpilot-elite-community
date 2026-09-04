"use client";

import { useState, useMemo } from "react";
import { ArrowUpDown } from "lucide-react";
import { formatMetric } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import type { CampaignSummary, AlertThresholds } from "@/lib/data/types";

type SortKey = keyof CampaignSummary;
type SortDir = "asc" | "desc";

function getStatusChip(roas: number) {
  if (roas >= 3) {
    return { label: "Excelente", className: "bg-emerald-950 text-emerald-400" };
  }
  if (roas >= 1.5) {
    return { label: "Atencion", className: "bg-amber-950 text-amber-400" };
  }
  return { label: "Critico", className: "bg-rose-950 text-rose-400" };
}

function getSemaphoreColor(
  metric: string,
  value: number,
  thresholds: AlertThresholds
): string {
  switch (metric) {
    case "ctr":
      return value < thresholds.ctrMin ? "text-rose-400" : "";
    case "cpc":
      return value > thresholds.cpcMax ? "text-rose-400" : "";
    case "frequency":
      return value > thresholds.frequencyMax ? "text-amber-400" : "";
    case "roas":
      return value >= thresholds.roasWinner
        ? "text-[#e9c176] font-bold"
        : "";
    default:
      return "";
  }
}

interface CampaignTableProps {
  campaigns: CampaignSummary[];
  currency: "MXN" | "USD";
  thresholds: AlertThresholds;
}

const columns: { key: SortKey; label: string; metric?: string }[] = [
  { key: "campaignName", label: "Campana" },
  { key: "accountName", label: "Cuenta" },
  { key: "spend", label: "Gasto", metric: "spend" },
  { key: "impressions", label: "Impresiones", metric: "impressions" },
  { key: "clicks", label: "Clics", metric: "clicks" },
  { key: "ctr", label: "CTR", metric: "ctr" },
  { key: "cpc", label: "CPC", metric: "cpc" },
  { key: "cpm", label: "CPM", metric: "cpm" },
  { key: "frequency", label: "Frecuencia", metric: "frequency" },
  { key: "purchases", label: "Ventas", metric: "purchases" },
  { key: "roas", label: "ROAS", metric: "roas" },
  { key: "leads", label: "Leads", metric: "leads" },
];

export function CampaignTable({
  campaigns,
  currency,
  thresholds,
}: CampaignTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("spend");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const sorted = useMemo(() => {
    return [...campaigns].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDir === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      return sortDir === "asc"
        ? (aVal as number) - (bVal as number)
        : (bVal as number) - (aVal as number);
    });
  }, [campaigns, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  return (
    <div className="bg-[#131b2e] rounded-xl shadow-2xl overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/[0.06]">
            {columns.map((col) => (
              <th key={col.key} className="text-left whitespace-nowrap">
                <button
                  className="flex items-center gap-1 px-4 py-3 text-xs uppercase tracking-widest font-semibold text-[#c6c6cd] hover:text-[#dae2fd] transition-colors"
                  onClick={() => toggleSort(col.key)}
                >
                  {col.label}
                  <ArrowUpDown className="h-3 w-3 opacity-50" />
                </button>
              </th>
            ))}
            <th className="text-left px-4 py-3 text-xs uppercase tracking-widest font-semibold text-[#c6c6cd]">
              Estado
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.04]">
          {sorted.map((campaign) => {
            const status = getStatusChip(campaign.roas);
            return (
              <tr
                key={`${campaign.campaignId}_${campaign.accountName}`}
                className="hover:bg-[#222a3d] transition-colors"
              >
                <td className="px-4 py-3 font-medium text-[#dae2fd] max-w-[200px] truncate">
                  {campaign.campaignName}
                </td>
                <td className="px-4 py-3 text-xs text-[#c6c6cd] max-w-[120px] truncate">
                  {campaign.accountName}
                </td>
                {columns.slice(2).map((col) => {
                  const value = campaign[col.key] as number;
                  const colorClass = col.metric
                    ? getSemaphoreColor(col.metric, value, thresholds)
                    : "";
                  return (
                    <td
                      key={col.key}
                      className={cn(
                        "px-4 py-3 whitespace-nowrap tabular-nums text-[#c6c6cd]",
                        colorClass
                      )}
                    >
                      {col.metric
                        ? formatMetric(col.metric, value, currency)
                        : value}
                    </td>
                  );
                })}
                <td className="px-4 py-3">
                  <span
                    className={`text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full ${status.className}`}
                  >
                    {status.label}
                  </span>
                </td>
              </tr>
            );
          })}
          {sorted.length === 0 && (
            <tr>
              <td
                colSpan={columns.length + 1}
                className="text-center py-8 text-[#c6c6cd]"
              >
                No hay datos para el periodo seleccionado
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
