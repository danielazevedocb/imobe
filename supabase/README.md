# Supabase — Scripts SQL do Imobe

Execute os arquivos **na ordem numérica** no Supabase Dashboard → SQL Editor.

## Ordem de execução

1. `001_profiles.sql` — tabela de perfis + trigger de signup + RLS
2. `002_properties.sql` — tabela de imóveis + enums + RLS
3. `003_rental_incomes.sql` — rendimentos mensais + enum de status + RLS
4. `004_contracts.sql` — contratos + snapshot JSONB + bucket privado `contracts` + policies de Storage
5. `005_quick_payments.sql` — operações idempotentes + RPCs de pagamento rápido
6. `006_profile_contacts.sql` — Instagram/TikTok no perfil + constraints
7. `007_property_photos.sql` — fotos privadas + staging + bucket `property-photos` + RPCs transacionais
8. `008_fix_property_photo_storage_policies.sql` — corrige policies de Storage para mover staging → properties

## Configuração do projeto

1. Crie um projeto em [supabase.com](https://supabase.com)
2. Copie **Project URL** e **anon public key** para `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon
```

3. Em **Authentication → Providers → Email**, desabilite "Confirm email" em desenvolvimento para login imediato após cadastro.

## Dependências da aplicação

- `sharp` — validação real de PNG/JPEG no servidor (upload de fotos)
- Upload de fotos ocorre por arquivo via `POST /api/property-photos/upload` (até 3 MB por foto)

## Verificação local

Após executar os scripts, confirme no Table Editor:

- `profiles`
- `properties`
- `rental_incomes`
- `contracts`
- `rental_payment_operations`
- `property_photo_operations`
- `property_photo_staging`
- `property_photos`

E em **Storage**:

- bucket privado `contracts`
- bucket privado `property-photos` (PNG/JPEG, 3 MB)

Confirme também as funções RPC:

- `get_rental_competency_status`
- `commit_quick_rental_payment`
- `prepare_property_photo_operation`
- `register_property_photo_staging`
- `commit_property_create_with_photos`
- `commit_property_update_with_photos`
- `soft_delete_property_with_photos`

## Segurança

- Todas as tabelas usam RLS com `auth.uid() = user_id`.
- Rendimentos só podem ser inseridos em imóveis próprios com finalidade de aluguel.
- Contratos vinculados exigem imóvel compatível e pertencente ao usuário.
- PDFs ficam em `contracts/{user_id}/{contract_id}.pdf` com policies de Storage por usuário.
- Fotos ficam em `{user_id}/staging/...` durante upload e `{user_id}/properties/{property_id}/...` após commit; leitura no Storage exige metadado confirmado em `property_photos`.
- Não é necessário expor `service_role` no frontend.

## Testes de integração (opcional)

Com Supabase local ou projeto de teste configurado, defina `SUPABASE_TEST_URL` e `SUPABASE_TEST_ANON_KEY` para executar os testes de integração documentados em `src/services/__tests__/integration/README.md`.
