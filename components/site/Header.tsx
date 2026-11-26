"use client";

import { CircleUserRound } from "lucide-react";
import { useSiteSettings } from "@/lib/team";
import { pageHref } from "@/lib/paths";

// Sobre e Contato entram aqui quando as páginas existirem.
const links = [{ href: pageHref("/imoveis"), label: "Imóveis" }];

export function Header() {
  const { settings: siteSettings } = useSiteSettings();
  return (
    <>
      {/* Aviso de demonstração: o site é público, mas os dados são fictícios */}
      <div className="bg-night-900 px-4 py-2 text-center text-xs text-white/70">
        Site de demonstração · imóveis, preços e contatos são fictícios
      </div>
      <header className="sticky top-0 z-40 border-b border-sand-200/70 bg-paper/80 backdrop-blur-md">
        <div className="container-site flex h-16 items-center justify-between gap-4">
          <a href={pageHref("/")} className="font-display text-lg text-ink-900">
            {siteSettings.brandName}
          </a>
          <nav aria-label="Principal" className="flex items-center gap-3 sm:gap-6">
            {links.map((l) => (
              <a key={l.href} href={l.href} className="text-sm text-ink-700 transition hover:text-ink-900">
                {l.label}
              </a>
            ))}
            {/* Acesso da equipe ao painel */}
            <a
              href={pageHref("/admin/login")}
              className="inline-flex h-9 items-center gap-1.5 rounded-full border border-sand-200 bg-paper-raised px-4 text-sm font-medium text-ink-900 transition hover:border-ink-500"
            >
              <CircleUserRound className="size-4" />
              Entrar
            </a>
            <a
              href={`https://wa.me/${siteSettings.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 items-center rounded-full bg-ink-900 px-4 text-sm font-medium text-white transition hover:bg-ink-700"
            >
              WhatsApp
            </a>
          </nav>
        </div>
      </header>
    </>
  );
}
