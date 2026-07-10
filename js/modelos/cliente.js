(function (FluxoCRM) {
  const {
    formatarTelefone,
    gerarId,
    normalizarTexto
  } = FluxoCRM.compartilhado;

  function criar(dados = {}) {
    return {
      id: dados.id || gerarId("cliente"),
      nome: normalizarTexto(dados.nome),
      telefone: formatarTelefone(dados.telefone),
      origem: normalizarTexto(dados.origem || "WhatsApp"),
      observacoes: normalizarTexto(dados.observacoes || ""),
      dataCriacao: dados.dataCriacao || new Date().toISOString()
    };
  }

  function valido(cliente) {
    return Boolean(cliente.nome && cliente.telefone);
  }

  FluxoCRM.modelos.cliente = { criar, valido };
})(window.FluxoCRM);
