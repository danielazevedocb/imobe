# Status de implementação — Fases 1 a 7

Atualizado após auditoria de código e UI (agosto/2026). Referência: [PRD-Inicial.md](./PRD-Inicial.md).

| Fase                                       | Specs                                       | Status       |
| ------------------------------------------ | ------------------------------------------- | ------------ |
| **Fase 1** — Base inicial do produto       | Spec 01, Spec 02                            | ✅ Concluída |
| **Fase 2** — Acesso do usuário             | Spec 03, Spec 04, Spec 05                   | ✅ Concluída |
| **Fase 3** — Gestão de imóveis             | Spec 06, Spec 07, Spec 08, Spec 09, Spec 10 | ✅ Concluída |
| **Fase 4** — Rendimentos de aluguel        | Spec 11, Spec 12, Spec 13, Spec 13.1        | ✅ Concluída |
| **Fase 5** — Contratos                     | Spec 14–18, Spec 15.1                       | ✅ Concluída |
| **Fase 6** — Dashboard                     | Spec 19                                     | ✅ Concluída |
| **Fase 7** — Validações e acabamento da V1 | Spec 20, Spec 21                            | ✅ Concluída |

## Auditoria (agosto/2026)

### Quality gates

| Verificação        | Resultado | Observação |
| ------------------ | --------- | ---------- |
| `npm run typecheck` | ✅ Passou | Sem erros TypeScript |
| `npm run build`     | ✅ Passou | 13 rotas compiladas |
| `npm test`          | ✅ Passou | 10 testes (utils de contrato/rendimento) |
| `npm run lint`      | ✅ Passou | ESLint 9 + `eslint-config-next` (flat config); 2 avisos do React Compiler sobre `form.watch()` do React Hook Form |
| IDE lints           | ✅ Limpo  | Sem diagnósticos em `src/app` e `src/components` |

### Rotas verificadas

**Públicas:** `/` (landing), `/login`, `/cadastro`

**Painel (autenticado):** `/dashboard`, `/imoveis`, `/imoveis/[id]`, `/imoveis/novo`, `/imoveis/[id]/editar`, `/contratos`, `/contratos/novo`, `/contratos/novo/vinculado`, `/contratos/novo/manual`, `/contratos/[id]`, `/contratos/[id]/download`

**Não implementado (fora da V1):** `/account` ou página de perfil/conta

### UI / styling — achados

| Severidade | Item | Status |
| ---------- | ---- | ------ |
| Corrigido | Listagem de contratos: cabeçalho do card não empilhava em mobile | Ajuste `flex-col sm:flex-row` + `min-h-11` nos botões |
| Info | `suppressHydrationWarning` em `layout.tsx` (html/body) | Uso aceitável para fontes/SSR |
| Info | Inline `style` apenas em PDF (`@react-pdf/renderer`) | Esperado, não afeta UI web |
| Info | Tokens `.dark` em `globals.css` sem toggle de tema | Tema claro ativo; dark mode preparado mas não exposto |
| Info | Magic UI citado no PRD | Não utilizado; shadcn/ui + Tailwind v4 |
| Info | Overlay do menu mobile sem `role="dialog"` / focus trap | Funcional; melhoria de a11y opcional |
| Info | Datas com `Intl.DateTimeFormat` em client components | OK; sem mismatch de hydration |

## Entregas por fase

### Fase 1

- Branding Imobe, landing page, providers (TanStack Query + Sonner)
- Layout do painel com sidebar desktop e menu mobile
- Layout auth centralizado
- Placeholders iniciais de dashboard e contratos

### Fase 2

- Cadastro (email, senha, nome, telefone opcional)
- Login e logout
- `src/proxy.ts` + `requireAuth()` + RLS em `profiles`
- SQL: `supabase/001_profiles.sql`

### Fase 3

- CRUD completo de imóveis com soft delete
- Validação Zod condicional por finalidade (aluguel/venda/ambos)
- SQL: `supabase/002_properties.sql`

### Fase 4

- Registro de rendimentos mensais no detalhe do imóvel
- Linha do tempo, filtros por mês/6 meses/12 meses, resumo financeiro e exclusão de lançamentos (Spec 13.1)
- SQL: `supabase/003_rental_incomes.sql`

### Fase 5

- Onboarding de contratos (locação/venda, vinculado/manual)
- Atalho **Gerar contrato** no detalhe do imóvel (Spec 15.1)
- Pré-preenchimento de endereço do locatário/comprador (`party_b`) e valores financeiros ao vincular imóvel
- Geração de PDF server-side com `@react-pdf/renderer`
- Bucket privado Supabase Storage + download autorizado
- SQL: `supabase/004_contracts.sql`

### Fase 6

- Dashboard com patrimônio, disponibilidade, rendimentos e contratos
- Agregações isoladas por usuário via DAL dedicado

### Fase 7

- Estados vazios reutilizáveis, `loading.tsx`, `error.tsx` e skeletons
- Acessibilidade básica (`aria-current`, skip link)
- Scripts de teste, lint e typecheck

## Decisões registradas

- Cadastro: email, senha, nome completo, telefone (opcional).
- Exclusão de imóvel: soft delete via `deleted_at` (contratos preservados).
- Proteção de rotas: `src/proxy.ts` + `requireAuth()` + RLS no Supabase.
- Contratos: modelo operacional completo com aviso de revisão jurídica.
- PDF: `@react-pdf/renderer` no runtime Node, bucket privado `contracts`.
- Rendimentos: um lançamento por imóvel/competência (`unique(property_id, reference_month)`).

## Supabase — migrations SQL

Verificado em **20/08/2026** via Supabase MCP (`list_tables`, `execute_sql`) no projeto **imobe** (`mcywhsmwokgqbhfzzknt`, região `sa-east-1`).

| Migration | Arquivo | Status |
| --------- | ------- | ------ |
| 001 | `supabase/001_profiles.sql` | ✅ Já aplicada |
| 002 | `supabase/002_properties.sql` | ✅ Já aplicada |
| 003 | `supabase/003_rental_incomes.sql` | ✅ Já aplicada |
| 004 | `supabase/004_contracts.sql` | ✅ Já aplicada |

**Objetos confirmados no banco remoto:**

- Tabelas: `profiles`, `properties`, `rental_incomes`, `contracts` (RLS habilitado em todas)
- Trigger: `on_auth_user_created` em `auth.users`
- Políticas RLS: 4 por tabela pública + 3 em `storage.objects` (upload/read/delete de PDFs)
- Bucket privado `contracts` em `storage.buckets` (`public = false`, limite 5 MB, MIME `application/pdf`)

Nenhuma migration precisou ser reaplicada. Os scripts usam `IF NOT EXISTS` / `DROP POLICY IF EXISTS`, mas a estrutura já estava completa.

**Aplicar manualmente (se outro ambiente):** Supabase Dashboard → SQL Editor, na ordem `001` → `004`. Ou, com `DATABASE_URL` / service role configurados: `psql "$DATABASE_URL" -f supabase/001_profiles.sql` (e assim por diante).

## ESLint

Configurado para **Next.js 16** (o comando `next lint` foi removido).

| Item | Detalhe |
| ---- | ------- |
| Pacotes | `eslint`, `eslint-config-next` (devDependencies) |
| Config | `eslint.config.mjs` — flat config com `eslint-config-next/core-web-vitals` |
| Scripts | `"lint": "eslint ."`, `"lint:fix": "eslint . --fix"` |
| Ignores | `.next/**`, `out/**`, `build/**`, `next-env.d.ts`, `coverage/**`, `node_modules/**` |

**Resultado `npm run lint`:** exit 0 — 0 erros, 2 avisos (`react-hooks/incompatible-library` em formulários com `form.watch()`; compatível com React Compiler, sem ação obrigatória).

## Próximos passos

1. **Pós-V1:** página de conta/perfil, toggle de tema escuro, componentes Magic UI (opcional).
