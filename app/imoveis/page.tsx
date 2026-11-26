import { Suspense } from "react";
import { PropertyResults } from "@/components/site/PropertyResults";

export default function ImoveisPage() {
  return (
    <section className="container-site py-12 md:py-16">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent-500">Catálogo</p>
      <h1 className="font-display mt-3 text-4xl text-ink-900 md:text-5xl">Imóveis</h1>
      <Suspense fallback={<p className="mt-8 text-sm text-ink-500">Carregando imóveis…</p>}>
        <PropertyResults />
      </Suspense>
    </section>
  );
}
