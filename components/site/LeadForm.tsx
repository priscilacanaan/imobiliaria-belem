"use client";

import { useState, type FormEvent } from "react";

/**
 * Formulário de interesse no imóvel.
 * Por enquanto só confirma na tela; na Fase 2 o lead é gravado no banco (tabela `leads`).
 * Proteções: campo honeypot escondido contra robôs e aceite LGPD obrigatório.
 */
export function LeadForm({ propertyCode, propertyTitle }: { propertyCode: string; propertyTitle: string }) {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    // Robôs preenchem o campo escondido; pessoas não.
    if (data.get("website")) return;
    setSent(true);
  }

  if (sent) {
    return (
      <div role="status" className="rounded-[var(--radius-control)] bg-brand-50 p-5 text-sm text-brand-700">
        <p className="font-display text-lg">Recebemos seu contato.</p>
        <p className="mt-1">Um corretor responde em breve sobre o imóvel {propertyCode}.</p>
      </div>
    );
  }

  const field =
    "w-full rounded-[var(--radius-control)] border border-sand-200 bg-paper-raised px-4 text-sm text-ink-900 placeholder:text-ink-500 focus:border-brand-500 focus:outline-none";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3" aria-label="Tenho interesse neste imóvel">
      <label className="sr-only" htmlFor="lead-nome">Nome</label>
      <input id="lead-nome" name="nome" required autoComplete="name" placeholder="Seu nome" className={`${field} h-11`} />

      <label className="sr-only" htmlFor="lead-telefone">Telefone</label>
      <input
        id="lead-telefone"
        name="telefone"
        type="tel"
        required
        autoComplete="tel"
        placeholder="Telefone / WhatsApp"
        className={`${field} h-11`}
      />

      <label className="sr-only" htmlFor="lead-email">E-mail</label>
      <input
        id="lead-email"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="E-mail (opcional)"
        className={`${field} h-11`}
      />

      <label className="sr-only" htmlFor="lead-mensagem">Mensagem</label>
      <textarea
        id="lead-mensagem"
        name="mensagem"
        rows={3}
        defaultValue={`Olá! Tenho interesse no imóvel ${propertyCode} (${propertyTitle}). Gostaria de agendar uma visita.`}
        className={`${field} resize-none py-3`}
      />

      {/* Honeypot: escondido de pessoas e leitores de tela */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="lead-website">Não preencha</label>
        <input id="lead-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <label className="flex items-start gap-2 text-xs leading-relaxed text-ink-700">
        <input type="checkbox" name="lgpd" required className="mt-0.5 size-4 accent-[var(--color-brand-500)]" />
        Autorizo o contato da imobiliária sobre este imóvel e concordo com o uso dos meus dados para esse fim (LGPD).
      </label>

      <button
        type="submit"
        className="inline-flex h-12 items-center justify-center rounded-[var(--radius-control)] bg-brand-500 px-6 text-sm font-semibold text-white transition hover:bg-brand-600 active:scale-[0.98]"
      >
        Quero agendar uma visita
      </button>
    </form>
  );
}
