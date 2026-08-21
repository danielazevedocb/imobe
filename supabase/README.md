# Supabase — Scripts SQL do Imobe

Execute os arquivos **na ordem numérica** no Supabase Dashboard → SQL Editor.

## Ordem de execução

1. `001_profiles.sql` — tabela de perfis + trigger de signup + RLS
2. `002_properties.sql` — tabela de imóveis + enums + RLS
3. `003_rental_incomes.sql` — rendimentos mensais + enum de status + RLS
4. `004_contracts.sql` — contratos + snapshot JSONB + bucket privado `contracts` + policies de Storage

## Configuração do projeto

1. Crie um projeto em [supabase.com](https://supabase.com)
2. Copie **Project URL** e **anon public key** para `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon
```

3. Em **Authentication → Providers → Email**, desabilite "Confirm email" em desenvolvimento para login imediato após cadastro.

## Verificação

Após executar os scripts, confirme no Table Editor:
- `profiles`
- `properties`
- `rental_incomes`
- `contracts`

E em **Storage**:
- bucket privado `contracts`

E em **Authentication → Policies** que as policies RLS estão ativas.

## Segurança

- Todas as tabelas usam RLS com `auth.uid() = user_id`.
- Rendimentos só podem ser inseridos em imóveis próprios com finalidade de aluguel.
- Contratos vinculados exigem imóvel compatível e pertencente ao usuário.
- PDFs ficam em `contracts/{user_id}/{contract_id}.pdf` com policies de Storage por usuário.
- Não é necessário expor `service_role` no frontend.
