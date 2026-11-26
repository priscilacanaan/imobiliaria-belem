"use client";

// Fonte de dados dos imóveis — MODO DEMONSTRAÇÃO.
// Começa com os imóveis de exemplo (content/seed.ts) e guarda as alterações
// do painel no navegador (localStorage). Na Fase 2 estas funções passam a
// ler e gravar no Supabase, sem mudar as telas.
import { useCallback, useEffect, useState } from "react";
import { properties as seedProperties, type Property } from "@/content/seed";

const KEY = "ib-properties-v1";
const EVENT = "ib-properties-change";

function read(): Property[] {
  if (typeof window === "undefined") return seedProperties;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Property[]) : seedProperties;
  } catch {
    return seedProperties;
  }
}

function write(list: Property[]) {
  localStorage.setItem(KEY, JSON.stringify(list));
  window.dispatchEvent(new Event(EVENT));
}

export function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

export function nextCode(list: Property[]): string {
  const max = list.reduce((m, p) => Math.max(m, Number(p.code.replace(/\D/g, "")) || 0), 1000);
  return `IB-${max + 1}`;
}

/** Hook usado pelo site e pelo painel. A 1ª renderização usa o seed (igual ao HTML estático). */
export function useProperties() {
  const [list, setList] = useState<Property[]>(seedProperties);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sync = () => setList(read());
    sync();
    setReady(true);
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync); // outras abas
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const upsert = useCallback((property: Property) => {
    const current = read();
    const exists = current.some((p) => p.id === property.id);
    write(exists ? current.map((p) => (p.id === property.id ? property : p)) : [property, ...current]);
  }, []);

  const update = useCallback((id: string, changes: Partial<Property>) => {
    write(read().map((p) => (p.id === id ? { ...p, ...changes } : p)));
  }, []);

  const remove = useCallback((id: string) => {
    write(read().filter((p) => p.id !== id));
  }, []);

  const reset = useCallback(() => {
    localStorage.removeItem(KEY);
    window.dispatchEvent(new Event(EVENT));
  }, []);

  return { properties: list, ready, upsert, update, remove, reset };
}
