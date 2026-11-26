// Sessão da área do corretor (modo demonstração, guardada no navegador).
// Mesma interface que o Supabase Auth terá na Fase 2: signIn, getSession, signOut.
import { teamStore } from "@/lib/team";

export type Session = { name: string; email: string; role: string; expiresAt: number };

const KEY = "ib-admin-session";
const HOURS_SHORT = 8;
const DAYS_REMEMBER = 30;

export type SignInResult = { session: Session } | { error: string };

export function signIn(email: string, password: string, remember: boolean): SignInResult {
  const user = teamStore
    .read()
    .find((u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password);
  if (!user) return { error: "E-mail ou senha incorretos. Confira e tente de novo." };
  if (!user.active) return { error: "Este acesso está desativado. Fale com o administrador." };
  const ms = remember ? DAYS_REMEMBER * 24 * 3600 * 1000 : HOURS_SHORT * 3600 * 1000;
  const session: Session = { name: user.name, email: user.email, role: user.role, expiresAt: Date.now() + ms };
  localStorage.setItem(KEY, JSON.stringify(session));
  return { session };
}

export function getSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as Session;
    if (session.expiresAt < Date.now()) {
      localStorage.removeItem(KEY);
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function signOut(): void {
  localStorage.removeItem(KEY);
}
