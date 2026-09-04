import type { Metadata } from "next";
import { getClients } from "@/lib/config";
import {
  getMetrics,
  aggregateMetrics,
  getDailyTrends,
  evaluateAlerts,
  getDefaultDateRange,
} from "@/lib/data";
import Link from "next/link";
import { ClientSummaryCard } from "@/components/dashboard/client-summary-card";

export const metadata: Metadata = {
  title: "Panel General — AdPilot Elite",
  description: "Vista consolidada de todos los clientes de Meta Ads",
};
import { AlertsPanel } from "@/components/dashboard/alerts-panel";
import { MetricCard } from "@/components/dashboard/metric-card";
import { HomeCharts } from "./home-charts";
import type { Alert, DailyTrend } from "@/lib/data/types";

export default async function HomePage() {
  const clients = getClients();
  const dateRange = getDefaultDateRange();

  const clientData = await Promise.all(
    clients.map(async (client) => {
      const metrics = await getMetrics(client.slug, dateRange);
      const aggregated = aggregateMetrics(metrics);
      const trends = getDailyTrends(metrics);
      const alerts = evaluateAlerts(metrics, client.slug);
      return { client, metrics, aggregated, trends, alerts };
    })
  );

  const allAlerts: Alert[] = clientData.flatMap((d) => d.alerts);

  const mxnClients = clientData.filter((d) => d.client.currency === "MXN");
  const usdClients = clientData.filter((d) => d.client.currency === "USD");
  const totalSpendMXN = mxnClients.reduce(
    (s, d) => s + d.aggregated.totalSpend,
    0
  );
  const totalSpendUSD = usdClients.reduce(
    (s, d) => s + d.aggregated.totalSpend,
    0
  );
  const totalPurchases = clientData.reduce(
    (s, d) => s + d.aggregated.totalPurchases,
    0
  );
  const totalLeads = clientData.reduce(
    (s, d) => s + d.aggregated.totalLeads,
    0
  );

  // Compute a global ROAS
  const totalRevenue = clientData.reduce(
    (s, d) => s + d.aggregated.totalPurchaseValue,
    0
  );
  const totalSpendAll = clientData.reduce(
    (s, d) => s + d.aggregated.totalSpend,
    0
  );
  const globalRoas = totalSpendAll > 0 ? totalRevenue / totalSpendAll : 0;

  const chartData: { clientName: string; trends: DailyTrend[] }[] =
    clientData.map((d) => ({
      clientName: d.client.name,
      trends: d.trends,
    }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="serif-display text-4xl md:text-5xl font-bold tracking-tight text-[#dae2fd]">
          Panel General
        </h1>
        <p className="text-[#c6c6cd] mt-2">
          Vista consolidada de todos los clientes — ultimos 7 dias
        </p>
      </div>

      {/* Metric cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Inversion Total"
          value={totalSpendMXN + totalSpendUSD}
          metric="spend"
          currency="MXN"
          accentBorder
        />
        <MetricCard
          label="Ventas"
          value={totalPurchases}
          metric="purchases"
        />
        <MetricCard
          label="Leads"
          value={totalLeads}
          metric="leads"
        />
        <MetricCard
          label="ROAS Global"
          value={globalRoas}
          metric="roas"
          accentBorder
        />
      </div>

      {/* Main content + aside */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Main content */}
        <div className="flex-1 space-y-8">
          {/* Client summary table */}
          <div>
            <h2 className="serif-display text-2xl font-bold text-[#dae2fd] mb-4">
              Resumen por Cliente
            </h2>
            <div className="bg-[#131b2e] rounded-xl shadow-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    <th className="text-left px-4 py-3 text-xs uppercase tracking-widest font-semibold text-[#c6c6cd]">
                      Cliente
                    </th>
                    <th className="text-left px-4 py-3 text-xs uppercase tracking-widest font-semibold text-[#c6c6cd]">
                      Inversion
                    </th>
                    <th className="text-left px-4 py-3 text-xs uppercase tracking-widest font-semibold text-[#c6c6cd]">
                      ROAS
                    </th>
                    <th className="text-left px-4 py-3 text-xs uppercase tracking-widest font-semibold text-[#c6c6cd]">
                      CPA
                    </th>
                    <th className="text-left px-4 py-3 text-xs uppercase tracking-widest font-semibold text-[#c6c6cd]">
                      Estado
                    </th>
                    <th className="text-left px-4 py-3 text-xs uppercase tracking-widest font-semibold text-[#c6c6cd]">
                      Accion
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {clientData.map((d) => (
                    <ClientSummaryCard
                      key={d.client.slug}
                      name={d.client.name}
                      slug={d.client.slug}
                      currency={d.client.currency}
                      metrics={d.aggregated}
                      sparklineData={d.trends.map((t) => ({ value: t.spend }))}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Charts */}
          <HomeCharts chartData={chartData} />
        </div>

        {/* Right aside: Alerts */}
        <aside className="w-full lg:w-80 shrink-0 space-y-4">
          <AlertsPanel alerts={allAlerts} />
          <Link
            href="/briefing"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-[#e9c176]/30 text-[#e9c176] text-sm font-semibold hover:bg-[#e9c176]/10 transition-colors"
          >
            Ver Briefing de Hoy
          </Link>
        </aside>
      </div>
    </div>
  );
}
