"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Check, Minus, Plus, Save, Star, X } from "lucide-react";
import { AdminShell, Toast, flash, useToast } from "@/components/admin/AdminShell";
import { PropertyCard } from "@/components/site/PropertyCard";
import { cities, neighborhoodsOf, propertyTypeGroups } from "@/content/catalog";
import { photoLabels, photos, photoUrl, type PhotoKey } from "@/content/images";
import { statusLabels, type Property, type PropertyStatus } from "@/content/seed";
import { pageHref } from "@/lib/paths";
import { nextCode, slugify, useProperties } from "@/lib/store";

const tagSuggestions = ["Piscina", "Varanda gourmet", "Vista para a baía", "Mobiliado", "Pet friendly", "Condomínio fechado", "Área gourmet", "Suíte master", "Academia", "Pronto para morar"];

const emptyDraft: Property = {
  id: "",
  slug: "",
  code: "",
  title: "",
  type: "Apartamento",
  purpose: "venda",
  price: 0,
  neighborhood: "",
  city: "Belém",
  area: 0,
  bedrooms: 0,
  bathrooms: 0,
  parking: 0,
  highlight: false,
  status: "ativo",
  tags: [],
  photo: "casaPiscina",
  description: "",
};

const field =
  "h-11 w-full rounded-[var(--radius-control)] border border-sand-200 bg-paper-raised px-4 text-sm text-ink-900 placeholder:text-ink-500 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10";

export function PropertyEditor() {
  const params = useSearchParams();
  const editingId = params.get("id");
  const { properties, ready, upsert } = useProperties();
  const [draft, setDraft] = useState<Property>(emptyDraft);
  const [loaded, setLoaded] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [tagInput, setTagInput] = useState("");
  const [toast, setToast] = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  const original = useMemo(() => properties.find((p) => p.id === editingId), [properties, editingId]);
  const isNew = !editingId;

  // Carrega o imóvel a editar (depois que a lista do navegador estiver pronta).
  useEffect(() => {
    if (!ready || loaded) return;
    if (original) setDraft({ status: "ativo", ...original });
    setLoaded(true);
  }, [ready, loaded, original]);

  // Ctrl+S / Cmd+S salva.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        formRef.current?.requestSubmit();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function set<K extends keyof Property>(key: K, value: Property[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
    setErrors((e) => ({ ...e, [key]: "" }));
  }

  function addTag(tag: string) {
    const t = tag.trim();
    if (!t || draft.tags.includes(t)) return;
    set("tags", [...draft.tags, t]);
    setTagInput("");
  }

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!draft.title.trim()) e.title = "Dê um título ao imóvel.";
    if (!draft.price || draft.price <= 0) e.price = "Informe o valor.";
    if (!draft.city) e.city = "Escolha a cidade.";
    if (!draft.neighborhood) e.neighborhood = "Escolha o bairro.";
    if (!draft.area || draft.area <= 0) e.area = "Informe a área.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) {
      setToast("Confira os campos destacados");
      return;
    }
    const id = draft.id || `p${Date.now()}`;
    const saved: Property = {
      ...draft,
      id,
      title: draft.title.trim(),
      code: draft.code || nextCode(properties),
      slug: draft.slug || `${slugify(draft.title)}-${id.slice(-4)}`,
    };
    upsert(saved);
    flash(isNew ? `Imóvel ${saved.code} cadastrado` : `Alterações salvas em ${saved.code}`);
    window.location.href = pageHref("/admin");
  }

  if (ready && loaded && editingId && !original) {
    return (
      <AdminShell>
        {() => (
          <div className="mx-auto max-w-md py-20 text-center">
            <p className="font-display text-2xl text-ink-900">Imóvel não encontrado</p>
            <a href={pageHref("/admin")} className="mt-4 inline-block text-sm font-medium text-brand-500">← Voltar para a lista</a>
          </div>
        )}
      </AdminShell>
    );
  }

  return (
    <AdminShell active={isNew ? "novo" : undefined}>
      {() => (
        <form ref={formRef} onSubmit={handleSubmit} noValidate className="pb-28">
          <a href={pageHref("/admin")} className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-900">
            <ArrowLeft className="size-4" /> Voltar para a lista
          </a>
          <h1 className="font-display mt-3 text-3xl text-ink-900 md:text-4xl">
            {isNew ? "Novo imóvel" : `Editar ${draft.code}`}
          </h1>

          <div className="mt-8 grid gap-8 xl:grid-cols-[1fr_360px]">
            <div className="flex flex-col gap-6">
              {/* Foto */}
              <Section title="Foto principal" hint="Escolha a foto que aparece no card e no topo da página.">
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-7" role="radiogroup" aria-label="Foto principal">
                  {(Object.keys(photos) as PhotoKey[]).map((key) => (
                    <button
                      key={key}
                      type="button"
                      role="radio"
                      aria-checked={draft.photo === key}
                      aria-label={photoLabels[key]}
                      title={photoLabels[key]}
                      onClick={() => set("photo", key)}
                      className={`relative aspect-square overflow-hidden rounded-xl ring-offset-2 transition ${
                        draft.photo === key ? "ring-2 ring-brand-500" : "opacity-80 hover:opacity-100"
                      }`}
                    >
                      <Image src={photoUrl(key, 300)} alt="" fill sizes="120px" className="object-cover" />
                      {draft.photo === key && (
                        <span className="absolute right-1.5 top-1.5 grid size-6 place-items-center rounded-full bg-brand-500 text-white">
                          <Check className="size-3.5" />
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </Section>

              {/* Informações */}
              <Section title="Informações principais">
                <Field label="Título do anúncio" error={errors.title} htmlFor="title">
                  <input
                    id="title"
                    value={draft.title}
                    onChange={(e) => set("title", e.target.value)}
                    placeholder="Ex.: Apartamento com vista para a baía"
                    className={field}
                    autoFocus={isNew}
                  />
                </Field>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Finalidade">
                    <div className="flex rounded-[var(--radius-control)] border border-sand-200 bg-paper-raised p-1">
                      {(["venda", "aluguel"] as const).map((v) => (
                        <button
                          key={v}
                          type="button"
                          onClick={() => set("purpose", v)}
                          aria-pressed={draft.purpose === v}
                          className={`h-9 flex-1 rounded-lg text-sm font-medium transition ${
                            draft.purpose === v ? "bg-ink-900 text-white" : "text-ink-700 hover:bg-sand-100"
                          }`}
                        >
                          {v === "venda" ? "Venda" : "Aluguel"}
                        </button>
                      ))}
                    </div>
                  </Field>

                  <Field label="Tipo de imóvel" htmlFor="type">
                    <select id="type" value={draft.type} onChange={(e) => set("type", e.target.value as Property["type"])} className={field}>
                      {propertyTypeGroups.map((g) => (
                        <optgroup key={g.label} label={g.label}>
                          {g.types.map((t) => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </Field>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Situação" htmlFor="status">
                    <select
                      id="status"
                      value={draft.status ?? "ativo"}
                      onChange={(e) => set("status", e.target.value as PropertyStatus)}
                      className={field}
                    >
                      {Object.entries(statusLabels).map(([v, l]) => (
                        <option key={v} value={v}>{l}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Destaque na home">
                    <button
                      type="button"
                      onClick={() => set("highlight", !draft.highlight)}
                      aria-pressed={!!draft.highlight}
                      className={`inline-flex h-11 w-full items-center justify-center gap-2 rounded-[var(--radius-control)] border text-sm font-medium transition ${
                        draft.highlight
                          ? "border-accent-400 bg-accent-400/15 text-accent-500"
                          : "border-sand-200 bg-paper-raised text-ink-700 hover:bg-sand-100"
                      }`}
                    >
                      <Star className={`size-4 ${draft.highlight ? "fill-current" : ""}`} />
                      {draft.highlight ? "Em destaque" : "Destacar na home"}
                    </button>
                  </Field>
                </div>
              </Section>

              {/* Valores */}
              <Section title="Valores">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label={draft.purpose === "aluguel" ? "Aluguel mensal (R$)" : "Valor de venda (R$)"} error={errors.price} htmlFor="price">
                    <MoneyInput id="price" value={draft.price} onChange={(v) => set("price", v)} />
                  </Field>
                  <Field label="Condomínio (R$/mês)" htmlFor="condo" hint="Deixe em branco se não houver.">
                    <MoneyInput id="condo" value={draft.condoFee ?? 0} onChange={(v) => set("condoFee", v || undefined)} />
                  </Field>
                </div>
              </Section>

              {/* Localização */}
              <Section title="Localização" hint="O endereço exato não aparece no site; só bairro e cidade.">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Cidade" error={errors.city} htmlFor="city">
                    <select
                      id="city"
                      value={draft.city}
                      onChange={(e) => {
                        set("city", e.target.value);
                        set("neighborhood", "");
                      }}
                      className={field}
                    >
                      <option value="">Escolha a cidade</option>
                      {cities.map((c) => (
                        <option key={c.name} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Bairro" error={errors.neighborhood} htmlFor="bairro">
                    <select
                      id="bairro"
                      value={draft.neighborhood}
                      onChange={(e) => set("neighborhood", e.target.value)}
                      disabled={!draft.city}
                      className={`${field} disabled:opacity-50`}
                    >
                      <option value="">Escolha o bairro</option>
                      {neighborhoodsOf(draft.city).map((n) => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </Field>
                </div>
              </Section>

              {/* Características */}
              <Section title="Características">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <Field label="Área (m²)" error={errors.area} htmlFor="area">
                    <input
                      id="area"
                      inputMode="numeric"
                      value={draft.area || ""}
                      onChange={(e) => set("area", Number(e.target.value.replace(/\D/g, "")) || 0)}
                      placeholder="0"
                      className={field}
                    />
                  </Field>
                  <Stepper label="Quartos" value={draft.bedrooms} onChange={(v) => set("bedrooms", v)} />
                  <Stepper label="Banheiros" value={draft.bathrooms} onChange={(v) => set("bathrooms", v)} />
                  <Stepper label="Vagas" value={draft.parking} onChange={(v) => set("parking", v)} />
                </div>
              </Section>

              {/* Diferenciais */}
              <Section title="Diferenciais" hint="Digite e tecle Enter, ou toque numa sugestão.">
                <div className="flex flex-wrap gap-2">
                  {draft.tags.map((t) => (
                    <span key={t} className="inline-flex items-center gap-1 rounded-full bg-brand-50 py-1.5 pl-3 pr-1.5 text-sm text-brand-700">
                      {t}
                      <button
                        type="button"
                        onClick={() => set("tags", draft.tags.filter((x) => x !== t))}
                        aria-label={`Remover ${t}`}
                        className="grid size-5 place-items-center rounded-full hover:bg-brand-100"
                      >
                        <X className="size-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag(tagInput);
                    }
                  }}
                  aria-label="Novo diferencial"
                  placeholder="Ex.: Varanda gourmet"
                  className={field}
                />
                <div className="flex flex-wrap gap-2">
                  {tagSuggestions
                    .filter((s) => !draft.tags.includes(s))
                    .map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => addTag(s)}
                        className="rounded-full border border-dashed border-sand-200 px-3 py-1 text-xs text-ink-700 hover:border-brand-500 hover:text-brand-600"
                      >
                        + {s}
                      </button>
                    ))}
                </div>
              </Section>

              {/* Descrição */}
              <Section title="Descrição">
                <textarea
                  value={draft.description}
                  onChange={(e) => set("description", e.target.value)}
                  rows={6}
                  maxLength={1200}
                  aria-label="Descrição do imóvel"
                  placeholder="Conte o que torna este imóvel especial: ambientes, acabamento, vizinhança…"
                  className={`${field} h-auto resize-y py-3 leading-relaxed`}
                />
                <p className="text-right text-xs text-ink-500">{draft.description.length}/1200</p>
              </Section>
            </div>

            {/* Prévia ao vivo */}
            <aside className="xl:sticky xl:top-10 xl:self-start">
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.16em] text-ink-500">Prévia no site</p>
              <div className="pointer-events-none">
                <PropertyCard
                  property={{
                    ...draft,
                    title: draft.title || "Título do imóvel",
                    neighborhood: draft.neighborhood || "Bairro",
                    city: draft.city || "Cidade",
                  }}
                />
              </div>
            </aside>
          </div>

          {/* Barra de salvar */}
          <div className="fixed inset-x-0 bottom-0 z-40 border-t border-sand-200 bg-paper/90 backdrop-blur-md lg:left-[248px]">
            <div className="flex items-center justify-end gap-3 px-4 py-3 sm:px-8 lg:px-12">
              <span className="mr-auto hidden text-xs text-ink-500 sm:block">Dica: Ctrl + S salva</span>
              <a href={pageHref("/admin")} className="h-11 rounded-[var(--radius-control)] px-5 text-sm leading-[2.75rem] text-ink-700 hover:bg-sand-100">
                Cancelar
              </a>
              <button
                type="submit"
                className="inline-flex h-11 items-center gap-2 rounded-[var(--radius-control)] bg-brand-500 px-6 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-600 active:scale-[0.98]"
              >
                <Save className="size-4" />
                {isNew ? "Cadastrar imóvel" : "Salvar alterações"}
              </button>
            </div>
          </div>

          <Toast message={toast} />
        </form>
      )}
    </AdminShell>
  );
}

function Section({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <section className="rounded-[var(--radius-card)] bg-paper-raised p-5 shadow-soft sm:p-6">
      <h2 className="font-display text-xl text-ink-900">{title}</h2>
      {hint && <p className="mt-1 text-sm text-ink-500">{hint}</p>}
      <div className="mt-5 flex flex-col gap-4">{children}</div>
    </section>
  );
}

function Field({
  label,
  htmlFor,
  error,
  hint,
  children,
}: {
  label: string;
  htmlFor?: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-xs font-medium text-ink-700">{label}</label>
      {children}
      {error ? (
        <p className="mt-1.5 text-xs text-danger">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-ink-500">{hint}</p>
      ) : null}
    </div>
  );
}

function Stepper({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <p className="mb-1.5 text-xs font-medium text-ink-700">{label}</p>
      <div className="flex h-11 items-center justify-between rounded-[var(--radius-control)] border border-sand-200 bg-paper-raised px-1">
        <button
          type="button"
          onClick={() => onChange(Math.max(0, value - 1))}
          aria-label={`Menos ${label.toLowerCase()}`}
          className="grid size-9 place-items-center rounded-lg text-ink-700 hover:bg-sand-100"
        >
          <Minus className="size-4" />
        </button>
        <span className="font-display text-lg text-ink-900" aria-live="polite">{value}</span>
        <button
          type="button"
          onClick={() => onChange(value + 1)}
          aria-label={`Mais ${label.toLowerCase()}`}
          className="grid size-9 place-items-center rounded-lg text-ink-700 hover:bg-sand-100"
        >
          <Plus className="size-4" />
        </button>
      </div>
    </div>
  );
}

/** Campo de dinheiro: digita só números e mostra com pontos (1.350.000). */
function MoneyInput({ id, value, onChange }: { id: string; value: number; onChange: (v: number) => void }) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-ink-500">R$</span>
      <input
        id={id}
        inputMode="numeric"
        value={value ? value.toLocaleString("pt-BR") : ""}
        onChange={(e) => onChange(Number(e.target.value.replace(/\D/g, "")) || 0)}
        placeholder="0"
        className={`${field} pl-11`}
      />
    </div>
  );
}
