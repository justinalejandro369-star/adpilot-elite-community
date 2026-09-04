import { NextRequest, NextResponse } from "next/server";
import {
  getMetrics,
  aggregateMetrics,
  getCampaignSummaries,
  evaluateAlerts,
  getDefaultDateRange,
} from "@/lib/data";
import { getClientBySlug } from "@/lib/config";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "anthropic/claude-3.5-sonnet";

export async function POST(req: NextRequest) {
  if (process.env.ENABLE_AI_COPILOT !== "true") {
    return NextResponse.json(
      { error: "AI Copilot is disabled by configuration" },
      { status: 403 }
    );
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "OPENROUTER_API_KEY no configurada" },
      { status: 503 }
    );
  }

  const body = await req.json().catch(() => null);
  const { message, clientSlug } = (body || {}) as {
    message?: string;
    clientSlug?: string;
  };

  if (!message?.trim() || message.length > 4000) {
    return NextResponse.json(
      { error: "Message must contain between 1 and 4,000 characters" },
      { status: 400 }
    );
  }

  const slug = clientSlug || "northstar";
  const client = getClientBySlug(slug);
  const dateRange = getDefaultDateRange();

  let metricsContext = "";
  try {
    const metrics = await getMetrics(slug, dateRange);
    const agg = aggregateMetrics(metrics);
    const campaigns = getCampaignSummaries(metrics);
    const alerts = evaluateAlerts(metrics, slug);

    const currency = client?.currency ?? "MXN";
    const topCampaigns = campaigns.slice(0, 5);

    metricsContext = `
## Datos reales — ${client?.name ?? slug} (últimos 7 días)
- Gasto total: ${agg.totalSpend.toFixed(2)} ${currency}
- Impresiones: ${agg.totalImpressions.toLocaleString()}
- Clics: ${agg.totalClicks.toLocaleString()}
- CTR promedio: ${agg.avgCtr.toFixed(2)}%
- CPC promedio: ${agg.avgCpc.toFixed(2)} ${currency}
- CPM promedio: ${agg.avgCpm.toFixed(2)} ${currency}
- Compras: ${agg.totalPurchases}
- Valor de compras: ${agg.totalPurchaseValue.toFixed(2)} ${currency}
- ROAS promedio: ${agg.avgRoas.toFixed(2)}x
- Leads: ${agg.totalLeads}

## Top campañas por gasto
${topCampaigns
  .map(
    (c) =>
      `- ${c.campaignName} | Gasto: ${c.spend.toFixed(2)} ${currency} | ROAS: ${c.roas.toFixed(2)}x | CTR: ${c.ctr.toFixed(2)}%`
  )
  .join("\n")}

## Alertas activas (${alerts.length})
${
  alerts.length === 0
    ? "Sin alertas."
    : alerts
        .map((a) => `- [${a.severity.toUpperCase()}] ${a.campaignName}: ${a.message}`)
        .join("\n")
}`;
  } catch {
    metricsContext = "(No se pudieron cargar los datos en este momento)";
  }

  const systemPrompt = `Eres el AI Copilot de AdPilot Elite, un asistente especializado en Meta Ads para una agencia de marketing.
Eres experto en análisis de campañas, optimización de presupuestos, generación de copies publicitarios y estrategia de Meta Ads.
Responde siempre en español, de forma concisa y accionable. Usa formato markdown cuando ayude a la claridad.
Cuando hagas recomendaciones, sé específico con números y porcentajes basados en los datos reales disponibles.

${metricsContext}

El cliente activo en esta conversación es: ${client?.name ?? slug} (moneda: ${client?.currency ?? "MXN"})`;

  const resp = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1024,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
    }),
  });

  if (!resp.ok) {
    console.error("OpenRouter request failed", { status: resp.status });
    return NextResponse.json({ error: "AI provider request failed" }, { status: 502 });
  }

  const data = await resp.json();
  const text = data.choices?.[0]?.message?.content ?? "";

  return NextResponse.json({ response: text });
}
