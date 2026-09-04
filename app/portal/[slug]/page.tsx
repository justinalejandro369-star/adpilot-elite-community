import { notFound } from "next/navigation";
import { getPortalData, getPortalSlugs } from "@/lib/data/attribution-mock";
import { PortalClient } from "./portal-client";

export function generateStaticParams() {
  if (process.env.ENABLE_PUBLIC_PORTALS !== "true") return [];
  return getPortalSlugs().map((slug) => ({ slug }));
}

export default async function PortalPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  if (process.env.ENABLE_PUBLIC_PORTALS !== "true") notFound();

  const { slug } = await params;
  const data = getPortalData(slug);
  if (!data) notFound();

  return <PortalClient data={data} />;
}
