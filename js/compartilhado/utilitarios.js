(function (FluxoCRM) {
  function normalizarTexto(valor) {
    return String(valor || "").trim().replace(/\s+/g, " ");
  }

  function normalizarTelefone(valor) {
    return String(valor || "").replace(/\D/g, "").slice(0, 11);
  }

  function formatarTelefone(valor) {
    const numeros = normalizarTelefone(valor);

    if (numeros.length === 0) return "";
    if (numeros.length <= 2) return `(${numeros}`;
    if (numeros.length <= 6) return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
    if (numeros.length <= 10) {
      return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 6)}-${numeros.slice(6)}`;
    }

    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`;
  }

  function gerarId(prefixo = "registro") {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      return window.crypto.randomUUID();
    }

    return `${prefixo}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function gerarIdCliente() {
    return gerarId("cliente");
  }

  function escapeHtml(valor) {
    return String(valor)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  Object.assign(FluxoCRM.compartilhado, {
    escapeHtml,
    formatarTelefone,
    gerarId,
    gerarIdCliente,
    normalizarTelefone,
    normalizarTexto
  });
})(window.FluxoCRM);
