"use client";

import { useEffect, useState, type ReactNode } from "react";
import { ExternalLink, LayoutGrid, LogOut, Plus, Settings, ShieldCheck, Users } from "lucide-react";
import { can, type Permission } from "@/content/admin";
import { useSiteSettings } from "@/lib/team";
import { getSession, signOut, type Session } from "@/lib/auth";
import { pageHref } from "@/lib/paths";

type NavKey = "painel" | "novo" | "equipe" | "configuracoes";

/** Moldura do painel: confere a sessão, mostra o menu e o conteúdo. */
export function AdminShell({
  active,
  requires,
  children,
}: {
  active?: NavKey;
  /** Permissão exigida para ver a página (ex.: "equipe"). Sem ela, volta para a lista. */
  requires?: Permission;
  children: (session: Session) => ReactNode;
}) {
  const [session, setSession] = useState<Session | null>(null);
  const { settings: siteSettings } = useSiteSettings();

  useEffect(() => {
    const s = getSession();
    if (!s) window.location.replace(pageHref("/admin/login"));
    else if (requires && !can(s.role, requires)) window.location.replace(pageHref("/admin"));
    else setSession(s);
  }, [requires]);

  if (!session) {
    return <div className="grid min-h-screen place-items-center text-sm text-ink-500">Carregando painel…</div>;
  }

  const nav = [
    { key: "painel" as const, href: pageHref("/admin"), label: "Imóveis", icon: LayoutGrid },
    { key: "novo" as const, href: pageHref("/admin/imovel"), label: "Novo imóvel", icon: Plus },
    ...(can(session.role, "equipe")
      ? [{ key: "equipe" as const, href: pageHref("/admin/equipe"), label: "Equipe", icon: Users }]
      : []),
    ...(can(session.role, "configuracoes")
      ? [{ key: "configuracoes" as const, href: pageHref("/admin/configuracoes"), label: "Configurações", icon: Settings }]
      : []),
  ];
  const isSuper = session.role === "Superadmin";

  function handleSignOut() {
    signOut();
    window.location.href = pageHref("/admin/login");
  }

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[248px_1fr]">
      {/* Menu lateral (desktop) / barra superior (celular) */}
      <aside className="sticky top-0 z-30 flex items-center justify-between gap-4 bg-night-900 px-4 py-3 text-white lg:h-screen lg:flex-col lg:items-stretch lg:justify-start lg:px-5 lg:py-8">
        <a href={pageHref("/admin")} className="font-display shrink-0 whitespace-nowrap text-lg leading-tight">
          {siteSettings.brandName}
          <span className="hidden text-xs font-sans uppercase tracking-[0.16em] text-accent-300 lg:block">
            {isSuper ? "Superadmin" : "Painel do corretor"}
          </span>
        </a>

        <nav aria-label="Painel" className="flex gap-1 lg:mt-10 lg:flex-col">
          {nav.map(({ key, href, label, icon: Icon }) => (
            <a
              key={key}
              href={href}
              aria-current={active === key ? "page" : undefined}
              aria-label={label}
              title={label}
              className={`inline-flex items-center gap-3 rounded-[var(--radius-control)] px-3 py-2.5 text-sm transition ${
                active === key ? "bg-white/10 text-white" : "text-white/65 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon className="size-4" />
              <span className="hidden whitespace-nowrap lg:inline">{label}</span>
            </a>
          ))}
          <a
            href={pageHref("/")}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Ver site"
            title="Ver site"
            className="inline-flex items-center gap-3 rounded-[var(--radius-control)] px-3 py-2.5 text-sm text-white/65 transition hover:bg-white/5 hover:text-white"
          >
            <ExternalLink className="size-4" />
            <span className="hidden whitespace-nowrap lg:inline">Ver site</span>
          </a>
        </nav>

        <div className="flex items-center gap-3 lg:mt-auto lg:border-t lg:border-white/10 lg:pt-6">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-accent-400 text-sm font-semibold text-night-900">
            {session.name.charAt(0)}
          </span>
          <div className="hidden min-w-0 flex-1 lg:block">
            <p className="truncate text-sm">{session.name}</p>
            <p className="flex items-center gap-1 truncate text-xs text-white/50">
              {isSuper && <ShieldCheck className="size-3 text-accent-300" />}
              {session.role}
            </p>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            aria-label="Sair"
            title="Sair"
            className="grid size-9 place-items-center rounded-lg text-white/65 transition hover:bg-white/10 hover:text-white"
          >
            <LogOut className="size-4" />
          </button>
        </div>
      </aside>

      <main className="min-w-0 bg-paper px-4 py-8 sm:px-8 lg:px-12 lg:py-10">{children(session)}</main>
    </div>
  );
}

/** Aviso rápido no canto da tela. */
export function Toast({ message }: { message: string }) {
  if (!message) return null;
  return (
    <div
      role="status"
      className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-night-900 px-5 py-3 text-sm text-white shadow-lift"
    >
      {message}
    </div>
  );
}

/** Guarda um aviso para mostrar na próxima tela (ex.: "Imóvel salvo" depois de voltar à lista). */
export function flash(message: string) {
  sessionStorage.setItem("ib-flash", message);
}

export function useToast() {
  const [message, setMessage] = useState("");
  useEffect(() => {
    const pending = sessionStorage.getItem("ib-flash");
    if (pending) {
      sessionStorage.removeItem("ib-flash");
      setMessage(pending);
    }
  }, []);
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(""), 2200);
    return () => clearTimeout(t);
  }, [message]);
  return [message, setMessage] as const;
}
