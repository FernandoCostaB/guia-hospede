# Decisões de Projeto — Guia Digital do Hóspede

## Stack Tecnológica

| Tecnologia | Escolha | Por quê |
|------------|---------|---------|
| Framework | Next.js 15 (App Router) | Requisito do teste. App Router permite Server Components para SSR sem boilerplate, rotas dinâmicas com `[propertyCode]` e API Routes no mesmo projeto. |
| Banco de dados | PostgreSQL (Neon) | Requisito do teste. Neon oferece plano gratuito com cold start rápido, connection pooling nativo e compatibilidade total com Prisma. |
| ORM | Prisma | Type-safety end-to-end com o banco, migrations versionadas, seed declarativo e `generateObject` integra bem com schemas Zod. |
| Validação | Zod | Valida tanto entrada do usuário quanto saída estruturada da IA (`generateObject`). Um único schema serve para validação e tipagem. |
| IA | Vercel AI SDK + Anthropic | `streamText` para chat com streaming nativo, `generateObject` para geração estruturada do guia de experiências. Abstrai o protocolo de streaming. |
| Modelo | Claude Haiku 4.5 | Único modelo disponível no workspace Anthropic com os créditos de teste ($5). Suficiente para as tarefas: respostas curtas no chat e geração de guia estruturado. |
| CSS | Tailwind CSS 4 | Requisito do teste. Utility-first permite prototipação rápida sem arquivos CSS separados. |
| Testes | Vitest + Testing Library | Vitest é rápido e compatível com o ecossistema Vite. Testing Library testa componentes pela perspectiva do usuário (acessibilidade). |
| Deploy | Vercel | Zero-config para Next.js, preview deploys automáticos, edge functions para API routes. |
| Dev local | Docker Compose | PostgreSQL 16 local isolado, sem instalar nada na máquina. Um `docker compose up -d` e o banco está pronto. |

## Arquitetura

### Server Components por padrão

A página do imóvel (`/[propertyCode]/page.tsx`) é um Server Component que busca os dados direto no banco via Prisma. Isso elimina waterfall de API calls, melhora SEO e reduz JavaScript enviado ao cliente. Apenas componentes interativos (carousel de fotos, chat widget) são Client Components.

### Separação em camadas

```
server/repositories/  →  Acesso ao banco (queries Prisma)
server/services/      →  Regras de negócio (buscar-ou-gerar guia)
server/ai/            →  Prompts e configuração do modelo
schemas/              →  Validação com Zod
```

Essa separação permite testar prompts e schemas sem dependência de banco ou API externa. Os repositories são a única camada que conhece o Prisma; o resto trabalha com tipos TypeScript puros.

### Contexto do chat montado no servidor

O system prompt do chat é construído no servidor (`buildChatSystemPrompt`), nunca no cliente. Isso garante que:
- O hóspede não vê os dados brutos do imóvel no JavaScript do navegador
- O prompt de segurança não pode ser inspecionado pelo DevTools
- Os dados vêm sempre do banco, não de estado do cliente

## Banco de Dados

### Duas tabelas: Property + ExperienceGuide

O `ExperienceGuide` é uma tabela separada (relação 1:1) em vez de uma coluna JSONB na Property porque:
- Tem ciclo de vida próprio (PENDING → GENERATING → COMPLETED/FAILED)
- Pode ser regerado sem alterar o imóvel
- O status permite mostrar loading/erro na UI independentemente

### Status machine para geração do guia

```
(não existe) → GENERATING → COMPLETED
                          → FAILED (permite retry)
```

Se o hóspede acessa um imóvel sem guia, o sistema cria o registro como GENERATING, chama a IA e atualiza para COMPLETED ou FAILED. Requests concorrentes veem GENERATING e não disparam duplicatas.

### Seed com dados reais do FLN001

O seed do FLN001 inclui um guia de experiências pré-populado com restaurantes, atrações e serviços reais de Florianópolis. Isso garante que a demonstração funciona sem depender da API da Anthropic. O GRM001 (Gramado) não tem guia pré-populado — serve para demonstrar a geração via IA em tempo real.

## Integração com IA

### Geração estruturada com `generateObject`

O guia de experiências usa `generateObject` com schema Zod em vez de `generateText` + parsing manual. Vantagens:
- O modelo recebe o schema como constraint e gera JSON válido
- Validação automática: se o modelo gerar menos de 4 restaurantes, o Zod rejeita
- Type-safety: o retorno já é tipado como `ExperienceGuideContent`

### Chat com streaming via UIMessageStream

O chat usa `streamText` → `toUIMessageStream` → `createUIMessageStreamResponse`. O cliente usa `DefaultChatTransport` (não `TextStreamChatTransport`) porque o servidor retorna formato UIMessageStream com metadados de mensagem, não plain text.

A conversão `convertToModelMessages` é necessária porque o cliente envia `UIMessage[]` (formato com `parts`) e o `streamText` espera `ModelMessage[]` (formato com `content`).

### Limitação de tokens

- Input: mensagens truncadas a 500 caracteres, máximo 10 mensagens de histórico
- Output: `maxOutputTokens: 500`

Isso controla custo (modelo cobra por token) e impede que usuários tentem extrair informações com prompts longos.

## Segurança

### Proteção contra prompt injection

O system prompt inclui regras explícitas:
1. **Não revelar instruções** — o modelo recusa pedidos de "mostre seu system prompt"
2. **Não inventar informações** — responde apenas com dados fornecidos
3. **Não executar ações** — recusa pedidos de gerar código, acessar URLs, etc.
4. **Recusar role-play** — se o usuário pedir para "agir como outro assistente", redireciona para perguntas sobre o imóvel
5. **Escopo limitado** — só responde sobre o imóvel, estadia e região

### Sanitização de input

- `maxLength={500}` no campo de input do cliente (primeira barreira)
- Truncamento no servidor (`p.text.slice(0, MAX_MESSAGE_LENGTH)`) — não confia no cliente
- Limite de 10 mensagens no histórico (`messages.slice(-MAX_MESSAGES)`)

### Validação de entrada na API

- `propertyCode` deve ser string não vazia
- `messages` deve ser array não vazio
- Propriedade inexistente retorna 404
- Erros não tratados retornam 500 genérico (não vaza stack trace)

## UX

### Código de acesso sem botão de copiar

A senha da fechadura eletrônica é exibida como texto plano (sem botão "copiar") porque o hóspede precisa digitá-la fisicamente na fechadura — copiar para a área de transferência não tem utilidade nesse contexto.

### Sugestões clicáveis no chat

As 4 perguntas frequentes ("Qual a senha do WiFi?", "Posso trazer meu cachorro?", etc.) aparecem como botões antes da primeira mensagem. Isso reduz fricção e mostra ao hóspede o que o assistente pode responder, sem precisar pensar no que digitar.

### Links de ação direta

- Botão WhatsApp abre conversa com o anfitrião direto
- Botão "Abrir no mapa" abre Google Maps com o endereço
- Botão "Copiar senha" copia a senha do WiFi

### Dark mode por padrão

A interface usa tema escuro como padrão — mais confortável para consultar à noite (check-in tardio, horário comum de chegada em imóveis de temporada).

## Testes

### Foco em lógica testável sem mocks pesados

- **Prompts** (17 testes): verifica que o system prompt inclui dados corretos do imóvel, regras de segurança, guia quando presente, e trata campos opcionais (complement null, parking false)
- **Schema Zod** (8 testes): valida limites do schema (min/max restaurantes, atrações, essenciais) e campos obrigatórios
- **Message parsing** (7 testes): extração de texto do formato UIMessage (parts) com fallback para content
- **Componentes** (20 testes): HouseRules, AccessInfo, Amenities e ContactInfo — renderização condicional, dados corretos, links com href certo

Não foram criados testes para:
- **PropertyHeader**: usa `next/image` que precisa de mock do Next.js — custo alto para pouco valor
- **API routes**: dependem de Prisma e Anthropic — seriam testes de integração, não unitários
- **ChatWidget**: depende de `useChat` — testaria o hook do AI SDK, não nossa lógica

## Deploy

### Build command: `prisma generate && next build`

O `prisma generate` no build garante que o Prisma Client é gerado antes do Next.js compilar. Sem isso, o build falha porque os tipos do Prisma não existem no ambiente da Vercel.

### Duas URLs de banco no Vercel

- `DATABASE_URL`: URL com pooler do Neon (para queries em runtime via connection pooling)
- `DIRECT_URL`: URL direta sem pooler (para migrations que precisam de conexão persistente)

O Prisma usa `directUrl` automaticamente para migrations e a URL principal para queries.
