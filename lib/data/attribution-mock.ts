// Phase 7: Attribution & Client Portal mock data

export interface FunnelStep {
  label: string;
  absoluteCount: number;
  percentage: number;
}

export interface PlatformRevenue {
  platform: "Hotmart" | "Skool" | "Go High Level";
  icon: string;
  revenue: number;
  transactions?: number;
  topProduct?: string;
  newMembers?: number;
  community?: string;
  pipelineLeads?: number;
  closedOpportunities?: number;
}

export interface AttributionPath {
  sequence: string;
  conversions: number;
  percentOfTotal: number;
  averageValue: number;
}

export interface DailyAttribution {
  date: string;
  metaSpend: number;
  totalRevenue: number;
}

export interface PortalSummary {
  clientName: string;
  slug: string;
  roasMultiplier: number;
  improving: boolean;
  invested: number;
  generated: number;
  netProfit: number;
  currency: "MXN" | "USD";
  activities: { timeAgo: string; text: string }[];
  scalingProposal: {
    additionalBudget: number;
    additionalSales: number;
    additionalRevenue: number;
    projectedRoas: number;
  };
}

export interface AttributionData {
  clientSlug: string;
  funnel: FunnelStep[];
  platforms: PlatformRevenue[];
  roasReal: number;
  roasMeta: number;
  attributionPaths: AttributionPath[];
  dailyAttribution: DailyAttribution[];
}

const northstarAttribution: AttributionData = {
  clientSlug: "northstar",
  funnel: [
    { label: "Ad Click", absoluteCount: 12450, percentage: 100 },
    { label: "Landing Page", absoluteCount: 10583, percentage: 85 },
    { label: "Registro", absoluteCount: 3984, percentage: 32 },
    { label: "Email Open", absoluteCount: 5603, percentage: 45 },
    { label: "Webinar", absoluteCount: 3486, percentage: 28 },
    { label: "Checkout", absoluteCount: 1494, percentage: 12 },
    { label: "Purchase", absoluteCount: 996, percentage: 8 },
    { label: "Upsell", absoluteCount: 374, percentage: 3 },
  ],
  platforms: [
    {
      platform: "Hotmart",
      icon: "H",
      revenue: 89420,
      transactions: 187,
      topProduct: "Growth Engine — Curso de Trading",
    },
    {
      platform: "Skool",
      icon: "S",
      revenue: 34500,
      newMembers: 115,
      community: "Copy Trading Elite",
    },
    {
      platform: "Go High Level",
      icon: "G",
      revenue: 52441,
      pipelineLeads: 342,
      closedOpportunities: 89,
    },
  ],
  roasReal: 5.23,
  roasMeta: 4.14,
  attributionPaths: [
    { sequence: "Anuncio Frio → Retargeting → Compra", conversions: 45, percentOfTotal: 38, averageValue: 497 },
    { sequence: "Anuncio Frio → Email → Webinar → Compra", conversions: 28, percentOfTotal: 24, averageValue: 697 },
    { sequence: "Organico → Retargeting → Compra", conversions: 22, percentOfTotal: 19, averageValue: 347 },
    { sequence: "Directo → Compra", conversions: 15, percentOfTotal: 13, averageValue: 297 },
    { sequence: "Referido → Compra", conversions: 8, percentOfTotal: 7, averageValue: 597 },
  ],
  dailyAttribution: [
    { date: "2026-03-23", metaSpend: 5200, totalRevenue: 24300 },
    { date: "2026-03-24", metaSpend: 5800, totalRevenue: 28900 },
    { date: "2026-03-25", metaSpend: 4900, totalRevenue: 22100 },
    { date: "2026-03-26", metaSpend: 6100, totalRevenue: 31200 },
    { date: "2026-03-27", metaSpend: 5500, totalRevenue: 26800 },
    { date: "2026-03-28", metaSpend: 5900, totalRevenue: 29500 },
    { date: "2026-03-29", metaSpend: 6450, totalRevenue: 33561 },
  ],
};

const auroraAttribution: AttributionData = {
  clientSlug: "aurora",
  funnel: [
    { label: "Ad Click", absoluteCount: 8320, percentage: 100 },
    { label: "Landing Page", absoluteCount: 7072, percentage: 85 },
    { label: "Registro", absoluteCount: 2662, percentage: 32 },
    { label: "Email Open", absoluteCount: 3744, percentage: 45 },
    { label: "Webinar", absoluteCount: 2330, percentage: 28 },
    { label: "Checkout", absoluteCount: 998, percentage: 12 },
    { label: "Purchase", absoluteCount: 666, percentage: 8 },
    { label: "Upsell", absoluteCount: 250, percentage: 3 },
  ],
  platforms: [
    {
      platform: "Hotmart",
      icon: "H",
      revenue: 42800,
      transactions: 94,
      topProduct: "Aurora Cruz — Mentorias 1:1",
    },
    {
      platform: "Skool",
      icon: "S",
      revenue: 18900,
      newMembers: 63,
      community: "SKOOL de Aurora",
    },
    {
      platform: "Go High Level",
      icon: "G",
      revenue: 28150,
      pipelineLeads: 187,
      closedOpportunities: 52,
    },
  ],
  roasReal: 3.87,
  roasMeta: 3.12,
  attributionPaths: [
    { sequence: "Anuncio Frio → Retargeting → Compra", conversions: 32, percentOfTotal: 35, averageValue: 420 },
    { sequence: "Anuncio Frio → Email → Webinar → Compra", conversions: 22, percentOfTotal: 24, averageValue: 580 },
    { sequence: "Organico → Retargeting → Compra", conversions: 18, percentOfTotal: 20, averageValue: 310 },
    { sequence: "Directo → Compra", conversions: 12, percentOfTotal: 13, averageValue: 270 },
    { sequence: "Referido → Compra", conversions: 7, percentOfTotal: 8, averageValue: 490 },
  ],
  dailyAttribution: [
    { date: "2026-03-23", metaSpend: 3200, totalRevenue: 11800 },
    { date: "2026-03-24", metaSpend: 3500, totalRevenue: 13500 },
    { date: "2026-03-25", metaSpend: 3100, totalRevenue: 11200 },
    { date: "2026-03-26", metaSpend: 3800, totalRevenue: 15100 },
    { date: "2026-03-27", metaSpend: 3400, totalRevenue: 12900 },
    { date: "2026-03-28", metaSpend: 3600, totalRevenue: 13800 },
    { date: "2026-03-29", metaSpend: 3550, totalRevenue: 14050 },
  ],
};

const atlasAttribution: AttributionData = {
  clientSlug: "atlas",
  funnel: [
    { label: "Ad Click", absoluteCount: 15800, percentage: 100 },
    { label: "Landing Page", absoluteCount: 13430, percentage: 85 },
    { label: "Registro", absoluteCount: 5056, percentage: 32 },
    { label: "Email Open", absoluteCount: 7110, percentage: 45 },
    { label: "Webinar", absoluteCount: 4424, percentage: 28 },
    { label: "Checkout", absoluteCount: 1896, percentage: 12 },
    { label: "Purchase", absoluteCount: 1264, percentage: 8 },
    { label: "Upsell", absoluteCount: 474, percentage: 3 },
  ],
  platforms: [
    {
      platform: "Hotmart",
      icon: "H",
      revenue: 67200,
      transactions: 156,
      topProduct: "Wellness Core — Programa Completo",
    },
    {
      platform: "Skool",
      icon: "S",
      revenue: 28400,
      newMembers: 94,
      community: "Creator Lab Community",
    },
    {
      platform: "Go High Level",
      icon: "G",
      revenue: 41250,
      pipelineLeads: 412,
      closedOpportunities: 78,
    },
  ],
  roasReal: 4.56,
  roasMeta: 3.71,
  attributionPaths: [
    { sequence: "Anuncio Frio → Retargeting → Compra", conversions: 52, percentOfTotal: 36, averageValue: 520 },
    { sequence: "Anuncio Frio → Email → Webinar → Compra", conversions: 35, percentOfTotal: 24, averageValue: 720 },
    { sequence: "Organico → Retargeting → Compra", conversions: 29, percentOfTotal: 20, averageValue: 380 },
    { sequence: "Directo → Compra", conversions: 18, percentOfTotal: 13, averageValue: 310 },
    { sequence: "Referido → Compra", conversions: 10, percentOfTotal: 7, averageValue: 620 },
  ],
  dailyAttribution: [
    { date: "2026-03-23", metaSpend: 4100, totalRevenue: 18200 },
    { date: "2026-03-24", metaSpend: 4500, totalRevenue: 21300 },
    { date: "2026-03-25", metaSpend: 3900, totalRevenue: 17100 },
    { date: "2026-03-26", metaSpend: 4800, totalRevenue: 22800 },
    { date: "2026-03-27", metaSpend: 4300, totalRevenue: 19600 },
    { date: "2026-03-28", metaSpend: 4600, totalRevenue: 21200 },
    { date: "2026-03-29", metaSpend: 4700, totalRevenue: 22150 },
  ],
};

const attributionDataByClient: Record<string, AttributionData> = {
  northstar: northstarAttribution,
  aurora: auroraAttribution,
  atlas: atlasAttribution,
};

export function getAttributionData(clientSlug: string): AttributionData {
  return attributionDataByClient[clientSlug] || northstarAttribution;
}

export function getAllAttributionData(): AttributionData[] {
  return [northstarAttribution, auroraAttribution, atlasAttribution];
}

// Portal mock data
const portalData: Record<string, PortalSummary> = {
  northstar: {
    clientName: "Northstar",
    slug: "northstar",
    roasMultiplier: 4.43,
    improving: true,
    invested: 39854,
    generated: 176361,
    netProfit: 136507,
    currency: "MXN",
    activities: [
      { timeAgo: "Hoy", text: "Se crearon 3 anuncios nuevos para tu campana de Trading" },
      { timeAgo: "Ayer", text: "Tu campana Growth Engine genero 12 ventas" },
      { timeAgo: "Hace 2 dias", text: "Optimizamos el presupuesto — movimos $200 a tu campana mas rentable" },
      { timeAgo: "Hace 3 dias", text: "Detectamos un creativo ganador con ROAS de 7.5x" },
    ],
    scalingProposal: {
      additionalBudget: 8000,
      additionalSales: 25,
      additionalRevenue: 12500,
      projectedRoas: 4.1,
    },
  },
  aurora: {
    clientName: "Aurora",
    slug: "aurora",
    roasMultiplier: 3.87,
    improving: true,
    invested: 23200,
    generated: 89850,
    netProfit: 66650,
    currency: "MXN",
    activities: [
      { timeAgo: "Hoy", text: "Se optimizaron 2 audiencias para mayor conversion" },
      { timeAgo: "Ayer", text: "Tu campana SKOOL genero 8 nuevos miembros" },
      { timeAgo: "Hace 2 dias", text: "Pausamos un anuncio con bajo rendimiento — ahorraste $150" },
      { timeAgo: "Hace 3 dias", text: "Nuevo creativo de video supera al anterior por 2.3x" },
    ],
    scalingProposal: {
      additionalBudget: 5000,
      additionalSales: 18,
      additionalRevenue: 8400,
      projectedRoas: 3.5,
    },
  },
  atlas: {
    clientName: "Atlas",
    slug: "atlas",
    roasMultiplier: 4.56,
    improving: false,
    invested: 30900,
    generated: 136850,
    netProfit: 105950,
    currency: "USD",
    activities: [
      { timeAgo: "Hoy", text: "Se lanzaron 4 variantes de anuncio para Wellness Core" },
      { timeAgo: "Ayer", text: "Tu campana Creator Lab cerro 15 ventas" },
      { timeAgo: "Hace 2 dias", text: "Reasignamos presupuesto a los 3 mejores ad sets" },
      { timeAgo: "Hace 3 dias", text: "Se detecto oportunidad de expansion a nuevo publico" },
    ],
    scalingProposal: {
      additionalBudget: 6000,
      additionalSales: 20,
      additionalRevenue: 10200,
      projectedRoas: 4.2,
    },
  },
};

export function getPortalData(slug: string): PortalSummary | undefined {
  return portalData[slug];
}

export function getPortalSlugs(): string[] {
  return Object.keys(portalData);
}
