"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PropertyDetailLive } from "@/components/site/PropertyDetail";

// Página de imóveis cadastrados pelo painel (não existem no HTML estático).
function ByQuery() {
  const id = useSearchParams().get("id") ?? "";
  return <PropertyDetailLive id={id} />;
}

export default function PropertyByIdPage() {
  return (
    <Suspense fallback={<p className="container-site py-24 text-sm text-ink-500">Carregando imóvel…</p>}>
      <ByQuery />
    </Suspense>
  );
}
