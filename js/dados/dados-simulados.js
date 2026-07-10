(function (FluxoCRM) {
  const { gerarIdCliente } = FluxoCRM.compartilhado;

  FluxoCRM.dados.clientesIniciais = [
    { id: gerarIdCliente(), nome: "Ana Souza", telefone: "(11) 99999-0101", origem: "WhatsApp", observacoes: "Quer agendar corte e hidratacao." },
    { id: gerarIdCliente(), nome: "Carlos Lima", telefone: "(21) 98888-0202", origem: "Instagram", observacoes: "Pediu orcamento de manutencao." },
    { id: gerarIdCliente(), nome: "Marina Costa", telefone: "(31) 97777-0303", origem: "Indicacao", observacoes: "Retornar no periodo da tarde." },
    { id: gerarIdCliente(), nome: "Roberto Alves", telefone: "(41) 96666-0404", origem: "Ligacao", observacoes: "Aguardando confirmacao de horario." }
  ];

  FluxoCRM.dados.atendimentos = [
    { cliente: "Ana Souza", etapa: "Novo contato", proximaAcao: "Enviar primeira resposta", dataRetorno: "Hoje, 14:00", responsavel: "Atendimento" },
    { cliente: "Carlos Lima", etapa: "Em atendimento", proximaAcao: "Confirmar detalhes do servico", dataRetorno: "Hoje, 16:30", responsavel: "Atendimento" },
    { cliente: "Marina Costa", etapa: "Aguardando cliente", proximaAcao: "Aguardar resposta sobre orcamento", dataRetorno: "Amanha, 10:00", responsavel: "Atendimento" },
    { cliente: "Roberto Alves", etapa: "Retorno futuro", proximaAcao: "Retomar conversa", dataRetorno: "12/07/2026", responsavel: "Atendimento" },
    { cliente: "Juliana Rocha", etapa: "Concluido", proximaAcao: "Nenhuma acao pendente", dataRetorno: "-", responsavel: "Atendimento" }
  ];

  FluxoCRM.dados.agendamentos = [
    { cliente: "Ana Souza", servico: "Corte e hidratacao", data: "08/07/2026", horario: "15:00", status: "Agendado" },
    { cliente: "Roberto Alves", servico: "Avaliacao tecnica", data: "08/07/2026", horario: "17:30", status: "Aguardando cliente" },
    { cliente: "Juliana Rocha", servico: "Consulta inicial", data: "09/07/2026", horario: "09:00", status: "Agendado" },
    { cliente: "Pedro Martins", servico: "Remarcacao", data: "10/07/2026", horario: "11:00", status: "Cancelado" }
  ];

  FluxoCRM.dados.mensagens = [
    { categoria: "Primeira resposta", titulo: "Boas-vindas", texto: "Ola! Recebemos seu contato e ja vamos te ajudar." },
    { categoria: "Confirmacao", titulo: "Confirmar agendamento", texto: "Seu horario esta confirmado. Qualquer mudanca, avise por aqui." },
    { categoria: "Lembrete", titulo: "Lembrete do compromisso", texto: "Passando para lembrar do seu atendimento agendado para hoje." },
    { categoria: "Remarcacao", titulo: "Propor novo horario", texto: "Podemos remarcar para outro horario disponivel. Qual fica melhor?" },
    { categoria: "Cancelamento", titulo: "Cancelamento registrado", texto: "Tudo bem, seu cancelamento foi registrado. Ficamos a disposicao." },
    { categoria: "Retorno", titulo: "Retomar atendimento", texto: "Ola! Estou retomando nosso contato conforme combinado." }
  ];
})(window.FluxoCRM);
