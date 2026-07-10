(function (FluxoCRM) {
  function iniciar() {
    const botao = document.querySelector(".menu-toggle");
    const menu = document.querySelector(".main-nav");

    if (!botao || !menu) return;

    botao.addEventListener("click", () => {
      menu.classList.toggle("open");
    });
  }

  FluxoCRM.modulos.menu = { iniciar };
})(window.FluxoCRM);
