(function (FluxoCRM) {
  const agendamentosRepository = FluxoCRM.repositories.agendamentos;
  const clientes = FluxoCRM.repositories.clientes.listar();
  const servicos = FluxoCRM.repositories.servicos.listar();
  const nomesDias = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
  const resumoPorCelula = 2;
  let visualizacaoAtual = "semanal";
  let inicioSemanaExibida = obterInicioSemana(new Date());
  let mesExibido = primeiroDiaMes(new Date());
  let diaSelecionado = dataParaIso(new Date());

  function criarDataLocal(valor) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(valor || ""))) return null;
    const [ano, mes, dia] = valor.split("-").map(Number);
    const data = new Date(ano, mes - 1, dia);
    if (data.getFullYear() !== ano || data.getMonth() !== mes - 1 || data.getDate() !== dia) return null;
    data.setHours(0, 0, 0, 0);
    return data;
  }

  function obterInicioSemana(data) {
    const inicio = new Date(data.getFullYear(), data.getMonth(), data.getDate());
    inicio.setDate(inicio.getDate() + (inicio.getDay() === 0 ? -6 : 1 - inicio.getDay()));
    return inicio;
  }

  function primeiroDiaMes(data) {
    return new Date(data.getFullYear(), data.getMonth(), 1);
  }

  function adicionarDias(data, quantidade) {
    const resultado = new Date(data.getFullYear(), data.getMonth(), data.getDate());
    resultado.setDate(resultado.getDate() + quantidade);
    return resultado;
  }

  function adicionarMeses(data, quantidade) {
    return new Date(data.getFullYear(), data.getMonth() + quantidade, 1);
  }

  function obterDiasSemana(inicio) {
    return Array.from({ length: 7 }, (_, indice) => adicionarDias(inicio, indice));
  }

  function obterGradeMes(mes) {
    const inicio = obterInicioSemana(primeiroDiaMes(mes));
    const diasNoMes = new Date(mes.getFullYear(), mes.getMonth() + 1, 0).getDate();
    const deslocamento = Math.round((primeiroDiaMes(mes) - inicio) / 86400000);
    const quantidade = Math.ceil((deslocamento + diasNoMes) / 7) * 7;
    return Array.from({ length: quantidade }, (_, indice) => adicionarDias(inicio, indice));
  }

  function dataParaIso(data) {
    return `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, "0")}-${String(data.getDate()).padStart(2, "0")}`;
  }

  function formatarDataCurta(data) {
    return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit" }).format(data);
  }

  function formatarDataCompleta(data) {
    return new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "long", year: "numeric" }).format(data);
  }

  function formatarMes(data) {
    const texto = new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(data);
    return texto.charAt(0).toLocaleUpperCase("pt-BR") + texto.slice(1);
  }

  function formatarIntervalo(inicio) {
    return `${formatarDataCompleta(inicio)} — ${formatarDataCompleta(adicionarDias(inicio, 6))}`;
  }

  function dataEhHoje(data) {
    return dataParaIso(data) === dataParaIso(new Date());
  }

  function horarioValido(horario) {
    return /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(String(horario || ""));
  }

  function compararHorarios(a, b) {
    const aValido = horarioValido(a.horario);
    const bValido = horarioValido(b.horario);
    if (aValido && bValido) return a.horario.localeCompare(b.horario);
    if (aValido) return -1;
    if (bValido) return 1;
    return 0;
  }

  function agruparAgendamentos() {
    const grupos = new Map();
    let possuiInvalidos = false;
    agendamentosRepository.listar().forEach((agendamento) => {
      const data = criarDataLocal(agendamento.data);
      if (!data) {
        possuiInvalidos = true;
        return;
      }
      const chave = dataParaIso(data);
      if (!grupos.has(chave)) grupos.set(chave, []);
      grupos.get(chave).push(agendamento);
    });
    grupos.forEach((itens) => itens.sort(compararHorarios));
    return { grupos, possuiInvalidos };
  }

  function obterCliente(id) {
    return clientes.find((cliente) => cliente.id === id);
  }

  function obterServico(id) {
    return servicos.find((servico) => servico.id === id);
  }

  function formatarStatus(status) {
    const valor = String(status || "").trim();
    if (!valor) return "Status não informado";
    return valor.charAt(0).toLocaleUpperCase("pt-BR") + valor.slice(1);
  }

  function classeStatus(status) {
    const valor = String(status || "").toLocaleLowerCase("pt-BR");
    if (valor === "agendado") return "status-agendado";
    if (valor === "cancelado") return "status-cancelado";
    if (valor === "concluido" || valor === "concluído") return "status-concluido";
    if (valor.includes("aguardando")) return "status-aguardando";
    return "status-novo";
  }

  function adicionarDetalhe(lista, rotulo, valor) {
    const titulo = document.createElement("dt");
    const conteudo = document.createElement("dd");
    titulo.textContent = rotulo;
    conteudo.textContent = valor;
    lista.append(titulo, conteudo);
  }

  function exibirDetalhes(agendamento) {
    const painel = document.getElementById("agenda-detalhes");
    const conteudo = document.getElementById("agenda-detalhes-conteudo");
    const cliente = obterCliente(agendamento.clienteId);
    const servico = obterServico(agendamento.servicoId);
    const data = criarDataLocal(agendamento.data);
    conteudo.replaceChildren();
    adicionarDetalhe(conteudo, "Cliente", cliente ? cliente.nome : "Cliente não encontrado");
    adicionarDetalhe(conteudo, "Serviço", servico ? servico.nome : "Serviço não encontrado");
    adicionarDetalhe(conteudo, "Data", data ? new Intl.DateTimeFormat("pt-BR").format(data) : "Data inválida");
    adicionarDetalhe(conteudo, "Horário", horarioValido(agendamento.horario) ? agendamento.horario : "Horário inválido");
    adicionarDetalhe(conteudo, "Status", formatarStatus(agendamento.status));
    painel.hidden = false;
    painel.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function criarCard(agendamento) {
    const card = document.createElement("article");
    const horario = document.createElement("strong");
    const cliente = document.createElement("span");
    const servico = document.createElement("span");
    const status = document.createElement("span");
    const botao = document.createElement("button");
    const clienteRelacionado = obterCliente(agendamento.clienteId);
    const servicoRelacionado = obterServico(agendamento.servicoId);
    card.className = "agenda-event";
    horario.className = "agenda-time";
    horario.textContent = horarioValido(agendamento.horario) ? agendamento.horario : "Horário inválido";
    cliente.className = "agenda-client";
    cliente.textContent = clienteRelacionado ? clienteRelacionado.nome : "Cliente não encontrado";
    servico.className = "agenda-service";
    servico.textContent = servicoRelacionado ? servicoRelacionado.nome : "Serviço não encontrado";
    status.className = `status ${classeStatus(agendamento.status)}`;
    status.textContent = formatarStatus(agendamento.status);
    botao.type = "button";
    botao.className = "action-button";
    botao.textContent = "Ver detalhes";
    botao.addEventListener("click", () => exibirDetalhes(agendamento));
    card.append(horario, cliente, servico);
    if (servicoRelacionado && !servicoRelacionado.ativo) {
      const inativo = document.createElement("small");
      inativo.className = "agenda-inactive-service";
      inativo.textContent = "Serviço inativo";
      card.appendChild(inativo);
    }
    card.append(status, botao);
    return card;
  }

  function criarColunaDia(data, registros) {
    const coluna = document.createElement("section");
    const cabecalho = document.createElement("header");
    const nome = document.createElement("strong");
    const numero = document.createElement("span");
    const lista = document.createElement("div");
    coluna.className = `agenda-day${dataEhHoje(data) ? " is-today" : ""}`;
    cabecalho.className = "agenda-day-header";
    nome.textContent = nomesDias[data.getDay()];
    numero.textContent = formatarDataCurta(data);
    cabecalho.append(nome, numero);
    lista.className = "agenda-events";
    if (registros.length === 0) {
      const vazio = document.createElement("p");
      vazio.className = "agenda-day-empty";
      vazio.textContent = "Nenhum agendamento.";
      lista.appendChild(vazio);
    } else {
      registros.forEach((item) => lista.appendChild(criarCard(item)));
    }
    coluna.append(cabecalho, lista);
    return coluna;
  }

  function renderizarSemana(grupos) {
    const grade = document.getElementById("agenda-semana");
    const dias = obterDiasSemana(inicioSemanaExibida);
    let total = 0;
    grade.replaceChildren();
    dias.forEach((dia) => {
      const registros = grupos.get(dataParaIso(dia)) || [];
      total += registros.length;
      grade.appendChild(criarColunaDia(dia, registros));
    });
    document.getElementById("agenda-vazia").hidden = total > 0;
  }

  function obterPrimeiroNome(agendamento) {
    const cliente = obterCliente(agendamento.clienteId);
    return cliente ? cliente.nome.trim().split(/\s+/)[0] : "Cliente não encontrado";
  }

  function selecionarDia(data) {
    diaSelecionado = dataParaIso(data);
    if (data.getMonth() !== mesExibido.getMonth() || data.getFullYear() !== mesExibido.getFullYear()) {
      mesExibido = primeiroDiaMes(data);
    }
    renderizarAgenda();
  }

  function criarCelulaMes(data, registros) {
    const botao = document.createElement("button");
    const numero = document.createElement("span");
    const resumos = document.createElement("span");
    const foraDoMes = data.getMonth() !== mesExibido.getMonth() || data.getFullYear() !== mesExibido.getFullYear();
    const selecionado = dataParaIso(data) === diaSelecionado;
    botao.type = "button";
    botao.className = `agenda-month-day${foraDoMes ? " is-outside" : ""}${dataEhHoje(data) ? " is-today" : ""}${selecionado ? " is-selected" : ""}`;
    botao.setAttribute("aria-label", `${formatarDataCompleta(data)}, ${registros.length} ${registros.length === 1 ? "agendamento" : "agendamentos"}`);
    botao.setAttribute("aria-pressed", String(selecionado));
    if (dataEhHoje(data)) botao.setAttribute("aria-current", "date");
    numero.className = "agenda-month-number";
    numero.textContent = String(data.getDate());
    resumos.className = "agenda-month-summaries";
    registros.slice(0, resumoPorCelula).forEach((agendamento) => {
      const resumo = document.createElement("span");
      resumo.className = "agenda-month-summary";
      resumo.textContent = `${horarioValido(agendamento.horario) ? agendamento.horario : "Horário inválido"} — ${obterPrimeiroNome(agendamento)}`;
      resumos.appendChild(resumo);
    });
    if (registros.length > resumoPorCelula) {
      const restante = registros.length - resumoPorCelula;
      const indicador = document.createElement("span");
      indicador.className = "agenda-month-more";
      indicador.textContent = `+${restante} ${restante === 1 ? "agendamento" : "agendamentos"}`;
      resumos.appendChild(indicador);
    }
    if (registros.length > 0) {
      const indicadorCompacto = document.createElement("span");
      indicadorCompacto.className = "agenda-month-count";
      indicadorCompacto.textContent = String(registros.length);
      resumos.appendChild(indicadorCompacto);
    }
    botao.append(numero, resumos);
    botao.addEventListener("click", () => selecionarDia(data));
    return botao;
  }

  function renderizarDiaSelecionado(grupos) {
    const data = criarDataLocal(diaSelecionado) || new Date();
    const registros = grupos.get(dataParaIso(data)) || [];
    const lista = document.getElementById("agenda-dia-lista");
    document.getElementById("agenda-dia-titulo").textContent = `Agendamentos de ${formatarDataCompleta(data)}`;
    lista.replaceChildren();
    if (registros.length === 0) {
      const vazio = document.createElement("p");
      vazio.className = "agenda-day-empty";
      vazio.textContent = "Nenhum agendamento para este dia.";
      lista.appendChild(vazio);
      return;
    }
    registros.forEach((agendamento) => lista.appendChild(criarCard(agendamento)));
  }

  function renderizarMes(grupos) {
    const grade = document.getElementById("agenda-mes-grade");
    const dias = obterGradeMes(mesExibido);
    let totalMes = 0;
    grade.replaceChildren();
    dias.forEach((dia) => {
      const registros = grupos.get(dataParaIso(dia)) || [];
      if (dia.getMonth() === mesExibido.getMonth() && dia.getFullYear() === mesExibido.getFullYear()) totalMes += registros.length;
      grade.appendChild(criarCelulaMes(dia, registros));
    });
    document.getElementById("agenda-mes-vazio").hidden = totalMes > 0;
    renderizarDiaSelecionado(grupos);
  }

  function atualizarControles() {
    const mensal = visualizacaoAtual === "mensal";
    const lista = visualizacaoAtual === "lista";
    const labelPeriodo = document.getElementById("agenda-periodo-label");
    const btnAnterior = document.getElementById("semana-anterior");
    const btnProxima = document.getElementById("proxima-semana");
    if (labelPeriodo) labelPeriodo.textContent = mensal ? "Mês exibido" : lista ? "Todos os agendamentos" : "Semana exibida";
    if (btnAnterior) btnAnterior.hidden = lista;
    if (btnProxima) btnProxima.hidden = lista;
    if (btnAnterior) btnAnterior.textContent = mensal ? "Mês anterior" : "Semana anterior";
    if (btnProxima) btnProxima.textContent = mensal ? "Próximo mês" : "Próxima semana";
    document.querySelectorAll("[data-view]").forEach((botao) => {
      const ativo = botao.dataset.view === visualizacaoAtual;
      botao.classList.toggle("is-active", ativo);
      botao.setAttribute("aria-pressed", String(ativo));
    });
  }

  /* ── Visualização Lista ── */

  function renderizarLista() {
    const container = document.getElementById("agenda-visao-lista");
    if (!container) return;

    const filtroStatus = document.getElementById("lista-filtro-status");
    const filtroBusca = document.getElementById("lista-filtro-busca");
    const tabela = document.getElementById("agenda-lista-tabela");
    if (!tabela) return;

    const statusFiltro = filtroStatus ? filtroStatus.value : "";
    const buscaFiltro = filtroBusca ? filtroBusca.value.toLowerCase().trim() : "";

    const agendamentos = agendamentosRepository.listar();
    let filtrados = [...agendamentos];

    // Filtrar por status
    if (statusFiltro) {
      filtrados = filtrados.filter((a) => String(a.status || "").toLocaleLowerCase("pt-BR") === statusFiltro);
    }

    // Filtrar por busca (nome de cliente)
    if (buscaFiltro) {
      filtrados = filtrados.filter((a) => {
        const cliente = obterCliente(a.clienteId);
        return cliente && cliente.nome.toLowerCase().includes(buscaFiltro);
      });
    }

    // Ordenar por data e horário
    filtrados.sort((a, b) => {
      const dc = String(a.data || "").localeCompare(String(b.data || ""));
      if (dc !== 0) return dc;
      return String(a.horario || "").localeCompare(String(b.horario || ""));
    });

    tabela.replaceChildren();

    if (filtrados.length === 0) {
      const tr = document.createElement("tr");
      const td = document.createElement("td");
      td.colSpan = 5;
      td.className = "agenda-list-empty";
      td.textContent = statusFiltro || buscaFiltro
        ? "Nenhum agendamento corresponde aos filtros aplicados."
        : "Nenhum agendamento encontrado.";
      tr.appendChild(td);
      tabela.appendChild(tr);
      return;
    }

    filtrados.forEach((ag) => {
      const linha = document.createElement("tr");
      const clienteRel = obterCliente(ag.clienteId);
      const servicoRel = obterServico(ag.servicoId);

      const tdCliente = document.createElement("td");
      const tdServico = document.createElement("td");
      const tdData = document.createElement("td");
      const tdHorario = document.createElement("td");
      const tdStatus = document.createElement("td");

      tdCliente.textContent = clienteRel ? clienteRel.nome : "Cliente não encontrado";
      if (!clienteRel) tdCliente.style.color = "var(--color-danger)";

      tdServico.textContent = servicoRel ? servicoRel.nome : "Serviço não encontrado";
      if (!servicoRel) tdServico.style.color = "var(--color-danger)";
      if (servicoRel && !servicoRel.ativo) {
        const aviso = document.createElement("small");
        aviso.className = "agenda-inactive-service";
        aviso.textContent = " (inativo)";
        tdServico.appendChild(aviso);
      }

      const dataObj = criarDataLocal(ag.data);
      tdData.textContent = dataObj ? new Intl.DateTimeFormat("pt-BR").format(dataObj) : "Data inválida";
      if (!dataObj) tdData.style.color = "var(--color-danger)";

      tdHorario.textContent = horarioValido(ag.horario) ? ag.horario : "Horário inválido";
      if (!horarioValido(ag.horario)) tdHorario.style.color = "var(--color-danger)";

      const selo = document.createElement("span");
      selo.className = `status ${classeStatus(ag.status)}`;
      selo.textContent = formatarStatus(ag.status);
      tdStatus.appendChild(selo);

      linha.append(tdCliente, tdServico, tdData, tdHorario, tdStatus);
      tabela.appendChild(linha);
    });
  }

  function configurarFiltrosLista() {
    const filtroStatus = document.getElementById("lista-filtro-status");
    const filtroBusca = document.getElementById("lista-filtro-busca");
    if (filtroStatus) filtroStatus.addEventListener("change", renderizarLista);
    if (filtroBusca) filtroBusca.addEventListener("input", renderizarLista);
  }

  function renderizarAgenda() {
    const { grupos, possuiInvalidos } = agruparAgendamentos();
    const mensal = visualizacaoAtual === "mensal";
    const lista = visualizacaoAtual === "lista";
    const semanalEl = document.getElementById("agenda-visao-semanal");
    const mensalEl = document.getElementById("agenda-visao-mensal");
    const listaEl = document.getElementById("agenda-visao-lista");
    if (semanalEl) semanalEl.hidden = mensal || lista;
    if (mensalEl) mensalEl.hidden = !mensal || lista;
    if (listaEl) listaEl.hidden = !lista;
    const intervaloEl = document.getElementById("agenda-intervalo");
    if (intervaloEl) {
      intervaloEl.textContent = lista ? "Todos os agendamentos" : mensal ? formatarMes(mesExibido) : formatarIntervalo(inicioSemanaExibida);
    }
    const avisoEl = document.getElementById("agenda-aviso");
    if (avisoEl) {
      avisoEl.textContent = possuiInvalidos ? "Existem agendamentos com dados inválidos que não puderam ser exibidos." : "";
      avisoEl.dataset.status = possuiInvalidos ? "erro" : "";
    }
    atualizarControles();
    if (lista) renderizarLista();
    else if (mensal) renderizarMes(grupos);
    else renderizarSemana(grupos);
  }

  function configurarControles() {
    document.querySelectorAll("[data-view]").forEach((botao) => {
      botao.addEventListener("click", () => {
        visualizacaoAtual = botao.dataset.view;
        renderizarAgenda();
      });
    });
    const btnAnterior = document.getElementById("semana-anterior");
    const btnProxima = document.getElementById("proxima-semana");
    const btnHoje = document.getElementById("semana-atual");
    const btnFechar = document.getElementById("fechar-detalhes");
    if (btnAnterior) btnAnterior.addEventListener("click", () => {
      if (visualizacaoAtual === "mensal") mesExibido = adicionarMeses(mesExibido, -1);
      else inicioSemanaExibida = adicionarDias(inicioSemanaExibida, -7);
      renderizarAgenda();
    });
    if (btnProxima) btnProxima.addEventListener("click", () => {
      if (visualizacaoAtual === "mensal") mesExibido = adicionarMeses(mesExibido, 1);
      else inicioSemanaExibida = adicionarDias(inicioSemanaExibida, 7);
      renderizarAgenda();
    });
    if (btnHoje) btnHoje.addEventListener("click", () => {
      const hoje = new Date();
      if (visualizacaoAtual === "mensal") {
        mesExibido = primeiroDiaMes(hoje);
        diaSelecionado = dataParaIso(hoje);
      } else {
        inicioSemanaExibida = obterInicioSemana(hoje);
      }
      renderizarAgenda();
    });
    if (btnFechar) btnFechar.addEventListener("click", () => {
      document.getElementById("agenda-detalhes").hidden = true;
    });
  }

  function iniciar() {
    configurarControles();
    configurarFiltrosLista();
    renderizarAgenda();
  }

  FluxoCRM.modulos.agenda = { iniciar };
})(window.FluxoCRM);
