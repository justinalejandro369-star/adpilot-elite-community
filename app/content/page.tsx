"use client";

import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  BarChart3,
  Clock,
  Loader2,
  CalendarPlus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getContentByDate,
  getOrganicMetrics,
} from "@/lib/data/content-mock";
import type {
  ContentPiece,
  ContentPlatform,
  ContentType,
  ContentStatus,
} from "@/lib/data/content-mock";

// --- Platform Icons (custom SVGs — lucide-react does not include brand icons) ---

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
    </svg>
  );
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a2.995 2.995 0 00-2.112-2.12C19.505 3.546 12 3.546 12 3.546s-7.505 0-9.386.52A2.995 2.995 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a2.995 2.995 0 002.112 2.12c1.881.52 9.386.52 9.386.52s7.505 0 9.386-.52a2.995 2.995 0 002.112-2.12C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

// --- Platform Config ---

const platformConfig: Record<
  ContentPlatform,
  { label: string; color: string; bgColor: string; icon: React.ElementType }
> = {
  instagram: {
    label: "Instagram",
    color: "text-pink-400",
    bgColor: "bg-pink-950",
    icon: InstagramIcon,
  },
  facebook: {
    label: "Facebook",
    color: "text-blue-400",
    bgColor: "bg-blue-950",
    icon: FacebookIcon,
  },
  tiktok: {
    label: "TikTok",
    color: "text-[#dae2fd]",
    bgColor: "bg-[#222a3d]",
    icon: TikTokIcon,
  },
  youtube: {
    label: "YouTube",
    color: "text-red-400",
    bgColor: "bg-red-950",
    icon: YoutubeIcon,
  },
};

const contentTypeLabels: Record<ContentType, string> = {
  reel: "Reel",
  carousel: "Carrusel",
  image: "Imagen",
  video: "Video",
  story: "Story",
};

const statusConfig: Record<
  ContentStatus,
  { label: string; chipClass: string }
> = {
  draft: { label: "Borrador", chipClass: "bg-[#222a3d] text-[#c6c6cd]" },
  approved: {
    label: "Aprobado",
    chipClass: "bg-amber-950 text-amber-400",
  },
  scheduled: {
    label: "Programado",
    chipClass: "bg-blue-950 text-blue-400",
  },
  published: {
    label: "Publicado",
    chipClass: "bg-emerald-950 text-emerald-400",
  },
};

// --- TikTok Icon (not in lucide) ---

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.73a8.19 8.19 0 004.76 1.52V6.8a4.84 4.84 0 01-1-.11z" />
    </svg>
  );
}

// --- Day names ---

const dayNames = ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"];

// --- Helper: get week dates ---

function getWeekDates(offset: number): { dates: string[]; label: string } {
  // Base: week of March 24-30, 2026
  const base = new Date(2026, 2, 24); // March 24 (Monday)
  base.setDate(base.getDate() + offset * 7);

  const dates: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(base);
    d.setDate(d.getDate() + i);
    dates.push(d.toISOString().split("T")[0]);
  }

  const startDay = base.getDate();
  const endDate = new Date(base);
  endDate.setDate(endDate.getDate() + 6);
  const endDay = endDate.getDate();
  const months = [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
  ];
  const month = months[base.getMonth()];
  const year = base.getFullYear();

  return {
    dates,
    label: `Semana del ${startDay}-${endDay} ${month} ${year}`,
  };
}

// --- Content Card ---

function ContentCard({ piece }: { piece: ContentPiece }) {
  const platform = platformConfig[piece.platform];
  const PlatformIcon = platform.icon;
  const status = statusConfig[piece.status];

  return (
    <div className="bg-[#131b2e] rounded-xl shadow-lg p-3 space-y-2 hover:bg-[#222a3d] transition-colors cursor-pointer">
      {/* Platform + type */}
      <div className="flex items-center justify-between gap-2">
        <span
          className={cn(
            "inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full",
            platform.bgColor,
            platform.color
          )}
        >
          <PlatformIcon className="h-3 w-3" />
          {platform.label}
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#222a3d] text-[#e9c176]">
          {contentTypeLabels[piece.contentType]}
        </span>
      </div>

      {/* Title */}
      <p className="text-sm font-medium text-[#dae2fd] line-clamp-2">
        {piece.title}
      </p>

      {/* Time + Status */}
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1 text-xs text-[#c6c6cd]">
          <Clock className="h-3 w-3" />
          {piece.scheduledTime.replace(
            /^(\d{2}):(\d{2})$/,
            (_, h, m) => {
              const hour = parseInt(h);
              const ampm = hour >= 12 ? "PM" : "AM";
              const h12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
              return `${h12}:${m} ${ampm}`;
            }
          )}
        </span>
        <span
          className={cn(
            "text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full",
            status.chipClass
          )}
        >
          {status.label}
        </span>
      </div>
    </div>
  );
}

// --- AI Content Generator ---

const mockGeneratedContent = {
  northstar: {
    title: "5 senales de que el peso mexicano se va a devaluar",
    description:
      "Reel educativo con graficas en tiempo real. Hook: 'Si tienes pesos ahorrados, necesitas ver esto'. Explicar las 5 senales macroeconomicas. CTA: Protege tu dinero con copy trading — link en bio.",
  },
  aurora: {
    title: "El habito #1 que separa a los exitosos del resto",
    description:
      "Video tipo storytelling. Empezar con una historia personal de fracaso. Revelar el habito (disciplina matutina). Mostrar rutina real de Aurora. CTA: Unete a la comunidad en Skool.",
  },
  atlas: {
    title: "Por que el colageno hidrolizado no te esta funcionando",
    description:
      "Reel contrarian. Hook: 'Si tomas colageno y no ves resultados, probablemente cometes este error'. Explicar la importancia de la vitamina C para la absorcion. CTA a pack de suplementos.",
  },
};

function AIContentGenerator() {
  const [client, setClient] = useState<string>("northstar");
  const [platform, setPlatform] = useState<ContentPlatform>("instagram");
  const [contentType, setContentType] = useState<ContentType>("reel");
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState<{
    title: string;
    description: string;
  } | null>(null);

  function handleGenerate() {
    setLoading(true);
    setGenerated(null);
    setTimeout(() => {
      const clientKey = client as keyof typeof mockGeneratedContent;
      setGenerated(
        mockGeneratedContent[clientKey] || mockGeneratedContent.northstar
      );
      setLoading(false);
    }, 1500);
  }

  return (
    <div className="bg-[#131b2e] rounded-xl shadow-lg p-6 space-y-5">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-[#e9c176]/10 flex items-center justify-center">
          <Sparkles className="h-5 w-5 text-[#e9c176]" />
        </div>
        <div>
          <h3 className="serif-display text-xl font-bold text-[#dae2fd]">
            Generar Contenido con IA
          </h3>
          <p className="text-xs text-[#c6c6cd]">
            Describe un tema y genera ideas de contenido automaticamente
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Client */}
        <div>
          <label className="text-xs uppercase tracking-widest font-semibold text-[#c6c6cd] mb-1.5 block">
            Cliente
          </label>
          <select
            value={client}
            onChange={(e) => setClient(e.target.value)}
            className="w-full bg-[#222a3d] border border-white/[0.06] rounded-lg text-[#dae2fd] px-3 py-2 text-sm"
          >
            <option value="northstar">Northstar</option>
            <option value="aurora">Aurora</option>
            <option value="atlas">Atlas</option>
          </select>
        </div>

        {/* Platform */}
        <div>
          <label className="text-xs uppercase tracking-widest font-semibold text-[#c6c6cd] mb-1.5 block">
            Plataforma
          </label>
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value as ContentPlatform)}
            className="w-full bg-[#222a3d] border border-white/[0.06] rounded-lg text-[#dae2fd] px-3 py-2 text-sm"
          >
            <option value="instagram">Instagram</option>
            <option value="facebook">Facebook</option>
            <option value="tiktok">TikTok</option>
            <option value="youtube">YouTube</option>
          </select>
        </div>

        {/* Content Type */}
        <div>
          <label className="text-xs uppercase tracking-widest font-semibold text-[#c6c6cd] mb-1.5 block">
            Tipo de contenido
          </label>
          <select
            value={contentType}
            onChange={(e) => setContentType(e.target.value as ContentType)}
            className="w-full bg-[#222a3d] border border-white/[0.06] rounded-lg text-[#dae2fd] px-3 py-2 text-sm"
          >
            <option value="reel">Reel</option>
            <option value="carousel">Carrusel</option>
            <option value="image">Imagen</option>
            <option value="video">Video</option>
            <option value="story">Story</option>
          </select>
        </div>
      </div>

      {/* Topic */}
      <div>
        <label className="text-xs uppercase tracking-widest font-semibold text-[#c6c6cd] mb-1.5 block">
          Tema / Idea
        </label>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Ej: Tips de inversion para principiantes..."
          className="w-full bg-[#222a3d] border border-white/[0.06] rounded-lg text-[#dae2fd] px-3 py-2 text-sm placeholder:text-[#c6c6cd]/50"
        />
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#e9c176] text-[#412d00] font-semibold rounded-lg hover:bg-[#e9c176]/90 transition-colors disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Generando...
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4" />
            Generar
          </>
        )}
      </button>

      {/* Generated result */}
      {generated && (
        <div className="bg-[#0b1326] rounded-xl p-5 space-y-3">
          <p className="text-xs uppercase tracking-widest font-semibold text-[#e9c176]">
            Contenido Generado
          </p>
          <h4 className="text-lg font-bold text-[#dae2fd]">
            {generated.title}
          </h4>
          <p className="text-sm text-[#c6c6cd] leading-relaxed">
            {generated.description}
          </p>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-[#222a3d] text-[#dae2fd] font-medium text-sm rounded-lg hover:bg-[#222a3d]/80 transition-colors">
            <CalendarPlus className="h-4 w-4" />
            Agregar al Calendario
          </button>
        </div>
      )}
    </div>
  );
}

// --- Main Page ---

export default function ContentPage() {
  const [weekOffset, setWeekOffset] = useState(0);
  const [activeClient, setActiveClient] = useState<string | null>(null);

  const organicMetrics = getOrganicMetrics();
  const { dates, label: weekLabel } = getWeekDates(weekOffset);

  const clientTabs = [
    { slug: null, label: "Todos" },
    { slug: "northstar", label: "Northstar" },
    { slug: "aurora", label: "Aurora" },
    { slug: "atlas", label: "Atlas" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="serif-display text-4xl md:text-5xl font-bold tracking-tight text-[#dae2fd]">
          Calendario de Contenido
        </h1>
        <p className="text-[#c6c6cd] mt-2">
          Planifica, programa y publica contenido organico para todos tus
          clientes
        </p>
      </div>

      {/* Client filter tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {clientTabs.map((tab) => (
          <button
            key={tab.slug ?? "all"}
            onClick={() => setActiveClient(tab.slug)}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
              activeClient === tab.slug
                ? "bg-[#e9c176] text-[#412d00]"
                : "bg-[#222a3d] text-[#c6c6cd] hover:bg-[#222a3d]/80 hover:text-[#dae2fd]"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Week navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setWeekOffset((w) => w - 1)}
          className="flex items-center gap-1 text-sm text-[#c6c6cd] hover:text-[#dae2fd] transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Semana anterior
        </button>
        <h2 className="serif-display text-lg md:text-xl font-bold text-[#dae2fd]">
          {weekLabel}
        </h2>
        <button
          onClick={() => setWeekOffset((w) => w + 1)}
          className="flex items-center gap-1 text-sm text-[#c6c6cd] hover:text-[#dae2fd] transition-colors"
        >
          Semana siguiente
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Main: Calendar + Sidebar */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Calendar grid */}
        <div className="flex-1 overflow-x-auto">
          <div className="grid grid-cols-7 gap-3 min-w-[700px]">
            {/* Day headers */}
            {dates.map((date, i) => {
              const d = new Date(date + "T12:00:00");
              const dayNum = d.getDate();
              const isToday = date === "2026-03-30";
              return (
                <div
                  key={date}
                  className={cn(
                    "text-center pb-2",
                    isToday
                      ? "text-[#e9c176]"
                      : "text-[#c6c6cd]"
                  )}
                >
                  <p className="text-xs uppercase tracking-widest font-semibold">
                    {dayNames[i]}
                  </p>
                  <p
                    className={cn(
                      "text-lg font-bold mt-0.5",
                      isToday ? "text-[#e9c176]" : "text-[#dae2fd]"
                    )}
                  >
                    {dayNum}
                  </p>
                </div>
              );
            })}

            {/* Day columns with content */}
            {dates.map((date) => {
              const dayContent = getContentByDate(
                date,
                activeClient ?? undefined
              );
              return (
                <div
                  key={`col-${date}`}
                  className="space-y-2 min-h-[200px] bg-[#0b1326]/50 rounded-xl p-2"
                >
                  {dayContent.length > 0 ? (
                    dayContent.map((piece) => (
                      <ContentCard key={piece.id} piece={piece} />
                    ))
                  ) : (
                    <div className="flex items-center justify-center h-20 text-xs text-[#c6c6cd]/50">
                      Sin contenido
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right sidebar: Organic metrics */}
        <aside className="w-full lg:w-80 shrink-0 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="h-5 w-5 text-[#e9c176]" />
            <h3 className="serif-display text-lg font-bold text-[#dae2fd]">
              Metricas de Contenido Organico
            </h3>
          </div>

          {organicMetrics.map((metric) => {
            const bestPlatform = platformConfig[metric.bestPost.platform];
            const BestIcon = bestPlatform.icon;
            return (
              <div
                key={metric.clientSlug}
                className="bg-[#131b2e] rounded-xl shadow-lg p-5 space-y-3"
              >
                <h4 className="text-sm font-semibold text-[#e9c176]">
                  {metric.clientName}
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-widest font-semibold text-[#c6c6cd]">
                      Publicaciones
                    </p>
                    <p className="text-2xl font-bold text-[#dae2fd]">
                      {metric.postsThisWeek}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest font-semibold text-[#c6c6cd]">
                      Alcance total
                    </p>
                    <p className="text-2xl font-bold text-[#dae2fd]">
                      {(metric.totalReach / 1000).toFixed(1)}K
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs uppercase tracking-widest font-semibold text-[#c6c6cd]">
                      Engagement rate
                    </p>
                    <p className="text-2xl font-bold text-[#dae2fd]">
                      {metric.engagementRate}%
                    </p>
                  </div>
                </div>
                <div className="pt-2">
                  <p className="text-xs uppercase tracking-widest font-semibold text-[#c6c6cd] mb-1">
                    Mejor publicacion
                  </p>
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full",
                        bestPlatform.bgColor,
                        bestPlatform.color
                      )}
                    >
                      <BestIcon className="h-3 w-3" />
                    </span>
                    <p className="text-xs text-[#dae2fd] font-medium line-clamp-1">
                      {metric.bestPost.title}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </aside>
      </div>

      {/* AI Content Generator */}
      <section>
        <AIContentGenerator />
      </section>
    </div>
  );
}
