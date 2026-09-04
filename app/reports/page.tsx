import type { Metadata } from "next";
import { getClients } from "@/lib/config";
import {
  getMetrics,
  aggregateMetrics,
  getDefaultDateRange,
} from "@/lib/data";
import { formatCurrency, formatPercent, formatTrend } from "@/lib/formatters";
import { TrendingUp, TrendingDown } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Reportes WoW — AdPilot Elite",
  description: "Comparativa semanal de rendimiento para todos los clientes",
};

export default async function ReportsPage() {
  const clients = getClients();
  const dateRange = getDefaultDateRange();

  // Current and previous period
  const days =
    (dateRange.to.getTime() - dateRange.from.getTime()) /
    (1000 * 60 * 60 * 24);
  const prevFrom = new Date(dateRange.from);
  const prevTo = new Date(dateRange.to);
  prevFrom.setDate(prevFrom.getDate() - days);
  prevTo.setDate(prevTo.getDate() - days);

  const reports = await Promise.all(
    clients.map(async (client) => {
      const current = aggregateMetrics(
        await getMetrics(client.slug, dateRange)
      );
      const previous = aggregateMetrics(
        await getMetrics(client.slug, { from: prevFrom, to: prevTo })
      );
      return { client, current, previous };
    })
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="serif-display text-4xl md:text-5xl font-bold tracking-tight text-[#dae2fd]">
          Reporte Comparativo WoW
        </h1>
        <p className="text-[#c6c6cd] mt-2">
          Comparativa semana actual vs semana anterior
        </p>
      </div>

      <div className="flex justify-end">
        <Link
          href="/attribution"
          className="text-sm font-semibold text-[#e9c176] hover:text-[#e9c176]/80 transition-colors"
        >
          Ver Atribucion Completa →
        </Link>
      </div>

      <div className="space-y-6">
        {reports.map(({ client, current, previous }) => (
          <div
            key={client.slug}
            className="bg-[#131b2e] rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center gap-3 mb-5">
              <h2 className="serif-display text-2xl font-bold text-[#dae2fd]">
                {client.name}
              </h2>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#c6c6cd] bg-[#222a3d] px-3 py-1 rounded-full">
                {client.currency}
              </span>
            </div>
            <div className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-7">
              <ReportMetric
                label="Gasto"
                current={formatCurrency(current.totalSpend, client.currency)}
                trend={formatTrend(current.totalSpend, previous.totalSpend)}
                isPositive={current.totalSpend <= previous.totalSpend}
              />
              <ReportMetric
                label="ROAS"
                current={`${current.avgRoas.toFixed(2)}x`}
                trend={formatTrend(current.avgRoas, previous.avgRoas)}
                isPositive={current.avgRoas >= previous.avgRoas}
                isGold
              />
              <ReportMetric
                label="CTR"
                current={formatPercent(current.avgCtr)}
                trend={formatTrend(current.avgCtr, previous.avgCtr)}
                isPositive={current.avgCtr >= previous.avgCtr}
              />
              <ReportMetric
                label="CPC"
                current={formatCurrency(current.avgCpc, client.currency)}
                trend={formatTrend(current.avgCpc, previous.avgCpc)}
                isPositive={current.avgCpc <= previous.avgCpc}
              />
              <ReportMetric
                label="Ventas"
                current={String(current.totalPurchases)}
                trend={formatTrend(
                  current.totalPurchases,
                  previous.totalPurchases
                )}
                isPositive={current.totalPurchases >= previous.totalPurchases}
              />
              <ReportMetric
                label="Ingresos"
                current={formatCurrency(
                  current.totalPurchaseValue,
                  client.currency
                )}
                trend={formatTrend(
                  current.totalPurchaseValue,
                  previous.totalPurchaseValue
                )}
                isPositive={
                  current.totalPurchaseValue >= previous.totalPurchaseValue
                }
              />
              <ReportMetric
                label="Leads"
                current={String(current.totalLeads)}
                trend={formatTrend(current.totalLeads, previous.totalLeads)}
                isPositive={current.totalLeads >= previous.totalLeads}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReportMetric({
  label,
  current,
  trend,
  isPositive,
  isGold = false,
}: {
  label: string;
  current: string;
  trend: string;
  isPositive: boolean;
  isGold?: boolean;
}) {
  return (
    <div>
      <p className="text-xs uppercase tracking-widest font-semibold text-[#c6c6cd] mb-1">
        {label}
      </p>
      <p
        className={`serif-display text-xl font-bold ${
          isGold ? "text-[#e9c176]" : "text-[#dae2fd]"
        }`}
      >
        {current}
      </p>
      <div
        className={`flex items-center gap-1 text-xs font-medium mt-1 ${
          isPositive ? "text-emerald-400" : "text-rose-400"
        }`}
      >
        {isPositive ? (
          <TrendingUp className="h-3 w-3" />
        ) : (
          <TrendingDown className="h-3 w-3" />
        )}
        <span>{trend}</span>
      </div>
    </div>
  );
}
