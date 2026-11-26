// Contas da área do corretor — MODO DEMONSTRAÇÃO.
// Atenção: no site estático estas contas ficam visíveis no código do navegador,
// então NÃO são segurança de verdade. Servem para mostrar o painel.
// Na Fase 2 o login passa para o Supabase Auth (senha com hash no servidor)
// e este arquivo deixa de existir.

export type AdminUser = {
  name: string;
  email: string;
  password: string;
  role: "Corretor" | "Gestor";
};

export const demoUsers: AdminUser[] = [
  { name: "Ana Corretora", email: "corretor@demo.imobiliariabelem.com", password: "belem2026", role: "Corretor" },
  { name: "Gestão", email: "gestor@demo.imobiliariabelem.com", password: "belem2026", role: "Gestor" },
];

/** Conta preenchida pelo botão "Usar acesso de demonstração" na tela de login. */
export const demoAccess = demoUsers[0];
