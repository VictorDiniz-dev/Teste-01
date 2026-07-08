# FluxoCRM

## Visão geral
FluxoCRM é um sistema de automação de atendimento e fluxo de clientes pensado para pequenos negócios que precisam organizar contatos recebidos por diferentes canais, como WhatsApp, Instagram, ligação e formulários.

O objetivo do projeto é transformar cada contato em um atendimento estruturado, com etapas claras, histórico e acompanhamento de retorno, reduzindo perdas e melhorando a experiência do cliente.

## Problema que resolve
Pequenos negócios frequentemente enfrentam:
- contatos dispersos em diferentes canais;
- perda de clientes por falta de organização;
- esquecimentos de retornos e follow-ups;
- ausência de histórico de conversas e decisões;
- atendimentos realizados de forma improvisada.

## Público-alvo
O produto inicial é voltado para negócios com atendimento direto e repetitivo, especialmente:
- barbearias;
- salões;
- clínicas pequenas;
- assistência técnica;
- manutenção;
- segurança eletrônica;
- professores particulares;
- consultorias locais.

## Conceito principal
Cada contato passa a ser tratado como um atendimento dentro de um fluxo, com etapas bem definidas e responsabilidade clara.

## Etapas do fluxo
As etapas iniciais previstas são:
- Novo contato
- Em atendimento
- Aguardando cliente
- Agendamento solicitado
- Agendado
- Cancelado
- Concluído
- Perdido
- Retorno futuro

## Escopo inicial do MVP
O MVP inicial contempla:
1. Dashboard
2. Cadastro de clientes
3. Gestão de atendimentos
4. Agendamentos
5. Mensagens prontas

## Estrutura inicial de dados
### Clientes
Campos previstos:
- nome
- telefone
- origem do contato
- observações
- histórico

### Atendimentos
Campos previstos:
- cliente
- tipo de interesse
- etapa atual
- responsável
- próxima ação
- data de retorno

### Agendamentos
Campos previstos:
- cliente
- serviço
- data
- horário
- status

### Mensagens prontas
Tipos previstos:
- primeira resposta
- confirmação de agendamento
- lembrete
- remarcação
- cancelamento
- retorno

## Fora do escopo inicial
O projeto não incluirá, no momento, os seguintes itens:
- IA atendendo sozinha
- WhatsApp Business API
- Instagram API
- Google Calendar
- múltiplos atendentes
- sistema financeiro
- SaaS multiempresa
- login avançado
- pagamentos

## Decisões de escopo
Para evitar crescimento desnecessário, o projeto seguirá as seguintes decisões:
- o foco inicial será em um fluxo simples e objetivo;
- a solução deve atender pequenos negócios sem complexidade excessiva;
- recursos avançados e integrações devem ser avaliados somente após validação do MVP;
- a prioridade é organizar processos básicos com clareza e consistência.

## Princípios de produto
- simplicidade acima de riqueza de recursos;
- organização do atendimento como prioridade central;
- rastreabilidade de contatos e ações;
- redução de esquecimentos e perdas de oportunidades;
- facilidade de uso para negócios com operação simples.

## Prótipo de valor
Com o MVP, o usuário deve conseguir:
- registrar contatos de forma organizada;
- acompanhar o progresso de cada oportunidade;
- agendar compromissos com controle básico;
- usar mensagens padronizadas para comunicação recorrente.

## Próximo passo recomendado
Definir o escopo detalhado do MVP com prioridade de funcionalidades, critérios de aceitação e regras de negócio antes de iniciar qualquer implementação.
