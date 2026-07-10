(function (FluxoCRM) {
  const modelo = FluxoCRM.modelos.cliente;

  FluxoCRM.repositories.clientes = FluxoCRM.repositories.criarColecaoRepository({
    chave: "fluxocrm_clientes",
    normalizar: modelo.criar,
    validar: modelo.valido,
    dadosIniciais: FluxoCRM.dados.clientesIniciais
  });
})(window.FluxoCRM);
