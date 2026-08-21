# Spec 15.1 — Atalho "Gerar contrato" no detalhe do imóvel

**Fase:** Contratos (extensão da Fase 5) / Detalhe do imóvel  
**Status:** ✅ Concluída  
**Motivação:** Reduzir cliques ao gerar contrato a partir do imóvel que o usuário já está visualizando (como na área destacada ao lado de **Editar** e **Excluir**).

---

## Objetivo

Oferecer um atalho no cabeçalho do detalhe do imóvel para iniciar a geração de contrato **já vinculado** àquele imóvel, respeitando a finalidade (`rent`, `sale`, `both`) e reutilizando o fluxo existente das Specs 15–17.

---

## Contexto atual

- **Spec 08** — detalhe do imóvel com ações **Editar** e **Excluir**.
- **Spec 15** — contrato vinculado exige escolher imóvel na lista em `/contratos/novo/vinculado?type=rent|sale`.
- **Spec 18** — seção "Contratos" no rodapé do detalhe lista contratos já gerados.
- O usuário precisa hoje: Contratos → Gerar → tipo → imóvel cadastrado → **selecionar de novo** o imóvel que já estava vendo.

**Gap:** não há botão **Gerar contrato** no cabeçalho do detalhe nem deep link com `property_id` pré-selecionado.

---

## Descrição

No cabeçalho do detalhe do imóvel (`property-detail.tsx`), adicionar ação **Gerar contrato** ao lado de **Editar** e **Excluir**.

Ao clicar, o sistema encaminha o usuário diretamente para o formulário de contrato vinculado (`/contratos/novo/vinculado`), com:

- `type` definido conforme a finalidade do imóvel;
- `property_id` igual ao imóvel atual;
- imóvel **pré-selecionado** e dados cadastrais exibidos em revisão.

Não gera PDF imediatamente — apenas inicia o wizard no passo correto, como atalho da Spec 15.

---

## Regras de negócio

| Finalidade do imóvel | Comportamento do botão |
|----------------------|------------------------|
| `rent` | Um botão → contrato de **locação** vinculado |
| `sale` | Um botão → contrato de **venda** vinculado |
| `both` | Menu/dropdown com duas opções: **Locação** e **Venda** |

Regras adicionais:

1. Botão visível apenas para imóvel **ativo** (`deleted_at` nulo) — página já usa `getPropertyById` com esse filtro.
2. Tipo de contrato deve ser **compatível** com a finalidade (mesmas regras da Spec 15 e RLS em `004_contracts.sql`).
3. `property_id` na URL é **sugestão de UX**; o servidor **revalida** ownership e compatibilidade na geração (Spec 17).
4. Se `property_id` na URL for inválido, inexistente ou incompatível com `type`, o formulário abre **sem** pré-seleção e exibe aviso discreto (toast ou alerta no topo).
5. Disponibilidade para locação/venda (`rent_available` / `sale_available`) **não bloqueia** geração de contrato — contrato é documento operacional independente da flag de disponibilidade.
6. Texto do botão: **Gerar contrato**; ícone sugerido: `FileText` (lucide).

---

## Fluxo do usuário

### Imóvel só para aluguel (`rent`)

1. Usuário abre detalhe do imóvel.
2. Clica em **Gerar contrato**.
3. Sistema navega para `/contratos/novo/vinculado?type=rent&property_id={id}`.
4. Formulário abre com imóvel já selecionado.
5. Usuário preenche partes, condições, revisa e gera PDF (fluxo existente).

### Imóvel só para venda (`sale`)

Mesmo fluxo com `type=sale`.

### Imóvel aluguel e venda (`both`)

1. Usuário clica em **Gerar contrato**.
2. Sistema exibe menu: **Contrato de locação** | **Contrato de venda**.
3. Usuário escolhe uma opção.
4. Navega para `/contratos/novo/vinculado?type={rent|sale}&property_id={id}`.

---

## UI / UX

| Elemento | Requisito |
|----------|-----------|
| Posição | Cabeçalho do detalhe, grupo de ações à direita (entre Editar e Excluir, ou antes de Excluir) |
| Variante | `outline` ou `secondary` — não competir visualmente com **Excluir** (destructive) |
| Ícone + label | `FileText` + "Gerar contrato" |
| Mobile | Botão empilha com Editar/Excluir; área de toque ≥ 44px |
| `both` | `DropdownMenu` (shadcn) ou dois links no menu — evitar modal |
| Acessibilidade | `aria-label` descritivo; foco visível; teclado completo no dropdown |

**Ordem sugerida das ações (desktop):**

`[ Gerar contrato ] [ Editar ] [ Excluir ]`

---

## Camada técnica

### 1. Componente no detalhe do imóvel

**Arquivo:** `src/app/(painel)/imoveis/[id]/_components/generate-contract-button.tsx`

- Client Component (dropdown quando `purpose === "both"`).
- Props: `propertyId: string`, `purpose: PropertyPurpose`.
- Monta URLs:

```text
/contratos/novo/vinculado?type=rent&property_id={uuid}
/contratos/novo/vinculado?type=sale&property_id={uuid}
```

### 2. Pré-seleção no formulário vinculado

**Arquivos:**

- `src/app/(painel)/contratos/novo/vinculado/page.tsx` — ler `property_id` de `searchParams`.
- `src/app/(painel)/contratos/novo/_components/linked-contract-form.tsx` — aceitar prop opcional `initialPropertyId?: string`.

**Comportamento:**

- Se `initialPropertyId` estiver na lista de imóveis compatíveis → usar como `defaultValues.property_id`.
- Caso contrário → primeiro imóvel da lista (comportamento atual) + toast: *"Não foi possível pré-selecionar este imóvel. Selecione manualmente."*

### 3. Validação de query params (opcional, recomendado)

**Arquivo:** `src/lib/validations/contract-schema.ts` ou util dedicado

```typescript
linkedContractEntrySchema = z.object({
  type: z.enum(["rent", "sale"]),
  property_id: z.string().uuid().optional(),
});
```

Usar no server page antes de passar props ao client.

### 4. Integração em `property-detail.tsx`

```tsx
<GenerateContractButton
  propertyId={property.id}
  purpose={property.purpose}
/>
```

### 5. Banco / segurança

- **Nenhuma migração SQL** necessária.
- RLS e `generateContractAction` já garantem imóvel próprio e tipo compatível.
- Não expor dados de imóvel alheio via `property_id` na URL.

---

## Impacto em outras specs

| Spec | Efeito |
|------|--------|
| Spec 08 | Novo atalho no detalhe |
| Spec 15 | Entrada direta no fluxo vinculado |
| Spec 17 | Sem alteração na geração de PDF |
| Spec 18 | Contratos gerados continuam listados na seção inferior do detalhe |

---

## Critérios de aceite

- [ ] Botão **Gerar contrato** visível no cabeçalho do detalhe do imóvel.
- [ ] Imóvel `rent` → atalho direto para contrato de locação vinculado.
- [ ] Imóvel `sale` → atalho direto para contrato de venda vinculado.
- [ ] Imóvel `both` → usuário escolhe locação ou venda antes de navegar.
- [ ] Formulário vinculado abre com imóvel atual pré-selecionado quando compatível.
- [ ] URL inválida não quebra a página; fallback gracioso.
- [ ] Geração de PDF e listagem pós-geração funcionam como hoje.
- [ ] Layout responsivo no mobile (320px+).
- [ ] Usuário não consegue vincular contrato a imóvel de outro usuário (servidor).

---

## Testes

**Manual**

- Imóvel `rent` → botão → formulário com imóvel correto pré-selecionado → PDF gerado → aparece na seção Contratos do detalhe.
- Imóvel `both` → menu com duas opções → cada tipo abre formulário correto.
- `property_id` adulterado na URL → formulário sem pré-seleção ou erro amigável.

**Automatizado (opcional)**

- Util que monta URL a partir de `purpose` + `propertyId`.
- Schema de query params (`type`, `property_id`).

---

## Dependências

- Spec 08 (detalhe do imóvel)
- Spec 15 (contrato vinculado)
- Spec 17 (geração de PDF)

---

## Fora do escopo

- Gerar PDF em one-click sem preencher partes/contrato.
- Pré-preencher dados das partes a partir de cadastros anteriores.
- Assinatura digital ou envio por e-mail.
- Botão na **listagem** de imóveis (cards) — apenas detalhe nesta spec.
- Contrato manual (`/contratos/novo/manual`) a partir do detalhe.

---

## Estimativa

| Item | Esforço |
|------|---------|
| `GenerateContractButton` + integração header | Pequeno |
| Query `property_id` + pré-seleção no form | Pequeno |
| Dropdown para `both` | Pequeno |

**Total:** ~1 sessão de desenvolvimento.
