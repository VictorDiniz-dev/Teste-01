# Regras de Negócio do FluxoCRM

## Propósito
Este documento define as regras básicas de operação do FluxoCRM para orientar a estrutura do produto e evitar ambiguidades no planejamento.

## Regras de clientes
- todo cliente deve possuir nome e telefone mínimos para cadastro;
- a origem do contato deve ser registrada para facilitar análise futura;
- observações podem complementar o histórico do cliente;
- o histórico deve registrar informações relevantes sobre interações e decisões.

## Regras de atendimentos
- cada atendimento deve estar ligado a um cliente;
- o atendimento deve possuir uma etapa atual definida;
- a etapa atual influencia a ação seguinte e a prioridade do follow-up;
- a próxima ação deve ser informada para evitar esquecimentos;
- a data de retorno deve ser utilizada para organização de contatos futuros.

## Regras de etapas
As etapas previstas devem seguir a lógica abaixo:
- Novo contato: indicação inicial de interesse ou primeira abordagem;
- Em atendimento: contato já está sendo tratado;
- Aguardando cliente: depende de resposta ou confirmação do cliente;
- Agendamento solicitado: existe intenção de marcar um compromisso;
- Agendado: o compromisso foi confirmado;
- Cancelado: o atendimento ou agendamento foi encerrado por cancelamento;
- Concluído: o atendimento chegou ao fim com sucesso;
- Perdido: a oportunidade não foi convertida;
- Retorno futuro: o contato deve ser revisitado em data posterior.

## Regras de agendamentos
- todo agendamento deve estar associado a um cliente;
- serviço, data, horário e status devem ser registrados;
- status deve refletir o estado atual do compromisso;
- alterações de data ou cancelamento devem ser registradas claramente.

## Regras de mensagens prontas
- mensagens prontas devem ser reutilizáveis em diferentes atendimentos;
- cada mensagem deve estar alinhada à etapa atual e ao contexto do contato;
- mensagens de confirmação, lembrete e cancelamento devem ser padronizadas.

## Regras de responsabilidade
- o responsável pelo atendimento deve estar explícito;
- a responsabilidade ajuda a evitar falhas de acompanhamento;
- em uma primeira fase, o sistema pode assumir um responsável único por atendimento.

## Decisões de escopo
- o fluxo será simples e organizado, sem regras complexas de automação;
- não serão previstos múltiplos níveis de permissão no MVP;
- não haverá integração com canais externos no início;
- prioridade será dada à consistência do processo e à clareza operacional.

## Próximo passo recomendado
Validar essas regras com um cenário real de negócio antes de transformar o planejamento em especificações técnicas.
