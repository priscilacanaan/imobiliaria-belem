// Gera a versão estática para o raw.githack na pasta out/.
// O raw.githack serve: https://raw.githack.com/<usuario>/<repo>/<branch>/out/index.html
// por isso o basePath precisa ser "/<usuario>/<repo>/<branch>/out".
//
// Uso: npm run build:githack
// Variáveis opcionais: GITHUB_USER, GITHUB_REPO (padrão imobiliaria-belem), GITHUB_BRANCH (padrão main)
import { execSync } from "node:child_process";

const user = process.env.GITHUB_USER || execSync("gh api user -q .login").toString().trim();
const repo = process.env.GITHUB_REPO || "imobiliaria-belem";
const branch = process.env.GITHUB_BRANCH || "main";
const basePath = `/${user}/${repo}/${branch}/out`;

console.log(`Build estático com basePath ${basePath}`);
execSync("npx next build", {
  stdio: "inherit",
  env: { ...process.env, NEXT_PUBLIC_STATIC_EXPORT: "1", NEXT_PUBLIC_BASE_PATH: basePath },
});
console.log(`\nPronto. Depois do push, abra: https://raw.githack.com${basePath}/index.html`);
