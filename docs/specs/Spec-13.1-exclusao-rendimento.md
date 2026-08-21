# Spec 13.1 — Exclusão de rendimento mensal

**Fase:** Rendimentos de aluguel (extensão da Fase 4)  
**Status:** ✅ Concluída  
**Motivação:** Permitir correção de lançamentos incorretos (valor, mês ou status digitados errado).

---

## Objetivo

Permitir que o usuário exclua um rendimento mensal registrado por engano, com confirmação explícita, sem afetar outros lançamentos nem dados de terceiros.

---

## Contexto atual

- **Spec 11** cobre o cadastro; **Spec 12** a linha do tempo; **Spec 13** filtros e resumo.
- A tabela `rental_incomes` já possui policy RLS de `DELETE` para o próprio usuário (`003_rental_incomes.sql`).
- A UI atual (`rental-income-timeline.tsx`) exibe cada item (mês, valor, status) **sem ação de exclusão**.
- Não existe Server Action de delete nem componente de confirmação.

---

## Descrição

Na linha do tempo de rendimentos do detalhe do imóvel, cada lançamento deve oferecer uma ação **Excluir**. Ao acionar, o sistema solicita confirmação, remove o registro e atualiza a linha do tempo, o resumo financeiro e o dashboard.

A exclusão é **física** (hard delete), não soft delete. Após excluir, o usuário pode registrar novamente a mesma competência se necessário.

---

## Regras de negócio

1. Apenas o **usuário dono** do rendimento pode excluí-lo (`user_id = auth.uid()`).
2. A exclusão exige que o rendimento pertença ao **imóvel** exibido na página (`property_id` consistente).
3. **Imóvel apenas para venda (`sale`):** se houver histórico legado, a exclusão continua permitida (correção de dados antigos); novos cadastros permanecem bloqueados (Spec 11).
4. **Imóvel soft-deleted:** rendimentos históricos podem ser excluídos pelo dono; a action valida `user_id`, não exige imóvel ativo para delete.
5. Exclusão de um rendimento **não** altera contratos, imóvel nem outros rendimentos.
6. Após exclusão, a competência (`property_id + reference_month`) fica **livre** para novo lançamento.
7. Mensagens de erro genéricas; não revelar existência de rendimento de outro usuário (404 ou mensagem neutra).

---

## Fluxo do usuário

1. Usuário acessa o detalhe de um imóvel com rendimentos.
2. Na linha do tempo, identifica um lançamento incorreto.
3. Clica em **Excluir** (ícone ou botão secundário/destructive no card do item).
4. Sistema abre diálogo de confirmação com:
   - mês de referência formatado (ex.: *Agosto de 2026*);
   - valor e status do lançamento;
   - aviso de que a ação não pode ser desfeita.
5. Usuário confirma ou cancela.
6. Se confirmar:
   - botão entra em estado pendente (evita duplo clique);
   - sistema exclui o registro;
   - toast de sucesso;
   - página revalida: timeline, totais do período e dashboard.

---

## UI / UX

| Elemento | Requisito |
|----------|-----------|
| Local | Card de cada item na `RentalIncomeTimeline` |
| Controle | Botão ou ícone com label acessível (`aria-label="Excluir rendimento de …"`) |
| Confirmação | `AlertDialog` (padrão do projeto, como `delete-property-dialog.tsx`) |
| Mobile | Área de toque ≥ 44px; ação visível sem depender de hover |
| Loading | Desabilitar confirmar/cancelar durante `isPending` |
| Feedback | Toast sucesso/erro; item some da lista após sucesso |

**Texto sugerido do diálogo:**

- **Título:** Excluir rendimento?
- **Descrição:** O lançamento de **{mês}** no valor de **{valor}** ({status}) será removido permanentemente. Você poderá registrar novamente essa competência depois.

---

## Camada técnica

### Server Action

**Arquivo:** `src/app/(painel)/imoveis/[id]/_actions/delete-rental-income.ts`

```typescript
deleteRentalIncomeAction(input: { id: string; property_id: string }): Promise<ActionResult>
```

**Passos:**

1. Validar input com Zod (`id` e `property_id` UUID).
2. `requireAuth()`.
3. Buscar rendimento com `.eq("id", id).eq("user_id", user.id).eq("property_id", property_id).maybeSingle()`.
4. Se não encontrado → `{ success: false, message: "Rendimento não encontrado." }`.
5. `DELETE` via Supabase client (RLS reforça ownership).
6. `revalidatePath(\`/imoveis/${property_id}\`)` e `revalidatePath("/dashboard")`.
7. Retornar `{ success: true }`.

### Componente

**Arquivo:** `src/app/(painel)/imoveis/[id]/_components/delete-rental-income-dialog.tsx`

- Props: `income: RentalIncome`, `propertyId: string`.
- Client Component; `useTransition` + toast; `router.refresh()` após sucesso.

### Integração

- `rental-income-timeline.tsx`: renderizar `DeleteRentalIncomeDialog` em cada item.
- Passar `propertyId` da página pai (`RentalIncomeSection`).

### Banco / RLS

- **Nenhuma migração SQL obrigatória** — policy `"Users delete own rental incomes"` já existe.
- Opcional futuro: índice composto `(user_id, id)` se volume crescer (não bloqueante na V1).

---

## Impacto em outras áreas

| Área | Comportamento esperado |
|------|------------------------|
| Spec 13 — Resumo | Total recebido e média recalculados após refresh |
| Spec 19 — Dashboard | Contadores de recebido/pendente atualizados via `revalidatePath` |
| Spec 11 — Novo cadastro | Competência liberada após delete do lançamento duplicado |

---

## Segurança

- Tratar action como endpoint público: auth + autorização sempre no servidor.
- Não aceitar `user_id` do cliente.
- Tentativa de excluir rendimento alheio → falha sem vazar dados.
- Logs server-side sem PII (sem valor/documento em console).

---

## Critérios de aceite

- [ ] Cada item da linha do tempo exibe ação de excluir (quando o usuário é o dono).
- [ ] Exclusão exige confirmação em diálogo.
- [ ] Duplo clique no confirmar não cria efeitos colaterais.
- [ ] Após exclusão, o item desaparece da timeline e os totais do período são atualizados.
- [ ] Usuário consegue registrar novamente a mesma competência após excluir.
- [ ] Usuário **não** consegue excluir rendimento de outro usuário.
- [ ] Imóvel `sale` com histórico: exclusão permitida; novo cadastro continua bloqueado.
- [ ] Dashboard reflete a remoção após navegação/refresh.
- [ ] Mensagens de erro amigáveis, sem detalhes internos.

---

## Testes

**Unitários**

- Schema Zod da action (UUIDs inválidos rejeitados).

**Integração / manual (dois usuários)**

- User A exclui próprio rendimento → sucesso.
- User B tenta excluir rendimento de A (mesmo `id`) → falha.
- Excluir e recadastrar mesma competência → sucesso.

---

## Dependências

- Spec 11 (registro)
- Spec 12 (linha do tempo)
- Spec 13 (resumo — recálculo após delete)

---

## Fora do escopo

- Edição inline de valor/status/mês (correção via excluir + recadastrar na V1).
- Lixeira ou recuperação de rendimento excluído.
- Exclusão em lote.
- Auditoria/histórico de alterações.
- Permissões compartilhadas entre usuários.

---

## Estimativa de implementação

| Item | Esforço |
|------|---------|
| Action + Zod | Pequeno |
| Dialog + integração timeline | Pequeno |
| Revalidação dashboard | Trivial |
| Testes | Pequeno |

**Total:** ~1 sessão de desenvolvimento.
