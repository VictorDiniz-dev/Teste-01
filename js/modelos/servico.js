(function (FluxoCRM) {
  const { gerarId, normalizarTexto } = FluxoCRM.compartilhado;

  function criar(dados = {}) {
    return {
      id: dados.id || gerarId("servico"),
      nome: normalizarTexto(dados.nome),
      duracao: dados.duracao ?? null,
      ativo: dados.ativo ?? true
    };
  }

  FluxoCRM.modelos.servico = { criar };
})(window.FluxoCRM);
