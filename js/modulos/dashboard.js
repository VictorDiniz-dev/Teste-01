(function (FluxoCRM) {
  const { escapeHtml, criarGraficoBarras, criarGraficoRosca,
          obterDataHoje, dataIsoValida, formatarDataAmigavel,
          formatarDataCurta } = FluxoCRM.compartilhado;

  /* ── Funções de cálculo — usam apenas repositories reais ── */

  function obterAgendamentosDeHoje() {
    const hoje = obterDataHoje();
    return FluxoCRM.repositories.agendamentos
      .listar()
      .filter((a) => a.data === hoje)
      .sort((a, b) => {
        const av = horarioValido(a.horario);
        const bv = horarioValido(b.horario);
        if (av && bv) return a.horario.localeCompare(b.horario);
        if (av) return -1;
        if (bv) return 1;
        return 0;
      });
  }

  function obterProximoAgendamento() {
    const hoje = obterDataHoje();
    const futuros = FluxoCRM.repositories.agendamentos
      .listar()
      .filter((a) => dataIsoValida(a.data) && a.data >= hoje)
      .sort((a, b) => {
        const dc = a.data.localeCompare(b.data);
        if (dc !== 0) return dc;
        const av = horarioValido(a.horario);
        const bv = horarioValido(b.horario);
        if (av && bv) return a.horario.localeCompare(b.horario);
        if (av) return -1;
        if (bv) return 1;
        return 0;
      });
    return futuros[0] || null;
  }

  function obterSolicitacoesPendentes() {
    return FluxoCRM.repositories.solicitacoes
      .listar()
      .filter((s) => s.status === "pendente");
  }

  function obterServicosAtivos() {
    return FluxoCRM.repositories.servicos
      .listar()
      .filter((s) => s.ativo === true);
  }

  function agruparAgendamentosPorData() {
    const agendamentos = FluxoCRM.repositories.agendamentos.listar();
    const grupos = new Map();
    agendamentos.forEach((a) => {
      if (!dataIsoValida(a.data)) return;
      if (!grupos.has(a.data)) grupos.set(a.data, 0);
      grupos.set(a.data, grupos.get(a.data) + 1);
    });
    return grupos;
  }

  function contarSolicitacoesPorStatus() {
    const solicitacoes = FluxoCRM.repositories.solicitacoes.listar();
    return {
      pendente: solicitacoes.filter((s) => s.status === "pendente").length,
      agendada: solicitacoes.filter((s) => s.status === "agendada").length,
      cancelada: solicitacoes.filter((s) => s.status === "cancelada").length
    };
  }

  function horarioValido(horario) {
    return /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(String(horario || ""));
  }

  /* ── Resolução de entidades por ID ── */

  function obterCliente(id) {
    return FluxoCRM.repositories.clientes.listar().find((c) => c.id === id) || null;
  }

  function obterServico(id) {
    return FluxoCRM.repositories.servicos.listar().find((s) => s.id === id) || null;
  }

  /* ── Alertas inteligentes ── */

  function calcularAlertas() {
    const alertas = [];
    const agendamentos = FluxoCRM.repositories.agendamentos.listar();
    const solicitacoes = FluxoCRM.repositories.solicitacoes.listar();
    const clientes = FluxoCRM.repositories.clientes.listar();
    const servicos = FluxoCRM.repositories.servicos.listar();

    agendamentos.forEach((a) => {
      const c = clientes.find((cl) => cl.id === a.clienteId);
      const s = servicos.find((sv) => sv.id === a.servicoId);
      if (!c) alertas.push({ tipo: "aviso", texto: `Agendamento com cliente não encontrado (ID: ${a.clienteId ? a.clienteId.slice(0, 8) : "—"}).` });
      if (!s) alertas.push({ tipo: "aviso", texto: `Agendamento com serviço não encontrado (ID: ${a.servicoId ? a.servicoId.slice(0, 8) : "—"}).` });
      if (s && !s.ativo) alertas.push({ tipo: "info", texto: `Agendamento vinculado a serviço inativo: "${s.nome}".` });
      if (!dataIsoValida(a.data)) alertas.push({ tipo: "erro", texto: `Agendamento com data inválida (ID: ${a.id ? a.id.slice(0, 8) : "—"}).` });
    });

    solicitacoes.forEach((sol) => {
      const c = clientes.find((cl) => cl.id === sol.clienteId);
      const s = servicos.find((sv) => sv.id === sol.servicoId);
      if (!c) alertas.push({ tipo: "aviso", texto: `Solicitação com cliente não encontrado (ID: ${sol.clienteId ? sol.clienteId.slice(0, 8) : "—"}).` });
      if (!s) alertas.push({ tipo: "aviso", texto: `Solicitação com serviço não encontrado (ID: ${sol.servicoId ? sol.servicoId.slice(0, 8) : "—"}).` });
    });

    return alertas.slice(0, 6); // máximo 6 alertas
  }

  /* ── Gráfico: agendamentos dos últimos 7 e próximos 7 dias ── */

  function gerarDadosGrafico() {
    const grupos = agruparAgendamentosPorData();
    const hoje = obterDataHoje();
    const [ano, mes, dia] = hoje.split("-").map(Number);
    const base = new Date(ano, mes - 1, dia);
    const dados = [];

    // Últimos 6 dias + hoje = 7 barras
    for (let i = -6; i <= 0; i++) {
      const d = new Date(base.getFullYear(), base.getMonth(), base.getDate() + i);
      const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      const rotulo = i === 0 ? "Hoje" : `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
      dados.push({ rotulo, valor: grupos.get(iso) || 0, iso, ehHoje: i === 0 });
    }

    return dados;
  }

  /* ── Renderização ── */

  function renderizarMetrics(agendamentosHoje, solicitacoesPendentes, proximo, clientes, servicosAtivos) {
    const container = document.getElementById("dashboard-metrics");
    if (!container) return;

    const totalClientes = clientes.length;
    const totalServicosAtivos = servicosAtivos.length;
    const totalPendentes = solicitacoesPendentes.length;
    const totalHoje = agendamentosHoje.length;

    // Próximo horário
    let subHoje = "Nenhum compromisso";
    if (agendamentosHoje.length > 0) {
      const primeiroHorario = agendamentosHoje[0];
      if (horarioValido(primeiroHorario.horario)) {
        subHoje = `Primeiro às ${primeiroHorario.horario}`;
      } else {
        subHoje = `${agendamentosHoje.length} agendamento${agendamentosHoje.length > 1 ? "s" : ""}`;
      }
    }

    // Próximo agendamento resumo
    let subProximo = "Sem próximos agendamentos";
    if (proximo) {
      subProximo = formatarDataAmigavel(proximo.data);
      if (horarioValido(proximo.horario)) subProximo += ` às ${proximo.horario}`;
    }

    container.innerHTML = `
      <article class="metric-card metric-primary" aria-label="Agendamentos de hoje">
        <div class="metric-card-header">
          <span class="metric-card-label">Hoje</span>
          <span class="metric-card-icon">
            <svg aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          </span>
        </div>
        <strong class="metric-card-value">${totalHoje}</strong>
        <span class="metric-card-sub">${escapeHtml(subHoje)}</span>
        <a href="agenda.html" class="metric-card-link">Ver agenda →</a>
      </article>

      <article class="metric-card metric-warning" aria-label="Solicitações pendentes">
        <div class="metric-card-header">
          <span class="metric-card-label">Pendentes</span>
          <span class="metric-card-icon">
            <svg aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </span>
        </div>
        <strong class="metric-card-value">${totalPendentes}</strong>
        <span class="metric-card-sub">Solicitações aguardando</span>
        <a href="solicitacoes.html" class="metric-card-link">Ver solicitações →</a>
      </article>

      <article class="metric-card metric-info" aria-label="Próximo agendamento">
        <div class="metric-card-header">
          <span class="metric-card-label">Próximo</span>
          <span class="metric-card-icon">
            <svg aria-hidden="true"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          </span>
        </div>
        <strong class="metric-card-value">${proximo ? "1" : "—"}</strong>
        <span class="metric-card-sub">${escapeHtml(subProximo)}</span>
        <a href="agenda.html" class="metric-card-link">Ver agenda →</a>
      </article>

      <article class="metric-card metric-success" aria-label="Clientes cadastrados">
        <div class="metric-card-header">
          <span class="metric-card-label">Clientes</span>
          <span class="metric-card-icon">
            <svg aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </span>
        </div>
        <strong class="metric-card-value">${totalClientes}</strong>
        <span class="metric-card-sub">${totalServicosAtivos} ${totalServicosAtivos === 1 ? "serviço ativo" : "serviços ativos"}</span>
        <a href="clientes.html" class="metric-card-link">Ver clientes →</a>
      </article>
    `;
  }

  function renderizarAgendaHoje(agendamentosHoje) {
    const container = document.getElementById("dashboard-agenda-hoje");
    if (!container) return;

    if (agendamentosHoje.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">
            <svg aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          </div>
          <h3>Nenhum agendamento para hoje</h3>
          <p>Sua agenda está livre. Que tal criar uma nova solicitação?</p>
          <div class="empty-state-actions">
            <a href="agenda.html" class="btn btn-secondary btn-sm">Ver agenda</a>
            <a href="solicitacoes.html" class="btn btn-primary btn-sm">Nova solicitação</a>
          </div>
        </div>
      `;
      return;
    }

    const items = agendamentosHoje.map((ag) => {
      const cliente = obterCliente(ag.clienteId);
      const servico = obterServico(ag.servicoId);
      const nomeCliente = cliente ? cliente.nome : "Cliente não encontrado";
      const nomeServico = servico ? servico.nome : "Serviço não encontrado";
      const horario = horarioValido(ag.horario) ? ag.horario : "Horário inválido";
      const statusClasse = classeStatus(ag.status);
      const statusTexto = formatarStatus(ag.status);

      return `
        <div class="today-item">
          <span class="today-item-time">${escapeHtml(horario)}</span>
          <div class="today-item-info">
            <span class="today-item-client">${escapeHtml(nomeCliente)}</span>
            <span class="today-item-service">${escapeHtml(nomeServico)}</span>
          </div>
          <span class="status ${statusClasse}">${escapeHtml(statusTexto)}</span>
        </div>
      `;
    });

    const listaHtml = `<div class="today-panel">${items.join("")}</div>`;
    container.innerHTML = listaHtml;
  }

  function renderizarProximoCompromisso(proximo) {
    const container = document.getElementById("dashboard-proximo");
    if (!container) return;

    if (!proximo) {
      container.innerHTML = `
        <div class="next-appointment-card">
          <p style="color: var(--color-text-muted); font-size: var(--text-sm);">Nenhum próximo agendamento.</p>
          <a href="solicitacoes.html" class="btn btn-secondary btn-sm" style="margin-top: var(--space-3); display: inline-flex;">Nova solicitação</a>
        </div>
      `;
      return;
    }

    const cliente = obterCliente(proximo.clienteId);
    const servico = obterServico(proximo.servicoId);
    const nomeCliente = cliente ? cliente.nome : "Cliente não encontrado";
    const nomeServico = servico ? servico.nome : "Serviço não encontrado";
    const quando = formatarDataAmigavel(proximo.data);
    const dataFormatada = formatarDataCurta(proximo.data);
    const horario = horarioValido(proximo.horario) ? proximo.horario : "Horário inválido";

    container.innerHTML = `
      <div class="next-appointment-card">
        <span class="next-appointment-when">${escapeHtml(quando)}</span>
        <p class="next-appointment-client">${escapeHtml(nomeCliente)}</p>
        <p class="next-appointment-service">${escapeHtml(nomeServico)}</p>
        <div class="next-appointment-datetime">
          <span>
            <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><rect x="2" y="3" width="8" height="8" rx="1"/><line x1="5" y1="1" x2="5" y2="3"/><line x1="7" y1="1" x2="7" y2="3"/></svg>
            ${escapeHtml(dataFormatada)}
          </span>
          <span>
            <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="6" cy="6" r="5"/><polyline points="6 3.5 6 6 7.5 7"/></svg>
            ${escapeHtml(horario)}
          </span>
        </div>
      </div>
    `;
  }

  function renderizarAcoesRapidas() {
    const container = document.getElementById("dashboard-acoes");
    if (!container) return;

    container.innerHTML = `
      <div class="quick-actions">
        <a href="solicitacoes.html" class="quick-action-btn">
          <svg aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Nova solicitação
        </a>
        <a href="clientes.html" class="quick-action-btn">
          <svg aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
          Novo cliente
        </a>
        <a href="servicos.html" class="quick-action-btn">
          <svg aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Novo serviço
        </a>
        <a href="agenda.html" class="quick-action-btn">
          <svg aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          Abrir agenda
        </a>
      </div>
    `;
  }

  function renderizarGrafico() {
    const container = document.getElementById("dashboard-grafico");
    if (!container) return;

    const dados = gerarDadosGrafico();
    const indiceHoje = dados.findIndex((d) => d.ehHoje);

    criarGraficoBarras(container, dados, {
      titulo: "Agendamentos por dia — últimos 7 dias",
      corBarra: "#4ade80",
      corBarraDestaque: "#5e9fff",
      indiceDestaque: indiceHoje,
      corTexto: "#5c6678",
      alturaMaxima: 110
    });

    // Tabela alternativa (acessibilidade)
    const totalGeral = dados.reduce((s, d) => s + d.valor, 0);
    const tabelaWrap = document.getElementById("dashboard-grafico-tabela");
    if (tabelaWrap) {
      tabelaWrap.innerHTML = `
        <table class="chart-alt-table" aria-label="Agendamentos por dia — últimos 7 dias">
          <caption>Dados do gráfico: ${totalGeral} agendamento${totalGeral !== 1 ? "s" : ""} no período</caption>
          <thead><tr><th scope="col">Dia</th><th scope="col">Agendamentos</th></tr></thead>
          <tbody>
            ${dados.map((d) => `<tr><td>${escapeHtml(d.rotulo)}</td><td>${d.valor}</td></tr>`).join("")}
          </tbody>
        </table>
      `;
    }
  }

  function renderizarDistribuicaoSolicitacoes() {
    const container = document.getElementById("dashboard-rosca");
    if (!container) return;

    const contagem = contarSolicitacoesPorStatus();
    const total = contagem.pendente + contagem.agendada + contagem.cancelada;

    const dados = [
      { rotulo: "Pendentes", valor: contagem.pendente, cor: "#fbbf24" },
      { rotulo: "Agendadas", valor: contagem.agendada, cor: "#4ade80" },
      { rotulo: "Canceladas", valor: contagem.cancelada, cor: "#f87171" }
    ];

    criarGraficoRosca(container, dados, "Distribuição de solicitações por status");

    const legenda = document.getElementById("dashboard-rosca-legenda");
    if (legenda) {
      if (total === 0) {
        legenda.innerHTML = `<p style="color: var(--color-text-subtle); font-size: var(--text-xs);">Nenhuma solicitação cadastrada.</p>`;
        return;
      }
      legenda.innerHTML = dados.map((d) => `
        <div class="donut-legend-item">
          <span class="donut-legend-label">
            <span class="chart-legend-dot" style="background: ${d.cor};"></span>
            ${escapeHtml(d.rotulo)}
          </span>
          <span class="donut-legend-value">${d.valor}</span>
        </div>
      `).join("");
    }
  }

  function renderizarSolicitacoesPendentes(pendentes) {
    const container = document.getElementById("dashboard-pendentes");
    if (!container) return;

    if (pendentes.length === 0) {
      container.innerHTML = `<p style="color: var(--color-text-subtle); font-size: var(--text-sm); padding: var(--space-4);">Nenhuma solicitação pendente.</p>`;
      return;
    }

    const lista = pendentes.slice(0, 5).map((sol) => {
      const cliente = obterCliente(sol.clienteId);
      const servico = obterServico(sol.servicoId);
      const nomeCliente = cliente ? cliente.nome : "Cliente não encontrado";
      const nomeServico = servico ? servico.nome : "Serviço não encontrado";
      const data = sol.dataPreferencial && dataIsoValida(sol.dataPreferencial)
        ? formatarDataCurta(sol.dataPreferencial)
        : "Data não informada";

      return `
        <div class="pending-item">
          <div>
            <span class="pending-item-client">${escapeHtml(nomeCliente)}</span>
            <span class="pending-item-service">${escapeHtml(nomeServico)}</span>
          </div>
          <span class="pending-item-date">${escapeHtml(data)}</span>
        </div>
      `;
    });

    container.innerHTML = `<div class="pending-list">${lista.join("")}</div>`;
  }

  function renderizarAlertas() {
    const container = document.getElementById("dashboard-alertas");
    if (!container) return;

    const alertas = calcularAlertas();
    if (alertas.length === 0) {
      container.hidden = true;
      return;
    }

    container.hidden = false;
    const tipoClasse = { aviso: "", info: "", erro: "alert-item-danger" };
    const tipoSVG = {
      aviso: `<svg aria-hidden="true"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
      info: `<svg aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
      erro: `<svg aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`
    };

    container.innerHTML = `
      <div class="alert-strip" role="alert" aria-live="polite">
        ${alertas.map((a) => `
          <div class="alert-item ${tipoClasse[a.tipo] || ""}">
            ${tipoSVG[a.tipo] || tipoSVG.aviso}
            <span>${escapeHtml(a.texto)}</span>
          </div>
        `).join("")}
      </div>
    `;
  }

  function renderizarSaudacao() {
    const el = document.getElementById("dashboard-saudacao");
    if (!el) return;
    const { obterSaudacao } = FluxoCRM.compartilhado;
    if (obterSaudacao) el.textContent = obterSaudacao();
  }

  function renderizarData() {
    const el = document.getElementById("dashboard-data");
    if (!el) return;
    const agora = new Date();
    el.textContent = new Intl.DateTimeFormat("pt-BR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    }).format(agora);
  }

  function classeStatus(status) {
    const v = String(status || "").toLocaleLowerCase("pt-BR");
    if (v === "agendado") return "status-agendado";
    if (v === "cancelado") return "status-cancelado";
    if (v === "concluido" || v === "concluído") return "status-concluido";
    if (v.includes("aguardando")) return "status-aguardando";
    return "status-novo";
  }

  function formatarStatus(status) {
    const v = String(status || "").trim();
    if (!v) return "Sem status";
    return v.charAt(0).toLocaleUpperCase("pt-BR") + v.slice(1);
  }

  /* ── Inicialização ── */

  function iniciar() {
    // Carregar dados uma vez
    const agendamentosHoje = obterAgendamentosDeHoje();
    const proximo = obterProximoAgendamento();
    const pendentes = obterSolicitacoesPendentes();
    const clientes = FluxoCRM.repositories.clientes.listar();
    const servicosAtivos = obterServicosAtivos();

    renderizarSaudacao();
    renderizarData();
    renderizarMetrics(agendamentosHoje, pendentes, proximo, clientes, servicosAtivos);
    renderizarAgendaHoje(agendamentosHoje);
    renderizarProximoCompromisso(proximo);
    renderizarAcoesRapidas();
    renderizarGrafico();
    renderizarDistribuicaoSolicitacoes();
    renderizarSolicitacoesPendentes(pendentes);
    renderizarAlertas();
  }

  FluxoCRM.modulos.dashboard = { iniciar };
})(window.FluxoCRM);
