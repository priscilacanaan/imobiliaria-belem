import Image from "next/image";
import { pageHref } from "@/lib/paths";
import { BedDouble, Bath, Car, Ruler } from "lucide-react";
import { properties as seedProperties, type Property } from "@/content/seed";
import { photoUrl } from "@/content/images";
import { formatArea, formatPrice } from "@/lib/format";

// Imóveis de exemplo têm página estática própria; os cadastrados no painel abrem em /imoveis/ver?id=.
const staticSlugs = new Set(seedProperties.map((p) => p.slug));

export function propertyHref(p: Property): string {
  return staticSlugs.has(p.slug) ? pageHref(`/imoveis/${p.slug}`) : pageHref("/imoveis/ver", { id: p.id });
}

export function PropertyCard({ property, priority = false }: { property: Property; priority?: boolean }) {
  const isRent = property.purpose === "aluguel";

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-[var(--radius-card)] bg-paper-raised shadow-soft transition duration-300 ease-[var(--ease-out-soft)] focus-within:shadow-lift hover:-translate-y-1 hover:shadow-lift">
      <div className="relative aspect-[4/3] overflow-hidden bg-sand-100">
        <Image
          src={photoUrl(property.photo, 1200)}
          alt={property.title}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition duration-700 ease-[var(--ease-out-soft)] group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-night-900/50 via-transparent to-transparent" />
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-ink-900 backdrop-blur">
          {property.type}
        </span>
        <span className="absolute right-4 top-4 rounded-full bg-night-900/80 px-3 py-1 text-xs font-medium text-white backdrop-blur">
          {isRent ? "Aluguel" : "Venda"}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-ink-500">
            {property.neighborhood} · {property.city}
          </p>
          <h3 className="font-display mt-1 text-lg leading-snug text-ink-900">
            {/* O link cobre o card inteiro (::after), mantendo um único alvo de foco */}
            <a
              href={propertyHref(property)}
              className="after:absolute after:inset-0 after:rounded-[var(--radius-card)] focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-brand-500"
            >
              {property.title}
            </a>
          </h3>
        </div>

        <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-ink-700">
          <Spec icon={<Ruler className="size-4" />} label={formatArea(property.area)} />
          {property.bedrooms > 0 && <Spec icon={<BedDouble className="size-4" />} label={`${property.bedrooms} qt`} />}
          {property.bathrooms > 0 && <Spec icon={<Bath className="size-4" />} label={`${property.bathrooms} banh`} />}
          {property.parking > 0 && (
            <Spec icon={<Car className="size-4" />} label={`${property.parking} vaga${property.parking > 1 ? "s" : ""}`} />
          )}
        </ul>

        <div className="mt-auto flex items-end justify-between border-t border-sand-200 pt-4">
          <div>
            <p className="font-display text-xl text-ink-900">
              {formatPrice(property.price)}
              {isRent && <span className="font-sans text-sm text-ink-500"> /mês</span>}
            </p>
            {property.condoFee ? (
              <p className="text-xs text-ink-500">Condomínio {formatPrice(property.condoFee)}</p>
            ) : null}
          </div>
          <span className="text-sm font-medium text-brand-500 transition group-hover:translate-x-1">Ver →</span>
        </div>
      </div>
    </article>
  );
}

function Spec({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <li className="inline-flex items-center gap-1.5">
      <span className="text-ink-500">{icon}</span>
      {label}
    </li>
  );
}
