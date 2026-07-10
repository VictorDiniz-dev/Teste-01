(function (FluxoCRM) {
  const { escapeHtml, criarStatus } = FluxoCRM.compartilhado;

  function iniciar() {
    const lista = document.querySelector("#ticketsList");
    const contador = document.querySelector("#ticketsCount");
    if (!lista || !contador) return;

    const { atendimentos } = FluxoCRM.dados;
    contador.textContent = `${atendimentos.length} atendimentos`;
    lista.innerHTML = atendimentos.map((item) => `
    <article class="item-card">
      <div>
        <strong>${escapeHtml(item.cliente)}</strong>
        <div class="item-meta">
          <span>Proxima acao: ${escapeHtml(item.proximaAcao)}</span>
          <span>Retorno: ${escapeHtml(item.dataRetorno)}</span>
          <span>Responsavel: ${escapeHtml(item.responsavel)}</span>
        </div>
      </div>
      ${criarStatus(item.etapa)}
    </article>
  `).join("");
  }

  FluxoCRM.modulos.atendimentos = { iniciar };
})(window.FluxoCRM);
