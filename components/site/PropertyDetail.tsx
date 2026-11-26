"use client";

import Image from "next/image";
import { Bath, BedDouble, Car, Check, MapPin, MessageCircle, Ruler } from "lucide-react";
import { LeadForm } from "@/components/site/LeadForm";
import { PropertyCard } from "@/components/site/PropertyCard";
import { photoUrl } from "@/content/images";
import { isPublished, similarProperties, type Property } from "@/content/seed";
import { useSiteSettings } from "@/lib/team";
import { formatArea, formatPrice } from "@/lib/format";
import { pageHref } from "@/lib/paths";
import { useProperties } from "@/lib/store";

/**
 * Página do imóvel com os dados atualizados pelo painel.
 * `fallback` é a versão do seed usada no HTML estático (antes de ler o navegador).
 */
export function PropertyDetailLive({ id, fallback }: { id: string; fallback?: Property }) {
  const { properties, ready } = useProperties();
  const property = ready ? properties.find((p) => p.id === id) : fallback;

  if (!ready && !property) {
    return <p className="container-site py-24 text-sm text-ink-500">Carregando imóvel…</p>;
  }
  if (!property || !isPublished(property)) {
    return (
      <div className="container-site py-24 text-center">
        <p className="font-display text-3xl text-ink-900">Este imóvel não está mais disponível</p>
        <p className="mt-2 text-sm text-ink-700">Ele pode ter sido vendido, alugado ou retirado do site.</p>
        <a href={pageHref("/imoveis")} className="mt-6 inline-block text-sm font-medium text-brand-500 hover:text-brand-600">
          Ver outros imóveis →
        </a>
      </div>
    );
  }
  return <PropertyDetail property={property} list={properties} />;
}

function PropertyDetail({ property, list }: { property: Property; list: Property[] }) {
  const { settings: siteSettings } = useSiteSettings();
  const isRent = property.purpose === "aluguel";
  const similar = similarProperties(property, list);
  const whatsappText = `Olá! Tenho interesse no imóvel ${property.code} (${property.title}).`;
  const whatsappUrl = `https://wa.me/${siteSettings.whatsapp}?text=${encodeURIComponent(whatsappText)}`;

  const specs = [
    { icon: Ruler, value: formatArea(property.area), label: "Área" },
    { icon: BedDouble, value: property.bedrooms, label: property.bedrooms === 1 ? "Quarto" : "Quartos" },
    { icon: Bath, value: property.bathrooms, label: property.bathrooms === 1 ? "Banheiro" : "Banheiros" },
    { icon: Car, value: property.parking, label: property.parking === 1 ? "Vaga" : "Vagas" },
  ].filter((s) => s.value !== 0);

  const sheet: [string, string][] = [
    ["Código", property.code],
    ["Tipo", property.type],
    ["Finalidade", isRent ? "Aluguel" : "Venda"],
    ["Área", formatArea(property.area)],
    ["Quartos", String(property.bedrooms)],
    ["Banheiros", String(property.bathrooms)],
    ["Vagas", String(property.parking)],
    ["Condomínio", property.condoFee ? formatPrice(property.condoFee) : "Não há"],
  ];

  return (
    <>
      <div className="container-site pt-8">
        {/* Trilha */}
        <nav aria-label="Trilha" className="text-sm text-ink-500">
          <ol className="flex flex-wrap items-center gap-2">
            <li><a href={pageHref("/")} className="hover:text-ink-900">Início</a></li>
            <li aria-hidden>/</li>
            <li><a href={pageHref("/imoveis")} className="hover:text-ink-900">Imóveis</a></li>
            <li aria-hidden>/</li>
            <li>
              <a
                href={pageHref("/imoveis", {
                  purpose: property.purpose,
                  cidade: property.city,
                  bairro: property.neighborhood,
                })}
                className="hover:text-ink-900"
              >
                {property.neighborhood}
              </a>
            </li>
            <li aria-hidden>/</li>
            <li aria-current="page" className="text-ink-700">{property.code}</li>
          </ol>
        </nav>

        {/* Foto principal */}
        <div className="relative mt-6 aspect-[4/3] overflow-hidden rounded-[1.75rem] bg-sand-100 shadow-lift md:aspect-[21/9]">
          <Image
            src={photoUrl(property.photo, 2000)}
            alt={property.title}
            fill
            priority
            sizes="(min-width: 1280px) 1280px, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-night-900/40 via-transparent to-transparent" />
          <div className="absolute left-5 top-5 flex gap-2">
            <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-ink-900 backdrop-blur">
              {property.type}
            </span>
            <span className="rounded-full bg-night-900/80 px-3 py-1 text-xs font-medium text-white backdrop-blur">
              {isRent ? "Aluguel" : "Venda"}
            </span>
          </div>
        </div>
      </div>

      <div className="container-site mt-10 grid gap-12 lg:grid-cols-[1fr_380px]">
        {/* Conteúdo */}
        <div>
          <p className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.16em] text-accent-500">
            <MapPin className="size-3.5" />
            {property.neighborhood} · {property.city}, PA
          </p>
          <h1 className="font-display mt-3 text-4xl leading-tight text-ink-900 md:text-5xl">{property.title}</h1>
          <p className="mt-2 text-sm text-ink-500">Código {property.code}</p>

          <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {specs.map(({ icon: Icon, value, label }) => (
              <li key={label} className="rounded-[var(--radius-control)] border border-sand-200 bg-paper-raised p-4">
                <Icon className="size-5 text-accent-500" />
                <p className="font-display mt-3 text-2xl text-ink-900">{value}</p>
                <p className="text-xs text-ink-500">{label}</p>
              </li>
            ))}
          </ul>

          <section className="mt-12" aria-labelledby="sobre">
            <h2 id="sobre" className="font-display text-2xl text-ink-900">Sobre o imóvel</h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-700">{property.description}</p>
          </section>

          <section className="mt-12" aria-labelledby="diferenciais">
            <h2 id="diferenciais" className="font-display text-2xl text-ink-900">Diferenciais</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {property.tags.map((tag) => (
                <li
                  key={tag}
                  className="inline-flex items-center gap-1.5 rounded-full border border-sand-200 bg-paper-raised px-4 py-2 text-sm text-ink-700"
                >
                  <Check className="size-4 text-brand-500" />
                  {tag}
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-12" aria-labelledby="ficha">
            <h2 id="ficha" className="font-display text-2xl text-ink-900">Ficha técnica</h2>
            <dl className="mt-4 grid max-w-2xl grid-cols-1 overflow-hidden rounded-[var(--radius-control)] border border-sand-200 bg-paper-raised sm:grid-cols-2">
              {sheet.map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4 border-b border-sand-100 px-5 py-3 text-sm">
                  <dt className="text-ink-500">{label}</dt>
                  <dd className="font-medium text-ink-900">{value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="mt-12" aria-labelledby="localizacao">
            <h2 id="localizacao" className="font-display text-2xl text-ink-900">Localização</h2>
            <div className="mt-4 flex max-w-2xl items-start gap-4 rounded-[var(--radius-control)] bg-sand-100 p-5">
              <MapPin className="mt-0.5 size-5 shrink-0 text-brand-500" />
              <div className="text-sm text-ink-700">
                <p className="font-medium text-ink-900">{property.neighborhood}, {property.city} – PA</p>
                <p className="mt-1">Por segurança, o endereço exato é informado ao agendar a visita.</p>
              </div>
            </div>
          </section>
        </div>

        {/* Caixa de preço e contato */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-[var(--radius-card)] bg-paper-raised p-6 shadow-lift">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-ink-500">
              {isRent ? "Aluguel mensal" : "Valor de venda"}
            </p>
            <p className="font-display mt-2 text-4xl text-ink-900">
              {formatPrice(property.price)}
              {isRent && <span className="font-sans text-base text-ink-500"> /mês</span>}
            </p>
            {property.condoFee ? (
              <p className="mt-1 text-sm text-ink-500">+ condomínio {formatPrice(property.condoFee)}</p>
            ) : null}

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-[var(--radius-control)] bg-accent-400 text-sm font-semibold text-night-900 transition hover:bg-accent-300 active:scale-[0.98]"
            >
              <MessageCircle className="size-4" />
              Conversar no WhatsApp
            </a>

            <div className="my-6 flex items-center gap-3 text-xs text-ink-500">
              <span className="h-px flex-1 bg-sand-200" />
              ou deixe seu contato
              <span className="h-px flex-1 bg-sand-200" />
            </div>

            <LeadForm propertyCode={property.code} propertyTitle={property.title} />
          </div>
        </aside>
      </div>

      {similar.length > 0 && (
        <section className="container-site mt-24" aria-labelledby="parecidos">
          <h2 id="parecidos" className="font-display text-3xl text-ink-900">Imóveis parecidos</h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
