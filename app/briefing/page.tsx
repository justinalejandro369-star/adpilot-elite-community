"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Megaphone,
  TrendingUp,
  Zap,
  Palette,
  Bot,
  BookOpen,
  ExternalLink,
  ArrowLeft,
  Flame,
  AlertTriangle,
  Info,
  Star,
  Lightbulb,
  Award,
} from "lucide-react";
import {
  mockBriefingItems,
  mockWeeklySummary,
  CATEGORY_META,
  type BriefingCategory,
  type BriefingPriority,
  type BriefingItem,
} from "@/lib/data/briefing-mock";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const DAYS_ES = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miercoles",
  "Jueves",
  "Viernes",
  "Sabado",
];
const MONTHS_ES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

function todayInSpanish(): string {
  const d = new Date();
  return `${DAYS_ES[d.getDay()]} ${d.getDate()} de ${MONTHS_ES[d.getMonth()]}, ${d.getFullYear()}`;
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const hours = Math.floor(diff / 3_600_000);
  if (hours < 1) return "Hace menos de 1h";
  if (hours < 24) return `Hace ${hours}h`;
  return `Hace ${Math.floor(hours / 24)}d`;
}

const CATEGORY_ICONS: Record<BriefingCategory, typeof Megaphone> = {
  meta_ads: Megaphone,
  marketing: TrendingUp,
  ghl: Zap,
  content_tools: Palette,
  ai: Bot,
  training: BookOpen,
};

const PRIORITY_STYLES: Record<
  BriefingPriority,
  { bg: string; text: string; label: string; Icon: typeof Flame }
> = {
  urgente: {
    bg: "bg-rose-950",
    text: "text-rose-400",
    label: "URGENTE",
    Icon: Flame,
  },
  importante: {
    bg: "bg-amber-950",
    text: "text-amber-400",
    label: "IMPORTANTE",
    Icon: AlertTriangle,
  },
  informativo: {
    bg: "bg-blue-950",
    text: "text-blue-400",
    label: "INFORMATIVO",
    Icon: Info,
  },
};

const WEEK_DAYS = ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"];

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function PriorityBadge({ priority }: { priority: BriefingPriority }) {
  const s = PRIORITY_STYLES[priority];
  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${s.bg} ${s.text}`}
    >
      <s.Icon className="h-3 w-3" />
      {s.label}
    </span>
  );
}

function NewsCard({ item }: { item: BriefingItem }) {
  return (
    <div className="bg-[#131b2e] rounded-xl shadow-lg p-5 space-y-3 border border-white/[0.04] hover:border-[#e9c176]/20 transition-colors">
      <div className="flex items-center gap-2 flex-wrap">
        <PriorityBadge priority={item.priority} />
        <span className="text-[10px] font-medium text-[#c6c6cd]">
          {timeAgo(item.publishedAt)}
        </span>
      </div>

      <h3 className="text-sm font-bold text-[#dae2fd] leading-snug">
        {item.title}
      </h3>

      <p className="text-sm text-[#c6c6cd] leading-relaxed">{item.summary}</p>

      <p className="text-xs italic text-[#c6c6cd]/80">
        <span className="font-semibold text-[#dae2fd]">Impacto:</span>{" "}
        {item.impact}
      </p>

      {item.action && (
        <p className="text-xs text-[#e9c176]">
          <span className="font-semibold">Accion recomendada:</span>{" "}
          {item.action}
        </p>
      )}

      <div className="flex items-center gap-1 pt-1">
        <ExternalLink className="h-3 w-3 text-[#e9c176]" />
        <a
          href={item.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-medium text-[#e9c176] hover:underline"
        >
          Fuente: {item.source}
        </a>
      </div>
    </div>
  );
}

function CategorySection({
  category,
  items,
}: {
  category: BriefingCategory;
  items: BriefingItem[];
}) {
  const Icon = CATEGORY_ICONS[category];
  const meta = CATEGORY_META[category];

  if (items.length === 0) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-[#222a3d]">
          <Icon className="h-5 w-5 text-[#e9c176]" />
        </div>
        <h2 className="serif-display text-xl font-bold text-[#dae2fd]">
          {meta.label}
        </h2>
        <span className="text-xs font-semibold uppercase tracking-widest text-[#c6c6cd] bg-[#222a3d] px-2 py-0.5 rounded-full">
          {items.length}
        </span>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <NewsCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function BriefingPage() {
  const [activePriorities, setActivePriorities] = useState<
    Set<BriefingPriority>
  >(new Set(["urgente", "importante", "informativo"]));
  const [activeDay, setActiveDay] = useState<number>(
    ((new Date().getDay() + 6) % 7) // Mon=0
  );

  const togglePriority = (p: BriefingPriority) => {
    setActivePriorities((prev) => {
      const next = new Set(prev);
      if (next.has(p)) next.delete(p);
      else next.add(p);
      return next;
    });
  };

  const showAll = () => {
    setActivePriorities(new Set(["urgente", "importante", "informativo"]));
  };

  const filteredItems = useMemo(
    () => mockBriefingItems.filter((i) => activePriorities.has(i.priority)),
    [activePriorities]
  );

  const categories: BriefingCategory[] = [
    "meta_ads",
    "marketing",
    "ghl",
    "content_tools",
    "ai",
    "training",
  ];

  const summary = mockWeeklySummary;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-xs font-medium text-[#e9c176] hover:text-[#e9c176]/80 mb-3"
          >
            <ArrowLeft className="h-3 w-3" />
            Volver al Panel
          </Link>
          <h1 className="serif-display text-4xl md:text-5xl font-bold tracking-tight text-[#dae2fd]">
            Briefing Diario
          </h1>
          <p className="text-[#c6c6cd] mt-2">
            Noticias y actualizaciones del ecosistema de marketing digital
          </p>
          <p className="text-sm text-[#e9c176] font-medium mt-1">
            {todayInSpanish()}
          </p>
        </div>
      </div>

      {/* Priority filter bar */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={showAll}
          className={`text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full transition-colors ${
            activePriorities.size === 3
              ? "bg-[#e9c176] text-[#412d00]"
              : "border border-[#e9c176]/30 text-[#e9c176] hover:bg-[#e9c176]/10"
          }`}
        >
          Todas
        </button>
        <button
          onClick={() => togglePriority("urgente")}
          className={`inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full transition-colors ${
            activePriorities.has("urgente")
              ? "bg-rose-950 text-rose-400 ring-1 ring-rose-400/50"
              : "border border-rose-400/30 text-rose-400/60 hover:bg-rose-950/50"
          }`}
        >
          <Flame className="h-3 w-3" />
          Urgente
        </button>
        <button
          onClick={() => togglePriority("importante")}
          className={`inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full transition-colors ${
            activePriorities.has("importante")
              ? "bg-amber-950 text-amber-400 ring-1 ring-amber-400/50"
              : "border border-amber-400/30 text-amber-400/60 hover:bg-amber-950/50"
          }`}
        >
          <AlertTriangle className="h-3 w-3" />
          Importante
        </button>
        <button
          onClick={() => togglePriority("informativo")}
          className={`inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full transition-colors ${
            activePriorities.has("informativo")
              ? "bg-blue-950 text-blue-400 ring-1 ring-blue-400/50"
              : "border border-blue-400/30 text-blue-400/60 hover:bg-blue-950/50"
          }`}
        >
          <Info className="h-3 w-3" />
          Informativo
        </button>
      </div>

      {/* Main content + sidebar */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* News categories */}
        <div className="flex-1 space-y-10">
          {categories.map((cat) => {
            const items = filteredItems.filter((i) => i.category === cat);
            return (
              <CategorySection key={cat} category={cat} items={items} />
            );
          })}

          {filteredItems.length === 0 && (
            <div className="bg-[#131b2e] rounded-xl p-12 text-center">
              <p className="text-sm text-[#c6c6cd]">
                No hay noticias para los filtros seleccionados.
              </p>
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <aside className="w-full lg:w-80 shrink-0 space-y-6">
          {/* Top 5 */}
          <div className="bg-[#131b2e] rounded-xl shadow-lg p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-[#e9c176]" />
              <h3 className="serif-display text-lg font-bold text-[#dae2fd]">
                Top 5 de la Semana
              </h3>
            </div>
            <ol className="space-y-3">
              {summary.topItems.map((item, i) => (
                <li key={i} className="flex gap-3">
                  <span className="text-lg font-bold text-[#e9c176] leading-tight">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-[#dae2fd] leading-snug">
                      {item.title}
                    </p>
                    <span className="text-[10px] uppercase tracking-widest font-semibold text-[#c6c6cd]">
                      {item.category}
                    </span>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Trend of the week */}
          <div className="bg-[#131b2e] rounded-xl shadow-lg p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-[#e9c176]" />
              <h3 className="serif-display text-lg font-bold text-[#dae2fd]">
                Tendencia de la Semana
              </h3>
            </div>
            <p className="text-sm font-semibold text-[#e9c176]">
              {summary.trendOfWeek.title}
            </p>
            <p className="text-sm text-[#c6c6cd] leading-relaxed">
              {summary.trendOfWeek.description}
            </p>
          </div>

          {/* Featured resource */}
          <div className="bg-[#131b2e] rounded-xl shadow-lg p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-[#e9c176]" />
              <h3 className="serif-display text-lg font-bold text-[#dae2fd]">
                Recurso Destacado
              </h3>
            </div>
            <span className="inline-block text-[10px] uppercase tracking-widest font-semibold text-[#c6c6cd] bg-[#222a3d] px-2 py-0.5 rounded-full">
              {summary.featuredResource.type}
            </span>
            <p className="text-sm font-semibold text-[#dae2fd]">
              {summary.featuredResource.title}
            </p>
            <p className="text-sm text-[#c6c6cd] leading-relaxed">
              {summary.featuredResource.description}
            </p>
          </div>
        </aside>
      </div>

      {/* Weekly archive tabs */}
      <div className="space-y-4">
        <h2 className="serif-display text-xl font-bold text-[#dae2fd]">
          Archivo Semanal
        </h2>
        <div className="flex gap-2">
          {WEEK_DAYS.map((day, i) => (
            <button
              key={day}
              onClick={() => setActiveDay(i)}
              className={`text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-lg transition-colors ${
                activeDay === i
                  ? "bg-[#e9c176] text-[#412d00]"
                  : "bg-[#131b2e] text-[#c6c6cd] hover:bg-[#222a3d]"
              }`}
            >
              {day}
            </button>
          ))}
        </div>
        <div className="bg-[#131b2e] rounded-xl shadow-lg p-6">
          {activeDay === (new Date().getDay() + 6) % 7 ? (
            <p className="text-sm text-[#c6c6cd]">
              Estas viendo el briefing de hoy. Selecciona otro dia para ver
              briefings anteriores.
            </p>
          ) : (
            <p className="text-sm text-[#c6c6cd]">
              El briefing del{" "}
              <span className="font-semibold text-[#dae2fd]">
                {WEEK_DAYS[activeDay]}
              </span>{" "}
              aun no esta disponible. Los briefings se generan diariamente a las
              7:30 AM.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
