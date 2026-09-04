"use client";

import { useState } from "react";
import {
  getAttributionData,
  type AttributionData,
  type FunnelStep,
  type PlatformRevenue,
  type AttributionPath,
} from "@/lib/data/attribution-mock";
import { DashboardLineChart } from "@/components/charts/line-chart";
import { ChevronRight } from "lucide-react";

const clients = [
  { slug: "northstar", name: "Northstar" },
  { slug: "aurora", name: "Aurora" },
  { slug: "atlas", name: "Atlas" },
];

export default function AttributionPage() {
  const [activeClient, setActiveClient] = useState("northstar");
  const data: AttributionData = getAttributionData(activeClient);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="serif-display text-4xl md:text-5xl font-bold tracking-tight text-[#dae2fd]">
          Atribucion y Rentabilidad
        </h1>
        <p className="text-[#c6c6cd] mt-2">
          Vision completa del recorrido del cliente — desde el anuncio hasta la
          venta
        </p>
      </div>

      {/* Client Tabs */}
      <div className="flex gap-2">
        {clients.map((c) => (
          <button
            key={c.slug}
            onClick={() => setActiveClient(c.slug)}
            className={`px-5 py-2 text-sm font-semibold rounded-lg transition-colors ${
              activeClient === c.slug
                ? "bg-[#e9c176] text-[#412d00]"
                : "border border-[#e9c176]/30 text-[#e9c176] hover:bg-[#e9c176]/10"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Funnel Visualization */}
      <FunnelVisualization funnel={data.funnel} />

      {/* Platform Revenue Cards */}
      <div>
        <h2 className="serif-display text-2xl font-bold text-[#dae2fd] mb-4">
          Revenue por Plataforma
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {data.platforms.map((p) => (
            <PlatformCard key={p.platform} platform={p} />
          ))}
        </div>
      </div>

      {/* ROAS Real Calculator */}
      <RoasRealCard
        roasReal={data.roasReal}
        roasMeta={data.roasMeta}
        platforms={data.platforms}
      />

      {/* Multi-Touch Attribution Table */}
      <div>
        <h2 className="serif-display text-2xl font-bold text-[#dae2fd] mb-4">
          Atribucion Multi-Toque
        </h2>
        <AttributionTable paths={data.attributionPaths} />
      </div>

      {/* Daily Attribution Timeline */}
      <div>
        <h2 className="serif-display text-2xl font-bold text-[#dae2fd] mb-4">
          Linea de Tiempo Diaria
        </h2>
        <div className="bg-[#131b2e] rounded-xl shadow-lg p-6">
          <DashboardLineChart
            data={data.dailyAttribution}
            xKey="date"
            lines={[
              { dataKey: "metaSpend", label: "Gasto Meta Ads", color: "#e9c176" },
              { dataKey: "totalRevenue", label: "Revenue Total", color: "#10b981" },
            ]}
            height={320}
          />
        </div>
      </div>
    </div>
  );
}

/* ---------- Sub-components ---------- */

function FunnelVisualization({ funnel }: { funnel: FunnelStep[] }) {
  return (
    <div>
      <h2 className="serif-display text-2xl font-bold text-[#dae2fd] mb-4">
        Embudo de Conversion
      </h2>
      <div className="bg-[#131b2e] rounded-xl shadow-lg p-6 overflow-x-auto">
        <div className="flex items-center gap-0 min-w-[900px]">
          {funnel.map((step, i) => {
            // Color gradient from blue to gold
            const t = i / (funnel.length - 1);
            const bg =
              t < 0.5
                ? `rgba(59, 130, 246, ${0.25 - t * 0.3})`
                : `rgba(233, 193, 118, ${0.1 + (t - 0.5) * 0.4})`;
            const borderColor =
              t < 0.5 ? "border-blue-500/30" : "border-[#e9c176]/40";

            const dropOff =
              i > 0 ? funnel[i - 1].percentage - step.percentage : 0;

            return (
              <div key={step.label} className="flex items-center">
                {/* Drop-off indicator */}
                {i > 0 && (
                  <div className="flex flex-col items-center mx-1">
                    <ChevronRight className="h-4 w-4 text-[#c6c6cd]/50" />
                    <span className="text-[10px] font-semibold text-rose-400 mt-0.5">
                      -{dropOff}%
                    </span>
                  </div>
                )}
                {/* Step card */}
                <div
                  className={`flex flex-col items-center px-4 py-3 rounded-lg border ${borderColor} min-w-[100px]`}
                  style={{ backgroundColor: bg }}
                >
                  <span className="text-[11px] uppercase tracking-widest font-semibold text-[#c6c6cd] text-center leading-tight">
                    {step.label}
                  </span>
                  <span className="serif-display text-lg font-bold text-[#dae2fd] mt-1">
                    {step.absoluteCount.toLocaleString("es-MX")}
                  </span>
                  <span
                    className={`text-xs font-bold mt-0.5 ${
                      step.percentage >= 50
                        ? "text-blue-400"
                        : step.percentage >= 20
                          ? "text-amber-400"
                          : "text-[#e9c176]"
                    }`}
                  >
                    {step.percentage}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function PlatformCard({ platform }: { platform: PlatformRevenue }) {
  const iconColors: Record<string, string> = {
    Hotmart: "bg-orange-900/60 text-orange-400",
    Skool: "bg-violet-900/60 text-violet-400",
    "Go High Level": "bg-cyan-900/60 text-cyan-400",
  };

  return (
    <div className="bg-[#131b2e] rounded-xl shadow-lg p-6 border-l-2 border-[#e9c176]/40">
      <div className="flex items-center gap-3 mb-4">
        <div
          className={`h-10 w-10 rounded-lg flex items-center justify-center font-bold text-lg ${iconColors[platform.platform] || "bg-[#222a3d] text-[#dae2fd]"}`}
        >
          {platform.icon}
        </div>
        <h3 className="text-lg font-bold text-[#dae2fd]">{platform.platform}</h3>
      </div>

      <div className="space-y-2">
        <div>
          <p className="text-xs uppercase tracking-widest font-semibold text-[#c6c6cd]">
            Revenue
          </p>
          <p className="serif-display text-2xl font-bold text-[#e9c176]">
            ${platform.revenue.toLocaleString("es-MX")}
          </p>
        </div>

        {platform.transactions !== undefined && (
          <div>
            <p className="text-xs uppercase tracking-widest font-semibold text-[#c6c6cd]">
              Transacciones
            </p>
            <p className="text-lg font-bold text-[#dae2fd]">{platform.transactions}</p>
          </div>
        )}

        {platform.topProduct && (
          <div>
            <p className="text-xs uppercase tracking-widest font-semibold text-[#c6c6cd]">
              Producto mas vendido
            </p>
            <p className="text-sm text-[#dae2fd]">{platform.topProduct}</p>
          </div>
        )}

        {platform.newMembers !== undefined && (
          <div>
            <p className="text-xs uppercase tracking-widest font-semibold text-[#c6c6cd]">
              Nuevos miembros
            </p>
            <p className="text-lg font-bold text-[#dae2fd]">{platform.newMembers}</p>
          </div>
        )}

        {platform.community && (
          <div>
            <p className="text-xs uppercase tracking-widest font-semibold text-[#c6c6cd]">
              Comunidad
            </p>
            <p className="text-sm text-[#dae2fd]">{platform.community}</p>
          </div>
        )}

        {platform.pipelineLeads !== undefined && (
          <div>
            <p className="text-xs uppercase tracking-widest font-semibold text-[#c6c6cd]">
              Leads en pipeline
            </p>
            <p className="text-lg font-bold text-[#dae2fd]">{platform.pipelineLeads}</p>
          </div>
        )}

        {platform.closedOpportunities !== undefined && (
          <div>
            <p className="text-xs uppercase tracking-widest font-semibold text-[#c6c6cd]">
              Oportunidades cerradas
            </p>
            <p className="text-lg font-bold text-[#dae2fd]">
              {platform.closedOpportunities}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function RoasRealCard({
  roasReal,
  roasMeta,
  platforms,
}: {
  roasReal: number;
  roasMeta: number;
  platforms: PlatformRevenue[];
}) {
  const diff = roasReal - roasMeta;
  const totalRevenue = platforms.reduce((s, p) => s + p.revenue, 0);

  return (
    <div className="bg-[#131b2e] rounded-xl shadow-lg p-8 border border-[#e9c176]/20">
      <div className="text-center space-y-4">
        <h2 className="serif-display text-3xl font-bold text-[#e9c176]">
          ROAS Real
        </h2>

        <p className="text-xs uppercase tracking-widest font-semibold text-[#c6c6cd]">
          (Ventas Hotmart + Skool + GHL) / Gasto Meta Ads
        </p>

        <div className="flex items-center justify-center gap-8 flex-wrap">
          <div className="text-center">
            <p className="serif-display text-6xl font-bold text-[#e9c176]">
              {roasReal.toFixed(2)}x
            </p>
            <p className="text-xs uppercase tracking-widest font-semibold text-[#c6c6cd] mt-1">
              ROAS Real
            </p>
          </div>
          <div className="text-[#c6c6cd] text-2xl">vs</div>
          <div className="text-center">
            <p className="serif-display text-4xl font-bold text-[#dae2fd]">
              {roasMeta.toFixed(2)}x
            </p>
            <p className="text-xs uppercase tracking-widest font-semibold text-[#c6c6cd] mt-1">
              Meta Ads Reportado
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 bg-emerald-950/60 px-4 py-2 rounded-full">
          <span className="text-emerald-400 font-semibold">
            +{diff.toFixed(2)}x atribucion adicional detectada
          </span>
        </div>

        <p className="text-sm text-[#c6c6cd]">
          Revenue total cross-platform: $
          {totalRevenue.toLocaleString("es-MX")}
        </p>

        <p className="text-xs text-[#c6c6cd]/60">
          Datos de demostración
        </p>
      </div>
    </div>
  );
}

function AttributionTable({ paths }: { paths: AttributionPath[] }) {
  return (
    <div className="bg-[#131b2e] rounded-xl shadow-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/[0.06]">
            <th className="text-left px-4 py-3 text-xs uppercase tracking-widest font-semibold text-[#c6c6cd]">
              Secuencia de Contacto
            </th>
            <th className="text-left px-4 py-3 text-xs uppercase tracking-widest font-semibold text-[#c6c6cd]">
              Conversiones
            </th>
            <th className="text-left px-4 py-3 text-xs uppercase tracking-widest font-semibold text-[#c6c6cd]">
              % del Total
            </th>
            <th className="text-left px-4 py-3 text-xs uppercase tracking-widest font-semibold text-[#c6c6cd]">
              Valor Promedio
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.04]">
          {paths.map((path) => (
            <tr
              key={path.sequence}
              className="hover:bg-[#222a3d] transition-colors"
            >
              <td className="px-4 py-3 text-[#dae2fd] font-medium">
                {path.sequence}
              </td>
              <td className="px-4 py-3 tabular-nums text-[#dae2fd]">
                {path.conversions}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-[#222a3d] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#e9c176] rounded-full"
                      style={{ width: `${path.percentOfTotal}%` }}
                    />
                  </div>
                  <span className="tabular-nums text-[#c6c6cd]">
                    {path.percentOfTotal}%
                  </span>
                </div>
              </td>
              <td className="px-4 py-3 tabular-nums text-[#e9c176] font-semibold">
                ${path.averageValue}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
