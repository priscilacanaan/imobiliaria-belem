// Monta links internos que funcionam nos dois modos:
// - dev/servidor: "/imoveis"
// - estático (raw.githack): "/usuario/repo/main/out/imoveis.html"
// Use sempre <a href={pageHref(...)}> para páginas internas (não next/link),
// porque o raw.githack só entrega arquivos com o nome exato.

const isStatic = process.env.NEXT_PUBLIC_STATIC_EXPORT === "1";
const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function pageHref(path: string, query?: Record<string, string | undefined>): string {
  let p = path;
  if (isStatic) p = path === "/" ? "/index.html" : `${path}.html`;

  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value) params.set(key, value);
  }
  const qs = params.toString();
  return `${base}${p}${qs ? `?${qs}` : ""}`;
}
