"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Credenciales incorrectas");
      setLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0b1326]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="serif-display text-4xl font-bold italic text-[#e9c176] mb-2">
            AdPilot Elite
          </h1>
          <p className="text-sm text-[#c6c6cd]">
            Sistema de automatizacion de Meta Ads
          </p>
        </div>

        <div className="bg-[#131b2e] rounded-xl shadow-2xl p-8">
          <h2 className="serif-display text-2xl font-bold text-[#dae2fd] mb-6 text-center">
            Iniciar Sesion
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs uppercase tracking-widest font-semibold text-[#c6c6cd] mb-2 block">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-[#222a3d] border border-white/[0.06] rounded-lg text-[#dae2fd] placeholder-[#c6c6cd]/50 focus:outline-none focus:ring-2 focus:ring-[#e9c176]/50 transition-colors"
                placeholder="tu@email.com"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest font-semibold text-[#c6c6cd] mb-2 block">
                Contrasena
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-[#222a3d] border border-white/[0.06] rounded-lg text-[#dae2fd] placeholder-[#c6c6cd]/50 focus:outline-none focus:ring-2 focus:ring-[#e9c176]/50 transition-colors"
                placeholder="Tu contrasena"
              />
            </div>
            {error && (
              <div className="bg-rose-950 border border-rose-500/20 rounded-lg p-3 text-center">
                <p className="text-sm text-rose-400">{error}</p>
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#e9c176] text-[#412d00] font-semibold rounded-lg hover:bg-[#e9c176]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Ingresando..." : "Ingresar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
