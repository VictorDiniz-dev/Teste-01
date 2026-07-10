(function (FluxoCRM) {
  const itens = [
    { grupo: "Principal", links: [["index.html", "Visão Geral", "⌂"], ["agenda.html", "Agenda", "▦"], ["solicitacoes.html", "Solicitações", "◇"]] },
    { grupo: "Gestão", links: [["clientes.html", "Clientes", "◎"], ["servicos.html", "Serviços", "◆"]] }
  ];

  function criarLink([href, rotulo, icone], pagina) {
    const link = document.createElement("a");
    const atual = href === "index.html" ? pagina === "dashboard" : href.startsWith(`${pagina}.`);
    link.href = href;
    link.title = rotulo;
    if (atual || (pagina === "agendamentos" && href === "agenda.html")) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
    const simbolo = document.createElement("span");
    simbolo.className = "nav-icon";
    simbolo.setAttribute("aria-hidden", "true");
    simbolo.textContent = icone;
    const texto = document.createElement("span");
    texto.className = "nav-label";
    texto.textContent = rotulo;
    link.append(simbolo, texto);
    return link;
  }

  function construirNavegacao(sidebar) {
    const pagina = document.body.dataset.page;
    sidebar.replaceChildren();
    const marca = document.createElement("a");
    marca.className = "brand";
    marca.href = "index.html";
    marca.innerHTML = '<span class="brand-mark" aria-hidden="true">F</span><span class="brand-copy"><strong>FluxoCRM</strong><small>Atendimento organizado</small></span>';
    sidebar.appendChild(marca);
    const nav = document.createElement("nav");
    nav.className = "main-nav";
    nav.id = "main-navigation";
    nav.setAttribute("aria-label", "Navegação principal");
    itens.forEach(({ grupo, links }) => {
      const secao = document.createElement("div");
      secao.className = "nav-section";
      const titulo = document.createElement("p");
      titulo.className = "nav-heading";
      titulo.textContent = grupo;
      secao.appendChild(titulo);
      links.forEach((item) => secao.appendChild(criarLink(item, pagina)));
      nav.appendChild(secao);
    });
    const sistema = document.createElement("div");
    sistema.className = "nav-section nav-system";
    const titulo = document.createElement("p");
    titulo.className = "nav-heading";
    titulo.textContent = "Sistema";
    sistema.append(titulo, criarLink(["configuracoes.html", "Configurações", "⚙"], pagina));
    nav.appendChild(sistema);
    sidebar.appendChild(nav);
    const recolher = document.createElement("button");
    recolher.className = "sidebar-collapse";
    recolher.type = "button";
    recolher.setAttribute("aria-label", "Recolher menu lateral");
    recolher.innerHTML = '<span aria-hidden="true">«</span><span class="nav-label">Recolher menu</span>';
    sidebar.appendChild(recolher);
    return recolher;
  }

  function iniciar() {
    const sidebar = document.querySelector(".sidebar");
    if (!sidebar) return;
    sidebar.id = "sidebar";
    const recolher = construirNavegacao(sidebar);
    const backdrop = document.createElement("button");
    backdrop.type = "button";
    backdrop.className = "menu-backdrop";
    backdrop.setAttribute("aria-label", "Fechar menu");
    document.body.appendChild(backdrop);
    const abrir = document.createElement("button");
    abrir.type = "button";
    abrir.className = "mobile-menu-button";
    abrir.setAttribute("aria-label", "Abrir menu");
    abrir.setAttribute("aria-controls", "sidebar");
    abrir.setAttribute("aria-expanded", "false");
    abrir.textContent = "☰";
    document.querySelector(".main-content")?.prepend(abrir);
    let focoAnterior = null;

    function fechar() {
      sidebar.classList.remove("open");
      document.body.classList.remove("menu-open");
      abrir.setAttribute("aria-expanded", "false");
      if (focoAnterior) focoAnterior.focus();
    }
    function abrirMenu() {
      focoAnterior = document.activeElement;
      sidebar.classList.add("open");
      document.body.classList.add("menu-open");
      abrir.setAttribute("aria-expanded", "true");
      sidebar.querySelector("a")?.focus();
    }
    abrir.addEventListener("click", () => sidebar.classList.contains("open") ? fechar() : abrirMenu());
    backdrop.addEventListener("click", fechar);
    sidebar.querySelectorAll("a").forEach((link) => link.addEventListener("click", fechar));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && sidebar.classList.contains("open")) fechar();
      if (event.key !== "Tab" || !sidebar.classList.contains("open")) return;
      const focaveis = [...sidebar.querySelectorAll("a, button")];
      const primeiro = focaveis[0];
      const ultimo = focaveis[focaveis.length - 1];
      if (event.shiftKey && document.activeElement === primeiro) { event.preventDefault(); ultimo.focus(); }
      if (!event.shiftKey && document.activeElement === ultimo) { event.preventDefault(); primeiro.focus(); }
    });
    recolher.addEventListener("click", () => {
      document.body.classList.toggle("sidebar-collapsed");
      const recolhida = document.body.classList.contains("sidebar-collapsed");
      recolher.setAttribute("aria-label", recolhida ? "Expandir menu lateral" : "Recolher menu lateral");
      recolher.querySelector("[aria-hidden]").textContent = recolhida ? "»" : "«";
    });
  }

  FluxoCRM.modulos.menu = { iniciar };
})(window.FluxoCRM);
