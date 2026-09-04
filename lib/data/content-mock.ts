// --- Content Calendar Mock Data ---

export type ContentPlatform = "instagram" | "facebook" | "tiktok" | "youtube";
export type ContentType = "reel" | "carousel" | "image" | "video" | "story";
export type ContentStatus = "draft" | "approved" | "scheduled" | "published";

export interface ContentPiece {
  id: string;
  clientSlug: string;
  clientName: string;
  platform: ContentPlatform;
  contentType: ContentType;
  title: string;
  description: string;
  scheduledDate: string; // YYYY-MM-DD
  scheduledTime: string; // HH:MM
  status: ContentStatus;
  engagement?: {
    reach: number;
    likes: number;
    comments: number;
    shares: number;
  };
}

export interface OrganicMetrics {
  clientSlug: string;
  clientName: string;
  postsThisWeek: number;
  totalReach: number;
  engagementRate: number;
  bestPost: {
    title: string;
    platform: ContentPlatform;
  };
}

// Week of March 24-30, 2026
export const mockContentPieces: ContentPiece[] = [
  // Northstar — financial education, trading tips, copy trading
  {
    id: "cp_001",
    clientSlug: "northstar",
    clientName: "Northstar",
    platform: "instagram",
    contentType: "reel",
    title: "3 errores que cometen los nuevos traders",
    description:
      "Reel educativo mostrando los 3 errores mas comunes al empezar en trading. Hook: 'Yo perdi $5,000 por no saber esto'. CTA a copy trading.",
    scheduledDate: "2026-03-24",
    scheduledTime: "10:00",
    status: "published",
    engagement: { reach: 12400, likes: 890, comments: 67, shares: 145 },
  },
  {
    id: "cp_002",
    clientSlug: "northstar",
    clientName: "Northstar",
    platform: "facebook",
    contentType: "carousel",
    title: "Guia: Como funciona el copy trading",
    description:
      "Carrusel de 8 slides explicando paso a paso como funciona el copy trading. Diseno oscuro con graficos. Ultimo slide con CTA.",
    scheduledDate: "2026-03-24",
    scheduledTime: "14:00",
    status: "published",
    engagement: { reach: 8900, likes: 342, comments: 28, shares: 89 },
  },
  {
    id: "cp_003",
    clientSlug: "northstar",
    clientName: "Northstar",
    platform: "tiktok",
    contentType: "video",
    title: "Cuanto gane esta semana con copy trading",
    description:
      "Video mostrando resultados reales de la semana. Formato screen recording con voz en off. Disclaimer incluido.",
    scheduledDate: "2026-03-25",
    scheduledTime: "12:00",
    status: "published",
    engagement: { reach: 23100, likes: 1890, comments: 234, shares: 456 },
  },
  {
    id: "cp_004",
    clientSlug: "northstar",
    clientName: "Northstar",
    platform: "instagram",
    contentType: "story",
    title: "Encuesta: Que tema quieren para el proximo live?",
    description:
      "Story con encuesta interactiva. Opciones: Cripto vs Forex, Gestion de riesgo, Psicologia del trader.",
    scheduledDate: "2026-03-26",
    scheduledTime: "09:00",
    status: "scheduled",
  },
  {
    id: "cp_005",
    clientSlug: "northstar",
    clientName: "Northstar",
    platform: "youtube",
    contentType: "video",
    title: "Analisis semanal: Mercados LATAM Mar 24-28",
    description:
      "Video largo (15 min) analizando movimientos del mercado mexicano. Incluye predicciones para la proxima semana y oportunidades de copy trading.",
    scheduledDate: "2026-03-28",
    scheduledTime: "16:00",
    status: "approved",
  },
  {
    id: "cp_006",
    clientSlug: "northstar",
    clientName: "Northstar",
    platform: "instagram",
    contentType: "reel",
    title: "Inflacion en Mexico: como proteger tu dinero",
    description:
      "Reel con datos de inflacion actualizados. Tono urgente. Solucion: diversificar en USD via copy trading.",
    scheduledDate: "2026-03-29",
    scheduledTime: "11:00",
    status: "draft",
  },

  // Aurora — personal development, coaching, community
  {
    id: "cp_007",
    clientSlug: "aurora",
    clientName: "Aurora",
    platform: "instagram",
    contentType: "carousel",
    title: "5 habitos de personas exitosas",
    description:
      "Carrusel tipo lista con diseno minimalista. Cada habito en un slide con ejemplo practico. CTA a Skool community.",
    scheduledDate: "2026-03-24",
    scheduledTime: "08:00",
    status: "published",
    engagement: { reach: 15600, likes: 1120, comments: 89, shares: 234 },
  },
  {
    id: "cp_008",
    clientSlug: "aurora",
    clientName: "Aurora",
    platform: "tiktok",
    contentType: "reel",
    title: "La regla de los 5 segundos que cambio mi vida",
    description:
      "Reel motivacional con la tecnica de Mel Robbins adaptada. Formato talking head con B-roll de rutina matutina.",
    scheduledDate: "2026-03-25",
    scheduledTime: "07:30",
    status: "published",
    engagement: { reach: 34200, likes: 2890, comments: 187, shares: 678 },
  },
  {
    id: "cp_009",
    clientSlug: "aurora",
    clientName: "Aurora",
    platform: "facebook",
    contentType: "video",
    title: "Live: Sesion de coaching grupal — Metas Q2",
    description:
      "Transmision en vivo de 45 min. Tema: como definir metas para Q2 2026. Interaccion con la audiencia en tiempo real.",
    scheduledDate: "2026-03-26",
    scheduledTime: "19:00",
    status: "scheduled",
  },
  {
    id: "cp_010",
    clientSlug: "aurora",
    clientName: "Aurora",
    platform: "instagram",
    contentType: "image",
    title: "Frase del dia: 'Tu unico limite eres tu'",
    description:
      "Imagen con frase motivacional sobre fondo degradado. Logo de la comunidad. Formato cuadrado 1080x1080.",
    scheduledDate: "2026-03-27",
    scheduledTime: "06:00",
    status: "approved",
  },
  {
    id: "cp_011",
    clientSlug: "aurora",
    clientName: "Aurora",
    platform: "youtube",
    contentType: "video",
    title: "Podcast: Invitado especial — CEO de startup exitosa",
    description:
      "Episodio del podcast con entrevista a fundador de startup LATAM. Temas: mindset, fracaso, perseverancia.",
    scheduledDate: "2026-03-29",
    scheduledTime: "10:00",
    status: "draft",
  },
  {
    id: "cp_012",
    clientSlug: "aurora",
    clientName: "Aurora",
    platform: "instagram",
    contentType: "story",
    title: "Detras de camaras: grabando nuevo curso",
    description:
      "Series de stories mostrando el proceso de grabacion del nuevo modulo del curso online. Sticker de pregunta.",
    scheduledDate: "2026-03-30",
    scheduledTime: "15:00",
    status: "draft",
  },

  // Atlas — health, wellness, relationships, supplements
  {
    id: "cp_013",
    clientSlug: "atlas",
    clientName: "Atlas",
    platform: "facebook",
    contentType: "video",
    title: "Testimonio: Maria bajo 12 kg en 8 semanas",
    description:
      "Video UGC de cliente real compartiendo su transformacion. Incluye fotos antes/despues con consentimiento. CTA a consulta gratuita.",
    scheduledDate: "2026-03-24",
    scheduledTime: "09:00",
    status: "published",
    engagement: { reach: 18700, likes: 1450, comments: 156, shares: 312 },
  },
  {
    id: "cp_014",
    clientSlug: "atlas",
    clientName: "Atlas",
    platform: "instagram",
    contentType: "reel",
    title: "3 suplementos que realmente funcionan",
    description:
      "Reel educativo con evidencia cientifica. Formato: Atlas frente a camara con graficos overlays. Sin promesas exageradas.",
    scheduledDate: "2026-03-25",
    scheduledTime: "10:30",
    status: "published",
    engagement: { reach: 21300, likes: 1670, comments: 198, shares: 267 },
  },
  {
    id: "cp_015",
    clientSlug: "atlas",
    clientName: "Atlas",
    platform: "tiktok",
    contentType: "reel",
    title: "Lo que nadie te dice sobre las relaciones",
    description:
      "Reel tipo 'verdades incomodas' sobre relaciones de pareja. Tono directo y honesto. Alto potencial viral.",
    scheduledDate: "2026-03-26",
    scheduledTime: "13:00",
    status: "scheduled",
  },
  {
    id: "cp_016",
    clientSlug: "atlas",
    clientName: "Atlas",
    platform: "instagram",
    contentType: "carousel",
    title: "Guia: Rutina de suplementacion diaria",
    description:
      "Carrusel de 6 slides con horarios optimos para cada suplemento. Manana, tarde, noche. Diseno limpio con iconos.",
    scheduledDate: "2026-03-27",
    scheduledTime: "08:00",
    status: "approved",
  },
  {
    id: "cp_017",
    clientSlug: "atlas",
    clientName: "Atlas",
    platform: "facebook",
    contentType: "image",
    title: "Promo: 20% en pack de suplementos esenciales",
    description:
      "Imagen promocional para campana de fin de mes. Codigo de descuento: SALUD20. Vigencia 28-31 marzo.",
    scheduledDate: "2026-03-28",
    scheduledTime: "11:00",
    status: "scheduled",
  },
  {
    id: "cp_018",
    clientSlug: "atlas",
    clientName: "Atlas",
    platform: "youtube",
    contentType: "video",
    title: "Q&A: Respondiendo preguntas sobre salud hormonal",
    description:
      "Video de 20 min respondiendo las 10 preguntas mas frecuentes de la comunidad. Formato casual, en consultorio.",
    scheduledDate: "2026-03-30",
    scheduledTime: "14:00",
    status: "draft",
  },
];

export const mockOrganicMetrics: OrganicMetrics[] = [
  {
    clientSlug: "northstar",
    clientName: "Northstar",
    postsThisWeek: 6,
    totalReach: 44400,
    engagementRate: 4.8,
    bestPost: {
      title: "Cuanto gane esta semana con copy trading",
      platform: "tiktok",
    },
  },
  {
    clientSlug: "aurora",
    clientName: "Aurora",
    postsThisWeek: 6,
    totalReach: 49800,
    engagementRate: 5.2,
    bestPost: {
      title: "La regla de los 5 segundos que cambio mi vida",
      platform: "tiktok",
    },
  },
  {
    clientSlug: "atlas",
    clientName: "Atlas",
    postsThisWeek: 6,
    totalReach: 40000,
    engagementRate: 4.5,
    bestPost: {
      title: "3 suplementos que realmente funcionan",
      platform: "instagram",
    },
  },
];

// Helper functions

export function getContentPieces(clientSlug?: string): ContentPiece[] {
  if (clientSlug) {
    return mockContentPieces.filter((p) => p.clientSlug === clientSlug);
  }
  return mockContentPieces;
}

export function getContentByDate(
  date: string,
  clientSlug?: string
): ContentPiece[] {
  return getContentPieces(clientSlug).filter(
    (p) => p.scheduledDate === date
  );
}

export function getOrganicMetrics(clientSlug?: string): OrganicMetrics[] {
  if (clientSlug) {
    return mockOrganicMetrics.filter((m) => m.clientSlug === clientSlug);
  }
  return mockOrganicMetrics;
}
