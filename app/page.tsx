import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { photoUrl } from "@/content/images";
import { pageHref } from "@/lib/paths";
import { PropertyCard } from "@/components/site/PropertyCard";
import { SearchForm } from "@/components/site/SearchForm";
import { properties, siteSettings } from "@/content/seed";

const stats = [
  { value: "10+", label: "anos de mercado" },
  { value: "8", label: "bairros atendidos" },
  { value: "6", label: "dias de atendimento" },
  { value: "100%", label: "do processo acompanhado" },
];

export default function HomePage() {
  const featured = properties.filter((p) => p.highlight);

  return (
    <>
      {/* Hero escura com busca */}
      <section className="relative overflow-hidden bg-night-900 text-white">
        <Image
          src={photoUrl("terracoPorDoSol", 2000)}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-night-900 via-night-900/85 to-night-900/30"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-night-900 via-transparent to-transparent"
        />
        <div className="container-site relative pb-16 pt-14 md:pb-24 md:pt-24">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-accent-300">
            <span className="size-1.5 rounded-full bg-accent-400" />
            Belém · Pará · Compra, venda e locação
          </p>

          <h1 className="font-display mt-8 max-w-4xl text-5xl leading-[1.04] md:text-7xl">
            Seu próximo endereço{" "}
            <em className="text-accent-300">começa aqui.</em>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/70">
            Casas e apartamentos no Umarizal, Nazaré, Batista Campos e em toda a Grande Belém, com atendimento de quem
            conhece cada rua da cidade.
          </p>

          <div className="mt-12 max-w-4xl">
            <SearchForm variant="hero" values={{ purpose: "venda" }} />
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="#destaques" variant="ghost" className="text-white hover:bg-white/10">
              Ver imóveis em destaque
            </ButtonLink>
            <ButtonLink
              href={`https://wa.me/${siteSettings.whatsapp}?text=${encodeURIComponent("Olá! Quero vender meu imóvel.")}`}
              target="_blank"
              rel="noopener noreferrer"
              variant="ghost"
              className="text-white hover:bg-white/10"
            >
              Quero vender meu imóvel
            </ButtonLink>
          </div>

          <dl className="mt-16 grid grid-cols-2 gap-8 border-t border-white/10 pt-8 md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd>
                  <p className="font-display text-4xl text-accent-300">{s.value}</p>
                  <p className="mt-1 text-sm text-white/60">{s.label}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Destaques */}
      <section id="destaques" className="container-site scroll-mt-24 py-24">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent-500">Seleção da semana</p>
            <h2 className="font-display mt-3 text-3xl text-ink-900 md:text-4xl">Imóveis em destaque</h2>
          </div>
          <a href={pageHref("/imoveis")} className="hidden text-sm font-medium text-brand-500 hover:text-brand-600 md:block">
            Ver todos →
          </a>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p, i) => (
            <PropertyCard key={p.id} property={p} priority={i < 3} />
          ))}
        </div>
      </section>
    </>
  );
}
