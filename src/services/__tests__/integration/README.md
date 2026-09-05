# Testes de integração Supabase

Estes testes validam RPCs, RLS e idempotência contra um projeto Supabase real.

## Pré-requisitos

1. Aplicar as migrações `001` a `007` no projeto de teste.
2. Definir variáveis de ambiente:

```env
SUPABASE_TEST_URL=https://seu-projeto.supabase.co
SUPABASE_TEST_ANON_KEY=sua-chave-anon
```

3. Executar:

```bash
npm run test:integration
```

Sem as variáveis acima, a suíte é ignorada automaticamente.

## Escopo coberto

- Pagamento rápido: competência livre, confirmação de pendência, idempotência por `operation_key`
- Fotos: staging inacessível sem metadado, commit atômico, limite de dez fotos
- Perfil: constraints de telefone e redes sociais
