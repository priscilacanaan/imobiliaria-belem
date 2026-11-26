// Dados de exemplo (fictícios). Trocar por Supabase na Fase 2.
import type { PropertyType } from "./catalog";
import type { PhotoKey } from "./images";

export type { PropertyType };
export type Purpose = "venda" | "aluguel";
export type PropertyStatus = "ativo" | "pausado" | "vendido" | "alugado";

export const statusLabels: Record<PropertyStatus, string> = {
  ativo: "Ativo no site",
  pausado: "Pausado",
  vendido: "Vendido",
  alugado: "Alugado",
};

export type Property = {
  id: string;
  slug: string;
  title: string;
  type: PropertyType;
  purpose: Purpose;
  price: number;
  condoFee?: number;
  neighborhood: string;
  city: string;
  area: number;
  bedrooms: number;
  bathrooms: number;
  parking: number;
  highlight?: boolean;
  /** Só imóveis "ativo" aparecem no site. Padrão: ativo. */
  status?: PropertyStatus;
  tags: string[];
  photo: PhotoKey;
  /** Código interno exibido ao cliente (ex.: "IB-1001"). */
  code: string;
  description: string;
};

export function findProperty(slug: string): Property | undefined {
  return properties.find((p) => p.slug === slug);
}

export function isPublished(p: Property): boolean {
  return (p.status ?? "ativo") === "ativo";
}

/** Parecidos: mesma finalidade, priorizando mesmo tipo e mesma cidade. */
export function similarProperties(base: Property, list: Property[] = properties, limit = 3): Property[] {
  const score = (p: Property) => (p.type === base.type ? 2 : 0) + (p.city === base.city ? 1 : 0);
  return list
    .filter((p) => p.id !== base.id && p.purpose === base.purpose && isPublished(p))
    .sort((a, b) => score(b) - score(a))
    .slice(0, limit);
}

export const properties: Property[] = [
  {
    id: "p1",
    slug: "casa-contemporanea-piscina-parque-verde",
    title: "Casa contemporânea com piscina de borda",
    type: "Casa em condomínio",
    purpose: "venda",
    price: 3200000,
    condoFee: 980,
    neighborhood: "Parque Verde",
    city: "Belém",
    area: 420,
    bedrooms: 4,
    bathrooms: 6,
    parking: 4,
    highlight: true,
    tags: ["4 suítes", "Piscina", "Condomínio fechado"],
    photo: "casaPiscina",
    code: "IB-1001",
    description:
      "Casa contemporânea em condomínio fechado, com piscina de borda voltada para o jardim e living integrado à área gourmet por grandes painéis de vidro. São quatro suítes, sendo a master com closet e varanda. Projeto com pé-direito alto, ventilação cruzada e iluminação natural em todos os ambientes, pensado para o clima de Belém.",
  },
  {
    id: "p2",
    slug: "cobertura-panoramica-umarizal",
    title: "Cobertura panorâmica com vista para a baía",
    type: "Cobertura",
    purpose: "venda",
    price: 5500000,
    condoFee: 3200,
    neighborhood: "Umarizal",
    city: "Belém",
    area: 410,
    bedrooms: 4,
    bathrooms: 5,
    parking: 4,
    highlight: true,
    tags: ["Pé-direito duplo", "Vista para a baía", "Andar alto"],
    photo: "coberturaLiving",
    code: "IB-1002",
    description:
      "Cobertura duplex em um dos endereços mais valorizados do Umarizal, com living de pé-direito duplo e vista aberta para a baía do Guajará. Quatro suítes, escritório, terraço com piscina e espaço gourmet. Prédio com lazer completo, segurança 24 horas e quatro vagas privativas.",
  },
  {
    id: "p3",
    slug: "casa-terraco-por-do-sol-marituba",
    title: "Casa com terraço e piscina para o pôr do sol",
    type: "Casa em condomínio",
    purpose: "venda",
    price: 2650000,
    condoFee: 750,
    neighborhood: "Decouville",
    city: "Marituba",
    area: 380,
    bedrooms: 4,
    bathrooms: 5,
    parking: 3,
    highlight: true,
    tags: ["Terraço", "Área gourmet", "Piscina"],
    photo: "terracoPorDoSol",
    code: "IB-1003",
    description:
      "Casa em condomínio com terraço e piscina orientados para o pôr do sol. A área social se abre para o deck, com espaço gourmet completo e jardim. Quatro suítes amplas, cozinha planejada e acesso rápido à BR-316.",
  },
  {
    id: "p4",
    slug: "apartamento-alto-padrao-nazare",
    title: "Apartamento de alto padrão em Nazaré",
    type: "Apartamento",
    purpose: "venda",
    price: 2300000,
    condoFee: 1900,
    neighborhood: "Nazaré",
    city: "Belém",
    area: 210,
    bedrooms: 3,
    bathrooms: 4,
    parking: 3,
    highlight: true,
    tags: ["3 suítes", "Varanda gourmet", "Lazer completo"],
    photo: "apartamentoLiving",
    code: "IB-1004",
    description:
      "Apartamento de alto padrão em Nazaré, perto da Basílica e da Avenida Nazaré. Living amplo com varanda gourmet, três suítes, cozinha integrada e dependência completa. Condomínio com piscina, academia, salão de festas e três vagas.",
  },
  {
    id: "p5",
    slug: "casa-arquitetura-autoral-marco",
    title: "Casa de arquitetura autoral com jardim",
    type: "Casa",
    purpose: "venda",
    price: 2900000,
    neighborhood: "Marco",
    city: "Belém",
    area: 350,
    bedrooms: 4,
    bathrooms: 5,
    parking: 3,
    highlight: true,
    tags: ["Projeto autoral", "Jardim", "Pé-direito alto"],
    photo: "casaArquitetura",
    code: "IB-1005",
    description:
      "Casa de arquitetura autoral, com volumes escuros, madeira e grandes aberturas para um jardim arborizado. Ambientes integrados com pé-direito alto, quatro quartos e área externa com espaço para piscina. Uma casa única, numa rua tranquila do Marco.",
  },
  {
    id: "p6",
    slug: "mansao-piscina-cidade-nova-ananindeua",
    title: "Mansão com piscina e espaço gourmet",
    type: "Casa em condomínio",
    purpose: "venda",
    price: 4800000,
    condoFee: 1200,
    neighborhood: "Cidade Nova",
    city: "Ananindeua",
    area: 560,
    bedrooms: 5,
    bathrooms: 7,
    parking: 5,
    highlight: true,
    tags: ["5 suítes", "Espaço gourmet", "Piscina"],
    photo: "mansao",
    code: "IB-1006",
    description:
      "Mansão em condomínio fechado na Cidade Nova, com cinco suítes, piscina, espaço gourmet e jardim. Salas de estar e jantar amplas, home office, cozinha gourmet e garagem para cinco carros. Ideal para famílias que recebem bem.",
  },
  {
    id: "p7",
    slug: "apartamento-mobiliado-batista-campos",
    title: "Apartamento mobiliado perto da praça",
    type: "Apartamento",
    purpose: "aluguel",
    price: 9500,
    condoFee: 1400,
    neighborhood: "Batista Campos",
    city: "Belém",
    area: 160,
    bedrooms: 3,
    bathrooms: 3,
    parking: 2,
    tags: ["Mobiliado", "Pronto para morar"],
    photo: "apartamentoMadeira",
    code: "IB-1007",
    description:
      "Apartamento mobiliado e decorado a poucos passos da Praça Batista Campos. Sala com muita luz natural, três quartos (uma suíte), cozinha equipada e duas vagas. Pronto para morar, com contrato flexível.",
  },
];

export const siteSettings = {
  brandName: "Imobiliária Belém",
  tagline: "Imóveis escolhidos com critério, apresentados com cuidado.",
  phone: "+55 91 90000-0000",
  whatsapp: "5591900000000",
  email: "contato@exemplo.com.br",
  city: "Belém, PA",
};
