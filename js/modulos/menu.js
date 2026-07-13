(function (FluxoCRM) {
  /**
   * Sidebar e menu mobile com acessibilidade completa.
   * - Desktop: sidebar fixa com colapso
   * - Mobile: drawer com trap de foco, Escape, scroll bloqueado
   */
  function iniciar() {
    configurarSidebarDesktop();
    configurarMenuMobile();
    marcarItemAtivo();
  }

  /* ── Desktop: colapsar/expandir sidebar ── */
  function configurarSidebarDesktop() {
    const botaoColapsar = document.getElementById("sidebar-collapse-btn");
    const layout = document.querySelector(".app-layout");
    if (!botaoColapsar || !layout) return;

    // Restaurar preferência
    const colapsada = localStorage.getItem("fluxocrm_sidebar_collapsed") === "1";
    if (colapsada) {
      layout.classList.add("sidebar-collapsed");
      botaoColapsar.setAttribute("aria-expanded", "false");
      botaoColapsar.setAttribute("aria-label", "Expandir menu lateral");
    } else {
      botaoColapsar.setAttribute("aria-expanded", "true");
      botaoColapsar.setAttribute("aria-label", "Recolher menu lateral");
    }

    botaoColapsar.addEventListener("click", () => {
      const estaColapsada = layout.classList.toggle("sidebar-collapsed");
      botaoColapsar.setAttribute("aria-expanded", String(!estaColapsada));
      botaoColapsar.setAttribute(
        "aria-label",
        estaColapsada ? "Expandir menu lateral" : "Recolher menu lateral"
      );
      localStorage.setItem("fluxocrm_sidebar_collapsed", estaColapsada ? "1" : "0");
    });
  }

  /* ── Mobile: drawer com overlay e trap de foco ── */
  function configurarMenuMobile() {
    const botaoAbrir = document.getElementById("mobile-menu-toggle");
    const sidebar = document.querySelector(".sidebar");
    const overlay = document.getElementById("mobile-overlay");
    if (!botaoAbrir || !sidebar || !overlay) return;

    let focalAnterior = null;

    function abrirMenu() {
      sidebar.classList.add("mobile-open");
      overlay.classList.add("open");
      document.body.style.overflow = "hidden";
      botaoAbrir.setAttribute("aria-expanded", "true");
      focalAnterior = document.activeElement;

      // Foco no primeiro elemento focável do menu
      const primeiro = obterFocaveis(sidebar)[0];
      if (primeiro) primeiro.focus();

      sidebar.addEventListener("keydown", tratarTeclado);
    }

    function fecharMenu() {
      sidebar.classList.remove("mobile-open");
      overlay.classList.remove("open");
      document.body.style.overflow = "";
      botaoAbrir.setAttribute("aria-expanded", "false");
      sidebar.removeEventListener("keydown", tratarTeclado);

      // Restaurar foco
      if (focalAnterior) {
        focalAnterior.focus();
        focalAnterior = null;
      }
    }

    function tratarTeclado(event) {
      if (event.key === "Escape") {
        fecharMenu();
        return;
      }

      if (event.key === "Tab") {
        const focaveis = obterFocaveis(sidebar);
        if (focaveis.length === 0) return;
        const primeiro = focaveis[0];
        const ultimo = focaveis[focaveis.length - 1];

        if (event.shiftKey) {
          if (document.activeElement === primeiro) {
            event.preventDefault();
            ultimo.focus();
          }
        } else {
          if (document.activeElement === ultimo) {
            event.preventDefault();
            primeiro.focus();
          }
        }
      }
    }

    botaoAbrir.addEventListener("click", () => {
      if (sidebar.classList.contains("mobile-open")) {
        fecharMenu();
      } else {
        abrirMenu();
      }
    });

    overlay.addEventListener("click", fecharMenu);

    // Fechar ao clicar em link de navegação (mobile)
    sidebar.querySelectorAll(".nav-item[href]").forEach((link) => {
      link.addEventListener("click", () => {
        if (sidebar.classList.contains("mobile-open")) {
          fecharMenu();
        }
      });
    });
  }

  function obterFocaveis(container) {
    const seletor = [
      "a[href]",
      "button:not([disabled])",
      "input:not([disabled])",
      "select:not([disabled])",
      "textarea:not([disabled])",
      "[tabindex]:not([tabindex='-1'])"
    ].join(", ");
    return Array.from(container.querySelectorAll(seletor)).filter(
      (el) => el.offsetWidth > 0 || el.offsetHeight > 0
    );
  }

  /* ── Marcar item ativo via aria-current ── */
  function marcarItemAtivo() {
    const pagina = document.body.dataset.page;
    if (!pagina) return;

    const mapaItems = {
      dashboard: "nav-item-dashboard",
      agenda: "nav-item-agenda",
      solicitacoes: "nav-item-solicitacoes",
      clientes: "nav-item-clientes",
      servicos: "nav-item-servicos",
      configuracoes: "nav-item-configuracoes"
    };

    const idAtivo = mapaItems[pagina];
    if (!idAtivo) return;

    const itemAtivo = document.getElementById(idAtivo);
    if (itemAtivo) {
      itemAtivo.classList.add("active");
      itemAtivo.setAttribute("aria-current", "page");
    }
  }

  FluxoCRM.modulos.menu = { iniciar };
})(window.FluxoCRM);
