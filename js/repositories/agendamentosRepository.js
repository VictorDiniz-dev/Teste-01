(function (FluxoCRM) {
  FluxoCRM.repositories.agendamentos = FluxoCRM.repositories.criarColecaoRepository({
    chave: "fluxocrm_agendamentos",
    normalizar: FluxoCRM.modelos.agendamento.criar
  });
})(window.FluxoCRM);
