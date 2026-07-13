(function (FluxoCRM) {
  /**
   * Cria um gráfico de barras verticais usando SVG puro.
   * Acessível: inclui título, role="img" e aria-label.
   *
   * @param {HTMLElement} container - Elemento onde o SVG será inserido
   * @param {Array<{rotulo: string, valor: number}>} dados
   * @param {object} opcoes
   * @param {string} opcoes.titulo - Título acessível
   * @param {string} [opcoes.corBarra="#4ade80"] - Cor das barras
   * @param {string} [opcoes.corBarraDestaque="#22d3ee"] - Cor de barra em destaque
   * @param {number} [opcoes.indiceDestaque=-1] - Índice da barra em destaque
   * @param {string} [opcoes.corTexto="#94a3b8"] - Cor dos rótulos
   * @param {number} [opcoes.alturaMaxima=120] - Altura máxima das barras em px
   */
  function criarGraficoBarras(container, dados, opcoes = {}) {
    const {
      titulo = "Gráfico",
      corBarra = "#4ade80",
      corBarraDestaque = "#22d3ee",
      indiceDestaque = -1,
      corTexto = "#94a3b8",
      alturaMaxima = 120
    } = opcoes;

    const larguraBarra = 32;
    const gapBarra = 12;
    const paddingV = 8;
    const paddingH = 8;
    const alturaRotulo = 20;
    const alturaValor = 18;
    const totalBarra = larguraBarra + gapBarra;
    const n = dados.length;
    const larguraTotal = n * totalBarra - gapBarra + paddingH * 2;
    const alturaTotal = alturaMaxima + paddingV * 2 + alturaRotulo + alturaValor;

    const maxValor = Math.max(...dados.map((d) => d.valor), 1);

    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("viewBox", `0 0 ${larguraTotal} ${alturaTotal}`);
    svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", titulo);
    svg.style.overflow = "visible";
    svg.style.display = "block";

    const svgTitulo = document.createElementNS(ns, "title");
    svgTitulo.textContent = titulo;
    svg.appendChild(svgTitulo);

    dados.forEach((item, i) => {
      const x = paddingH + i * totalBarra;
      const alturaBarraReal = maxValor > 0 ? Math.round((item.valor / maxValor) * alturaMaxima) : 0;
      const y = paddingV + alturaMaxima - alturaBarraReal;
      const cor = i === indiceDestaque ? corBarraDestaque : corBarra;

      // Barra
      if (alturaBarraReal > 0) {
        const rect = document.createElementNS(ns, "rect");
        rect.setAttribute("x", x);
        rect.setAttribute("y", y);
        rect.setAttribute("width", larguraBarra);
        rect.setAttribute("height", alturaBarraReal);
        rect.setAttribute("rx", "4");
        rect.setAttribute("fill", cor);
        rect.setAttribute("opacity", "0.9");
        svg.appendChild(rect);
      } else {
        // Barra mínima indicando zero
        const rect = document.createElementNS(ns, "rect");
        rect.setAttribute("x", x);
        rect.setAttribute("y", paddingV + alturaMaxima - 2);
        rect.setAttribute("width", larguraBarra);
        rect.setAttribute("height", "2");
        rect.setAttribute("rx", "1");
        rect.setAttribute("fill", cor);
        rect.setAttribute("opacity", "0.3");
        svg.appendChild(rect);
      }

      // Valor acima da barra
      if (item.valor > 0) {
        const textoValor = document.createElementNS(ns, "text");
        textoValor.setAttribute("x", x + larguraBarra / 2);
        textoValor.setAttribute("y", Math.max(y - 4, paddingV + 10));
        textoValor.setAttribute("text-anchor", "middle");
        textoValor.setAttribute("font-size", "11");
        textoValor.setAttribute("fill", cor);
        textoValor.setAttribute("font-weight", "700");
        textoValor.textContent = String(item.valor);
        svg.appendChild(textoValor);
      }

      // Rótulo abaixo
      const textoRotulo = document.createElementNS(ns, "text");
      textoRotulo.setAttribute("x", x + larguraBarra / 2);
      textoRotulo.setAttribute("y", paddingV + alturaMaxima + paddingV + 4);
      textoRotulo.setAttribute("text-anchor", "middle");
      textoRotulo.setAttribute("font-size", "10");
      textoRotulo.setAttribute("fill", corTexto);
      textoRotulo.textContent = item.rotulo;
      svg.appendChild(textoRotulo);
    });

    container.replaceChildren(svg);
  }

  /**
   * Cria um gráfico de rosca simples (donut) usando SVG.
   * Acessível: inclui role="img" e lista textual alternativa.
   *
   * @param {HTMLElement} container
   * @param {Array<{rotulo: string, valor: number, cor: string}>} dados
   * @param {string} titulo
   */
  function criarGraficoRosca(container, dados, titulo = "Distribuição") {
    const ns = "http://www.w3.org/2000/svg";
    const raio = 50;
    const espessura = 16;
    const raioInterno = raio - espessura;
    const total = dados.reduce((s, d) => s + d.valor, 0);

    const svg = document.createElementNS(ns, "svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("viewBox", `0 0 ${raio * 2} ${raio * 2}`);
    svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", titulo);

    const svgTitulo = document.createElementNS(ns, "title");
    svgTitulo.textContent = `${titulo}: ${dados.map((d) => `${d.rotulo} ${d.valor}`).join(", ")}`;
    svg.appendChild(svgTitulo);

    if (total === 0) {
      const circle = document.createElementNS(ns, "circle");
      circle.setAttribute("cx", raio);
      circle.setAttribute("cy", raio);
      circle.setAttribute("r", raio - espessura / 2);
      circle.setAttribute("fill", "none");
      circle.setAttribute("stroke", "rgba(255,255,255,0.1)");
      circle.setAttribute("stroke-width", espessura);
      svg.appendChild(circle);
      container.replaceChildren(svg);
      return;
    }

    const circunferencia = 2 * Math.PI * (raio - espessura / 2);
    let offset = 0;

    dados.forEach((item) => {
      if (item.valor === 0) return;
      const comprimento = (item.valor / total) * circunferencia;
      const circle = document.createElementNS(ns, "circle");
      circle.setAttribute("cx", raio);
      circle.setAttribute("cy", raio);
      circle.setAttribute("r", raio - espessura / 2);
      circle.setAttribute("fill", "none");
      circle.setAttribute("stroke", item.cor);
      circle.setAttribute("stroke-width", espessura);
      circle.setAttribute("stroke-dasharray", `${comprimento} ${circunferencia - comprimento}`);
      circle.setAttribute("stroke-dashoffset", -offset);
      circle.setAttribute("transform", `rotate(-90 ${raio} ${raio})`);
      svg.appendChild(circle);
      offset += comprimento;
    });

    // Texto central: total
    const textoTotal = document.createElementNS(ns, "text");
    textoTotal.setAttribute("x", raio);
    textoTotal.setAttribute("y", raio + 2);
    textoTotal.setAttribute("text-anchor", "middle");
    textoTotal.setAttribute("dominant-baseline", "middle");
    textoTotal.setAttribute("font-size", "18");
    textoTotal.setAttribute("font-weight", "700");
    textoTotal.setAttribute("fill", "#f1f5f9");
    textoTotal.textContent = String(total);
    svg.appendChild(textoTotal);

    const textoLabel = document.createElementNS(ns, "text");
    textoLabel.setAttribute("x", raio);
    textoLabel.setAttribute("y", raio + 14);
    textoLabel.setAttribute("text-anchor", "middle");
    textoLabel.setAttribute("dominant-baseline", "middle");
    textoLabel.setAttribute("font-size", "9");
    textoLabel.setAttribute("fill", "rgba(241,245,249,0.5)");
    textoLabel.textContent = "total";
    svg.appendChild(textoLabel);

    container.replaceChildren(svg);
  }

  Object.assign(FluxoCRM.compartilhado, { criarGraficoBarras, criarGraficoRosca });
})(window.FluxoCRM);
