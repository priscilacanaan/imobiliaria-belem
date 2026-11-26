// Contas e permissões da área administrativa — MODO DEMONSTRAÇÃO.
// Atenção: no site estático estas contas ficam visíveis no código do navegador,
// então NÃO são segurança de verdade. Servem para mostrar o painel.
// Na Fase 2 o login passa para o Supabase Auth (senha com hash no servidor).

export type Role = "Superadmin" | "Gestor" | "Corretor";

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  active: boolean;
};

export const roleDescriptions: Record<Role, string> = {
  Superadmin: "Tudo: imóveis, equipe e configurações do site",
  Gestor: "Imóveis, inclusive excluir",
  Corretor: "Cadastrar e editar imóveis",
};

export type Permission = "imoveis.editar" | "imoveis.excluir" | "equipe" | "configuracoes";

const permissions: Record<Role, Permission[]> = {
  Superadmin: ["imoveis.editar", "imoveis.excluir", "equipe", "configuracoes"],
  Gestor: ["imoveis.editar", "imoveis.excluir"],
  Corretor: ["imoveis.editar"],
};

export function can(role: string | undefined, permission: Permission): boolean {
  return !!role && (permissions[role as Role] ?? []).includes(permission);
}

export const demoUsers: AdminUser[] = [
  { id: "u1", name: "Diretoria (Superadmin)", email: "superadmin@demo.imobiliariabelem.com", password: "belem2026", role: "Superadmin", active: true },
  { id: "u2", name: "Gestão Comercial", email: "gestor@demo.imobiliariabelem.com", password: "belem2026", role: "Gestor", active: true },
  { id: "u3", name: "Ana Corretora", email: "corretor@demo.imobiliariabelem.com", password: "belem2026", role: "Corretor", active: true },
];

/** Contas dos botões de acesso rápido na tela de login. */
export const demoAccess = {
  Superadmin: demoUsers[0],
  Corretor: demoUsers[2],
};
