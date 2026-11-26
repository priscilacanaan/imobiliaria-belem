// As 7 fotos do site (Unsplash, licença gratuita). Trocar pelas fotos reais dos imóveis na Fase 2.

export const photos = {
  casaPiscina: "1600596542815-ffad4c1539a9", // casa branca contemporânea com piscina
  terracoPorDoSol: "1599809275671-b5942cabc7a2", // terraço com piscina ao entardecer
  casaArquitetura: "1600585154340-be6161a56a0c", // casa escura de arquitetura autoral
  mansao: "1580587771525-78b9dba3b914", // casa de dois andares com piscina
  coberturaLiving: "1600573472550-8090b5e0745e", // living com pé-direito duplo e vidro
  apartamentoLiving: "1618221195710-dd6b41faaea6", // living contemporâneo
  apartamentoMadeira: "1600607687939-ce8a6c25118c", // sala com madeira e luz natural
} as const;

export type PhotoKey = keyof typeof photos;

export function photoUrl(key: PhotoKey, width = 1600): string {
  return `https://images.unsplash.com/photo-${photos[key]}?auto=format&fit=crop&w=${width}&q=80`;
}
