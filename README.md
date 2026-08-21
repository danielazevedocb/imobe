# Imobe

Micro SaaS para proprietários e corretores autônomos gerenciarem imóveis, rendimentos e contratos.

## Stack

- Next.js 16 (App Router)
- TypeScript
- Supabase (Auth + Database)
- Tailwind CSS v4 + shadcn/ui
- TanStack Query + React Hook Form + Zod

## Configuração

1. Instale dependências:

```bash
npm install
```

2. Crie um projeto em [supabase.com](https://supabase.com) e copie as credenciais para `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon
```

3. Execute os scripts SQL em ordem no Supabase Dashboard → SQL Editor (veja [`supabase/README.md`](supabase/README.md)):

- `supabase/001_profiles.sql`
- `supabase/002_properties.sql`

4. Em **Authentication → Providers → Email**, desabilite "Confirm email" em desenvolvimento para login imediato após cadastro.

5. Inicie o servidor:

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

## Rotas principais

| Rota            | Descrição               |
| --------------- | ----------------------- |
| `/`             | Landing page            |
| `/cadastro`     | Criar conta             |
| `/login`        | Entrar                  |
| `/dashboard`    | Painel (protegido)      |
| `/imoveis`      | Listagem de imóveis     |
| `/imoveis/novo` | Cadastrar imóvel        |
| `/imoveis/[id]` | Detalhes do imóvel      |
| `/contratos`    | Contratos (placeholder) |

## Estrutura

Segue o padrão do projeto: `page.tsx` + `_components/` + `_actions/` + `_data-access/` por feature.

Proteção de rotas via `src/proxy.ts` (convenção Next.js 16).
