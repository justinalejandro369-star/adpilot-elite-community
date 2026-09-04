import type { CampaignDayMetric, DataProvider, DateRange } from "./types";
import { getClients } from "../config";

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const campaignsByClient: Record<string, { name: string; objective: string }[]> = {
  northstar: [
    { name: "Growth Engine - Conversiones TOF", objective: "OUTCOME_SALES" },
    { name: "Copy Trading - Leads", objective: "OUTCOME_LEADS" },
    { name: "CP3 - Retargeting", objective: "OUTCOME_SALES" },
    { name: "CP4 - Lookalike MX", objective: "OUTCOME_SALES" },
    { name: "Northstar Branding - Alcance", objective: "OUTCOME_AWARENESS" },
  ],
  aurora: [
    { name: "Aurora Cruz - Ventas Directas", objective: "OUTCOME_SALES" },
    { name: "SKOOL - Nuevos Miembros", objective: "OUTCOME_LEADS" },
    { name: "Aurora - Retargeting Caliente", objective: "OUTCOME_SALES" },
  ],
  atlas: [
    { name: "Wellness Core - Purchase US", objective: "OUTCOME_SALES" },
    { name: "Relaciones - Leads Cold", objective: "OUTCOME_LEADS" },
    { name: "Creator Lab - Conversiones", objective: "OUTCOME_SALES" },
    { name: "WHA - Mensajes", objective: "OUTCOME_ENGAGEMENT" },
    { name: "Remarketing - Productos", objective: "OUTCOME_SALES" },
    { name: "Market Studio - Ventas", objective: "OUTCOME_SALES" },
  ],
};

function generateMetrics(
  clientSlug: string,
  dateRange: DateRange
): CampaignDayMetric[] {
  const client = getClients().find((c) => c.slug === clientSlug);
  if (!client) return [];

  const campaigns = campaignsByClient[clientSlug] || [];
  const metrics: CampaignDayMetric[] = [];
  const rand = seededRandom(clientSlug.length * 1000);
  const isMXN = client.currency === "MXN";
  const spendMultiplier = isMXN ? 17 : 1;

  const start = new Date(dateRange.from);
  const end = new Date(dateRange.to);

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split("T")[0];

    for (let i = 0; i < campaigns.length; i++) {
      const campaign = campaigns[i];
      const account = client.accounts[i % client.accounts.length];
      const baseSpend = (20 + rand() * 80) * spendMultiplier;
      const impressions = Math.round(1000 + rand() * 9000);
      const reach = Math.round(impressions * (0.6 + rand() * 0.3));
      const clicks = Math.round(impressions * (0.005 + rand() * 0.04));
      const linkClicks = Math.round(clicks * (0.6 + rand() * 0.3));
      const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
      const cpc = clicks > 0 ? baseSpend / clicks : 0;
      const cpm = impressions > 0 ? (baseSpend / impressions) * 1000 : 0;
      const frequency = reach > 0 ? impressions / reach : 0;
      const purchases = Math.round(rand() * 5);
      const purchaseValue = purchases * (isMXN ? 500 + rand() * 2000 : 30 + rand() * 120);
      const costPerPurchase = purchases > 0 ? baseSpend / purchases : 0;
      const roas = baseSpend > 0 ? purchaseValue / baseSpend : 0;
      const leads = Math.round(rand() * 8);
      const landingPageViews = Math.round(linkClicks * (0.7 + rand() * 0.2));
      const addToCart = Math.round(rand() * 3);

      metrics.push({
        rowKey: `${dateStr}_${account.id}_${campaign.name}`,
        dateStart: dateStr,
        dateStop: dateStr,
        accountName: account.name,
        accountId: account.id,
        campaignName: campaign.name,
        campaignId: `camp_${clientSlug}_${i}`,
        objective: campaign.objective,
        spend: Math.round(baseSpend * 100) / 100,
        impressions,
        reach,
        clicks,
        linkClicks,
        ctr: Math.round(ctr * 100) / 100,
        cpc: Math.round(cpc * 100) / 100,
        cpm: Math.round(cpm * 100) / 100,
        frequency: Math.round(frequency * 100) / 100,
        purchases,
        purchaseValue: Math.round(purchaseValue * 100) / 100,
        costPerPurchase: Math.round(costPerPurchase * 100) / 100,
        roas: Math.round(roas * 100) / 100,
        landingPageViews,
        addToCart,
        leads,
      });
    }
  }

  return metrics;
}

export const mockProvider: DataProvider = {
  async getMetrics(
    clientSlug: string,
    dateRange: DateRange
  ): Promise<CampaignDayMetric[]> {
    return generateMetrics(clientSlug, dateRange);
  },
};
