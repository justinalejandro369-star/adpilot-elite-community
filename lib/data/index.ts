import type {
  DataProvider,
  CampaignDayMetric,
  DateRange,
  AggregatedMetrics,
  DailyTrend,
  CampaignSummary,
  Alert,
  AlertSeverity,
} from "./types";
import { mockProvider } from "./mock";
import { sheetsProvider } from "./sheets";
import { getClientBySlug } from "../config";

function getProvider(): DataProvider {
  const source = process.env.DATA_SOURCE || "mock";
  switch (source) {
    case "sheets": {
      return sheetsProvider;
    }
    case "mock":
    default:
      return mockProvider;
  }
}

const provider = getProvider();

export async function getMetrics(
  clientSlug: string,
  dateRange: DateRange
): Promise<CampaignDayMetric[]> {
  return provider.getMetrics(clientSlug, dateRange);
}

export function aggregateMetrics(
  metrics: CampaignDayMetric[]
): AggregatedMetrics {
  if (metrics.length === 0) {
    return {
      totalSpend: 0,
      totalImpressions: 0,
      totalReach: 0,
      totalClicks: 0,
      totalLinkClicks: 0,
      avgCtr: 0,
      avgCpc: 0,
      avgCpm: 0,
      avgFrequency: 0,
      totalPurchases: 0,
      totalPurchaseValue: 0,
      avgCostPerPurchase: 0,
      avgRoas: 0,
      totalLeads: 0,
      totalLandingPageViews: 0,
      totalAddToCart: 0,
    };
  }

  const totalSpend = metrics.reduce((s, m) => s + m.spend, 0);
  const totalImpressions = metrics.reduce((s, m) => s + m.impressions, 0);
  const totalReach = metrics.reduce((s, m) => s + m.reach, 0);
  const totalClicks = metrics.reduce((s, m) => s + m.clicks, 0);
  const totalLinkClicks = metrics.reduce((s, m) => s + m.linkClicks, 0);
  const totalPurchases = metrics.reduce((s, m) => s + m.purchases, 0);
  const totalPurchaseValue = metrics.reduce((s, m) => s + m.purchaseValue, 0);
  const totalLeads = metrics.reduce((s, m) => s + m.leads, 0);
  const totalLandingPageViews = metrics.reduce(
    (s, m) => s + m.landingPageViews,
    0
  );
  const totalAddToCart = metrics.reduce((s, m) => s + m.addToCart, 0);

  return {
    totalSpend,
    totalImpressions,
    totalReach,
    totalClicks,
    totalLinkClicks,
    avgCtr: totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0,
    avgCpc: totalClicks > 0 ? totalSpend / totalClicks : 0,
    avgCpm: totalImpressions > 0 ? (totalSpend / totalImpressions) * 1000 : 0,
    avgFrequency: totalReach > 0 ? totalImpressions / totalReach : 0,
    totalPurchases,
    totalPurchaseValue,
    avgCostPerPurchase: totalPurchases > 0 ? totalSpend / totalPurchases : 0,
    avgRoas: totalSpend > 0 ? totalPurchaseValue / totalSpend : 0,
    totalLeads,
    totalLandingPageViews,
    totalAddToCart,
  };
}

export function getDailyTrends(metrics: CampaignDayMetric[]): DailyTrend[] {
  const byDate = new Map<string, CampaignDayMetric[]>();
  for (const m of metrics) {
    const existing = byDate.get(m.dateStart) || [];
    existing.push(m);
    byDate.set(m.dateStart, existing);
  }

  return Array.from(byDate.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, dayMetrics]) => {
      const agg = aggregateMetrics(dayMetrics);
      return {
        date,
        spend: Math.round(agg.totalSpend * 100) / 100,
        impressions: agg.totalImpressions,
        clicks: agg.totalClicks,
        ctr: Math.round(agg.avgCtr * 100) / 100,
        cpc: Math.round(agg.avgCpc * 100) / 100,
        cpm: Math.round(agg.avgCpm * 100) / 100,
        purchases: agg.totalPurchases,
        purchaseValue: Math.round(agg.totalPurchaseValue * 100) / 100,
        roas: Math.round(agg.avgRoas * 100) / 100,
        leads: agg.totalLeads,
      };
    });
}

export function getCampaignSummaries(
  metrics: CampaignDayMetric[]
): CampaignSummary[] {
  const byCampaign = new Map<string, CampaignDayMetric[]>();
  for (const m of metrics) {
    const key = `${m.campaignId}_${m.accountId}`;
    const existing = byCampaign.get(key) || [];
    existing.push(m);
    byCampaign.set(key, existing);
  }

  return Array.from(byCampaign.values())
    .map((campaignMetrics) => {
      const first = campaignMetrics[0];
      const agg = aggregateMetrics(campaignMetrics);
      const uniqueDates = new Set(campaignMetrics.map((m) => m.dateStart));
      return {
        campaignName: first.campaignName,
        campaignId: first.campaignId,
        accountName: first.accountName,
        objective: first.objective,
        spend: Math.round(agg.totalSpend * 100) / 100,
        impressions: agg.totalImpressions,
        clicks: agg.totalClicks,
        ctr: Math.round(agg.avgCtr * 100) / 100,
        cpc: Math.round(agg.avgCpc * 100) / 100,
        cpm: Math.round(agg.avgCpm * 100) / 100,
        frequency: Math.round(agg.avgFrequency * 100) / 100,
        purchases: agg.totalPurchases,
        purchaseValue: Math.round(agg.totalPurchaseValue * 100) / 100,
        roas: Math.round(agg.avgRoas * 100) / 100,
        leads: agg.totalLeads,
        costPerPurchase: Math.round(agg.avgCostPerPurchase * 100) / 100,
        days: uniqueDates.size,
      };
    })
    .sort((a, b) => b.spend - a.spend);
}

export function evaluateAlerts(
  metrics: CampaignDayMetric[],
  clientSlug: string
): Alert[] {
  const client = getClientBySlug(clientSlug);
  if (!client) return [];

  const alerts: Alert[] = [];
  const { alertThresholds } = client;

  // Group by campaign for the latest day
  const dates = [...new Set(metrics.map((m) => m.dateStart))].sort();
  const latestDate = dates[dates.length - 1];
  if (!latestDate) return [];

  const latestMetrics = metrics.filter((m) => m.dateStart === latestDate);

  for (const m of latestMetrics) {
    // CRITICAL: spending with 0 clicks
    if (m.spend >= alertThresholds.spendZeroClicksMin && m.clicks === 0) {
      alerts.push({
        severity: "critical" as AlertSeverity,
        clientSlug,
        clientName: client.name,
        campaignName: m.campaignName,
        accountName: m.accountName,
        metric: "spend_no_clicks",
        value: m.spend,
        threshold: alertThresholds.spendZeroClicksMin,
        message: `Gasto ${m.spend.toFixed(2)} sin clics`,
      });
    }

    // WARNING: CTR below minimum
    if (m.impressions > 100 && m.ctr < alertThresholds.ctrMin) {
      alerts.push({
        severity: "warning" as AlertSeverity,
        clientSlug,
        clientName: client.name,
        campaignName: m.campaignName,
        accountName: m.accountName,
        metric: "ctr",
        value: m.ctr,
        threshold: alertThresholds.ctrMin,
        message: `CTR ${m.ctr.toFixed(2)}% < ${alertThresholds.ctrMin}%`,
      });
    }

    // WARNING: CPC above max
    if (m.clicks > 0 && m.cpc > alertThresholds.cpcMax) {
      alerts.push({
        severity: "warning" as AlertSeverity,
        clientSlug,
        clientName: client.name,
        campaignName: m.campaignName,
        accountName: m.accountName,
        metric: "cpc",
        value: m.cpc,
        threshold: alertThresholds.cpcMax,
        message: `CPC ${m.cpc.toFixed(2)} > ${alertThresholds.cpcMax}`,
      });
    }

    // WARNING: Frequency too high
    if (m.frequency > alertThresholds.frequencyMax) {
      alerts.push({
        severity: "warning" as AlertSeverity,
        clientSlug,
        clientName: client.name,
        campaignName: m.campaignName,
        accountName: m.accountName,
        metric: "frequency",
        value: m.frequency,
        threshold: alertThresholds.frequencyMax,
        message: `Frecuencia ${m.frequency.toFixed(2)} > ${alertThresholds.frequencyMax}`,
      });
    }

    // WINNER: ROAS above threshold
    if (m.purchases > 0 && m.roas >= alertThresholds.roasWinner) {
      alerts.push({
        severity: "winner" as AlertSeverity,
        clientSlug,
        clientName: client.name,
        campaignName: m.campaignName,
        accountName: m.accountName,
        metric: "roas",
        value: m.roas,
        threshold: alertThresholds.roasWinner,
        message: `ROAS ${m.roas.toFixed(2)}x - Ganador`,
      });
    }
  }

  // Sort: critical first, then warning, then winner
  const order: Record<AlertSeverity, number> = {
    critical: 0,
    warning: 1,
    winner: 2,
  };
  return alerts.sort((a, b) => order[a.severity] - order[b.severity]);
}

export function getDefaultDateRange(): DateRange {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - 7);
  return { from, to };
}

export type {
  CampaignDayMetric,
  DateRange,
  AggregatedMetrics,
  DailyTrend,
  CampaignSummary,
  Alert,
  AlertSeverity,
  ClientConfig,
  AlertThresholds,
} from "./types";
