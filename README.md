# Guia Digital do Hóspede — Seazone

> **Demo:** [guia-hospede-jet.vercel.app](https://guia-hospede-jet.vercel.app/)

Aplicação web que oferece um guia digital personalizado para hóspedes de imóveis de temporada. Cada imóvel possui uma URL única (ex.: `/FLN001`) com informações completas, guia de experiências gerado por IA e assistente virtual com streaming.

## Stack

- **Next.js 15** (App Router, SSR)
- **TypeScript** (strict)
- **Tailwind CSS v4**
- **PostgreSQL** (Neon/Supabase)
- **Prisma 6** (ORM, migrations, seed)
- **Vercel AI SDK v7** + Claude (streaming, geração estruturada)
- **Zod** (validação de schemas)

## Funcionalidades

### 1. Guia do Imóvel (`/[propertyCode]`)
- Carrossel de fotos
- Informações de acesso (WiFi com botão copiar, instruções de entrada)
- Comodidades com ícones
- Regras da casa (horários, políticas)
- Contato do anfitrião (WhatsApp, Google Maps)

### 2. Guia de Experiências (IA)
- Restaurantes, atrações e serviços essenciais próximos ao imóvel
- Dica sazonal baseada no mês atual
- Gerado via Claude com `generateObject` + validação Zod
- Persistido no banco (não regenera a cada acesso)
- Status machine: PENDING → GENERATING → COMPLETED / FAILED
- Skeleton loading + retry em caso de falha

### 3. Assistente Virtual (Chat)
- Widget flutuante com sugestões clicáveis
- Streaming de respostas via Vercel AI SDK v7
- Contexto montado server-side (dados do imóvel + guia de experiências)
- Responde apenas com dados fornecidos (sem alucinação)

## Arquitetura

```
src/
├── app/                          # Páginas e API routes
│   ├── [propertyCode]/page.tsx   # Guia do imóvel (SSR)
│   └── api/
│       ├── chat/route.ts         # Chat streaming
│       └── experiences/route.ts  # Guia de experiências
├── components/
│   ├── property/                 # Header, acesso, comodidades, regras, contato
│   ├── experiences/              # Cards de experiências
│   ├── chat/                     # Widget de chat
│   └── ui/                       # Section, Badge, CopyButton
├── server/
│   ├── repositories/             # Acesso ao banco (Property, ExperienceGuide)
│   ├── services/                 # Lógica de negócio (buscar/gerar guia)
│   └── ai/                       # Prompts (experiências + chat)
├── schemas/                      # Schemas Zod
├── types/                        # Tipos TypeScript
└── lib/                          # Prisma client singleton
prisma/
├── schema.prisma                 # Models: Property, ExperienceGuide
└── seed.ts                       # FLN001 (Florianópolis), GRM001 (Gramado)
```

**Separação de responsabilidades:**
- `repositories/` — queries e persistência
- `services/` — regras de negócio
- `ai/` — construção de prompts e integração com LLM

## Setup Local

### Pré-requisitos
- Node.js 18+
- Docker e Docker Compose

### Instalação

```bash
git clone <repo-url>
cd guia-hospede
npm install
```

### Banco de dados

Suba o PostgreSQL local com o `docker-compose.yml` incluso no projeto:

```bash
docker compose up -d
```

### Variáveis de ambiente

```bash
cp .env.example .env
```

Preencha no `.env`:
- `DATABASE_URL` — connection string PostgreSQL (o docker-compose sobe na porta padrão)
- `DIRECT_URL` — mesma connection string (apenas necessário em produção com pooler)
- `ANTHROPIC_API_KEY` — chave da API Anthropic

### Migrations e seed

```bash
npm run db:migrate    # Cria as tabelas
npm run db:seed       # Insere imóveis de exemplo (FLN001, GRM001)
```

### Rodar

```bash
npm run dev
```

Acesse `http://localhost:3000` e navegue para `/FLN001` ou `/GRM001`.

## Deploy (Vercel)

1. Importe o repositório no Vercel
2. Configure as variáveis de ambiente (`DATABASE_URL`, `DIRECT_URL`, `ANTHROPIC_API_KEY`)
3. O build roda automaticamente (`next build` + `prisma generate`)
4. Após o deploy, rode o seed em produção se necessário

## Decisões Técnicas

| Decisão | Motivo |
|---------|--------|
| SSR para página do imóvel | SEO + dados sempre atualizados |
| Guia persistido no banco | Evita chamadas repetidas à API de IA |
| Status machine para guia | Gerencia estados de geração (loading, erro, retry) |
| Contexto do chat server-side | Dados sensíveis não vão para o cliente |
| Zod para output da IA | Garante estrutura válida da resposta |
| Prisma singleton | Evita conexões excessivas em desenvolvimento |

## Imóveis de Exemplo (Seed)

| Código | Cidade | Tipo | Quartos | Hóspedes | Pets |
|--------|--------|------|---------|----------|------|
| FLN001 | Florianópolis/SC | Apartamento | 2 | 4 | Não |
| GRM001 | Gramado/RS | Casa | 3 | 6 | Sim |
