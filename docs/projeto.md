# Imobe — Visão geral do projeto

> Documento de produto baseado nas funcionalidades presentes no projeto em 5 de setembro de 2026. Apresenta propósito, público-alvo, missão, funcionamento e limites da versão atual.

## 1. O que é o Imobe

O **Imobe** é uma plataforma de gestão imobiliária voltada a proprietários de imóveis e corretores autônomos. Seu objetivo é reunir, em uma área privada, as informações necessárias para organizar uma carteira de imóveis, acompanhar rendimentos de aluguel e gerar contratos de locação ou compra e venda em PDF.

O produto atende quem administra imóveis próprios ou uma carteira de imóveis de forma independente e precisa consultar dados, valores, disponibilidade e documentos sem depender de várias planilhas e arquivos separados.

Sua proposta se organiza em quatro áreas principais:

| Área | O que permite fazer |
| --- | --- |
| Imóveis | Cadastrar, consultar, editar e organizar imóveis destinados a aluguel, venda ou ambos. |
| Rendimentos | Registrar lançamentos mensais de aluguel e acompanhar valores recebidos, pendentes ou em atraso. |
| Contratos | Gerar documentos de locação ou venda, consultar o histórico e baixar os PDFs posteriormente. |
| Painel da carteira | Consultar indicadores de quantidade de imóveis, patrimônio estimado, disponibilidade, rendimentos e contratos. |

O Imobe é uma ferramenta de organização e acompanhamento da atividade imobiliária individual. As informações da carteira ficam na área privada de cada usuário.

## 2. Problema que o projeto resolve

Na rotina de proprietários e corretores independentes, informações sobre imóveis frequentemente ficam distribuídas entre planilhas, mensagens, documentos e anúncios externos. Essa dispersão dificulta responder perguntas simples:

- Quais imóveis estão disponíveis para aluguel ou venda?
- Qual é o valor de aluguel e de venda de cada imóvel?
- Qual é o valor estimado da carteira cadastrada?
- Quanto foi registrado como recebido em determinado período?
- Quais lançamentos estão pendentes ou em atraso?
- Onde está o contrato gerado para determinado imóvel ou negociação?

A necessidade de procurar essas respostas em lugares diferentes aumenta o trabalho manual e favorece informações desatualizadas ou inconsistentes.

O Imobe centraliza esses registros e conecta o imóvel ao seu histórico de rendimentos e contratos. Com isso, o usuário consegue consultar a situação individual de um imóvel e também acompanhar uma visão geral da carteira.

## 3. Missão, visão e objetivos

### Missão

**Simplificar a gestão de imóveis de proprietários e corretores autônomos, reunindo informações, rendimentos e contratos em um único lugar para dar mais clareza e controle à rotina imobiliária.**

Essa formulação sintetiza o propósito descrito no planejamento do projeto e materializado nas funcionalidades atuais.

### Visão do produto

Ser uma ferramenta prática de uso recorrente para quem precisa administrar uma carteira imobiliária de forma independente, com acesso fácil às informações e aos documentos de cada imóvel.

### Objetivos centrais

- **Organizar a carteira:** manter dados de localização, finalidade, valores e disponibilidade de cada imóvel.
- **Facilitar o acompanhamento de aluguéis:** permitir registros mensais e consultas por período.
- **Reduzir o preenchimento repetido:** aproveitar dados de imóveis cadastrados na geração de contratos.
- **Centralizar documentos:** manter contratos gerados disponíveis para consulta e download.
- **Dar visibilidade à operação:** reunir indicadores básicos da carteira em um painel.
- **Preservar a separação entre contas:** permitir que cada usuário trabalhe com seus próprios registros.

Os benefícios esperados são menos dispersão de informações, menos retrabalho e mais facilidade para acompanhar a carteira. O projeto ainda não apresenta métricas de uso ou estudos que quantifiquem esses resultados.

## 4. Público-alvo

### Proprietários de imóveis

Pessoas que possuem um ou mais imóveis e acompanham diretamente sua administração. Podem ter imóveis alugados, disponíveis para locação, colocados à venda ou oferecidos nas duas modalidades.

Suas principais necessidades são manter o cadastro organizado, consultar valores, acompanhar recebimentos e preparar documentos relacionados às negociações.

Para esse público, o Imobe reúne a visão do patrimônio cadastrado e os registros operacionais de cada imóvel em uma mesma conta.

### Corretores autônomos

Profissionais que trabalham de forma independente e precisam organizar a carteira que administram ou oferecem para negociação.

Suas necessidades incluem consultar imóveis e disponibilidade, manter os valores atualizados e gerar contratos com os dados das partes envolvidas.

Para esse público, o Imobe oferece uma área individual de organização da carteira. O valor estimado mostrado no painel representa os imóveis cadastrados na conta, que podem pertencer a terceiros; não significa necessariamente patrimônio pessoal do corretor.

### Contexto de uso

O produto utiliza português brasileiro, valores em reais e informações comuns ao contexto imobiliário brasileiro, como IPTU e identificação das partes por CPF ou CNPJ.

O acesso acontece pelo navegador, com navegação adaptada a computadores e telas menores. Isso permite consultar a carteira e realizar os fluxos principais também pelo celular, sem aplicativo nativo.

### Perfis fora do foco inicial

A versão atual não contempla a operação de grandes imobiliárias, equipes com usuários e permissões diferentes, administradoras com processos complexos ou empresas que precisam de uma solução completa de relacionamento comercial e contabilidade.

Locatários e compradores aparecem como partes dos contratos. Não há portal próprio para essas pessoas acompanharem documentos, pagamentos ou negociações.

## 5. Acesso e área privada

O Imobe possui uma página pública de apresentação, com acesso à criação de conta e ao login.

O cadastro solicita nome completo, e-mail, senha e telefone opcional. Dependendo da configuração de confirmação de e-mail, o usuário pode precisar confirmar o endereço informado antes de entrar.

Após acessar a conta, o usuário encontra as áreas de painel, imóveis e contratos. Também pode encerrar a sessão.

A organização é individual: imóveis, rendimentos, contratos e indicadores pertencem à conta que os criou. Os documentos gerados ficam disponíveis para consulta e download dentro desse contexto privado.

Na versão atual, não existe uma página dedicada à edição de perfil ou gestão da conta.

## 6. Gestão de imóveis

### Cadastro e informações disponíveis

O cadastro reúne a identificação do imóvel, sua localização e as condições em que ele é oferecido.

| Grupo | Informações disponíveis |
| --- | --- |
| Tipo | Apartamento, casa, comercial, terreno ou outro. |
| Endereço | Rua, número, complemento, bairro, cidade e localização, indicada como estado ou região. |
| Anúncio | Link opcional para um anúncio externo. |
| Referências de valor | Valor médio atual estimado do imóvel e valor do IPTU, quando informados. |
| Finalidade | Aluguel, venda ou aluguel e venda. |
| Locação | Valor mensal do aluguel e disponibilidade para locação. |
| Venda | Valor de venda e disponibilidade para venda. |

A finalidade determina quais valores precisam ser preenchidos. Um imóvel destinado ao aluguel precisa de um valor mensal positivo; um imóvel destinado à venda precisa de um valor de venda positivo. Quando as duas finalidades se aplicam, os dois valores são necessários.

O valor estimado e o preço de venda têm papéis diferentes. O primeiro compõe a visão estimada da carteira; o segundo registra o preço definido para a negociação. O valor estimado é informado pelo usuário, sem avaliação automática de mercado.

O campo de localização é descritivo. O link de anúncio permite guardar uma referência externa; ele não publica o imóvel nem sincroniza informações com portais.

### Finalidade e disponibilidade

A finalidade indica como o imóvel pode ser negociado. A disponibilidade registra se ele está disponível naquela modalidade.

Um imóvel oferecido para aluguel e venda pode ter situações diferentes em cada modalidade. Por exemplo, pode estar indisponível para locação e continuar disponível para venda.

Essas informações são mantidas pelo usuário. A geração de um contrato não altera automaticamente a disponibilidade do imóvel.

### Listagem da carteira

A área de imóveis apresenta os registros com tipo, finalidade, endereço, bairro, cidade e valores aplicáveis. Também sinaliza indisponibilidade para aluguel ou venda.

Ao selecionar um imóvel, o usuário acessa seu detalhe. A listagem atual não oferece campo de busca nem filtros por finalidade ou disponibilidade.

### Detalhe do imóvel

A página de detalhe concentra os dados cadastrais e financeiros, as condições de disponibilidade, o acesso ao anúncio externo quando informado, os rendimentos aplicáveis e os contratos vinculados.

Dessa página, o usuário pode editar informações, iniciar a geração de um contrato ou solicitar a exclusão do imóvel.

### Edição e exclusão

A edição permite atualizar os dados do imóvel, incluindo finalidade, valores e disponibilidade.

A exclusão exige confirmação e retira o imóvel da carteira exibida. Os contratos já vinculados são preservados e continuam no histórico de contratos. Não há opção de restaurar o imóvel pela interface atual.

## 7. Rendimentos de aluguel

### Registro mensal

O usuário pode registrar rendimentos nos imóveis destinados a aluguel ou a aluguel e venda. Cada lançamento contém:

- Mês e ano de referência.
- Valor do lançamento.
- Situação: recebido, pendente ou em atraso.

O mês de referência identifica a competência do lançamento. A versão atual permite um lançamento por imóvel em cada mês, impedindo registros duplicados para a mesma competência.

O preenchimento é manual. O usuário informa o valor e a situação; o sistema não consulta pagamentos bancários nem identifica automaticamente quando um lançamento passou a estar em atraso.

### Histórico e consulta por período

Os rendimentos aparecem no detalhe do imóvel, em uma linha do tempo com mês de referência, valor e situação. Os registros mais recentes aparecem primeiro.

A consulta permite escolher um mês específico, os últimos seis meses ou os últimos doze meses. Os períodos de seis e doze meses incluem o mês atual.

Para o período selecionado, o Imobe apresenta:

- **Total recebido:** soma dos lançamentos marcados como recebidos.
- **Média mensal:** total recebido dividido pela quantidade de meses do período selecionado.

Lançamentos pendentes ou em atraso permanecem no histórico, mas não entram no total recebido. A média considera todos os meses do período, inclusive aqueles sem recebimentos registrados.

Por exemplo: R$ 6.000 recebidos em um período de seis meses resultam em média mensal de R$ 1.000, mesmo que os recebimentos tenham sido registrados em apenas três desses meses.

Esses indicadores representam os lançamentos informados. Não calculam lucro líquido, despesas ou rentabilidade percentual do imóvel.

### Exclusão e correção de lançamentos

O usuário pode excluir um rendimento mediante confirmação. A exclusão remove o lançamento e atualiza os resumos relacionados.

Não há edição direta de um rendimento existente na interface atual. Para corrigir valor, mês ou situação, o fluxo disponível é excluir o registro incorreto e cadastrar outro com as informações corretas.

### Mudança de finalidade do imóvel

Se um imóvel passar a ter finalidade exclusiva de venda, novos lançamentos de aluguel ficam bloqueados. Os registros anteriores são preservados e podem ser consultados nos períodos em que houver histórico.

## 8. Contratos de locação e venda

### Tipos de contrato

O Imobe gera contratos de locação e contratos de compra e venda de imóvel em PDF.

Na locação, as partes são locador e locatário. Na venda, são vendedor e comprador. Os formulários permitem informar pessoa física ou jurídica, nome, documento, RG ou inscrição quando aplicável, endereço, telefone e e-mail.

As partes são registradas no contexto de cada contrato. Não existe cadastro independente de clientes, compradores ou locatários para gestão de relacionamento.

### Contrato vinculado a imóvel cadastrado

Nesse fluxo, o usuário escolhe um imóvel da própria carteira. A seleção apresentada considera a finalidade correspondente ao tipo de contrato.

O sistema aproveita os dados do imóvel e preenche o valor de aluguel ou venda como ponto de partida. Também preenche o endereço do locatário ou comprador com o endereço do imóvel selecionado. O usuário completa e confere os dados das partes e as condições da negociação no formulário antes de gerar o documento.

O contrato passa a aparecer no histórico geral e na seção de contratos daquele imóvel.

### Atalho no detalhe do imóvel

A ação **Gerar contrato** permite começar pelo próprio imóvel, sem repetir sua seleção.

Para imóveis de aluguel, o atalho inicia um contrato de locação. Para imóveis de venda, inicia um contrato de venda. Quando o imóvel aceita as duas finalidades, o usuário escolhe o tipo desejado.

A indicação de indisponibilidade do imóvel não impede iniciar a geração do contrato.

### Contrato preenchido manualmente

Também é possível gerar um contrato sem cadastrar previamente o imóvel na carteira.

Nesse caso, o usuário informa os dados do imóvel, das partes e da negociação diretamente no formulário. O documento fica no histórico da conta, identificado como preenchido manualmente.

Esse fluxo não cria automaticamente um imóvel na carteira e pode ser usado para uma necessidade pontual de geração de documento.

### Condições de locação

O formulário de locação reúne data de início e de término da vigência, valor mensal, dia de vencimento entre 1 e 28, forma de pagamento, tipo de garantia, índice de reajuste e encargos e responsabilidades.

Essas informações compõem o documento. Informar um índice de reajuste ou uma forma de pagamento não ativa reajustes, cobranças ou recebimentos automáticos.

### Condições de venda

O formulário de venda reúne preço, condições de pagamento, data de posse ou transferência, responsabilidade pela escritura e responsabilidade pelos tributos.

Esses campos registram as condições informadas pelas partes. Não executam pagamento, transferência de propriedade ou procedimentos de cartório.

### Geração, histórico e download

Após o preenchimento, o Imobe gera e guarda o PDF. O usuário pode abrir os detalhes do contrato e baixar o arquivo, inclusive em acessos posteriores.

A listagem apresenta título, tipo, origem do preenchimento, nome da contraparte, data de geração e referência ao imóvel. A página de detalhe mostra informações do imóvel, das partes e das condições principais.

O contrato conserva os dados utilizados no momento da geração. Alterações posteriores no cadastro do imóvel não reescrevem o documento já gerado.

Os documentos são modelos operacionais. O próprio produto informa: “Modelo operacional gerado pelo Imobe. Recomenda-se revisão jurídica antes da utilização.”

Não há assinatura digital, envio automático às partes, edição de contrato gerado, controle de versões ou acompanhamento de assinatura na interface atual. Gerar o PDF também não cria lançamentos mensais de aluguel automaticamente.

## 9. Painel de visão geral

O painel reúne indicadores da carteira do usuário, permitindo consultar a operação sem abrir cada imóvel individualmente.

| Indicador | Significado |
| --- | --- |
| Total de imóveis | Quantidade de imóveis cadastrados que não foram excluídos da carteira. |
| Patrimônio estimado | Soma dos valores estimados informados nos imóveis da carteira. |
| Recebido no mês | Soma dos lançamentos marcados como recebidos com referência no mês atual. |
| Contratos | Quantidade de contratos gerados na conta, incluindo os preenchidos manualmente. |
| Disponíveis e indisponíveis | Quantidade de imóveis conforme a disponibilidade nas modalidades aplicáveis. |
| Para aluguel e para venda | Quantidade de imóveis em cada finalidade, incluindo imóveis oferecidos nas duas modalidades. |
| Recebido nos últimos 12 meses | Indicador dos recebimentos registrados a partir do início da janela de doze meses. |
| Pendente ou em atraso | Quantidade de lançamentos nessas situações; não representa uma soma monetária. |

Um imóvel oferecido para aluguel e venda participa das duas contagens por finalidade, mas conta uma única vez no total de imóveis. Ele é considerado disponível quando pelo menos uma das modalidades aplicáveis está disponível.

O patrimônio depende dos valores estimados preenchidos. Imóveis sem essa informação não acrescentam valor à soma. Para corretores que gerenciam imóveis de terceiros, o indicador deve ser entendido como valor estimado da carteira administrada.

Os resumos de rendimentos consideram registros mantidos na conta, inclusive históricos de imóveis retirados da listagem. A exclusão de um imóvel não equivale à exclusão dos seus lançamentos financeiros.

Na implementação atual, o indicador identificado como últimos doze meses considera registros a partir do início desse intervalo, sem descartar competências futuras cadastradas como recebidas. A consulta por período dentro do imóvel delimita tanto o início quanto o fim do intervalo.

Quando não há imóveis na carteira, o painel apresenta uma orientação para cadastrar o primeiro imóvel, em vez dos indicadores. Contratos manuais continuam acessíveis pela área de contratos.

## 10. Jornadas principais de uso

### Começar a organizar a carteira

1. Criar uma conta e acessar a área privada.
2. Cadastrar um imóvel com endereço, finalidade e valores.
3. Definir a disponibilidade para aluguel e/ou venda.
4. Consultar a listagem e abrir o detalhe do imóvel.
5. Acompanhar os indicadores disponíveis no painel.

### Acompanhar um aluguel

1. Abrir um imóvel com finalidade de aluguel.
2. Informar o mês de referência, o valor e a situação do lançamento.
3. Registrar o rendimento.
4. Consultar a linha do tempo e selecionar o período desejado.
5. Acompanhar o total recebido e a média mensal.

### Preparar um contrato da carteira

1. Abrir o detalhe do imóvel e selecionar **Gerar contrato**.
2. Escolher locação ou venda quando as duas modalidades forem possíveis.
3. Conferir os dados aproveitados do imóvel.
4. Preencher as partes e as condições da negociação.
5. Gerar o documento e baixar o PDF.
6. Consultar o contrato novamente pelo imóvel ou pelo histórico geral.

### Gerar um documento pontual

1. Acessar a área de contratos.
2. Escolher o tipo de contrato e o preenchimento manual.
3. Informar imóvel, partes e condições.
4. Gerar e baixar o PDF.
5. Acessar o documento posteriormente pelo histórico da conta.

## 11. Experiência de uso

A navegação principal dá acesso ao painel, à carteira de imóveis e aos contratos. Em telas menores, o menu se adapta ao espaço disponível.

O produto apresenta orientações quando ainda não existem imóveis, contratos ou rendimentos, além de indicar quando um filtro de período não encontra registros.

Os formulários sinalizam campos obrigatórios e erros de preenchimento. Ações como salvar dados e gerar contratos apresentam feedback de processamento, e as exclusões de imóveis e rendimentos exigem confirmação.

O usuário continua responsável por manter valores, disponibilidades e lançamentos atualizados. Os indicadores refletem as informações registradas na conta.

## 12. Escopo atual e limites do produto

O núcleo funcional atual inclui acesso individual, gestão de imóveis, registro e exclusão de rendimentos, consulta financeira por período, geração e histórico de contratos em PDF e painel da carteira.

Os seguintes recursos não fazem parte da experiência atual:

| Área | Recursos ausentes |
| --- | --- |
| Divulgação de imóveis | Marketplace, página pública de cada imóvel, publicação automática em portais e sincronização de anúncios. |
| Materiais do imóvel | Galeria de fotos e envio de documentos do imóvel. |
| Comercial | Gestão de leads, funil de vendas, agenda de visitas e cadastro independente de clientes. |
| Financeiro | Cobrança automática, emissão de boletos, integração bancária, conciliação, gestão de despesas, comissões, contabilidade e relatórios avançados. |
| Contratos | Assinatura digital, envio automático por e-mail ou WhatsApp, edição de documentos gerados e gestão de versões. |
| Equipes | Vários usuários na mesma conta, divisão de responsabilidades e permissões por equipe. |
| Conta e acesso | Página de edição de perfil e fluxo próprio de recuperação de senha na interface. |
| Oferta comercial | Contratação de planos pagos, assinatura mensal e gestão de cobrança do uso da plataforma. |
| Dispositivos | Aplicativo nativo para celular. |
| Análise imobiliária | Avaliação automática de mercado e análise de imóveis por inteligência artificial. |

Esses limites descrevem o estado observado do produto. Não representam promessa de implementação ou cronograma de evolução.

## 13. Referências do projeto

Este documento foi elaborado a partir do [PRD inicial](./PRD-Inicial.md), do [status de implementação](./IMPLEMENTATION-STATUS.md) e da leitura das funcionalidades presentes no projeto.

Quando a documentação anterior descrevia uma intenção ou um estado antigo, a descrição das funcionalidades existentes foi guiada pelo comportamento encontrado no projeto. A missão e a visão apresentadas são uma síntese desse material, sem pressupor metas comerciais, números de clientes ou resultados ainda não documentados.
