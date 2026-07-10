(function (FluxoCRM) {
  const { escapeHtml, criarStatus } = FluxoCRM.compartilhado;

  function iniciar() {
    const tabela = document.querySelector("#appointmentsTable");
    const contador = document.querySelector("#appointmentsCount");
    if (!tabela || !contador) return;

    const { agendamentos } = FluxoCRM.dados;
    contador.textContent = `${agendamentos.length} agendamentos`;
    tabela.innerHTML = agendamentos.map((item) => `
    <tr>
      <td><strong>${escapeHtml(item.cliente)}</strong></td>
      <td>${escapeHtml(item.servico)}</td>
      <td>${escapeHtml(item.data)}</td>
      <td>${escapeHtml(item.horario)}</td>
      <td>${criarStatus(item.status)}</td>
    </tr>
  `).join("");
  }

  FluxoCRM.modulos.agendamentos = { iniciar };
})(window.FluxoCRM);
