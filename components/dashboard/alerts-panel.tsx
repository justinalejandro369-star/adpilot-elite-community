"use client";

import { AlertTriangle, XCircle, Trophy, ArrowRight } from "lucide-react";
import type { Alert, AlertSeverity } from "@/lib/data/types";

const severityConfig: Record<
  AlertSeverity,
  { icon: typeof AlertTriangle; borderColor: string; iconColor: string; label: string }
> = {
  critical: {
    icon: XCircle,
    borderColor: "border-l-rose-500",
    iconColor: "text-rose-400",
    label: "Critico",
  },
  warning: {
    icon: AlertTriangle,
    borderColor: "border-l-amber-500",
    iconColor: "text-amber-400",
    label: "Atencion",
  },
  winner: {
    icon: Trophy,
    borderColor: "border-l-[#e9c176]",
    iconColor: "text-[#e9c176]",
    label: "Ganador",
  },
};

interface AlertsPanelProps {
  alerts: Alert[];
  maxAlerts?: number;
}

export function AlertsPanel({ alerts, maxAlerts = 10 }: AlertsPanelProps) {
  const displayed = alerts.slice(0, maxAlerts);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="serif-display text-xl font-bold text-[#dae2fd]">
          Centro de Alertas AI
        </h2>
        <span className="text-xs font-semibold uppercase tracking-widest text-[#c6c6cd] bg-[#222a3d] px-3 py-1 rounded-full">
          {alerts.length} activas
        </span>
      </div>

      {displayed.length === 0 ? (
        <div className="bg-[#131b2e] rounded-xl p-6 text-center">
          <p className="text-sm text-[#c6c6cd]">Sin alertas activas</p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayed.map((alert, i) => {
            const config = severityConfig[alert.severity];
            const Icon = config.icon;
            return (
              <div
                key={i}
                className={`bg-[#131b2e] rounded-xl border-l-4 ${config.borderColor} p-4`}
              >
                <div className="flex items-start gap-3">
                  <Icon className={`h-5 w-5 mt-0.5 shrink-0 ${config.iconColor}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-[#c6c6cd]">
                        {alert.clientName}
                      </span>
                      <span
                        className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          alert.severity === "critical"
                            ? "bg-rose-950 text-rose-400"
                            : alert.severity === "warning"
                              ? "bg-amber-950 text-amber-400"
                              : "bg-emerald-950 text-emerald-400"
                        }`}
                      >
                        {config.label}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-[#dae2fd] truncate">
                      {alert.campaignName}
                    </p>
                    <p className="text-xs text-[#c6c6cd] mt-1">
                      {alert.message}
                    </p>
                    <button className="flex items-center gap-1 mt-2 text-xs font-medium text-[#e9c176] hover:text-[#e9c176]/80 transition-colors">
                      Ver detalles
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
