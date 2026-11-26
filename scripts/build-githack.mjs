// Gera a versão estática para o raw.githack na pasta out/.
// O raw.githack serve: https://raw.githack.com/<usuario>/<repo>/<branch>/out/index.html
// por isso o basePath precisa ser "/<usuario>/<repo>/<branch>/out".
//
// Uso: npm run build:githack
// Variáveis opcionais: GITHUB_USER, GITHUB_REPO (padrão imobiliaria-belem), GITHUB_BRANCH (padrão main)
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const user = process.env.GITHUB_USER || execSync("gh api user -q .login").toString().trim();
const repo = process.env.GITHUB_REPO || "imobiliaria-belem";
const branch = process.env.GITHUB_BRANCH || "main";
const basePath = `/${user}/${repo}/${branch}/out`;

console.log(`Build estático com basePath ${basePath}`);
execSync("npx next build", {
  stdio: "inherit",
  env: { ...process.env, NEXT_PUBLIC_STATIC_EXPORT: "1", NEXT_PUBLIC_BASE_PATH: basePath },
});

// O build estático usa a pasta .next-export (ver next.config.mjs); o site vai para out/.
// Mantemos os arquivos de out/_next/static das versões anteriores: o raw.githack
// guarda cada arquivo em cache separado e uma página antiga em cache ainda pode
// pedir o CSS/JS antigo. Os nomes têm hash, então não há conflito.
// (Cópia arquivo a arquivo: fs.cpSync falha no Windows com acento no caminho.)
function copyMissing(from, to) {
  fs.mkdirSync(to, { recursive: true });
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    const src = path.join(from, entry.name);
    const dest = path.join(to, entry.name);
    if (entry.isDirectory()) copyMissing(src, dest);
    else if (!fs.existsSync(dest)) fs.copyFileSync(src, dest);
  }
}

const oldStatic = path.join("out", "_next", "static");
const keep = ".static-anterior";
fs.rmSync(keep, { recursive: true, force: true });
if (fs.existsSync(oldStatic)) copyMissing(oldStatic, keep);
fs.rmSync("out", { recursive: true, force: true });
fs.renameSync(".next-export", "out");
if (fs.existsSync(keep)) {
  copyMissing(keep, oldStatic);
  fs.rmSync(keep, { recursive: true, force: true });
}

console.log(`\nPronto. Depois do push, abra: https://raw.githack.com${basePath}/index.html`);
