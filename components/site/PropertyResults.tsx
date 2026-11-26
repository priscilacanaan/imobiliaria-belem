"use client";

import { useSearchParams } from "next/navigation";
import { PropertyCard } from "@/components/site/PropertyCard";
import { SearchForm } from "@/components/site/SearchForm";
import { properties } from "@/content/seed";
import { pageHref } from "@/lib/paths";

/** Lê os filtros da URL e filtra no navegador (funciona em hospedagem estática). */
export function PropertyResults() {
  const params = useSearchParams();
  const purpose = params.get("purpose") ?? undefined;
  const type = params.get("type") ?? undefined;
  const cidade = params.get("cidade") ?? undefined;
  const bairro = params.get("bairro") ?? undefined;

  const results = properties.filter((p) => {
    if (purpose && p.purpose !== purpose) return false;
    if (type && p.type !== type) return false;
    if (cidade && p.city !== cidade) return false;
    if (bairro && p.neighborhood !== bairro) return false;
    return true;
  });

  return (
    <>
      <div className="mt-8">
        {/* key: remonta o formulário quando os filtros da URL mudam */}
        <SearchForm
          key={params.toString()}
          variant="bar"
          values={{ purpose, type, city: cidade, neighborhood: bairro }}
        />
      </div>

      <p className="mt-8 text-sm text-ink-500" aria-live="polite">
        {results.length} {results.length === 1 ? "imóvel encontrado" : "imóveis encontrados"}
      </p>

      {results.length > 0 ? (
        <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((p, i) => (
            <PropertyCard key={p.id} property={p} priority={i < 3} />
          ))}
        </div>
      ) : (
        <div className="mt-12 rounded-[var(--radius-card)] border border-dashed border-sand-200 p-12 text-center">
          <p className="font-display text-2xl text-ink-900">Nenhum imóvel com esses filtros</p>
          <p className="mt-2 text-sm text-ink-700">Tente outra cidade, bairro ou tipo de imóvel.</p>
          <a href={pageHref("/imoveis")} className="mt-6 inline-block text-sm font-medium text-brand-500 hover:text-brand-600">
            Ver todos os imóveis →
          </a>
        </div>
      )}
    </>
  );
}
