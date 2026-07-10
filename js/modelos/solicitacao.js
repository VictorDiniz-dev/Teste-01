(function (FluxoCRM) {
  const { gerarId, normalizarTexto } = FluxoCRM.compartilhado;

  function criar(dados = {}) {
    return {
      id: dados.id || gerarId("solicitacao"),
      clienteId: dados.clienteId || null,
      servicoId: dados.servicoId || null,
      status: dados.status || null,
      dataPreferencial: dados.dataPreferencial || null,
      observacoes: normalizarTexto(dados.observacoes || ""),
      dataCriacao: dados.dataCriacao || new Date().toISOString()
    };
  }

  FluxoCRM.modelos.solicitacao = { criar };
})(window.FluxoCRM);
