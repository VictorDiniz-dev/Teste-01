(function (FluxoCRM) {
  function criarColecaoRepository({ chave, normalizar, validar = () => true, dadosIniciais = [] }) {
    const armazenamento = FluxoCRM.core.criarArmazenamentoJson(chave);
    let cache = null;

    function normalizarLista(lista) {
      return lista
        .filter((item) => item && typeof item === "object")
        .map((item) => normalizar(item))
        .filter((item) => validar(item));
    }

    function listar() {
      if (cache) return cache;

      const dadosArmazenados = armazenamento.ler();
      const possuiDados = Array.isArray(dadosArmazenados) && dadosArmazenados.length > 0;
      const origem = possuiDados ? dadosArmazenados : dadosIniciais.map((item) => ({ ...item }));
      cache = normalizarLista(origem);

      if (JSON.stringify(dadosArmazenados) !== JSON.stringify(cache)) {
        armazenamento.salvar(cache);
      }

      return cache;
    }

    function salvarTodos(lista) {
      const dadosNormalizados = normalizarLista(lista);
      if (!armazenamento.salvar(dadosNormalizados)) return null;
      cache = dadosNormalizados;
      return cache;
    }

    return { listar, salvarTodos };
  }

  FluxoCRM.repositories.criarColecaoRepository = criarColecaoRepository;
})(window.FluxoCRM);
