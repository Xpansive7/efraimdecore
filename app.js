const STORAGE_KEY = "efraim-dashboard-v1";

const views = {
  dashboard:  { title: "Dashboard",    description: "" },
  clientes:   { title: "Clientes",     description: "" },
  orçamentos: { title: "Orçamentos",   description: "" },
  projetos:   { title: "Projetos",     description: "" },
  agenda:     { title: "Agenda",       description: "" },
  financeiro: { title: "Financeiro",   description: "" }
};

const statusTone = {
  rascunho: "",
  enviado: "",
  negociacao: "warning",
  aprovado: "success",
  aguardando: "",
  "comprando material": "warning",
  "em producao": "",
  montagem: "warning",
  entregue: "success",
  atrasado: "danger"
};

const defaultState = {
  clients: [
    {
      id: crypto.randomUUID(),
      name: "Adriana Mello",
      phone: "(21) 99999-2211",
      address: "Barra da Tijuca",
      origin: "Indicacao",
      environment: "Cozinha gourmet",
      city: "Rio de Janeiro",
      notes: "Cliente recorrente. Valoriza acabamento premium e retorno rapido."
    },
    {
      id: crypto.randomUUID(),
      name: "Marcio Prado",
      phone: "(21) 99887-9090",
      address: "Recreio",
      origin: "Instagram",
      environment: "Closet casal",
      city: "Rio de Janeiro",
      notes: "Quer prazo bem alinhado e ferragem premium."
    },
    {
      id: crypto.randomUUID(),
      name: "Patricia Nunes",
      phone: "(21) 99887-2114",
      address: "Barra",
      origin: "Trafego pago",
      environment: "Home office",
      city: "Rio de Janeiro",
      notes: "Lead quente. Em fase final de orçamento."
    }
  ],
  budgets: [],
  projects: []
};

const seededClients = defaultState.clients;

defaultState.budgets = [
  {
    id: crypto.randomUUID(),
    clientId: seededClients[2].id,
    title: "Home office",
    price: 9800,
    cost: 5900,
    businessDays: 22,
    status: "negociacao",
    description: "Home office com bancada, armario superior e nichos laterais.",
    materials: parseMaterialsText("MDF Cinza Cristal | Duratex | 3 chapas | 1980 | cor principal\nFerragem Hafele | Hafele | 1 kit | 740 | corredica invisivel\nPuxador cava champagne | Loja local | 1 jogo | 380 | acabamento champagne"),
    createdAt: "2026-04-20"
  },
  {
    id: crypto.randomUUID(),
    clientId: seededClients[1].id,
    title: "Closet casal",
    price: 14800,
    cost: 9820,
    businessDays: 30,
    status: "aprovado",
    description: "Closet com modulo sapateira, maleiro e gaveteiros internos.",
    materials: parseMaterialsText("MDF Carvalho Hanover | Duratex | 4 chapas | 2980 | madeira principal\nFerragem premium | Hafele | 1 kit | 980 | articulacoes e corredicas"),
    createdAt: "2026-04-12"
  }
];

defaultState.projects = [
  {
    id: crypto.randomUUID(),
    clientId: seededClients[0].id,
    sourceBudgetId: "",
    title: "Cozinha gourmet + ilha",
    price: 17500,
    cost: 11200,
    startDate: "2026-04-02",
    businessDays: 30,
    status: "comprando material",
    notes: "Ferragem Hafele pendente. Entrega exige alinhamento fino com a cliente.",
    materials: parseMaterialsText("MDF Cinza Cristal | Duratex | 3 chapas | 1980 | mesma cor da obra anterior\nFerragem Hafele | Hafele | 1 kit | 740 | amortecedor + corredica invisivel\nPuxador cava champagne | Loja local | 1 jogo | 380 | padrao mantido"),
    createdAt: "2026-04-02"
  },
  {
    id: crypto.randomUUID(),
    clientId: seededClients[1].id,
    sourceBudgetId: defaultState.budgets[1].id,
    title: "Closet casal",
    price: 14800,
    cost: 9820,
    startDate: "2026-04-08",
    businessDays: 30,
    status: "em producao",
    notes: "Corte liberado. Cliente pediu prioridade para entrega final do mes.",
    materials: parseMaterialsText("MDF Carvalho Hanover | Duratex | 4 chapas | 2980 | material principal\nFerragem premium | Hafele | 1 kit | 980 | gavetas e portas"),
    createdAt: "2026-04-08"
  }
];

let state = loadState();
let currentView = "dashboard";

const refs = {
  menuItems: [...document.querySelectorAll(".menu-item")],
  panels: [...document.querySelectorAll("[data-view-panel]")],
  title: document.getElementById("view-title"),
  description: document.getElementById("view-description"),
  mastheadDate: document.getElementById("masthead-date"),
  statusRibbon: document.getElementById("status-ribbon"),
  currentDateLabel: document.getElementById("current-date-label"),
  dashboardKpis: document.getElementById("dashboard-kpis"),
  heroSignals: document.getElementById("hero-signals"),
  agendaTimeline: document.getElementById("agenda-timeline"),
  dashboardSummary: document.getElementById("dashboard-summary"),
  dashboardProjectGrid: document.getElementById("dashboard-project-grid"),
  featuredClientCard: document.getElementById("featured-client-card"),
  hotBudgets: document.getElementById("hot-budgets"),
  financialHighlight: document.getElementById("financial-highlight"),
  clientForm: document.getElementById("client-form"),
  clientSearch: document.getElementById("client-search"),
  clientList: document.getElementById("client-list"),
  budgetForm: document.getElementById("budget-form"),
  budgetClientSelect: document.getElementById("budget-client-select"),
  budgetList: document.getElementById("budget-list"),
  budgetLiveSummary: document.getElementById("budget-live-summary"),
  projectForm: document.getElementById("project-form"),
  projectClientSelect: document.getElementById("project-client-select"),
  projectSourceBudget: document.getElementById("project-source-budget"),
  projectList: document.getElementById("project-list"),
  projectLiveSummary: document.getElementById("project-live-summary"),
  agendaList: document.getElementById("agenda-list"),
  agendaAlerts: document.getElementById("agenda-alerts"),
  financeSummary: document.getElementById("finance-summary"),
  financeList: document.getElementById("finance-list")
};

bindEvents();
renderAll();
setupMotion();

function bindEvents() {
  refs.menuItems.forEach((item) => {
    item.addEventListener("click", () => setView(item.dataset.view));
  });

  document.querySelectorAll(".mobile-nav-item").forEach((item) => {
    item.addEventListener("click", () => setView(item.dataset.view));
  });

  document.querySelectorAll("[data-action='go-view']").forEach((button) => {
    button.addEventListener("click", () => setView(button.dataset.view));
  });

  refs.clientForm.addEventListener("submit", handleClientSubmit);
  refs.budgetForm.addEventListener("submit", handleBudgetSubmit);
  refs.projectForm.addEventListener("submit", handleProjectSubmit);
  refs.clientSearch.addEventListener("input", renderClients);

  const toggleNewClientBtn = document.getElementById("budget-toggle-new-client");
  const newClientFields    = document.getElementById("budget-new-client-fields");
  if (toggleNewClientBtn && newClientFields) {
    toggleNewClientBtn.addEventListener("click", () => {
      const isHidden = newClientFields.hidden;
      newClientFields.hidden = !isHidden;
      toggleNewClientBtn.textContent = isHidden ? "Cancelar" : "+ Novo";
      if (isHidden) document.getElementById("new-client-name").focus();
    });
  }

  refs.budgetForm.addEventListener("input", renderBudgetLiveSummary);
  refs.projectForm.addEventListener("input", renderProjectLiveSummary);

  document.addEventListener("click", handleDocumentClick);
}

function handleClientSubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);

  const client = {
    id: crypto.randomUUID(),
    name: String(formData.get("name") || "").trim(),
    phone: String(formData.get("phone") || "").trim(),
    address: String(formData.get("address") || "").trim(),
    origin: String(formData.get("origin") || "").trim(),
    environment: String(formData.get("environment") || "").trim(),
    city: String(formData.get("city") || "").trim(),
    notes: String(formData.get("notes") || "").trim()
  };

  if (!client.name || !client.phone) {
    return;
  }

  state.clients.unshift(client);
  persistAndRender();
  event.currentTarget.reset();
  animateFirstCard(refs.clientList);
}

function handleBudgetSubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);

  const newClientFields = document.getElementById("budget-new-client-fields");
  const newClientName   = document.getElementById("new-client-name");
  const newClientPhone  = document.getElementById("new-client-phone");
  let clientId = String(formData.get("clientId") || "");

  if (newClientFields && !newClientFields.hidden) {
    const name  = newClientName?.value.trim()  || "";
    const phone = newClientPhone?.value.trim() || "";
    if (name && phone) {
      const newClient = { id: crypto.randomUUID(), name, phone, address: "", origin: "", environment: "", city: "", notes: "" };
      state.clients.unshift(newClient);
      clientId = newClient.id;
    }
  }

  const budget = {
    id: crypto.randomUUID(),
    clientId,
    title:        String(formData.get("title") || "").trim(),
    price:        Number(formData.get("price") || 0),
    cost:         Number(formData.get("cost")  || 0),
    businessDays: Number(formData.get("businessDays") || 0),
    status:       String(formData.get("status") || "rascunho"),
    description:  String(formData.get("description") || "").trim(),
    materials:    parseMaterialsText(String(formData.get("materials") || "")),
    createdAt:    todayISO()
  };

  if (!budget.clientId || !budget.title) return;

  state.budgets.unshift(budget);
  persistAndRender();
  event.currentTarget.reset();
  if (newClientFields) { newClientFields.hidden = true; }
  const btn = document.getElementById("budget-toggle-new-client");
  if (btn) btn.textContent = "+ Novo";
  renderBudgetLiveSummary();
  animateFirstCard(refs.budgetList);
}

function handleProjectSubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);

  const project = {
    id: crypto.randomUUID(),
    clientId: String(formData.get("clientId") || ""),
    sourceBudgetId: String(formData.get("sourceBudgetId") || ""),
    title: String(formData.get("title") || "").trim(),
    price: Number(formData.get("price") || 0),
    cost: Number(formData.get("cost") || 0),
    startDate: String(formData.get("startDate") || todayISO()),
    businessDays: Number(formData.get("businessDays") || 0),
    status: String(formData.get("status") || "aguardando"),
    notes: String(formData.get("notes") || "").trim(),
    materials: parseMaterialsText(String(formData.get("materials") || "")),
    createdAt: todayISO()
  };

  if (!project.clientId || !project.title || !project.startDate) {
    return;
  }

  state.projects.unshift(project);

  if (project.sourceBudgetId) {
    const budget = state.budgets.find((item) => item.id === project.sourceBudgetId);
    if (budget) {
      budget.status = "aprovado";
    }
  }

  persistAndRender();
  event.currentTarget.reset();
  refs.projectSourceBudget.value = "";
  renderProjectLiveSummary();
  animateFirstCard(refs.projectList);
}

function handleDocumentClick(event) {
  const action = event.target.dataset.action;
  if (!action) {
    return;
  }

  if (action === "approve-budget") {
    const budgetId = event.target.dataset.budgetId;
    const budget = state.budgets.find((item) => item.id === budgetId);
    if (budget) {
      budget.status = "aprovado";
      fillProjectFromBudget(budget);
      persistAndRender(false);
      setView("projetos");
    }
  }
}

function fillProjectFromBudget(budget) {
  refs.projectClientSelect.value = budget.clientId;
  refs.projectSourceBudget.value = budget.id;
  refs.projectForm.elements.title.value = budget.title;
  refs.projectForm.elements.price.value = budget.price;
  refs.projectForm.elements.cost.value = budget.cost;
  refs.projectForm.elements.businessDays.value = budget.businessDays;
  refs.projectForm.elements.startDate.value = todayISO();
  refs.projectForm.elements.status.value = "aguardando";
  refs.projectForm.elements.materials.value = materialsToText(budget.materials);
  refs.projectForm.elements.notes.value = budget.description;
  renderProjectLiveSummary();
}

function persistAndRender(save = true) {
  if (save) {
    saveState();
  }
  renderAll();
}

function renderAll() {
  const now = new Date();
  if (refs.currentDateLabel) refs.currentDateLabel.textContent = formatLongDate(now);
  if (refs.mastheadDate) refs.mastheadDate.textContent = formatLongDate(now);
  updateSelectors();
  updateNavBadges();
  renderRibbon();
  renderDashboard();
  renderClients();
  renderBudgets();
  renderProjects();
  renderAgenda();
  renderFinance();
  renderBudgetLiveSummary();
  renderProjectLiveSummary();
  syncViewMeta();
}

function updateNavBadges() {
  const setBadge = (id, count) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (count > 0) {
      el.textContent = count;
      el.hidden = false;
    } else {
      el.hidden = true;
    }
  };
  setBadge("badge-clientes",   state.clients.length);
  setBadge("badge-orçamentos", state.budgets.filter(b => b.status !== "aprovado").length);
  setBadge("badge-projetos",   state.projects.filter(p => p.status !== "entregue").length);
}

function updateSelectors() {
  const clientOptions = state.clients
    .map((client) => `<option value="${client.id}">${escapeHtml(client.name)}</option>`)
    .join("");

  refs.budgetClientSelect.innerHTML = clientOptions || `<option value="">Cadastre um cliente antes</option>`;
  refs.projectClientSelect.innerHTML = clientOptions || `<option value="">Cadastre um cliente antes</option>`;

  const availableBudgets = state.budgets.filter((budget) => budget.status === "aprovado" || budget.status === "negociacao" || budget.status === "enviado");
  const budgetOptions = availableBudgets
    .map((budget) => {
      const client = getClientById(budget.clientId);
      return `<option value="${budget.id}">${escapeHtml(client?.name || "Cliente")} - ${escapeHtml(budget.title)}</option>`;
    })
    .join("");

  refs.projectSourceBudget.innerHTML = `<option value="">Criacao manual</option>${budgetOptions}`;
}

function renderRibbon() {
  const metrics = getDerivedMetrics();
  const nearestProject = metrics.upcomingProjects[0];
  const hotBudget = [...state.budgets]
    .sort((a, b) => marginPercent(b) - marginPercent(a))
    .find((budget) => budget.status !== "aprovado");

  const items = [
    {
      label: "Entrega mais próxima",
      value: nearestProject ? `${getClientName(nearestProject.clientId)} · ${formatShortDate(calcDeliveryDate(nearestProject.startDate, nearestProject.businessDays))}` : "Sem entrega"
    },
    {
      label: "Projetos ativos",
      value: `${metrics.activeProjects} em andamento`
    },
    {
      label: "Orçamentos abertos",
      value: `${metrics.openBudgets} negociando`
    },
    {
      label: "Maior margem",
      value: hotBudget ? `${hotBudget.title} · ${formatPercent(marginPercent(hotBudget))}` : "Sem proposta"
    }
  ];

  refs.statusRibbon.innerHTML = items.map((item) => `
    <div class="ribbon-item">
      <span class="micro-label">${item.label}</span>
      <strong>${escapeHtml(item.value)}</strong>
    </div>
  `).join("");
}

function renderDashboard() {
  const metrics = getDerivedMetrics();

  refs.dashboardKpis.innerHTML = [
    metricCard("Clientes", String(state.clients.length), "base cadastrada", state.clients.length),
    metricCard("Orçamentos abertos", String(metrics.openBudgets), "entre enviados e negociação", metrics.openBudgets),
    metricCard("Projetos ativos", String(metrics.activeProjects), "em execução agora", metrics.activeProjects),
    metricCard("Lucro previsto", formatCurrency(metrics.projectProfit), "somando projetos atuais", metrics.projectProfit)
  ].join("");
  requestAnimationFrame(animateDashboardNumbers);

  refs.heroSignals.innerHTML = [
    signalCard("Hoje", metrics.upcomingProjects[0] ? `Prioridade em ${getClientName(metrics.upcomingProjects[0].clientId)} para entregar em ${formatShortDate(calcDeliveryDate(metrics.upcomingProjects[0].startDate, metrics.upcomingProjects[0].businessDays))}.` : "Nenhuma entrega critica hoje."),
    signalCard("Margem", metrics.lowMarginProject ? `${metrics.lowMarginProject.title} está com margem em ${formatPercent(marginPercent(metrics.lowMarginProject))}. Vale revisar custo.` : "Nenhum projeto com margem critica no momento."),
    signalCard("Comercial", metrics.hotBudget ? `${getClientName(metrics.hotBudget.clientId)} ainda está em ${metrics.hotBudget.status}. Margem prevista de ${formatPercent(marginPercent(metrics.hotBudget))}.` : "Sem orçamento quente agora."),
    signalCard("Memoria", metrics.featuredClient ? `${metrics.featuredClient.name} já tem histórico salvo de material e acabamento para proxima obra.` : "Cadastre o primeiro cliente para guardar memória de obra.")
  ].join("");

  refs.agendaTimeline.innerHTML = renderAgendaTimelineItems(metrics.upcomingProjects);

  refs.dashboardSummary.innerHTML = [
    summaryBox("Custo total em projetos", formatCurrency(metrics.projectCost)),
    summaryBox("Valor total fechado", formatCurrency(metrics.projectRevenue)),
    summaryBox("Margem média", formatPercent(metrics.averageProjectMargin))
  ].join("");

  refs.dashboardProjectGrid.innerHTML = renderDashboardProjects(metrics.upcomingProjects);
  refs.featuredClientCard.innerHTML = renderFeaturedClient(metrics.featuredClient);
  refs.hotBudgets.innerHTML = renderHotBudgets(metrics.topBudgets);
  refs.financialHighlight.innerHTML = renderFinancialHighlight(metrics);
}

function renderClients() {
  const query = refs.clientSearch.value.trim().toLowerCase();

  const clients = state.clients.filter((client) => {
    const haystack = [client.name, client.phone, client.environment, client.address, client.origin, client.notes].join(" ").toLowerCase();
    return haystack.includes(query);
  });

  if (!clients.length) {
    refs.clientList.innerHTML = emptyState("Nenhum cliente encontrado.", "Preencha o formulário ao lado para cadastrar o primeiro.");
    return;
  }

  refs.clientList.innerHTML = clients.map((client) => {
    const clientProjects = state.projects.filter((project) => project.clientId === client.id);
    const clientBudgets = state.budgets.filter((budget) => budget.clientId === client.id);
    const materials = collectClientMaterials(client.id).slice(0, 4);

    return `
      <article class="record-card reveal-item">
        <div class="record-head">
          <div class="record-main">
            <h4>${escapeHtml(client.name)}</h4>
            <p class="record-meta">${escapeHtml(client.phone)} · ${escapeHtml(client.address || client.city || "Sem endereço")} · ${escapeHtml(client.origin || "Origem não informada")}</p>
          </div>
          <span class="status-pill ${clientProjects.length ? "success" : ""}">${clientProjects.length ? "com projeto" : "lead"}</span>
        </div>
        <div class="record-stats">
          <div class="record-stat">
            <span>Ambiente</span>
            <strong>${escapeHtml(client.environment || "Não informado")}</strong>
          </div>
          <div class="record-stat">
            <span>Orçamentos</span>
            <strong>${clientBudgets.length}</strong>
          </div>
          <div class="record-stat">
            <span>Projetos</span>
            <strong>${clientProjects.length}</strong>
          </div>
        </div>
        <div class="field-note">${escapeHtml(client.notes || "Sem observações ainda.")}</div>
        ${materials.length ? `<div class="material-tags">${materials.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}</div>` : ""}
      </article>
    `;
  }).join("");
}

function renderBudgets() {
  if (!state.budgets.length) {
    refs.budgetList.innerHTML = emptyState("Nenhum orçamento salvo.", "Preencha o formulário ao lado para criar o primeiro.");
    return;
  }


  refs.budgetList.innerHTML = state.budgets.map((budget) => {
    const client = getClientById(budget.clientId);
    const tone = statusTone[budget.status] || "";
    return `
      <article class="budget-card reveal-item">
        <div class="record-head">
          <div class="record-main">
            <h4>${escapeHtml(client?.name || "Cliente removido")}</h4>
            <p class="record-meta">${escapeHtml(budget.title)} · criado em ${formatShortDate(budget.createdAt)}</p>
          </div>
          <span class="status-pill ${tone}">${escapeHtml(budget.status)}</span>
        </div>
        <div class="record-stats">
          <div class="record-stat">
            <span>Valor</span>
            <strong>${formatCurrency(budget.price)}</strong>
          </div>
          <div class="record-stat">
            <span>Custo</span>
            <strong>${formatCurrency(budget.cost)}</strong>
          </div>
          <div class="record-stat">
            <span>Lucro</span>
            <strong>${formatCurrency(budget.price - budget.cost)}</strong>
          </div>
        </div>
        <div class="meta-grid">
          <div class="meta-pair">
            <span>Prazo</span>
            <span>${budget.businessDays} dias úteis</span>
          </div>
          <div class="meta-pair">
            <span>Margem</span>
            <span>${formatPercent(marginPercent(budget))}</span>
          </div>
          <div class="meta-pair">
            <span>Itens</span>
            <span>${budget.materials.length} materiais previstos</span>
          </div>
        </div>
        <div class="field-note">${escapeHtml(budget.description || "Sem descrição adicional.")}</div>
        ${budget.status !== "aprovado" ? `<button class="button ghost small" data-action="approve-budget" data-budget-id="${budget.id}">Aprovar e jogar em projeto</button>` : ""}
      </article>
    `;
  }).join("");
}

function renderProjects() {
  if (!state.projects.length) {
    refs.projectList.innerHTML = emptyState("Nenhum projeto salvo.", "Aprove um orçamento ou crie um projeto manual.", { view: "orçamentos", label: "Ver orçamentos" });
    return;
  }

  refs.projectList.innerHTML = state.projects.map((project) => {
    const client = getClientById(project.clientId);
    const deliveryDate = calcDeliveryDate(project.startDate, project.businessDays);
    const tone = getProjectTone(project, deliveryDate);

    return `
      <article class="record-card reveal-item">
        <div class="record-head">
          <div class="record-main">
            <h4>${escapeHtml(project.title)}</h4>
            <p class="record-meta">${escapeHtml(client?.name || "Cliente removido")} · inicio ${formatShortDate(project.startDate)}</p>
          </div>
          <span class="status-pill ${tone}">${escapeHtml(getProjectDisplayStatus(project, deliveryDate))}</span>
        </div>
        <div class="record-stats">
          <div class="record-stat">
            <span>Valor</span>
            <strong>${formatCurrency(project.price)}</strong>
          </div>
          <div class="record-stat">
            <span>Custo</span>
            <strong>${formatCurrency(project.cost)}</strong>
          </div>
          <div class="record-stat">
            <span>Lucro</span>
            <strong>${formatCurrency(project.price - project.cost)}</strong>
          </div>
        </div>
        <div class="meta-grid">
          <div class="meta-pair">
            <span>Prazo</span>
            <span>${project.businessDays} dias úteis</span>
          </div>
          <div class="meta-pair">
            <span>Entrega</span>
            <span>${formatShortDate(deliveryDate)}</span>
          </div>
          <div class="meta-pair">
            <span>Itens</span>
            <span>${project.materials.length} materiais</span>
          </div>
        </div>
        ${project.notes ? `<div class="field-note">${escapeHtml(project.notes)}</div>` : ""}
        ${renderMaterialList(project.materials.slice(0, 3))}
      </article>
    `;
  }).join("");
}

function renderAgenda() {
  const upcoming = getDerivedMetrics().upcomingProjects;

  refs.agendaList.innerHTML = upcoming.length
    ? upcoming.map((project) => {
        const deliveryDate = calcDeliveryDate(project.startDate, project.businessDays);
        return `
          <article class="record-card reveal-item">
            <div class="record-head">
              <div class="record-main">
                <h4>${escapeHtml(project.title)}</h4>
                <p class="record-meta">${escapeHtml(getClientName(project.clientId))}</p>
              </div>
              <span class="status-pill ${getProjectTone(project, deliveryDate)}">${formatShortDate(deliveryDate)}</span>
            </div>
            <div class="summary-line">
              <span class="muted">${project.businessDays} dias úteis a partir de ${formatShortDate(project.startDate)}</span>
              <span class="${daysUntil(deliveryDate) < 0 ? "danger" : daysUntil(deliveryDate) <= 3 ? "warning" : "success"}">${formatRemainingDays(deliveryDate)}</span>
            </div>
          </article>
        `;
      }).join("")
    : emptyState("Sem projetos na agenda.", "Crie ou aprove um projeto para montar a agenda.", { view: "projetos", label: "Ir para projetos" });

  const alerts = upcoming.filter((project) => daysUntil(calcDeliveryDate(project.startDate, project.businessDays)) <= 3);
  refs.agendaAlerts.innerHTML = alerts.length
    ? alerts.map((project) => {
        const deliveryDate = calcDeliveryDate(project.startDate, project.businessDays);
        return `
          <article class="alert-card reveal-item">
            <p class="micro-label">Atencao</p>
            <h3>${escapeHtml(project.title)}</h3>
            <p>${escapeHtml(getClientName(project.clientId))} precisa de acompanhamento. Entrega em ${formatShortDate(deliveryDate)}.</p>
          </article>
        `;
      }).join("")
    : emptyState("Nenhum alerta crítico.", "As entregas estão em uma faixa segura no momento.");
}

function renderFinance() {
  const metrics = getDerivedMetrics();

  refs.financeSummary.innerHTML = [
    financeCard("Valor em projetos", formatCurrency(metrics.projectRevenue)),
    financeCard("Custo em projetos", formatCurrency(metrics.projectCost)),
    financeCard("Lucro em projetos", formatCurrency(metrics.projectProfit)),
    financeCard("Margem média", formatPercent(metrics.averageProjectMargin))
  ].join("");

  const records = [
    ...state.projects.map((project) => ({
      kind: "Projeto",
      name: project.title,
      clientName: getClientName(project.clientId),
      revenue: project.price,
      cost: project.cost,
      margin: marginPercent(project)
    })),
    ...state.budgets.map((budget) => ({
      kind: "Orçamento",
      name: budget.title,
      clientName: getClientName(budget.clientId),
      revenue: budget.price,
      cost: budget.cost,
      margin: marginPercent(budget)
    }))
  ].sort((a, b) => b.margin - a.margin);

  refs.financeList.innerHTML = records.length
    ? records.map((record) => {
        const tier = record.margin < 25 ? "critica" : record.margin < 35 ? "aceitavel" : record.margin < 45 ? "boa" : "excelente";
        const barW = Math.min((record.margin / 60) * 100, 100);
        return `
        <article class="record-card reveal-item">
          <div class="record-head">
            <div class="record-main">
              <h4>${escapeHtml(record.name)}</h4>
              <p class="record-meta">${escapeHtml(record.kind)} · ${escapeHtml(record.clientName)}</p>
            </div>
            <span class="status-pill ${record.margin < 25 ? "danger" : record.margin < 35 ? "warning" : "success"}">${formatPercent(record.margin)}</span>
          </div>
          <div class="record-stats">
            <div class="record-stat"><span>Valor</span><strong>${formatCurrency(record.revenue)}</strong></div>
            <div class="record-stat"><span>Custo</span><strong>${formatCurrency(record.cost)}</strong></div>
            <div class="record-stat"><span>Lucro</span><strong>${formatCurrency(record.revenue - record.cost)}</strong></div>
          </div>
          <div class="finance-bar-row">
            <div class="finance-bar-track"><div class="finance-bar-fill ${tier}" style="width:${barW}%"></div></div>
            <span class="finance-bar-hint">Margem ${formatPercent(record.margin)}</span>
          </div>
        </article>`;
      }).join("")
    : emptyState("Sem dados financeiros ainda.", "Cadastre orçamentos e projetos para ver margem.", { view: "orcamentos", label: "Novo orçamento" });
}

function renderBudgetLiveSummary() {
  const price        = Number(refs.budgetForm.elements.price.value        || 0);
  const cost         = Number(refs.budgetForm.elements.cost.value         || 0);
  const businessDays = Number(refs.budgetForm.elements.businessDays.value || 0);

  const profit = price - cost;
  const margin = price > 0 ? (profit / price) * 100 : 0;

  let tier, label, hint;
  if (price === 0) {
    tier = ""; label = "Aguardando valores"; hint = "Preencha o preço e o custo para ver a análise.";
  } else if (margin < 20) {
    tier = "critica";   label = "Margem crítica";   hint = "Abaixo de 20% — risco de prejuízo. Revise o custo.";
  } else if (margin < 30) {
    tier = "aceitavel"; label = "Margem aceitável"; hint = "Entre 20–30% — dentro do mínimo aceitável.";
  } else if (margin < 42) {
    tier = "boa";       label = "Boa margem";       hint = "Entre 30–42% — faixa saudável para o negócio.";
  } else {
    tier = "excelente"; label = "Margem excelente"; hint = "Acima de 42% — proposta muito rentável.";
  }

  const barWidth   = price > 0 ? Math.min((margin / 60) * 100, 100) : 0;
  const prazoText  = businessDays ? `${businessDays} dias úteis` : "—";

  refs.budgetLiveSummary.innerHTML = `
    <div class="margin-calc">
      <div class="margin-calc-values">
        <div class="margin-calc-item">
          <span>Preço de venda</span>
          <strong>${escapeHtml(formatCurrency(price))}</strong>
        </div>
        <div class="margin-calc-item">
          <span>Custo estimado</span>
          <strong>${escapeHtml(formatCurrency(cost))}</strong>
        </div>
        <div class="margin-calc-item">
          <span>Lucro bruto</span>
          <strong class="${profit > 0 ? "gold" : ""}">${escapeHtml(formatCurrency(profit))}</strong>
        </div>
      </div>
      ${price > 0 ? `
      <div class="margin-bar-row">
        <div class="margin-bar-header">
          <span class="margin-bar-label ${tier}">${label}</span>
          <span class="margin-bar-pct ${tier}">${escapeHtml(formatPercent(margin))}</span>
        </div>
        <div class="margin-bar-track">
          <div class="margin-bar-fill ${tier}" style="width:${barWidth}%"></div>
        </div>
        <span class="margin-bar-hint">${hint} · Prazo: ${escapeHtml(prazoText)}</span>
      </div>` : `<span class="margin-bar-hint">${hint}</span>`}
    </div>
  `;
}

function renderProjectLiveSummary() {
  const price = Number(refs.projectForm.elements.price.value || 0);
  const cost = Number(refs.projectForm.elements.cost.value || 0);
  const businessDays = Number(refs.projectForm.elements.businessDays.value || 0);
  const startDate = refs.projectForm.elements.startDate.value;
  const deliveryText = startDate && businessDays ? formatShortDate(calcDeliveryDate(startDate, businessDays)) : "Sem data";

  refs.projectLiveSummary.innerHTML = [
    inlineCard("Lucro previsto", formatCurrency(price - cost)),
    inlineCard("Margem", formatPercent(price ? ((price - cost) / price) * 100 : 0)),
    inlineCard("Entrega", deliveryText)
  ].join("");
}

function setView(view) {
  const oldPanel = refs.panels.find((p) => p.dataset.viewPanel === currentView);
  currentView = view;

  refs.menuItems.forEach((item) => {
    item.classList.toggle("active", item.dataset.view === view);
  });

  document.querySelectorAll(".mobile-nav-item").forEach((item) => {
    item.classList.toggle("active", item.dataset.view === view);
  });

  if (oldPanel) oldPanel.classList.remove("active");

  const newPanel = refs.panels.find((p) => p.dataset.viewPanel === view);
  if (newPanel) {
    newPanel.classList.add("active");

    if (window.gsap) {
      gsap.fromTo(
        newPanel,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.44, ease: "power3.out" }
      );

      const cards = newPanel.querySelectorAll(
        ".record-card, .budget-card, .kpi-card, .signal-card, .flow-card, .project-card, .alert-card, .board, .hero-panel, .timeline-panel, .ribbon-item"
      );
      if (cards.length) {
        gsap.fromTo(
          cards,
          { autoAlpha: 0, y: 18 },
          {
            autoAlpha: 1,
            y: 0,
            stagger: 0.055,
            duration: 0.55,
            ease: "power3.out",
            delay: 0.1,
            overwrite: "auto"
          }
        );
      }

      ScrollTrigger.refresh();
    }
  }

  syncViewMeta(true);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function syncViewMeta(animate) {
  refs.title.textContent = views[currentView].title;
  refs.description.textContent = views[currentView].description;
  if (animate) animateTitleIn(0);
}

function getDerivedMetrics() {
  const openBudgets = state.budgets.filter((budget) => budget.status !== "aprovado").length;
  const activeProjectsList = state.projects.filter((project) => project.status !== "entregue");
  const activeProjects = activeProjectsList.length;
  const projectRevenue = sum(state.projects, "price");
  const projectCost = sum(state.projects, "cost");
  const projectProfit = projectRevenue - projectCost;
  const averageProjectMargin = state.projects.length
    ? state.projects.reduce((acc, project) => acc + marginPercent(project), 0) / state.projects.length
    : 0;

  const upcomingProjects = [...state.projects]
    .map((project) => ({ ...project, deliveryDate: calcDeliveryDate(project.startDate, project.businessDays) }))
    .sort((a, b) => new Date(a.deliveryDate) - new Date(b.deliveryDate));

  const lowMarginProject = [...state.projects].sort((a, b) => marginPercent(a) - marginPercent(b))[0];
  const topBudgets = [...state.budgets]
    .filter((budget) => budget.status !== "aprovado")
    .sort((a, b) => marginPercent(b) - marginPercent(a))
    .slice(0, 3);
  const hotBudget = topBudgets[0];
  const featuredClient = state.clients.find((client) => collectClientMaterials(client.id).length) || state.clients[0] || null;

  return {
    openBudgets,
    activeProjects,
    projectRevenue,
    projectCost,
    projectProfit,
    averageProjectMargin,
    upcomingProjects,
    lowMarginProject,
    topBudgets,
    hotBudget,
    featuredClient
  };
}

function renderAgendaTimelineItems(projects) {
  if (!projects.length) {
    return emptyState("Sem entregas na agenda.", "Aprove um projeto para preencher esta linha do tempo.");
  }

  return projects.slice(0, 5).map((project) => {
    const deliveryDate = calcDeliveryDate(project.startDate, project.businessDays);
    const tone = daysUntil(deliveryDate) < 0 ? "danger" : daysUntil(deliveryDate) <= 3 ? "warning" : "";
    return `
      <div class="timeline-item ${tone}">
        <strong>${formatShortDate(deliveryDate)}</strong>
        <p>${escapeHtml(getClientName(project.clientId))} · ${escapeHtml(project.title)} · ${formatRemainingDays(deliveryDate)}</p>
      </div>
    `;
  }).join("");
}

function renderDashboardProjects(projects) {
  if (!projects.length) {
    return emptyState("Nenhum projeto ativo.", "Assim que um projeto entrar, ele aparece aqui com prazo e margem.");
  }

  return projects.slice(0, 3).map((project, index) => {
    const deliveryDate = calcDeliveryDate(project.startDate, project.businessDays);
    return `
      <article class="project-card ${index === 0 ? "featured" : ""}">
        <div class="project-top">
          <span class="eyebrow">${escapeHtml(getClientName(project.clientId))}</span>
          <span class="chip ${getProjectTone(project, deliveryDate)}">${escapeHtml(getProjectDisplayStatus(project, deliveryDate))}</span>
        </div>
        <h3>${escapeHtml(project.title)}</h3>
        <p class="project-subtitle">${escapeHtml(getClientById(project.clientId)?.address || getClientById(project.clientId)?.city || "Sem localização")}</p>
        <div class="metric-grid">
          <div>
            <small>Valor</small>
            <strong>${formatCurrency(project.price)}</strong>
          </div>
          <div>
            <small>Custo</small>
            <strong>${formatCurrency(project.cost)}</strong>
          </div>
          <div>
            <small>Lucro</small>
            <strong>${formatCurrency(project.price - project.cost)}</strong>
          </div>
        </div>
        <div class="project-band">
          <span>Inicio ${formatShortDate(project.startDate)}</span>
          <span>${project.businessDays} dias úteis</span>
          <span>Entrega ${formatShortDate(deliveryDate)}</span>
        </div>
      </article>
    `;
  }).join("");
}

function renderFeaturedClient(client) {
  if (!client) {
    return emptyState("Nenhum cliente em destaque.", "Cadastre clientes e materiais para ver histórico aqui.");
  }

  const materials = collectClientMaterials(client.id).slice(0, 6);
  const projects = state.projects.filter((project) => project.clientId === client.id);
  const lastProject = projects[0];

  return `
    <div class="dossier-top">
      <div>
        <p class="micro-label">Ficha</p>
        <h4 class="dossier-name">${escapeHtml(client.name)}</h4>
        <p class="record-meta">${escapeHtml(client.phone)} · ${escapeHtml(client.address || client.city || "Sem endereço")}</p>
      </div>
      <div class="status-pill ${projects.length ? "success" : ""}">${projects.length ? "cliente ativo" : "lead salvo"}</div>
    </div>
    <div class="dossier-grid">
      <div class="record-stat">
        <span>Ultimo ambiente</span>
        <strong>${escapeHtml(lastProject?.title || client.environment || "Sem projeto")}</strong>
      </div>
      <div class="record-stat">
        <span>Projetos</span>
        <strong>${projects.length}</strong>
      </div>
      <div class="record-stat">
        <span>Orçamentos</span>
        <strong>${state.budgets.filter((budget) => budget.clientId === client.id).length}</strong>
      </div>
      <div class="record-stat">
        <span>Lucro ultimo</span>
        <strong>${lastProject ? formatCurrency(lastProject.price - lastProject.cost) : "R$ 0,00"}</strong>
      </div>
    </div>
    ${materials.length ? `<div class="material-tags">${materials.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}</div>` : `<p class="field-note">Ainda sem memória de material cadastrada.</p>`}
  `;
}

function renderHotBudgets(budgets) {
  if (!budgets.length) {
    return emptyState("Sem orçamentos em aberto.", "Crie um novo orçamento para alimentar esta fila.");
  }

  return budgets.map((budget) => `
    <article class="record-card">
      <div class="record-head">
        <div class="record-main">
          <h4>${escapeHtml(getClientName(budget.clientId))}</h4>
          <p class="record-meta">${escapeHtml(budget.title)}</p>
        </div>
        <span class="status-pill ${statusTone[budget.status] || ""}">${escapeHtml(budget.status)}</span>
      </div>
      <div class="summary-line">
        <span class="muted">Margem ${formatPercent(marginPercent(budget))}</span>
        <span>${formatCurrency(budget.price)}</span>
      </div>
    </article>
  `).join("");
}

function renderFinancialHighlight(metrics) {
  const projects = state.projects.slice(0, 4);
  const maxVal   = projects.reduce((m, p) => Math.max(m, p.price), 1);

  const chartRows = projects.length
    ? projects.map((p) => {
        const revW  = (p.price / maxVal) * 100;
        const costW = (p.cost  / maxVal) * 100;
        return `
          <div class="chart-row">
            <span class="chart-label">${escapeHtml(p.title)}</span>
            <div class="chart-bars">
              <div class="chart-bar-wrap"><div class="chart-bar revenue" style="width:${revW}%"></div></div>
              <div class="chart-bar-wrap"><div class="chart-bar cost"    style="width:${costW}%"></div></div>
            </div>
            <span class="chart-val">${formatCurrency(p.price - p.cost)}</span>
          </div>`;
      }).join("")
    : `<p class="muted" style="padding:8px 0">Nenhum projeto ainda.</p>`;

  return `
    <div class="finance-chart">
      <div class="finance-chart-legend">
        <span class="legend-dot revenue"></span><span>Receita</span>
        <span class="legend-dot cost"></span><span>Custo</span>
      </div>
      ${chartRows}
    </div>
    <div class="finance-totals">
      <div class="finance-total-item"><span>Total em projetos</span><strong>${formatCurrency(metrics.projectRevenue)}</strong></div>
      <div class="finance-total-item"><span>Lucro total</span><strong class="gold">${formatCurrency(metrics.projectProfit)}</strong></div>
      <div class="finance-total-item"><span>Margem média</span><strong>${formatPercent(metrics.averageProjectMargin)}</strong></div>
    </div>
  `;
}

function renderMaterialList(materials) {
  if (!materials.length) {
    return "";
  }

  return `
    <div class="material-list">
      ${materials.map((item) => `
        <div class="material-item">
          <strong>${escapeHtml(item.name || "Material")}</strong>
          <span class="muted">${escapeHtml([item.brand, item.quantity, item.note].filter(Boolean).join(" · ") || "Sem detalhe extra")}</span>
        </div>
      `).join("")}
    </div>
  `;
}

function emptyState(title, description, cta) {
  const ctaHtml = cta
    ? `<button class="button ghost small" data-action="go-view" data-view="${cta.view}">${escapeHtml(cta.label)}</button>`
    : "";
  return `
    <div class="empty-state">
      <p class="micro-label">Sem dados</p>
      <h3>${escapeHtml(title)}</h3>
      <p>${escapeHtml(description)}</p>
      ${ctaHtml}
    </div>
  `;
}

function metricCard(label, value, note, rawValue) {
  const rawAttr = rawValue !== undefined ? ` data-raw="${rawValue}"` : "";
  return `
    <div class="kpi-card">
      <span class="micro-label">${escapeHtml(label)}</span>
      <strong${rawAttr}>${escapeHtml(value)}</strong>
      <small>${escapeHtml(note)}</small>
    </div>
  `;
}

function signalCard(title, description) {
  return `
    <div class="signal-card">
      <span class="signal-title">${escapeHtml(title)}</span>
      <p>${escapeHtml(description)}</p>
    </div>
  `;
}

function summaryBox(label, value) {
  return `
    <div class="summary-box">
      <span class="muted">${escapeHtml(label)}</span>
      <strong class="summary-number">${escapeHtml(value)}</strong>
    </div>
  `;
}

function inlineCard(label, value) {
  return `
    <div class="inline-card">
      <span class="micro-label">${escapeHtml(label)}</span>
      <strong>${escapeHtml(value)}</strong>
    </div>
  `;
}

function financeCard(label, value) {
  return `
    <div class="finance-card">
      <p class="micro-label">${escapeHtml(label)}</p>
      <div class="finance-value">${escapeHtml(value)}</div>
    </div>
  `;
}

function getClientById(clientId) {
  return state.clients.find((client) => client.id === clientId) || null;
}

function getClientName(clientId) {
  return getClientById(clientId)?.name || "Cliente";
}

function collectClientMaterials(clientId) {
  const materials = [];

  [...state.projects, ...state.budgets]
    .filter((record) => record.clientId === clientId)
    .forEach((record) => {
      record.materials.forEach((item) => {
        if (item.name) {
          materials.push(item.name);
        }
      });
    });

  return [...new Set(materials)];
}

function parseMaterialsText(text) {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [name = "", brand = "", quantity = "", cost = "", note = ""] = line.split("|").map((item) => item.trim());
      return {
        name,
        brand,
        quantity,
        cost: Number(cost.replace(",", ".")) || 0,
        note
      };
    });
}

function materialsToText(materials) {
  return materials
    .map((item) => [item.name, item.brand, item.quantity, item.cost || "", item.note].join(" | "))
    .join("\n");
}

function marginPercent(record) {
  if (!record.price) {
    return 0;
  }
  return ((record.price - record.cost) / record.price) * 100;
}

function calcDeliveryDate(startDate, businessDays) {
  const date = new Date(`${startDate}T12:00:00`);
  let remaining = Number(businessDays);

  while (remaining > 0) {
    date.setDate(date.getDate() + 1);
    const day = date.getDay();
    if (day !== 0 && day !== 6) {
      remaining -= 1;
    }
  }

  return date.toISOString().slice(0, 10);
}

function daysUntil(dateString) {
  const target = new Date(`${dateString}T12:00:00`);
  const today = new Date(`${todayISO()}T12:00:00`);
  return Math.round((target - today) / 86400000);
}

function getProjectDisplayStatus(project, deliveryDate) {
  if (project.status !== "entregue" && daysUntil(deliveryDate) < 0) {
    return "atrasado";
  }
  return project.status;
}

function getProjectTone(project, deliveryDate) {
  return statusTone[getProjectDisplayStatus(project, deliveryDate)] || "";
}

function formatRemainingDays(dateString) {
  const diff = daysUntil(dateString);
  if (diff < 0) {
    return `${Math.abs(diff)} dias atrasado`;
  }
  if (diff === 0) {
    return "vence hoje";
  }
  if (diff === 1) {
    return "vence amanhã";
  }
  return `faltam ${diff} dias`;
}

function formatCurrency(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(Number(value || 0));
}

function formatPercent(value) {
  return `${Number(value || 0).toFixed(1).replace(".", ",")}%`;
}

function formatShortDate(dateString) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short"
  }).format(new Date(`${dateString}T12:00:00`));
}

function formatLongDate(date) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(date);
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function sum(list, key) {
  return list.reduce((acc, item) => acc + Number(item[key] || 0), 0);
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultState));
      return structuredClone(defaultState);
    }

    const parsed = JSON.parse(raw);
    return {
      clients: parsed.clients || [],
      budgets: parsed.budgets || [],
      projects: parsed.projects || []
    };
  } catch (error) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultState));
    return structuredClone(defaultState);
  }
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function setupMotion() {
  if (!window.gsap) return;

  const plugins = [ScrollTrigger];
  if (window.SplitText) plugins.push(SplitText);
  gsap.registerPlugin(...plugins);

  gsap.defaults({ duration: 0.75, ease: "power2.out" });

  buildIntroTimeline();
  setupScrollReveals();
  setupAmbientFloat();
  setupBackgroundDrift();
}

function buildIntroTimeline() {
  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

  tl.from(".brand", { y: 36, autoAlpha: 0, duration: 1 })
    .from(".menu-item", { x: -26, autoAlpha: 0, stagger: 0.065, duration: 0.6 }, "-=0.65")
    .from(".rail-panel.secondary", { y: 22, autoAlpha: 0, duration: 0.7 }, "-=0.42")
    .from(".masthead", { y: 30, autoAlpha: 0, duration: 0.8 }, "-=0.45")
    .from(".ribbon-item", { y: 20, autoAlpha: 0, stagger: 0.08, duration: 0.6 }, "-=0.4");

  animateTitleIn(0.38);
}

function setupScrollReveals() {
  const mm = gsap.matchMedia();
  mm.add("(prefers-reduced-motion: no-preference)", () => {
    gsap.set(".reveal-item", { autoAlpha: 0, y: 28 });

    ScrollTrigger.batch(".reveal-item", {
      start: "top 88%",
      onEnter: (batch) =>
        gsap.to(batch, {
          autoAlpha: 1,
          y: 0,
          stagger: 0.07,
          duration: 0.85,
          ease: "power3.out",
          overwrite: "auto"
        }),
      onLeaveBack: (batch) =>
        gsap.set(batch, { autoAlpha: 0, y: 28, overwrite: "auto" })
    });
  });
}

function setupAmbientFloat() {
  const mm = gsap.matchMedia();
  mm.add("(prefers-reduced-motion: no-preference)", () => {
    gsap.to(".kpi-card:nth-child(odd)", {
      y: -6,
      duration: 2.4,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
    gsap.to(".kpi-card:nth-child(even)", {
      y: -5,
      duration: 2.0,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 0.5
    });
    gsap.to(".brand", {
      boxShadow: "0 0 52px rgba(201,168,76,0.2), inset 0 0 0 1px rgba(201,168,76,0.24)",
      duration: 3.4,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  });
}

function setupBackgroundDrift() {
  const mm = gsap.matchMedia();
  mm.add("(prefers-reduced-motion: no-preference)", () => {
    gsap.to(".background-mesh", {
      backgroundPosition: "72px 72px",
      duration: 40,
      repeat: -1,
      ease: "none"
    });
  });
}

function animateTitleIn(delay) {
  if (!window.gsap || !refs.title) return;
  delay = delay || 0;

  if (window.SplitText) {
    const split = SplitText.create(refs.title, { type: "words", mask: "words" });
    gsap.fromTo(
      split.words,
      { yPercent: 112 },
      {
        yPercent: 0,
        stagger: 0.06,
        duration: 0.78,
        ease: "power3.out",
        delay,
        onComplete: () => split.revert()
      }
    );
  } else {
    gsap.fromTo(
      refs.title,
      { y: 24, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.75, ease: "power3.out", delay }
    );
  }
}

function animateDashboardNumbers() {
  if (!window.gsap) return;

  refs.dashboardKpis.querySelectorAll("strong[data-raw]").forEach((el) => {
    const raw = parseFloat(el.dataset.raw);
    if (!isFinite(raw) || raw === 0) return;

    const isCurrency = el.textContent.includes("R$");
    const obj = { val: 0 };

    gsap.to(obj, {
      val: raw,
      duration: 1.3,
      ease: "power2.out",
      onUpdate() {
        el.textContent = isCurrency ? formatCurrency(obj.val) : String(Math.round(obj.val));
      }
    });
  });
}

function animateFirstCard(listEl) {
  if (!window.gsap || !listEl) return;
  const first = listEl.firstElementChild;
  if (!first) return;
  gsap.fromTo(
    first,
    { autoAlpha: 0, y: 22, scale: 0.97 },
    { autoAlpha: 1, y: 0, scale: 1, duration: 0.55, ease: "power3.out" }
  );
}
