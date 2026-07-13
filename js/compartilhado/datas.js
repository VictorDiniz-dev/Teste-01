(function (FluxoCRM) {
  /**
   * Retorna a data de hoje no formato YYYY-MM-DD usando hora local.
   * Evita o deslocamento de UTC que new Date().toISOString() causaria.
   */
  function obterDataHoje() {
    const agora = new Date();
    const ano = agora.getFullYear();
    const mes = String(agora.getMonth() + 1).padStart(2, "0");
    const dia = String(agora.getDate()).padStart(2, "0");
    return `${ano}-${mes}-${dia}`;
  }

  /**
   * Verifica se uma string YYYY-MM-DD é uma data ISO local válida.
   */
  function dataIsoValida(valor) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(valor || ""))) return false;
    const [ano, mes, dia] = valor.split("-").map(Number);
    const d = new Date(ano, mes - 1, dia);
    return d.getFullYear() === ano && d.getMonth() === mes - 1 && d.getDate() === dia;
  }

  /**
   * Converte um Date em YYYY-MM-DD local.
   */
  function dataParaIso(data) {
    return `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, "0")}-${String(data.getDate()).padStart(2, "0")}`;
  }

  /**
   * Calcula a diferença em dias entre hoje e uma data ISO (pode ser negativo).
   */
  function calcularDistanciaDias(iso) {
    if (!dataIsoValida(iso)) return null;
    const [ano, mes, dia] = iso.split("-").map(Number);
    const alvo = new Date(ano, mes - 1, dia);
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    alvo.setHours(0, 0, 0, 0);
    return Math.round((alvo - hoje) / 86400000);
  }

  /**
   * Retorna uma string legível para distância temporal.
   * Ex: "Hoje", "Amanhã", "Em 3 dias", "Há 2 dias", "12/07/2026"
   */
  function formatarDataAmigavel(iso) {
    const distancia = calcularDistanciaDias(iso);
    if (distancia === null) return "Data inválida";
    if (distancia === 0) return "Hoje";
    if (distancia === 1) return "Amanhã";
    if (distancia === -1) return "Ontem";
    if (distancia > 1 && distancia <= 30) return `Em ${distancia} dias`;
    if (distancia < -1 && distancia >= -30) return `Há ${Math.abs(distancia)} dias`;
    // Para datas mais distantes: formato dd/mm/yyyy
    const [ano, mes, dia] = iso.split("-");
    return `${dia}/${mes}/${ano}`;
  }

  /**
   * Formata data ISO para dd/mm/yyyy.
   */
  function formatarDataCurta(iso) {
    if (!dataIsoValida(iso)) return "Data inválida";
    const [ano, mes, dia] = iso.split("-");
    return `${dia}/${mes}/${ano}`;
  }

  /**
   * Formata data ISO para formato longo pt-BR.
   * Ex: "10 de julho de 2026"
   */
  function formatarDataLonga(iso) {
    if (!dataIsoValida(iso)) return "Data inválida";
    const [ano, mes, dia] = iso.split("-").map(Number);
    const d = new Date(ano, mes - 1, dia);
    return new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "long", year: "numeric" }).format(d);
  }

  /**
   * Retorna a saudação de acordo com o horário local.
   */
  function obterSaudacao() {
    const hora = new Date().getHours();
    if (hora < 12) return "Bom dia";
    if (hora < 18) return "Boa tarde";
    return "Boa noite";
  }

  Object.assign(FluxoCRM.compartilhado, {
    obterDataHoje,
    dataIsoValida,
    dataParaIso,
    calcularDistanciaDias,
    formatarDataAmigavel,
    formatarDataCurta,
    formatarDataLonga,
    obterSaudacao
  });
})(window.FluxoCRM);
