(function (FluxoCRM) {
  function criarArmazenamentoJson(chave) {
    return {
      ler() {
        try {
          const valor = localStorage.getItem(chave);
          return valor ? JSON.parse(valor) : null;
        } catch {
          return null;
        }
      },

      salvar(valor) {
        try {
          localStorage.setItem(chave, JSON.stringify(valor));
          return true;
        } catch {
          return false;
        }
      }
    };
  }

  FluxoCRM.core.criarArmazenamentoJson = criarArmazenamentoJson;
})(window.FluxoCRM);
