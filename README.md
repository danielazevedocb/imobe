# Imobe

Micro SaaS para proprietários e corretores autônomos gerenciarem imóveis, rendimentos e contratos.

## Stack

- Next.js 16 (App Router)
- TypeScript
- Supabase (Auth + Database + Storage)
- Tailwind CSS v4 + shadcn/ui
- TanStack Query + React Hook Form + Zod
- sharp (validação de fotos no servidor)

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

- `supabase/001_profiles.sql` … `supabase/007_property_photos.sql`

4. Em **Authentication → Providers → Email**, desabilite "Confirm email" em desenvolvimento para login imediato após cadastro.

5. Inicie o servidor:

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

## Rotas principais

| Rota                 | Descrição                          |
| -------------------- | ---------------------------------- |
| `/`                  | Landing page                       |
| `/cadastro`          | Criar conta                        |
| `/login`             | Entrar                             |
| `/dashboard`         | Painel (protegido)                 |
| `/perfil`            | Meu perfil (protegido)             |
| `/imoveis`           | Listagem de imóveis                |
| `/imoveis/novo`      | Cadastrar imóvel (com fotos)       |
| `/imoveis/[id]`      | Detalhes do imóvel + galeria       |
| `/imoveis/[id]/editar` | Editar imóvel + fotos            |
| `/contratos`         | Contratos                          |

## Verificação

```bash
npm run lint
npm run typecheck
npm test
npm run test:integration   # opcional, requer Supabase de teste
npx playwright install     # primeira execução E2E
npm run test:e2e
npm run build
```

## Estrutura

Segue o padrão do projeto: `page.tsx` + `_components/` + `_actions/` + `_data-access/` por feature.

Proteção de rotas via `src/proxy.ts` (convenção Next.js 16).

## PRD implementado

Feature completa documentada em [`docs/01-prd-feature-pagamento-rapido-perfil-fotos.md`](docs/01-prd-feature-pagamento-rapido-perfil-fotos.md):

- Pagamento rápido no dashboard (competência livre, pendências, conflitos)
- Meu perfil (nome, telefone, Instagram, TikTok)
- Fotos privadas nos imóveis (cadastro, edição, galeria, entrega autorizada)
