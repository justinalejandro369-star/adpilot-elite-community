"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Send,
  Sparkles,
  BarChart3,
  PenTool,
  DollarSign,
  Crosshair,
  Plus,
  Bot,
  User,
  ChevronDown,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: Date;
}

/* ------------------------------------------------------------------ */
/* Clients                                                             */
/* ------------------------------------------------------------------ */

const CLIENTS = [
  { slug: "northstar", name: "Northstar" },
  { slug: "aurora", name: "Aurora" },
  { slug: "atlas", name: "Atlas" },
];

/* ------------------------------------------------------------------ */
/* Quick actions                                                       */
/* ------------------------------------------------------------------ */

const quickActions = [
  {
    icon: BarChart3,
    label: "Analizar rendimiento de hoy",
    message: "Analiza el rendimiento de las campañas de los últimos 7 días",
  },
  {
    icon: PenTool,
    label: "Generar copies para campaña",
    message: "Genera 3 copies nuevos para la mejor campaña activa usando frameworks PAS, AIDA y RMBC",
  },
  {
    icon: DollarSign,
    label: "Sugerir optimización de presupuesto",
    message: "Sugiere optimizaciones de presupuesto basadas en el rendimiento actual de las campañas",
  },
  {
    icon: Crosshair,
    label: "Resumen de competencia semanal",
    message: "Dame un resumen de la actividad de la competencia y oportunidades de diferenciación",
  },
];

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export default function CopilotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "ai",
      content:
        "Hola Operator! Soy tu copilot de AdPilot. Puedo ayudarte a analizar métricas reales, generar copies, optimizar presupuestos y más. ¿En qué te puedo ayudar?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedClient, setSelectedClient] = useState("northstar");
  const [clientOpen, setClientOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messageSequence = useRef(0);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  async function sendMessage(text: string) {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: `user-${messageSequence.current++}`,
      role: "user",
      content: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text.trim(), clientSlug: selectedClient }),
      });

      const data = await res.json();
      const aiMsg: Message = {
        id: `ai-${messageSequence.current++}`,
        role: "ai",
        content: res.ok
          ? data.response
          : `Error: ${data.error ?? "No se pudo obtener respuesta"}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${messageSequence.current++}`,
          role: "ai",
          content: "Error de conexión. Verifica que ANTHROPIC_API_KEY esté configurada en Vercel.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    sendMessage(input);
  }

  function handleQuickAction(message: string) {
    sendMessage(message);
    inputRef.current?.focus();
  }

  const selectedClientName = CLIENTS.find((c) => c.slug === selectedClient)?.name ?? "Northstar";

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-8rem)]">
      {/* Chat area */}
      <div className="flex-1 flex flex-col bg-[#131b2e] rounded-xl shadow-lg overflow-hidden">
        {/* Chat header */}
        <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-[#e9c176]/20 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-[#e9c176]" />
            </div>
            <div>
              <h1 className="serif-display text-xl font-bold text-[#dae2fd]">
                AI Copilot
              </h1>
              <p className="text-xs text-[#c6c6cd]">
                Asistente inteligente para Meta Ads
              </p>
            </div>
          </div>

          {/* Client selector */}
          <div className="relative">
            <button
              onClick={() => setClientOpen((v) => !v)}
              className="flex items-center gap-2 px-3 py-2 bg-[#222a3d] rounded-lg text-sm text-[#dae2fd] border border-white/[0.06] hover:border-[#e9c176]/30 transition-colors"
            >
              <span>{selectedClientName}</span>
              <ChevronDown className="h-3 w-3 text-[#c6c6cd]" />
            </button>
            {clientOpen && (
              <div className="absolute right-0 mt-1 w-36 bg-[#222a3d] border border-white/[0.06] rounded-lg shadow-lg z-10 overflow-hidden">
                {CLIENTS.map((c) => (
                  <button
                    key={c.slug}
                    onClick={() => { setSelectedClient(c.slug); setClientOpen(false); }}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                      selectedClient === c.slug
                        ? "text-[#e9c176] bg-[#e9c176]/10"
                        : "text-[#dae2fd] hover:bg-white/[0.05]"
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4" data-testid="chat-messages">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div
                  className={`shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                    msg.role === "user"
                      ? "bg-[#222a3d]"
                      : "bg-[#e9c176]/20"
                  }`}
                >
                  {msg.role === "user" ? (
                    <User className="h-4 w-4 text-[#dae2fd]" />
                  ) : (
                    <Bot className="h-4 w-4 text-[#e9c176]" />
                  )}
                </div>
                <div
                  className={`px-4 py-3 rounded-xl text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-[#222a3d] text-[#dae2fd]"
                      : "bg-[#0b1326] text-[#dae2fd] border-l-2 border-[#e9c176]"
                  }`}
                  data-testid={msg.role === "ai" ? "ai-message" : "user-message"}
                >
                  {msg.content}
                </div>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex gap-3">
                <div className="shrink-0 h-8 w-8 rounded-full bg-[#e9c176]/20 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-[#e9c176]" />
                </div>
                <div className="px-4 py-3 bg-[#0b1326] rounded-xl border-l-2 border-[#e9c176]" data-testid="typing-indicator">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 bg-[#e9c176] rounded-full animate-bounce [animation-delay:0ms]" />
                    <span className="h-2 w-2 bg-[#e9c176] rounded-full animate-bounce [animation-delay:150ms]" />
                    <span className="h-2 w-2 bg-[#e9c176] rounded-full animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form
          onSubmit={handleSubmit}
          className="px-6 py-4 border-t border-white/[0.06] flex gap-3"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu pregunta..."
            disabled={isTyping}
            className="flex-1 bg-[#222a3d] border border-white/[0.06] rounded-lg text-[#dae2fd] px-4 py-3 placeholder:text-[#c6c6cd]/40 focus:outline-none focus:border-[#e9c176]/30 disabled:opacity-50"
            data-testid="chat-input"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="px-4 py-3 bg-[#e9c176] text-[#412d00] rounded-lg font-bold hover:bg-[#e9c176]/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            data-testid="send-button"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>

      {/* Quick actions sidebar */}
      <aside className="w-full lg:w-72 shrink-0 space-y-4">
        <h2 className="text-xs uppercase tracking-widest font-semibold text-[#c6c6cd]">
          Acciones rapidas
        </h2>

        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.label}
              onClick={() => handleQuickAction(action.message)}
              disabled={isTyping}
              className="w-full p-4 bg-[#131b2e] rounded-xl shadow-lg text-left hover:bg-[#131b2e]/80 transition-colors group disabled:opacity-50"
            >
              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-lg bg-[#e9c176]/10 flex items-center justify-center shrink-0 group-hover:bg-[#e9c176]/20 transition-colors">
                  <Icon className="h-4 w-4 text-[#e9c176]" />
                </div>
                <p className="text-sm font-medium text-[#dae2fd]">
                  {action.label}
                </p>
              </div>
            </button>
          );
        })}

        {/* Link to create campaign */}
        <Link
          href="/campaigns/new"
          className="w-full p-4 bg-[#131b2e] rounded-xl shadow-lg flex items-start gap-3 hover:bg-[#131b2e]/80 transition-colors group"
        >
          <div className="h-9 w-9 rounded-lg bg-emerald-950 flex items-center justify-center shrink-0 group-hover:bg-emerald-900 transition-colors">
            <Plus className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="text-sm font-medium text-[#dae2fd]">
            Crear nueva campana
          </p>
        </Link>
      </aside>
    </div>
  );
}
