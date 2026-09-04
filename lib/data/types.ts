export interface CampaignDayMetric {
  rowKey: string;
  dateStart: string;
  dateStop: string;
  accountName: string;
  accountId: string;
  campaignName: string;
  campaignId: string;
  objective: string;
  spend: number;
  impressions: number;
  reach: number;
  clicks: number;
  linkClicks: number;
  ctr: number;
  cpc: number;
  cpm: number;
  frequency: number;
  purchases: number;
  purchaseValue: number;
  costPerPurchase: number;
  roas: number;
  landingPageViews: number;
  addToCart: number;
  leads: number;
}

export interface AccountConfig {
  id: string;
  name: string;
}

export interface AlertThresholds {
  ctrMin: number;
  cpcMax: number;
  frequencyMax: number;
  roasWinner: number;
  spendZeroClicksMin: number;
}

export interface ClientConfig {
  name: string;
  slug: string;
  spreadsheetId: string;
  sheetName: string;
  currency: "MXN" | "USD";
  timezone: string;
  accounts: AccountConfig[];
  alertThresholds: AlertThresholds;
  competitors: CompetitorConfig[];
}

export interface DateRange {
  from: Date;
  to: Date;
}

export type AlertSeverity = "critical" | "warning" | "winner";

export interface Alert {
  severity: AlertSeverity;
  clientSlug: string;
  clientName: string;
  campaignName: string;
  accountName: string;
  metric: string;
  value: number;
  threshold: number;
  message: string;
}

export interface AggregatedMetrics {
  totalSpend: number;
  totalImpressions: number;
  totalReach: number;
  totalClicks: number;
  totalLinkClicks: number;
  avgCtr: number;
  avgCpc: number;
  avgCpm: number;
  avgFrequency: number;
  totalPurchases: number;
  totalPurchaseValue: number;
  avgCostPerPurchase: number;
  avgRoas: number;
  totalLeads: number;
  totalLandingPageViews: number;
  totalAddToCart: number;
}

export interface DailyTrend {
  date: string;
  spend: number;
  impressions: number;
  clicks: number;
  ctr: number;
  cpc: number;
  cpm: number;
  purchases: number;
  purchaseValue: number;
  roas: number;
  leads: number;
}

export interface CampaignSummary {
  campaignName: string;
  campaignId: string;
  accountName: string;
  objective: string;
  spend: number;
  impressions: number;
  clicks: number;
  ctr: number;
  cpc: number;
  cpm: number;
  frequency: number;
  purchases: number;
  purchaseValue: number;
  roas: number;
  leads: number;
  costPerPurchase: number;
  days: number;
}

export interface DataProvider {
  getMetrics(
    clientSlug: string,
    dateRange: DateRange
  ): Promise<CampaignDayMetric[]>;
}

// --- Competitor Intelligence ---

export interface CompetitorConfig {
  name: string;
  facebookPageId: string;
  niche: string;
  notes: string;
}

export interface CompetitorAd {
  id: string;
  competitorName: string;
  clientSlug: string;
  creativeType: "image" | "video" | "carousel";
  bodyText: string;
  headline: string;
  ctaText: string;
  hookAnalysis: string;
  scriptTranscript: string | null;
  angleDetected: string;
  platform: "facebook" | "instagram";
  startedRunning: string;
  isStillActive: boolean;
  scrapedAt: string;
}

export interface CompetitorInsight {
  week: string;
  clientSlug: string;
  topFormats: { format: string; count: number; trend: "up" | "down" | "stable" }[];
  topAngles: string[];
  newAdsCount: number;
  stoppedAdsCount: number;
  averageAdLifespan: number;
  aiSummary: string;
  recommendations: string[];
}
