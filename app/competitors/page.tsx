import type { Metadata } from "next";
import { getClients } from "@/lib/config";
import {
  getCompetitorAds,
  getCompetitorInsights,
  getFormatDistribution,
} from "@/lib/data/competitors-mock";
import type { CompetitorAd, CompetitorInsight } from "@/lib/data/types";
import {
  Image,
  Video,
  Layers,
  TrendingUp,
  TrendingDown,
  Minus,
  Lightbulb,
  Eye,
  BarChart3,
  Calendar,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Inteligencia Competitiva — AdPilot Elite",
  description: "Monitoreo de anuncios y estrategias de competidores",
};

const creativeTypeConfig = {
  image: { label: "Imagen", icon: Image, chipClass: "bg-blue-950 text-blue-400" },
  video: { label: "Video", icon: Video, chipClass: "bg-amber-950 text-amber-400" },
  carousel: { label: "Carrusel", icon: Layers, chipClass: "bg-purple-950 text-purple-400" },
};

const trendIcon = {
  up: TrendingUp,
  down: TrendingDown,
  stable: Minus,
};

function WeeklySummaryCard({
  insight,
  clientName,
}: {
  insight: CompetitorInsight;
  clientName: string;
}) {
  const topFormat = insight.topFormats[0];
  return (
    <div className="bg-[#131b2e] rounded-xl shadow-lg p-5 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[#e9c176]">{clientName}</h3>
        <span className="text-xs text-[#c6c6cd]">Semana {insight.week}</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-xs uppercase tracking-widest font-semibold text-[#c6c6cd]">
            Nuevos Ads
          </p>
          <p className="text-2xl font-bold text-[#dae2fd]">{insight.newAdsCount}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest font-semibold text-[#c6c6cd]">
            Detenidos
          </p>
          <p className="text-2xl font-bold text-[#dae2fd]">{insight.stoppedAdsCount}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest font-semibold text-[#c6c6cd]">
            Top Formato
          </p>
          <p className="text-sm font-medium text-[#dae2fd] capitalize">{topFormat?.format}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest font-semibold text-[#c6c6cd]">
            Vida Promedio
          </p>
          <p className="text-sm font-medium text-[#dae2fd]">{insight.averageAdLifespan} dias</p>
        </div>
      </div>
      <p className="text-xs text-[#c6c6cd] line-clamp-2">{insight.aiSummary}</p>
    </div>
  );
}

function CompetitorAdCard({ ad }: { ad: CompetitorAd }) {
  const typeConfig = creativeTypeConfig[ad.creativeType];
  const TypeIcon = typeConfig.icon;

  return (
    <div className="bg-[#131b2e] rounded-xl shadow-lg p-5 space-y-3 hover:bg-[#222a3d] transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-[#dae2fd]">{ad.competitorName}</span>
          <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#222a3d] text-[#e9c176]">
            {ad.clientSlug}
          </span>
        </div>
        <span className={`inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${typeConfig.chipClass}`}>
          <TypeIcon className="h-3 w-3" />
          {typeConfig.label}
        </span>
      </div>

      {/* Headline + body */}
      <div>
        <p className="text-sm font-medium text-[#dae2fd]">{ad.headline}</p>
        <p className="text-xs text-[#c6c6cd] mt-1 line-clamp-2">{ad.bodyText}</p>
      </div>

      {/* Hook analysis */}
      <div className="flex items-start gap-2">
        <Eye className="h-3.5 w-3.5 text-[#e9c176] mt-0.5 shrink-0" />
        <p className="text-xs text-[#c6c6cd]">{ad.hookAnalysis}</p>
      </div>

      {/* Angle + meta */}
      <div className="flex items-center flex-wrap gap-2">
        <span className="bg-[#222a3d] text-[#c6c6cd] rounded-full px-2.5 py-1 text-xs">
          {ad.angleDetected}
        </span>
        <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${ad.isStillActive ? "bg-emerald-950 text-emerald-400" : "bg-rose-950 text-rose-400"}`}>
          {ad.isStillActive ? "Activo" : "Detenido"}
        </span>
        <span className="text-[10px] font-medium text-[#c6c6cd] uppercase">{ad.platform}</span>
      </div>

      {/* Date */}
      <div className="flex items-center gap-1 text-xs text-[#c6c6cd]">
        <Calendar className="h-3 w-3" />
        <span>Desde {ad.startedRunning}</span>
      </div>
    </div>
  );
}

function FormatBar({
  format,
  count,
  maxCount,
}: {
  format: string;
  count: number;
  maxCount: number;
}) {
  const pct = maxCount > 0 ? (count / maxCount) * 100 : 0;
  const colorMap: Record<string, string> = {
    video: "bg-amber-500",
    image: "bg-blue-500",
    carousel: "bg-purple-500",
  };
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-[#dae2fd] capitalize font-medium">{format}</span>
        <span className="text-[#c6c6cd]">{count} ads</span>
      </div>
      <div className="h-2 bg-[#222a3d] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${colorMap[format] || "bg-[#e9c176]"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default async function CompetitorsPage() {
  const clients = getClients();
  const allAds = getCompetitorAds();
  const allInsights = getCompetitorInsights();
  const formatDist = getFormatDistribution();
  const maxFormat = formatDist[0]?.count || 1;

  // Collect all recommendations
  const allRecommendations = allInsights.flatMap((insight) => {
    const clientName = clients.find((c) => c.slug === insight.clientSlug)?.name || insight.clientSlug;
    return insight.recommendations.map((rec) => ({
      clientSlug: insight.clientSlug,
      clientName,
      recommendation: rec,
    }));
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="serif-display text-4xl md:text-5xl font-bold tracking-tight text-[#dae2fd]">
          Inteligencia Competitiva
        </h1>
        <p className="text-[#c6c6cd] mt-2">
          Monitoreo de anuncios y estrategias de competidores — semana del 24 Mar 2026
        </p>
      </div>

      {/* Weekly Summary Cards */}
      <section>
        <h2 className="serif-display text-2xl font-bold text-[#dae2fd] mb-4">
          Resumen Semanal
        </h2>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          {allInsights.map((insight) => {
            const client = clients.find((c) => c.slug === insight.clientSlug);
            return (
              <WeeklySummaryCard
                key={insight.clientSlug}
                insight={insight}
                clientName={client?.name || insight.clientSlug}
              />
            );
          })}
        </div>
      </section>

      {/* Main content + sidebar */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Recent Competitor Ads */}
        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="serif-display text-2xl font-bold text-[#dae2fd]">
              Anuncios Recientes
            </h2>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#c6c6cd] bg-[#222a3d] px-3 py-1 rounded-full">
              {allAds.length} detectados
            </span>
          </div>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            {allAds.map((ad) => (
              <CompetitorAdCard key={ad.id} ad={ad} />
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="w-full lg:w-80 shrink-0 space-y-6">
          {/* Trending Formats */}
          <div className="bg-[#131b2e] rounded-xl shadow-lg p-5 space-y-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-[#e9c176]" />
              <h3 className="serif-display text-lg font-bold text-[#dae2fd]">
                Formatos Dominantes
              </h3>
            </div>
            <div className="space-y-3">
              {formatDist.map((f) => (
                <FormatBar
                  key={f.format}
                  format={f.format}
                  count={f.count}
                  maxCount={maxFormat}
                />
              ))}
            </div>
          </div>

          {/* Format trends per client */}
          {allInsights.map((insight) => {
            const clientName =
              clients.find((c) => c.slug === insight.clientSlug)?.name || insight.clientSlug;
            return (
              <div
                key={insight.clientSlug}
                className="bg-[#131b2e] rounded-xl shadow-lg p-5 space-y-3"
              >
                <h4 className="text-sm font-semibold text-[#e9c176]">{clientName}</h4>
                <div className="space-y-2">
                  {insight.topFormats.map((f) => {
                    const TrendIcon = trendIcon[f.trend];
                    const trendColor =
                      f.trend === "up"
                        ? "text-emerald-400"
                        : f.trend === "down"
                          ? "text-rose-400"
                          : "text-[#c6c6cd]";
                    return (
                      <div
                        key={f.format}
                        className="flex items-center justify-between text-xs"
                      >
                        <span className="text-[#dae2fd] capitalize">{f.format}</span>
                        <div className="flex items-center gap-1">
                          <span className="text-[#c6c6cd]">{f.count}</span>
                          <TrendIcon className={`h-3 w-3 ${trendColor}`} />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="pt-2">
                  <p className="text-xs uppercase tracking-widest font-semibold text-[#c6c6cd] mb-1">
                    Top Angulos
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {insight.topAngles.map((angle) => (
                      <span
                        key={angle}
                        className="bg-[#222a3d] text-[#c6c6cd] rounded-full px-2.5 py-1 text-[10px]"
                      >
                        {angle}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}

          {/* AI Recommendations */}
          <div className="bg-[#131b2e] rounded-xl shadow-lg p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-[#e9c176]" />
              <h3 className="serif-display text-lg font-bold text-[#dae2fd]">
                Recomendaciones AI
              </h3>
            </div>
            <div className="space-y-3">
              {allRecommendations.map((rec, i) => (
                <div key={i} className="space-y-1">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#e9c176]">
                    {rec.clientName}
                  </span>
                  <p className="text-xs text-[#c6c6cd]">{rec.recommendation}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
