"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Megaphone, CalendarDays, Crosshair, FileBarChart } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { label: "Panel", href: "/", icon: LayoutDashboard },
  { label: "Campanas", href: "/client/northstar", icon: Megaphone },
  { label: "Contenido", href: "/content", icon: CalendarDays },
  { label: "Competencia", href: "/competitors", icon: Crosshair },
  { label: "Reportes", href: "/reports", icon: FileBarChart },
];

export function BottomNav() {
  const pathname = usePathname();

  if (pathname === "/login" || pathname.startsWith("/portal")) return null;

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-[#0f172a]/95 backdrop-blur-md border-t border-white/[0.06]">
      <div className="flex items-center justify-around h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = isActive(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 text-xs font-medium transition-colors",
                active ? "text-[#e9c176]" : "text-[#c6c6cd]"
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
