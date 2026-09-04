export function formatCurrency(
  value: number,
  currency: "MXN" | "USD"
): string {
  return new Intl.NumberFormat(currency === "MXN" ? "es-MX" : "en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("es-MX").format(value);
}

export function formatPercent(value: number): string {
  return `${value.toFixed(2)}%`;
}

export function formatCompact(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toFixed(0);
}

export function formatMetric(
  metric: string,
  value: number,
  currency: "MXN" | "USD" = "MXN"
): string {
  switch (metric) {
    case "spend":
    case "purchaseValue":
    case "costPerPurchase":
    case "cpc":
    case "cpm":
      return formatCurrency(value, currency);
    case "ctr":
    case "frequency":
      return value.toFixed(2);
    case "roas":
      return `${value.toFixed(2)}x`;
    case "impressions":
    case "reach":
    case "clicks":
    case "linkClicks":
    case "purchases":
    case "leads":
    case "landingPageViews":
    case "addToCart":
      return formatNumber(value);
    default:
      return value.toFixed(2);
  }
}

export function formatTrend(current: number, previous: number): string {
  if (previous === 0) return "+100%";
  const change = ((current - previous) / previous) * 100;
  const sign = change >= 0 ? "+" : "";
  return `${sign}${change.toFixed(1)}%`;
}

export function getTrendDirection(
  current: number,
  previous: number,
  metric: string
): "up" | "down" | "neutral" {
  if (current === previous) return "neutral";
  const isHigherBetter = !["cpc", "cpm", "frequency", "costPerPurchase"].includes(metric);
  const isUp = current > previous;
  if (isHigherBetter) return isUp ? "up" : "down";
  return isUp ? "down" : "up";
}
