"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  RefreshCw,
  Sparkles,
  Target,
  Users,
  Eye,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

type Objective =
  | "OUTCOME_SALES"
  | "OUTCOME_LEADS"
  | "OUTCOME_AWARENESS"
  | "OUTCOME_ENGAGEMENT";

interface CopyVariation {
  id: number;
  headline: string;
  primaryText: string;
  cta: string;
  framework: "RMBC" | "PAS" | "AIDA";
  angle: "dolor" | "transformacion" | "curiosidad" | "prueba social";
}

/* ------------------------------------------------------------------ */
/* Mock copy data per client niche                                     */
/* ------------------------------------------------------------------ */

function getMockCopies(client: string): CopyVariation[] {
  const base: Record<string, CopyVariation[]> = {
    northstar: [
      {
        id: 1,
        headline: "Tu dinero puede trabajar por ti",
        primaryText:
          "Miles de personas ya generan ingresos pasivos con copy trading. No necesitas experiencia previa: nuestro sistema replica automaticamente las operaciones de traders profesionales. Empieza con solo $500 MXN.",
        cta: "Empieza ahora",
        framework: "PAS",
        angle: "transformacion",
      },
      {
        id: 2,
        headline: "Deja de perder dinero en inversiones que no entiendes",
        primaryText:
          "El 80% de los inversionistas novatos pierden dinero. La razon? No tienen una estrategia. Con nuestro sistema de copy trading, replicas a expertos con resultados comprobados. Sin complicaciones.",
        cta: "Ver resultados",
        framework: "RMBC",
        angle: "dolor",
      },
      {
        id: 3,
        headline: "¿Sabias que puedes ganar mientras duermes?",
        primaryText:
          "El copy trading automatico te permite generar rendimientos las 24 horas. Conecta tu cuenta, elige un trader estrella y deja que el sistema haga el trabajo. Mas de 2,000 usuarios activos.",
        cta: "Descubre como",
        framework: "AIDA",
        angle: "curiosidad",
      },
      {
        id: 4,
        headline: "Carlos gano $15,000 MXN en su primer mes",
        primaryText:
          "\"Nunca habia invertido. Un amigo me recomendo el copy trading y en 30 dias ya tenia ganancias reales.\" — Carlos M., Guadalajara. Unete a la comunidad de traders exitosos.",
        cta: "Unete gratis",
        framework: "PAS",
        angle: "prueba social",
      },
      {
        id: 5,
        headline: "Invierte inteligente, no mas duro",
        primaryText:
          "Olvida las graficas complicadas y las noches sin dormir. Nuestro sistema de copy trading hace todo por ti. Solo elige tu nivel de riesgo y empieza a ver resultados desde la primera semana.",
        cta: "Comenzar ahora",
        framework: "AIDA",
        angle: "transformacion",
      },
    ],
    aurora: [
      {
        id: 1,
        headline: "Transforma tu vida en 90 dias",
        primaryText:
          "Este programa de desarrollo personal esta disenado para hombres que quieren resultados reales. Liderazgo, disciplina y proposito. Mas de 500 graduados exitosos.",
        cta: "Unete al programa",
        framework: "PAS",
        angle: "transformacion",
      },
      {
        id: 2,
        headline: "¿Cansado de sentirte estancado?",
        primaryText:
          "La mayoria de los hombres viven en piloto automatico. Este programa te da las herramientas para tomar el control de tu carrera, relaciones y salud mental. Resultados garantizados.",
        cta: "Empieza hoy",
        framework: "RMBC",
        angle: "dolor",
      },
      {
        id: 3,
        headline: "El secreto que los coaches no te cuentan",
        primaryText:
          "No necesitas otro libro de autoayuda. Necesitas un sistema probado con comunidad real. Descubre por que nuestra plataforma Skool tiene 4.9 estrellas y creciendo.",
        cta: "Descubrir mas",
        framework: "AIDA",
        angle: "curiosidad",
      },
      {
        id: 4,
        headline: "Roberto recupero su confianza en 60 dias",
        primaryText:
          "\"Despues del divorcio pense que todo estaba perdido. Este programa me dio estructura, comunidad y un nuevo proposito.\" — Roberto L., CDMX",
        cta: "Ver testimonios",
        framework: "PAS",
        angle: "prueba social",
      },
      {
        id: 5,
        headline: "Liderazgo real, no teoria",
        primaryText:
          "Ejercicios practicos, mentorias semanales y una comunidad de hombres comprometidos. No es un curso mas: es una transformacion completa de tu mentalidad.",
        cta: "Aplicar ahora",
        framework: "RMBC",
        angle: "transformacion",
      },
    ],
    atlas: [
      {
        id: 1,
        headline: "Controla tu diabetes de forma natural",
        primaryText:
          "Descubre el metodo que ha ayudado a miles de personas a estabilizar sus niveles de azucar sin depender solo de medicamentos. Resultados desde la primera semana.",
        cta: "Conocer el metodo",
        framework: "PAS",
        angle: "transformacion",
      },
      {
        id: 2,
        headline: "¿Tu medico te dijo que no hay solucion?",
        primaryText:
          "La medicina convencional trata los sintomas, no la causa. Este programa natural aborda la raiz del problema con alimentacion, ejercicio y suplementos especificos.",
        cta: "Ver la evidencia",
        framework: "RMBC",
        angle: "dolor",
      },
      {
        id: 3,
        headline: "Lo que la industria farmaceutica no quiere que sepas",
        primaryText:
          "Existe un protocolo natural que esta cambiando la vida de miles de personas con diabetes tipo 2. Sin efectos secundarios, sin dietas imposibles. ¿Quieres saber mas?",
        cta: "Descubrir ahora",
        framework: "AIDA",
        angle: "curiosidad",
      },
      {
        id: 4,
        headline: "Maria bajo su glucosa de 280 a 120 en 3 meses",
        primaryText:
          "\"Mi endocrinologo no lo podia creer. Segui el protocolo al pie de la letra y mis numeros mejoraron drasticamente.\" — Maria G., Buenos Aires",
        cta: "Leer mas historias",
        framework: "PAS",
        angle: "prueba social",
      },
      {
        id: 5,
        headline: "Recupera tu salud, recupera tu vida",
        primaryText:
          "No dejes que la diabetes controle tus dias. Con nuestro programa paso a paso, miles de personas han logrado mejorar su calidad de vida de forma sostenible.",
        cta: "Empezar gratis",
        framework: "AIDA",
        angle: "transformacion",
      },
    ],
  };
  return base[client] || base.northstar;
}

/* ------------------------------------------------------------------ */
/* Constants                                                           */
/* ------------------------------------------------------------------ */

const clients = [
  { slug: "northstar", name: "Northstar" },
  { slug: "aurora", name: "Aurora" },
  { slug: "atlas", name: "Atlas" },
];

const objectives: { value: Objective; label: string }[] = [
  { value: "OUTCOME_SALES", label: "Ventas" },
  { value: "OUTCOME_LEADS", label: "Leads / Generacion de prospectos" },
  { value: "OUTCOME_AWARENESS", label: "Reconocimiento de marca" },
  { value: "OUTCOME_ENGAGEMENT", label: "Interaccion" },
];

const audienceSegments = [
  {
    id: "cold",
    name: "Trafico Frio",
    description: "Intereses amplios relacionados con el nicho del cliente",
  },
  {
    id: "lookalike",
    name: "Lookalike 1%",
    description: "Audiencia similar a compradores existentes",
  },
  {
    id: "retargeting",
    name: "Retargeting",
    description: "Visitantes del sitio web en los ultimos 30 dias",
  },
  {
    id: "custom",
    name: "Custom",
    description: "Define tu propia audiencia personalizada",
  },
];

const countries = [
  { code: "MX", name: "Mexico" },
  { code: "CO", name: "Colombia" },
  { code: "AR", name: "Argentina" },
  { code: "ES", name: "Espana" },
  { code: "US", name: "Estados Unidos" },
];

const steps = [
  { num: 1, label: "Configuracion", icon: Target },
  { num: 2, label: "Copies", icon: Sparkles },
  { num: 3, label: "Audiencias", icon: Users },
  { num: 4, label: "Revision", icon: Eye },
];

const frameworkColors: Record<string, string> = {
  RMBC: "bg-purple-950 text-purple-400",
  PAS: "bg-blue-950 text-blue-400",
  AIDA: "bg-cyan-950 text-cyan-400",
};

const angleColors: Record<string, string> = {
  dolor: "bg-rose-950 text-rose-400",
  transformacion: "bg-emerald-950 text-emerald-400",
  curiosidad: "bg-amber-950 text-amber-400",
  "prueba social": "bg-indigo-950 text-indigo-400",
};

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export default function CampaignWizardPage() {
  return (
    <Suspense fallback={<div className="text-[#c6c6cd] text-center py-16">Cargando...</div>}>
      <CampaignWizardInner />
    </Suspense>
  );
}

function CampaignWizardInner() {
  const searchParams = useSearchParams();
  const initialClient = searchParams.get("client") || "northstar";

  const [step, setStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);

  // Step 1
  const [selectedClient, setSelectedClient] = useState(initialClient);
  const [campaignName, setCampaignName] = useState("");
  const [objective, setObjective] = useState<Objective>("OUTCOME_SALES");
  const [budgetType, setBudgetType] = useState<"CBO" | "ABO">("CBO");
  const [dailyBudget, setDailyBudget] = useState("500");

  // Step 2
  const [copies, setCopies] = useState<CopyVariation[]>([]);
  const [selectedCopies, setSelectedCopies] = useState<Set<number>>(new Set());
  const [generatingCopies, setGeneratingCopies] = useState(false);

  // Step 3
  const [selectedAudiences, setSelectedAudiences] = useState<Set<string>>(
    new Set(["cold"])
  );
  const [ageMin, setAgeMin] = useState(25);
  const [ageMax, setAgeMax] = useState(55);
  const [gender, setGender] = useState<"all" | "male" | "female">("all");
  const [selectedCountries, setSelectedCountries] = useState<Set<string>>(
    new Set(["MX"])
  );
  const [showCustomForm, setShowCustomForm] = useState(false);

  function generateCopies() {
    setGeneratingCopies(true);
    setCopies([]);
    setSelectedCopies(new Set());
    setTimeout(() => {
      const mockCopies = getMockCopies(selectedClient);
      setCopies(mockCopies);
      setSelectedCopies(new Set(mockCopies.map((c) => c.id)));
      setGeneratingCopies(false);
    }, 1500);
  }

  function handleNext() {
    if (step === 2 && copies.length === 0) {
      generateCopies();
      return;
    }
    if (step < 4) setStep(step + 1);
  }

  function handleBack() {
    if (step > 1) setStep(step - 1);
  }

  function toggleCopy(id: number) {
    setSelectedCopies((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAudience(id: string) {
    setSelectedAudiences((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    if (id === "custom") setShowCustomForm(!selectedAudiences.has("custom"));
  }

  function toggleCountry(code: string) {
    setSelectedCountries((prev) => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });
  }

  const clientCurrency =
    clients.find((c) => c.slug === selectedClient)?.slug === "atlas"
      ? "USD"
      : "MXN";

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href={`/client/${selectedClient}/campaigns`}
          className="p-2 text-[#c6c6cd] hover:text-[#dae2fd] transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="serif-display text-4xl md:text-5xl font-bold tracking-tight text-[#dae2fd]">
            Nueva Campana
          </h1>
          <p className="text-[#c6c6cd] mt-1">
            Asistente para crear campanas de Meta Ads
          </p>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center gap-2" data-testid="step-indicator">
        {steps.map((s, i) => {
          const Icon = s.icon;
          const isActive = step === s.num;
          const isComplete = step > s.num;
          return (
            <div key={s.num} className="flex items-center gap-2 flex-1">
              <button
                onClick={() => s.num <= step && setStep(s.num)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors w-full ${
                  isActive
                    ? "bg-[#e9c176] text-[#412d00]"
                    : isComplete
                      ? "bg-emerald-950 text-emerald-400"
                      : "bg-[#222a3d] text-[#c6c6cd]"
                }`}
              >
                {isComplete ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Icon className="h-4 w-4" />
                )}
                <span className="hidden md:inline">{s.label}</span>
                <span className="md:hidden">{s.num}</span>
              </button>
              {i < steps.length - 1 && (
                <div
                  className={`h-px w-4 shrink-0 ${
                    isComplete ? "bg-emerald-400" : "bg-white/10"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Step Content */}
      <div className="bg-[#131b2e] rounded-xl shadow-lg p-6 md:p-8">
        {/* Step 1: Configuracion */}
        {step === 1 && (
          <div className="space-y-6" data-testid="step-1">
            <h2 className="serif-display text-2xl font-bold text-[#dae2fd]">
              Configuracion de Campana
            </h2>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Client */}
              <div>
                <label className="text-xs uppercase tracking-widest font-semibold text-[#c6c6cd] block mb-2">
                  Cliente
                </label>
                <select
                  value={selectedClient}
                  onChange={(e) => setSelectedClient(e.target.value)}
                  className="w-full bg-[#222a3d] border border-white/[0.06] rounded-lg text-[#dae2fd] px-4 py-2.5"
                >
                  {clients.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Campaign Name */}
              <div>
                <label className="text-xs uppercase tracking-widest font-semibold text-[#c6c6cd] block mb-2">
                  Nombre de campana
                </label>
                <input
                  type="text"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  placeholder="Ej: Growth Engine - Marzo 2026"
                  className="w-full bg-[#222a3d] border border-white/[0.06] rounded-lg text-[#dae2fd] px-4 py-2.5 placeholder:text-[#c6c6cd]/40"
                />
              </div>

              {/* Objective */}
              <div>
                <label className="text-xs uppercase tracking-widest font-semibold text-[#c6c6cd] block mb-2">
                  Objetivo
                </label>
                <select
                  value={objective}
                  onChange={(e) => setObjective(e.target.value as Objective)}
                  className="w-full bg-[#222a3d] border border-white/[0.06] rounded-lg text-[#dae2fd] px-4 py-2.5"
                >
                  {objectives.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Daily Budget */}
              <div>
                <label className="text-xs uppercase tracking-widest font-semibold text-[#c6c6cd] block mb-2">
                  Presupuesto diario ({clientCurrency})
                </label>
                <input
                  type="number"
                  value={dailyBudget}
                  onChange={(e) => setDailyBudget(e.target.value)}
                  min="0"
                  step="50"
                  className="w-full bg-[#222a3d] border border-white/[0.06] rounded-lg text-[#dae2fd] px-4 py-2.5"
                />
              </div>
            </div>

            {/* Budget Type */}
            <div>
              <label className="text-xs uppercase tracking-widest font-semibold text-[#c6c6cd] block mb-3">
                Tipo de presupuesto
              </label>
              <div className="flex gap-4">
                {(["CBO", "ABO"] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setBudgetType(type)}
                    className={`px-6 py-3 rounded-lg text-sm font-medium transition-colors ${
                      budgetType === type
                        ? "bg-[#e9c176] text-[#412d00]"
                        : "bg-[#222a3d] text-[#c6c6cd] border border-white/[0.06] hover:border-[#e9c176]/30"
                    }`}
                  >
                    <span className="font-bold">{type}</span>
                    <span className="block text-xs mt-1 opacity-80">
                      {type === "CBO"
                        ? "Campaign Budget Optimization"
                        : "Ad Set Budget Optimization"}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Copies */}
        {step === 2 && (
          <div className="space-y-6" data-testid="step-2">
            <div className="flex items-center justify-between">
              <h2 className="serif-display text-2xl font-bold text-[#dae2fd]">
                Copies Generados por IA
              </h2>
              {copies.length > 0 && (
                <button
                  onClick={generateCopies}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-[#e9c176]/30 text-[#e9c176] rounded-lg hover:bg-[#e9c176]/10 transition-colors"
                >
                  <RefreshCw className="h-4 w-4" />
                  Regenerar
                </button>
              )}
            </div>

            {generatingCopies && (
              <div className="flex flex-col items-center justify-center py-16 space-y-4">
                <div className="relative">
                  <Sparkles className="h-12 w-12 text-[#e9c176] animate-pulse" />
                </div>
                <p className="text-[#c6c6cd] text-lg" data-testid="generating-copies">
                  Generando copies con IA...
                </p>
                <div className="flex gap-1">
                  <span className="h-2 w-2 bg-[#e9c176] rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="h-2 w-2 bg-[#e9c176] rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="h-2 w-2 bg-[#e9c176] rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            )}

            {!generatingCopies && copies.length === 0 && (
              <div className="text-center py-16">
                <Sparkles className="h-12 w-12 text-[#e9c176]/40 mx-auto mb-4" />
                <p className="text-[#c6c6cd]">
                  Haz clic en &quot;Siguiente&quot; para generar copies con IA
                </p>
              </div>
            )}

            {!generatingCopies && copies.length > 0 && (
              <div className="space-y-4">
                <p className="text-sm text-[#c6c6cd]">
                  {selectedCopies.size} de {copies.length} copies seleccionados
                </p>
                {copies.map((copy) => (
                  <div
                    key={copy.id}
                    onClick={() => toggleCopy(copy.id)}
                    className={`p-5 rounded-xl border cursor-pointer transition-all ${
                      selectedCopies.has(copy.id)
                        ? "border-[#e9c176]/50 bg-[#e9c176]/5"
                        : "border-white/[0.06] hover:border-white/10"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-[#dae2fd]">
                            {copy.headline}
                          </h3>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-medium ${frameworkColors[copy.framework]}`}
                          >
                            {copy.framework}
                          </span>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-medium ${angleColors[copy.angle]}`}
                          >
                            {copy.angle}
                          </span>
                        </div>
                        <p className="text-sm text-[#c6c6cd] leading-relaxed">
                          {copy.primaryText}
                        </p>
                        <p className="text-sm text-[#e9c176] font-medium">
                          CTA: {copy.cta}
                        </p>
                      </div>
                      <div
                        className={`shrink-0 h-6 w-6 rounded-md border-2 flex items-center justify-center transition-colors ${
                          selectedCopies.has(copy.id)
                            ? "bg-[#e9c176] border-[#e9c176]"
                            : "border-white/20"
                        }`}
                      >
                        {selectedCopies.has(copy.id) && (
                          <Check className="h-4 w-4 text-[#412d00]" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 3: Audiencias */}
        {step === 3 && (
          <div className="space-y-6" data-testid="step-3">
            <h2 className="serif-display text-2xl font-bold text-[#dae2fd]">
              Segmentacion de Audiencias
            </h2>

            {/* Audience segments */}
            <div className="space-y-3">
              <label className="text-xs uppercase tracking-widest font-semibold text-[#c6c6cd]">
                Segmentos
              </label>
              {audienceSegments.map((seg) => (
                <div key={seg.id}>
                  <div
                    onClick={() => toggleAudience(seg.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center gap-4 ${
                      selectedAudiences.has(seg.id)
                        ? "border-[#e9c176]/50 bg-[#e9c176]/5"
                        : "border-white/[0.06] hover:border-white/10"
                    }`}
                  >
                    <div
                      className={`shrink-0 h-5 w-5 rounded border-2 flex items-center justify-center transition-colors ${
                        selectedAudiences.has(seg.id)
                          ? "bg-[#e9c176] border-[#e9c176]"
                          : "border-white/20"
                      }`}
                    >
                      {selectedAudiences.has(seg.id) && (
                        <Check className="h-3 w-3 text-[#412d00]" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-[#dae2fd]">{seg.name}</p>
                      <p className="text-sm text-[#c6c6cd]">
                        {seg.description}
                      </p>
                    </div>
                  </div>

                  {/* Custom audience form */}
                  {seg.id === "custom" &&
                    showCustomForm &&
                    selectedAudiences.has("custom") && (
                      <div className="ml-9 mt-3 p-4 bg-[#222a3d] rounded-lg space-y-3">
                        <input
                          type="text"
                          placeholder="Nombre de la audiencia"
                          className="w-full bg-[#131b2e] border border-white/[0.06] rounded-lg text-[#dae2fd] px-4 py-2 text-sm placeholder:text-[#c6c6cd]/40"
                        />
                        <textarea
                          placeholder="Describe los intereses y comportamientos..."
                          rows={3}
                          className="w-full bg-[#131b2e] border border-white/[0.06] rounded-lg text-[#dae2fd] px-4 py-2 text-sm placeholder:text-[#c6c6cd]/40 resize-none"
                        />
                      </div>
                    )}
                </div>
              ))}
            </div>

            {/* Demographics */}
            <div className="grid gap-6 md:grid-cols-3">
              {/* Age range */}
              <div>
                <label className="text-xs uppercase tracking-widest font-semibold text-[#c6c6cd] block mb-3">
                  Rango de edad
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={ageMin}
                    onChange={(e) => setAgeMin(Number(e.target.value))}
                    min={18}
                    max={65}
                    className="w-20 bg-[#222a3d] border border-white/[0.06] rounded-lg text-[#dae2fd] px-3 py-2 text-center"
                  />
                  <span className="text-[#c6c6cd]">a</span>
                  <input
                    type="number"
                    value={ageMax}
                    onChange={(e) => setAgeMax(Number(e.target.value))}
                    min={18}
                    max={65}
                    className="w-20 bg-[#222a3d] border border-white/[0.06] rounded-lg text-[#dae2fd] px-3 py-2 text-center"
                  />
                </div>
              </div>

              {/* Gender */}
              <div>
                <label className="text-xs uppercase tracking-widest font-semibold text-[#c6c6cd] block mb-3">
                  Genero
                </label>
                <div className="flex gap-2">
                  {(
                    [
                      { v: "all", l: "Todos" },
                      { v: "male", l: "Hombres" },
                      { v: "female", l: "Mujeres" },
                    ] as const
                  ).map(({ v, l }) => (
                    <button
                      key={v}
                      onClick={() => setGender(v)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        gender === v
                          ? "bg-[#e9c176] text-[#412d00]"
                          : "bg-[#222a3d] text-[#c6c6cd] border border-white/[0.06]"
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              {/* Countries */}
              <div>
                <label className="text-xs uppercase tracking-widest font-semibold text-[#c6c6cd] block mb-3">
                  Paises
                </label>
                <div className="flex flex-wrap gap-2">
                  {countries.map((c) => (
                    <button
                      key={c.code}
                      onClick={() => toggleCountry(c.code)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        selectedCountries.has(c.code)
                          ? "bg-[#e9c176] text-[#412d00]"
                          : "bg-[#222a3d] text-[#c6c6cd] border border-white/[0.06]"
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Revision */}
        {step === 4 && (
          <div className="space-y-6" data-testid="step-4">
            <h2 className="serif-display text-2xl font-bold text-[#dae2fd]">
              Revision y Lanzamiento
            </h2>

            {/* Summary sections */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Config summary */}
              <div className="p-4 bg-[#222a3d] rounded-xl space-y-2">
                <h3 className="text-xs uppercase tracking-widest font-semibold text-[#c6c6cd]">
                  Configuracion
                </h3>
                <div className="space-y-1 text-sm">
                  <p className="text-[#dae2fd]">
                    <span className="text-[#c6c6cd]">Cliente:</span>{" "}
                    {clients.find((c) => c.slug === selectedClient)?.name}
                  </p>
                  <p className="text-[#dae2fd]">
                    <span className="text-[#c6c6cd]">Campana:</span>{" "}
                    {campaignName || "Sin nombre"}
                  </p>
                  <p className="text-[#dae2fd]">
                    <span className="text-[#c6c6cd]">Objetivo:</span>{" "}
                    {objectives.find((o) => o.value === objective)?.label}
                  </p>
                  <p className="text-[#dae2fd]">
                    <span className="text-[#c6c6cd]">Presupuesto:</span> $
                    {dailyBudget} {clientCurrency}/dia ({budgetType})
                  </p>
                </div>
              </div>

              {/* Audience summary */}
              <div className="p-4 bg-[#222a3d] rounded-xl space-y-2">
                <h3 className="text-xs uppercase tracking-widest font-semibold text-[#c6c6cd]">
                  Audiencias
                </h3>
                <div className="space-y-1 text-sm">
                  <p className="text-[#dae2fd]">
                    <span className="text-[#c6c6cd]">Segmentos:</span>{" "}
                    {Array.from(selectedAudiences)
                      .map(
                        (id) =>
                          audienceSegments.find((a) => a.id === id)?.name
                      )
                      .join(", ")}
                  </p>
                  <p className="text-[#dae2fd]">
                    <span className="text-[#c6c6cd]">Edad:</span> {ageMin}-
                    {ageMax} anos
                  </p>
                  <p className="text-[#dae2fd]">
                    <span className="text-[#c6c6cd]">Genero:</span>{" "}
                    {gender === "all"
                      ? "Todos"
                      : gender === "male"
                        ? "Hombres"
                        : "Mujeres"}
                  </p>
                  <p className="text-[#dae2fd]">
                    <span className="text-[#c6c6cd]">Paises:</span>{" "}
                    {Array.from(selectedCountries)
                      .map((code) => countries.find((c) => c.code === code)?.name)
                      .join(", ")}
                  </p>
                </div>
              </div>
            </div>

            {/* Copies summary */}
            <div className="p-4 bg-[#222a3d] rounded-xl space-y-3">
              <h3 className="text-xs uppercase tracking-widest font-semibold text-[#c6c6cd]">
                Copies seleccionados ({selectedCopies.size})
              </h3>
              {copies
                .filter((c) => selectedCopies.has(c.id))
                .map((copy) => (
                  <div
                    key={copy.id}
                    className="p-3 bg-[#131b2e] rounded-lg space-y-1"
                  >
                    <p className="font-medium text-[#dae2fd] text-sm">
                      {copy.headline}
                    </p>
                    <p className="text-xs text-[#c6c6cd] line-clamp-2">
                      {copy.primaryText}
                    </p>
                  </div>
                ))}
            </div>

            {/* Ad Preview */}
            <div className="p-4 bg-[#222a3d] rounded-xl space-y-3">
              <h3 className="text-xs uppercase tracking-widest font-semibold text-[#c6c6cd]">
                Vista previa del anuncio
              </h3>
              {copies.filter((c) => selectedCopies.has(c.id)).length > 0 ? (
                <div className="max-w-sm mx-auto bg-white rounded-xl overflow-hidden shadow-2xl">
                  <div className="p-3 flex items-center gap-2">
                    <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm">
                      {(
                        clients.find((c) => c.slug === selectedClient)?.name ||
                        "J"
                      ).charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-gray-900">
                        {clients.find((c) => c.slug === selectedClient)?.name}{" "}
                        Ads
                      </p>
                      <p className="text-xs text-gray-500">
                        Patrocinado · Meta
                      </p>
                    </div>
                  </div>
                  <div className="px-3 pb-2">
                    <p className="text-sm text-gray-800 leading-relaxed">
                      {
                        copies.find((c) => selectedCopies.has(c.id))
                          ?.primaryText
                      }
                    </p>
                  </div>
                  <div className="h-48 bg-gradient-to-br from-[#e9c176]/30 to-[#131b2e]/30 flex items-center justify-center">
                    <span className="text-gray-400 text-sm">
                      Imagen del anuncio
                    </span>
                  </div>
                  <div className="p-3 border-t border-gray-100 flex items-center justify-between">
                    <p className="font-semibold text-sm text-gray-900">
                      {copies.find((c) => selectedCopies.has(c.id))?.headline}
                    </p>
                    <button className="px-4 py-1.5 bg-blue-500 text-white text-sm font-medium rounded-md">
                      {copies.find((c) => selectedCopies.has(c.id))?.cta}
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-[#c6c6cd] text-sm text-center py-8">
                  Selecciona al menos un copy para ver la vista previa
                </p>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex gap-4 pt-4">
              <button
                onClick={() => setShowSuccess(true)}
                className="px-6 py-3 border border-[#e9c176]/30 text-[#e9c176] rounded-lg font-medium hover:bg-[#e9c176]/10 transition-colors"
              >
                Guardar como Borrador
              </button>
              <button
                onClick={() => setShowSuccess(true)}
                className="px-6 py-3 bg-[#e9c176] text-[#412d00] rounded-lg font-bold hover:bg-[#e9c176]/90 transition-colors"
                data-testid="launch-button"
              >
                Lanzar Campana
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Navigation buttons */}
      {step < 4 && (
        <div className="flex justify-between">
          <button
            onClick={handleBack}
            disabled={step === 1}
            className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-[#c6c6cd] hover:text-[#dae2fd] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="h-4 w-4" />
            Anterior
          </button>
          <button
            onClick={handleNext}
            disabled={generatingCopies}
            className="flex items-center gap-2 px-6 py-3 bg-[#e9c176] text-[#412d00] rounded-lg font-bold hover:bg-[#e9c176]/90 transition-colors disabled:opacity-50"
            data-testid="next-button"
          >
            Siguiente
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Success modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#131b2e] rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 text-center space-y-4">
            <div className="h-16 w-16 rounded-full bg-emerald-950 flex items-center justify-center mx-auto">
              <Check className="h-8 w-8 text-emerald-400" />
            </div>
            <h3 className="serif-display text-2xl font-bold text-[#dae2fd]">
              Campana creada exitosamente
            </h3>
            <p className="text-[#c6c6cd]">
              La campana &quot;{campaignName || "Sin nombre"}&quot; ha sido
              creada para {clients.find((c) => c.slug === selectedClient)?.name}
              .
            </p>
            <div className="flex gap-3 justify-center pt-2">
              <Link
                href={`/client/${selectedClient}/campaigns`}
                className="px-6 py-2.5 bg-[#e9c176] text-[#412d00] rounded-lg font-bold hover:bg-[#e9c176]/90 transition-colors"
              >
                Ver Campanas
              </Link>
              <button
                onClick={() => {
                  setShowSuccess(false);
                  setStep(1);
                  setCampaignName("");
                  setCopies([]);
                  setSelectedCopies(new Set());
                }}
                className="px-6 py-2.5 border border-[#e9c176]/30 text-[#e9c176] rounded-lg font-medium hover:bg-[#e9c176]/10 transition-colors"
              >
                Crear otra
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
