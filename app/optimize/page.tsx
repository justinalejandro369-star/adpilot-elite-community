"use client";

import { useState } from "react";
import {
  ArrowRight,
  Check,
  X,
  Pencil,
  Clock,
  TrendingUp,
  Pause,
  Repeat,
  Zap,
  AlertTriangle,
  Shield,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

type RecType = "reasignar" | "pausar" | "escalar";
type RiskLevel = "bajo" | "medio" | "alto";
type Status = "pendiente" | "aprobado" | "rechazado";

interface Recommendation {
  id: string;
  type: RecType;
  title: string;
  from: string;
  to: string;
  impact: string;
  risk: RiskLevel;
  confidence: number;
  status: Status;
  autoExecuteHours: number;
}

interface DecisionLogEntry {
  date: string;
  action: string;
  impactReal: string;
  status: "ejecutada" | "pendiente" | "rechazada";
}

/* ------------------------------------------------------------------ */
/* Mock data                                                           */
/* ------------------------------------------------------------------ */

const initialRecommendations: Recommendation[] = [
  {
    id: "rec-1",
    type: "reasignar",
    title: "Reasignar presupuesto de CP3 a Growth Engine",
    from: "CP3 (ROAS 0.8x, $600/dia)",
    to: "Growth Engine (ROAS 4.1x, $800/dia)",
    impact: "+$1,200/semana en ventas estimadas",
    risk: "bajo",
    confidence: 92,
    status: "pendiente",
    autoExecuteHours: 24,
  },
  {
    id: "rec-2",
    type: "pausar",
    title: "Pausar campana SKOOL de Aurora",
    from: "SKOOL (CTR 0.2%, CPA $380 MXN)",
    to: "Liberar $300/dia para redistribucion",
    impact: "Ahorro de $2,100/semana sin perder conversiones",
    risk: "bajo",
    confidence: 88,
    status: "pendiente",
    autoExecuteHours: 24,
  },
  {
    id: "rec-3",
    type: "escalar",
    title: "Escalar Northstar Copy Trading al 150%",
    from: "Northstar Copy Trading ($500/dia, ROAS 2.8x)",
    to: "Northstar Copy Trading ($750/dia, ROAS 2.8x estimado)",
    impact: "+$875/semana en ventas estimadas",
    risk: "medio",
    confidence: 76,
    status: "pendiente",
    autoExecuteHours: 48,
  },
  {
    id: "rec-4",
    type: "reasignar",
    title: "Mover presupuesto de Relaciones a Wellness Core",
    from: "Relaciones (ROAS 1.2x, $200/dia)",
    to: "Wellness Core (ROAS 3.8x, $400/dia)",
    impact: "+$600/semana en ventas estimadas",
    risk: "bajo",
    confidence: 85,
    status: "pendiente",
    autoExecuteHours: 24,
  },
  {
    id: "rec-5",
    type: "escalar",
    title: "Aumentar presupuesto de aurora cruz oficial",
    from: "aurora cruz oficial ($400/dia, ROAS 2.5x)",
    to: "aurora cruz oficial ($600/dia, ROAS 2.3x estimado)",
    impact: "+$460/semana en ventas estimadas",
    risk: "alto",
    confidence: 62,
    status: "pendiente",
    autoExecuteHours: 72,
  },
];

const decisionLog: DecisionLogEntry[] = [
  {
    date: "2026-03-28",
    action: "Escalar Growth Engine de $500 a $800/dia",
    impactReal: "+$980/semana (vs +$900 estimado)",
    status: "ejecutada",
  },
  {
    date: "2026-03-26",
    action: "Pausar campana CP2 de Northstar",
    impactReal: "Ahorro de $1,400/semana",
    status: "ejecutada",
  },
  {
    date: "2026-03-25",
    action: "Reasignar $150/dia de WHA a Market Studio",
    impactReal: "+$320/semana (vs +$400 estimado)",
    status: "ejecutada",
  },
  {
    date: "2026-03-23",
    action: "Escalar SKOOL de Aurora al 120%",
    impactReal: "-$180/semana (ROAS cayo a 0.9x)",
    status: "ejecutada",
  },
  {
    date: "2026-03-22",
    action: "Pausar Remarketing Productos de Atlas",
    impactReal: "Sin impacto negativo en conversiones",
    status: "ejecutada",
  },
  {
    date: "2026-03-20",
    action: "Reasignar $100/dia de CP5 a Northstar Disponible 2",
    impactReal: "+$250/semana",
    status: "rechazada",
  },
];

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const typeConfig: Record<
  RecType,
  { label: string; color: string; icon: typeof Repeat }
> = {
  reasignar: { label: "Reasignar", color: "bg-blue-950 text-blue-400", icon: Repeat },
  pausar: { label: "Pausar", color: "bg-rose-950 text-rose-400", icon: Pause },
  escalar: { label: "Escalar", color: "bg-emerald-950 text-emerald-400", icon: TrendingUp },
};

const riskConfig: Record<RiskLevel, { label: string; color: string; icon: typeof Shield }> = {
  bajo: { label: "Bajo", color: "text-emerald-400", icon: Shield },
  medio: { label: "Medio", color: "text-amber-400", icon: AlertTriangle },
  alto: { label: "Alto", color: "text-rose-400", icon: AlertTriangle },
};

const statusConfig: Record<Status, { label: string; color: string }> = {
  pendiente: { label: "Pendiente", color: "bg-amber-950 text-amber-400" },
  aprobado: { label: "Aprobado", color: "bg-emerald-950 text-emerald-400" },
  rechazado: { label: "Rechazado", color: "bg-rose-950 text-rose-400" },
};

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export default function OptimizePage() {
  const [recommendations, setRecommendations] = useState(initialRecommendations);

  function updateStatus(id: string, status: Status) {
    setRecommendations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
  }

  const approved = recommendations.filter((r) => r.status === "aprobado").length;
  const pending = recommendations.filter((r) => r.status === "pendiente").length;
  const rejected = recommendations.filter((r) => r.status === "rechazado").length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="serif-display text-4xl md:text-5xl font-bold tracking-tight text-[#dae2fd]">
          Optimizador de Presupuesto
        </h1>
        <p className="text-[#c6c6cd] mt-2">
          Recomendaciones inteligentes basadas en rendimiento de los ultimos 14
          dias
        </p>
      </div>

      {/* Recommendation cards */}
      <div className="space-y-4" data-testid="recommendation-cards">
        {recommendations.map((rec) => {
          const typeConf = typeConfig[rec.type];
          const riskConf = riskConfig[rec.risk];
          const statusConf = statusConfig[rec.status];
          const TypeIcon = typeConf.icon;
          const RiskIcon = riskConf.icon;

          return (
            <div
              key={rec.id}
              className={`bg-[#131b2e] rounded-xl shadow-lg p-6 transition-opacity ${
                rec.status === "rechazado" ? "opacity-50" : ""
              }`}
              data-testid="recommendation-card"
            >
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                {/* Left: Info */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${typeConf.color}`}
                    >
                      <TypeIcon className="h-3 w-3" />
                      {typeConf.label}
                    </span>
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusConf.color}`}
                    >
                      {statusConf.label}
                    </span>
                  </div>

                  <h3 className="font-bold text-[#dae2fd] text-lg">
                    {rec.title}
                  </h3>

                  <div className="flex items-center gap-2 text-sm text-[#c6c6cd]">
                    <span>{rec.from}</span>
                    <ArrowRight className="h-4 w-4 text-[#e9c176]" />
                    <span>{rec.to}</span>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-1.5">
                      <Zap className="h-4 w-4 text-[#e9c176]" />
                      <span className="text-[#e9c176] font-medium">
                        {rec.impact}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <RiskIcon className="h-4 w-4" />
                      <span className={riskConf.color}>
                        Riesgo: {riskConf.label}
                      </span>
                    </div>
                  </div>

                  {/* Confidence bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-[#c6c6cd]">Confianza</span>
                      <span className="text-[#dae2fd] font-medium">
                        {rec.confidence}%
                      </span>
                    </div>
                    <div className="h-1.5 bg-[#222a3d] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#e9c176] rounded-full transition-all"
                        style={{ width: `${rec.confidence}%` }}
                      />
                    </div>
                  </div>

                  {rec.status === "pendiente" && (
                    <div className="flex items-center gap-1.5 text-xs text-[#c6c6cd]">
                      <Clock className="h-3.5 w-3.5" />
                      Se ejecuta automaticamente en {rec.autoExecuteHours}h si
                      no se rechaza
                    </div>
                  )}
                </div>

                {/* Right: Actions */}
                <div className="flex md:flex-col gap-2 shrink-0">
                  <button
                    onClick={() => updateStatus(rec.id, "aprobado")}
                    disabled={rec.status !== "pendiente"}
                    className="flex items-center gap-1.5 px-4 py-2 bg-emerald-950 text-emerald-400 rounded-lg text-sm font-medium hover:bg-emerald-900 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    data-testid="approve-button"
                  >
                    <Check className="h-4 w-4" />
                    Aprobar
                  </button>
                  <button
                    onClick={() => {}}
                    disabled={rec.status !== "pendiente"}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#e9c176]/10 text-[#e9c176] rounded-lg text-sm font-medium hover:bg-[#e9c176]/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Pencil className="h-4 w-4" />
                    Modificar
                  </button>
                  <button
                    onClick={() => updateStatus(rec.id, "rechazado")}
                    disabled={rec.status !== "pendiente"}
                    className="flex items-center gap-1.5 px-4 py-2 border border-white/[0.06] text-[#c6c6cd] rounded-lg text-sm font-medium hover:bg-white/[0.04] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    data-testid="reject-button"
                  >
                    <X className="h-4 w-4" />
                    Rechazar
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary bar */}
      <div className="bg-[#131b2e] rounded-xl shadow-lg p-4 flex flex-wrap gap-6 md:gap-10">
        <div>
          <span className="text-xs uppercase tracking-widest font-semibold text-[#c6c6cd]">
            Total recomendaciones
          </span>
          <p className="serif-display text-xl font-bold text-[#dae2fd]">
            {recommendations.length}
          </p>
        </div>
        <div>
          <span className="text-xs uppercase tracking-widest font-semibold text-[#c6c6cd]">
            Impacto estimado total
          </span>
          <p className="serif-display text-xl font-bold text-[#e9c176]">
            +$5,135/semana
          </p>
        </div>
        <div>
          <span className="text-xs uppercase tracking-widest font-semibold text-[#c6c6cd]">
            Aprobadas
          </span>
          <p className="serif-display text-xl font-bold text-emerald-400">
            {approved}
          </p>
        </div>
        <div>
          <span className="text-xs uppercase tracking-widest font-semibold text-[#c6c6cd]">
            Pendientes
          </span>
          <p className="serif-display text-xl font-bold text-amber-400">
            {pending}
          </p>
        </div>
        <div>
          <span className="text-xs uppercase tracking-widest font-semibold text-[#c6c6cd]">
            Rechazadas
          </span>
          <p className="serif-display text-xl font-bold text-rose-400">
            {rejected}
          </p>
        </div>
      </div>

      {/* Decision Log */}
      <div>
        <h2 className="serif-display text-2xl font-bold text-[#dae2fd] mb-4">
          Historial de Decisiones
        </h2>
        <div className="bg-[#131b2e] rounded-xl shadow-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left px-4 py-3 text-xs uppercase tracking-widest font-semibold text-[#c6c6cd]">
                  Fecha
                </th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-widest font-semibold text-[#c6c6cd]">
                  Accion
                </th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-widest font-semibold text-[#c6c6cd]">
                  Impacto Real
                </th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-widest font-semibold text-[#c6c6cd]">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {decisionLog.map((entry, i) => (
                <tr key={i} className="hover:bg-white/[0.02]">
                  <td className="px-4 py-3 text-[#dae2fd] whitespace-nowrap">
                    {entry.date}
                  </td>
                  <td className="px-4 py-3 text-[#dae2fd]">{entry.action}</td>
                  <td className="px-4 py-3 text-[#c6c6cd]">
                    {entry.impactReal}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        entry.status === "ejecutada"
                          ? "bg-emerald-950 text-emerald-400"
                          : entry.status === "rechazada"
                            ? "bg-rose-950 text-rose-400"
                            : "bg-amber-950 text-amber-400"
                      }`}
                    >
                      {entry.status.charAt(0).toUpperCase() +
                        entry.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
