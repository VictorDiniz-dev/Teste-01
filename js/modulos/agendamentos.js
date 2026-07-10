(function (FluxoCRM) {
  const repository = FluxoCRM.repositories.agendamentos;
  const clientesRepository = FluxoCRM.repositories.clientes;
  const servicosRepository = FluxoCRM.repositories.servicos;

  function formatarData(valor) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(valor || ""))) return "Data inválida";
    const [ano, mes, dia] = valor.split("-").map(Number);
    const data = new Date(ano, mes - 1, dia);
    if (data.getFullYear() !== ano || data.getMonth() !== mes - 1 || data.getDate() !== dia) return "Data inválida";
    return new Intl.DateTimeFormat("pt-BR").format(data);
  }

  function formatarStatus(valor) {
    const texto = String(valor || "").trim();
    return texto ? texto.charAt(0).toLocaleUpperCase("pt-BR") + texto.slice(1) : "Status não informado";
  }

  function classeStatus(valor) {
    const status = String(valor || "").toLocaleLowerCase("pt-BR");
    if (status === "agendado") return "status-agendado";
    if (status === "cancelado") return "status-cancelado";
    if (status === "concluido" || status === "concluído") return "status-concluido";
    return "status-novo";
  }

  function criarLinha(agendamento, clientes, servicos) {
    const linha = document.createElement("tr");
    const cliente = document.createElement("td");
    const servico = document.createElement("td");
    const data = document.createElement("td");
    const horario = document.createElement("td");
    const status = document.createElement("td");
    const selo = document.createElement("span");
    const clienteRelacionado = clientes.find((item) => item.id === agendamento.clienteId);
    const servicoRelacionado = servicos.find((item) => item.id === agendamento.servicoId);
    cliente.textContent = clienteRelacionado ? clienteRelacionado.nome : "Cliente não encontrado";
    servico.textContent = servicoRelacionado ? servicoRelacionado.nome : "Serviço não encontrado";
    data.textContent = formatarData(agendamento.data);
    horario.textContent = /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(String(agendamento.horario || "")) ? agendamento.horario : "Horário inválido";
    selo.className = `status ${classeStatus(agendamento.status)}`;
    selo.textContent = formatarStatus(agendamento.status);
    status.appendChild(selo);
    linha.append(cliente, servico, data, horario, status);
    return linha;
  }

  function iniciar() {
    const tabela = document.querySelector("#appointmentsTable");
    const contador = document.querySelector("#appointmentsCount");
    if (!tabela || !contador) return;
    const agendamentos = repository.listar();
    const clientes = clientesRepository.listar();
    const servicos = servicosRepository.listar();
    contador.textContent = `${agendamentos.length} ${agendamentos.length === 1 ? "agendamento" : "agendamentos"}`;
    tabela.replaceChildren();
    if (agendamentos.length === 0) {
      const linha = document.createElement("tr");
      const celula = document.createElement("td");
      celula.colSpan = 5;
      celula.textContent = "Nenhum agendamento encontrado.";
      linha.appendChild(celula);
      tabela.appendChild(linha);
      return;
    }
    [...agendamentos]
      .sort((a, b) => String(a.data).localeCompare(String(b.data)) || String(a.horario).localeCompare(String(b.horario)))
      .forEach((agendamento) => tabela.appendChild(criarLinha(agendamento, clientes, servicos)));
  }

  FluxoCRM.modulos.agendamentos = { iniciar };
})(window.FluxoCRM);
