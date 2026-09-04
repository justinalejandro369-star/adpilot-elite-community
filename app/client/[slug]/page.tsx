import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getClientBySlug, getClientSlugs } from "@/lib/config";
import {
  getMetrics,
  aggregateMetrics,
  getDailyTrends,
  getCampaignSummaries,
  getDefaultDateRange,
} from "@/lib/data";
import { MetricCard } from "@/components/dashboard/metric-card";
import { ClientDetailCharts } from "./client-detail-charts";

export function generateStaticParams() {
  return getClientSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const client = getClientBySlug(slug);
  return {
    title: `${client?.name || slug} — AdPilot Elite`,
    description: `Metricas y rendimiento de campanas para ${client?.name || slug}`,
  };
}

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const client = getClientBySlug(slug);
  if (!client) notFound();

  const dateRange = getDefaultDateRange();
  const metrics = await getMetrics(slug, dateRange);
  const aggregated = aggregateMetrics(metrics);
  const trends = getDailyTrends(metrics);
  const campaigns = getCampaignSummaries(metrics);

  // Previous period for comparison
  const prevFrom = new Date(dateRange.from);
  const prevTo = new Date(dateRange.to);
  const days =
    (dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24);
  prevFrom.setDate(prevFrom.getDate() - days);
  prevTo.setDate(prevTo.getDate() - days);
  const prevMetrics = await getMetrics(slug, {
    from: prevFrom,
    to: prevTo,
  });
  const prevAggregated = aggregateMetrics(prevMetrics);

  const metricCards = [
    {
      label: "Gasto",
      metric: "spend",
      value: aggregated.totalSpend,
      prev: prevAggregated.totalSpend,
      sparkKey: "spend" as const,
    },
    {
      label: "ROAS",
      metric: "roas",
      value: aggregated.avgRoas,
      prev: prevAggregated.avgRoas,
      sparkKey: "roas" as const,
    },
    {
      label: "CTR",
      metric: "ctr",
      value: aggregated.avgCtr,
      prev: prevAggregated.avgCtr,
      sparkKey: "ctr" as const,
    },
    {
      label: "CPC",
      metric: "cpc",
      value: aggregated.avgCpc,
      prev: prevAggregated.avgCpc,
      sparkKey: "cpc" as const,
    },
    {
      label: "CPM",
      metric: "cpm",
      value: aggregated.avgCpm,
      prev: prevAggregated.avgCpm,
      sparkKey: "cpm" as const,
    },
    {
      label: "Frecuencia",
      metric: "frequency",
      value: aggregated.avgFrequency,
      prev: prevAggregated.avgFrequency,
      sparkKey: "ctr" as const,
    },
  ];

  // Spend by account for donut chart
  const byAccount = new Map<string, number>();
  for (const m of metrics) {
    byAccount.set(m.accountName, (byAccount.get(m.accountName) || 0) + m.spend);
  }
  const accountDistribution = Array.from(byAccount.entries()).map(
    ([name, value]) => ({ name, value: Math.round(value * 100) / 100 })
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <h1 className="serif-display text-4xl md:text-5xl font-bold tracking-tight text-[#dae2fd]">
          {client.name}
        </h1>
        <span className="text-xs font-semibold uppercase tracking-widest text-[#c6c6cd] bg-[#222a3d] px-3 py-1 rounded-full">
          {client.currency}
        </span>
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {metricCards.map((mc, i) => (
          <MetricCard
            key={mc.metric}
            label={mc.label}
            value={mc.value}
            previousValue={mc.prev}
            metric={mc.metric}
            currency={client.currency}
            thresholds={client.alertThresholds}
            accentBorder={i === 0 || i === 1}
          />
        ))}
      </div>

      <ClientDetailCharts
        trends={trends}
        campaigns={campaigns}
        accountDistribution={accountDistribution}
        currency={client.currency}
        thresholds={client.alertThresholds}
      />
    </div>
  );
}
