(function (FluxoCRM) {
  FluxoCRM.modulos.menu.iniciar();

  const pagina = document.body.dataset.page;
  const modulo = FluxoCRM.modulos[pagina];

  if (modulo) {
    modulo.iniciar();
  }
})(window.FluxoCRM);
