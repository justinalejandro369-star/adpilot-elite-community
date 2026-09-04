import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Configuracion — AdPilot Elite",
  description: "Ajustes del sistema y preferencias",
};

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="serif-display text-4xl md:text-5xl font-bold tracking-tight text-[#dae2fd]">
          Configuracion
        </h1>
        <p className="text-[#c6c6cd] mt-2">
          Ajustes del sistema y preferencias
        </p>
      </div>

      <div className="bg-[#131b2e] rounded-xl shadow-lg p-8">
        <p className="text-[#c6c6cd] text-center">
          Configuracion del sistema — proximamente
        </p>
      </div>
    </div>
  );
}
