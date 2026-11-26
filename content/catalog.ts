// Catálogo fixo do sistema: tipos de imóvel, cidades e bairros.
// Na Fase 2 estas listas viram tabelas editáveis no painel admin.

// ---------------------------------------------------------------
// Tipos de imóvel (agrupados como nos grandes portais)
// ---------------------------------------------------------------
export const propertyTypeGroups = [
  {
    label: "Residencial",
    types: [
      "Apartamento",
      "Casa",
      "Casa em condomínio",
      "Cobertura",
      "Flat",
      "Kitnet / Studio",
      "Sobrado",
      "Terreno",
      "Lote em condomínio",
    ],
  },
  {
    label: "Comercial",
    types: ["Sala comercial", "Loja / Ponto comercial", "Galpão", "Prédio comercial", "Terreno comercial"],
  },
  {
    label: "Rural",
    types: ["Chácara", "Sítio", "Fazenda"],
  },
] as const;

export type PropertyType = (typeof propertyTypeGroups)[number]["types"][number];

export const propertyTypes: PropertyType[] = propertyTypeGroups.flatMap((g) => [...g.types]);

// ---------------------------------------------------------------
// Cidades e bairros — Região Metropolitana de Belém (PA)
// Lista inicial para demonstração: validar com a imobiliária.
// Distritos de Belém (Icoaraci, Mosqueiro, Outeiro) aparecem como
// bairros porque é assim que o cliente costuma buscar.
// ---------------------------------------------------------------
export type City = { name: string; uf: "PA"; neighborhoods: string[] };

const sortPt = (list: string[]) => [...list].sort((a, b) => a.localeCompare(b, "pt-BR"));

export const cities: City[] = [
  {
    name: "Belém",
    uf: "PA",
    neighborhoods: sortPt([
      "Barreiro",
      "Batista Campos",
      "Bengui",
      "Cabanagem",
      "Campina",
      "Canudos",
      "Castanheira",
      "Cidade Velha",
      "Condor",
      "Coqueiro",
      "Cremação",
      "Curió-Utinga",
      "Fátima",
      "Guamá",
      "Icoaraci",
      "Jurunas",
      "Mangueirão",
      "Maracangalha",
      "Marambaia",
      "Marco",
      "Miramar",
      "Montese (Terra Firme)",
      "Mosqueiro",
      "Nazaré",
      "Outeiro",
      "Parque Verde",
      "Pedreira",
      "Pratinha",
      "Reduto",
      "Sacramenta",
      "São Brás",
      "São Clemente",
      "Souza",
      "Tapanã",
      "Telégrafo",
      "Tenoné",
      "Umarizal",
      "Una",
      "Universitário",
      "Val-de-Cães",
    ]),
  },
  {
    name: "Ananindeua",
    uf: "PA",
    neighborhoods: sortPt([
      "Águas Brancas",
      "Águas Lindas",
      "Atalaia",
      "Centro",
      "Cidade Nova",
      "Coqueiro",
      "Curuçambá",
      "Distrito Industrial",
      "Guanabara",
      "Icuí-Guajará",
      "Jaderlândia",
      "Júlia Seffer",
      "Levilândia",
      "Maguari",
      "PAAR",
      "Quarenta Horas",
    ]),
  },
  {
    name: "Marituba",
    uf: "PA",
    neighborhoods: sortPt(["Almir Gabriel", "Centro", "Decouville", "Dom Aristides", "Nova Marituba", "São João", "Uriboca"]),
  },
  {
    name: "Benevides",
    uf: "PA",
    neighborhoods: sortPt(["Benfica", "Centro", "Murinin"]),
  },
  {
    name: "Santa Bárbara do Pará",
    uf: "PA",
    neighborhoods: ["Centro"],
  },
  {
    name: "Santa Izabel do Pará",
    uf: "PA",
    neighborhoods: ["Centro"],
  },
  {
    name: "Castanhal",
    uf: "PA",
    neighborhoods: sortPt(["Centro", "Estrela", "Ianetama", "Nova Olinda"]),
  },
  {
    name: "Barcarena",
    uf: "PA",
    neighborhoods: sortPt(["Centro", "Vila dos Cabanos"]),
  },
];

export const cityNames = cities.map((c) => c.name);

export function neighborhoodsOf(cityName?: string): string[] {
  return cities.find((c) => c.name === cityName)?.neighborhoods ?? [];
}
