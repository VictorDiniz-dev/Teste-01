/* =========================================================
   FluxoCRM - JavaScript do protótipo
   Este arquivo usa apenas dados fictícios para montar as telas.
   Não existe salvamento, banco de dados ou backend nesta fase.
   ========================================================= */

// Dados fictícios: altere estes arrays para mudar o conteúdo das telas.
const clientes = [
  {
    nome: "Ana Souza",
    telefone: "(11) 99999-0101",
    origem: "WhatsApp",
    observacoes: "Quer agendar corte e hidratação."
  },
  {
    nome: "Carlos Lima",
    telefone: "(21) 98888-0202",
    origem: "Instagram",
    observacoes: "Pediu orçamento de manutenção."
  },
  {
    nome: "Marina Costa",
    telefone: "(31) 97777-0303",
    origem: "Indicação",
    observacoes: "Retornar no período da tarde."
  },
  {
    nome: "Roberto Alves",
    telefone: "(41) 96666-0404",
    origem: "Ligação",
    observacoes: "Aguardando confirmação de horário."
  }
];

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
    proximaAcao: "Confirmar detalhes do serviço",
    dataRetorno: "Hoje, 16:30",
    responsavel: "Atendimento"
  },
  {
    cliente: "Marina Costa",
    etapa: "Aguardando cliente",
    proximaAcao: "Aguardar resposta sobre orçamento",
    dataRetorno: "Amanhã, 10:00",
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
    etapa: "Concluído",
    proximaAcao: "Nenhuma ação pendente",
    dataRetorno: "-",
    responsavel: "Atendimento"
  }
];

const agendamentos = [
  {
    cliente: "Ana Souza",
    servico: "Corte e hidratação",
    data: "08/07/2026",
    horario: "15:00",
    status: "Agendado"
  },
  {
    cliente: "Roberto Alves",
    servico: "Avaliação técnica",
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
    servico: "Remarcação",
    data: "10/07/2026",
    horario: "11:00",
    status: "Cancelado"
  }
];

const mensagens = [
  {
    categoria: "Primeira resposta",
    titulo: "Boas-vindas",
    texto: "Olá! Recebemos seu contato e já vamos te ajudar."
  },
  {
    categoria: "Confirmação",
    titulo: "Confirmar agendamento",
    texto: "Seu horário está confirmado. Qualquer mudança, avise por aqui."
  },
  {
    categoria: "Lembrete",
    titulo: "Lembrete do compromisso",
    texto: "Passando para lembrar do seu atendimento agendado para hoje."
  },
  {
    categoria: "Remarcação",
    titulo: "Propor novo horário",
    texto: "Podemos remarcar para outro horário disponível. Qual fica melhor?"
  },
  {
    categoria: "Cancelamento",
    titulo: "Cancelamento registrado",
    texto: "Tudo bem, seu cancelamento foi registrado. Ficamos à disposição."
  },
  {
    categoria: "Retorno",
    titulo: "Retomar atendimento",
    texto: "Olá! Estou retomando nosso contato conforme combinado."
  }
];

// Ativa o menu mobile. No desktop o menu fica sempre visível pelo CSS.
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
  if (texto.includes("concluído")) return "status-concluido";
  if (texto.includes("perdido")) return "status-perdido";
  if (texto.includes("cancelado")) return "status-cancelado";
  if (texto.includes("retorno")) return "status-retorno";

  return "status-novo";
}

function criarStatus(status) {
  return `<span class="status ${criarStatusClasse(status)}">${status}</span>`;
}

function preencherDashboard() {
  const cards = [
    { rotulo: "Total de clientes", valor: clientes.length },
    {
      rotulo: "Atendimentos pendentes",
      valor: atendimentos.filter((item) => item.etapa !== "Concluído" && item.etapa !== "Perdido").length
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

  summaryCards.innerHTML = cards.map((card) => `
    <article class="summary-card">
      <span>${card.rotulo}</span>
      <strong>${card.valor}</strong>
    </article>
  `).join("");

  const proximosAtendimentos = atendimentos.filter((item) => item.etapa !== "Concluído");
  document.querySelector("#nextTicketsCount").textContent = `${proximosAtendimentos.length} itens`;

  nextTicketsList.innerHTML = proximosAtendimentos.slice(0, 4).map((item) => `
    <div class="list-item">
      <strong>${item.cliente}</strong>
      ${criarStatus(item.etapa)}
      <div class="item-meta">
        <span>${item.proximaAcao}</span>
        <span>Retorno: ${item.dataRetorno}</span>
      </div>
    </div>
  `).join("");

  const agendamentosDoDia = agendamentos.filter((item) => item.data === "08/07/2026");
  document.querySelector("#todayAppointmentsCount").textContent = `${agendamentosDoDia.length} itens`;

  todayAppointmentsList.innerHTML = agendamentosDoDia.map((item) => `
    <div class="list-item">
      <strong>${item.cliente}</strong>
      <div>${item.servico}</div>
      <div class="item-meta">
        <span>${item.horario}</span>
        ${criarStatus(item.status)}
      </div>
    </div>
  `).join("");
}

function preencherClientes() {
  const tabela = document.querySelector("#clientsTable");
  document.querySelector("#clientsCount").textContent = `${clientes.length} clientes`;

  tabela.innerHTML = clientes.map((cliente) => `
    <tr>
      <td><strong>${cliente.nome}</strong></td>
      <td>${cliente.telefone}</td>
      <td>${cliente.origem}</td>
      <td>${cliente.observacoes}</td>
    </tr>
  `).join("");
}

function preencherAtendimentos() {
  const lista = document.querySelector("#ticketsList");
  document.querySelector("#ticketsCount").textContent = `${atendimentos.length} atendimentos`;

  lista.innerHTML = atendimentos.map((item) => `
    <article class="item-card">
      <div>
        <strong>${item.cliente}</strong>
        <div class="item-meta">
          <span>Próxima ação: ${item.proximaAcao}</span>
          <span>Retorno: ${item.dataRetorno}</span>
          <span>Responsável: ${item.responsavel}</span>
        </div>
      </div>
      ${criarStatus(item.etapa)}
    </article>
  `).join("");
}

function preencherAgendamentos() {
  const tabela = document.querySelector("#appointmentsTable");
  document.querySelector("#appointmentsCount").textContent = `${agendamentos.length} agendamentos`;

  tabela.innerHTML = agendamentos.map((item) => `
    <tr>
      <td><strong>${item.cliente}</strong></td>
      <td>${item.servico}</td>
      <td>${item.data}</td>
      <td>${item.horario}</td>
      <td>${criarStatus(item.status)}</td>
    </tr>
  `).join("");
}

function preencherMensagens() {
  const lista = document.querySelector("#messagesList");
  document.querySelector("#messagesCount").textContent = `${mensagens.length} modelos`;

  lista.innerHTML = mensagens.map((mensagem) => `
    <article class="message-card">
      <span class="category-label">${mensagem.categoria}</span>
      <strong>${mensagem.titulo}</strong>
      <p>${mensagem.texto}</p>
    </article>
  `).join("");
}

// Escolhe qual função executar usando o atributo data-page do body.
function iniciarPaginaAtual() {
  const pagina = document.body.dataset.page;

  if (pagina === "dashboard") preencherDashboard();
  if (pagina === "clientes") preencherClientes();configurarFormularioCliente();
  if (pagina === "atendimentos") preencherAtendimentos();
  if (pagina === "agendamentos") preencherAgendamentos();
  if (pagina === "mensagens") preencherMensagens();
}

function configurarFormularioCliente(){
  const formCliente = document.getElementById("form-cliente");

  if (!formCliente) return;

  formCliente.addEventListener("submit", function (event) {
    event.preventDefault();

  const nome = document.getElementById("nome-cliente").value;
  const telefone = document.getElementById("telefone-cliente").value;
  const origem = document.getElementById("origem-cliente").value;
  const observacoes = document.getElementById("observacoes-cliente").value;
    
  const novoCliente = {
  nome: nome,
  telefone: telefone,
  origem: origem,
  observacoes: observacoes
  };

  
  clientes.push(novoCliente);
  preencherClientes();
  console.log(novoCliente);
  })
  ;
}

iniciarMenuMobile();
iniciarPaginaAtual();
