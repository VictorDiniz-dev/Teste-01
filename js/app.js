/* =========================================================
   FluxoCRM - JavaScript do prototipo
   Este arquivo usa dados locais para montar as telas.
   Neste momento nao existe backend nem banco de dados.
   ========================================================= */

const ARMAZENAMENTO_CLIENTES = "fluxocrm_clientes";

const clientesIniciais = [
  {
    id: gerarIdCliente(),
    nome: "Ana Souza",
    telefone: "(11) 99999-0101",
    origem: "WhatsApp",
    observacoes: "Quer agendar corte e hidratacao."
  },
  {
    id: gerarIdCliente(),
    nome: "Carlos Lima",
    telefone: "(21) 98888-0202",
    origem: "Instagram",
    observacoes: "Pediu orcamento de manutencao."
  },
  {
    id: gerarIdCliente(),
    nome: "Marina Costa",
    telefone: "(31) 97777-0303",
    origem: "Indicacao",
    observacoes: "Retornar no periodo da tarde."
  },
  {
    id: gerarIdCliente(),
    nome: "Roberto Alves",
    telefone: "(41) 96666-0404",
    origem: "Ligacao",
    observacoes: "Aguardando confirmacao de horario."
  }
];

let clientes = carregarClientes();

const atendimentos = [
  {
    cliente: "Ana Souza",
    etapa: "Novo contato",
    proximaAcao: "Enviar primeira resposta",
    dataRetorno: "Hoje, 14:00",
    responsavel: "Atendimento"
  },
  {
    cliente: "Carlos Lima",
    etapa: "Em atendimento",
    proximaAcao: "Confirmar detalhes do servico",
    dataRetorno: "Hoje, 16:30",
    responsavel: "Atendimento"
  },
  {
    cliente: "Marina Costa",
    etapa: "Aguardando cliente",
    proximaAcao: "Aguardar resposta sobre orcamento",
    dataRetorno: "Amanha, 10:00",
    responsavel: "Atendimento"
  },
  {
    cliente: "Roberto Alves",
    etapa: "Retorno futuro",
    proximaAcao: "Retomar conversa",
    dataRetorno: "12/07/2026",
    responsavel: "Atendimento"
  },
  {
    cliente: "Juliana Rocha",
    etapa: "Concluido",
    proximaAcao: "Nenhuma acao pendente",
    dataRetorno: "-",
    responsavel: "Atendimento"
  }
];

const agendamentos = [
  {
    cliente: "Ana Souza",
    servico: "Corte e hidratacao",
    data: "08/07/2026",
    horario: "15:00",
    status: "Agendado"
  },
  {
    cliente: "Roberto Alves",
    servico: "Avaliacao tecnica",
    data: "08/07/2026",
    horario: "17:30",
    status: "Aguardando cliente"
  },
  {
    cliente: "Juliana Rocha",
    servico: "Consulta inicial",
    data: "09/07/2026",
    horario: "09:00",
    status: "Agendado"
  },
  {
    cliente: "Pedro Martins",
    servico: "Remarcacao",
    data: "10/07/2026",
    horario: "11:00",
    status: "Cancelado"
  }
];

const mensagens = [
  {
    categoria: "Primeira resposta",
    titulo: "Boas-vindas",
    texto: "Ola! Recebemos seu contato e ja vamos te ajudar."
  },
  {
    categoria: "Confirmacao",
    titulo: "Confirmar agendamento",
    texto: "Seu horario esta confirmado. Qualquer mudanca, avise por aqui."
  },
  {
    categoria: "Lembrete",
    titulo: "Lembrete do compromisso",
    texto: "Passando para lembrar do seu atendimento agendado para hoje."
  },
  {
    categoria: "Remarcacao",
    titulo: "Propor novo horario",
    texto: "Podemos remarcar para outro horario disponivel. Qual fica melhor?"
  },
  {
    categoria: "Cancelamento",
    titulo: "Cancelamento registrado",
    texto: "Tudo bem, seu cancelamento foi registrado. Ficamos a disposicao."
  },
  {
    categoria: "Retorno",
    titulo: "Retomar atendimento",
    texto: "Ola! Estou retomando nosso contato conforme combinado."
  }
];

// Ativa o menu mobile. No desktop o menu fica sempre visivel pelo CSS.
function iniciarMenuMobile() {
  const botao = document.querySelector(".menu-toggle");
  const menu = document.querySelector(".main-nav");

  if (!botao || !menu) {
    return;
  }

  botao.addEventListener("click", () => {
    menu.classList.toggle("open");
  });
}

function criarStatusClasse(status) {
  const texto = status.toLowerCase();

  if (texto.includes("novo")) return "status-novo";
  if (texto.includes("em atendimento")) return "status-em-atendimento";
  if (texto.includes("aguardando")) return "status-aguardando";
  if (texto.includes("agendado")) return "status-agendado";
  if (texto.includes("concluido")) return "status-concluido";
  if (texto.includes("perdido")) return "status-perdido";
  if (texto.includes("cancelado")) return "status-cancelado";
  if (texto.includes("retorno")) return "status-retorno";

  return "status-novo";
}

function criarStatus(status) {
  return `<span class="status ${criarStatusClasse(status)}">${escapeHtml(status)}</span>`;
}

function preencherDashboard() {
  const cards = [
    { rotulo: "Total de clientes", valor: clientes.length },
    {
      rotulo: "Atendimentos pendentes",
      valor: atendimentos.filter((item) => item.etapa !== "Concluido" && item.etapa !== "Perdido").length
    },
    {
      rotulo: "Agendamentos do dia",
      valor: agendamentos.filter((item) => item.data === "08/07/2026").length
    },
    {
      rotulo: "Retornos futuros",
      valor: atendimentos.filter((item) => item.etapa === "Retorno futuro").length
    }
  ];

  const summaryCards = document.querySelector("#summaryCards");
  const nextTicketsList = document.querySelector("#nextTicketsList");
  const todayAppointmentsList = document.querySelector("#todayAppointmentsList");

  if (!summaryCards || !nextTicketsList || !todayAppointmentsList) {
    return;
  }

  summaryCards.innerHTML = cards
    .map(
      (card) => `
        <article class="summary-card">
          <span>${card.rotulo}</span>
          <strong>${card.valor}</strong>
        </article>
      `
    )
    .join("");

  const proximosAtendimentos = atendimentos.filter((item) => item.etapa !== "Concluido");
  const nextTicketsCount = document.querySelector("#nextTicketsCount");
  if (nextTicketsCount) {
    nextTicketsCount.textContent = `${proximosAtendimentos.length} itens`;
  }

  nextTicketsList.innerHTML = proximosAtendimentos.slice(0, 4).map((item) => `
    <div class="list-item">
      <strong>${escapeHtml(item.cliente)}</strong>
      ${criarStatus(item.etapa)}
      <div class="item-meta">
        <span>${escapeHtml(item.proximaAcao)}</span>
        <span>Retorno: ${escapeHtml(item.dataRetorno)}</span>
      </div>
    </div>
  `).join("");

  const agendamentosDoDia = agendamentos.filter((item) => item.data === "08/07/2026");
  const todayAppointmentsCount = document.querySelector("#todayAppointmentsCount");
  if (todayAppointmentsCount) {
    todayAppointmentsCount.textContent = `${agendamentosDoDia.length} itens`;
  }

  todayAppointmentsList.innerHTML = agendamentosDoDia.map((item) => `
    <div class="list-item">
      <strong>${escapeHtml(item.cliente)}</strong>
      <div>${escapeHtml(item.servico)}</div>
      <div class="item-meta">
        <span>${escapeHtml(item.horario)}</span>
        ${criarStatus(item.status)}
      </div>
    </div>
  `).join("");
}

function preencherClientes() {
  const tabela = document.querySelector("#clientsTable");
  const contador = document.querySelector("#clientsCount");

  if (!tabela || !contador) {
    return;
  }

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

  clientes.forEach((cliente) => {
    tabela.appendChild(criarLinhaCliente(cliente));
  });
}

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

function preencherAtendimentos() {
  const lista = document.querySelector("#ticketsList");
  const contador = document.querySelector("#ticketsCount");

  if (!lista || !contador) {
    return;
  }

  contador.textContent = `${atendimentos.length} atendimentos`;

  lista.innerHTML = atendimentos.map((item) => `
    <article class="item-card">
      <div>
        <strong>${escapeHtml(item.cliente)}</strong>
        <div class="item-meta">
          <span>Proxima acao: ${escapeHtml(item.proximaAcao)}</span>
          <span>Retorno: ${escapeHtml(item.dataRetorno)}</span>
          <span>Responsavel: ${escapeHtml(item.responsavel)}</span>
        </div>
      </div>
      ${criarStatus(item.etapa)}
    </article>
  `).join("");
}

function preencherAgendamentos() {
  const tabela = document.querySelector("#appointmentsTable");
  const contador = document.querySelector("#appointmentsCount");

  if (!tabela || !contador) {
    return;
  }

  contador.textContent = `${agendamentos.length} agendamentos`;

  tabela.innerHTML = agendamentos.map((item) => `
    <tr>
      <td><strong>${escapeHtml(item.cliente)}</strong></td>
      <td>${escapeHtml(item.servico)}</td>
      <td>${escapeHtml(item.data)}</td>
      <td>${escapeHtml(item.horario)}</td>
      <td>${criarStatus(item.status)}</td>
    </tr>
  `).join("");
}

function preencherMensagens() {
  const lista = document.querySelector("#messagesList");
  const contador = document.querySelector("#messagesCount");

  if (!lista || !contador) {
    return;
  }

  contador.textContent = `${mensagens.length} modelos`;

  lista.innerHTML = mensagens.map((mensagem) => `
    <article class="message-card">
      <span class="category-label">${escapeHtml(mensagem.categoria)}</span>
      <strong>${escapeHtml(mensagem.titulo)}</strong>
      <p>${escapeHtml(mensagem.texto)}</p>
    </article>
  `).join("");
}

// Escolhe qual funcao executar usando o atributo data-page do body.
function iniciarPaginaAtual() {
  const pagina = document.body.dataset.page;

  if (pagina === "clientes") {
    configurarFormularioCliente();
    preencherClientes();
    return;
  }

  if (pagina === "dashboard") preencherDashboard();
  if (pagina === "atendimentos") preencherAtendimentos();
  if (pagina === "agendamentos") preencherAgendamentos();
  if (pagina === "mensagens") preencherMensagens();
}

function configurarFormularioCliente() {
  const formCliente = document.getElementById("form-cliente");
  const campoTelefone = document.getElementById("telefone-cliente");
  const feedback = document.getElementById("clientes-feedback");

  if (!formCliente || !campoTelefone || !feedback) {
    return;
  }

  campoTelefone.addEventListener("input", () => {
    campoTelefone.value = formatarTelefone(campoTelefone.value);
  });

  formCliente.addEventListener("submit", (event) => {
    event.preventDefault();

    const nome = document.getElementById("nome-cliente").value.trim();
    const telefone = campoTelefone.value.trim();
    const origem = document.getElementById("origem-cliente").value;
    const observacoes = document.getElementById("observacoes-cliente").value.trim();

    const validacao = validarCliente({ nome, telefone });

    if (!validacao.valido) {
      mostrarFeedbackCliente(feedback, validacao.mensagem, "erro");
      return;
    }

    const telefoneNormalizado = normalizarTelefone(telefone);
    const telefoneJaExiste = clientes.some(
      (cliente) => normalizarTelefone(cliente.telefone) === telefoneNormalizado
    );

    if (telefoneJaExiste) {
      mostrarFeedbackCliente(
        feedback,
        "Ja existe um cliente cadastrado com este telefone.",
        "erro"
      );
      return;
    }

    const novoCliente = {
      id: gerarIdCliente(),
      nome: normalizarTexto(nome),
      telefone: formatarTelefone(telefoneNormalizado),
      origem: normalizarTexto(origem),
      observacoes: normalizarTexto(observacoes)
    };

    clientes.push(novoCliente);
    salvarClientes(clientes);
    preencherClientes();
    formCliente.reset();
    campoTelefone.focus();
    mostrarFeedbackCliente(feedback, "Cliente salvo com sucesso.", "sucesso");
  });
}

function validarCliente({ nome, telefone }) {
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

function mostrarFeedbackCliente(elemento, mensagem, tipo) {
  elemento.textContent = mensagem;
  elemento.dataset.status = tipo;
}

function normalizarTexto(valor) {
  return String(valor || "").trim().replace(/\s+/g, " ");
}

function normalizarTelefone(valor) {
  return String(valor || "").replace(/\D/g, "").slice(0, 11);
}

function formatarTelefone(valor) {
  let numeros = normalizarTelefone(valor);

  if (numeros.length === 0) {
    return "";
  }

  if (numeros.length <= 2) {
    return `(${numeros}`;
  }

  if (numeros.length <= 6) {
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
  }

  if (numeros.length <= 10) {
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 6)}-${numeros.slice(6)}`;
  }

  return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`;
}

function gerarIdCliente() {
  if (window.crypto && typeof window.crypto.randomUUID === "function") {
    return window.crypto.randomUUID();
  }

  return `cliente-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function carregarClientes() {
  const dadosSalvos = lerClientesDoStorage();

  if (dadosSalvos.length > 0) {
    return dadosSalvos;
  }

  const iniciais = clientesIniciais.map((cliente) => ({ ...cliente }));
  salvarClientes(iniciais);
  return iniciais;
}

function lerClientesDoStorage() {
  try {
    const bruto = localStorage.getItem(ARMAZENAMENTO_CLIENTES);

    if (!bruto) {
      return [];
    }

    const dados = JSON.parse(bruto);

    if (!Array.isArray(dados)) {
      return [];
    }

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
  } catch {
    return [];
  }
}

function salvarClientes(lista) {
  try {
    localStorage.setItem(ARMAZENAMENTO_CLIENTES, JSON.stringify(lista));
  } catch {
    // Se o storage falhar, o prototipo continua funcionando em memoria.
  }
}

function escapeHtml(valor) {
  return String(valor)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

iniciarMenuMobile();
iniciarPaginaAtual();
