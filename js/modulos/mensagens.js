(function (FluxoCRM) {
  const { escapeHtml } = FluxoCRM.compartilhado;

  function iniciar() {
    const lista = document.querySelector("#messagesList");
    const contador = document.querySelector("#messagesCount");
    if (!lista || !contador) return;

    const { mensagens } = FluxoCRM.dados;
    contador.textContent = `${mensagens.length} modelos`;
    lista.innerHTML = mensagens.map((mensagem) => `
    <article class="message-card">
      <span class="category-label">${escapeHtml(mensagem.categoria)}</span>
      <strong>${escapeHtml(mensagem.titulo)}</strong>
      <p>${escapeHtml(mensagem.texto)}</p>
    </article>
  `).join("");
  }

  FluxoCRM.modulos.mensagens = { iniciar };
})(window.FluxoCRM);
