"use client";

import { useState, type FormEvent } from "react";
import { KeyRound, ShieldCheck, Trash2, UserPlus } from "lucide-react";
import { AdminShell, Toast, useToast } from "@/components/admin/AdminShell";
import { roleDescriptions, type AdminUser, type Role } from "@/content/admin";
import { useTeam } from "@/lib/team";

const roles: Role[] = ["Superadmin", "Gestor", "Corretor"];

const roleStyle: Record<Role, string> = {
  Superadmin: "bg-night-900 text-white",
  Gestor: "bg-accent-400/20 text-accent-500",
  Corretor: "bg-brand-50 text-brand-600",
};

const field =
  "h-11 w-full rounded-[var(--radius-control)] border border-sand-200 bg-paper-raised px-4 text-sm text-ink-900 placeholder:text-ink-500 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10";

function randomPassword(): string {
  const chars = "abcdefghjkmnpqrstuvwxyz23456789";
  return Array.from({ length: 10 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

export default function TeamPage() {
  const { users, save } = useTeam();
  const [toast, setToast] = useToast();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "Corretor" as Role });
  const [error, setError] = useState("");

  const activeSupers = users.filter((u) => u.role === "Superadmin" && u.active).length;

  function updateUser(id: string, changes: Partial<AdminUser>) {
    save(users.map((u) => (u.id === id ? { ...u, ...changes } : u)));
  }

  function handleAdd(e: FormEvent) {
    e.preventDefault();
    const email = form.email.trim().toLowerCase();
    if (!form.name.trim() || !email || form.password.length < 6) {
      setError("Preencha nome, e-mail e uma senha com pelo menos 6 caracteres.");
      return;
    }
    if (users.some((u) => u.email.toLowerCase() === email)) {
      setError("Já existe alguém com este e-mail.");
      return;
    }
    save([...users, { id: `u${Date.now()}`, name: form.name.trim(), email, password: form.password, role: form.role, active: true }]);
    setForm({ name: "", email: "", password: "", role: "Corretor" });
    setError("");
    setToast(`${form.name.trim()} foi adicionado à equipe`);
  }

  return (
    <AdminShell active="equipe" requires="equipe">
      {(session) => (
        <>
          <p className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.16em] text-accent-500">
            <ShieldCheck className="size-3.5" /> Superadmin
          </p>
          <h1 className="font-display mt-2 text-3xl text-ink-900 md:text-4xl">Equipe</h1>
          <p className="mt-2 max-w-xl text-sm text-ink-500">
            Quem pode entrar no painel e o que cada pessoa pode fazer.
          </p>

          <div className="mt-8 grid gap-8 xl:grid-cols-[1fr_380px]">
            {/* Lista */}
            <ul className="flex flex-col gap-3">
              {users.map((u) => {
                const isMe = u.email === session.email;
                const lastSuper = u.role === "Superadmin" && u.active && activeSupers <= 1;
                return (
                  <li
                    key={u.id}
                    className={`flex flex-wrap items-center gap-4 rounded-[var(--radius-card)] bg-paper-raised p-4 shadow-soft ${
                      u.active ? "" : "opacity-60"
                    }`}
                  >
                    <span className="grid size-11 shrink-0 place-items-center rounded-full bg-sand-100 font-display text-lg text-ink-900">
                      {u.name.charAt(0)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-ink-900">
                        {u.name} {isMe && <span className="text-xs font-normal text-ink-500">(você)</span>}
                      </p>
                      <p className="truncate text-sm text-ink-500">{u.email}</p>
                    </div>

                    <label className="sr-only" htmlFor={`role-${u.id}`}>Papel de {u.name}</label>
                    <select
                      id={`role-${u.id}`}
                      value={u.role}
                      disabled={isMe || lastSuper}
                      title={isMe ? "Você não pode mudar o seu próprio papel" : roleDescriptions[u.role]}
                      onChange={(e) => {
                        updateUser(u.id, { role: e.target.value as Role });
                        setToast(`${u.name} agora é ${e.target.value}`);
                      }}
                      className={`h-9 rounded-full border-0 px-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:cursor-not-allowed ${roleStyle[u.role]}`}
                    >
                      {roles.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>

                    <button
                      type="button"
                      disabled={isMe || lastSuper}
                      onClick={() => {
                        updateUser(u.id, { active: !u.active });
                        setToast(u.active ? `Acesso de ${u.name} desativado` : `Acesso de ${u.name} reativado`);
                      }}
                      className="h-9 rounded-full border border-sand-200 px-4 text-xs font-medium text-ink-700 transition hover:bg-sand-100 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {u.active ? "Desativar" : "Reativar"}
                    </button>

                    <button
                      type="button"
                      disabled={isMe || lastSuper}
                      title="Remover da equipe"
                      onClick={() => {
                        if (window.confirm(`Remover ${u.name} da equipe? A pessoa não vai mais conseguir entrar.`)) {
                          save(users.filter((x) => x.id !== u.id));
                          setToast(`${u.name} foi removido`);
                        }
                      }}
                      className="grid size-9 place-items-center rounded-full text-ink-500 transition hover:bg-danger/10 hover:text-danger disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <Trash2 className="size-4" />
                      <span className="sr-only">Remover {u.name}</span>
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* Adicionar pessoa */}
            <form onSubmit={handleAdd} noValidate className="self-start rounded-[var(--radius-card)] bg-paper-raised p-6 shadow-soft">
              <h2 className="font-display flex items-center gap-2 text-xl text-ink-900">
                <UserPlus className="size-5 text-brand-500" /> Adicionar pessoa
              </h2>
              <div className="mt-5 flex flex-col gap-4">
                <div>
                  <label htmlFor="novo-nome" className="mb-1.5 block text-xs font-medium text-ink-700">Nome</label>
                  <input id="novo-nome" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nome completo" className={field} />
                </div>
                <div>
                  <label htmlFor="novo-email" className="mb-1.5 block text-xs font-medium text-ink-700">E-mail</label>
                  <input id="novo-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="nome@imobiliaria.com.br" className={field} />
                </div>
                <div>
                  <label htmlFor="novo-senha" className="mb-1.5 block text-xs font-medium text-ink-700">Senha inicial</label>
                  <div className="flex gap-2">
                    <input id="novo-senha" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="mín. 6 caracteres" className={field} />
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, password: randomPassword() })}
                      title="Gerar senha"
                      className="grid size-11 shrink-0 place-items-center rounded-[var(--radius-control)] border border-sand-200 text-ink-700 hover:bg-sand-100"
                    >
                      <KeyRound className="size-4" />
                      <span className="sr-only">Gerar senha</span>
                    </button>
                  </div>
                </div>
                <fieldset>
                  <legend className="mb-1.5 text-xs font-medium text-ink-700">Papel</legend>
                  <div className="flex flex-col gap-2">
                    {roles.map((r) => (
                      <label
                        key={r}
                        className={`flex cursor-pointer items-start gap-3 rounded-[var(--radius-control)] border p-3 transition ${
                          form.role === r ? "border-brand-500 bg-brand-50" : "border-sand-200 hover:bg-sand-100"
                        }`}
                      >
                        <input
                          type="radio"
                          name="novo-papel"
                          checked={form.role === r}
                          onChange={() => setForm({ ...form, role: r })}
                          className="mt-0.5 accent-[var(--color-brand-500)]"
                        />
                        <span>
                          <span className="block text-sm font-medium text-ink-900">{r}</span>
                          <span className="block text-xs text-ink-500">{roleDescriptions[r]}</span>
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                {error && <p role="alert" className="rounded-[var(--radius-control)] bg-danger/10 px-4 py-3 text-sm text-danger">{error}</p>}

                <button
                  type="submit"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-[var(--radius-control)] bg-brand-500 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-600 active:scale-[0.98]"
                >
                  <UserPlus className="size-4" /> Adicionar à equipe
                </button>
                <p className="text-xs text-ink-500">Envie o e-mail e a senha inicial para a pessoa entrar em /admin/login.</p>
              </div>
            </form>
          </div>

          <Toast message={toast} />
        </>
      )}
    </AdminShell>
  );
}
