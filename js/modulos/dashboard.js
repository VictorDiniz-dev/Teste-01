(function (FluxoCRM) {
  const { escapeHtml, criarStatus } = FluxoCRM.compartilhado;

  function iniciar() {
    const clientes = FluxoCRM.modulos.clientes.obterTodos();
    const { atendimentos, agendamentos } = FluxoCRM.dados;
    const cards = [
      { rotulo: "Total de clientes", valor: clientes.length },
      { rotulo: "Atendimentos pendentes", valor: atendimentos.filter((item) => item.etapa !== "Concluido" && item.etapa !== "Perdido").length },
      { rotulo: "Agendamentos do dia", valor: agendamentos.filter((item) => item.data === "08/07/2026").length },
      { rotulo: "Retornos futuros", valor: atendimentos.filter((item) => item.etapa === "Retorno futuro").length }
    ];
    const summaryCards = document.querySelector("#summaryCards");
    const nextTicketsList = document.querySelector("#nextTicketsList");
    const todayAppointmentsList = document.querySelector("#todayAppointmentsList");
    if (!summaryCards || !nextTicketsList || !todayAppointmentsList) return;

    summaryCards.innerHTML = cards.map((card) => `
        <article class="summary-card">
          <span>${card.rotulo}</span>
          <strong>${card.valor}</strong>
        </article>
      `).join("");

    const proximosAtendimentos = atendimentos.filter((item) => item.etapa !== "Concluido");
    const nextTicketsCount = document.querySelector("#nextTicketsCount");
    if (nextTicketsCount) nextTicketsCount.textContent = `${proximosAtendimentos.length} itens`;

    nextTicketsList.innerHTML = proximosAtendimentos.slice(0, 4).map((item) => `
    <div class="list-item">
      <strong>${escapeHtml(item.cliente)}</strong>
      ${criarStatus(item.etapa)}
      <div class="item-meta">
        <span>${escapeHtml(item.proximaAcao)}</span>
        <span>Retorno: ${escapeHtml(item.dataRetorno)}</span>
      </div>
    </div>
  `).join("");

    const agendamentosDoDia = agendamentos.filter((item) => item.data === "08/07/2026");
    const todayAppointmentsCount = document.querySelector("#todayAppointmentsCount");
    if (todayAppointmentsCount) todayAppointmentsCount.textContent = `${agendamentosDoDia.length} itens`;

    todayAppointmentsList.innerHTML = agendamentosDoDia.map((item) => `
    <div class="list-item">
      <strong>${escapeHtml(item.cliente)}</strong>
      <div>${escapeHtml(item.servico)}</div>
      <div class="item-meta">
        <span>${escapeHtml(item.horario)}</span>
        ${criarStatus(item.status)}
      </div>
    </div>
  `).join("");
  }

  FluxoCRM.modulos.dashboard = { iniciar };
})(window.FluxoCRM);
