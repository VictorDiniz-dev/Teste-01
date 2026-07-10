(function (FluxoCRM) {
  const { gerarId } = FluxoCRM.compartilhado;

  function criar(dados = {}) {
    return {
      id: dados.id || gerarId("agendamento"),
      clienteId: dados.clienteId || null,
      servicoId: dados.servicoId || null,
      data: dados.data || null,
      horario: dados.horario || null,
      status: dados.status || null
    };
  }

  FluxoCRM.modelos.agendamento = { criar };
})(window.FluxoCRM);
