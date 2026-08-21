# PRD — Imobe

## 1. Visão geral

O **Imobe** é um micro SaaS para proprietários de imóveis e corretores autônomos que precisam organizar imóveis, controlar informações de aluguel e venda, acompanhar rendimento de imóveis alugados e gerar contratos de locação ou venda em PDF.

A primeira versão do produto deve ser simples, focada e funcional. O objetivo não é criar uma imobiliária completa, marketplace público ou sistema financeiro avançado. O foco da V1 é permitir que cada usuário tenha uma área privada para gerenciar seus próprios imóveis, contratos e visão geral de patrimônio.

---

## 2. Problema que o projeto resolve

Proprietários de imóveis e corretores autônomos frequentemente gerenciam imóveis, valores, disponibilidade, contratos e histórico de aluguel de forma manual, usando planilhas, documentos soltos, mensagens e arquivos espalhados.

Isso gera problemas como:

- dificuldade para organizar imóveis disponíveis para aluguel ou venda;
- falta de visão clara sobre patrimônio imobiliário;
- dificuldade para acompanhar rendimento mensal de imóveis alugados;
- contratos gerados manualmente e sem histórico centralizado;
- risco de confundir dados de imóveis, clientes e contratos;
- ausência de um painel simples para acompanhar a carteira de imóveis.

O Imobe resolve esse problema centralizando o cadastro dos imóveis, o histórico de contratos e os rendimentos em uma plataforma privada por usuário.

---

## 3. Público-alvo

A V1 do Imobe será focada em dois públicos principais:

### Proprietários de imóveis

Pessoas que possuem um ou mais imóveis e desejam:

- cadastrar e organizar seus imóveis;
- controlar imóveis para aluguel, venda ou ambos;
- acompanhar valor de aluguel, valor de venda, IPTU e valor médio atual;
- visualizar rendimento de imóveis alugados;
- gerar contratos de locação ou venda.

### Corretores autônomos

Profissionais que atuam de forma independente e desejam:

- organizar sua carteira de imóveis;
- controlar disponibilidade para aluguel ou venda;
- gerar contratos em PDF;
- manter histórico de contratos vinculados aos imóveis;
- ter uma visão geral dos imóveis que gerenciam.

### Fora do público-alvo inicial

A V1 não será focada em:

- imobiliárias grandes;
- equipes com múltiplos usuários;
- administradoras com fluxos complexos;
- marketplaces públicos;
- plataformas completas de CRM imobiliário.

---

## 4. Objetivo da primeira versão

O objetivo da V1 é permitir que um usuário autenticado consiga:

1. criar uma conta e acessar uma área privada;
2. cadastrar, editar, listar e visualizar seus imóveis;
3. definir se um imóvel é para aluguel, venda ou ambos;
4. informar valores importantes do imóvel, como aluguel, venda, IPTU e valor médio atual;
5. registrar rendimentos mensais de aluguel;
6. visualizar linha do tempo de rendimentos dentro dos detalhes do imóvel;
7. gerar contratos de locação e venda em PDF;
8. gerar contratos vinculados ou não a imóveis cadastrados;
9. baixar contratos gerados;
10. visualizar um dashboard básico com patrimônio, disponibilidade e rendimentos.

---

## 5. Funcionalidades da V1

### Essenciais

- Cadastro de usuário.
- Login de usuário.
- Área privada por usuário.
- Cadastro de imóvel.
- Edição de imóvel.
- Listagem de imóveis.
- Visualização de detalhes do imóvel.
- Exclusão de imóvel, quando permitido.
- Cadastro de tipo do imóvel.
- Cadastro de endereço completo.
- Cadastro de bairro.
- Cadastro de cidade.
- Cadastro de localização.
- Cadastro de link de anúncio, se houver.
- Cadastro do valor médio atual do imóvel.
- Cadastro do valor do IPTU.
- Definição da finalidade do imóvel:
  - aluguel;
  - venda;
  - aluguel e venda.
- Cadastro do valor mensal de aluguel, quando aplicável.
- Cadastro do valor de venda, quando aplicável.
- Status de disponibilidade para aluguel.
- Status de disponibilidade para venda.
- Registro manual de rendimento mensal de aluguel.
- Linha do tempo de rendimentos no detalhe do imóvel.
- Filtro de rendimentos por:
  - mês;
  - últimos 6 meses;
  - últimos 12 meses.
- Cálculo do total recebido no período filtrado.
- Cálculo da média mensal no período filtrado.
- Geração de contrato de locação.
- Geração de contrato de venda.
- Geração de contrato vinculado a imóvel cadastrado.
- Geração de contrato sem imóvel cadastrado.
- Download do contrato em PDF.
- Listagem de contratos gerados.
- Download posterior de contratos já gerados.
- Dashboard básico com:
  - total de imóveis;
  - imóveis para aluguel;
  - imóveis para venda;
  - imóveis disponíveis;
  - imóveis indisponíveis;
  - valor total estimado do patrimônio;
  - resumo básico de rendimentos.

### Desejáveis

Funcionalidades que podem entrar na V1 se não aumentarem muito a complexidade:

- Busca simples por imóvel.
- Filtro por finalidade: aluguel, venda ou ambos.
- Filtro por disponibilidade.
- Visualização de contratos dentro dos detalhes do imóvel.
- Estado vazio amigável quando não houver imóveis, contratos ou rendimentos.

### Não implementar no momento

Funcionalidades que devem ficar para versões posteriores:

- Plano pago com assinatura mensal.
- Controle de assinatura SaaS.
- Integração com WhatsApp.
- Assinatura digital de contratos.
- Upload de documentos do imóvel.
- Página pública de anúncio do imóvel.
- Marketplace de imóveis.
- CRM para corretores.
- Gestão de leads.
- Integração bancária.
- Emissão de boleto.
- Relatórios financeiros avançados.
- App mobile nativo.
- Múltiplos usuários por conta.
- Permissões por equipe.
- Inteligência artificial para análise de imóveis.

---

## 6. Fora do escopo da V1

A primeira versão do Imobe não deve incluir:

- pagamento online;
- assinatura mensal do SaaS;
- cobrança recorrente;
- integração com WhatsApp;
- assinatura digital de contrato;
- marketplace público de imóveis;
- página pública para anúncio de imóveis;
- app mobile;
- relatórios financeiros avançados;
- controle contábil;
- emissão de boleto;
- integração bancária;
- CRM avançado para corretores;
- gestão de leads;
- múltiplos usuários dentro da mesma conta;
- permissões por equipe;
- chat interno;
- inteligência artificial para análise de imóveis;
- upload de documentos do imóvel;
- envio automático de contrato por e-mail.

Esses itens devem ser evitados na V1 para manter o produto simples, viável e focado no núcleo principal.

---

## 7. Regras de negócio

- **Regra 1:** cada usuário só pode ver e gerenciar seus próprios imóveis.
- **Regra 2:** cada usuário só pode ver e baixar seus próprios contratos.
- **Regra 3:** cada usuário só pode visualizar seus próprios rendimentos.
- **Regra 4:** o dashboard deve considerar apenas imóveis, contratos e rendimentos do usuário logado.
- **Regra 5:** um imóvel para aluguel precisa ter valor mensal de aluguel informado.
- **Regra 6:** um imóvel para venda precisa ter valor de venda informado.
- **Regra 7:** um imóvel para aluguel e venda precisa ter valor mensal de aluguel e valor de venda informados.
- **Regra 8:** o valor do IPTU deve poder ser informado no cadastro do imóvel.
- **Regra 9:** o valor médio atual do imóvel deve poder ser informado para cálculo do patrimônio estimado.
- **Regra 10:** imóveis com finalidade apenas de venda não devem permitir registro de rendimento de aluguel.
- **Regra 11:** rendimentos de aluguel só podem ser registrados para imóveis com finalidade de aluguel ou aluguel e venda.
- **Regra 12:** um contrato gerado sem imóvel cadastrado deve ficar relacionado apenas ao usuário.
- **Regra 13:** um contrato gerado com imóvel cadastrado deve ficar relacionado ao usuário e ao imóvel.
- **Regra 14:** contratos gerados devem poder ser baixados em PDF.
- **Regra 15:** contratos já gerados devem continuar disponíveis para download posterior.
- **Regra 16:** se um imóvel não tiver rendimentos cadastrados, o sistema deve exibir um estado vazio na linha do tempo.
- **Regra 17:** os filtros de rendimento devem exibir apenas dados do imóvel selecionado.
- **Regra 18:** a interface deve ser responsiva para desktop, tablet e mobile.
- **Regra 19:** dados obrigatórios devem ser validados antes de salvar imóveis, rendimentos ou contratos.
- **Regra 20:** o sistema deve exibir mensagens claras quando uma ação não puder ser concluída.

---

## 8. Fluxos principais

### Fluxo 1 — Cadastro e acesso

1. Usuário acessa o Imobe.
2. Usuário cria uma conta.
3. Usuário faz login.
4. Usuário é direcionado ao dashboard.
5. Sistema exibe apenas dados relacionados ao usuário autenticado.

### Fluxo 2 — Cadastro de imóvel

1. Usuário acessa a área de imóveis.
2. Usuário clica para cadastrar novo imóvel.
3. Usuário informa os dados principais do imóvel.
4. Usuário informa tipo, endereço completo, bairro, cidade e localização.
5. Usuário informa link de anúncio, se houver.
6. Usuário informa valor médio atual do imóvel.
7. Usuário informa valor do IPTU.
8. Usuário define a finalidade do imóvel: aluguel, venda ou ambos.
9. Se for aluguel, o usuário informa valor mensal do aluguel e disponibilidade para locação.
10. Se for venda, o usuário informa valor de venda e disponibilidade para venda.
11. Sistema valida os dados obrigatórios.
12. Sistema salva o imóvel vinculado ao usuário.

### Fluxo 3 — Detalhes e rendimentos do imóvel

1. Usuário acessa a lista de imóveis.
2. Usuário seleciona um imóvel.
3. Sistema exibe os detalhes completos do imóvel.
4. Se o imóvel for de aluguel ou aluguel e venda, o sistema permite registrar rendimento mensal.
5. Usuário registra um rendimento informando mês de referência, valor e status.
6. Sistema salva o rendimento vinculado ao imóvel e ao usuário.
7. Sistema exibe a linha do tempo de rendimentos.
8. Usuário filtra por mês, últimos 6 meses ou últimos 12 meses.
9. Sistema calcula total recebido no período.
10. Sistema calcula média mensal do período.

### Fluxo 4 — Geração de contrato com imóvel cadastrado

1. Usuário acessa a área de contratos.
2. Usuário escolhe gerar contrato de locação ou venda.
3. Usuário seleciona um imóvel já cadastrado.
4. Sistema usa os dados do imóvel como base.
5. Usuário preenche os dados necessários das partes envolvidas.
6. Usuário revisa as informações do contrato.
7. Sistema gera o contrato em PDF.
8. Sistema salva o contrato vinculado ao usuário e ao imóvel.
9. Usuário baixa o PDF.

### Fluxo 5 — Geração de contrato sem imóvel cadastrado

1. Usuário acessa a área de contratos.
2. Usuário escolhe gerar contrato de locação ou venda.
3. Usuário escolhe preencher dados manualmente, sem selecionar imóvel.
4. Usuário informa os dados do imóvel manualmente.
5. Usuário informa os dados das partes envolvidas.
6. Usuário revisa as informações do contrato.
7. Sistema gera o contrato em PDF.
8. Sistema salva o contrato vinculado apenas ao usuário.
9. Usuário baixa o PDF.

### Fluxo 6 — Listagem de contratos

1. Usuário acessa a área de contratos.
2. Sistema lista os contratos gerados pelo usuário.
3. Usuário visualiza informações básicas do contrato.
4. Usuário identifica se o contrato está vinculado a um imóvel cadastrado ou não.
5. Usuário pode baixar novamente o PDF do contrato.

### Fluxo 7 — Dashboard básico

1. Usuário acessa o dashboard.
2. Sistema mostra total de imóveis cadastrados.
3. Sistema mostra quantidade de imóveis para aluguel.
4. Sistema mostra quantidade de imóveis para venda.
5. Sistema mostra imóveis disponíveis e indisponíveis.
6. Sistema mostra valor total estimado do patrimônio.
7. Sistema mostra resumo básico dos rendimentos de aluguel.

---

## 9. Critérios gerais de aceite

- O usuário consegue criar uma conta.
- O usuário consegue fazer login.
- O usuário autenticado acessa um dashboard privado.
- O usuário não consegue ver imóveis, contratos ou rendimentos de outros usuários.
- O usuário consegue cadastrar um imóvel com os dados obrigatórios.
- O usuário consegue editar um imóvel cadastrado.
- O usuário consegue visualizar os detalhes de um imóvel.
- O usuário consegue listar seus imóveis.
- O usuário consegue excluir um imóvel quando permitido.
- O sistema exige valor de aluguel quando o imóvel for para aluguel.
- O sistema exige valor de venda quando o imóvel for para venda.
- O sistema exige valor de aluguel e valor de venda quando o imóvel for para ambos.
- O usuário consegue informar valor do IPTU.
- O usuário consegue informar valor médio atual do imóvel.
- O usuário consegue registrar rendimentos mensais para imóveis de aluguel.
- O sistema não permite registrar rendimento de aluguel para imóveis que não tenham finalidade de aluguel.
- O usuário consegue ver a linha do tempo de rendimentos dentro dos detalhes do imóvel.
- O usuário consegue filtrar rendimentos por mês, últimos 6 meses e últimos 12 meses.
- O sistema calcula total recebido no período filtrado.
- O sistema calcula média mensal no período filtrado.
- O usuário consegue gerar contrato de locação.
- O usuário consegue gerar contrato de venda.
- O usuário consegue gerar contrato relacionado a um imóvel cadastrado.
- O usuário consegue gerar contrato sem relacionar a um imóvel cadastrado.
- O sistema mantém contratos relacionados ao usuário.
- O sistema mantém contratos relacionados ao imóvel quando um imóvel cadastrado for selecionado.
- O usuário consegue baixar o contrato gerado em PDF.
- O usuário consegue visualizar a lista de contratos gerados.
- O usuário consegue baixar novamente contratos já gerados.
- O dashboard exibe resumo de imóveis, disponibilidade, patrimônio estimado e rendimentos.
- O sistema mostra mensagens de erro quando dados obrigatórios não forem preenchidos.
- A interface funciona corretamente em desktop, tablet e mobile.

---

## 10. Stack definida

- **Aplicação web:** Next.js 16+ (latest)
- **Backend:** backend atrelado ao Next.js
- **Proteção de rotas:** `proxy.ts` (convenção Next.js 16; substitui `middleware.ts`)
- **Linguagem:** TypeScript
- **Autenticação:** Supabase Auth
- **Banco de dados:** Supabase Database
- **Storage:** Supabase Storage
- **Scripts SQL:** pasta `supabase/` na raiz do projeto (execução manual no SQL Editor)
- **Estilização:** TailwindCSS
- **Componentes de UI:** shadcn/ui
- **Elementos visuais e interações:** Magic UI (Fase 7 — acabamento visual)
- **Formulários:** React Hook Form + Zod
- **Dados assíncronos e requisições HTTP:** TanStack Query
- **Responsividade:** suporte obrigatório para desktop, tablet e mobile
- **Deploy sugerido:** Vercel

---

## 11. Justificativa da stack

A stack escolhida faz sentido para a V1 do Imobe porque permite criar um micro SaaS completo sem exigir um backend separado.

O **Next.js** permite construir a aplicação web e manter o backend atrelado ao próprio projeto, reduzindo complexidade inicial.

O **Supabase** é adequado porque entrega autenticação, banco de dados e storage em uma única plataforma. Isso é importante para o Imobe, pois o produto precisa de contas de usuário, dados privados, imóveis, contratos, rendimentos e armazenamento de PDFs.

O **TailwindCSS**, junto com **shadcn/ui** e **Magic UI**, permite criar uma interface moderna, responsiva e com componentes reutilizáveis sem transformar a V1 em um projeto visualmente pesado.

O **TanStack Query** ajuda a organizar dados assíncronos, carregamentos, estados de erro e atualizações da interface ao buscar ou alterar dados.

Essa stack é proporcional ao produto: profissional o suficiente para um micro SaaS, mas sem a complexidade de uma arquitetura separada ou excessiva para a primeira versão.

---

## 12. Fases de construção

### Status de implementação

| Fase                                       | Specs                                       | Status       |
| ------------------------------------------ | ------------------------------------------- | ------------ |
| **Fase 1** — Base inicial do produto       | Spec 01, Spec 02                            | ✅ Concluída |
| **Fase 2** — Acesso do usuário             | Spec 03, Spec 04, Spec 05                   | ✅ Concluída |
| **Fase 3** — Gestão de imóveis             | Spec 06, Spec 07, Spec 08, Spec 09, Spec 10 | ✅ Concluída |
| **Fase 4** — Rendimentos de aluguel        | Spec 11, Spec 12, Spec 13                   | ✅ Concluída |
| **Fase 5** — Contratos                     | Spec 14, Spec 15, Spec 16, Spec 17, Spec 18 | ✅ Concluída |
| **Fase 6** — Dashboard                     | Spec 19                                     | ✅ Concluída |
| **Fase 7** — Validações e acabamento da V1 | Spec 20, Spec 21                            | ✅ Concluída |

Detalhes técnicos das entregas: [IMPLEMENTATION-STATUS.md](./IMPLEMENTATION-STATUS.md).

**Decisões registradas na implementação (Fases 1–7):**

- Cadastro: email, senha, nome completo, telefone (opcional).
- Exclusão de imóvel: soft delete via campo `deleted_at` (contratos futuros preservados).
- Proteção de rotas: `src/proxy.ts` + `requireAuth()` em server actions/data-access + RLS no Supabase.
- Contratos: modelo operacional completo com aviso de revisão jurídica; PDF via `@react-pdf/renderer` no servidor.
- Storage: bucket privado `contracts` com path `{user_id}/{contract_id}.pdf` e download autorizado.
- Rendimentos: um lançamento por imóvel/competência (`unique(property_id, reference_month)`).

---

### Fase 1 — Base inicial do produto

**Status:** ✅ Concluída

**Objetivo:**
Preparar a base visual e funcional para o Imobe existir como aplicação web responsiva.

**Specs:**

- Spec 01 — Base inicial da aplicação
- Spec 02 — Layout principal e navegação

**Entregas:** landing Imobe, providers (TanStack Query + Sonner), layout do painel (sidebar + menu mobile), layout auth, placeholders de dashboard e contratos.

---

### Fase 2 — Acesso do usuário

**Status:** ✅ Concluída

**Objetivo:**
Permitir que o usuário crie conta, faça login e acesse uma área privada.

**Specs:**

- Spec 03 — Cadastro de usuário
- Spec 04 — Login de usuário
- Spec 05 — Proteção dos dados por usuário

**Entregas:** `/cadastro`, `/login`, logout, `src/proxy.ts`, `requireAuth()`, RLS em `profiles`. SQL: `supabase/001_profiles.sql`.

---

### Fase 3 — Gestão de imóveis

**Status:** ✅ Concluída

**Objetivo:**
Permitir que o usuário cadastre, visualize, edite e organize seus imóveis.

**Specs:**

- Spec 06 — Cadastro de imóvel
- Spec 07 — Listagem de imóveis
- Spec 08 — Detalhes do imóvel
- Spec 09 — Edição de imóvel
- Spec 10 — Exclusão de imóvel

**Entregas:** CRUD em `/imoveis`, validação Zod condicional por finalidade, soft delete com confirmação. SQL: `supabase/002_properties.sql`.

### Fase 4 — Rendimentos de aluguel

**Status:** ✅ Concluída

**Objetivo:**
Permitir que o usuário registre e acompanhe o rendimento mensal de imóveis alugados.

**Specs:**

- Spec 11 — Registro de rendimento mensal
- Spec 12 — Linha do tempo de rendimentos
- Spec 13 — Filtros e resumo de rendimento
- Spec 13.1 — Exclusão de rendimento mensal _(ver [Spec-13.1-exclusao-rendimento.md](./specs/Spec-13.1-exclusao-rendimento.md))_

**Entregas:** rendimentos no detalhe do imóvel, filtros via URL, resumo financeiro. SQL: `supabase/003_rental_incomes.sql`.

### Fase 5 — Contratos

**Status:** ✅ Concluída

**Objetivo:**
Permitir que o usuário gere contratos de locação ou venda em PDF, com ou sem vínculo com imóvel cadastrado.

**Specs:**

- Spec 14 — Onboarding de geração de contrato
- Spec 15 — Contrato vinculado a imóvel cadastrado
- Spec 16 — Contrato sem imóvel cadastrado
- Spec 17 — Geração e download de PDF
- Spec 18 — Listagem de contratos
- Spec 15.1 — Atalho "Gerar contrato" no detalhe do imóvel _(ver [Spec-15.1-atalho-gerar-contrato-imovel.md](./specs/Spec-15.1-atalho-gerar-contrato-imovel.md))_

**Entregas:** wizard `/contratos/novo`, PDF server-side, listagem, download autorizado. SQL: `supabase/004_contracts.sql`.

### Fase 6 — Dashboard

**Status:** ✅ Concluída

**Objetivo:**
Criar uma visão geral simples de imóveis, disponibilidade, patrimônio estimado e rendimentos.

**Specs:**

- Spec 19 — Dashboard de visão geral

**Entregas:** KPIs de carteira, disponibilidade, rendimentos e contratos via DAL dedicado.

### Fase 7 — Validações e acabamento da V1

**Status:** ✅ Concluída

**Objetivo:**
Garantir que a primeira versão esteja consistente, responsiva e com mensagens claras.

**Specs:**

- Spec 20 — Validações gerais e estados vazios
- Spec 21 — Responsividade e refinamento visual

**Entregas:** estados vazios reutilizáveis, `loading.tsx`/`error.tsx`, skeletons, skip link, `aria-current`, scripts de teste/lint/typecheck.

---

## 13. Specs funcionais detalhadas

### Spec 01 — Base inicial da aplicação

**Fase:** Base inicial do produto

**Objetivo:**
Criar a base mínima para o Imobe funcionar como aplicação web.

**Descrição:**
A aplicação deve ter uma estrutura inicial acessível, com identidade básica do produto, suporte à stack definida e preparação para autenticação, áreas privadas e navegação.

**Regras de negócio relacionadas:**

- A interface deve ser responsiva para desktop, tablet e mobile.
- A aplicação deve respeitar o escopo da V1.

**Fluxo do usuário:**

1. Usuário acessa a aplicação.
2. Sistema carrega a interface inicial.
3. Usuário consegue identificar que está no Imobe.

**Critérios de aceite:**

- A aplicação carrega sem erro.
- O nome Imobe aparece na interface.
- A interface base funciona em desktop, tablet e mobile.
- A aplicação está preparada para receber autenticação e áreas privadas.

**Dependências:**

- Nenhuma.

**Fora do escopo desta spec:**

- Cadastro de imóveis.
- Login.
- Dashboard.
- Geração de contratos.
- Criação de arquitetura técnica detalhada.

---

### Spec 02 — Layout principal e navegação

**Fase:** Base inicial do produto

**Objetivo:**
Definir a navegação principal do sistema.

**Descrição:**
O usuário deve conseguir navegar entre as principais áreas previstas da aplicação: dashboard, imóveis e contratos.

**Regras de negócio relacionadas:**

- A navegação deve respeitar áreas privadas.
- A interface deve ser responsiva.

**Fluxo do usuário:**

1. Usuário acessa a aplicação.
2. Sistema exibe a navegação principal.
3. Usuário identifica as áreas de dashboard, imóveis e contratos.

**Critérios de aceite:**

- Existe uma navegação clara para as áreas principais.
- A navegação funciona em diferentes tamanhos de tela.
- A interface não exibe opções fora do escopo da V1.

**Dependências:**

- Depende da Spec 01.

**Fora do escopo desta spec:**

- Implementar funcionalidades completas das áreas.
- Criar contratos.
- Cadastrar imóveis.

---

### Spec 03 — Cadastro de usuário

**Fase:** Acesso do usuário

**Objetivo:**
Permitir que um novo usuário crie uma conta.

**Descrição:**
O usuário deve conseguir se cadastrar para acessar sua área privada no Imobe.

**Regras de negócio relacionadas:**

- Cada usuário terá seus próprios imóveis, contratos e rendimentos.
- O sistema deve validar dados obrigatórios.

**Fluxo do usuário:**

1. Usuário acessa a tela de cadastro.
2. Usuário informa os dados necessários.
3. Sistema valida as informações.
4. Sistema cria a conta.
5. Usuário fica apto a acessar o sistema.

**Critérios de aceite:**

- O usuário consegue criar uma conta válida.
- O sistema impede cadastro com dados inválidos.
- O sistema exibe mensagem de erro quando necessário.
- Após o cadastro, o usuário consegue seguir para login ou área autenticada.

**Dependências:**

- Depende da Spec 01.
- Depende da Spec 02.

**Fora do escopo desta spec:**

- Planos pagos.
- Convite de equipe.
- Permissões avançadas.
- Cadastro de múltiplos usuários por conta.

---

### Spec 04 — Login de usuário

**Fase:** Acesso do usuário

**Objetivo:**
Permitir que um usuário existente acesse sua conta.

**Descrição:**
O usuário deve conseguir fazer login e acessar sua área privada.

**Regras de negócio relacionadas:**

- Cada usuário só pode ver seus próprios dados.
- O sistema deve proteger áreas privadas.

**Fluxo do usuário:**

1. Usuário acessa a tela de login.
2. Usuário informa suas credenciais.
3. Sistema valida as credenciais.
4. Sistema autentica o usuário.
5. Usuário é direcionado ao dashboard.

**Critérios de aceite:**

- O usuário consegue fazer login com credenciais válidas.
- O sistema impede login com credenciais inválidas.
- O sistema exibe mensagem de erro quando o login falha.
- Usuário autenticado acessa a área privada.

**Dependências:**

- Depende da Spec 03.

**Fora do escopo desta spec:**

- Login social.
- Autenticação multifator.
- Recuperação avançada de conta.
- Controle de assinatura.

---

### Spec 05 — Proteção dos dados por usuário

**Fase:** Acesso do usuário

**Objetivo:**
Garantir que cada usuário veja apenas seus próprios dados.

**Descrição:**
Imóveis, contratos, rendimentos e informações do dashboard devem ser isolados por usuário.

**Regras de negócio relacionadas:**

- Cada usuário só pode ver e gerenciar seus próprios imóveis.
- Cada usuário só pode ver e baixar seus próprios contratos.
- Cada usuário só pode visualizar seus próprios rendimentos.
- O dashboard deve considerar apenas dados do usuário logado.

**Fluxo do usuário:**

1. Usuário faz login.
2. Usuário acessa imóveis, contratos ou dashboard.
3. Sistema busca apenas dados vinculados ao usuário autenticado.
4. Sistema não mostra dados de outros usuários.

**Critérios de aceite:**

- Usuário não acessa imóveis de outros usuários.
- Usuário não acessa contratos de outros usuários.
- Usuário não acessa rendimentos de outros usuários.
- Dashboard não mistura dados entre usuários.

**Dependências:**

- Depende da Spec 03.
- Depende da Spec 04.

**Fora do escopo desta spec:**

- Permissões por equipe.
- Compartilhamento de dados.
- Múltiplos usuários por organização.

---

### Spec 06 — Cadastro de imóvel

**Fase:** Gestão de imóveis

**Objetivo:**
Permitir que o usuário cadastre um imóvel.

**Descrição:**
O usuário deve conseguir cadastrar um imóvel informando dados básicos, localização, valores e finalidade.

**Regras de negócio relacionadas:**

- Um imóvel para aluguel precisa ter valor mensal de aluguel informado.
- Um imóvel para venda precisa ter valor de venda informado.
- Um imóvel para aluguel e venda precisa ter os dois valores informados.
- O valor do IPTU deve poder ser informado.
- O valor médio atual do imóvel deve poder ser informado.
- O imóvel deve ser vinculado ao usuário autenticado.

**Fluxo do usuário:**

1. Usuário acessa a área de imóveis.
2. Usuário clica para cadastrar novo imóvel.
3. Usuário informa tipo do imóvel.
4. Usuário informa endereço completo, bairro, cidade e localização.
5. Usuário informa link de anúncio, se houver.
6. Usuário informa valor médio atual e IPTU.
7. Usuário define a finalidade do imóvel.
8. Usuário informa os valores obrigatórios conforme a finalidade.
9. Sistema valida os dados.
10. Sistema salva o imóvel vinculado ao usuário.

**Critérios de aceite:**

- O usuário consegue cadastrar imóvel com dados válidos.
- O sistema exige valor de aluguel quando a finalidade inclui aluguel.
- O sistema exige valor de venda quando a finalidade inclui venda.
- O sistema permite informar IPTU.
- O sistema permite informar valor médio atual.
- O imóvel cadastrado aparece na lista do usuário.

**Dependências:**

- Depende da Spec 05.

**Fora do escopo desta spec:**

- Upload de documentos.
- Galeria de fotos.
- Página pública do imóvel.
- Integração com anúncios externos.

---

### Spec 07 — Listagem de imóveis

**Fase:** Gestão de imóveis

**Objetivo:**
Permitir que o usuário visualize seus imóveis cadastrados.

**Descrição:**
O sistema deve listar apenas os imóveis pertencentes ao usuário logado.

**Regras de negócio relacionadas:**

- Cada usuário só pode ver seus próprios imóveis.
- A listagem deve respeitar dados do usuário autenticado.

**Fluxo do usuário:**

1. Usuário acessa a área de imóveis.
2. Sistema lista os imóveis cadastrados pelo usuário.
3. Usuário visualiza informações resumidas de cada imóvel.
4. Usuário pode acessar os detalhes de um imóvel.

**Critérios de aceite:**

- A lista mostra apenas imóveis do usuário logado.
- Cada imóvel exibe informações resumidas úteis.
- O usuário consegue acessar detalhes de um imóvel.
- Quando não houver imóveis, o sistema exibe estado vazio.

**Dependências:**

- Depende da Spec 06.

**Fora do escopo desta spec:**

- Busca avançada.
- Relatórios.
- Marketplace.
- Exibição pública de imóveis.

---

### Spec 08 — Detalhes do imóvel

**Fase:** Gestão de imóveis

**Objetivo:**
Permitir que o usuário veja todas as informações relevantes de um imóvel.

**Descrição:**
Ao acessar um imóvel, o usuário deve visualizar dados cadastrais, valores, finalidade, disponibilidade e áreas relacionadas, como rendimentos e contratos.

**Regras de negócio relacionadas:**

- O usuário só pode ver detalhes de imóveis próprios.
- Dados financeiros devem ser exibidos de forma clara.
- A linha do tempo de rendimentos deve aparecer quando aplicável.

**Fluxo do usuário:**

1. Usuário acessa a lista de imóveis.
2. Usuário seleciona um imóvel.
3. Sistema abre a página de detalhes.
4. Sistema exibe dados do imóvel.
5. Sistema exibe áreas relacionadas conforme o tipo do imóvel.

**Critérios de aceite:**

- O usuário vê os dados completos do imóvel.
- O sistema mostra finalidade do imóvel.
- O sistema mostra valores de aluguel, venda, IPTU e valor médio atual quando existirem.
- O sistema mostra disponibilidade.
- O sistema não permite visualizar imóvel de outro usuário.

**Dependências:**

- Depende da Spec 07.

**Fora do escopo desta spec:**

- Edição direta inline.
- Upload de documentos.
- Publicação do imóvel.

---

### Spec 09 — Edição de imóvel

**Fase:** Gestão de imóveis

**Objetivo:**
Permitir que o usuário edite dados de um imóvel cadastrado.

**Descrição:**
O usuário deve conseguir atualizar informações de um imóvel próprio, mantendo as mesmas regras de validação do cadastro.

**Regras de negócio relacionadas:**

- O usuário só pode editar seus próprios imóveis.
- Um imóvel para aluguel precisa ter valor mensal de aluguel.
- Um imóvel para venda precisa ter valor de venda.
- Um imóvel para ambos precisa ter valor mensal de aluguel e valor de venda.

**Fluxo do usuário:**

1. Usuário acessa os detalhes do imóvel.
2. Usuário escolhe editar o imóvel.
3. Usuário altera os dados desejados.
4. Sistema valida as alterações.
5. Sistema salva as alterações.
6. Sistema exibe os dados atualizados.

**Critérios de aceite:**

- O usuário consegue editar imóvel próprio.
- O sistema valida dados obrigatórios.
- O sistema impede salvar dados inválidos.
- Dados atualizados aparecem nos detalhes e na listagem.

**Dependências:**

- Depende da Spec 08.

**Fora do escopo desta spec:**

- Histórico de alterações.
- Aprovação de edição.
- Edição por múltiplos usuários.

---

### Spec 10 — Exclusão de imóvel

**Fase:** Gestão de imóveis

**Objetivo:**
Permitir que o usuário exclua um imóvel quando permitido.

**Descrição:**
O usuário deve conseguir excluir imóveis próprios, desde que a ação seja permitida pelas regras do sistema.

**Regras de negócio relacionadas:**

- O usuário só pode excluir seus próprios imóveis.
- O sistema deve evitar ações destrutivas sem confirmação.
- Contratos vinculados não devem ser perdidos de forma inesperada.

**Fluxo do usuário:**

1. Usuário acessa os detalhes do imóvel.
2. Usuário escolhe excluir o imóvel.
3. Sistema solicita confirmação.
4. Usuário confirma.
5. Sistema remove ou desativa o imóvel conforme a regra definida.
6. Imóvel deixa de aparecer na listagem principal.

**Critérios de aceite:**

- O usuário consegue excluir imóvel próprio quando permitido.
- O sistema solicita confirmação antes da exclusão.
- O usuário não consegue excluir imóvel de outro usuário.
- O sistema não perde contratos de forma inesperada.

**Dependências:**

- Depende da Spec 08.

**Fora do escopo desta spec:**

- Lixeira avançada.
- Recuperação de imóvel excluído.
- Auditoria de exclusão.

---

### Spec 11 — Registro de rendimento mensal

**Fase:** Rendimentos de aluguel

**Status:** ✅ Concluída

**Objetivo:**
Permitir que o usuário registre rendimentos mensais de imóveis alugados.

**Descrição:**
O usuário deve conseguir lançar manualmente valores recebidos ou previstos de aluguel para imóveis com finalidade de aluguel ou aluguel e venda.

**Regras de negócio relacionadas:**

- Rendimentos só podem ser registrados para imóveis com finalidade de aluguel ou aluguel e venda.
- Imóveis apenas para venda não devem permitir rendimento de aluguel.
- O rendimento deve ser vinculado ao imóvel e ao usuário.

**Fluxo do usuário:**

1. Usuário acessa os detalhes de um imóvel.
2. Sistema verifica se o imóvel possui finalidade de aluguel.
3. Usuário escolhe registrar rendimento.
4. Usuário informa mês de referência.
5. Usuário informa valor do rendimento.
6. Usuário informa status, como recebido, pendente ou em atraso.
7. Sistema salva o rendimento vinculado ao imóvel e ao usuário.

**Critérios de aceite:**

- Usuário consegue registrar rendimento para imóvel de aluguel.
- Usuário não consegue registrar rendimento para imóvel apenas de venda.
- Rendimento salvo aparece no detalhe do imóvel.
- Rendimento fica vinculado ao usuário logado.

**Dependências:**

- Depende da Spec 08.

**Fora do escopo desta spec:**

- Integração bancária.
- Emissão de boleto.
- Cobrança automática.
- Repasse financeiro.

---

### Spec 12 — Linha do tempo de rendimentos

**Fase:** Rendimentos de aluguel

**Status:** ✅ Concluída

**Objetivo:**
Exibir o histórico de rendimentos do imóvel.

**Descrição:**
A página de detalhes do imóvel deve mostrar uma linha do tempo com os rendimentos mensais registrados.

**Regras de negócio relacionadas:**

- A linha do tempo deve mostrar apenas rendimentos do imóvel selecionado.
- A linha do tempo deve mostrar apenas dados do usuário logado.
- Se não houver rendimentos, o sistema deve exibir estado vazio.

**Fluxo do usuário:**

1. Usuário acessa os detalhes de um imóvel.
2. Sistema busca rendimentos vinculados ao imóvel.
3. Sistema exibe os rendimentos em ordem temporal.
4. Usuário visualiza mês, valor e status de cada rendimento.

**Critérios de aceite:**

- A linha do tempo aparece no detalhe do imóvel.
- Rendimentos são exibidos por mês de referência.
- O sistema mostra valor e status do rendimento.
- Estado vazio aparece quando não houver rendimentos.

**Dependências:**

- Depende da Spec 11.

**Fora do escopo desta spec:**

- Gráficos financeiros avançados.
- Exportação de relatório.
- DRE.
- Fluxo de caixa completo.

---

### Spec 13 — Filtros e resumo de rendimento

**Fase:** Rendimentos de aluguel

**Status:** ✅ Concluída

**Objetivo:**
Permitir análise simples de rendimento por período.

**Descrição:**
O usuário deve conseguir filtrar rendimentos por mês, últimos 6 meses e últimos 12 meses. O sistema deve calcular total recebido e média mensal do período filtrado.

**Regras de negócio relacionadas:**

- Os filtros devem considerar apenas rendimentos do imóvel selecionado.
- Os filtros devem considerar apenas dados do usuário logado.
- O sistema deve calcular total e média com base no período selecionado.

**Fluxo do usuário:**

1. Usuário acessa os detalhes de um imóvel com rendimentos.
2. Usuário escolhe um filtro de período.
3. Sistema atualiza a linha do tempo.
4. Sistema calcula total recebido.
5. Sistema calcula média mensal.

**Critérios de aceite:**

- Usuário consegue filtrar por mês.
- Usuário consegue filtrar por últimos 6 meses.
- Usuário consegue filtrar por últimos 12 meses.
- Sistema exibe total recebido no período.
- Sistema exibe média mensal no período.

**Dependências:**

- Depende da Spec 12.

**Fora do escopo desta spec:**

- Relatórios financeiros avançados.
- Comparação entre imóveis.
- Projeção futura de rendimento.

---

### Spec 13.1 — Exclusão de rendimento mensal

**Fase:** Rendimentos de aluguel

**Status:** ✅ Concluída

**Objetivo:**
Permitir que o usuário exclua um rendimento registrado por engano (erro de digitação em valor, mês ou status).

**Descrição:**
Cada item da linha do tempo de rendimentos deve oferecer exclusão com confirmação. A remoção libera a competência para novo lançamento e atualiza resumo e dashboard.

**Regras de negócio relacionadas:**

- Apenas o dono do rendimento pode excluí-lo.
- Exclusão física (hard delete); após excluir, a mesma competência pode ser registrada novamente.
- Imóvel apenas para venda: exclusão de histórico permitida; novos cadastros continuam bloqueados.
- Não expor existência de rendimento de outro usuário.

**Fluxo do usuário:**

1. Usuário visualiza um lançamento incorreto na linha do tempo.
2. Usuário aciona Excluir no item.
3. Sistema exibe diálogo de confirmação com mês, valor e status.
4. Usuário confirma ou cancela.
5. Sistema remove o registro e atualiza timeline, totais e dashboard.

**Critérios de aceite:**

- Exclusão exige confirmação e estado pendente no botão.
- Item some da timeline e totais são recalculados.
- Usuário consegue recadastrar a mesma competência após excluir.
- Usuário não consegue excluir rendimento de outro usuário.

**Dependências:**

- Depende da Spec 12.
- Impacta recálculo da Spec 13 e indicadores da Spec 19.

**Fora do escopo desta spec:**

- Edição inline do lançamento.
- Lixeira ou recuperação.
- Exclusão em lote.

**Documento detalhado:** [Spec-13.1-exclusao-rendimento.md](./specs/Spec-13.1-exclusao-rendimento.md)

---

### Spec 14 — Onboarding de geração de contrato

**Fase:** Contratos

**Status:** ✅ Concluída

**Objetivo:**
Guiar o usuário na criação de um contrato.

**Descrição:**
O sistema deve permitir que o usuário escolha o tipo de contrato e se deseja relacionar o contrato a um imóvel cadastrado ou preencher dados manualmente.

**Regras de negócio relacionadas:**

- O contrato pode ser de locação ou venda.
- O contrato pode estar vinculado a imóvel cadastrado ou apenas ao usuário.
- O usuário só pode selecionar imóveis próprios.

**Fluxo do usuário:**

1. Usuário acessa a área de contratos.
2. Usuário escolhe gerar novo contrato.
3. Sistema pergunta se o contrato é de locação ou venda.
4. Sistema pergunta se o usuário deseja selecionar imóvel cadastrado ou preencher manualmente.
5. Usuário segue para o fluxo correspondente.

**Critérios de aceite:**

- Usuário consegue escolher tipo de contrato.
- Usuário consegue escolher entre imóvel cadastrado ou preenchimento manual.
- Sistema não exibe imóveis de outros usuários.
- O fluxo direciona corretamente para a próxima etapa.

**Dependências:**

- Depende da Spec 05.
- Depende da Spec 07.

**Fora do escopo desta spec:**

- Geração final do PDF.
- Assinatura digital.
- Envio por e-mail.
- Pagamento do contrato.

---

### Spec 15 — Contrato vinculado a imóvel cadastrado

**Fase:** Contratos

**Status:** ✅ Concluída

**Objetivo:**
Permitir a criação de contrato usando um imóvel já cadastrado.

**Descrição:**
O usuário deve selecionar um imóvel próprio para gerar um contrato. O sistema deve usar os dados do imóvel como base e solicitar os dados adicionais necessários.

**Regras de negócio relacionadas:**

- Contrato com imóvel cadastrado deve ficar vinculado ao usuário e ao imóvel.
- O usuário só pode selecionar imóveis próprios.
- Contrato de locação deve estar relacionado a um imóvel com finalidade de aluguel ou aluguel e venda.
- Contrato de venda deve estar relacionado a um imóvel com finalidade de venda ou aluguel e venda.

**Fluxo do usuário:**

1. Usuário escolhe gerar contrato.
2. Usuário seleciona contrato de locação ou venda.
3. Usuário escolhe usar imóvel cadastrado.
4. Sistema lista imóveis compatíveis.
5. Usuário seleciona o imóvel.
6. Sistema preenche dados base do imóvel.
7. Usuário informa dados adicionais do contrato.
8. Usuário revisa os dados.

**Critérios de aceite:**

- Usuário consegue selecionar imóvel próprio.
- Sistema usa dados do imóvel como base.
- Sistema exige dados adicionais do contrato.
- Contrato fica preparado para geração em PDF.
- Contrato mantém vínculo com usuário e imóvel.

**Dependências:**

- Depende da Spec 14.

**Fora do escopo desta spec:**

- Contrato sem imóvel cadastrado.
- Assinatura digital.
- Envio automático.

---

### Spec 16 — Contrato sem imóvel cadastrado

**Fase:** Contratos

**Status:** ✅ Concluída

**Objetivo:**
Permitir geração de contrato sem precisar cadastrar o imóvel antes.

**Descrição:**
O usuário deve conseguir preencher manualmente os dados do imóvel e das partes envolvidas para gerar um contrato.

**Regras de negócio relacionadas:**

- Contrato sem imóvel cadastrado deve ficar vinculado apenas ao usuário.
- O sistema deve validar dados obrigatórios antes de gerar o contrato.
- O contrato não deve criar um imóvel automaticamente na V1.

**Fluxo do usuário:**

1. Usuário escolhe gerar contrato.
2. Usuário seleciona contrato de locação ou venda.
3. Usuário escolhe preencher dados manualmente.
4. Usuário informa os dados do imóvel.
5. Usuário informa os dados das partes envolvidas.
6. Usuário revisa as informações.

**Critérios de aceite:**

- Usuário consegue preencher contrato manualmente.
- Sistema valida dados obrigatórios.
- Contrato não fica vinculado a imóvel cadastrado.
- Contrato fica vinculado ao usuário.

**Dependências:**

- Depende da Spec 14.

**Fora do escopo desta spec:**

- Criar imóvel automaticamente.
- Importar dados de fontes externas.
- Assinatura digital.

---

### Spec 17 — Geração e download de PDF

**Fase:** Contratos

**Status:** ✅ Concluída

**Objetivo:**
Gerar o contrato em PDF e permitir download.

**Descrição:**
Após preencher os dados necessários, o usuário deve conseguir gerar um PDF do contrato e baixá-lo.

**Regras de negócio relacionadas:**

- Contratos gerados devem poder ser baixados em PDF.
- Contratos já gerados devem continuar disponíveis para download posterior.
- Contratos devem ser vinculados ao usuário.
- Quando houver imóvel cadastrado, o contrato também deve ser vinculado ao imóvel.

**Fluxo do usuário:**

1. Usuário conclui os dados do contrato.
2. Usuário solicita geração do PDF.
3. Sistema gera o documento.
4. Sistema salva o contrato.
5. Sistema disponibiliza o download.
6. Usuário baixa o PDF.

**Critérios de aceite:**

- O usuário consegue gerar PDF de contrato de locação.
- O usuário consegue gerar PDF de contrato de venda.
- O usuário consegue baixar o PDF gerado.
- O contrato fica salvo para acesso posterior.
- O contrato respeita o vínculo correto com usuário e imóvel.

**Dependências:**

- Depende da Spec 15.
- Depende da Spec 16.

**Fora do escopo desta spec:**

- Assinatura digital.
- Envio por e-mail.
- Modelos jurídicos avançados.
- Validação jurídica automática.

---

### Spec 18 — Listagem de contratos

**Fase:** Contratos

**Status:** ✅ Concluída

**Objetivo:**
Permitir que o usuário veja contratos gerados anteriormente.

**Descrição:**
O sistema deve listar contratos gerados pelo usuário e permitir novo download do PDF.

**Regras de negócio relacionadas:**

- Cada usuário só pode ver e baixar seus próprios contratos.
- Contratos com imóvel cadastrado devem indicar vínculo com o imóvel.
- Contratos sem imóvel cadastrado devem indicar que foram preenchidos manualmente.

**Fluxo do usuário:**

1. Usuário acessa a área de contratos.
2. Sistema lista contratos do usuário.
3. Usuário visualiza informações básicas.
4. Usuário baixa novamente um PDF.

**Critérios de aceite:**

- A lista mostra apenas contratos do usuário logado.
- O usuário consegue identificar tipo do contrato.
- O usuário consegue identificar se há imóvel vinculado.
- O usuário consegue baixar novamente o PDF.

**Dependências:**

- Depende da Spec 17.

**Fora do escopo desta spec:**

- Envio automático por e-mail.
- Assinatura digital.
- Gestão de versões do contrato.

---

### Spec 15.1 — Atalho "Gerar contrato" no detalhe do imóvel

**Fase:** Contratos / Detalhe do imóvel

**Status:** ✅ Concluída

**Objetivo:**
Permitir iniciar a geração de contrato vinculado diretamente do detalhe do imóvel, sem repetir a seleção do imóvel no wizard.

**Descrição:**
O cabeçalho do detalhe do imóvel deve exibir o botão **Gerar contrato** ao lado de Editar e Excluir. O atalho encaminha para `/contratos/novo/vinculado` com tipo e `property_id` pré-definidos.

**Regras de negócio relacionadas:**

- Imóvel `rent` → contrato de locação; `sale` → venda; `both` → usuário escolhe o tipo.
- Servidor revalida ownership e compatibilidade na geração do PDF.
- Disponibilidade para locação/venda não impede geração de contrato.

**Fluxo do usuário:**

1. Usuário abre o detalhe do imóvel.
2. Usuário clica em Gerar contrato (ou escolhe locação/venda se `both`).
3. Sistema abre formulário vinculado com imóvel pré-selecionado.
4. Usuário completa dados e gera o PDF.

**Critérios de aceite:**

- Botão visível no cabeçalho do detalhe.
- Imóvel correto pré-selecionado no formulário vinculado.
- Funciona para finalidades rent, sale e both.
- Contrato gerado aparece na seção Contratos do detalhe.

**Dependências:**

- Depende da Spec 08.
- Depende da Spec 15.
- Depende da Spec 17.

**Fora do escopo desta spec:**

- Geração de PDF em one-click sem formulário.
- Atalho na listagem de imóveis.

**Documento detalhado:** [Spec-15.1-atalho-gerar-contrato-imovel.md](./specs/Spec-15.1-atalho-gerar-contrato-imovel.md)

---

### Spec 19 — Dashboard de visão geral

**Fase:** Dashboard

**Status:** ✅ Concluída

**Objetivo:**
Criar uma visão geral simples do patrimônio e da carteira de imóveis.

**Descrição:**
O dashboard deve mostrar indicadores básicos relacionados aos imóveis, disponibilidade, patrimônio estimado e rendimentos.

**Regras de negócio relacionadas:**

- O dashboard deve considerar apenas dados do usuário logado.
- O valor total estimado do patrimônio deve usar o valor médio atual dos imóveis.
- O resumo de rendimento deve considerar registros do usuário.

**Fluxo do usuário:**

1. Usuário faz login.
2. Usuário acessa o dashboard.
3. Sistema calcula indicadores básicos.
4. Sistema exibe resumo visual.

**Critérios de aceite:**

- Dashboard mostra total de imóveis.
- Dashboard mostra imóveis para aluguel.
- Dashboard mostra imóveis para venda.
- Dashboard mostra imóveis disponíveis e indisponíveis.
- Dashboard mostra valor total estimado do patrimônio.
- Dashboard mostra resumo básico de rendimentos.
- Dashboard não mistura dados de outros usuários.

**Dependências:**

- Depende da Spec 06.
- Depende da Spec 11.
- Depende da Spec 17.

**Fora do escopo desta spec:**

- Relatórios avançados.
- Gráficos complexos.
- Exportação financeira.
- Comparativos de mercado.

---

### Spec 20 — Validações gerais e estados vazios

**Fase:** Validações e acabamento da V1

**Status:** ✅ Concluída

**Objetivo:**
Garantir que o sistema tenha validações claras e estados vazios amigáveis.

**Descrição:**
O sistema deve impedir ações inválidas e orientar o usuário quando não houver dados cadastrados.

**Regras de negócio relacionadas:**

- Dados obrigatórios devem ser validados antes de salvar.
- O sistema deve exibir mensagens claras quando uma ação não puder ser concluída.
- Estados vazios devem aparecer quando não houver imóveis, contratos ou rendimentos.

**Fluxo do usuário:**

1. Usuário tenta salvar dados incompletos.
2. Sistema identifica campos obrigatórios.
3. Sistema exibe mensagens claras.
4. Usuário corrige as informações.
5. Sistema permite concluir a ação.

**Critérios de aceite:**

- Campos obrigatórios são validados.
- Mensagens de erro são claras.
- Estados vazios aparecem nas áreas sem dados.
- O sistema não permite ações inconsistentes.

**Dependências:**

- Depende das specs principais de imóveis, rendimentos e contratos.

**Fora do escopo desta spec:**

- Sistema avançado de notificações.
- Central de ajuda.
- Tutorial interativo.

---

### Spec 21 — Responsividade e refinamento visual

**Fase:** Validações e acabamento da V1

**Status:** ✅ Concluída

**Objetivo:**
Garantir boa experiência em diferentes tamanhos de tela.

**Descrição:**
A interface deve funcionar corretamente em desktop, tablet e mobile, com navegação clara e componentes adaptados.

**Regras de negócio relacionadas:**

- A interface deve ser responsiva para desktop, tablet e mobile.
- O sistema deve manter usabilidade nas principais telas.

**Fluxo do usuário:**

1. Usuário acessa o Imobe em diferentes dispositivos.
2. Sistema adapta layout e navegação.
3. Usuário consegue usar as principais funcionalidades.

**Critérios de aceite:**

- Dashboard funciona em desktop, tablet e mobile.
- Listagem de imóveis funciona em diferentes telas.
- Detalhes do imóvel são legíveis em mobile.
- Fluxo de contrato é utilizável em telas menores.
- Botões e formulários mantêm boa usabilidade.

**Dependências:**

- Depende da implementação das principais telas da V1.

**Fora do escopo desta spec:**

- App mobile nativo.
- Design system completo.
- Animações complexas desnecessárias.

---

## 14. Ordem recomendada de implementação

A ordem abaixo deve ser seguida para evitar que a IA implemente partes fora de contexto:

1. ✅ Spec 01 — Base inicial da aplicação
2. ✅ Spec 02 — Layout principal e navegação
3. ✅ Spec 03 — Cadastro de usuário
4. ✅ Spec 04 — Login de usuário
5. ✅ Spec 05 — Proteção dos dados por usuário
6. ✅ Spec 06 — Cadastro de imóvel
7. ✅ Spec 07 — Listagem de imóveis
8. ✅ Spec 08 — Detalhes do imóvel
9. ✅ Spec 09 — Edição de imóvel
10. ✅ Spec 10 — Exclusão de imóvel
11. ✅ Spec 11 — Registro de rendimento mensal
12. ✅ Spec 12 — Linha do tempo de rendimentos
13. ✅ Spec 13 — Filtros e resumo de rendimento
14. ✅ Spec 13.1 — Exclusão de rendimento mensal
15. ✅ Spec 14 — Onboarding de geração de contrato
16. ✅ Spec 15 — Contrato vinculado a imóvel cadastrado
17. ✅ Spec 15.1 — Atalho "Gerar contrato" no detalhe do imóvel
18. ✅ Spec 16 — Contrato sem imóvel cadastrado
19. ✅ Spec 17 — Geração e download de PDF
20. ✅ Spec 18 — Listagem de contratos
21. ✅ Spec 19 — Dashboard de visão geral
22. ✅ Spec 20 — Validações gerais e estados vazios
23. ✅ Spec 21 — Responsividade e refinamento visual

Essa ordem começa pela base, passa por autenticação, garante isolamento de dados, implementa imóveis, depois rendimentos, contratos, dashboard e acabamento final.

**Próximo passo:** V1 concluída — evoluções pós-V1 (perfil/conta, lint automatizado, Magic UI) conforme backlog.

---

## 15. Observações finais

A V1 do Imobe está bem delimitada para um micro SaaS inicial. O produto tem um núcleo claro: imóveis, contratos, rendimentos e dashboard básico.

**Progresso atual (agosto/2026):** Fases 1 a 7 concluídas — V1 funcional com landing, autenticação, CRUD de imóveis, rendimentos (incl. Spec 13.1), contratos em PDF (incl. Spec 15.1 e pré-preenchimento de endereço do locatário/comprador), dashboard e acabamento (estados vazios, loading/error, responsividade base). Pendências pós-V1: página de conta/perfil, ESLint configurado (Next.js 16 removeu `next lint`), componentes Magic UI e toggle de tema escuro.

O principal cuidado durante a implementação será evitar adicionar funcionalidades grandes cedo demais, como marketplace, assinatura digital, CRM, pagamentos ou relatórios financeiros avançados.

A primeira versão deve provar que o usuário consegue gerenciar seus imóveis, acompanhar rendimentos e gerar contratos em PDF de forma simples e confiável.
