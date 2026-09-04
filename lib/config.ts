import fs from "fs";
import path from "path";
import type { ClientConfig, AlertThresholds, CompetitorConfig } from "./data/types";

function normalizeThresholds(
  raw: Record<string, number>,
  currency: string
): AlertThresholds {
  const suffix = currency.toLowerCase();
  return {
    ctrMin: raw.ctr_min ?? 0.5,
    cpcMax: raw[`cpc_max_${suffix}`] ?? raw.cpc_max ?? 5,
    frequencyMax: raw.frequency_max ?? 4,
    roasWinner: raw.roas_winner ?? 3.0,
    spendZeroClicksMin: raw[`spend_zero_clicks_min`] ?? 400,
  };
}

function loadClients(): ClientConfig[] {
  const configuredFile =
    process.env.CLIENT_CONFIG_FILE || "clients.example.json";
  if (path.basename(configuredFile) !== configuredFile) {
    throw new Error("CLIENT_CONFIG_FILE must be a filename inside config/");
  }
  const configPath = path.join(process.cwd(), "config", configuredFile);
  const raw = JSON.parse(fs.readFileSync(configPath, "utf-8"));

  if (!Array.isArray(raw.clients) || raw.clients.length === 0) {
    throw new Error(`No clients configured in config/${configuredFile}`);
  }

  return raw.clients.map(
    (c: {
      name: string;
      slug: string;
      spreadsheet_id: string;
      sheet_name: string;
      currency: string;
      timezone: string;
      accounts: { id: string; name: string }[];
      alert_thresholds: Record<string, number>;
      competitors?: { name: string; facebook_page_id: string; niche: string; notes: string }[];
    }) => ({
      name: c.name,
      slug: c.slug,
      spreadsheetId: c.spreadsheet_id,
      sheetName: c.sheet_name,
      currency: c.currency as "MXN" | "USD",
      timezone: c.timezone,
      accounts: c.accounts,
      alertThresholds: normalizeThresholds(c.alert_thresholds, c.currency),
      competitors: (c.competitors || []).map(
        (comp): CompetitorConfig => ({
          name: comp.name,
          facebookPageId: comp.facebook_page_id,
          niche: comp.niche,
          notes: comp.notes,
        })
      ),
    })
  );
}

let _clients: ClientConfig[] | null = null;

function getClientsInternal(): ClientConfig[] {
  if (!_clients) {
    _clients = loadClients();
  }
  return _clients;
}

export function getClients(): ClientConfig[] {
  return getClientsInternal();
}

export function getClientBySlug(slug: string): ClientConfig | undefined {
  return getClientsInternal().find((c) => c.slug === slug);
}

export function getClientSlugs(): string[] {
  return getClientsInternal().map((c) => c.slug);
}
