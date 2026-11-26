"use client";

// Equipe (usuários do painel) e configurações do site — modo demonstração.
import { demoUsers, type AdminUser } from "@/content/admin";
import { siteSettings as defaultSettings } from "@/content/seed";
import { createLocalStore } from "@/lib/localStore";

export type SiteSettings = typeof defaultSettings;

export const teamStore = createLocalStore<AdminUser[]>("ib-team-v1", demoUsers);
export const settingsStore = createLocalStore<SiteSettings>("ib-settings-v1", defaultSettings);

export function useTeam() {
  const { value, ready, save } = teamStore.useValue();
  return { users: value, ready, save };
}

/** Configurações do site com as alterações do superadmin aplicadas. */
export function useSiteSettings() {
  const { value, ready, save } = settingsStore.useValue();
  return { settings: { ...defaultSettings, ...value }, ready, save };
}
