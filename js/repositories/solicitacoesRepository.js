(function (FluxoCRM) {
  FluxoCRM.repositories.solicitacoes = FluxoCRM.repositories.criarColecaoRepository({
    chave: "fluxocrm_solicitacoes",
    normalizar: FluxoCRM.modelos.solicitacao.criar
  });
})(window.FluxoCRM);
