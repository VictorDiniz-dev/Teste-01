# FluxoCRM

FluxoCRM é uma plataforma em evolução para autoatendimento, recebimento de solicitações e organização de agendas. O produto organiza o fluxo operacional entre quem solicita um serviço e o compromisso registrado na agenda:

**Cliente → Solicitação → Agendamento → Agenda**

O projeto começou como um protótipo de CRM tradicional. As telas atuais ainda refletem parte dessa origem, mas a documentação e as próximas evoluções passam a seguir a visão de plataforma de agenda e solicitações.

## Estado atual

- protótipo local construído com HTML, CSS e JavaScript puro;
- cinco páginas navegáveis: Dashboard, Clientes, Atendimentos, Agendamentos e Mensagens;
- módulo de Clientes com cadastro, validação, máscara de telefone, prevenção simples de duplicidade e persistência em `localStorage`;
- Dashboard, Atendimentos, Agendamentos e Mensagens alimentados por dados simulados;
- sem backend, banco de dados externo ou autenticação.

Os módulos oficiais do produto são **Visão Geral, Agenda, Solicitações, Clientes, Serviços e Configurações**. A interface atual ainda não foi reestruturada para representar essa organização.

## Como executar

Não há instalação de dependências ou etapa de build.

1. Clone ou baixe o repositório.
2. Abra `index.html` em um navegador moderno.
3. Navegue entre as páginas pelo menu da aplicação.

Como alternativa, sirva a pasta com um servidor HTTP local de sua preferência.

## Tecnologias

- HTML5;
- CSS3;
- JavaScript puro;
- `localStorage` para a persistência atual de clientes.

## Documentação principal

- [Documento Mestre](docs/DOCUMENTO_MESTRE.md): fonte principal da verdade sobre produto, módulos, entidades e regras de negócio;
- [Arquitetura](docs/ARQUITETURA.md): estado técnico atual, persistência, fluxo de dados e direção de evolução;
- [Roadmap](docs/ROADMAP.md): entregas concluídas, em andamento, próximas e futuras;
- [Registro de Desenvolvimento](docs/REGISTRO_DESENVOLVIMENTO.md): histórico cronológico das decisões e mudanças.

Os demais arquivos em `docs/` são registros históricos ou materiais auxiliares. Quando houver divergência, prevalece o `DOCUMENTO_MESTRE.md`.
