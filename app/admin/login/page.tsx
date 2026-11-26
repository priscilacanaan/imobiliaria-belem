"use client";

import { useEffect, useState, type FormEvent } from "react";
import Image from "next/image";
import { Eye, EyeOff, Loader2, LockKeyhole, Sparkles } from "lucide-react";
import { demoAccess } from "@/content/admin";
import { photoUrl } from "@/content/images";
import { siteSettings } from "@/content/seed";
import { getSession, signIn } from "@/lib/auth";
import { pageHref } from "@/lib/paths";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Já logado? Vai direto para o painel.
  useEffect(() => {
    if (getSession()) window.location.replace(pageHref("/admin"));
  }, []);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    // Pequena pausa para o feedback de "entrando" ser percebido.
    setTimeout(() => {
      const session = signIn(email, password, remember);
      if (session) {
        window.location.href = pageHref("/admin");
      } else {
        setLoading(false);
        setError("E-mail ou senha incorretos. Confira e tente de novo.");
      }
    }, 450);
  }

  function useDemoAccess() {
    setEmail(demoAccess.email);
    setPassword(demoAccess.password);
    setError("");
  }

  const field =
    "h-12 w-full rounded-[var(--radius-control)] border border-sand-200 bg-paper-raised px-4 text-sm text-ink-900 placeholder:text-ink-500 transition focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10";

  return (
    <main className="grid min-h-screen lg:grid-cols-[1.1fr_1fr]">
      {/* Lado da foto */}
      <section className="relative hidden overflow-hidden bg-night-900 lg:block">
        <Image src={photoUrl("casaPiscina", 2000)} alt="" fill priority sizes="55vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-night-900 via-night-900/40 to-night-900/10" />
        <div className="absolute inset-x-0 bottom-0 p-12 text-white">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/20 px-3 py-1 text-xs uppercase tracking-[0.18em] text-accent-300">
            <Sparkles className="size-3.5" /> Área do corretor
          </p>
          <p className="font-display mt-6 max-w-md text-4xl leading-tight">
            Cadastre, edite e publique imóveis <em className="text-accent-300">em minutos.</em>
          </p>
          <p className="mt-4 max-w-md text-sm text-white/70">
            Tudo o que você muda aqui aparece no site da {siteSettings.brandName}.
          </p>
        </div>
      </section>

      {/* Formulário */}
      <section className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <a href={pageHref("/")} className="font-display text-xl text-ink-900">
            {siteSettings.brandName}
          </a>
          <h1 className="font-display mt-10 text-3xl text-ink-900">Bem-vindo de volta</h1>
          <p className="mt-2 text-sm text-ink-500">Entre com seu e-mail e senha para acessar o painel.</p>

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4" noValidate>
            <div>
              <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-ink-700">E-mail</label>
              <input
                id="email"
                type="email"
                autoComplete="username"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="voce@imobiliaria.com.br"
                className={field}
              />
            </div>

            <div>
              <label htmlFor="senha" className="mb-1.5 block text-xs font-medium text-ink-700">Senha</label>
              <div className="relative">
                <input
                  id="senha"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`${field} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
                  className="absolute right-2 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-lg text-ink-500 hover:bg-sand-100 hover:text-ink-900"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-ink-700">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="size-4 accent-[var(--color-brand-500)]"
              />
              Manter conectado por 30 dias
            </label>

            {error && (
              <p role="alert" className="rounded-[var(--radius-control)] bg-danger/10 px-4 py-3 text-sm text-danger">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !email || !password}
              className="mt-2 inline-flex h-12 items-center justify-center gap-2 rounded-[var(--radius-control)] bg-brand-500 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-600 active:scale-[0.98] disabled:opacity-60"
            >
              {loading ? <Loader2 className="size-4 animate-spin" /> : <LockKeyhole className="size-4" />}
              {loading ? "Entrando…" : "Entrar no painel"}
            </button>
          </form>

          {/* Acesso de demonstração: o site é um portfólio público */}
          <div className="mt-8 rounded-[var(--radius-control)] border border-dashed border-sand-200 bg-sand-100/60 p-4">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-ink-500">Demonstração</p>
            <p className="mt-1 text-sm text-ink-700">
              Este é um site de demonstração. As alterações ficam salvas só neste navegador.
            </p>
            <button
              type="button"
              onClick={useDemoAccess}
              className="mt-3 text-sm font-semibold text-brand-500 hover:text-brand-600"
            >
              Usar acesso de demonstração →
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
