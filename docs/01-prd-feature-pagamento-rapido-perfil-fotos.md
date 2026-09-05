# PRD — Pagamento rápido, perfil do usuário e fotos dos imóveis

> Tipo: PRD de feature · Data: 2026-09-05
> **Status:** Implementada
>
> <!-- Valores possíveis: "Aguardando implementação" | "Implementada". Atualize para "Implementada" quando todas as specs estiverem concluídas. -->

## 1. Visão geral

Esta entrega amplia o Imobe em três frentes complementares:

1. **Pagamento rápido de aluguel:** ação no dashboard para registrar um recebimento sem sair do painel ou abrir o detalhe do imóvel.
2. **Perfil do usuário:** página privada para consultar os dados da conta e editar nome, telefone/WhatsApp, Instagram e TikTok.
3. **Fotos dos imóveis:** inclusão opcional de até dez fotos no cadastro, manutenção das fotos na edição e visualização no detalhe do imóvel.

O recorte usa a carteira, os rendimentos e o perfil já existentes. O pagamento registrado pelo atalho é o mesmo lançamento mensal acompanhado no detalhe do imóvel, não um controle financeiro paralelo.

### Contexto observado

- O dashboard já apresenta valores recebidos, quantidade de pendências e indicadores da carteira, mas não oferece registro rápido de pagamento.
- Rendimentos são cadastrados no detalhe do imóvel, com mês, valor e situação. Existe um único lançamento por imóvel e mês.
- O fluxo atual permite excluir rendimentos, mas não oferece edição direta. Esta entrega acrescenta a transição de pendente/em atraso para recebido pelo atalho.
- O perfil já contém nome e telefone; o e-mail pertence à conta de acesso. Não há página de edição do perfil nem campos de redes sociais.
- Cadastro, edição e detalhe de imóveis já existem, sem fotos.
- O produto já guarda contratos em arquivos privados. Fotos devem manter a mesma separação entre usuários, sem interferir nos documentos existentes.

Referências de contexto: [visão geral do projeto](../projeto.md), [PRD inicial](../PRD-Inicial.md) e [status anterior de implementação](../IMPLEMENTATION-STATUS.md). A leitura do comportamento atual prevalece sobre descrições antigas dessas referências.

### Decisões confirmadas pelo usuário

O usuário aprovou o escopo e todas as sugestões apresentadas na conversa:

| Frente | Decisão confirmada |
| --- | --- |
| Pagamento | Diálogo aberto pelo dashboard, com imóvel, mês e valor. |
| Preenchimento | Sugerir mês atual e valor cadastrado do aluguel, permitindo alteração. |
| Elegibilidade | Aceitar imóveis de aluguel ou aluguel e venda, inclusive indisponíveis para nova locação. |
| Situação | Registrar como recebido. |
| Lançamento existente | Permitir confirmar valor e marcar pendente/em atraso como recebido; bloquear competência já recebida. |
| Perfil | Nome editável; e-mail apenas para consulta. |
| Contatos | WhatsApp, Instagram e TikTok opcionais; redes sociais informadas como nome de usuário. |
| Fotos | Opcionais, no máximo dez por imóvel, exclusivamente PNG/JPG/JPEG, até 3 MB por arquivo. |
| Manutenção | Adicionar e remover fotos também na edição; exibir no detalhe do imóvel. |
| Privacidade | Dados e fotos acessíveis somente ao usuário responsável pela conta. |
| Exclusões de escopo | Sem troca de senha/e-mail ou foto de perfil nesta entrega. |

### Detalhamentos operacionais adotados neste PRD

As decisões abaixo tornam os critérios verificáveis. São definições propostas pelo documento, não pedidos literais adicionais do usuário:

- Interpretar **3 MB como 3.000.000 bytes**, incluindo exatamente esse tamanho no limite permitido.
- Manter mês de referência conforme a convenção já usada pelo Imobe, sem introduzir data de pagamento separada nem nova proibição de competências futuras.
- Identificar as redes por nome de usuário, aceitando um `@` inicial opcional; não consultar a existência da conta externa.
- Usar regras locais de preenchimento de telefone e redes sociais, descritas na seção 7, sem prometer validação da titularidade ou existência desses contatos.
- Guardar fotos somente como resultado de um salvamento confirmado. Cancelar seleção ou edição não altera fotos já salvas.
- Exibir fotos na ordem em que foram adicionadas; não criar ordenação manual, escolha de capa ou imagens nos cartões da listagem.
- Tratar falhas de salvamento sem publicar alterações parciais como se fossem concluídas. Repetir uma operação não deve duplicar imóvel, recebimento ou foto.

## 2. Problema que resolve

### Pagamento rápido

Registrar um aluguel recebido hoje exige navegar até a carteira, localizar o imóvel e abrir seus detalhes. Além disso, um lançamento previamente marcado como pendente precisa ser excluído e recriado para representar o recebimento. O atalho reduz a navegação e permite concluir esse lançamento sem duplicação.

### Perfil

O usuário não consegue manter seus dados pessoais e contatos atualizados dentro de uma página própria. Informações de Instagram e TikTok não estão disponíveis no produto.

### Fotos

Os imóveis são identificados apenas por informações textuais. Falta um registro visual privado para reconhecer e consultar cada imóvel, com regras explícitas sobre formatos, quantidade e tamanho dos arquivos.

## 3. Público-alvo

Proprietários de imóveis e corretores autônomos que já utilizam uma conta individual do Imobe para organizar sua carteira.

- Proprietários e corretores que registram recebimentos mensais de aluguel.
- Usuários que precisam atualizar nome e contatos da própria conta.
- Usuários que desejam guardar fotos dos imóveis administrados.

Locatários, compradores e visitantes públicos não recebem acesso novo. A entrega não cria equipes, perfis públicos ou compartilhamento de carteiras.

## 4. Objetivo do recorte atual

Permitir que o usuário registre um recebimento diretamente no dashboard, mantenha seus dados de perfil e associe fotos privadas aos imóveis, preservando a consistência dos registros financeiros e a separação entre contas.

Ao final, será possível:

1. Registrar um recebimento sem navegar para fora do dashboard.
2. Concluir um lançamento pendente ou em atraso mediante confirmação.
3. Ver os totais atualizados e o mesmo lançamento no histórico do imóvel.
4. Acessar o próprio perfil, editar campos permitidos e reencontrar os dados salvos em outro acesso.
5. Cadastrar imóveis com zero a dez fotos válidas.
6. Adicionar/remover fotos na edição e visualizá-las no detalhe do imóvel.
7. Receber mensagens específicas para arquivos inválidos, excesso de fotos, dados incorretos, conflitos e falhas de salvamento.

O aceite depende desses comportamentos verificáveis. Não há meta quantitativa de conversão, receita ou tempo de uso aprovada para este recorte.

## 5. Funcionalidades

### Essenciais

**Pagamento rápido**

- Botão **Registrar pagamento de aluguel** no dashboard.
- Diálogo com seleção do imóvel, mês de referência e valor em reais.
- Identificação dos imóveis por endereço, com bairro/cidade para distinguir endereços semelhantes.
- Sugestão de mês atual e valor do aluguel.
- Consulta da situação da competência selecionada.
- Criação de lançamento recebido quando a competência estiver livre.
- Confirmação e conclusão de lançamento pendente/em atraso.
- Bloqueio de duplicação para competência recebida e em tentativas simultâneas.
- Atualização dos indicadores e do histórico correspondente.

**Perfil**

- Acesso **Meu perfil** na área do usuário, disponível em desktop e celular.
- Exibição de nome, e-mail, telefone/WhatsApp, Instagram e TikTok.
- Edição do nome e dos contatos permitidos.
- Remoção de valores opcionais anteriormente preenchidos.
- Feedback de salvamento e atualização do nome exibido na navegação.

**Fotos**

- Seleção de um ou vários arquivos durante cadastro e edição.
- Prévia, identificação de arquivos e contador de fotos.
- Validação de formato real, extensão, integridade, tamanho e quantidade.
- Remoção de seleção antes de salvar e remoção de fotos existentes na edição.
- Persistência privada e exibição no detalhe do imóvel.
- Tratamento de falhas de envio, arquivos inacessíveis e repetição de salvamento.

### Desejáveis

Nenhuma funcionalidade opcional adicional foi incluída. As sugestões aprovadas passaram a integrar o escopo essencial; itens adicionais ficam fora deste recorte.

## 6. Fora do escopo

- Receber dinheiro, realizar transferências, integrar bancos ou emitir cobranças/boletos.
- Parcelamento, recebimentos parciais, mais de um lançamento para o mesmo imóvel/mês, juros, multas e descontos discriminados.
- Comprovantes, data efetiva do pagamento, método de pagamento e recibos.
- Alterar ou estornar lançamento já recebido pelo atalho; a exclusão existente continua disponível no detalhe do imóvel.
- Edição genérica de rendimentos no detalhe, geração automática de competências ou alteração de contratos.
- Reformular cálculos históricos do dashboard que não sejam necessários para refletir o registro realizado.
- Foto de perfil, alteração de e-mail, troca/recuperação de senha, exclusão de conta e perfil público.
- Verificação por mensagem de WhatsApp, integração com redes sociais ou consulta da existência de um perfil externo.
- Fotos em anúncios públicos, contratos em PDF, cartões da listagem ou exportações.
- Compartilhar fotos com terceiros, escolher capa, reordenar manualmente, recortar, editar ou comprimir imagens automaticamente.
- Aceitar GIF, WebP, HEIC, SVG, PDF, vídeos ou qualquer formato diferente de PNG e JPEG.
- Importar imagens por endereço externo, deduplicar por semelhança visual ou produzir legendas automáticas.
- Criar planos pagos, equipes, permissões compartilhadas ou aplicativo nativo.

## 7. Regras de negócio

### Regras comuns

- **G01 — Conta autenticada:** todas as leituras e alterações dependem de sessão válida.
- **G02 — Titularidade:** o usuário acessa e altera somente seu perfil, seus imóveis, seus rendimentos e suas fotos. Informar identificadores de outra conta não autoriza acesso.
- **G03 — Validação efetiva:** autorização e validações devem ser aplicadas pelo servidor, inclusive quando a interface for contornada. Validação local serve de feedback antecipado.
- **G04 — Falhas:** apresentar mensagem clara e recuperável, sem expor dados de terceiros, segredos ou detalhes internos.
- **G05 — Confirmação real:** informar sucesso apenas depois de o resultado estar confirmado. Evitar duplicação ao clicar repetidamente ou repetir tentativa após falha de conexão.
- **G06 — Compatibilidade:** registros antigos continuam utilizáveis. Contatos sociais vazios e imóveis sem fotos são estados válidos.

### Pagamento rápido

- **P01 — Imóveis elegíveis:** listar imóveis não excluídos da conta com finalidade aluguel ou aluguel e venda. Disponibilidade para nova locação não restringe a seleção.
- **P02 — Imóveis inelegíveis:** imóveis exclusivos de venda, excluídos ou de outra conta não podem receber pagamento pelo atalho. Revalidar essa condição ao salvar.
- **P03 — Campos:** imóvel, mês de referência e valor são obrigatórios; situação recebida é fixa e não selecionável.
- **P04 — Padrões:** iniciar com mês atual; ao selecionar um imóvel e competência livre, sugerir seu valor de aluguel. O usuário pode alterar mês e valor. Não escolher silenciosamente um imóvel sem identificação clara.
- **P05 — Troca de contexto:** ao mudar imóvel ou mês, consultar novamente a competência. Resultados atrasados de uma seleção anterior não podem substituir a seleção atual. Alterações manuais no valor não devem ser sobrescritas por atualizações de fundo; uma nova escolha de imóvel/competência inicia o contexto correspondente.
- **P06 — Valor válido:** aceitar valor finito de R$ 0,01 até R$ 999.999.999.999,99, com no máximo duas casas decimais, compatível com os valores atualmente suportados. Rejeitar vazio, zero, negativo, excesso de precisão e valor fora desse intervalo, sem arredondamento silencioso.
- **P07 — Competência válida:** exigir mês e ano reais, com mês de 1 a 12 e ano de 1 a 9999. O registro representa competência, não data de pagamento. Competências passadas e futuras permanecem permitidas, preservando o alcance do registro atual.
- **P08 — Competência livre:** criar exatamente um lançamento recebido, usando imóvel, mês e valor confirmados.
- **P09 — Competência pendente/em atraso:** apresentar situação e valor já registrados; usar esse valor como sugestão, com edição permitida. Antes de concluir, mostrar imóvel, mês, valor anterior e valor confirmado, deixando explícita a atualização do lançamento existente.
- **P10 — Confirmação da atualização:** somente confirmação explícita altera pendente/em atraso para recebido. Cancelar a confirmação mantém dados e situação originais. Não criar um segundo lançamento nem mudar a competência do registro existente.
- **P11 — Competência recebida:** impedir novo recebimento e informar que aquele mês já foi registrado. Exibir mês e valor do registro acessível ao usuário, sem substituí-lo.
- **P12 — Concorrência:** revalidar situação e valor no salvamento. Se o lançamento mudar desde a apresentação da confirmação, não sobrescrever; exibir o estado atualizado e exigir nova revisão. Se surgir um lançamento pendente após consulta de competência livre, pedir confirmação antes de atualizá-lo. Se ele tiver sido removido, revisar a competência livre antes de criar outro.
- **P13 — Resultado financeiro:** ao criar ou concluir um recebimento, atualizar os indicadores aplicáveis e o histórico do imóvel. Converter pendente/em atraso reduz o contador dessas situações em uma unidade e acrescenta o valor final aos totais recebidos dos períodos correspondentes, sem contagem dupla.
- **P14 — Demais dados:** o valor confirmado vale para o lançamento; não altera o preço de aluguel cadastrado, disponibilidade, estimativa patrimonial ou contratos.
- **P15 — Sem imóveis elegíveis:** manter acesso ao atalho, exibir orientação e ação para cadastrar imóvel; não permitir salvar sem seleção válida. O atalho também deve existir no dashboard vazio.

### Perfil

- **U01 — Dados exibidos:** nome e telefone vêm do perfil existente; e-mail vem da conta autenticada. Instagram e TikTok inicialmente ficam vazios para contas antigas.
- **U02 — Nome:** obrigatório, com 2 a 120 caracteres após retirada de espaços nas extremidades. Aceitar acentos e nomes compostos, sem exigir quantidade mínima de palavras.
- **U03 — E-mail:** somente leitura. Tentativa de alterá-lo por envio manipulado não modifica a conta.
- **U04 — Contatos opcionais:** WhatsApp, Instagram e TikTok podem ficar vazios ou ser apagados posteriormente. Salvar campo vazio remove o valor anterior.
- **U05 — WhatsApp:** aproveitar o telefone já existente; não criar um segundo contato concorrente. Aceitar formatação visual com espaços, parênteses e hífens. Para número brasileiro sem código internacional, exigir DDD e 10 ou 11 dígitos; para número iniciado por `+`, aceitar código internacional e total de 8 a 15 dígitos, começando por dígito diferente de zero. Não aceitar letras ou apenas código de país. A validação não confirma que o número possui WhatsApp.
- **U06 — Redes sociais:** aceitar identificador com ou sem um único `@` inicial, retirar espaços apenas nas extremidades e tratar o `@` como apresentação. Como regra local do campo, aceitar de 1 a 100 caracteres no identificador, limitados a letras latinas sem acento, números, ponto e sublinhado. Rejeitar espaços internos, outros símbolos e links completos, orientando a informar somente o nome de usuário. Essa regra não certifica compatibilidade com todas as políticas externas ou existência do perfil.
- **U07 — Salvamento:** nome e contatos são salvos em conjunto. Falha em um campo impede salvamento parcial e mantém os valores preenchidos para correção.
- **U08 — Exibição do nome:** após salvar, atualizar o nome mostrado no contexto autenticado e preservá-lo ao recarregar ou entrar novamente.
- **U09 — Registros antigos:** dados anteriores permanecem visíveis, inclusive telefone vazio. Caso algum valor antigo não atenda às novas regras, pedir correção antes de salvar; não apagar nem substituir silenciosamente.
- **U10 — Dados ausentes:** perfil não encontrado ou falha de carregamento não deve ser apresentado como um formulário vazio pronto para sobrescrever informações. Exibir indisponibilidade e opção de tentar novamente.

### Fotos dos imóveis

- **F01 — Quantidade:** zero a dez fotos por imóvel. Na edição, contar fotos mantidas mais novas selecionadas; fotos marcadas para remoção não entram no total resultante. Revalidar no servidor considerando alterações simultâneas.
- **F02 — Formatos:** aceitar extensões `.png`, `.jpg` e `.jpeg`, sem distinguir maiúsculas/minúsculas, somente quando o conteúdo for uma imagem PNG ou JPEG válida e corresponder à extensão. JPG e JPEG são equivalentes.
- **F03 — Tamanho:** cada arquivo deve ter de 1 a 3.000.000 bytes. Arquivo exatamente no limite é aceito; um byte acima é rejeitado. O limite é individual, não de todo o conjunto. Dez arquivos de 3 MB devem poder compor um cadastro válido.
- **F04 — Conteúdo real:** verificar formato e capacidade de leitura da imagem no servidor. Nome, extensão e tipo informado pelo navegador não constituem prova suficiente. Arquivos corrompidos, truncados, vazios ou de outro formato devem ser rejeitados, mesmo renomeados.
- **F05 — Mensagens:** identificar cada arquivo rejeitado e o motivo: tipo não permitido, conteúdo incompatível/inválido, tamanho acima de 3 MB ou quantidade excedida. Não informar sucesso para arquivo rejeitado.
- **F06 — Seleção mista:** validar cada arquivo. Arquivos válidos permanecem selecionados; inválidos não entram no conjunto que será salvo. O usuário vê quais foram rejeitados e pode continuar com os válidos ou escolher substitutos. Nenhum descarte deve ser silencioso.
- **F07 — Excesso de quantidade:** depois da validação individual, se os arquivos válidos da nova seleção excederem as vagas, não incorporar esse novo grupo e preservar a seleção anterior. Informar quantas vagas restam; não escolher arbitrariamente quais arquivos descartar.
- **F08 — Prévia:** cada foto selecionada possui prévia, identificação e ação de remover. Falha na prévia não autoriza aprovação do arquivo; fotos salvas temporariamente indisponíveis exibem estado próprio de erro.
- **F09 — Persistência:** selecionar ou marcar remoção prepara alterações. Somente **Cadastrar imóvel** ou **Salvar alterações** confirma o conjunto final. Cancelar abandona as mudanças não salvas.
- **F10 — Consistência:** cadastro com fotos só é informado como concluído quando imóvel e fotos aceitas estiverem confirmados. Falha não deve deixar um segundo imóvel ao tentar novamente, fotos publicadas parcialmente ou um cadastro visível que pareça concluído sem o conjunto selecionado. Na edição, preservar os dados e as fotos anteriores quando não for possível concluir o salvamento.
- **F11 — Repetição:** duplo clique e nova tentativa da mesma operação não duplicam fotos ou imóveis. Se o resultado da tentativa for incerto por perda de conexão, conferir o resultado antes de reaplicar alterações.
- **F12 — Privacidade:** enviar, consultar e remover exige autorização para a conta e o imóvel. Não oferecer acesso público permanente, nem permitir associação de arquivo de outro usuário. Fotos excluídas ou de imóvel excluído deixam de ser acessíveis pelo produto.
- **F13 — Temporários e remoção:** seleções abandonadas e envios que falharam não se tornam fotos de um imóvel nem permanecem como arquivos acessíveis sem vínculo. Remover referências visíveis e retirar acesso a fotos excluídas mesmo quando a limpeza física precisar ser concluída posteriormente.
- **F14 — Ordem:** manter ordem de adição; novas fotos entram ao final, e remover uma foto preserva a ordem das demais. Não há arraste para reordenar nem escolha de capa.
- **F15 — Imóveis antigos:** cadastro sem foto continua permitido, e imóveis existentes podem receber fotos na edição. Não exigir preenchimento retroativo.
- **F16 — Exibição:** mostrar fotos apenas na área privada de detalhe do imóvel, mantendo dados cadastrais, rendimentos e contratos acessíveis. Imóvel sem fotos apresenta estado vazio discreto e acesso à edição.
- **F17 — Exclusão do imóvel:** retirar acesso às fotos do imóvel excluído e impedir novos envios. Manter a regra existente de preservação dos contratos e dos registros financeiros históricos.
- **F18 — Falha ou conflito na edição:** se outro acesso alterar fotos, excluir imóvel ou tornar a autorização inválida enquanto o formulário estiver aberto, impedir sobrescrita silenciosa, explicar o conflito e orientar a recarregar. Não remover fotos que o usuário não revisou.

## 8. Fluxos principais

### Fluxo 1 — Registrar recebimento em competência livre

1. Usuário abre o dashboard e seleciona **Registrar pagamento de aluguel**.
2. Diálogo carrega os imóveis elegíveis e sugere o mês atual.
3. Usuário seleciona o imóvel e vê o valor de aluguel sugerido.
4. Sistema consulta a competência; usuário ajusta mês/valor se necessário.
5. Usuário seleciona **Registrar pagamento**.
6. Sistema valida autorização, dados e ausência de lançamento concorrente.
7. Sistema confirma um único lançamento recebido, fecha o diálogo e atualiza o painel.
8. Ao abrir o imóvel, usuário encontra o mesmo recebimento no histórico.

### Fluxo 2 — Concluir lançamento pendente ou em atraso

1. Usuário abre o atalho e seleciona imóvel e competência já registrada.
2. Sistema mostra situação e valor existentes e permite ajustar o valor.
3. Usuário solicita marcar como recebido.
4. Sistema apresenta confirmação com imóvel, mês, valor anterior e valor final.
5. Usuário confirma; sistema revalida o registro e altera somente o lançamento revisado.
6. Dashboard e histórico passam a refletir a situação recebida e o valor confirmado.
7. Se cancelar ou ocorrer conflito, o lançamento não é alterado por essa tentativa.

### Fluxo 3 — Consultar e editar perfil

1. Usuário acessa **Meu perfil** pela área do usuário.
2. Página carrega nome, e-mail e contatos existentes.
3. Usuário altera nome e/ou contatos, podendo limpar os opcionais.
4. Usuário seleciona **Salvar alterações**.
5. Sistema valida os campos e a titularidade e salva o conjunto.
6. Página confirma salvamento e navegação passa a mostrar o nome atualizado.

### Fluxo 4 — Cadastrar imóvel com fotos

1. Usuário preenche os dados do imóvel no cadastro existente.
2. Seleciona um ou mais arquivos na seção **Fotos do imóvel**.
3. Sistema valida seleção, mostra prévias e informa eventuais arquivos rejeitados.
4. Usuário remove fotos da seleção ou adiciona outras, respeitando dez no total.
5. Usuário seleciona **Cadastrar imóvel**.
6. Sistema revalida campos, arquivos, quantidade e autorização e confirma o conjunto.
7. Usuário acessa o detalhe com fotos e dados salvos.
8. Em falha, permanece no formulário com explicação e possibilidade de corrigir ou tentar novamente sem duplicar o cadastro.

### Fluxo 5 — Adicionar ou remover fotos na edição

1. Usuário abre a edição de um imóvel próprio e vê as fotos existentes.
2. Adiciona arquivos novos e/ou marca fotos existentes para remoção.
3. Contador mostra o total resultante, sem ultrapassar dez.
4. Usuário salva; sistema confirma o conjunto final ou informa erro/conflito.
5. No sucesso, detalhe mostra a coleção atualizada; fotos removidas deixam de ser acessíveis.
6. Se cancelar, as fotos já salvas permanecem como estavam.

## 9. Critérios de aceite

- **CA01:** usuário registra aluguel recebido pelo dashboard sem navegar até o imóvel.
- **CA02:** imóvel, mês e valor são obrigatórios; valor inválido ou mês inexistente não é salvo.
- **CA03:** imóvel indisponível para nova locação permanece elegível quando sua finalidade inclui aluguel.
- **CA04:** imóvel apenas para venda, excluído ou alheio não recebe lançamento pelo atalho.
- **CA05:** competência pendente/em atraso só passa a recebida após confirmação explícita, sem criar registro adicional.
- **CA06:** competência já recebida e solicitações simultâneas não produzem duplicação nem sobrescrita silenciosa.
- **CA07:** total recebido, contador de pendências e histórico refletem exatamente o resultado confirmado.
- **CA08:** perfil carrega dados do usuário autenticado e permite salvar nome e contatos, inclusive apagar campos opcionais.
- **CA09:** e-mail permanece inalterado e outra conta não consegue ler ou editar o perfil.
- **CA10:** nome atualizado permanece correto na navegação após recarregar e após novo login.
- **CA11:** imóvel pode ser cadastrado sem fotos ou com até dez fotos válidas.
- **CA12:** PNG, JPG e JPEG válidos, inclusive exatamente 3.000.000 bytes, são aceitos; arquivos acima do limite, vazios, incompatíveis ou corrompidos são rejeitados pelo servidor.
- **CA13:** usuário adiciona/remove fotos durante edição; cancelar não efetiva mudanças.
- **CA14:** fotos aparecem no detalhe privado e não ficam acessíveis a outra conta ou após remoção/exclusão do imóvel.
- **CA15:** falha ou repetição de salvamento não duplica imóvel/foto e não apresenta resultado parcial como sucesso.
- **CA16:** fluxos funcionam em desktop, celular e por teclado, com feedback de carregamento, erro e ausência de dados.
- **CA17:** contratos, exclusão de rendimentos, cadastro sem fotos e consulta da carteira existentes continuam funcionais.

Os cenários Dado/Quando/Então de cada spec detalham esses critérios e integram a definição de pronto da entrega.

## 10. Stack

Manter a base já adotada pelo Imobe, em alto nível:

- Next.js 16 e React 19 com TypeScript para aplicação web.
- Supabase para autenticação, dados e arquivos privados.
- Tailwind CSS e componentes da interface existentes para formulários, diálogos e estados de interação.
- React Hook Form e Zod para o fluxo de formulários e validações existentes.

A verificação do conteúdo real das imagens é um requisito adicional de capacidade. A escolha de eventual recurso complementar pertence à implementação; nenhuma nova biblioteca, serviço pago ou provedor é imposto por este PRD.

## 11. Justificativa da stack

As três frentes estendem entidades e telas existentes. Manter a base atual evita duplicar controle financeiro, identidade do usuário e armazenamento de arquivos.

O projeto já possui recursos para sessão autenticada, persistência privada e componentes de formulário. A documentação do Supabase consultada via Context7 confirma a disponibilidade de restrições de tamanho e tipos de arquivo por agrupamento de armazenamento e de controle de acesso aos arquivos. Essas restrições complementam, mas não substituem, a validação efetiva do conteúdo da imagem exigida neste PRD.

Fotos e contratos têm requisitos diferentes. As regras de imagens não devem impedir download, geração ou armazenamento dos PDFs já existentes. Os limites do ambiente devem permitir dez fotos válidas de até 3 MB no fluxo, mesmo que os envios ocorram em etapas.

Referências de capacidade: [organização e restrições de arquivos](https://supabase.com/docs/guides/storage/buckets/fundamentals), [limites de tamanho](https://supabase.com/docs/guides/storage/uploads/file-limits) e [controle de acesso](https://supabase.com/docs/guides/storage/security/access-control). Não constituem instruções de implementação.

## 12. Fases de construção

### Fase 1 — Recebimentos pelo dashboard

Objetivo: disponibilizar entrada rápida com segurança financeira e integração ao histórico.

- Spec 01 — Diálogo e registro de recebimento em competência livre.
- Spec 02 — Conclusão de pendências, conflitos e integração financeira.

As duas specs formam uma única entrega para liberação do atalho ao usuário; a conclusão de pendências é parte obrigatória do comportamento aprovado.

### Fase 2 — Perfil do usuário

Objetivo: permitir consulta e manutenção dos dados da própria conta.

- Spec 03 — Consulta e edição do perfil e contatos.

### Fase 3 — Fotos privadas dos imóveis

Objetivo: cadastrar, manter e consultar imagens com validação e privacidade.

- Spec 04 — Seleção, validação e salvamento de fotos no cadastro.
- Spec 05 — Manutenção de fotos na edição.
- Spec 06 — Visualização privada e ciclo de acesso das fotos.

As três specs devem estar concluídas antes de disponibilizar fotos ao usuário, evitando arquivos sem meio de consulta ou manutenção.

### Fase 4 — Validação integrada

Objetivo: verificar isolamento entre contas, concorrência, falhas recuperáveis, acessibilidade e regressões.

- Spec 07 — Aceite integrado e preservação dos fluxos existentes.

## 13. Specs funcionais detalhadas

### Spec 01 — Diálogo e registro de recebimento em competência livre

- **Fase:** 1 — Recebimentos pelo dashboard.
- **Objetivo (o quê):** permitir registrar um aluguel recebido diretamente no dashboard, selecionando imóvel, mês e valor.
- **Intenção (por quê):** reduzir a navegação necessária para registrar um recebimento e manter a informação no histórico já utilizado pelo produto.
- **Contexto:** dashboard e rendimentos mensais já existem. Cada imóvel admite um lançamento por competência. O formulário do detalhe continua disponível.
- **Atores:** usuário autenticado que possui imóveis na própria carteira.
- **Descrição do comportamento:** exibir **Registrar pagamento de aluguel** no cabeçalho do dashboard, inclusive no estado vazio. Abrir diálogo e carregar imóveis próprios, não excluídos, com finalidade aluguel ou aluguel e venda. Identificar cada opção por endereço e bairro/cidade. Sugerir mês atual e, ao selecionar imóvel/competência livre, valor do aluguel. Permitir alterações e validar a competência antes de habilitar conclusão. Em competência livre, confirmar um único lançamento recebido, fechar o diálogo, informar sucesso e atualizar o painel. Não oferecer seleção de situação.
- **Entradas e saídas:** entram escolha de imóvel, competência e valor; saem lançamento recebido persistido, feedback e indicadores atualizados. Imóvel e valor sugerido vêm da carteira; mês sugerido segue a convenção atual do produto.
- **Dados/entidades envolvidos (conceitual):** conta autenticada; imóvel com finalidade, disponibilidade, endereço e valor mensal; rendimento com imóvel, competência, valor e situação.
- **Estados e transições:** fechado → carregando imóveis → pronto para preencher → consultando competência → competência livre → salvando → sucesso/fechado. Ausência de imóveis leva a orientação de cadastro; falhas levam a erro recuperável; competência existente segue Spec 02. Fechar antes de salvar descarta preenchimento sem criar registro.
- **Regras de negócio:** aplicar G01–G06 e P01–P08, P11–P15. Valor de R$ 0,01 a R$ 999.999.999.999,99, no máximo duas casas decimais; competência real; imóvel próprio com finalidade de aluguel, mesmo indisponível para nova locação. Nenhuma alteração do valor cadastrado do imóvel.
- **Validações:** servidor confirma sessão, titularidade, imóvel não excluído, finalidade, validade da competência, valor e inexistência de lançamento. Cliente antecipa mensagens sem substituir essa validação. Impedir submissão enquanto contexto da seleção estiver sendo consultado ou salvamento estiver em andamento.
- **Fluxo do usuário (passo a passo):**
  1. Abrir dashboard e acionar registro rápido.
  2. Selecionar imóvel elegível.
  3. Conferir e ajustar mês/valor.
  4. Selecionar **Registrar pagamento**.
  5. Ver sucesso no dashboard e recebimento no histórico do imóvel.
- **Casos de borda e erros:** sem elegíveis, orientar cadastro sem exibir formulário salvável; falha de consulta, oferecer nova tentativa; dados inválidos, apontar campos sem perder preenchimento; sessão expirada, pedir novo acesso sem confirmar recebimento; imóvel excluído/alterado entre abertura e envio, bloquear operação e atualizar opções; respostas atrasadas não mudam seleção atual; competência criada simultaneamente segue Spec 02; falha de conexão com resultado incerto exige consultar estado antes de repetir.
- **Impacto no existente:** novo ponto de entrada para os mesmos rendimentos; painel e histórico passam a refletir registros feitos pelo diálogo. Cadastro pelo detalhe, contratos e disponibilidade continuam com seus comportamentos atuais.
- **Critérios de aceite (Dado/Quando/Então):**
  - Dado imóvel próprio para aluguel indisponível para nova locação, quando abrir seleção, então ele está disponível para registrar recebimento.
  - Dada competência livre e valor válido, quando confirmar, então existe exatamente um lançamento recebido e o diálogo fecha após sucesso.
  - Dado valor sugerido de R$ 2.000, quando confirmar R$ 1.950, então rendimento registra R$ 1.950 e aluguel cadastrado continua R$ 2.000.
  - Dado mês inválido ou valor zero/negativo/com mais de duas casas, quando enviar, então não salva e informa o campo incorreto.
  - Dado dashboard sem imóveis elegíveis, quando abrir atalho, então orienta cadastro e impede recebimento sem imóvel.
  - Dado identificador de imóvel de outra conta em envio manipulado, quando tentar salvar, então rejeita sem revelar dados do imóvel.
  - Dadas duas seleções rápidas de imóvel, quando a primeira consulta terminar por último, então não substitui contexto da segunda.
- **Definição de pronto:** fluxo validado para competência livre, valores e meses de borda, ausência de imóveis, autorização, falhas e preenchimento por teclado/celular. Dados salvos conferem com histórico e painel. A liberação do atalho depende também da Spec 02.
- **Dependências:** nenhuma spec nova anterior; depende funcionalmente do acesso autenticado, carteira e registro mensal existentes.
- **Fora do escopo desta spec:** atualizar lançamento pendente/em atraso, detalhado na Spec 02; pagamentos parciais, comprovantes e processamento de dinheiro.

### Spec 02 — Conclusão de pendências, conflitos e integração financeira

- **Fase:** 1 — Recebimentos pelo dashboard.
- **Objetivo (o quê):** concluir lançamentos pendentes/em atraso pelo diálogo e impedir duplicação ou sobrescrita indevida quando a competência já existir.
- **Intenção (por quê):** permitir registrar recebimento de um aluguel previamente acompanhado sem excluir/recriar o lançamento nem distorcer indicadores.
- **Contexto:** usa o diálogo da Spec 01 e a restrição existente de um lançamento por imóvel/mês. Introduz mudança controlada para recebido; não cria edição genérica de rendimentos.
- **Atores:** usuário autenticado; outros acessos da mesma conta podem gerar conflitos simultâneos.
- **Descrição do comportamento:** ao consultar competência pendente/em atraso, mostrar situação e valor existentes, sugerindo esse valor no formulário. Usuário pode alterar valor. Ao solicitar conclusão, apresentar confirmação com imóvel, mês, valor anterior e valor final. Confirmar altera o mesmo lançamento para recebido; cancelar não altera nada. Competência já recebida bloqueia nova operação e informa registro existente. Antes de salvar, revalidar estado consultado. Qualquer mudança concorrente exige nova revisão, sem conclusão automática de um registro não confirmado. Ao concluir, atualizar total recebido, quantidade de pendências e resumo do imóvel nos períodos aplicáveis.
- **Entradas e saídas:** entram contexto do lançamento, valor final e confirmação explícita; saem mesmo lançamento em situação recebida, contagem financeira atualizada ou mensagem de conflito/bloqueio.
- **Dados/entidades envolvidos (conceitual):** rendimento existente com competência, valor e situação; imóvel elegível; indicadores da conta e histórico por imóvel.
- **Estados e transições:** pendente/em atraso → revisando recebimento → aguardando confirmação → recebido. Cancelamento retorna à revisão sem alterar registro. Recebido é estado bloqueado para nova alteração pelo atalho. Conflito interrompe salvamento e apresenta estado atualizado. O diálogo também trata competência livre que deixou de estar livre e registro existente que foi removido.
- **Regras de negócio:** G01–G05 e P01–P14. Manter imóvel, competência e identidade do lançamento; somente valor confirmado e situação mudam. Um mês recebido não pode ser sobrescrito pelo atalho. Tentativas simultâneas não podem produzir mais de um recebimento ou aplicar valor de confirmação desatualizada.
- **Validações:** todas da Spec 01; conferir que lançamento pertence ao imóvel e à conta; validar valor final; conferir que situação e valor anteriores ainda correspondem ao que o usuário revisou. Revalidar autorização e elegibilidade mesmo quando registro já existe.
- **Fluxo do usuário (passo a passo):**
  1. Selecionar imóvel e mês com pendência.
  2. Conferir valor existente e ajustar se necessário.
  3. Solicitar marcar como recebido.
  4. Conferir resumo e confirmar.
  5. Ver situação recebida e indicadores atualizados.
- **Casos de borda e erros:** cancelar confirmação não altera estado; registro já recebido mostra bloqueio; concorrência que altera valor/situação exige nova revisão; registro removido exige revisão como competência livre; perda de rede após confirmação exige reconciliar resultado antes de repetir; falha de atualização preserva registro anterior; valor superior/inferior ao aluguel cadastrado é permitido dentro dos limites, sem alterar imóvel; falha ao atualizar visualização do painel após gravação não transforma sucesso confirmado em convite para registrar novamente — informar que o pagamento foi salvo e oferecer atualizar a visualização.
- **Impacto no existente:** reduz necessidade de excluir/recriar uma pendência; reutiliza o histórico atual. Contador de pendentes/em atraso diminui em um na conclusão, e total recebido aumenta pelo valor confirmado, conforme o período. Não altera regras gerais de cálculo, contratos nem valor mensal do imóvel.
- **Critérios de aceite (Dado/Quando/Então):**
  - Dado lançamento pendente de R$ 1.000, quando confirmar recebimento de R$ 950, então o mesmo lançamento fica recebido por R$ 950 e não surge outro registro.
  - Dado lançamento em atraso, quando cancelar a confirmação, então situação e valor permanecem iguais.
  - Dado mês já recebido, quando selecioná-lo, então informar mês/valor e impedir duplicação ou alteração pelo atalho.
  - Dado lançamento alterado em outro acesso após revisão, quando confirmar, então rejeitar confirmação antiga e mostrar estado atualizado para nova revisão.
  - Dada competência livre que ganhou pendência durante o envio, quando salvar, então exigir confirmação dessa pendência antes de concluí-la.
  - Dadas duas solicitações simultâneas para o mesmo mês, quando terminarem, então existe somente um lançamento e não há contagem dupla.
  - Dado mês atual com uma pendência, quando concluir, então contador de pendências diminui uma unidade e total recebido aumenta uma única vez pelo valor final.
  - Dado recebimento de um mês diferente, quando concluir, então indicadores respeitam os períodos existentes e não o apresentam como recebido do mês atual.
- **Definição de pronto:** criação e conclusão verificadas em conjunto com a Spec 01, incluindo cancelamento, reenvio, concorrência, acesso indevido e conferência dos totais no dashboard e no detalhe.
- **Dependências:** Spec 01 — diálogo, seleção, validações e registro livre; histórico e resumos existentes.
- **Fora do escopo desta spec:** desfazer recebido, editar mês, dividir recebimentos, criar trilha de auditoria completa ou alterar globalmente os indicadores do produto.

### Spec 03 — Consulta e edição do perfil e contatos

- **Fase:** 2 — Perfil do usuário.
- **Objetivo (o quê):** disponibilizar **Meu perfil** com dados da conta e edição de nome, WhatsApp, Instagram e TikTok.
- **Intenção (por quê):** permitir manter identificação e contatos sem depender de alterações externas ao produto.
- **Contexto:** conta autenticada já possui e-mail, e perfil contém nome e telefone. A navegação exibe nome do usuário. Redes sociais e página de perfil são novas.
- **Atores:** usuário autenticado editando somente o próprio perfil.
- **Descrição do comportamento:** oferecer **Meu perfil** na área do usuário em desktop e celular. Carregar nome, e-mail e contatos existentes; e-mail é apenas informativo. Nome obrigatório e contatos opcionais editáveis. Exibir instrução para usar nome de usuário nas redes, aceitando `@` inicial. **Salvar alterações** valida e salva o conjunto. Sucesso atualiza página e nome exibido na navegação. Limpar contato opcional remove valor anterior. Sair sem salvar mantém os dados persistidos anteriores; não há salvamento automático.
- **Entradas e saídas:** entram dados existentes e alterações de nome/contatos; saem perfil atualizado e feedback. E-mail é lido da conta de acesso e não participa das alterações aceitas.
- **Dados/entidades envolvidos (conceitual):** perfil próprio com nome, telefone/WhatsApp e identificadores opcionais de Instagram/TikTok; conta com e-mail de acesso.
- **Estados e transições:** carregando → pronto → alterado → salvando → salvo. Dados inválidos retornam à edição com mensagens; falha de carregamento impede salvamento e oferece nova tentativa; falha de persistência mantém formulário preenchido e dados anteriores salvos.
- **Regras de negócio:** G01–G06 e U01–U10. Nome obrigatório de 2 a 120 caracteres; WhatsApp opcional com regra brasileira/internacional definida; redes opcionais com `@` inicial opcional e identificador local de 1 a 100 caracteres entre letras latinas, números, ponto e sublinhado. E-mail, senha e foto de perfil não são editáveis nesta entrega.
- **Validações:** aplicar no servidor titularidade, limites, caracteres e formato de cada campo. Telefone nacional sem DDI exige DDD e 10/11 dígitos; com `+`, de 8 a 15 dígitos e primeiro diferente de zero. Rejeitar links completos de redes e orientar uso do nome de usuário. Campos extras não autorizam alteração de identidade, e-mail ou perfil alheio.
- **Fluxo do usuário (passo a passo):**
  1. Abrir **Meu perfil**.
  2. Conferir dados e e-mail exibidos.
  3. Editar nome e contatos, ou limpar opcionais.
  4. Salvar e corrigir eventuais erros.
  5. Ver confirmação e nome atualizado; reencontrar valores após novo acesso.
- **Casos de borda e erros:** perfil ausente/falha de consulta não simula dados vazios; contatos ausentes são normais; nome composto e acentos são aceitos; entrada só com espaços é vazia; `@` isolado é inválido; link de rede completo gera orientação específica; dados antigos incompatíveis ficam visíveis e exigem correção, sem limpeza silenciosa; sessão expirada impede alteração; falha em um campo impede salvar parcialmente os outros; resposta de rede incerta é resolvida consultando perfil salvo antes de informar resultado definitivo.
- **Impacto no existente:** expande perfil, preserva telefone já cadastrado e e-mail de acesso; atualiza identificação visual do usuário. Não modifica dados das partes em contratos já gerados nem altera documentos históricos.
- **Critérios de aceite (Dado/Quando/Então):**
  - Dada conta antiga com telefone, quando abrir perfil, então exibe esse telefone e deixa redes não cadastradas vazias.
  - Dado nome válido e contatos vazios, quando salvar, então salva nome e mantém contatos opcionais vazios.
  - Dado Instagram salvo, quando limpar campo e salvar, então valor anterior é removido e continua vazio após novo acesso.
  - Dado `@meu_perfil`, quando salvar, então trata `@` como apresentação e conserva identificador sem duplicá-lo.
  - Dado link completo ou espaços internos no identificador, quando salvar, então rejeita campo e pede nome de usuário.
  - Dado telefone com letras ou sem quantidade de dígitos exigida, quando salvar, então rejeita sem salvar outros campos parcialmente.
  - Dada alteração válida de nome, quando salvar e recarregar, então navegação e perfil exibem o novo nome.
  - Dado envio manipulado com e-mail novo ou perfil alheio, quando tentar salvar, então e-mail não muda e dados alheios não são acessados/modificados.
- **Definição de pronto:** leitura, edição, remoção de opcionais, persistência, validação por campo, atualização do nome e isolamento entre duas contas verificados em desktop e celular.
- **Dependências:** nenhuma spec nova; depende do acesso autenticado, perfil e navegação existentes.
- **Fora do escopo desta spec:** perfil público, redes verificadas, mensagens automáticas, mudanças de credenciais, foto de perfil e preenchimento automático das partes de contratos.

### Spec 04 — Seleção, validação e salvamento de fotos no cadastro

- **Fase:** 3 — Fotos privadas dos imóveis.
- **Objetivo (o quê):** permitir cadastrar imóvel com zero a dez fotos PNG/JPEG de até 3 MB cada, com prévia e validação efetiva dos arquivos.
- **Intenção (por quê):** acrescentar identificação visual sem tornar fotos obrigatórias ou aceitar arquivos incompatíveis com o produto.
- **Contexto:** cadastro de imóvel já funciona com dados e valores, sem imagens. Todos os campos e regras atuais continuam aplicáveis.
- **Atores:** usuário autenticado cadastrando imóvel na própria carteira.
- **Descrição do comportamento:** acrescentar seção **Fotos do imóvel** com formatos, limite individual de 3 MB, máximo de dez e indicação de campo opcional. Permitir selecionar vários arquivos e adicionar novos em seleções sucessivas. Validar cada arquivo, exibir prévia/identificação e informar rejeições. Manter contador do conjunto válido. Usuário remove selecionados antes de salvar. Confirmar **Cadastrar imóvel** salva dados e fotos aceitas como um conjunto consistente, sem sucesso parcial. Cancelar não cria imóvel nem fotos vinculadas. Cadastros sem fotos seguem funcionando.
- **Entradas e saídas:** entram dados atuais do imóvel e arquivos selecionados pelo usuário; saem imóvel cadastrado com conjunto privado de fotos aceitas ou mensagens específicas de erro. Não há entrada por link externo.
- **Dados/entidades envolvidos (conceitual):** imóvel; foto associada ao imóvel e à conta, com identidade, formato, tamanho e ordem de adição; seleção temporária ainda não confirmada.
- **Estados e transições:** sem seleção → validando seleção → fotos aceitas/prontas; rejeitados ficam fora da seleção com mensagem. Pronto → salvando → confirmado. Falha retorna ao formulário; seleção abandonada não se torna foto persistida do imóvel. Remover seleção reduz contador antes de salvar.
- **Regras de negócio:** G01–G06 e F01–F14. Zero a dez fotos; 1 a 3.000.000 bytes por arquivo; extensões PNG/JPG/JPEG correspondentes ao conteúdo; tamanho exatamente no limite permitido. Não há compressão automática para aceitar arquivo acima do limite. Nome ou declaração de formato sozinhos não aprovam arquivo.
- **Validações:** aplicar no servidor tamanho real, quantidade, extensão, conteúdo PNG/JPEG decodificável, correspondência entre extensão e formato, autorização e regras cadastrais do imóvel. Invalidar arquivos vazios, truncados/corrompidos e renomeados de outro formato. Antecipar validação local para feedback. Considerar requisições manipuladas e arquivos que passam na interface mas falham na verificação efetiva.
- **Fluxo do usuário (passo a passo):**
  1. Preencher dados do imóvel.
  2. Selecionar fotos opcionais.
  3. Conferir prévias, contador e rejeições.
  4. Remover ou substituir arquivos se necessário.
  5. Cadastrar e abrir detalhe do imóvel confirmado.
- **Casos de borda e erros:** seleção mista mantém válidos e identifica rejeitados; novo grupo válido que excede vagas não é incorporado, preservando seleção anterior; falha de validação no servidor mantém formulário e indica arquivo, sem concluir cadastro parcialmente; erro de envio/persistência mantém possibilidade de tentar novamente sem duplicar imóvel/fotos; ao recarregar página pode ser necessário selecionar arquivos novamente, mas registros incompletos não devem aparecer como concluídos; duplo clique deve produzir um único cadastro; dez arquivos no limite devem ser suportados pelo fluxo; falha de prévia não substitui validação real.
- **Impacto no existente:** amplia cadastro sem exigir foto em imóveis novos ou antigos; mantém obrigatoriedade condicional de valores por finalidade. Não inclui fotos em contratos nem na listagem.
- **Critérios de aceite (Dado/Quando/Então):**
  - Dado cadastro válido sem fotos, quando confirmar, então salva normalmente.
  - Dadas dez imagens válidas de 3.000.000 bytes cada, quando cadastrar, então salva dez fotos privadas associadas a um único imóvel.
  - Dado arquivo com 3.000.001 bytes, quando selecionar/enviar, então rejeita por tamanho e identifica arquivo.
  - Dado conteúdo de outro formato renomeado para `.jpg`, quando validar no servidor, então rejeita mesmo que a interface tenha permitido envio.
  - Dado arquivo PNG corrompido ou vazio, quando enviar, então rejeita por conteúdo/integridade.
  - Dadas oito fotos selecionadas e novo grupo de três válidas, quando adicionar, então mantém as oito anteriores, rejeita incorporação do grupo e informa duas vagas.
  - Dada seleção de duas válidas e uma inválida dentro do limite, quando validar, então mantém duas válidas e identifica a inválida sem ocultar rejeição.
  - Dada falha após parte dos envios, quando tentar novamente, então não duplica imóvel/fotos nem mostra conjunto incompleto como sucesso.
  - Dada seleção ainda não salva, quando cancelar, então nenhum imóvel nem foto vinculada é criado.
- **Definição de pronto:** cadastro com zero, uma e dez fotos, limites exatos, arquivos fraudulentos/corrompidos, falhas e reenvio validados; conjunto privado confirmado sem duplicação. Liberação ao usuário depende das Specs 05 e 06.
- **Dependências:** nenhuma spec nova anterior; cadastro e autorização de imóveis existentes. Aplicar desde esta spec as regras comuns F09–F13 de persistência e acesso privado. A fase de fotos só será liberada após conclusão das Specs 04–06.
- **Fora do escopo desta spec:** manutenção de fotos já salvas, visualização final completa, escolha de capa, edição/compressão de imagem e formatos adicionais.

### Spec 05 — Manutenção de fotos na edição

- **Fase:** 3 — Fotos privadas dos imóveis.
- **Objetivo (o quê):** adicionar e remover fotos de imóveis próprios, incluindo os cadastrados antes desta entrega.
- **Intenção (por quê):** permitir corrigir e atualizar o registro visual ao longo do uso, sem precisar excluir ou recriar o imóvel.
- **Contexto:** usa edição existente e regras/seleção da Spec 04. Fotos não são obrigatórias e o limite total permanece dez.
- **Atores:** usuário autenticado editando imóvel da própria carteira.
- **Descrição do comportamento:** carregar fotos existentes na edição e mostrar seleção resultante. Permitir marcar foto existente para remoção e desfazer essa marca antes de salvar; fotos novas podem ser removidas da seleção. Adicionar novas seguindo validações da Spec 04. Contador considera mantidas mais novas. Ao salvar, confirmar dados e conjunto de fotos como uma alteração consistente; no sucesso, refletir no detalhe. Cancelar preserva dados e fotos anteriores. A remoção é confirmada por **Salvar alterações**, com indicação clara das fotos marcadas para excluir.
- **Entradas e saídas:** entram fotos existentes, novos arquivos e marcações de remoção; saem conjunto atualizado e feedback, ou estado anterior preservado em erro/cancelamento.
- **Dados/entidades envolvidos (conceitual):** imóvel existente; fotos mantidas, marcadas para remoção e novas; ordem de adição e autorização da conta.
- **Estados e transições:** carregando → coleção atual → coleção modificada → salvando → coleção confirmada. Desfazer marcação retorna foto a mantida; cancelar retorna à coleção persistida; conflito interrompe operação e exige recarregar/revisar. Foto marcada só perde acesso após confirmação do salvamento.
- **Regras de negócio:** G01–G06 e F01–F18. Total resultante entre zero e dez; arquivos novos obedecem exatamente ao limite individual e formato da Spec 04. Remoções não afetam outras fotos ou imóveis. Manter ordem das fotos restantes e acrescentar novas ao final.
- **Validações:** além dos novos arquivos, verificar que cada foto removida pertence ao imóvel e à conta, que o imóvel continua disponível para edição e que coleção não foi modificada de forma conflitante. Recontar resultado no servidor; não confiar na quantidade ou associação informada pelo cliente.
- **Fluxo do usuário (passo a passo):**
  1. Abrir edição e consultar fotos existentes.
  2. Marcar remoções ou acrescentar fotos.
  3. Conferir contador, prévias e marcas de exclusão.
  4. Salvar conjunto final.
  5. Consultar detalhe atualizado ou resolver erro informado.
- **Casos de borda e erros:** imóvel antigo sem fotos aceita primeiro envio; remover todas mantém cadastro válido sem fotos; com dez existentes, remover uma e adicionar uma é permitido; desfazer remoção que levaria total acima de dez exige retirar uma nova foto antes, sem descartar arquivo automaticamente; falha ao carregar coleção não apresenta contagem zero como se não existissem fotos; falha de envio preserva fotos anteriores e dados persistidos; exclusão do imóvel durante edição bloqueia salvamento; mudanças concorrentes exigem revisão e não podem excluir fotos não vistas pelo usuário; nova tentativa não duplica conjunto.
- **Impacto no existente:** amplia edição mantendo campos atuais e compatibilidade com imóveis antigos. Nenhuma alteração em contratos ou rendimentos; exclusão de foto não significa exclusão de imóvel.
- **Critérios de aceite (Dado/Quando/Então):**
  - Dado imóvel antigo sem fotos, quando adicionar imagem válida e salvar, então imagem fica associada a ele.
  - Dadas dez fotos, quando marcar uma para remover e adicionar uma válida, então total final permanece dez e o salvamento é permitido.
  - Dada foto marcada para remover, quando cancelar edição, então ela permanece salva e acessível ao dono.
  - Dadas todas as fotos marcadas, quando salvar, então imóvel permanece válido sem fotos.
  - Dada falha no envio de uma foto nova, quando salvamento falhar, então fotos e dados anteriores permanecem e não há sucesso parcial.
  - Dado identificador de foto alheia manipulado, quando solicitar remoção, então operação não remove nem revela essa foto.
  - Dadas duas edições simultâneas da coleção, quando ocorrer conflito, então segunda alteração exige revisão e nunca ultrapassa dez fotos nem remove silenciosamente fotos novas do outro acesso.
  - Dado salvamento repetido após conexão instável, quando verificar resultado, então coleção não contém duplicatas causadas pelo reenvio.
- **Definição de pronto:** adição, remoção, cancelamento, coleção vazia, limite resultante, titularidade, falhas e conflitos verificados; detalhe atualizado após sucesso, com dados anteriores preservados em erro.
- **Dependências:** Spec 04 — regras e seleção de arquivos, associação privada e salvamento; edição de imóvel existente. A retirada de acesso após remoção é obrigatória nesta spec; sua integração com a visualização será verificada na Spec 06.
- **Fora do escopo desta spec:** substituição com editor de imagem, ordenação manual, desfazer remoção após salvamento, lixeira e edição em lote de imóveis.

### Spec 06 — Visualização privada e ciclo de acesso das fotos

- **Fase:** 3 — Fotos privadas dos imóveis.
- **Objetivo (o quê):** exibir fotos no detalhe privado e garantir que acesso e remoção respeitem conta, imóvel e estado atual da coleção.
- **Intenção (por quê):** tornar o registro visual útil sem transformar imagens privadas em arquivos públicos ou deixar arquivos sem vínculo acessíveis.
- **Contexto:** cadastro/edição passam a associar fotos ao imóvel. O detalhe já reúne dados, rendimentos e contratos; exclusão do imóvel preserva contratos e históricos.
- **Atores:** dono autenticado do imóvel; usuários não autenticados ou de outra conta devem ter acesso negado.
- **Descrição do comportamento:** mostrar seção **Fotos do imóvel** com imagens confirmadas na ordem de adição, dimensionadas para consulta em desktop/celular sem deformação e sem impedir acesso aos demais dados. Usar identificação textual acessível de imóvel e posição da foto. Sem fotos, mostrar orientação discreta para adicionar pela edição. Imagens são privadas em toda consulta; conhecer endereço de arquivo ou identificador não concede acesso a terceiros. Remoção confirmada retira foto da coleção e do acesso autorizado futuro. Exclusão do imóvel impede consulta/envio de fotos; arquivos temporários abandonados ou de operações falhas não ficam disponíveis como conteúdo público ou de outro imóvel.
- **Entradas e saídas:** entram imóvel próprio e coleção confirmada; saem imagens consultáveis ou estados de vazio/erro. A saída nunca inclui coleção de outro usuário ou fotos não confirmadas.
- **Dados/entidades envolvidos (conceitual):** imóvel e estado de exclusão; conta titular; fotos vinculadas e ordem; arquivos temporários sem publicação; autorização para consultar cada imagem.
- **Estados e transições:** carregando → coleção exibida/sem fotos/erro. Foto confirmada e imóvel ativo permitem acesso; remoção ou exclusão retiram acesso para novas consultas. Arquivo temporário passa a vinculado somente após salvamento concluído, ou é descartado se a operação for abandonada/falhar. Limpeza física pendente não restabelece acesso.
- **Regras de negócio:** G01–G06 e F08–F18. Somente dono autenticado; fotos não entram em listagem, PDF, marketing ou perfil público. Nenhuma URL pública permanente. Retirada de acesso vale para novas consultas pelo produto; não se promete apagar cópias que o próprio usuário já tenha baixado ou visualizado. Preservar contratos e rendimentos ao excluir imóvel.
- **Validações:** em consulta, confirmar sessão, titularidade, vínculo e estado acessível da foto e do imóvel. Em limpeza/remoção, restringir ao conteúdo correspondente, sem afetar fotos de outros imóveis ou documentos. Arquivos incompletos não aparecem na coleção confirmada.
- **Fluxo do usuário (passo a passo):**
  1. Abrir detalhe do próprio imóvel.
  2. Consultar fotos ou orientação de ausência.
  3. Acessar edição para manutenção quando desejado.
  4. Retornar e ver apenas o conjunto confirmado atualizado.
- **Casos de borda e erros:** imagem indisponível exibe mensagem própria sem esconder dados/rendimentos/contratos; falha de coleção não se confunde com zero fotos; logout/sessão expirada impede novas consultas; acesso a imóvel excluído ou alheio apresenta resposta neutra sem metadados; foto removida deixa de responder a novos acessos autorizados; limpeza física falha não torna arquivo público; abandonar cadastro ou edição não cria fotos órfãs acessíveis; nome de arquivo estranho não é interpretado como conteúdo executável nem determina autorização.
- **Impacto no existente:** acrescenta seção visual ao detalhe e controle de ciclo dos arquivos; contratos continuam preservados e disponíveis conforme regras existentes; imóveis sem fotos e consulta de rendimentos permanecem funcionais.
- **Critérios de aceite (Dado/Quando/Então):**
  - Dado imóvel com fotos confirmadas, quando dono abrir detalhe, então vê coleção na ordem de adição sem perder acesso aos demais dados.
  - Dado imóvel sem fotos, quando abrir detalhe, então vê estado vazio e acesso à edição, sem indicação falsa de erro.
  - Dada sessão de outra conta ou visitante sem login, quando tentar abrir imagem por referência conhecida, então acesso é negado sem conteúdo ou metadados privados.
  - Dada foto removida com sucesso, quando ocorrer nova consulta, então arquivo não fica acessível pelo produto.
  - Dado imóvel excluído, quando tentar consultar/enviar fotos, então acesso é bloqueado e contratos previamente gerados permanecem preservados.
  - Dada imagem temporariamente indisponível, quando abrir detalhe, então informa falha dessa imagem e mantém cadastro, rendimentos e contratos consultáveis.
  - Dado envio abandonado ou falho, quando consultar coleção, então foto temporária não aparece e não pode ser acessada publicamente.
  - Dada sessão encerrada, quando tentar nova consulta de imagem privada, então sessão anterior não concede novo acesso.
- **Definição de pronto:** galeria, ausência de fotos, falhas parciais de leitura, acesso entre duas contas, sessão encerrada, remoção e exclusão de imóvel verificados; nenhuma coleção pública ou arquivo temporário acessível sem autorização.
- **Dependências:** Spec 04 — fotos confirmadas no cadastro; Spec 05 — remoções e adições na edição; detalhe e exclusão de imóvel existentes. Esta spec verifica e completa o ciclo de acesso exigido desde as specs anteriores.
- **Fora do escopo desta spec:** zoom/editor avançado, compartilhamento, exportação, fotos em outras telas e eliminação de cópias já obtidas legitimamente pelo usuário.

### Spec 07 — Aceite integrado e preservação dos fluxos existentes

- **Fase:** 4 — Validação integrada.
- **Objetivo (o quê):** validar as três frentes em conjunto e assegurar que atendem requisitos de isolamento, consistência, recuperação de falhas e usabilidade.
- **Intenção (por quê):** evitar entregar fluxos que funcionam isoladamente, mas duplicam recebimentos, expõem fotos ou quebram operações existentes.
- **Contexto:** Specs 01–06 implementam o recorte. O Imobe já possui cadastro/edição/exclusão de imóveis, rendimentos, contratos e navegação privada que devem continuar operacionais.
- **Atores:** usuário autenticado em desktop/celular; segundo usuário independente; mesma conta em dois acessos; usuário com sessão expirada.
- **Descrição do comportamento:** validar jornadas completas de recebimento, perfil e fotos, incluindo reabertura, atualização de totais, consultas em novo acesso e tentativas simultâneas. Verificar interação por teclado, foco no diálogo, retorno ao botão que o abriu, mensagens associadas aos campos e acesso aos controles sem depender de passar mouse. Testar autorização também fora dos controles visuais. Validar estados de carregamento, vazio e erro e recuperação de conexão sem duplicação. Correções necessárias devem respeitar escopo e critérios das specs responsáveis.
- **Entradas e saídas:** entram cenários, contas isoladas, imóveis de diferentes finalidades, competências livres/pendentes/recebidas, perfis antigos e arquivos válidos/inválidos; saem evidências verificáveis de aceite ou problemas associados às specs correspondentes.
- **Dados/entidades envolvidos (conceitual):** todas as entidades das Specs 01–06; não introduz nova entidade de produto.
- **Estados e transições:** não cria estados novos; verifica as transições de sucesso, cancelamento, erro, conflito, expiração e remoção já definidas.
- **Regras de negócio:** nenhuma regra nova. Aplicar G01–G06, P01–P15, U01–U10 e F01–F18, sem relaxar validação para passar os cenários.
- **Validações:** provar isolamento entre usuários; pagamento único por competência; ausência de sobrescrita concorrente; persistência de opcionais vazios; limite individual e total de fotos; conteúdo real validado; inexistência de acesso público; coerência de dados após falha/reenvio.
- **Fluxo do usuário (passo a passo):**
  1. Entrar, editar perfil e verificar nome/contatos após novo acesso.
  2. Cadastrar imóvel com fotos e consultar detalhe.
  3. Registrar recebimento pelo dashboard e conferir histórico/totais.
  4. Concluir uma pendência e verificar ausência de duplicação.
  5. Editar fotos, cancelar e depois salvar remoção/adição.
  6. Repetir cenários relevantes com duas contas, dois acessos e falhas controladas.
- **Casos de borda e erros:** envio manipulado, sessão expirada, duplo clique, resposta perdida após gravação, alteração concorrente, arquivo válido no limite e inválido um byte acima, foto renomeada, galeria inacessível, perfil ausente e dashboard sem imóveis. Erros devem manter recuperabilidade conforme a spec afetada.
- **Impacto no existente:** confirmar funcionamento de cadastro sem fotos, edição de finalidade, exclusão de rendimento, filtros e totais, geração/download de contratos e navegação. Não transformar esta fase em reformulação visual ou funcional geral.
- **Critérios de aceite (Dado/Quando/Então):**
  - Dadas duas contas com imóveis/fotos próprios, quando uma tentar acessar dados da outra, então não consegue ler ou alterar conteúdo privado.
  - Dada navegação por teclado, quando abrir e fechar o diálogo de pagamento, então foco permanece utilizável e retorna ao acionador ao fechar.
  - Dada tela de celular, quando executar as três jornadas, então campos, fotos, mensagens e ações permanecem utilizáveis sem rolagem horizontal obrigatória.
  - Dada perda de resposta após gravação, quando retomar cada fluxo, então resultado é reconciliado sem duplicação nem perda de dados já confirmados.
  - Dadas fotos inválidas enviadas contornando a interface, quando servidor processar, então rejeita conforme regras de conteúdo, tamanho e quantidade.
  - Dado imóvel com contrato existente, quando editar/remover fotos e depois excluir imóvel, então contrato continua disponível conforme comportamento anterior.
  - Dado lançamento registrado pelo novo atalho, quando usar filtro e exclusão existentes, então histórico e totais respondem como para os demais lançamentos.
- **Definição de pronto:** todos os critérios gerais e das Specs 01–06 atendidos, com evidências de cenários felizes, erros, bordas, acesso entre contas e concorrência. Qualquer pendência de privacidade, duplicação financeira ou validação de upload impede considerar a entrega concluída e precisa ser resolvida antes do aceite.
- **Dependências:** Specs 01–06 concluídas para verificação integrada.
- **Fora do escopo desta spec:** novas funcionalidades, reformulação do produto, otimizações sem relação com os cenários e auditoria geral fora deste recorte.

## 14. Ordem recomendada de implementação

1. **Spec 01 — Diálogo e registro de recebimento em competência livre.** Estabelece entrada e reaproveitamento do histórico existente.
2. **Spec 02 — Conclusão de pendências, conflitos e integração financeira.** Completa comportamento obrigatório do atalho antes da liberação.
3. **Spec 03 — Consulta e edição do perfil e contatos.** Entrega manutenção da conta, sem depender de pagamento ou fotos.
4. **Spec 04 — Seleção, validação e salvamento de fotos no cadastro.** Estabelece entrada de imagens e regras comuns de arquivos.
5. **Spec 05 — Manutenção de fotos na edição.** Acrescenta ciclo de atualização sobre as fotos confirmadas.
6. **Spec 06 — Visualização privada e ciclo de acesso das fotos.** Completa consulta e retirada de acesso; concluir antes de liberar fotos ao usuário.
7. **Spec 07 — Aceite integrado e preservação dos fluxos existentes.** Valida o recorte completo e as interações com o produto atual.

Seguir essa ordem evita liberar fluxos incompletos e respeita as dependências. Regras comuns de autorização, validação e consistência valem desde a primeira spec; não devem ser adiadas para a fase final.

O perfil pode ser desenvolvido independentemente das demais frentes, mas compõe o mesmo recorte aprovado. A entrega só pode mudar de **Aguardando implementação** para **Implementada** quando todas as specs e seus critérios estiverem concluídos.
