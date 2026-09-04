"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Bell, LogOut, Menu, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Panel General", href: "/" },
  { label: "Clientes", href: "/clients" },
  { label: "Campañas", href: "/client/northstar" },
  { label: "Contenido", href: "/content" },
  { label: "Competencia", href: "/competitors" },
  { label: "Reportes", href: "/reports" },
];

export function TopNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Don't show nav on login page or portal pages
  if (pathname === "/login" || pathname.startsWith("/portal")) return null;

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <header className="sticky top-0 z-50 bg-[#0f172a]/95 backdrop-blur-md border-b border-white/[0.06]">
      <div className="flex items-center justify-between h-16 px-4 md:px-8 lg:px-12">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="serif-display text-xl font-bold italic text-[#e9c176]">
            AdPilot Elite
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1 ml-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-lg transition-colors relative",
                isActive(item.href)
                  ? "text-[#e9c176]"
                  : "text-[#c6c6cd] hover:text-[#dae2fd] hover:bg-white/[0.04]"
              )}
            >
              {item.label}
              {isActive(item.href) && (
                <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#e9c176] rounded-full" />
              )}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Ask AI button */}
          <Link
            href="/copilot"
            className="hidden md:flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-[#e9c176] border border-[#e9c176]/30 rounded-lg hover:bg-[#e9c176]/10 transition-colors"
          >
            <Sparkles className="h-4 w-4" />
            Ask AI
          </Link>

          {/* Notifications */}
          <button className="relative p-2 text-[#c6c6cd] hover:text-[#dae2fd] transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-[#e9c176] rounded-full" />
          </button>

          {/* User */}
          {session?.user && (
            <div className="hidden md:flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-[#222a3d] flex items-center justify-center text-sm font-medium text-[#dae2fd]">
                {(session.user.name || session.user.email || "U").charAt(0).toUpperCase()}
              </div>
              <button
                onClick={() => signOut()}
                className="p-2 text-[#c6c6cd] hover:text-[#dae2fd] transition-colors"
                title="Salir"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-[#c6c6cd]"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#0f172a] border-t border-white/[0.06] pb-4">
          <nav className="flex flex-col px-4 pt-2 gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                  isActive(item.href)
                    ? "text-[#e9c176] bg-[#e9c176]/10"
                    : "text-[#c6c6cd] hover:text-[#dae2fd] hover:bg-white/[0.04]"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
