"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Pencil, Plus, RotateCcw, Search, Star, Trash2 } from "lucide-react";
import { AdminShell, Toast, useToast } from "@/components/admin/AdminShell";
import { photoUrl } from "@/content/images";
import { statusLabels, type PropertyStatus } from "@/content/seed";
import { formatPrice } from "@/lib/format";
import { pageHref } from "@/lib/paths";
import { useProperties } from "@/lib/store";

const filters: { key: "todos" | PropertyStatus; label: string }[] = [
  { key: "todos", label: "Todos" },
  { key: "ativo", label: "Ativos" },
  { key: "pausado", label: "Pausados" },
  { key: "vendido", label: "Vendidos" },
  { key: "alugado", label: "Alugados" },
];

const statusStyle: Record<PropertyStatus, string> = {
  ativo: "bg-success/10 text-success",
  pausado: "bg-sand-200 text-ink-700",
  vendido: "bg-accent-400/20 text-accent-500",
  alugado: "bg-brand-50 text-brand-600",
};

export default function AdminHome() {
  const { properties, update, remove, reset } = useProperties();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof filters)[number]["key"]>("todos");
  const [toast, setToast] = useToast();

  const stats = useMemo(() => {
    const st = (p: (typeof properties)[number]) => p.status ?? "ativo";
    return [
      { label: "Imóveis cadastrados", value: properties.length },
      { label: "Ativos no site", value: properties.filter((p) => st(p) === "ativo").length },
      { label: "Em destaque", value: properties.filter((p) => p.highlight).length },
      { label: "Vendidos ou alugados", value: properties.filter((p) => ["vendido", "alugado"].includes(st(p))).length },
    ];
  }, [properties]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return properties.filter((p) => {
      if (filter !== "todos" && (p.status ?? "ativo") !== filter) return false;
      if (!q) return true;
      return [p.title, p.code, p.neighborhood, p.city, p.type].some((v) => v.toLowerCase().includes(q));
    });
  }, [properties, query, filter]);

  return (
    <AdminShell active="painel">
      {(session) => (
        <>
          <header className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm text-ink-500">Olá, {session.name.split(" ")[0]} 👋</p>
              <h1 className="font-display mt-1 text-3xl text-ink-900 md:text-4xl">Seus imóveis</h1>
            </div>
            <a
              href={pageHref("/admin/imovel")}
              className="inline-flex h-11 items-center gap-2 rounded-[var(--radius-control)] bg-brand-500 px-5 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-600 active:scale-[0.98]"
            >
              <Plus className="size-4" /> Novo imóvel
            </a>
          </header>

          {/* Números */}
          <dl className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="rounded-[var(--radius-card)] bg-paper-raised p-5 shadow-soft">
                <dt className="text-xs text-ink-500">{s.label}</dt>
                <dd className="font-display mt-2 text-3xl text-ink-900">{s.value}</dd>
              </div>
            ))}
          </dl>

          {/* Busca e filtros */}
          <div className="mt-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative md:w-80">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-ink-500" />
              <label htmlFor="busca" className="sr-only">Buscar imóvel</label>
              <input
                id="busca"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar por título, código ou bairro"
                className="h-11 w-full rounded-full border border-sand-200 bg-paper-raised pl-11 pr-4 text-sm focus:border-brand-500 focus:outline-none"
              />
            </div>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por situação">
              {filters.map((f) => (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setFilter(f.key)}
                  aria-pressed={filter === f.key}
                  className={`h-9 rounded-full px-4 text-sm transition ${
                    filter === f.key ? "bg-ink-900 text-white" : "bg-paper-raised text-ink-700 hover:bg-sand-100"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Lista */}
          <ul className="mt-6 flex flex-col gap-3">
            {visible.map((p) => {
              const status = p.status ?? "ativo";
              return (
                <li
                  key={p.id}
                  className="grid grid-cols-[72px_1fr] items-center gap-4 rounded-[var(--radius-card)] bg-paper-raised p-3 shadow-soft sm:grid-cols-[96px_1fr_auto] sm:p-4"
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-sand-100">
                    <Image src={photoUrl(p.photo, 300)} alt="" fill sizes="96px" className="object-cover" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs text-ink-500">
                      {p.code} · {p.neighborhood}, {p.city}
                    </p>
                    <a
                      href={pageHref("/admin/imovel", { id: p.id })}
                      className="font-display mt-0.5 block truncate text-lg text-ink-900 hover:text-brand-600"
                    >
                      {p.title}
                    </a>
                    <p className="text-sm text-ink-700">
                      {formatPrice(p.price)}
                      {p.purpose === "aluguel" && "/mês"} · {p.type}
                    </p>
                  </div>

                  {/* Ações rápidas */}
                  <div className="col-span-2 flex flex-wrap items-center gap-2 sm:col-span-1 sm:justify-end">
                    <label className="sr-only" htmlFor={`status-${p.id}`}>Situação de {p.title}</label>
                    <select
                      id={`status-${p.id}`}
                      value={status}
                      onChange={(e) => {
                        update(p.id, { status: e.target.value as PropertyStatus });
                        setToast(`Situação alterada: ${statusLabels[e.target.value as PropertyStatus]}`);
                      }}
                      className={`h-9 rounded-full border-0 px-3 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 ${statusStyle[status]}`}
                    >
                      {Object.entries(statusLabels).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={() => {
                        update(p.id, { highlight: !p.highlight });
                        setToast(p.highlight ? "Removido dos destaques" : "Adicionado aos destaques da home");
                      }}
                      aria-pressed={!!p.highlight}
                      title={p.highlight ? "Tirar dos destaques" : "Destacar na home"}
                      className={`grid size-9 place-items-center rounded-full transition ${
                        p.highlight ? "bg-accent-400/20 text-accent-500" : "text-ink-500 hover:bg-sand-100"
                      }`}
                    >
                      <Star className={`size-4 ${p.highlight ? "fill-current" : ""}`} />
                      <span className="sr-only">Destaque</span>
                    </button>

                    <a
                      href={pageHref("/admin/imovel", { id: p.id })}
                      title="Editar"
                      className="grid size-9 place-items-center rounded-full text-ink-500 transition hover:bg-sand-100 hover:text-ink-900"
                    >
                      <Pencil className="size-4" />
                      <span className="sr-only">Editar</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`Excluir "${p.title}"? Esta ação não pode ser desfeita.`)) {
                          remove(p.id);
                          setToast("Imóvel excluído");
                        }
                      }}
                      title="Excluir"
                      className="grid size-9 place-items-center rounded-full text-ink-500 transition hover:bg-danger/10 hover:text-danger"
                    >
                      <Trash2 className="size-4" />
                      <span className="sr-only">Excluir</span>
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>

          {visible.length === 0 && (
            <p className="mt-10 rounded-[var(--radius-card)] border border-dashed border-sand-200 p-10 text-center text-sm text-ink-500">
              Nenhum imóvel encontrado com esse filtro.
            </p>
          )}

          <div className="mt-12 border-t border-sand-200 pt-6">
            <button
              type="button"
              onClick={() => {
                if (window.confirm("Voltar aos 7 imóveis de exemplo? Suas alterações neste navegador serão apagadas.")) {
                  reset();
                  setToast("Imóveis de exemplo restaurados");
                }
              }}
              className="inline-flex items-center gap-2 text-sm text-ink-500 hover:text-ink-900"
            >
              <RotateCcw className="size-4" /> Restaurar imóveis de exemplo
            </button>
          </div>

          <Toast message={toast} />
        </>
      )}
    </AdminShell>
  );
}
