"use client";

import { useState } from "react";
import { DashboardLineChart } from "@/components/charts/line-chart";
import { DonutChart } from "@/components/charts/donut-chart";
import { CampaignTable } from "@/components/dashboard/campaign-table";
import { cn } from "@/lib/utils";
import type { DailyTrend, CampaignSummary, AlertThresholds } from "@/lib/data/types";

interface ClientDetailChartsProps {
  trends: DailyTrend[];
  campaigns: CampaignSummary[];
  accountDistribution: { name: string; value: number }[];
  currency: "MXN" | "USD";
  thresholds: AlertThresholds;
}

const tabs = [
  { id: "tendencias", label: "Tendencias" },
  { id: "campanas", label: "Campanas" },
  { id: "distribucion", label: "Distribucion" },
] as const;

type TabId = (typeof tabs)[number]["id"];

export function ClientDetailCharts({
  trends,
  campaigns,
  accountDistribution,
  currency,
  thresholds,
}: ClientDetailChartsProps) {
  const [activeTab, setActiveTab] = useState<TabId>("tendencias");

  return (
    <div className="space-y-6">
      {/* Tab bar */}
      <div className="flex gap-1 bg-[#131b2e] rounded-xl p-1 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
              activeTab === tab.id
                ? "bg-[#e9c176] text-[#412d00]"
                : "text-[#c6c6cd] hover:text-[#dae2fd] hover:bg-white/[0.04]"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tendencias */}
      {activeTab === "tendencias" && (
        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-[#131b2e] rounded-xl shadow-lg p-5">
            <h3 className="text-sm font-semibold text-[#c6c6cd] uppercase tracking-widest mb-4">
              Gasto diario
            </h3>
            <DashboardLineChart
              data={trends}
              xKey="date"
              lines={[{ dataKey: "spend", label: "Gasto", color: "#e9c176" }]}
              metricType="spend"
              currency={currency}
              height={250}
            />
          </div>
          <div className="bg-[#131b2e] rounded-xl shadow-lg p-5">
            <h3 className="text-sm font-semibold text-[#c6c6cd] uppercase tracking-widest mb-4">
              ROAS
            </h3>
            <DashboardLineChart
              data={trends}
              xKey="date"
              lines={[{ dataKey: "roas", label: "ROAS", color: "#10b981" }]}
              height={250}
            />
          </div>
          <div className="bg-[#131b2e] rounded-xl shadow-lg p-5">
            <h3 className="text-sm font-semibold text-[#c6c6cd] uppercase tracking-widest mb-4">
              CTR (%)
            </h3>
            <DashboardLineChart
              data={trends}
              xKey="date"
              lines={[{ dataKey: "ctr", label: "CTR", color: "#f59e0b" }]}
              height={250}
            />
          </div>
          <div className="bg-[#131b2e] rounded-xl shadow-lg p-5">
            <h3 className="text-sm font-semibold text-[#c6c6cd] uppercase tracking-widest mb-4">
              CPC
            </h3>
            <DashboardLineChart
              data={trends}
              xKey="date"
              lines={[{ dataKey: "cpc", label: "CPC", color: "#ef4444" }]}
              metricType="cpc"
              currency={currency}
              height={250}
            />
          </div>
        </div>
      )}

      {/* Campanas */}
      {activeTab === "campanas" && (
        <CampaignTable
          campaigns={campaigns}
          currency={currency}
          thresholds={thresholds}
        />
      )}

      {/* Distribucion */}
      {activeTab === "distribucion" && (
        <div className="bg-[#131b2e] rounded-xl shadow-lg p-6">
          <h3 className="serif-display text-lg font-bold text-[#dae2fd] mb-4">
            Gasto por cuenta publicitaria
          </h3>
          <DonutChart
            data={accountDistribution}
            currency={currency}
            height={350}
          />
        </div>
      )}
    </div>
  );
}
