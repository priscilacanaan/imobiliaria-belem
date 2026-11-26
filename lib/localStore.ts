"use client";

// Pequeno "banco" no navegador para o modo demonstração.
// Cada coleção vira uma chave no localStorage; telas abertas se atualizam juntas.
import { useCallback, useEffect, useState } from "react";

export function createLocalStore<T>(key: string, initial: T) {
  const event = `${key}-change`;

  function read(): T {
    if (typeof window === "undefined") return initial;
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  }

  function write(value: T) {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event(event));
  }

  function reset() {
    localStorage.removeItem(key);
    window.dispatchEvent(new Event(event));
  }

  /** 1ª renderização usa o valor inicial (igual ao HTML estático); depois lê o navegador. */
  function useValue() {
    const [value, setValue] = useState<T>(initial);
    const [ready, setReady] = useState(false);
    useEffect(() => {
      const sync = () => setValue(read());
      sync();
      setReady(true);
      window.addEventListener(event, sync);
      window.addEventListener("storage", sync);
      return () => {
        window.removeEventListener(event, sync);
        window.removeEventListener("storage", sync);
      };
    }, []);
    const save = useCallback((next: T) => write(next), []);
    return { value, ready, save };
  }

  return { read, write, reset, useValue };
}
