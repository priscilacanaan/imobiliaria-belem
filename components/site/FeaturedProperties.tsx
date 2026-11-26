"use client";

import { PropertyCard } from "@/components/site/PropertyCard";
import { isPublished } from "@/content/seed";
import { useProperties } from "@/lib/store";

/** Destaques da home: imóveis ativos marcados com estrela no painel (até 6). */
export function FeaturedProperties() {
  const { properties } = useProperties();
  const featured = properties.filter((p) => p.highlight && isPublished(p)).slice(0, 6);

  if (featured.length === 0) {
    return <p className="text-sm text-ink-500">Nenhum imóvel em destaque no momento.</p>;
  }
  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {featured.map((p, i) => (
        <PropertyCard key={p.id} property={p} priority={i < 3} />
      ))}
    </div>
  );
}
