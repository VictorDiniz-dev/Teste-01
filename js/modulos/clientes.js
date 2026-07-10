(function (FluxoCRM) {
  const CHAVE_ARMAZENAMENTO = "fluxocrm_clientes";
  const armazenamento = FluxoCRM.core.criarArmazenamentoJson(CHAVE_ARMAZENAMENTO);
  const {
    formatarTelefone,
    gerarIdCliente,
    normalizarTelefone,
    normalizarTexto
  } = FluxoCRM.compartilhado;

  function lerClientes() {
    const dados = armazenamento.ler();
    if (!Array.isArray(dados)) return [];

    return dados
      .filter((cliente) => cliente && typeof cliente === "object")
      .map((cliente) => ({
        id: cliente.id || gerarIdCliente(),
        nome: normalizarTexto(cliente.nome),
        telefone: formatarTelefone(cliente.telefone),
        origem: normalizarTexto(cliente.origem || "WhatsApp"),
        observacoes: normalizarTexto(cliente.observacoes || "")
      }))
      .filter((cliente) => cliente.nome && cliente.telefone);
  }

  function carregarClientes() {
    const dadosSalvos = lerClientes();
    if (dadosSalvos.length > 0) return dadosSalvos;

    const iniciais = FluxoCRM.dados.clientesIniciais.map((cliente) => ({ ...cliente }));
    armazenamento.salvar(iniciais);
    return iniciais;
  }

  const clientes = carregarClientes();

  function criarLinhaCliente(cliente) {
    const tr = document.createElement("tr");
    const nome = document.createElement("td");
    const telefone = document.createElement("td");
    const origem = document.createElement("td");
    const observacoes = document.createElement("td");

    nome.textContent = cliente.nome;
    telefone.textContent = cliente.telefone;
    origem.textContent = cliente.origem;
    observacoes.textContent = cliente.observacoes;
    tr.append(nome, telefone, origem, observacoes);
    return tr;
  }

  function renderizar() {
    const tabela = document.querySelector("#clientsTable");
    const contador = document.querySelector("#clientsCount");
    if (!tabela || !contador) return;

    contador.textContent = `${clientes.length} clientes`;
    tabela.replaceChildren();

    if (clientes.length === 0) {
      const tr = document.createElement("tr");
      const td = document.createElement("td");
      td.colSpan = 4;
      td.textContent = "Nenhum cliente cadastrado ainda.";
      tr.appendChild(td);
      tabela.appendChild(tr);
      return;
    }

    clientes.forEach((cliente) => tabela.appendChild(criarLinhaCliente(cliente)));
  }

  function validar({ nome, telefone }) {
    const nomeNormalizado = normalizarTexto(nome);
    const telefoneNormalizado = normalizarTelefone(telefone);

    if (!nomeNormalizado || !telefoneNormalizado) {
      return { valido: false, mensagem: "Preencha o nome e o telefone." };
    }
    if (nomeNormalizado.length < 3) {
      return { valido: false, mensagem: "Digite um nome com pelo menos 3 caracteres." };
    }
    if (!/[A-Za-zÀ-ÿ]/.test(nomeNormalizado)) {
      return { valido: false, mensagem: "Digite um nome valido." };
    }
    if (telefoneNormalizado.length < 10 || telefoneNormalizado.length > 11) {
      return { valido: false, mensagem: "Digite um telefone valido com DDD." };
    }
    if (/^(\d)\1+$/.test(telefoneNormalizado)) {
      return { valido: false, mensagem: "Digite um telefone valido com DDD." };
    }

    return { valido: true, mensagem: "" };
  }

  function mostrarFeedback(elemento, mensagem, tipo) {
    elemento.textContent = mensagem;
    elemento.dataset.status = tipo;
  }

  function configurarFormulario() {
    const formulario = document.getElementById("form-cliente");
    const campoTelefone = document.getElementById("telefone-cliente");
    const feedback = document.getElementById("clientes-feedback");
    if (!formulario || !campoTelefone || !feedback) return;

    campoTelefone.addEventListener("input", () => {
      campoTelefone.value = formatarTelefone(campoTelefone.value);
    });

    formulario.addEventListener("submit", (event) => {
      event.preventDefault();
      const nome = document.getElementById("nome-cliente").value.trim();
      const telefone = campoTelefone.value.trim();
      const origem = document.getElementById("origem-cliente").value;
      const observacoes = document.getElementById("observacoes-cliente").value.trim();
      const validacao = validar({ nome, telefone });

      if (!validacao.valido) {
        mostrarFeedback(feedback, validacao.mensagem, "erro");
        return;
      }

      const telefoneNormalizado = normalizarTelefone(telefone);
      const telefoneJaExiste = clientes.some(
        (cliente) => normalizarTelefone(cliente.telefone) === telefoneNormalizado
      );

      if (telefoneJaExiste) {
        mostrarFeedback(feedback, "Ja existe um cliente cadastrado com este telefone.", "erro");
        return;
      }

      clientes.push({
        id: gerarIdCliente(),
        nome: normalizarTexto(nome),
        telefone: formatarTelefone(telefoneNormalizado),
        origem: normalizarTexto(origem),
        observacoes: normalizarTexto(observacoes)
      });
      armazenamento.salvar(clientes);
      renderizar();
      formulario.reset();
      campoTelefone.focus();
      mostrarFeedback(feedback, "Cliente salvo com sucesso.", "sucesso");
    });
  }

  function iniciar() {
    configurarFormulario();
    renderizar();
  }

  FluxoCRM.modulos.clientes = {
    iniciar,
    obterTodos: () => clientes
  };
})(window.FluxoCRM);
