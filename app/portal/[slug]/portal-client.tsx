"use client";

import { useState } from "react";
import { TrendingUp, TrendingDown, Clock, Sparkles } from "lucide-react";
import type { PortalSummary } from "@/lib/data/attribution-mock";

export function PortalClient({ data }: { data: PortalSummary }) {
  const [showScaling, setShowScaling] = useState(false);

  const currencySymbol = data.currency === "USD" ? "US$" : "$";

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center">
        <h1 className="serif-display text-4xl md:text-5xl font-bold tracking-tight text-[#dae2fd]">
          {data.clientName}
        </h1>
        <p className="text-[#c6c6cd] mt-2 text-lg">Tu Resumen de Inversion</p>
        <p className="text-xs uppercase tracking-widest font-semibold text-[#c6c6cd] mt-1">
          Ultimos 7 dias
        </p>
      </div>

      {/* The ONE Number */}
      <div className="bg-[#131b2e] rounded-xl shadow-lg p-8 text-center">
        <p className="text-[#c6c6cd] text-lg mb-2">
          Por cada $1 que inviertes
        </p>
        <div className="flex items-center justify-center gap-3">
          <span className="serif-display text-7xl font-bold text-[#e9c176]">
            {currencySymbol}
            {data.roasMultiplier.toFixed(2)}
          </span>
          {data.improving ? (
            <TrendingUp className="h-8 w-8 text-emerald-400" />
          ) : (
            <TrendingDown className="h-8 w-8 text-rose-400" />
          )}
        </div>
        <p className="text-[#c6c6cd] mt-3">
          generas{" "}
          <span className="text-[#dae2fd] font-semibold">
            {currencySymbol}
            {data.roasMultiplier.toFixed(2)}
          </span>
        </p>
        <p className="text-sm text-[#c6c6cd]/70 mt-2">
          Esto significa que tu inversion se multiplica{" "}
          {data.roasMultiplier.toFixed(1)} veces
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-[#131b2e] rounded-xl shadow-lg p-6 text-center">
          <p className="text-xs uppercase tracking-widest font-semibold text-[#c6c6cd] mb-2">
            Invertiste
          </p>
          <p className="serif-display text-3xl font-bold text-[#dae2fd]">
            {currencySymbol}
            {data.invested.toLocaleString("es-MX")}
          </p>
        </div>
        <div className="bg-[#131b2e] rounded-xl shadow-lg p-6 text-center">
          <p className="text-xs uppercase tracking-widest font-semibold text-[#c6c6cd] mb-2">
            Generaste
          </p>
          <p className="serif-display text-3xl font-bold text-[#e9c176]">
            {currencySymbol}
            {data.generated.toLocaleString("es-MX")}
          </p>
        </div>
        <div className="bg-[#131b2e] rounded-xl shadow-lg p-6 text-center">
          <p className="text-xs uppercase tracking-widest font-semibold text-[#c6c6cd] mb-2">
            Ganancia Neta
          </p>
          <p className="serif-display text-3xl font-bold text-emerald-400">
            {currencySymbol}
            {data.netProfit.toLocaleString("es-MX")}
          </p>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="bg-[#131b2e] rounded-xl shadow-lg p-6">
        <h2 className="serif-display text-xl font-bold text-[#dae2fd] mb-4">
          Actividad Reciente
        </h2>
        <div className="space-y-4">
          {data.activities.map((activity, i) => (
            <div key={i} className="flex gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <Clock className="h-4 w-4 text-[#e9c176]" />
              </div>
              <div>
                <span className="text-xs font-semibold text-[#e9c176]">
                  {activity.timeAgo}:
                </span>{" "}
                <span className="text-sm text-[#dae2fd]">{activity.text}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quiero Invertir Mas */}
      <div className="text-center">
        <button
          data-testid="invest-more-button"
          onClick={() => setShowScaling(!showScaling)}
          className="inline-flex items-center gap-2 px-8 py-4 bg-[#e9c176] text-[#412d00] font-bold text-lg rounded-xl hover:bg-[#e9c176]/90 transition-colors shadow-lg"
        >
          <Sparkles className="h-5 w-5" />
          Quiero Invertir Mas
        </button>
      </div>

      {/* Scaling Proposal */}
      {showScaling && (
        <div className="bg-[#131b2e] rounded-xl shadow-lg p-8 border border-[#e9c176]/30">
          <h3 className="serif-display text-2xl font-bold text-[#e9c176] text-center mb-4">
            Propuesta de Escalamiento
          </h3>
          <p className="text-[#c6c6cd] text-center mb-6">
            Si aumentas tu presupuesto un 20% ({currencySymbol}
            {data.scalingProposal.additionalBudget.toLocaleString("es-MX")}{" "}
            adicionales), estimamos:
          </p>

          <div className="grid gap-4 md:grid-cols-3 mb-6">
            <div className="text-center">
              <p className="text-xs uppercase tracking-widest font-semibold text-[#c6c6cd] mb-1">
                Ventas adicionales
              </p>
              <p className="serif-display text-2xl font-bold text-[#dae2fd]">
                ~{data.scalingProposal.additionalSales}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs uppercase tracking-widest font-semibold text-[#c6c6cd] mb-1">
                Revenue adicional estimado
              </p>
              <p className="serif-display text-2xl font-bold text-[#e9c176]">
                ~{currencySymbol}
                {data.scalingProposal.additionalRevenue.toLocaleString("es-MX")}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs uppercase tracking-widest font-semibold text-[#c6c6cd] mb-1">
                ROAS proyectado
              </p>
              <p className="serif-display text-2xl font-bold text-emerald-400">
                {data.scalingProposal.projectedRoas.toFixed(1)}x
              </p>
            </div>
          </div>

          <div className="text-center">
            <button className="px-8 py-3 bg-[#e9c176] text-[#412d00] font-bold rounded-xl hover:bg-[#e9c176]/90 transition-colors">
              Aprobar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
