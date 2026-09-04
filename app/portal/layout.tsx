export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0b1326]">
      {/* Simple header for portal */}
      <header className="bg-[#0f172a]/95 backdrop-blur-md border-b border-white/[0.06]">
        <div className="flex items-center justify-center h-14 px-4">
          <span className="serif-display text-xl font-bold italic text-[#e9c176]">
            AdPilot Elite
          </span>
        </div>
      </header>
      <main className="px-4 py-6 md:px-8 lg:px-12">{children}</main>
    </div>
  );
}
