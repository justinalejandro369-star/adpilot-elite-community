export type BriefingCategory =
  | "meta_ads"
  | "marketing"
  | "ghl"
  | "content_tools"
  | "ai"
  | "training";

export type BriefingPriority = "urgente" | "importante" | "informativo";

export interface BriefingItem {
  id: string;
  category: BriefingCategory;
  priority: BriefingPriority;
  title: string;
  summary: string;
  impact: string;
  action: string | null;
  source: string;
  sourceUrl: string;
  publishedAt: string;
}

export interface WeeklySummary {
  topItems: { title: string; category: string }[];
  trendOfWeek: { title: string; description: string };
  featuredResource: { title: string; description: string; type: string };
}

export const CATEGORY_META: Record<
  BriefingCategory,
  { label: string; icon: string }
> = {
  meta_ads: { label: "Meta Ads y Facebook", icon: "📢" },
  marketing: { label: "Marketing Digital", icon: "📈" },
  ghl: { label: "Go High Level", icon: "⚡" },
  content_tools: { label: "Herramientas de Contenido", icon: "🎨" },
  ai: { label: "Inteligencia Artificial", icon: "🤖" },
  training: { label: "Formacion y Recursos", icon: "📚" },
};

export const mockBriefingItems: BriefingItem[] = [
  {
    id: "b-001",
    category: "meta_ads",
    priority: "urgente",
    title:
      "Meta actualiza el algoritmo de Advantage+ Shopping Campaigns con nuevo modelo de atribucion",
    summary:
      "Meta ha implementado cambios significativos en el modelo de atribucion de las campanas Advantage+ Shopping. El nuevo sistema utiliza modelado estadistico avanzado para atribuir conversiones que antes se perdian por restricciones de privacidad. Los anunciantes reportan incrementos del 15-25% en conversiones atribuidas.",
    impact:
      "Tus metricas de ROAS pueden mostrar cambios inmediatos. Los reportes historicos no se ven afectados pero las comparaciones semana a semana requieren ajuste.",
    action:
      "Revisa los reportes de Advantage+ de todos los clientes y compara con la semana anterior. Ajusta los benchmarks de ROAS si es necesario.",
    source: "Meta for Business Blog",
    sourceUrl: "https://www.facebook.com/business/news",
    publishedAt: "2026-03-30T07:00:00-06:00",
  },
  {
    id: "b-002",
    category: "meta_ads",
    priority: "importante",
    title:
      "Nuevo formato de anuncio: Catalog Reels Ads disponible para todas las cuentas",
    summary:
      "Meta ha expandido los Catalog Reels Ads a todos los anunciantes a nivel global. Este formato permite mostrar productos del catalogo en formato Reels con transiciones automaticas y musica de fondo. Los early adopters reportan CTR 2x mayor que los anuncios estaticos de catalogo.",
    impact:
      "Oportunidad para clientes con catalogo de productos como Northstar y Atlas de mejorar el rendimiento de sus campanas de catalogo.",
    action:
      "Crear variantes de Catalog Reels Ads para los clientes Northstar y Atlas esta semana.",
    source: "Social Media Today",
    sourceUrl: "https://www.socialmediatoday.com",
    publishedAt: "2026-03-30T06:30:00-06:00",
  },
  {
    id: "b-003",
    category: "meta_ads",
    priority: "informativo",
    title:
      "Meta anuncia cambios en la politica de verificacion de identidad para anunciantes",
    summary:
      "A partir de mayo 2026, Meta requerira verificacion de identidad adicional para anunciantes que gasten mas de $5,000 USD mensuales. El proceso incluye verificacion biometrica y documentacion empresarial.",
    impact:
      "Atlas supera este umbral. Hay que preparar la documentacion con anticipacion para evitar interrupciones.",
    action:
      "Verificar el estado de verificacion de la cuenta de Atlas y preparar documentos requeridos.",
    source: "Meta Business Help Center",
    sourceUrl: "https://www.facebook.com/business/help",
    publishedAt: "2026-03-30T05:00:00-06:00",
  },
  {
    id: "b-004",
    category: "marketing",
    priority: "importante",
    title:
      "Estudio: Los carruseles generan 3x mas engagement que las imagenes estaticas en 2026",
    summary:
      "Un estudio de Hootsuite con datos de 500,000 publicaciones confirma que los carruseles organicos y pagados generan 3 veces mas engagement promedio que las imagenes estaticas. Los carruseles con 5-7 slides tienen el mejor rendimiento.",
    impact:
      "Oportunidad de optimizar los creativos de todos los clientes. Los formatos estaticos deben ser complementados con carruseles.",
    action:
      "Revisar la proporcion de formatos creativos por cliente y aumentar la produccion de carruseles.",
    source: "Hootsuite Blog",
    sourceUrl: "https://blog.hootsuite.com",
    publishedAt: "2026-03-30T08:00:00-06:00",
  },
  {
    id: "b-005",
    category: "marketing",
    priority: "informativo",
    title:
      "Google actualiza Core Web Vitals: INP reemplaza oficialmente a FID",
    summary:
      "Google ha completado la transicion de First Input Delay (FID) a Interaction to Next Paint (INP) como metrica oficial de Core Web Vitals. Los sitios que no optimicen INP podrian ver caidas en rankings.",
    impact:
      "Las landing pages de los clientes deben ser auditadas para la nueva metrica INP. Esto afecta el quality score de las campanas con destino web.",
    action: null,
    source: "Google Search Central Blog",
    sourceUrl: "https://developers.google.com/search/blog",
    publishedAt: "2026-03-29T14:00:00-06:00",
  },
  {
    id: "b-006",
    category: "ghl",
    priority: "importante",
    title:
      "Nueva funcion de Go High Level: Automatizaciones con IA integrada para seguimiento de leads",
    summary:
      "Go High Level ha lanzado su motor de IA nativo para automatizaciones. Ahora es posible crear flujos de seguimiento que adaptan el mensaje segun el comportamiento del lead, usando modelos de lenguaje integrados. No requiere API key externa.",
    impact:
      "Esto puede reemplazar algunas automatizaciones manuales de n8n para seguimiento de leads. Reduce costos de API y simplifica el stack.",
    action:
      "Evaluar las automatizaciones actuales de seguimiento en n8n y migrar las candidatas al motor nativo de GHL.",
    source: "Go High Level Changelog",
    sourceUrl: "https://www.gohighlevel.com/changelog",
    publishedAt: "2026-03-30T09:00:00-06:00",
  },
  {
    id: "b-007",
    category: "ghl",
    priority: "informativo",
    title:
      "GHL lanza integracion directa con TikTok Ads para reporte unificado",
    summary:
      "Go High Level ahora permite conectar cuentas de TikTok Ads directamente, ofreciendo metricas consolidadas junto con Facebook y Google Ads en un solo dashboard. La integracion incluye atribucion de leads y pipeline tracking.",
    impact:
      "Si algun cliente quiere expandirse a TikTok Ads, el reporte seria automatico dentro de GHL.",
    action: null,
    source: "Go High Level Blog",
    sourceUrl: "https://www.gohighlevel.com/blog",
    publishedAt: "2026-03-29T16:00:00-06:00",
  },
  {
    id: "b-008",
    category: "content_tools",
    priority: "importante",
    title:
      "Canva lanza generador de videos con IA para Reels e historias automaticas",
    summary:
      "Canva ha presentado Magic Video, una herramienta que genera videos cortos para Reels e historias a partir de imagenes de producto y texto. Incluye musica, transiciones y texto animado. Disponible en plan Pro y Teams.",
    impact:
      "Puede reducir drasticamente el tiempo de produccion de creativos para campanas. Ideal para crear variantes de anuncios rapidamente.",
    action:
      "Probar Magic Video con productos de Northstar y evaluar calidad para anuncios pagados.",
    source: "Canva Blog",
    sourceUrl: "https://www.canva.com/newsroom",
    publishedAt: "2026-03-30T10:00:00-06:00",
  },
  {
    id: "b-009",
    category: "content_tools",
    priority: "informativo",
    title:
      "CapCut Pro agrega templates especificos para anuncios de e-commerce",
    summary:
      "CapCut ha lanzado una coleccion de mas de 200 templates optimizados para anuncios de e-commerce. Incluyen formatos para productos, testimonios y comparaciones. Estan disenados para cumplir con las mejores practicas de Meta y TikTok Ads.",
    impact:
      "Templates listos para usar que pueden acelerar la produccion de creativos publicitarios para todos los clientes.",
    action: null,
    source: "CapCut Blog",
    sourceUrl: "https://www.capcut.com/blog",
    publishedAt: "2026-03-29T11:00:00-06:00",
  },
  {
    id: "b-010",
    category: "ai",
    priority: "informativo",
    title:
      "Claude 4.5 lanzado con ventana de contexto de 1M tokens y capacidades multimodales mejoradas",
    summary:
      "Anthropic ha lanzado Claude 4.5 con una ventana de contexto de 1 millon de tokens, mejoras significativas en razonamiento matematico, generacion de codigo y analisis de imagenes. El modelo es 40% mas rapido que su predecesor.",
    impact:
      "Las automatizaciones de n8n que usan Claude para analisis de datos pueden procesar datasets mas grandes y generar insights mas precisos.",
    action: null,
    source: "Anthropic Blog",
    sourceUrl: "https://www.anthropic.com/news",
    publishedAt: "2026-03-30T07:30:00-06:00",
  },
  {
    id: "b-011",
    category: "ai",
    priority: "urgente",
    title:
      "OpenAI lanza GPT-5 con capacidades de agentes autonomos y uso de herramientas",
    summary:
      "OpenAI ha presentado GPT-5, su modelo mas avanzado con capacidades nativas de agentes autonomos. Puede ejecutar tareas multi-paso, usar herramientas web y mantener memoria persistente. El precio es 3x mayor que GPT-4o pero con rendimiento muy superior.",
    impact:
      "La competencia en IA para marketing se intensifica. Evaluar si GPT-5 ofrece ventajas para analisis de campanas vs Claude en los workflows actuales.",
    action:
      "Crear un benchmark comparando Claude vs GPT-5 para las tareas especificas de analisis de campanas de Meta Ads.",
    source: "OpenAI Blog",
    sourceUrl: "https://openai.com/blog",
    publishedAt: "2026-03-30T06:00:00-06:00",
  },
  {
    id: "b-012",
    category: "training",
    priority: "importante",
    title:
      "Meta lanza certificacion gratuita en Advantage+ y automatizacion de campanas",
    summary:
      "Meta Blueprint ha lanzado una nueva certificacion gratuita enfocada en Advantage+ Shopping, Advantage+ Creative y automatizacion de campanas. El curso dura 4 horas y otorga una insignia verificable.",
    impact:
      "Certificacion valiosa para demostrar expertise actualizado a los clientes. Cubre exactamente las herramientas que usamos.",
    action:
      "Reservar 4 horas esta semana para completar la certificacion. Compartir la insignia con los clientes.",
    source: "Meta Blueprint",
    sourceUrl: "https://www.facebookblueprint.com",
    publishedAt: "2026-03-30T08:30:00-06:00",
  },
  {
    id: "b-013",
    category: "training",
    priority: "informativo",
    title:
      "Webinar gratuito: Estrategias avanzadas de retargeting con IA en 2026",
    summary:
      "HubSpot organiza un webinar gratuito sobre estrategias de retargeting potenciadas con IA. Cubre lookalike audiences inteligentes, retargeting secuencial y personalizacion dinamica de creativos basada en comportamiento.",
    impact:
      "Tecnicas aplicables directamente a las campanas de retargeting de todos los clientes, especialmente Northstar y Atlas.",
    action: null,
    source: "HubSpot Academy",
    sourceUrl: "https://academy.hubspot.com",
    publishedAt: "2026-03-29T10:00:00-06:00",
  },
  {
    id: "b-014",
    category: "marketing",
    priority: "urgente",
    title:
      "Cambio en la politica de privacidad de Apple afecta el tracking de conversiones en iOS",
    summary:
      "Apple ha anunciado restricciones adicionales al tracking en iOS 19.4, limitando aun mas la ventana de atribucion de SKAdNetwork. Los anunciantes de Meta Ads podrian ver una reduccion del 10-15% en conversiones reportadas por campanas dirigidas a iOS.",
    impact:
      "Impacto directo en la medicion de campanas. Los clientes con audiencias predominantemente iOS (como Atlas en USA) seran los mas afectados.",
    action:
      "Implementar la API de Conversiones de Meta (CAPI) en los sitios de los clientes que aun no la tengan configurada.",
    source: "Apple Developer News",
    sourceUrl: "https://developer.apple.com/news",
    publishedAt: "2026-03-30T04:00:00-06:00",
  },
];

export const mockWeeklySummary: WeeklySummary = {
  topItems: [
    {
      title: "Meta cambia atribucion en Advantage+ Shopping",
      category: "Meta Ads",
    },
    {
      title: "Apple restringe tracking en iOS 19.4",
      category: "Marketing",
    },
    {
      title: "GPT-5 lanzado con agentes autonomos",
      category: "IA",
    },
    {
      title: "GHL lanza automatizaciones con IA nativa",
      category: "Go High Level",
    },
    {
      title: "Canva lanza Magic Video para Reels",
      category: "Contenido",
    },
  ],
  trendOfWeek: {
    title: "IA nativa en plataformas de marketing",
    description:
      "La tendencia mas fuerte de la semana es la integracion de IA directamente en las plataformas de marketing (GHL, Meta, Canva). Esto reduce la dependencia de herramientas externas y simplifica los flujos de trabajo. La recomendacion es evaluar cuales automatizaciones externas pueden ser reemplazadas por funciones nativas.",
  },
  featuredResource: {
    title: "Certificacion Meta Advantage+ (Gratuita)",
    description:
      "Meta Blueprint ofrece una nueva certificacion de 4 horas sobre Advantage+ Shopping y automatizacion de campanas. Ideal para validar conocimientos y compartir con clientes como prueba de expertise actualizado.",
    type: "Certificacion",
  },
};
