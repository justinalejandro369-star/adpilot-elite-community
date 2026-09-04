import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getClientBySlug } from "@/lib/config";
import {
  getMetrics,
  getCampaignSummaries,
  aggregateMetrics,
  getDefaultDateRange,
} from "@/lib/data";
import { CampaignTable } from "@/components/dashboard/campaign-table";
import { formatCurrency, formatNumber } from "@/lib/formatters";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const client = getClientBySlug(slug);
  return {
    title: `Campanas de ${client?.name || slug} — AdPilot Elite`,
    description: `Detalle de campanas activas para ${client?.name || slug}`,
  };
}

export default async function CampaignsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const client = getClientBySlug(slug);
  if (!client) notFound();

  const dateRange = getDefaultDateRange();
  const metrics = await getMetrics(slug, dateRange);
  const campaigns = getCampaignSummaries(metrics);
  const aggregated = aggregateMetrics(metrics);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="serif-display text-4xl md:text-5xl font-bold tracking-tight text-[#dae2fd]">
            Campanas
          </h1>
          <p className="text-[#c6c6cd] mt-2">
            {client.name} — Ultimos 7 dias — {campaigns.length} campanas activas
          </p>
        </div>
        <a
          href={`/campaigns/new?client=${slug}`}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#e9c176] text-[#412d00] rounded-lg font-bold hover:bg-[#e9c176]/90 transition-colors text-sm"
        >
          + Nueva Campana
        </a>
      </div>

      <CampaignTable
        campaigns={campaigns}
        currency={client.currency}
        thresholds={client.alertThresholds}
      />

      {/* Bottom stats bar */}
      <div className="bg-[#131b2e] rounded-xl shadow-lg p-4 flex flex-wrap gap-6 md:gap-10">
        <div>
          <span className="text-xs uppercase tracking-widest font-semibold text-[#c6c6cd]">
            Gasto total
          </span>
          <p className="serif-display text-xl font-bold text-[#dae2fd]">
            {formatCurrency(aggregated.totalSpend, client.currency)}
          </p>
        </div>
        <div>
          <span className="text-xs uppercase tracking-widest font-semibold text-[#c6c6cd]">
            ROAS promedio
          </span>
          <p className="serif-display text-xl font-bold text-[#e9c176]">
            {aggregated.avgRoas.toFixed(2)}x
          </p>
        </div>
        <div>
          <span className="text-xs uppercase tracking-widest font-semibold text-[#c6c6cd]">
            Ventas
          </span>
          <p className="serif-display text-xl font-bold text-[#dae2fd]">
            {formatNumber(aggregated.totalPurchases)}
          </p>
        </div>
        <div>
          <span className="text-xs uppercase tracking-widest font-semibold text-[#c6c6cd]">
            Leads
          </span>
          <p className="serif-display text-xl font-bold text-[#dae2fd]">
            {formatNumber(aggregated.totalLeads)}
          </p>
        </div>
      </div>
    </div>
  );
}
