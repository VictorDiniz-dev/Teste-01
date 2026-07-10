(function (FluxoCRM) {
  const repos = FluxoCRM.repositories;
  const hojeIso = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`; };
  const dataValida = (v) => /^\d{4}-\d{2}-\d{2}$/.test(String(v || "")) && !Number.isNaN(new Date(`${v}T00:00:00`).getTime());
  const horarioValido = (v) => /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(String(v || ""));
  const el = (tag, classe, texto) => { const node=document.createElement(tag); if(classe) node.className=classe; if(texto!==undefined) node.textContent=texto; return node; };
  const nome = (lista, id, fallback) => lista.find((item) => item.id === id)?.nome || fallback;
  function formatarData(iso, opcoes={day:"2-digit",month:"short"}) { if(!dataValida(iso)) return "Data inválida"; const [a,m,d]=iso.split("-").map(Number); return new Intl.DateTimeFormat("pt-BR",opcoes).format(new Date(a,m-1,d)); }
  function badge(status) { const texto=String(status||"").trim(); const s=el("span",`status status-${texto === "agendado" ? "agendado" : texto === "cancelado" ? "cancelado" : "aguardando"}`,texto ? texto[0].toUpperCase()+texto.slice(1) : "Status desconhecido"); return s; }
  function vazio(texto, href, acao) { const box=el("div","empty-state"); box.append(el("p","",texto)); if(href){const a=el("a","action-link",acao);a.href=href;box.append(a);} return box; }
  function iniciar() {
    const clientes=repos.clientes.listar(), servicos=repos.servicos.listar(), solicitacoes=repos.solicitacoes.listar(), agendamentos=repos.agendamentos.listar();
    const hoje=hojeIso();
    const doDia=agendamentos.filter(a=>a.data===hoje).sort((a,b)=>String(a.horario).localeCompare(String(b.horario)));
    const pendentes=solicitacoes.filter(s=>s.status==="pendente");
    const futuros=agendamentos.filter(a=>dataValida(a.data)&&a.data>=hoje&&a.status!=="cancelado").sort((a,b)=>a.data.localeCompare(b.data)||String(a.horario).localeCompare(String(b.horario)));
    const hora=new Date().getHours();
    document.getElementById("dashboard-greeting").textContent = `${hora<12?"Bom dia":hora<18?"Boa tarde":"Boa noite"}. Aqui está o resumo da sua operação.`;
    const metricas=[
      ["Agendamentos hoje",doDia.length,doDia.find(a=>horarioValido(a.horario)) ? `Próximo horário: ${doDia.find(a=>horarioValido(a.horario)).horario}`:"Nenhum horário previsto","agenda.html"],
      ["Solicitações pendentes",pendentes.length,pendentes.length?"Aguardando uma decisão":"Tudo em dia","solicitacoes.html"],
      ["Próximos 7 dias",agendamentos.filter(a=>{if(!dataValida(a.data)||a.data<hoje)return false; const d=new Date(`${a.data}T00:00:00`); return (d-new Date(`${hoje}T00:00:00`))/86400000<=6;}).length,"Inclui hoje e os próximos 6 dias","agenda.html"],
      ["Clientes cadastrados",clientes.length,"Total registrado no CRM","clientes.html"]
    ];
    const grade=document.getElementById("summaryCards"); grade.replaceChildren(...metricas.map(([r,v,c,h])=>{const a=el("a","metric-card");a.href=h;a.append(el("span","metric-label",r),el("strong","metric-value",v),el("small","metric-context",c));return a;}));
    const listaHoje=document.getElementById("todayAppointmentsList"); listaHoje.replaceChildren();
    if(!doDia.length) listaHoje.append(vazio("Nenhum agendamento para hoje.","agenda.html","Ver agenda"));
    doDia.slice(0,6).forEach(a=>{const item=el("article","schedule-item");item.append(el("time","schedule-time",horarioValido(a.horario)?a.horario:"Horário inválido"),el("strong","",nome(clientes,a.clienteId,"Cliente não encontrado")),el("span","muted",nome(servicos,a.servicoId,"Serviço não encontrado")),badge(a.status));listaHoje.append(item);});
    document.getElementById("todayAppointmentsCount").textContent=`${doDia.length} ${doDia.length===1?"item":"itens"}`;
    const proximo=document.getElementById("nextAppointment"); proximo.replaceChildren();
    if(!futuros.length) proximo.append(vazio("Nenhum próximo agendamento.","solicitacoes.html","Nova solicitação")); else {const a=futuros[0], dias=Math.round((new Date(`${a.data}T00:00:00`)-new Date(`${hoje}T00:00:00`))/86400000);proximo.append(el("span","next-kicker",dias===0?"Hoje":dias===1?"Amanhã":`Em ${dias} dias`),el("strong","next-date",`${formatarData(a.data,{weekday:"long",day:"numeric",month:"long"})} · ${horarioValido(a.horario)?a.horario:"Horário inválido"}`),el("span","",nome(clientes,a.clienteId,"Cliente não encontrado")),el("span","muted",nome(servicos,a.servicoId,"Serviço não encontrado")));}
    const listaPendentes=document.getElementById("pendingRequestsList"); listaPendentes.replaceChildren();
    if(!pendentes.length) listaPendentes.append(vazio("Nenhuma solicitação pendente.","solicitacoes.html","Nova solicitação"));
    pendentes.slice(0,5).forEach(s=>{const a=el("a","request-item");a.href="solicitacoes.html";a.append(el("strong","",nome(clientes,s.clienteId,"Cliente não encontrado")),el("span","muted",nome(servicos,s.servicoId,"Serviço não encontrado")),el("span","request-date",formatarData(s.dataPreferencial)));listaPendentes.append(a);});
    document.getElementById("pendingRequestsCount").textContent=`${pendentes.length} pendente${pendentes.length===1?"":"s"}`;
    const chart=document.getElementById("activityChart"), description=document.getElementById("activityDescription"); chart.replaceChildren();
    const dias=Array.from({length:7},(_,i)=>{const d=new Date();d.setDate(d.getDate()+i);const iso=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;return {iso,rotulo:new Intl.DateTimeFormat("pt-BR",{weekday:"short"}).format(d).replace(".",""),total:agendamentos.filter(a=>a.data===iso).length};});
    const max=Math.max(1,...dias.map(d=>d.total)); dias.forEach(d=>{const col=el("div","chart-column");const bar=el("span","chart-bar");bar.style.height=`${Math.max(d.total?12:2,(d.total/max)*100)}%`;bar.title=`${d.total} agendamento(s)`;col.append(el("strong","chart-value",d.total),bar,el("span","chart-label",d.rotulo));chart.append(col);});
    description.textContent=dias.map(d=>`${d.rotulo}: ${d.total}`).join("; ")+" agendamento(s).";
    const problemas=[]; [...solicitacoes,...agendamentos].forEach(r=>{if(!clientes.some(c=>c.id===r.clienteId))problemas.push("Registro com cliente não encontrado");if(!servicos.some(s=>s.id===r.servicoId))problemas.push("Registro com serviço não encontrado");}); agendamentos.forEach(a=>{if(!dataValida(a.data))problemas.push("Agendamento com data inválida");if(!horarioValido(a.horario))problemas.push("Agendamento com horário inválido");});
    const alertas=document.getElementById("dataAlerts"); if(problemas.length){alertas.hidden=false;alertas.querySelector("p").textContent=`${problemas.length} inconsistência${problemas.length===1?"":"s"} encontrada${problemas.length===1?"":"s"}. Os registros foram preservados para revisão.`;} else alertas.hidden=true;
  }
  FluxoCRM.modulos.dashboard={iniciar};
})(window.FluxoCRM);
