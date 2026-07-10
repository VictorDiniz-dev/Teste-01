(function (FluxoCRM) {
  const repository = FluxoCRM.repositories.servicos;
  const modelo = FluxoCRM.modelos.servico;
  const { normalizarTexto } = FluxoCRM.compartilhado;
  const servicos = repository.listar();
  let idEmEdicao = null;

  function normalizarNomeParaComparacao(nome) {
    return normalizarTexto(nome)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLocaleLowerCase("pt-BR");
  }

  function mostrarFeedback(mensagem, tipo) {
    const feedback = document.getElementById("servicos-feedback");
    if (!feedback) return;
    feedback.textContent = mensagem;
    feedback.dataset.status = tipo;
  }

  function criarBotao(rotulo, acao, classe) {
    const botao = document.createElement("button");
    botao.type = "button";
    botao.className = classe;
    botao.textContent = rotulo;
    botao.dataset.acao = acao;
    return botao;
  }

  function criarLinha(servico) {
    const linha = document.createElement("tr");
    linha.dataset.id = servico.id;

    const nome = document.createElement("td");
    const duracao = document.createElement("td");
    const status = document.createElement("td");
    const acoes = document.createElement("td");
    const selo = document.createElement("span");
    const grupoAcoes = document.createElement("div");

    nome.textContent = servico.nome;
    duracao.textContent = `${servico.duracao} minutos`;
    selo.className = `status ${servico.ativo ? "status-ativo" : "status-inativo"}`;
    selo.textContent = servico.ativo ? "Ativo" : "Inativo";
    status.appendChild(selo);

    grupoAcoes.className = "table-actions";
    grupoAcoes.append(
      criarBotao("Editar", "editar", "action-button"),
      criarBotao(servico.ativo ? "Desativar" : "Ativar", "alternar-status", "action-button")
    );
    acoes.appendChild(grupoAcoes);
    linha.append(nome, duracao, status, acoes);
    return linha;
  }

  function renderizar() {
    const lista = document.getElementById("servicos-lista");
    const contador = document.getElementById("servicos-contador");
    if (!lista || !contador) return;

    contador.textContent = `${servicos.length} ${servicos.length === 1 ? "serviço" : "serviços"}`;
    lista.replaceChildren();

    if (servicos.length === 0) {
      const linha = document.createElement("tr");
      const celula = document.createElement("td");
      celula.colSpan = 4;
      celula.textContent = "Nenhum serviço cadastrado ainda.";
      linha.appendChild(celula);
      lista.appendChild(linha);
      return;
    }

    servicos.forEach((servico) => lista.appendChild(criarLinha(servico)));
  }

  function validar(nome, duracaoInformada) {
    const nomeNormalizado = normalizarTexto(nome);

    if (!nomeNormalizado) return "Informe o nome do serviço.";
    if (nomeNormalizado.length < 3) return "O nome deve ter pelo menos 3 caracteres.";
    if (duracaoInformada === "") return "Informe a duração do serviço.";
    if (!/^\d+$/.test(duracaoInformada)) return "A duração deve ser um número inteiro positivo.";

    const duracao = Number(duracaoInformada);
    if (duracao < 5 || duracao > 1440) {
      return "A duração deve ser de 5 a 1440 minutos.";
    }

    const nomeComparavel = normalizarNomeParaComparacao(nomeNormalizado);
    const duplicado = servicos.some(
      (servico) => servico.id !== idEmEdicao && normalizarNomeParaComparacao(servico.nome) === nomeComparavel
    );
    if (duplicado) return "Já existe um serviço cadastrado com este nome.";

    return "";
  }

  function encerrarEdicao(limparFeedback = false) {
    idEmEdicao = null;
    document.getElementById("form-servico").reset();
    document.getElementById("servico-form-titulo").textContent = "Novo serviço";
    document.getElementById("salvar-servico").textContent = "Cadastrar serviço";
    document.getElementById("cancelar-edicao").hidden = true;
    if (limparFeedback) mostrarFeedback("", "");
  }

  function iniciarEdicao(servico) {
    idEmEdicao = servico.id;
    document.getElementById("nome-servico").value = servico.nome;
    document.getElementById("duracao-servico").value = servico.duracao;
    document.getElementById("servico-form-titulo").textContent = "Editar serviço";
    document.getElementById("salvar-servico").textContent = "Salvar alterações";
    document.getElementById("cancelar-edicao").hidden = false;
    mostrarFeedback("", "");
    document.getElementById("nome-servico").focus();
  }

  function configurarFormulario() {
    const formulario = document.getElementById("form-servico");
    if (!formulario) return;

    formulario.addEventListener("submit", (event) => {
      event.preventDefault();
      const nome = document.getElementById("nome-servico").value;
      const duracaoInformada = document.getElementById("duracao-servico").value.trim();
      const erro = validar(nome, duracaoInformada);

      if (erro) {
        mostrarFeedback(erro, "erro");
        return;
      }

      const dados = { nome: normalizarTexto(nome), duracao: Number(duracaoInformada) };
      if (idEmEdicao) {
        const indice = servicos.findIndex((servico) => servico.id === idEmEdicao);
        if (indice === -1) return;
        servicos[indice] = modelo.criar({ ...servicos[indice], ...dados });
        repository.salvarTodos(servicos);
        renderizar();
        encerrarEdicao();
        mostrarFeedback("Serviço atualizado com sucesso.", "sucesso");
      } else {
        servicos.push(modelo.criar(dados));
        repository.salvarTodos(servicos);
        renderizar();
        formulario.reset();
        document.getElementById("nome-servico").focus();
        mostrarFeedback("Serviço cadastrado com sucesso.", "sucesso");
      }
    });

    document.getElementById("cancelar-edicao").addEventListener("click", () => {
      encerrarEdicao();
      mostrarFeedback("Edição cancelada.", "sucesso");
    });

    document.getElementById("novo-servico").addEventListener("click", () => {
      encerrarEdicao(true);
      document.getElementById("nome-servico").focus();
    });
  }

  function configurarListagem() {
    const lista = document.getElementById("servicos-lista");
    if (!lista) return;

    lista.addEventListener("click", (event) => {
      const botao = event.target.closest("button[data-acao]");
      const linha = event.target.closest("tr[data-id]");
      if (!botao || !linha) return;

      const servico = servicos.find((item) => item.id === linha.dataset.id);
      if (!servico) return;

      if (botao.dataset.acao === "editar") {
        iniciarEdicao(servico);
        return;
      }

      servico.ativo = !servico.ativo;
      repository.salvarTodos(servicos);
      renderizar();
      mostrarFeedback(
        `Serviço ${servico.ativo ? "ativado" : "desativado"} com sucesso.`,
        "sucesso"
      );
    });
  }

  function iniciar() {
    configurarFormulario();
    configurarListagem();
    renderizar();
  }

  FluxoCRM.modulos.servicos = { iniciar };
})(window.FluxoCRM);
