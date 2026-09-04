import { google } from "googleapis";
import type { CampaignDayMetric, DataProvider, DateRange } from "./types";
import { getClientBySlug } from "../config";

function getAuth() {
  const keyBase64 = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  if (!keyBase64) throw new Error("GOOGLE_SERVICE_ACCOUNT_KEY not set");
  const credentials = JSON.parse(Buffer.from(keyBase64, "base64").toString());
  return new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });
}

// Google Sheets stores dates as Excel serial numbers (e.g. 46112 = 2026-03-31).
// If the rowKey starts with YYYY-MM-DD, extract from there (most reliable).
// Otherwise fall back to Excel serial conversion.
function resolveDate(rowKey: string, raw: string): string {
  if (/^\d{4}-\d{2}-\d{2}_/.test(rowKey)) return rowKey.split("_")[0];
  const serial = Number(raw);
  if (!isNaN(serial) && serial > 40000) {
    return new Date(Date.UTC(1899, 11, 30) + serial * 86400000)
      .toISOString()
      .split("T")[0];
  }
  return raw;
}

function parseRow(row: string[]): CampaignDayMetric {
  const rowKey = row[0] || "";
  return {
    rowKey,
    dateStart: resolveDate(rowKey, row[1] || ""),
    dateStop: resolveDate(rowKey, row[2] || ""),
    accountName: row[3] || "",
    accountId: row[4] || "",
    campaignName: row[5] || "",
    campaignId: row[6] || "",
    objective: row[7] || "",
    spend: parseFloat(row[8]) || 0,
    impressions: parseInt(row[9]) || 0,
    reach: parseInt(row[10]) || 0,
    clicks: parseInt(row[11]) || 0,
    linkClicks: parseInt(row[12]) || 0,
    ctr: parseFloat(row[13]) || 0,
    cpc: parseFloat(row[14]) || 0,
    cpm: parseFloat(row[15]) || 0,
    frequency: parseFloat(row[16]) || 0,
    purchases: parseInt(row[17]) || 0,
    purchaseValue: parseFloat(row[18]) || 0,
    costPerPurchase: parseFloat(row[19]) || 0,
    roas: parseFloat(row[20]) || 0,
    landingPageViews: parseInt(row[21]) || 0,
    addToCart: parseInt(row[22]) || 0,
    leads: parseInt(row[23]) || 0,
  };
}

export const sheetsProvider: DataProvider = {
  async getMetrics(
    clientSlug: string,
    dateRange: DateRange
  ): Promise<CampaignDayMetric[]> {
    const client = getClientBySlug(clientSlug);
    if (!client) return [];

    const auth = getAuth();
    const sheets = google.sheets({ version: "v4", auth });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: client.spreadsheetId,
      range: `${client.sheetName}!A2:X`,
    });

    const rows = response.data.values || [];
    const fromStr = dateRange.from.toISOString().split("T")[0];
    const toStr = dateRange.to.toISOString().split("T")[0];

    return rows
      .map((row) => parseRow(row as string[]))
      .filter((m) => m.dateStart >= fromStr && m.dateStart <= toStr);
  },
};
