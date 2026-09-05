# PRD — Sidebar e header fixos com colapso (rail de ícones)

> Tipo: PRD de feature · Data: 2026-09-05
> **Status:** Implementada
>
> <!-- Valores possíveis: "Aguardando implementação" | "Implementada". Atualize para "Implementada" quando todas as specs estiverem concluídas. -->

## 1. Visão geral

No painel autenticado do Imobe (desktop), a barra lateral de navegação e o cabeçalho do usuário devem permanecer visíveis enquanto a pessoa rola o conteúdo. Além disso, a pessoa pode recolher a sidebar para uma faixa estreita só com ícones (rail), ganhando espaço de tela, e reabri-la quando quiser. A preferência aberta/recolhida é lembrada neste navegador nas próximas visitas. No mobile, o comportamento atual (header + drawer) não muda.

## 2. Problema que resolve

Em páginas longas (listas de imóveis, contratos, formulários), a sidebar e o header sobem junto com o scroll e somem da tela. A pessoa precisa rolar de volta ao topo para navegar ou acessar o perfil. Também não há forma de reduzir a sidebar para ter mais área útil de conteúdo.

## 3. Público-alvo

Usuários autenticados do painel Imobe que usam o sistema em desktop (viewport a partir do breakpoint em que a sidebar já é exibida hoje).

## 4. Objetivo do recorte atual

Entregar layout fixo de sidebar + header no desktop, com colapso para rail de ícones (clique navega + tooltip com o nome), toggle no topo da sidebar e memória local da preferência — sem alterar mobile nem redesenhar a navegação.

## 5. Funcionalidades

**Essenciais:**

- Sidebar desktop permanece fixa (visível) ao rolar o conteúdo do painel
- Header desktop (área do usuário / “Meu perfil”) permanece fixo ao rolar
- Colapsar a sidebar para uma faixa estreita só com ícones (rail)
- Expandir de volta para a sidebar com rótulos
- Botão de abrir/fechar no topo da sidebar, junto à marca “Imobe”
- No estado recolhido: clique no ícone navega direto; ao passar o mouse, tooltip com o rótulo (Dashboard, Imóveis, Contratos)
- Lembrar preferência aberta/recolhida neste navegador entre visitas e recarregamentos
- Conteúdo principal usa o espaço liberado quando a sidebar está recolhida

**Desejáveis:**

- Feedback visual claro do estado ativo da rota também no rail (ícone destacado)
- Acessibilidade básica: botão de toggle com rótulo compreensível; tooltips não bloqueiam navegação por teclado quando possível

## 6. Fora do escopo

- Redesign visual da sidebar ou do header
- Mudanças no menu mobile / drawer
- Novos itens de navegação
- Preferência sincronizada na conta (nuvem) — apenas memória neste navegador
- Tema claro/escuro ou personalização visual
- Atalhos de teclado dedicados para colapsar (não pedido neste recorte)

## 7. Regras de negócio

- Regra 1: Fixação e colapso aplicam-se apenas ao layout desktop do painel (onde a sidebar já é mostrada). Mobile permanece inalterado.
- Regra 2: Colapso reduz a sidebar a um rail de ícones; não remove a navegação da tela.
- Regra 3: Preferência aberta/recolhida é por navegador/dispositivo local; não depende de login em outra máquina.
- Regra 4: Se não houver preferência salva, a sidebar inicia **aberta** (estado padrão atual).
- Regra 5: Itens de navegação e ações já existentes (links Dashboard/Imóveis/Contratos, logout, área do usuário) continuam disponíveis; o colapso não remove destinos.
- Regra 6: No rail, o clique no ícone leva à mesma rota que o item com rótulo na sidebar expandida.
- Regra 7: O header fixo não cobre o conteúdo de forma que impeça leitura/ação; o conteúdo principal rola abaixo da área fixa.
- Regra 8: A marca “Imobe” e o botão de toggle permanecem acessíveis no topo da sidebar nos dois estados (aberta e recolhida).

## 8. Fluxos principais

### Fluxo 1 — Rolar conteúdo com chrome fixo (desktop)

1. Usuário autenticado abre uma página do painel com conteúdo longo.
2. Rola a página para baixo.
3. Sidebar e header permanecem visíveis na viewport.
4. Conteúdo principal rola normalmente sob o header; a navegação lateral continua utilizável sem voltar ao topo.

### Fluxo 2 — Recolher sidebar (rail)

1. Usuário clica no botão de colapsar no topo da sidebar (junto a “Imobe”).
2. Sidebar anima/transita para o rail de ícones.
3. Área de conteúdo ganha espaço horizontal.
4. Preferência “recolhida” é gravada localmente neste navegador.

### Fluxo 3 — Navegar com sidebar recolhida

1. Sidebar está no estado rail.
2. Usuário passa o mouse sobre um ícone e vê o tooltip com o nome.
3. Usuário clica no ícone.
4. Sistema navega para a rota correspondente (mesmo destino da sidebar expandida).
5. Item da rota atual permanece visualmente destacado no rail.

### Fluxo 4 — Expandir sidebar

1. Com a sidebar recolhida, usuário clica no botão de expandir no topo.
2. Sidebar volta ao estado com rótulos.
3. Preferência “aberta” é gravada localmente.

### Fluxo 5 — Retornar em outra visita

1. Usuário havia deixado a sidebar recolhida.
2. Fecha o navegador ou recarrega a página do painel (mesmo navegador).
3. Ao abrir o painel no desktop, a sidebar inicia no estado recolhido.
4. Se nunca houver preferência salva, inicia aberta.

## 9. Critérios de aceite

- No desktop, ao rolar o conteúdo do painel, a sidebar permanece visível
- No desktop, ao rolar o conteúdo do painel, o header (nome + acesso ao perfil) permanece visível
- O usuário consegue colapsar a sidebar para um rail só com ícones pelo botão no topo da sidebar
- O usuário consegue expandir a sidebar de volta pelo mesmo controle
- No rail, o clique no ícone navega para a página correta
- No rail, ao passar o mouse no ícone, aparece tooltip com o rótulo
- Após recarregar ou voltar em outra sessão no mesmo navegador, o estado aberta/recolhida é o último escolhido
- Sem preferência salva, a sidebar inicia aberta
- No mobile, o comportamento atual (header + drawer) não muda
- Não há novos itens de menu nem redesign amplo da navegação
- Preferência não precisa estar sincronizada entre dispositivos/contas

## 10. Stack

Stack já existente do projeto (alto nível):

- Next.js (App Router) + React + TypeScript
- Tailwind CSS + componentes de UI no padrão do projeto (Shadcn/Radix)
- Autenticação e dados via Supabase (já usados no painel; esta feature não exige novos serviços de backend)
- Memória da preferência: armazenamento local no navegador (sem sync em nuvem)

Nenhuma biblioteca nova é obrigatória para o recorte; se alguma for introduzida na implementação, deve ser justificada e mínima.

## 11. Justificativa da stack

A feature é comportamental de layout do painel já existente. Reutilizar Next.js, React e o design system atual evita reinventar navegação e autenticação. Persistência só no navegador atende o pedido sem schema, API ou perfil no Supabase.

## 12. Fases de construção

### Fase 1 — Layout fixo no desktop

Objetivo: sidebar e header permanecem visíveis ao rolar, sem alterar o colapso ainda (ou com estado sempre expandido equivalente ao atual).
Specs:

- Spec 01 — Sidebar e header fixos no desktop

### Fase 2 — Colapso em rail e navegação

Objetivo: permitir recolher/expandir, navegar no rail com tooltip e ajustar o espaço do conteúdo.
Specs:

- Spec 02 — Colapsar e expandir sidebar (rail de ícones)
- Spec 03 — Navegação no rail com tooltip e destaque da rota ativa

### Fase 3 — Preferência local

Objetivo: lembrar aberta/recolhida neste navegador e aplicar no carregamento do painel desktop.
Specs:

- Spec 04 — Persistir preferência aberta/recolhida no navegador

## 13. Specs funcionais detalhadas

> Cada spec deve ser autossuficiente: um agente de codificação vai ler SÓ esta spec (mais as dependências) para montar o plano técnico e implementar. Preencha todos os campos; se um não se aplica, escreva "Não se aplica" e o porquê.

### Spec 01 — Sidebar e header fixos no desktop

- **Fase:** Fase 1 — Layout fixo no desktop
- **Objetivo (o quê):** No painel desktop, a sidebar de navegação e o header com a área do usuário ficam sempre visíveis na viewport enquanto o conteúdo principal rola.
- **Intenção (por quê):** Eliminar a necessidade de voltar ao topo da página para navegar ou acessar o perfil em telas longas.
- **Contexto:** O painel já tem layout com sidebar (marca Imobe, links Dashboard / Imóveis / Contratos, logout) e header desktop com nome do usuário e acesso a “Meu perfil”. No mobile já existe header próprio e drawer; esta spec não os altera. Hoje sidebar e header acompanham o scroll da página.
- **Atores:** Usuário autenticado no painel, em viewport desktop.
- **Descrição do comportamento:** Ao abrir qualquer rota do painel no desktop, a coluna da sidebar e a barra do header ocupam posições fixas na viewport. O usuário rola apenas a região de conteúdo principal. Links da sidebar, logout e a área do usuário no header continuam clicáveis a qualquer momento do scroll. Em viewports em que a sidebar não é exibida (mobile), nada desta spec se aplica.
- **Entradas e saídas:**
  - Entradas: viewport desktop; scroll do usuário na área de conteúdo.
  - Saídas: sidebar e header permanecem visíveis; conteúdo rola sem “levar embora” o chrome de navegação.
- **Dados/entidades envolvidos (conceitual):** Não se aplica — não há entidades de negócio novas; apenas comportamento de layout.
- **Estados e transições:** Não se aplica a estados de colapso nesta spec (tratados nas Specs 02–04). Estado visual esperado: chrome fixo + conteúdo rolável.
- **Regras de negócio:**
  - Fixação só no desktop do painel.
  - Header fixo não deve impedir interação com o conteúdo (conteúdo rola abaixo da área fixa).
  - Mobile inalterado.
- **Validações:** Não se aplica — não há formulário ou input de negócio.
- **Fluxo do usuário (passo a passo):**
  1. Entra em uma página longa do painel no desktop.
  2. Rola o conteúdo para baixo.
  3. Continua vendo sidebar e header.
  4. Usa um link da sidebar ou “Meu perfil” sem voltar ao topo.
- **Casos de borda e erros:**
  - Página curta (sem scroll): layout permanece coerente; sidebar e header visíveis.
  - Redimensionar para mobile: layout volta ao comportamento mobile atual (sem sidebar fixa desktop).
  - Conteúdo alto com scroll interno em subáreas: o chrome do painel continua fixo em relação à viewport da página do painel.
- **Impacto no existente:** Altera a sensação de scroll do layout do painel desktop; não muda rotas, dados nem itens de menu.
- **Critérios de aceite (Dado/Quando/Então):**
  - Dado um usuário no painel desktop com conteúdo longo, Quando ele rola para baixo, Então a sidebar permanece visível.
  - Dado o mesmo contexto, Quando ele rola para baixo, Então o header com a área do usuário permanece visível.
  - Dado viewport mobile, Quando ele usa o painel, Então o comportamento mobile atual (sem esta fixação desktop) permanece.
- **Definição de pronto:** Em páginas longas do painel no desktop, sidebar e header não desaparecem ao rolar; mobile inalterado; navegação e perfil ainda funcionam.
- **Dependências:** Nenhuma.
- **Fora do escopo desta spec:** Colapso/rail, tooltips, persistência de preferência, mudanças no drawer mobile, redesign.

### Spec 02 — Colapsar e expandir sidebar (rail de ícones)

- **Fase:** Fase 2 — Colapso em rail e navegação
- **Objetivo (o quê):** Permitir recolher a sidebar desktop para uma faixa estreita só com ícones e expandir de volta para a sidebar com rótulos, via botão no topo ao lado de “Imobe”.
- **Intenção (por quê):** Dar mais espaço horizontal ao conteúdo sem remover a navegação da tela.
- **Contexto:** Depende do layout fixo da Spec 01. A sidebar atual mostra marca, links com ícone+texto e logout. O colapso não esconde totalmente a barra — vira rail. Mobile continua sem esta interação.
- **Atores:** Usuário autenticado no painel desktop.
- **Descrição do comportamento:** No topo da sidebar há um controle explícito para alternar entre “aberta” e “recolhida”. No estado aberto, a sidebar exibe marca, rótulos dos links e logout como hoje (ajustado apenas pelo novo controle). No estado recolhido, a sidebar reduz a largura e mostra essencialmente ícones (e o controle/marca de forma compacta no topo); o conteúdo principal se expande para ocupar o espaço liberado. Alternar o estado atualiza a UI imediatamente.
- **Entradas e saídas:**
  - Entradas: clique/ativação do botão de toggle no topo da sidebar.
  - Saídas: sidebar em estado aberto ou rail; conteúdo principal com largura ajustada.
- **Dados/entidades envolvidos (conceitual):** Preferência de layout em memória de sessão da UI (persistência em disco do navegador é Spec 04); estados “aberta” e “recolhida”.
- **Estados e transições:**
  - Aberta → (toggle) → Recolhida (rail)
  - Recolhida → (toggle) → Aberta
  - Estado inicial sem preferência salva: Aberta (Spec 04 confirma a leitura; nesta spec o toggle funciona nos dois sentidos).
- **Regras de negócio:**
  - Toggle fica no topo da sidebar, junto à marca “Imobe”.
  - Colapso = rail de ícones, não ocultação total.
  - Só desktop; mobile inalterado.
  - Não adicionar novos itens de navegação.
- **Validações:** O controle deve ser acionável (botão/controle com propósito claro de expandir/recolher).
- **Fluxo do usuário (passo a passo):**
  1. Com a sidebar aberta, clica no toggle.
  2. Sidebar vira rail; conteúdo ganha espaço.
  3. Clica de novo no toggle.
  4. Sidebar volta com rótulos.
- **Casos de borda e erros:**
  - Clicar várias vezes seguidas: estado final coerente com o último clique (aberto ou recolhido).
  - Logout e links devem permanecer utilizáveis nos dois estados (no rail, logout pode aparecer como ícone ou controle compacto equivalente — sem remover a ação).
  - Viewport passando de desktop para mobile: some a sidebar desktop; drawer mobile inalterado.
- **Impacto no existente:** Muda largura e densidade da sidebar desktop; páginas do painel passam a ter mais ou menos área útil conforme o estado.
- **Critérios de aceite (Dado/Quando/Então):**
  - Dado painel desktop com sidebar aberta, Quando o usuário aciona o toggle no topo, Então a sidebar passa a um rail só com ícones e o conteúdo ganha espaço.
  - Dado sidebar recolhida, Quando o usuário aciona o toggle, Então a sidebar volta ao estado com rótulos.
  - Dado qualquer estado, Quando o usuário está no mobile, Então este toggle/rail não substitui nem altera o drawer atual.
- **Definição de pronto:** Toggle no topo funciona nos dois sentidos; rail estreito vs sidebar completa; conteúdo reage à largura; sem redesign amplo nem novos itens de menu.
- **Dependências:** Spec 01 — layout fixo no desktop.
- **Fora do escopo desta spec:** Detalhe fino de tooltip e destaque de rota ativa (Spec 03); persistência entre visitas (Spec 04); sync na nuvem; redesign.

### Spec 03 — Navegação no rail com tooltip e destaque da rota ativa

- **Fase:** Fase 2 — Colapso em rail e navegação
- **Objetivo (o quê):** No estado recolhido, cada ícone de navegação leva à mesma rota do item expandido; ao passar o mouse, mostra tooltip com o rótulo; a rota atual permanece destacada.
- **Intenção (por quê):** Manter orientação e descoberta dos destinos quando os textos somem no rail.
- **Contexto:** Itens atuais: Dashboard, Imóveis, Contratos (mesmos destinos da sidebar expandida). Spec 02 entrega o estado rail; esta spec define a interação de navegação nesse estado.
- **Atores:** Usuário autenticado no painel desktop com sidebar recolhida.
- **Descrição do comportamento:** No rail, o usuário identifica destinos pelos ícones. Ao pairar o ponteiro sobre um ícone, aparece o nome do item (ex.: “Imóveis”). Um clique no ícone navega imediatamente para a rota correspondente, sem passo intermediário. O item correspondente à rota atual permanece visualmente distinto (ativo), como na sidebar expandida. Com a sidebar aberta, a navegação continua como hoje (ícone + texto); tooltips do rail não são obrigatórios no estado aberto.
- **Entradas e saídas:**
  - Entradas: hover/foco sobre ícone; clique no ícone; rota atual do painel.
  - Saídas: tooltip com rótulo; navegação para a página; destaque do item ativo.
- **Dados/entidades envolvidos (conceitual):** Itens de navegação (rótulo, destino/rota, indicação de ativo); estado visual da sidebar (recolhida).
- **Estados e transições:** Não se aplica além de “tooltip visível / oculto” no hover e “item ativo / inativo” conforme a rota.
- **Regras de negócio:**
  - Clique no ícone = mesma navegação do link com rótulo.
  - Tooltip exibe o rótulo textual do item.
  - Não criar novos destinos.
- **Validações:** Não se aplica a validação de formulário; destinos devem ser os já existentes do painel.
- **Fluxo do usuário (passo a passo):**
  1. Sidebar está recolhida.
  2. Passa o mouse sobre um ícone e lê o tooltip.
  3. Clica no ícone.
  4. Chega na página correta; o ícone dessa rota fica destacado.
- **Casos de borda e erros:**
  - Rota aninhada (ex.: detalhe de imóvel sob /imoveis): o item pai “Imóveis” (ou equivalente já usado hoje) permanece o ativo, seguindo a mesma lógica de destaque já existente no painel.
  - Tooltip não deve impedir o clique no ícone.
  - Sem hover (ex.: só teclado): o usuário ainda consegue ativar o link; o rótulo acessível do controle deve permitir entender o destino (mesmo que o tooltip de hover seja secundário).
- **Impacto no existente:** Comportamento de navegação no estado recolhido; não altera URLs nem permissões.
- **Critérios de aceite (Dado/Quando/Então):**
  - Dado sidebar recolhida, Quando o usuário passa o mouse no ícone de um item, Então vê o tooltip com o nome do item.
  - Dado sidebar recolhida, Quando o usuário clica no ícone, Então navega para a mesma página que o item expandido correspondente.
  - Dado o usuário em uma rota do painel com sidebar recolhida, Quando a página carrega, Então o ícone da seção atual aparece destacado.
- **Definição de pronto:** Rail navegável por clique, tooltips com rótulos, destaque de ativo coerente com o painel atual.
- **Dependências:** Spec 02 — estado rail disponível.
- **Fora do escopo desta spec:** Persistência da preferência; mudanças no mobile; novos itens de menu.

### Spec 04 — Persistir preferência aberta/recolhida no navegador

- **Fase:** Fase 3 — Preferência local
- **Objetivo (o quê):** Lembrar se a sidebar desktop estava aberta ou recolhida e restaurar esse estado ao recarregar ou voltar ao painel no mesmo navegador.
- **Intenção (por quê):** Evitar que o usuário reconfigure o layout a cada visita.
- **Contexto:** Specs 02–03 definem os estados e a UI. Esta spec define apenas a memória local da preferência (sem sincronizar com a conta no Supabase).
- **Atores:** Usuário autenticado no painel desktop neste navegador.
- **Descrição do comportamento:** Sempre que o usuário colapsa ou expande a sidebar, o sistema grava a preferência localmente neste navegador. Na próxima carga do layout do painel em desktop, o sistema lê essa preferência e inicia no estado correspondente. Se não existir preferência salva (primeira visita ou dados limpos), inicia **aberta**. A preferência não precisa aparecer em outra máquina ou outro navegador. Logout/login no mesmo navegador não precisa apagar a preferência de layout (é preferência de UI local, não dado de perfil).
- **Entradas e saídas:**
  - Entradas: mudança de estado via toggle; carregamento do painel desktop.
  - Saídas: estado inicial correto (aberta/recolhida); preferência atualizada após cada toggle.
- **Dados/entidades envolvidos (conceitual):** Preferência de layout da sidebar: valor “aberta” ou “recolhida”, escopo = este navegador.
- **Estados e transições:**
  - Sem valor salvo → Aberta (padrão)
  - Valor “recolhida” salvo → inicia Recolhida
  - Valor “aberta” salvo → inicia Aberta
  - Toggle → atualiza valor salvo
- **Regras de negócio:**
  - Persistência só local neste navegador (sem nuvem).
  - Padrão = aberta.
  - Não se aplica ao mobile.
- **Validações:** Se o valor salvo estiver inválido ou ilegível, tratar como ausência e usar padrão aberta.
- **Fluxo do usuário (passo a passo):**
  1. Recolhe a sidebar.
  2. Recarrega a página ou fecha e reabre o painel no mesmo navegador.
  3. Sidebar inicia recolhida.
  4. Expande, recarrega de novo → inicia aberta.
- **Casos de borda e erros:**
  - Armazenamento local indisponível (modo restrito): o toggle ainda funciona na sessão; não quebra o painel; na próxima visita pode voltar ao padrão aberta.
  - Dados corrompidos: ignora e usa aberta.
  - Troca de viewport para mobile e volta ao desktop: no retorno ao desktop, restaura a preferência local se ainda existir.
- **Impacto no existente:** Nenhum impacto em perfil, banco ou outras features; apenas UX do layout desktop.
- **Critérios de aceite (Dado/Quando/Então):**
  - Dado o usuário recolheu a sidebar, Quando ele recarrega o painel no mesmo navegador, Então a sidebar inicia recolhida.
  - Dado o usuário expandiu a sidebar, Quando ele volta em outra visita no mesmo navegador, Então a sidebar inicia aberta.
  - Dado que não há preferência salva, Quando o painel desktop carrega, Então a sidebar inicia aberta.
  - Dado preferência apenas local, Quando o usuário abre o painel em outro navegador sem histórico, Então não se espera o mesmo estado (sem sync na conta).
- **Definição de pronto:** Preferência sobrevive a reload/nova visita no mesmo navegador; padrão seguro; falha de storage não derruba o painel.
- **Dependências:** Spec 02 — estados aberta/recolhida e toggle.
- **Fora do escopo desta spec:** Sync com perfil/Supabase; preferências por usuário autenticado na nuvem; UI de configurações dedicada.

## 14. Ordem recomendada de implementação

1. Spec 01 — Sidebar e header fixos no desktop
2. Spec 02 — Colapsar e expandir sidebar (rail de ícones)
3. Spec 03 — Navegação no rail com tooltip e destaque da rota ativa
4. Spec 04 — Persistir preferência aberta/recolhida no navegador

Seguir essa ordem evita implementar colapso sem chrome fixo, tooltips sem rail, ou persistência sem estados reais de UI. As dependências respeitam base de layout → interação de colapso → navegação no rail → memória local.
