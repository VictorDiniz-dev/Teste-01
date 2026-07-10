# Documento Mestre do FluxoCRM

Este documento é a fonte principal da verdade do produto. Decisões futuras de produto, arquitetura e interface devem preservar as definições aqui consolidadas. Documentos marcados como legado servem apenas como histórico.

## Visão do Produto

### Definição

FluxoCRM é uma plataforma de autoatendimento, recebimento de solicitações e gerenciamento de agenda. Apesar do nome e da origem como protótipo de CRM, seu foco não é administrar oportunidades comerciais ou relacionamento de vendas. O foco é organizar o fluxo operacional que começa na necessidade de um cliente e termina em um compromisso visível e gerenciável na agenda.

### Problema resolvido

Pequenos negócios e profissionais que trabalham com horário marcado frequentemente recebem pedidos por canais dispersos, registram informações de maneira informal e dependem de controles manuais para confirmar horários. Isso provoca perda de solicitações, conflitos de agenda, esquecimentos e dificuldade para acompanhar o que ainda precisa ser organizado.

O FluxoCRM centraliza esse processo e torna explícita a passagem entre cliente, solicitação, agendamento e agenda.

### Proposta de valor

- receber e organizar solicitações de serviço;
- transformar solicitações aprovadas em agendamentos;
- apresentar os compromissos em uma agenda operacional;
- manter clientes e serviços como cadastros de apoio;
- reduzir perda de informações, retrabalho e conflitos de horário;
- preparar o produto para autoatendimento e integrações futuras.

### Público-alvo

Pequenos negócios e profissionais com operação baseada em solicitações e horários, como:

- barbearias e salões;
- clínicas e consultórios pequenos;
- assistência técnica e manutenção;
- prestadores de serviços locais;
- professores particulares;
- consultorias e profissionais autônomos.

### Objetivos

- oferecer um fluxo simples e compreensível desde a solicitação até a agenda;
- dar visibilidade às solicitações pendentes e aos horários confirmados;
- manter dados mínimos e consistentes de clientes e serviços;
- permitir evolução gradual sem adicionar complexidade prematura;
- criar uma base preparada para backend, autenticação e integrações futuras.

## Fluxo Principal

```text
Cliente → Solicitação → Agendamento → Agenda
```

1. **Cliente:** identifica quem precisa do serviço.
2. **Solicitação:** registra a intenção, o serviço desejado, preferências de data e horário e informações adicionais.
3. **Agendamento:** formaliza a solicitação quando data e horário são definidos ou confirmados.
4. **Agenda:** organiza e exibe os agendamentos para operação diária.

Nem toda solicitação precisa resultar em agendamento: ela pode ser recusada, cancelada ou permanecer pendente. A Agenda não é uma entidade separada de armazenamento no modelo inicial; é a organização temporal dos agendamentos.

## Módulos Oficiais

### Visão Geral

Apresenta indicadores operacionais e pendências relevantes, como solicitações aguardando análise, agendamentos próximos e distribuição de status. Substitui conceitualmente o Dashboard atual e, no futuro, deve usar dados reais dos demais módulos.

### Agenda

É o espaço operacional dos compromissos. Reúne visualização, criação, confirmação, remarcação, cancelamento e conclusão de agendamentos. Absorve o conceito da página atual de Agendamentos.

### Solicitações

Recebe e acompanha pedidos antes de eles se tornarem compromissos confirmados. Será a reinterpretação futura do módulo atual de Atendimentos, sem preservar obrigatoriamente seu modelo comercial anterior.

### Clientes

Mantém os dados das pessoas que fazem solicitações ou possuem agendamentos. É uma entidade de apoio ao fluxo operacional e representa a implementação mais madura do protótipo atual.

### Serviços

Define o catálogo do que pode ser solicitado e agendado, incluindo descrição, duração e disponibilidade para uso.

### Configurações

Concentra preferências operacionais futuras, como horários de funcionamento, intervalos, regras de disponibilidade e parâmetros do negócio.

### Correspondência com o protótipo atual

| Estrutura atual | Direção oficial |
| --- | --- |
| Dashboard | Passa a ser Visão Geral |
| Atendimentos | Será reinterpretado como Solicitações |
| Agendamentos | Será absorvido por Agenda |
| Clientes | Permanece como módulo de apoio |
| Mensagens | Deixa de ser módulo principal; pode virar recurso de apoio futuro |
| Serviços | Novo módulo oficial, ainda não implementado |
| Configurações | Novo módulo oficial, ainda não implementado |

Essa correspondência é conceitual. Nenhuma mudança de página ou funcionalidade foi realizada durante a consolidação documental.

## Entidades Principais

Os campos abaixo definem o modelo conceitual desejado. Eles não significam que todos já estejam implementados no código atual.

### Cliente

| Campo | Finalidade |
| --- | --- |
| `id` | Identificador único |
| `nome` | Nome do cliente |
| `telefone` | Telefone de contato |
| `email` | E-mail opcional |
| `observacoes` | Informações operacionais adicionais |
| `origem` | Canal ou fonte de entrada |
| `dataCriacao` | Data e hora de criação do cadastro |

### Serviço

| Campo | Finalidade |
| --- | --- |
| `id` | Identificador único |
| `nome` | Nome do serviço |
| `descricao` | Explicação opcional do serviço |
| `duracao` | Duração prevista, preferencialmente em minutos |
| `ativo` | Indica se o serviço pode ser usado em novas solicitações e agendamentos |

### Solicitação

| Campo | Finalidade |
| --- | --- |
| `id` | Identificador único |
| `clienteId` | Referência ao cliente |
| `servicoId` | Referência ao serviço |
| `dataDesejada` | Data preferida pelo cliente |
| `horarioDesejado` | Horário preferido pelo cliente |
| `observacoes` | Detalhes adicionais da necessidade |
| `origem` | Canal pelo qual a solicitação chegou |
| `status` | Estado atual da solicitação |

### Agendamento

| Campo | Finalidade |
| --- | --- |
| `id` | Identificador único |
| `clienteId` | Referência ao cliente |
| `servicoId` | Referência ao serviço |
| `data` | Data confirmada ou reservada |
| `horario` | Horário confirmado ou reservado |
| `status` | Estado atual do compromisso |
| `observacoes` | Informações operacionais adicionais |

### Relações

- um Cliente pode ter várias Solicitações;
- um Cliente pode ter vários Agendamentos;
- um Serviço pode aparecer em várias Solicitações e Agendamentos;
- uma Solicitação pode originar no máximo um Agendamento no modelo inicial;
- um Agendamento deve guardar vínculo com Cliente e Serviço;
- a Agenda é uma visualização organizada dos Agendamentos, não uma duplicação deles.

## Regras de Negócio

### Regras gerais

- o fluxo operacional oficial é Cliente → Solicitação → Agendamento → Agenda;
- identificadores devem ser únicos dentro de cada entidade;
- referências por `clienteId` e `servicoId` devem apontar para registros existentes;
- datas e horários devem usar formato consistente na camada de dados;
- a interface deve comunicar claramente estados pendentes, confirmados, cancelados e concluídos;
- exclusões e alterações que afetem vínculos devem preservar a consistência histórica.

### Clientes

- nome e telefone são obrigatórios no estágio atual;
- o telefone deve ser normalizado para validação e comparação;
- não deve haver duplicidade simples de cliente pelo mesmo telefone;
- e-mail, observações e origem podem complementar o cadastro;
- `dataCriacao` deve ser registrada quando o modelo for ampliado;
- clientes já vinculados a solicitações ou agendamentos não devem ser removidos sem tratamento dos vínculos.

### Serviços

- nome e duração devem ser definidos para serviços usados em novos agendamentos;
- a duração deve ser positiva;
- serviços inativos não podem ser selecionados em novas solicitações ou agendamentos;
- desativar um serviço não deve apagar registros históricos associados.

### Solicitações

- toda solicitação deve estar vinculada a um cliente e a um serviço válidos;
- a data e o horário desejados representam preferência até que haja confirmação;
- a origem deve registrar por qual canal a solicitação foi recebida quando essa informação estiver disponível;
- o status deve refletir o estado operacional da solicitação;
- status iniciais sugeridos são `nova`, `em_analise`, `aguardando_cliente`, `aprovada`, `recusada`, `cancelada` e `convertida`;
- somente uma solicitação aprovada pode ser convertida em agendamento;
- ao gerar um agendamento, a solicitação deve ficar marcada como convertida;
- solicitações recusadas ou canceladas não geram agendamento sem reabertura explícita.

### Agendamentos e Agenda

- todo agendamento deve estar vinculado a um cliente e a um serviço válidos;
- data e horário são obrigatórios;
- o sistema deve considerar a duração do serviço ao avaliar disponibilidade;
- não devem existir agendamentos ativos conflitantes no mesmo intervalo de tempo;
- status iniciais sugeridos são `pendente`, `confirmado`, `cancelado`, `concluido` e `nao_compareceu`;
- remarcações devem atualizar data e horário sem perder a identificação do compromisso;
- agendamentos cancelados deixam de ocupar disponibilidade, mas devem permanecer no histórico;
- a Agenda deve refletir os agendamentos e seus status, sem manter uma cópia independente dos dados.

### Visão Geral

- indicadores devem ser derivados das fontes reais de dados;
- dados simulados devem ser removidos somente quando os módulos correspondentes tiverem persistência implementada;
- contagens não devem misturar solicitações com agendamentos como se fossem a mesma entidade.

### Configurações

- horários de funcionamento e intervalos de indisponibilidade devem orientar a oferta de horários quando esse recurso for implementado;
- mudanças de configuração não devem alterar retroativamente agendamentos existentes sem uma ação explícita;
- regras configuráveis devem possuir valores padrão seguros.

## Estado Atual da Implementação

- existem cinco páginas HTML: `index.html`, `clientes.html`, `atendimentos.html`, `agendamentos.html` e `mensagens.html`;
- todas compartilham `css/style.css` e `js/app.js`;
- apenas Clientes possui persistência real, na chave `fluxocrm_clientes` do `localStorage`;
- Clientes possui cadastro, validação, máscara de telefone, prevenção simples de duplicidade e feedback;
- Dashboard, Atendimentos, Agendamentos e Mensagens usam dados simulados;
- Serviços, Solicitações e Configurações ainda não existem como módulos funcionais;
- não existe backend, banco de dados externo ou autenticação;
- os arrays simulados não formam ainda um fluxo de dados integrado.

## Limites do Escopo Atual

Esta consolidação não autoriza mudanças em páginas, componentes, layout ou funcionalidades. Agenda, Solicitações, Serviços e Visão Geral real pertencem às próximas etapas do roadmap e devem ser especificados antes da implementação.
