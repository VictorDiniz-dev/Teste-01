(function (FluxoCRM) {
  const solicitacoesRepository = FluxoCRM.repositories.solicitacoes;
  const clientesRepository = FluxoCRM.repositories.clientes;
  const servicosRepository = FluxoCRM.repositories.servicos;
  const agendamentosRepository = FluxoCRM.repositories.agendamentos;
  const modelo = FluxoCRM.modelos.solicitacao;
  const agendamentoModelo = FluxoCRM.modelos.agendamento;
  const { normalizarTexto } = FluxoCRM.compartilhado;
  const solicitacoes = solicitacoesRepository.listar();
  const clientes = clientesRepository.listar();
  const servicos = servicosRepository.listar();
  let idEmEdicao = null;
  let idEmConversao = null;

  function obterDataAtual() {
    const agora = new Date();
    const ano = agora.getFullYear();
    const mes = String(agora.getMonth() + 1).padStart(2, "0");
    const dia = String(agora.getDate()).padStart(2, "0");
    return `${ano}-${mes}-${dia}`;
  }

  function dataIsoValida(valor) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(valor)) return false;
    const [ano, mes, dia] = valor.split("-").map(Number);
    const data = new Date(ano, mes - 1, dia);
    return data.getFullYear() === ano && data.getMonth() === mes - 1 && data.getDate() === dia;
  }

  function formatarData(valor) {
    if (!dataIsoValida(valor)) return "Data inválida";
    const [ano, mes, dia] = valor.split("-");
    return `${dia}/${mes}/${ano}`;
  }

  function formatarDataHora(valor) {
    const data = new Date(valor);
    if (Number.isNaN(data.getTime())) return "Data não disponível";
    return new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "short",
      timeStyle: "short"
    }).format(data);
  }

  function mostrarFeedback(mensagem, tipo) {
    const feedback = document.getElementById("solicitacoes-feedback");
    feedback.textContent = mensagem;
    feedback.dataset.status = tipo;
  }

  function criarOpcao(valor, texto, desabilitada = false) {
    const opcao = document.createElement("option");
    opcao.value = valor;
    opcao.textContent = texto;
    opcao.disabled = desabilitada;
    return opcao;
  }

  function preencherClientes(clienteSelecionado = "") {
    const campo = document.getElementById("cliente-solicitacao");
    campo.replaceChildren(criarOpcao("", "Selecione um cliente"));
    clientes.forEach((cliente) => campo.appendChild(criarOpcao(cliente.id, cliente.nome)));
    campo.value = clienteSelecionado;
  }

  function preencherServicos(servicoSelecionado = "") {
    const campo = document.getElementById("servico-solicitacao");
    campo.replaceChildren(criarOpcao("", "Selecione um serviço"));

    servicos.filter((servico) => servico.ativo).forEach((servico) => {
      campo.appendChild(criarOpcao(servico.id, `${servico.nome} — ${servico.duracao} minutos`));
    });

    const atual = servicos.find((servico) => servico.id === servicoSelecionado);
    if (atual && !atual.ativo) {
      campo.appendChild(criarOpcao(atual.id, `${atual.nome} — inativo`));
    }
    campo.value = servicoSelecionado;
  }

  function atualizarPreRequisitos() {
    const aviso = document.getElementById("solicitacoes-pre-requisitos");
    const botao = document.getElementById("salvar-solicitacao");
    const possuiClientes = clientes.length > 0;
    const possuiServicoDisponivel = servicos.some((servico) => servico.ativo)
      || (idEmEdicao && servicos.some((servico) => servico.id === document.getElementById("servico-solicitacao").value));

    if (!possuiClientes) {
      aviso.textContent = "Cadastre um cliente antes de criar uma solicitação.";
      aviso.dataset.status = "erro";
    } else if (!possuiServicoDisponivel) {
      aviso.textContent = "Cadastre ou ative um serviço antes de criar uma solicitação.";
      aviso.dataset.status = "erro";
    } else {
      aviso.textContent = "";
      aviso.dataset.status = "";
    }
    botao.disabled = !possuiClientes || !possuiServicoDisponivel;
  }

  function localizarCliente(id) {
    return clientes.find((cliente) => cliente.id === id);
  }

  function localizarServico(id) {
    return servicos.find((servico) => servico.id === id);
  }

  function criarBotao(rotulo, acao) {
    const botao = document.createElement("button");
    botao.type = "button";
    botao.className = "action-button";
    botao.dataset.acao = acao;
    botao.textContent = rotulo;
    return botao;
  }

  function criarLinha(solicitacao) {
    const linha = document.createElement("tr");
    linha.dataset.id = solicitacao.id;
    const cliente = document.createElement("td");
    const servico = document.createElement("td");
    const dataPreferencial = document.createElement("td");
    const status = document.createElement("td");
    const dataCriacao = document.createElement("td");
    const acoes = document.createElement("td");
    const selo = document.createElement("span");
    const grupo = document.createElement("div");
    const clienteRelacionado = localizarCliente(solicitacao.clienteId);
    const servicoRelacionado = localizarServico(solicitacao.servicoId);

    cliente.textContent = clienteRelacionado ? clienteRelacionado.nome : "Cliente não encontrado";
    servico.textContent = servicoRelacionado ? servicoRelacionado.nome : "Serviço não encontrado";
    dataPreferencial.textContent = formatarData(solicitacao.dataPreferencial);
    const statusRotulos = { pendente: "Pendente", cancelada: "Cancelada", agendada: "Agendada" };
    selo.className = `status ${solicitacao.status === "cancelada" ? "status-cancelado" : solicitacao.status === "agendada" ? "status-agendado" : "status-aguardando"}`;
    selo.textContent = statusRotulos[solicitacao.status] || "Status desconhecido";
    status.appendChild(selo);
    dataCriacao.textContent = formatarDataHora(solicitacao.dataCriacao);
    grupo.className = "table-actions";
    grupo.appendChild(criarBotao("Editar", "editar"));
    if (solicitacao.status === "pendente") {
      grupo.append(criarBotao("Agendar", "agendar"), criarBotao("Cancelar", "alternar-status"));
    } else if (solicitacao.status === "cancelada") {
      grupo.appendChild(criarBotao("Reabrir", "alternar-status"));
    }
    acoes.appendChild(grupo);
    linha.append(cliente, servico, dataPreferencial, status, dataCriacao, acoes);
    return linha;
  }

  function renderizar() {
    const lista = document.getElementById("solicitacoes-lista");
    const contador = document.getElementById("solicitacoes-contador");
    contador.textContent = `${solicitacoes.length} ${solicitacoes.length === 1 ? "solicitação" : "solicitações"}`;
    lista.replaceChildren();

    if (solicitacoes.length === 0) {
      const linha = document.createElement("tr");
      const celula = document.createElement("td");
      celula.colSpan = 6;
      celula.textContent = "Nenhuma solicitação cadastrada ainda.";
      linha.appendChild(celula);
      lista.appendChild(linha);
      return;
    }

    [...solicitacoes]
      .sort((a, b) => new Date(b.dataCriacao).getTime() - new Date(a.dataCriacao).getTime())
      .forEach((solicitacao) => lista.appendChild(criarLinha(solicitacao)));
  }

  function validar(dados) {
    const cliente = localizarCliente(dados.clienteId);
    const servico = localizarServico(dados.servicoId);
    if (!dados.clienteId) return "Selecione um cliente.";
    if (!cliente) return "O cliente selecionado não existe.";
    if (!dados.servicoId) return "Selecione um serviço.";
    if (!servico) return "O serviço selecionado não existe.";

    const registroAtual = solicitacoes.find((item) => item.id === idEmEdicao);
    const manteveServico = registroAtual && registroAtual.servicoId === dados.servicoId;
    if (!servico.ativo && !manteveServico) return "O serviço selecionado está inativo.";
    if (!dados.dataPreferencial) return "Informe a data preferencial.";
    if (!dataIsoValida(dados.dataPreferencial)) return "Informe uma data preferencial válida.";

    const manteveData = registroAtual && registroAtual.dataPreferencial === dados.dataPreferencial;
    if (dados.dataPreferencial < obterDataAtual() && !manteveData) {
      return "A data preferencial não pode ser anterior à data atual.";
    }
    if (dados.observacoes.length > 500) return "As observações devem ter no máximo 500 caracteres.";
    return "";
  }

  function encerrarEdicao(limparFeedback = false) {
    idEmEdicao = null;
    document.getElementById("form-solicitacao").reset();
    document.getElementById("solicitacao-form-titulo").textContent = "Nova solicitação";
    document.getElementById("salvar-solicitacao").textContent = "Cadastrar solicitação";
    document.getElementById("cancelar-edicao-solicitacao").hidden = true;
    preencherClientes();
    preencherServicos();
    document.getElementById("data-preferencial").min = obterDataAtual();
    atualizarPreRequisitos();
    if (limparFeedback) mostrarFeedback("", "");
  }

  function iniciarEdicao(solicitacao) {
    idEmEdicao = solicitacao.id;
    preencherClientes(solicitacao.clienteId);
    preencherServicos(solicitacao.servicoId);
    document.getElementById("data-preferencial").value = solicitacao.dataPreferencial || "";
    document.getElementById("data-preferencial").removeAttribute("min");
    document.getElementById("observacoes-solicitacao").value = solicitacao.observacoes;
    document.getElementById("solicitacao-form-titulo").textContent = "Editar solicitação";
    document.getElementById("salvar-solicitacao").textContent = "Salvar alterações";
    document.getElementById("cancelar-edicao-solicitacao").hidden = false;
    atualizarPreRequisitos();
    mostrarFeedback("", "");
    document.getElementById("cliente-solicitacao").focus();
  }

  function configurarFormulario() {
    const formulario = document.getElementById("form-solicitacao");
    formulario.addEventListener("submit", (event) => {
      event.preventDefault();
      const dados = {
        clienteId: document.getElementById("cliente-solicitacao").value,
        servicoId: document.getElementById("servico-solicitacao").value,
        dataPreferencial: document.getElementById("data-preferencial").value,
        observacoes: normalizarTexto(document.getElementById("observacoes-solicitacao").value)
      };
      const erro = validar(dados);
      if (erro) {
        mostrarFeedback(erro, "erro");
        return;
      }

      if (idEmEdicao) {
        const indice = solicitacoes.findIndex((solicitacao) => solicitacao.id === idEmEdicao);
        if (indice === -1) return;
        solicitacoes[indice] = modelo.criar({ ...solicitacoes[indice], ...dados });
        solicitacoesRepository.salvarTodos(solicitacoes);
        renderizar();
        encerrarEdicao();
        mostrarFeedback("Solicitação atualizada com sucesso.", "sucesso");
      } else {
        solicitacoes.push(modelo.criar({ ...dados, status: "pendente" }));
        solicitacoesRepository.salvarTodos(solicitacoes);
        renderizar();
        encerrarEdicao();
        document.getElementById("cliente-solicitacao").focus();
        mostrarFeedback("Solicitação cadastrada com sucesso.", "sucesso");
      }
    });

    document.getElementById("cancelar-edicao-solicitacao").addEventListener("click", () => {
      encerrarEdicao();
      mostrarFeedback("Edição cancelada.", "sucesso");
    });
    document.getElementById("nova-solicitacao").addEventListener("click", () => {
      encerrarEdicao(true);
      document.getElementById("cliente-solicitacao").focus();
    });
  }

  function configurarListagem() {
    document.getElementById("solicitacoes-lista").addEventListener("click", (event) => {
      const botao = event.target.closest("button[data-acao]");
      const linha = event.target.closest("tr[data-id]");
      if (!botao || !linha) return;
      const solicitacao = solicitacoes.find((item) => item.id === linha.dataset.id);
      if (!solicitacao) return;
      if (botao.dataset.acao === "editar") {
        iniciarEdicao(solicitacao);
        return;
      }

      if (botao.dataset.acao === "agendar") {
        iniciarConversao(solicitacao);
        return;
      }

      const cancelando = solicitacao.status !== "cancelada";
      if (cancelando && !window.confirm("Deseja cancelar esta solicitação?")) return;
      solicitacao.status = cancelando ? "cancelada" : "pendente";
      solicitacoesRepository.salvarTodos(solicitacoes);
      renderizar();
      mostrarFeedback(
        cancelando ? "Solicitação cancelada com sucesso." : "Solicitação reaberta com sucesso.",
        "sucesso"
      );
    });
  }

  function horarioValido(valor) {
    return /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(valor);
  }

  function mostrarFeedbackConversao(mensagem, tipo) {
    const feedback = document.getElementById("conversao-feedback");
    feedback.textContent = mensagem;
    feedback.dataset.status = tipo;
  }

  function encerrarConversao() {
    idEmConversao = null;
    document.getElementById("form-conversao").reset();
    document.getElementById("painel-conversao").hidden = true;
    mostrarFeedbackConversao("", "");
  }

  function iniciarConversao(solicitacao) {
    if (solicitacao.status !== "pendente") {
      mostrarFeedback("Esta solicitação já foi agendada ou não está disponível para conversão.", "erro");
      return;
    }
    const cliente = localizarCliente(solicitacao.clienteId);
    const servico = localizarServico(solicitacao.servicoId);
    idEmConversao = solicitacao.id;
    document.getElementById("conversao-contexto").textContent = `${cliente ? cliente.nome : "Cliente não encontrado"} — ${servico ? servico.nome : "Serviço não encontrado"}`;
    document.getElementById("data-agendamento").value = solicitacao.dataPreferencial || "";
    document.getElementById("data-agendamento").min = obterDataAtual();
    document.getElementById("horario-agendamento").value = "";
    document.getElementById("painel-conversao").hidden = false;
    mostrarFeedbackConversao("", "");
    document.getElementById("horario-agendamento").focus();
  }

  function configurarConversao() {
    document.getElementById("fechar-conversao").addEventListener("click", encerrarConversao);
    document.getElementById("form-conversao").addEventListener("submit", (event) => {
      event.preventDefault();
      const solicitacao = solicitacoes.find((item) => item.id === idEmConversao);
      if (!solicitacao || solicitacao.status !== "pendente") {
        mostrarFeedbackConversao("Esta solicitação já foi agendada ou não está disponível para conversão.", "erro");
        return;
      }
      const cliente = localizarCliente(solicitacao.clienteId);
      const servico = localizarServico(solicitacao.servicoId);
      const data = document.getElementById("data-agendamento").value;
      const horario = document.getElementById("horario-agendamento").value;
      if (!cliente) return mostrarFeedbackConversao("Cliente não encontrado.", "erro");
      if (!servico) return mostrarFeedbackConversao("Serviço não encontrado.", "erro");
      if (!servico.ativo) return mostrarFeedbackConversao("O serviço vinculado está inativo.", "erro");
      if (!dataIsoValida(data) || data < obterDataAtual()) return mostrarFeedbackConversao("Selecione uma data válida.", "erro");
      if (!horarioValido(horario)) return mostrarFeedbackConversao("Selecione um horário válido.", "erro");

      const agendamentos = agendamentosRepository.listar();
      const novoAgendamento = agendamentoModelo.criar({
        clienteId: solicitacao.clienteId,
        servicoId: solicitacao.servicoId,
        data,
        horario,
        status: "agendado"
      });
      agendamentos.push(novoAgendamento);
      if (!agendamentosRepository.salvarTodos(agendamentos)) {
        agendamentos.pop();
        mostrarFeedbackConversao("Não foi possível criar o agendamento.", "erro");
        return;
      }

      const statusAnterior = solicitacao.status;
      solicitacao.status = "agendada";
      if (!solicitacoesRepository.salvarTodos(solicitacoes)) {
        solicitacao.status = statusAnterior;
        const semNovoAgendamento = agendamentos.filter((item) => item.id !== novoAgendamento.id);
        agendamentosRepository.salvarTodos(semNovoAgendamento);
        mostrarFeedbackConversao("Não foi possível concluir a conversão.", "erro");
        return;
      }

      renderizar();
      encerrarConversao();
      mostrarFeedback("Solicitação convertida em agendamento com sucesso.", "sucesso");
    });
  }

  function iniciar() {
    preencherClientes();
    preencherServicos();
    document.getElementById("data-preferencial").min = obterDataAtual();
    atualizarPreRequisitos();
    configurarFormulario();
    configurarListagem();
    configurarConversao();
    renderizar();
  }

  FluxoCRM.modulos.solicitacoes = { iniciar };
})(window.FluxoCRM);
