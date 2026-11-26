"use client";

import { useEffect, useState, type FormEvent } from "react";
import { RotateCcw, Save, ShieldCheck } from "lucide-react";
import { AdminShell, Toast, useToast } from "@/components/admin/AdminShell";
import { siteSettings as defaultSettings } from "@/content/seed";
import { pageHref } from "@/lib/paths";
import { settingsStore, teamStore, useSiteSettings, type SiteSettings } from "@/lib/team";

const field =
  "h-11 w-full rounded-[var(--radius-control)] border border-sand-200 bg-paper-raised px-4 text-sm text-ink-900 placeholder:text-ink-500 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10";

const fields: { key: keyof SiteSettings; label: string; hint?: string; placeholder?: string }[] = [
  { key: "brandName", label: "Nome da imobiliária", hint: "Aparece no topo e no rodapé do site." },
  { key: "tagline", label: "Frase de apresentação", hint: "Aparece no rodapé." },
  { key: "phone", label: "Telefone", placeholder: "+55 91 0000-0000" },
  { key: "whatsapp", label: "WhatsApp (só números, com DDI e DDD)", placeholder: "5591900000000", hint: "Usado em todos os botões de WhatsApp do site." },
  { key: "email", label: "E-mail de contato" },
  { key: "city", label: "Cidade", placeholder: "Belém, PA" },
];

export default function SettingsPage() {
  const { settings, ready, save } = useSiteSettings();
  const [draft, setDraft] = useState<SiteSettings>(settings);
  const [toast, setToast] = useToast();

  useEffect(() => {
    if (ready) setDraft(settings);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    save({ ...draft, whatsapp: draft.whatsapp.replace(/\D/g, "") });
    setToast("Configurações salvas. O site já foi atualizado.");
  }

  return (
    <AdminShell active="configuracoes" requires="configuracoes">
      {() => (
        <>
          <p className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.16em] text-accent-500">
            <ShieldCheck className="size-3.5" /> Superadmin
          </p>
          <h1 className="font-display mt-2 text-3xl text-ink-900 md:text-4xl">Configurações do site</h1>
          <p className="mt-2 max-w-xl text-sm text-ink-500">Dados da imobiliária que aparecem para os visitantes.</p>

          <div className="mt-8 grid gap-8 xl:grid-cols-[1fr_380px]">
            <form onSubmit={handleSubmit} className="rounded-[var(--radius-card)] bg-paper-raised p-6 shadow-soft">
              <div className="grid gap-5 sm:grid-cols-2">
                {fields.map((f) => (
                  <div key={f.key} className={f.key === "tagline" ? "sm:col-span-2" : ""}>
                    <label htmlFor={`cfg-${f.key}`} className="mb-1.5 block text-xs font-medium text-ink-700">{f.label}</label>
                    <input
                      id={`cfg-${f.key}`}
                      value={draft[f.key]}
                      onChange={(e) => setDraft({ ...draft, [f.key]: e.target.value })}
                      placeholder={f.placeholder}
                      className={field}
                    />
                    {f.hint && <p className="mt-1.5 text-xs text-ink-500">{f.hint}</p>}
                  </div>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-sand-200 pt-6">
                <button
                  type="submit"
                  className="inline-flex h-11 items-center gap-2 rounded-[var(--radius-control)] bg-brand-500 px-6 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-600 active:scale-[0.98]"
                >
                  <Save className="size-4" /> Salvar configurações
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDraft(defaultSettings);
                    settingsStore.reset();
                    setToast("Configurações padrão restauradas");
                  }}
                  className="inline-flex h-11 items-center gap-2 rounded-[var(--radius-control)] px-4 text-sm text-ink-700 hover:bg-sand-100"
                >
                  <RotateCcw className="size-4" /> Restaurar padrão
                </button>
                <a href={pageHref("/")} target="_blank" rel="noopener noreferrer" className="ml-auto text-sm font-medium text-brand-500 hover:text-brand-600">
                  Ver o site →
                </a>
              </div>
            </form>

            {/* Prévia do rodapé */}
            <aside className="self-start">
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.16em] text-ink-500">Prévia do rodapé</p>
              <div className="rounded-[var(--radius-card)] bg-sand-100 p-6">
                <p className="font-display text-xl text-ink-900">{draft.brandName || "Nome da imobiliária"}</p>
                <p className="mt-2 text-sm text-ink-700">{draft.tagline}</p>
                <div className="mt-4 text-sm text-ink-700">
                  <p>{draft.phone}</p>
                  <p>{draft.email}</p>
                  <p>{draft.city}</p>
                </div>
              </div>

              <div className="mt-8 rounded-[var(--radius-card)] border border-dashed border-sand-200 p-5">
                <p className="text-sm font-medium text-ink-900">Dados de demonstração</p>
                <p className="mt-1 text-xs text-ink-500">Volta imóveis, equipe e configurações ao estado inicial neste navegador.</p>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm("Restaurar tudo para os dados de exemplo? As alterações feitas neste navegador serão apagadas.")) {
                      localStorage.removeItem("ib-properties-v1");
                      window.dispatchEvent(new Event("ib-properties-change"));
                      teamStore.reset();
                      settingsStore.reset();
                      setDraft(defaultSettings);
                      setToast("Tudo restaurado para os dados de exemplo");
                    }
                  }}
                  className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-danger hover:underline"
                >
                  <RotateCcw className="size-4" /> Restaurar tudo
                </button>
              </div>
            </aside>
          </div>

          <Toast message={toast} />
        </>
      )}
    </AdminShell>
  );
}
