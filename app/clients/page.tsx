import type { Metadata } from "next";
import { getClients } from "@/lib/config";
import {
  getMetrics,
  aggregateMetrics,
  getDefaultDateRange,
} from "@/lib/data";
import { formatCurrency } from "@/lib/formatters";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Clientes — AdPilot Elite",
  description: "Listado de todos los clientes de la agencia",
};

export default async function ClientsPage() {
  const clients = getClients();
  const dateRange = getDefaultDateRange();

  const clientData = await Promise.all(
    clients.map(async (client) => {
      const metrics = await getMetrics(client.slug, dateRange);
      const aggregated = aggregateMetrics(metrics);
      return { client, aggregated };
    })
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="serif-display text-4xl md:text-5xl font-bold tracking-tight text-[#dae2fd]">
          Clientes
        </h1>
        <p className="text-[#c6c6cd] mt-2">
          Todos los clientes de la agencia
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {clientData.map(({ client, aggregated }) => {
          const roas = aggregated.avgRoas;
          const status =
            roas >= 3
              ? { label: "Excelente", cls: "bg-emerald-950 text-emerald-400" }
              : roas >= 1.5
                ? { label: "Atencion", cls: "bg-amber-950 text-amber-400" }
                : { label: "Critico", cls: "bg-rose-950 text-rose-400" };

          return (
            <article
              key={client.slug}
              className="bg-[#131b2e] rounded-xl shadow-lg p-6 hover:bg-[#171f33] transition-colors border-l-2 border-[#e9c176]/40"
            >
                <div className="flex items-center justify-between mb-4">
                  <Link href={`/client/${client.slug}`}>
                    <h2 className="serif-display text-2xl font-bold text-[#dae2fd] hover:text-[#e9c176] transition-colors">
                      {client.name}
                    </h2>
                  </Link>
                  <span className="text-xs font-semibold uppercase tracking-widest text-[#c6c6cd] bg-[#222a3d] px-3 py-1 rounded-full">
                    {client.currency}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-widest font-semibold text-[#c6c6cd] mb-1">
                      Inversion
                    </p>
                    <p className="text-lg font-bold text-[#dae2fd]">
                      {formatCurrency(aggregated.totalSpend, client.currency)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest font-semibold text-[#c6c6cd] mb-1">
                      ROAS
                    </p>
                    <p className="serif-display text-lg font-bold text-[#e9c176]">
                      {aggregated.avgRoas.toFixed(2)}x
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest font-semibold text-[#c6c6cd] mb-1">
                      Ventas
                    </p>
                    <p className="text-lg font-bold text-[#dae2fd]">
                      {aggregated.totalPurchases}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest font-semibold text-[#c6c6cd] mb-1">
                      Estado
                    </p>
                    <span
                      className={`text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full ${status.cls}`}
                    >
                      {status.label}
                    </span>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-white/[0.06] flex justify-end">
                  <Link
                    href={`/portal/${client.slug}`}
                    className="text-xs font-semibold text-[#e9c176] hover:text-[#e9c176]/80 transition-colors"
                  >
                    Portal →
                  </Link>
                </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
