(function (FluxoCRM) {
  FluxoCRM.repositories.servicos = FluxoCRM.repositories.criarColecaoRepository({
    chave: "fluxocrm_servicos",
    normalizar: FluxoCRM.modelos.servico.criar
  });
})(window.FluxoCRM);
