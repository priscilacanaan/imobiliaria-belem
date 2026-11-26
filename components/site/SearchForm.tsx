"use client";

import { useState } from "react";
import { cities, neighborhoodsOf, propertyTypeGroups } from "@/content/catalog";
import { pageHref } from "@/lib/paths";

export type SearchValues = {
  purpose?: string;
  type?: string;
  city?: string;
  neighborhood?: string;
};

/**
 * Busca em GET: a URL fica compartilhável (/imoveis?purpose=venda&cidade=Belém&bairro=Umarizal).
 * O bairro mostra só os bairros da cidade escolhida.
 * variant "hero" = versão escura da home; "bar" = versão clara da listagem.
 */
export function SearchForm({
  values = {},
  variant = "hero",
}: {
  values?: SearchValues;
  variant?: "hero" | "bar";
}) {
  const [city, setCity] = useState(values.city ?? "");
  const [neighborhood, setNeighborhood] = useState(values.neighborhood ?? "");
  const purpose = values.purpose ?? "venda";
  const isHero = variant === "hero";
  const cityNeighborhoods = neighborhoodsOf(city);

  const fieldClass = isHero
    ? "h-12 w-full rounded-[var(--radius-control)] border border-white/15 bg-white/5 px-4 text-sm text-white focus:border-accent-400 focus:outline-none disabled:opacity-50 [&>option]:text-ink-900 [&>optgroup]:text-ink-900"
    : "h-12 w-full rounded-[var(--radius-control)] border border-sand-200 bg-paper-raised px-4 text-sm text-ink-900 focus:border-brand-500 focus:outline-none disabled:opacity-50";

  return (
    <form
      action={pageHref("/imoveis")}
      method="get"
      role="search"
      aria-label="Buscar imóveis"
      className={
        isHero
          ? "flex flex-col gap-3 rounded-[1.5rem] border border-white/10 bg-night-900/60 p-3 shadow-lift backdrop-blur-md md:p-4"
          : "flex flex-col gap-3 rounded-[var(--radius-card)] bg-paper-raised p-4 shadow-soft"
      }
    >
      {/* Finalidade: comprar ou alugar */}
      <fieldset
        className={`flex shrink-0 rounded-full border p-1 md:w-fit ${isHero ? "border-white/10" : "border-sand-200"}`}
      >
        <legend className="sr-only">Finalidade</legend>
        {[
          { value: "venda", label: "Comprar" },
          { value: "aluguel", label: "Alugar" },
        ].map((opt) => (
          <label key={opt.value} className="relative flex-1 cursor-pointer">
            <input
              type="radio"
              name="purpose"
              value={opt.value}
              defaultChecked={purpose === opt.value}
              className="peer sr-only"
            />
            <span
              className={`flex h-10 items-center justify-center rounded-full px-5 text-sm font-medium transition peer-checked:bg-accent-400 peer-checked:text-night-900 peer-focus-visible:outline-2 peer-focus-visible:outline-accent-300 ${
                isHero ? "text-white/80 hover:text-white" : "text-ink-700 hover:text-ink-900"
              }`}
            >
              {opt.label}
            </span>
          </label>
        ))}
      </fieldset>

      <div className="grid flex-1 gap-3 md:grid-cols-2 lg:grid-cols-[1.1fr_1fr_1fr_auto]">
        <label className="sr-only" htmlFor={`type-${variant}`}>Tipo de imóvel</label>
        <select id={`type-${variant}`} name="type" defaultValue={values.type ?? ""} className={fieldClass}>
          <option value="">Todos os tipos</option>
          {propertyTypeGroups.map((group) => (
            <optgroup key={group.label} label={group.label}>
              {group.types.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </optgroup>
          ))}
        </select>

        <label className="sr-only" htmlFor={`cidade-${variant}`}>Cidade</label>
        <select
          id={`cidade-${variant}`}
          name="cidade"
          value={city}
          onChange={(e) => {
            setCity(e.target.value);
            setNeighborhood("");
          }}
          className={fieldClass}
        >
          <option value="">Toda a Grande Belém</option>
          {cities.map((c) => (
            <option key={c.name} value={c.name}>{c.name}</option>
          ))}
        </select>

        <label className="sr-only" htmlFor={`bairro-${variant}`}>Bairro</label>
        <select
          id={`bairro-${variant}`}
          name="bairro"
          value={neighborhood}
          onChange={(e) => setNeighborhood(e.target.value)}
          disabled={!city}
          className={fieldClass}
        >
          <option value="">{city ? "Todos os bairros" : "Escolha a cidade primeiro"}</option>
          {cityNeighborhoods.map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>

        <button
          type="submit"
          className={`inline-flex h-12 items-center justify-center gap-2 rounded-[var(--radius-control)] px-6 text-sm font-semibold transition duration-200 active:scale-[0.98] ${
            isHero ? "bg-accent-400 text-night-900 hover:bg-accent-300" : "bg-brand-500 text-white hover:bg-brand-600"
          }`}
        >
          Buscar imóveis
        </button>
      </div>
    </form>
  );
}
