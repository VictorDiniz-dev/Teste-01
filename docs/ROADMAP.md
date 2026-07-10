# Roadmap do FluxoCRM

O roadmap segue a visão de plataforma de agenda e solicitações. A presença de uma tela no protótipo não significa que o módulo oficial correspondente esteja funcional.

## Concluído

- estrutura inicial do protótipo em HTML, CSS e JavaScript;
- navegação entre cinco páginas;
- layout responsivo compartilhado;
- renderização de telas com dados simulados;
- módulo de Clientes com cadastro;
- validação de nome e telefone;
- máscara de telefone;
- prevenção simples de duplicidade por telefone;
- persistência de clientes em `localStorage`;
- feedback visual no cadastro de clientes;
- diagnóstico do estado real do código;
- consolidação da nova visão do produto na documentação central.

## Em andamento

- reestruturação conceitual de CRM genérico para plataforma de agenda e solicitações;
- alinhamento da terminologia do produto ao fluxo Cliente → Solicitação → Agendamento → Agenda;
- preparação das regras e da arquitetura para a futura reestruturação técnica.

## Próximas etapas

As etapas abaixo ainda precisam de especificação e implementação. A ordem deve respeitar dependências de dados e regras de negócio.

### 1. Fundação de dados

- estabilizar o modelo de Cliente;
- definir formatos de IDs, datas, horários e status;
- criar o modelo e cadastro de Serviços;
- separar acesso a dados, regras e renderização.

### 2. Solicitações

- reinterpretar o fluxo atual de Atendimentos;
- cadastrar solicitações ligadas a Cliente e Serviço;
- controlar preferências de data e horário;
- implementar estados e conversão para agendamento.

### 3. Agenda e agendamentos

- absorver a página atual de Agendamentos no conceito de Agenda;
- criar agendamentos ligados a Cliente e Serviço;
- validar disponibilidade e conflitos;
- permitir confirmação, remarcação, cancelamento e conclusão;
- oferecer visualização operacional por período.

### 4. Visão Geral real

- substituir indicadores simulados por dados persistidos;
- exibir solicitações pendentes, agendamentos próximos e resumos por status;
- garantir que cada indicador tenha uma fonte de dados definida.

### 5. Configurações

- definir horários de funcionamento;
- configurar intervalos e indisponibilidades;
- estabelecer valores padrão e regras operacionais.

### 6. Qualidade da base local

- edição e exclusão segura de clientes;
- estados vazios e tratamento de erros;
- testes das regras principais;
- migração versionada dos dados locais quando o modelo mudar.

## Futuro

- backend e API;
- banco de dados com integridade referencial;
- autenticação e autorização;
- operação multiusuário ou multiempresa, se validada;
- sincronização entre dispositivos;
- integração com calendários;
- notificações e lembretes;
- integrações com canais de atendimento;
- chatbot e autoatendimento automatizado;
- auditoria, backup e observabilidade;
- adequação ampliada à proteção de dados pessoais.

## Fora da etapa documental atual

- implementar Agenda ou Solicitações;
- alterar páginas, navegação, componentes ou layout;
- substituir dados simulados;
- iniciar redesign visual;
- introduzir backend ou framework.

Esses itens devem ser executados somente em etapas próprias, com critérios de aceitação definidos.
