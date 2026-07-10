# Arquitetura do FluxoCRM

## Objetivo

Este documento descreve a arquitetura técnica existente e a direção planejada. Ele diferencia explicitamente o que funciona hoje do modelo futuro definido no Documento Mestre.

## Estrutura Atual

O FluxoCRM é um protótipo frontend estático, sem processo de build e sem dependências declaradas.

```text
FluxoCRM/
├── index.html
├── clientes.html
├── atendimentos.html
├── agendamentos.html
├── mensagens.html
├── css/
│   └── style.css
├── js/
│   └── app.js
├── assets/
└── docs/
```

- os arquivos HTML definem as páginas e as áreas preenchidas pelo JavaScript;
- `css/style.css` concentra apresentação e responsividade;
- `js/app.js` concentra dados, renderização, navegação mobile, validações e persistência de clientes;
- o atributo `data-page` do `body` determina qual função de renderização é executada;
- não há separação formal em camadas, módulos JavaScript, API, backend ou banco de dados.

As páginas atuais ainda usam a organização do protótipo de CRM. A arquitetura futura deverá seguir os módulos oficiais: Visão Geral, Agenda, Solicitações, Clientes, Serviços e Configurações.

## Persistência

### Implementação atual

Somente Clientes é persistido em `localStorage`, usando a chave:

```text
fluxocrm_clientes
```

O fluxo atual de inicialização é:

1. tentar ler e interpretar o conteúdo salvo;
2. validar se o valor é uma lista;
3. normalizar os registros válidos;
4. usar e salvar os clientes iniciais quando não houver registros válidos;
5. manter o protótipo em memória se a gravação falhar.

Os campos efetivamente persistidos hoje são `id`, `nome`, `telefone`, `origem` e `observacoes`. `email` e `dataCriacao` pertencem ao modelo conceitual futuro e ainda não estão implementados.

Dashboard, Atendimentos, Agendamentos e Mensagens usam arrays estáticos definidos em `js/app.js`. Esses dados não são uma fonte persistente nem devem ser tratados como registros reais.

### Limitações do `localStorage`

- dados restritos ao navegador e ao perfil local;
- ausência de sincronização entre dispositivos;
- ausência de controle de acesso;
- risco de perda quando o armazenamento do navegador é limpo;
- capacidade limitada de consultas, relacionamentos e concorrência;
- ausência de auditoria, backup centralizado e integridade referencial.

## Fluxo de Dados

### Fluxo existente

```text
localStorage ──→ clientes em memória ──→ tabela/formulário de Clientes

arrays estáticos ──→ Dashboard, Atendimentos, Agendamentos e Mensagens
```

As páginas compartilham o mesmo arquivo JavaScript, mas os módulos simulados não trocam informações entre si. Por exemplo, cadastrar um cliente não cria uma solicitação, não cria um agendamento e não atualiza de forma integrada os demais arrays.

### Fluxo desejado

```text
Cliente ──→ Solicitação ──→ Agendamento ──→ Agenda
   │              │                │
   └──────── Serviço ──────────────┘
```

- Clientes e Serviços fornecem os cadastros de referência;
- Solicitações registram a demanda e preferências do cliente;
- Agendamentos materializam solicitações aprovadas;
- Agenda consulta e organiza agendamentos por data, horário e status;
- Visão Geral agrega indicadores derivados dessas fontes;
- Configurações fornece regras de disponibilidade e operação.

## Entidades e Relacionamentos

```text
Cliente 1 ─── N Solicitação N ─── 1 Serviço
Cliente 1 ─── N Agendamento N ─── 1 Serviço
Solicitação 1 ─── 0..1 Agendamento
Agenda = visualização temporal de Agendamento
```

Os vínculos futuros devem usar IDs, não nomes ou posições em arrays. Essa escolha permite alterar dados descritivos sem quebrar relacionamentos.

### Responsabilidades

- **Cliente:** identidade e dados de contato;
- **Serviço:** definição do trabalho e de sua duração;
- **Solicitação:** intenção e preferências ainda sujeitas a análise;
- **Agendamento:** compromisso com data, horário e status;
- **Agenda:** consulta operacional dos agendamentos, sem armazenamento duplicado.

## Diretrizes para a Evolução Técnica

Antes de criar backend, a camada frontend deve evoluir para separar responsabilidades:

- modelos e validações de domínio;
- acesso a dados por meio de repositórios ou serviços;
- regras de disponibilidade e conversão de solicitação;
- renderização e eventos da interface;
- migração controlada dos dados locais.

A interface não deve acessar `localStorage` diretamente em vários pontos. Um contrato de repositório permite substituir o armazenamento local por API sem reescrever todas as telas.

## Evolução de `localStorage` para Backend

### Etapa 1 — estabilizar o modelo

- consolidar campos, IDs, status e regras de negócio;
- definir formatos de data e horário;
- manter compatibilidade com os clientes já armazenados;
- introduzir versão de esquema para migrações locais.

### Etapa 2 — criar uma camada de acesso a dados

- encapsular leitura e escrita em interfaces por entidade;
- retirar regras de negócio das funções de renderização;
- implementar Clientes, Serviços, Solicitações e Agendamentos sobre contratos consistentes.

### Etapa 3 — introduzir API e banco de dados

- criar endpoints para as entidades principais;
- usar banco com integridade referencial e índices para agenda;
- validar conflitos de horário no servidor;
- adicionar autenticação e autorização;
- registrar alterações relevantes para auditoria.

### Etapa 4 — migrar dados locais

- detectar registros existentes em `fluxocrm_clientes`;
- validar e normalizar antes do envio;
- importar de forma idempotente, evitando duplicidade;
- confirmar a migração antes de remover ou arquivar os dados locais;
- oferecer tratamento explícito para falhas parciais.

### Etapa 5 — integrações

- conectar canais de autoatendimento;
- integrar calendários e notificações quando houver necessidade validada;
- manter a API como fonte única da verdade;
- observar segurança, consentimento e proteção de dados pessoais.

## Requisitos Arquiteturais Futuros

- consistência transacional ao converter solicitações em agendamentos;
- prevenção de conflitos de agenda no backend;
- autenticação e isolamento dos dados por operação ou negócio;
- validação no cliente para experiência e no servidor para integridade;
- datas e horários tratados com fuso horário explícito;
- logs, backups e migrações versionadas;
- proteção adequada de telefone, e-mail e demais dados pessoais.

