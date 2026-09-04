import { NextRequest, NextResponse } from "next/server";
import { getClientBySlug } from "@/lib/config";
import {
  getMetrics,
  aggregateMetrics,
  getDailyTrends,
  getCampaignSummaries,
  evaluateAlerts,
} from "@/lib/data";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const slug = searchParams.get("client");
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  if (!slug) {
    return NextResponse.json({ error: "client param required" }, { status: 400 });
  }

  const client = getClientBySlug(slug);
  if (!client) {
    return NextResponse.json({ error: "client not found" }, { status: 404 });
  }

  const dateRange = {
    from: from ? new Date(from) : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    to: to ? new Date(to) : new Date(),
  };

  const metrics = await getMetrics(slug, dateRange);

  return NextResponse.json({
    client: {
      name: client.name,
      slug: client.slug,
      currency: client.currency,
    },
    aggregated: aggregateMetrics(metrics),
    trends: getDailyTrends(metrics),
    campaigns: getCampaignSummaries(metrics),
    alerts: evaluateAlerts(metrics, slug),
  });
}
