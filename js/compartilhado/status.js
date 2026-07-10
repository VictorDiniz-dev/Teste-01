(function (FluxoCRM) {
  const { escapeHtml } = FluxoCRM.compartilhado;

  function criarStatusClasse(status) {
    const texto = status.toLowerCase();

    if (texto.includes("novo")) return "status-novo";
    if (texto.includes("em atendimento")) return "status-em-atendimento";
    if (texto.includes("aguardando")) return "status-aguardando";
    if (texto.includes("agendado")) return "status-agendado";
    if (texto.includes("concluido")) return "status-concluido";
    if (texto.includes("perdido")) return "status-perdido";
    if (texto.includes("cancelado")) return "status-cancelado";
    if (texto.includes("retorno")) return "status-retorno";

    return "status-novo";
  }

  function criarStatus(status) {
    return `<span class="status ${criarStatusClasse(status)}">${escapeHtml(status)}</span>`;
  }

  Object.assign(FluxoCRM.compartilhado, { criarStatus, criarStatusClasse });
})(window.FluxoCRM);
