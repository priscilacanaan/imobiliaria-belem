import { notFound } from "next/navigation";
import { PropertyDetailLive } from "@/components/site/PropertyDetail";
import { findProperty, properties } from "@/content/seed";

type Params = Promise<{ slug: string }>;

// Páginas estáticas dos imóveis de exemplo. Imóveis novos do painel abrem em /imoveis/ver?id=...
export function generateStaticParams() {
  return properties.map((p) => ({ slug: p.slug }));
}

export default async function PropertyPage({ params }: { params: Params }) {
  const property = findProperty((await params).slug);
  if (!property) notFound();
  return <PropertyDetailLive id={property.id} fallback={property} />;
}
