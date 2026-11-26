# Plano — Sistema Imobiliário (portfólio + venda para imobiliárias)

> Status: Fase 0 concluída. Fase 1 em andamento: hero escura com busca (benchmark seção 13) e `/imoveis` com filtros por finalidade, tipo e bairro, ambas prontas. Página de imóvel `/imoveis/[slug]` pronta (foto, ficha, diferenciais, preço fixo na lateral, WhatsApp, formulário com LGPD, parecidos). Faltam menu mobile, páginas Sobre e Contato e envio real dos leads (Fase 2). SEO e dados estruturados foram para o Roadmap.
>
> **Publicação (demo):** versão estática no raw.githack, a partir da pasta `out/` de um repositório público no GitHub (`imobiliaria-belem`). Para atualizar: `npm run build:githack`, depois commit e push. Faixa "Site de demonstração" no topo, porque os dados são fictícios. Links internos usam `pageHref()` (`lib/paths.ts`) para funcionar no raw.githack.
>
> **Decisões tomadas por padrão (ajustáveis):**
> - Marca: **Imobiliária Belém** (em `content/seed.ts`, `siteSettings`).
> - Stack: Next.js 15 + TypeScript + Tailwind v4 + lucide-react. Supabase fica para a Fase 2 (dados ainda em `content/seed.ts`).
> - Cidade: Belém, PA (Umarizal, Nazaré, Batista Campos, Reduto, Marco, São Brás, Mosqueiro) e Ananindeua. Foco: venda e aluguel residencial.
> - Estilo: editorial-moderno (tipografia serifada nos títulos, papel quente, verde-marca).
> - Idioma: pt-BR.
> - Imagens: só 7 fotos de luxo (Unsplash, licença gratuita) em `content/images.ts`, uma por imóvel; a hero reaproveita uma delas. Trocar pelas fotos reais na Fase 2.
> - Catálogo em `content/catalog.ts`: 17 tipos de imóvel (Residencial, Comercial, Rural), 8 cidades da Grande Belém e seus bairros. Lista inicial: validar com a imobiliária.
> - Seed: 7 imóveis de alto padrão (casas e apartamentos) em Belém, Ananindeua e Marituba.
> Objetivo duplo: (1) site de portfólio de alto nível que mostra o trabalho, (2) base de um SaaS que possa ser vendido para imobiliárias.

---

## 1. Visão em uma frase

Um site de imóveis **moderno, rápido e bonito**, pensado como **produto**: o mesmo código serve como vitrine própria, como portfólio de demonstração e, depois, como template multi-tenant vendido para outras imobiliárias.

## 2. Princípios (as regras que guiam todas as decisões)

1. **Pragmático primeiro.** Só entra no escopo o que uma imobiliária usa todo dia. Recursos "bonitos porém inúteis" ficam para depois.
2. **Simples de mexer.** Conteúdo (imóveis, textos, cores, logo) editável sem mexer em código. Código organizado por domínio, não por camada técnica.
3. **Sofisticado por dentro e por fora.** Design system próprio, tipografia forte, muito espaço em branco, animações sutis, fotos grandes. Nada de template genérico.
4. **Multi-tenant desde o início.** Cada imobiliária é um "tenant" com marca, domínio e dados separados. Mesmo que hoje só exista uma, a arquitetura já nasce assim.
5. **Benchmark de mercado como régua.** Toda tela é comparada com referências (ver seção 4).
6. **Local primeiro, publicável depois.** Tudo roda na sua máquina; a publicação entra só quando você decidir.

## 3. Escopo por fases

### Fase 0 — Fundação (decisões e esqueleto)
- Escolher stack (ver seção 5) e criar o projeto.
- Design tokens: paleta, tipografia, espaçamento, raios, sombras, modo claro/escuro.
- Estrutura de pastas, lint, formatação, scripts (`dev`, `build`, `test`).
- Dados de exemplo (seed) com imóveis fictícios realistas.
- **Critério de pronto:** `npm run dev` abre um site vazio, bonito, com o design system visível numa página de teste.

### Fase 1 — Portfólio / Vitrine (MVP visual)
Páginas públicas:
- **Home**: hero com busca rápida (tipo de negócio, cidade, faixa de preço), imóveis em destaque, diferenciais, depoimentos, chamada para contato.
- **Listagem de imóveis**: filtros (comprar/alugar, tipo, bairro, preço, quartos, vagas, área), ordenação, alternância lista/mapa, paginação ou "carregar mais".
- **Página de imóvel**: galeria em tela cheia, ficha técnica, preço, mapa, imóveis parecidos, formulário de interesse, botão WhatsApp.
- **Sobre / Equipe / Contato**.
- **Área de portfólio** (para você mostrar o trabalho): cases, prints, antes/depois, depoimentos de clientes fictícios marcados como demo.
- **Critérios de pronto:** Lighthouse ≥ 90 em performance e acessibilidade; responsivo em celular, tablet e desktop; navegação por teclado funcionando.

### Fase 2 — Painel administrativo (o que faz vender)
- Login (e-mail + senha; depois magic link ou SSO).
- CRUD de imóveis: formulário com upload de fotos (arrastar e soltar, reordenar, capa), vídeo/tour opcional, rascunho/publicado/vendido/alugado.
- Gestão de leads (quem pediu contato, de qual imóvel, status do funil, observações).
- Configuração da imobiliária: nome, logo, cores, domínio, contatos, redes sociais, textos da home.
- Dashboard simples: visitas, leads por origem, imóveis ativos.
- **Critério de pronto:** um corretor sem conhecimento técnico cadastra um imóvel completo em menos de 5 minutos.

### Fase 3 — Recursos de venda e diferenciais
- Integração com WhatsApp (mensagem pré-preenchida por imóvel).
- Mapa com pins e busca por área desenhada.
- Calculadora de financiamento simples.
- Compartilhamento e favoritos (cookie/localStorage, sem conta).
- Importação de imóveis (planilha CSV/XLSX de modelo fixo) — muito pedido por imobiliárias.
- Multi-idioma (pt-BR primeiro; en/es depois, se houver demanda).

### Fase 4 — Pronto para vender (SaaS)
- Multi-tenant de verdade: um deploy atende várias imobiliárias, cada uma com domínio/subdomínio, marca e dados isolados.
- Onboarding self-service: cadastro, escolha de tema, importação inicial.
- Planos e cobrança (ex.: Stripe Billing), limites por plano (nº de imóveis, usuários, destaque).
- Papéis: administrador, corretor, gestor (permissões).
- Logs de auditoria, backup, LGPD (consentimento em formulários, política de privacidade, exclusão de dados).
- Documentação para o cliente e para você (manual de uso, FAQ, vídeos curtos).
- Observabilidade: erros, métricas de uso, status page.

### Roadmap — depois (fora do escopo atual)
Itens guardados para quando o site for publicado. Não fazer agora.
- **SEO:** título e descrição por imóvel, Open Graph para compartilhamento, sitemap e robots.txt.
- **Dados estruturados:** schema.org `RealEstateListing` em cada imóvel (preço, endereço, foto) e `RealEstateAgent` para a imobiliária.
- **Páginas por intenção e por bairro** para busca no Google (`/imoveis/venda`, `/imoveis/aluguel`, `/bairros/[bairro]`) com FAQ.
- **Blog** com guias locais (onde morar em Belém, custo de vida etc.).
- **Lighthouse SEO ≥ 90** como critério de pronto.

## 4. Benchmark de mercado (referências para estudar antes de desenhar)

Referências de **design e experiência** (fora do Brasil, para inspiração visual):
- Sotheby's International Realty, Compass, Christie's Real Estate — tipografia, galerias, respiro visual.
- Zillow / Redfin (EUA) e Airbnb — busca, filtros, mapa + lista.
- Apple, Linear, Vercel — ritmo visual, microinterações, minimalismo.

Referências **brasileiras** (o que o público já conhece):
- QuintoAndar, Loft, Zap Imóveis, VivaReal, OLX Imóveis — fluxo de busca, favoritos, WhatsApp, formulário de interesse.
- Imóveis de sites de imobiliárias locais: observar o que é clichê e evitar.

Como usar o benchmark (método, não cópia):
1. Escolher 5 telas de referência por página (home, listagem, imóvel, contato, admin).
2. Anotar o que funciona (ex.: "filtro sempre visível no mobile").
3. Anotar o que irrita (ex.: formulário longo, mapa sem lista).
4. Traduzir em regras próprias no design system.

> Cuidado legal: não copiar marca, logo, textos ou fotos de terceiros. Só padrões de UX e estilo genérico.

## 5. Stack recomendada (proposta, para você confirmar)

| Camada | Escolha | Por quê |
|---|---|---|
| Frontend | **Next.js (App Router) + TypeScript** | SEO forte, rápido, enorme ecossistema, fácil de vender como produto |
| Estilo | **Tailwind CSS + componentes próprios (shadcn/ui como base)** | Design system consistente, customizável por tenant |
| Animação | **Framer Motion** (com moderação) | Transições sofisticadas sem pesar |
| Mapa | **Leaflet + OpenStreetMap** (ou Mapbox depois) | Gratuito no início |
| Dados/Backend | **Supabase (Postgres + Auth + Storage)** | Multi-tenant com Row Level Security, auth pronta, barato |
| Formulários | **React Hook Form + Zod** | Validação tipada e compartilhada |
| Imagens | Storage do Supabase + `next/image` com redimensionamento | Galeria rápida |
| Testes | Vitest (unidade) + Playwright (fluxos principais) | Confiança para vender |
| Deploy (futuro) | Vercel + Supabase cloud | Quando você decidir publicar |

Alternativa mais simples (se preferir começar mais leve): **Vite + React + JSON local** para a vitrine, e migrar para Supabase na Fase 2. Eu recomendo ir direto para Next.js + Supabase, porque evita reescrever depois.

## 6. Modelo de dados (inicial)

- `tenants` — imobiliária (nome, slug, domínio, tema, contatos, plano)
- `users` — pessoa (tenant_id, papel, nome, e-mail)
- `properties` — imóvel (tenant_id, código, tipo, finalidade [venda/aluguel], status, preço, área, quartos, banheiros, vagas, endereço, lat/lng, descrição, destaque, publicado_em)
- `property_images` — fotos (property_id, url, ordem, é_capa)
- `property_features` — características (piscina, varanda, aceita pet etc.)
- `leads` — contatos (tenant_id, property_id, nome, telefone, e-mail, mensagem, origem, status, responsável)
- `pages` / `site_settings` — textos e blocos da home editáveis
- `audit_logs` — quem fez o quê e quando

Regra: toda tabela de conteúdo tem `tenant_id` e política de segurança por linha.

## 7. Design system (para ficar "lindíssimo" de forma consistente)

- **Identidade:** um nome de marca e um logo provisório (depois o cliente troca). Paleta com 1 cor de marca forte, 1 neutra quente, 1 de destaque para ações (WhatsApp/CTA), tons de sucesso/erro.
- **Tipografia:** uma fonte de títulos com personalidade (serifada ou grotesca geométrica) + uma de texto muito legível. Escala tipográfica fixa.
- **Espaçamento:** grade de 8px; seções com respiro generoso no desktop.
- **Imagens:** proporção fixa nos cards (ex.: 4:3 ou 16:10), cantos suaves, leve zoom no hover, placeholder com blur.
- **Componentes base:** botão, input, select, chip de filtro, card de imóvel, badge de status, modal, drawer (filtros no mobile), toast, skeleton de carregamento, estado vazio.
- **Movimento:** transições de 150–300ms, nada de animação decorativa exagerada.
- **Acessibilidade:** contraste AA mínimo, foco visível, textos alternativos, respeitar "reduzir movimento".
- **Modo escuro:** previsto no tokens desde o início, mesmo que a primeira entrega seja só claro.

## 8. Estrutura de pastas proposta

```
imobiliaria/
├─ PLANO.md
├─ app/                  # rotas (home, imoveis, imovel/[slug], contato, admin)
├─ components/
│  ├─ ui/                # design system (botões, inputs, cards base)
│  └─ site/              # blocos de site (hero, grid de imóveis, rodapé)
├─ features/
│  ├─ properties/        # tudo sobre imóveis (tipos, filtros, queries)
│  ├─ leads/
│  └─ tenant/            # marca, configurações da imobiliária
├─ lib/                  # utilitários, cliente Supabase, formatação de moeda/área
├─ styles/               # tokens e tema
├─ content/seed/         # dados de exemplo (imóveis fictícios)
├─ tests/
└─ docs/                 # decisões de arquitetura, manual de uso
```

## 9. Padrões de qualidade (o que mantém o projeto fácil de mexer)

- Um arquivo faz uma coisa. Componente com mais de ~200 linhas é sinal para dividir.
- Textos fora do código (arquivo de conteúdo / painel), para trocar sem deploy.
- Nomes em português no domínio (`imovel`, `corretor`) ou em inglês em todo o código — **escolher um e manter**. Recomendo: código em inglês, textos e rótulos em português.
- Commits pequenos e descritivos (quando o projeto virar git).
- Checklist de PR: funciona no celular? tem estado de carregamento e vazio? acessível por teclado? textos em `pt-BR`?

## 10. Riscos e como evitar

| Risco | Mitigação |
|---|---|
| Escopo crescer demais antes de ter uma vitrine boa | Fechar Fase 1 antes de começar a Fase 2 |
| Design genérico ("cara de template") | Benchmark com regras escritas + revisão visual a cada tela |
| Vazamento de dados entre imobiliárias (SaaS) | RLS no banco desde o dia 1 + testes específicos de isolamento |
| Problemas de LGPD em formulários | Consentimento explícito, política de privacidade, exclusão de dados |
| Fotos pesadas deixam o site lento | Redimensionamento no upload + formatos modernos (WebP/AVIF) |
| Dependência de um serviço só | Camada de dados isolada em `lib/` / `features/` |

## 11. Próximos passos imediatos (ordem sugerida)

1. **Você decide** (ver seção 12): nome da marca, stack, escopo da primeira entrega.
2. Criar o projeto Next.js + TypeScript + Tailwind na pasta.
3. Montar o design system (tokens + componentes base) e uma página de teste.
4. Criar o seed com ~12 imóveis fictícios e fotos de banco livre (Unsplash/Pexels, com licença verificada).
5. Construir a home e a listagem com filtros.
6. Construir a página de imóvel.
7. Revisar tudo no celular e no desktop; ajustar com benchmark.
8. Só depois: Supabase, admin, SaaS.

## 12. Decisões que preciso de você

1. **Nome e identidade** da marca do portfólio (ou usamos um nome provisório?).
2. **Stack:** Next.js + Supabase (recomendado) ou algo mais leve (Vite + JSON local)?
3. **Foco de mercado:** residencial, comercial, lançamentos, locação, ou tudo?
4. **Cidade/região** para os dados de exemplo (ex.: São Paulo, Florianópolis…).
5. **Estilo visual preferido:** mais editorial e sofisticado (tipo Sotheby's), mais moderno e tech (tipo Linear/Apple) ou mais acolhedor (tipo QuintoAndar)?
6. **Idioma:** só português, ou já prever inglês/espanhol?

---

## 13. Benchmark específico: imobiliariamacae.com.br

Referência de **estrutura e UX** (não copiar textos, fotos, marca nem FAQ literal).

**O que observamos**
- **Hero escuro** com foto em tela cheia, título grande em serifa com uma palavra em itálico dourado, e dois CTAs ("Ver imóveis em destaque", "Agendar visita").
- **Busca na própria hero**: tipo (apartamento/casa), bairro e botão "Buscar". Busca é o primeiro gesto do usuário.
- **Números de confiança** logo abaixo da busca (anos de mercado, bairros atendidos, dias de atendimento, % do processo acompanhado).
- **Destaques** em cards com preço, badge de finalidade (venda/aluguel), tipo e bairro, quartos, banheiros, vagas e área.
- **Navegação por intenção**: "Apartamentos à venda", "Casas à venda", "Apartamento para alugar", "Casa para alugar" — uma página de landing por combinação, bom para SEO.
- **Páginas por bairro** (Cavaleiros, Glória, Imbetiba, Centro) com guia de "perfil do bairro".
- **Bloco de faixa de preço** nas listagens (até R$200 mil, R$201–500 mil, acima de R$500 mil).
- **FAQ** em todas as páginas de compra, com perguntas que o cliente realmente faz (financiamento, documentos, segurança, negociação).
- **Formulário de contato** com campo honeypot ("Não preencha"), aceite de LGPD e frase de tranquilidade ("Visitas acompanhadas por corretor").
- **Depoimentos** curtos com perfil do cliente (profissão), não só nome.
- **Endereço e horário** com botão "Como chegar" e seção de blog para SEO local.
- **Banner de cookies** com "Recusar" e "Aceitar" lado a lado.
- **Cores**: fundo escuro + dourado (acento) + creme. Esquema "premium discreto".

**O que queremos fazer melhor**
- Busca mais completa na hero (finalidade, faixa de preço, quartos) e filtros na listagem com contagem ao vivo de resultados.
- Filtros e busca funcionando sem recarregar a página.
- Página de imóvel com galeria, mapa e "imóveis parecidos" (não vimos esse padrão no site de referência).
- Menu "Imóveis" com dropdown claro e acessível no mobile (drawer).
- Remover o aviso de cookies que cobre o conteúdo; usar barra discreta no rodapé.
- Painel admin (Fase 2): não existe no site de referência, é nosso diferencial de venda.

**Decisões para a Fase 1 com base no benchmark**
1. Paleta: migrar do verde-marca para **fundo escuro + dourado + creme** na hero, mantendo o resto claro. Tokens em `app/globals.css`.
2. Hero com foto de fundo (placeholder com gradiente escuro até termos fotos reais), título serifado e uma palavra em itálico dourado.
3. Busca na hero: finalidade (comprar/alugar), tipo, bairro, botão "Buscar" → leva para `/imoveis?...`.
4. Rotas por intenção desde o início: `/imoveis`, `/imoveis/venda`, `/imoveis/aluguel`, `/bairros/[bairro]`.
5. ~~Cada página de intenção com FAQ curto e schema.org~~ → movido para o Roadmap (SEO), seção 3.
6. Contato com honeypot + aceite LGPD desde o primeiro formulário.

*Este documento é vivo: atualize as decisões da seção 12 e marque as fases concluídas.*
