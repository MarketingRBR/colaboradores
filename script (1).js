/* ===========================================================
   RBR Representações - Banco de Colaboradores
   script.js - lógica completa do sistema
   =========================================================== */

(function () {
  "use strict";

  /* ===================== CONSTANTS ===================== */
  const DB_KEY = "rbr_colaboradores_db_v1";
  const THEME_KEY = "rbr_theme";
  const PER_PAGE = 8;
  const MESES_PT = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];

  /* ===================== STATE ===================== */
  let employees = [];
  let charts = { estado: null, departamento: null, gestor: null };
  let table = { sortField: "nome", sortDir: "asc", page: 1, filters: { nome: "", estado: "", cidade: "", departamento: "", marca: "", gestor: "" } };
  let globalSearchTerm = "";
  let confirmCallback = null;
  let currentCardEmployee = null;
  let pendingPhotoData = null;

  /* ===================== SEED DATA ===================== */
  function seedData() {
    // Dados públicos/funcionais da equipe RBR. Informações sensíveis como
    // CPF/RG são mantidas apenas pois fazem parte do cadastro padrão de RH;
    // dados bancários, senhas e credenciais de sistemas NÃO são armazenados aqui.
    return [
      mk("Alexsander Lopes Garcia", "Alexsander", "819.665.204-68", "3103520", "Masculino", "1974-07-15", "vendas01@rbrltda.com.br", "", "(71) 99950-1515", "51270-690", "Avenida Engenho Barra Norte", "41", "Cohab", "Recife", "PE", "2020-09-08", "Vendedor", "Comercial", "", "Multimarcas"),
      mk("Caíque Leda Gonçalves", "Caíque", "012.121.595-43", "93.686.39-00", "Masculino", "1984-09-06", "coordenador01@rbrltda.com.br", "", "(71) 99975-0099", "41810-670", "Rua Carmen Miranda", "85, Ap. 403", "Pituba", "Salvador", "BA", "2019-10-22", "Coordenador Comercial e Trade Marketing", "Comercial", "", "Multimarcas"),
      mk("Claudinho Caldas Costa", "Claudinho", "641.467.155-04", "5.776.378", "Masculino", "1973-03-11", "comercial01@rbrltda.com.br", "", "(71) 99110-9090", "40354-122", "Rua dos Libertadores", "58", "Fazenda Grande do Retiro", "Salvador", "BA", "2019-02-06", "Consultor Comercial", "Comercial", "", "Multimarcas"),
      mk("Fabrício Leite dos Santos", "Fabrício", "809.826.545-53", "05670799-10", "Masculino", "1980-01-07", "promotor01@rbrltda.com.br", "", "(71) 99340-2470", "42722-020", "Avenida José Leite", "684, Cond. Gran Ville das Artes", "Caji", "Lauro de Freitas", "BA", "2023-12-12", "Promotor de Vendas", "Promotores", "Monique Soares", "Multimarcas"),
      mk("Jorge Luiz Miranda Lopes de Paiva", "Jorge Paiva", "074.869.514-10", "6377705", "Masculino", "1987-05-18", "promotor05@rbrltda.com.br", "", "(81) 99625-5742", "58068-103", "Rua Inácio Marcelino", "876, Cond. Villa Jardim 2 Bl. G", "Gramame", "João Pessoa", "PB", "2025-04-01", "Promotor de Vendas", "Promotores", "Monique Soares", "Multimarcas"),
      mk("Lucas Matheus Costa da Silva", "Lucas Matheus", "089.608.814-65", "9324800", "Masculino", "1994-02-15", "promotor04@rbrltda.com.br", "", "(84) 99817-7931", "59152-330", "Avenida Petra Kelly", "1148, Cond. Monterrey Bl. 12 apto 32", "Nova Parnamirim", "Natal", "RN", "2024-09-02", "Promotor de Vendas", "Promotores", "Monique Soares", "Multimarcas"),
      mk("Mariana Matos dos Santos", "Mariana", "014.334.385-85", "08.008.846-55", "Feminino", "1982-10-25", "adm@rbrltda.com.br", "", "(71) 99340-2460", "40240-310", "Rua Jardim João XXIII", "196, Ap. 101", "Engenho Velho de Brotas", "Salvador", "BA", "2018-12-10", "Assistente Administrativo", "Administrativo", "", ""),
      mk("Monique Soares Monteiro", "Monique", "065.564.804-60", "606.385-3", "Feminino", "1986-11-08", "promotor03@rbrltda.com.br", "", "(71) 99989-5550", "51160-070", "Rua Jorge de Lima", "245", "Imbiribeira", "Recife", "PE", "2017-05-02", "Supervisora de Trade Marketing", "Trade Marketing", "Diretoria", "Multimarcas"),
      mk("Nelivaldo Gomes Santos Junior", "Nelivaldo", "062.452.805-75", "1564863506", "Masculino", "1998-10-01", "suporte02@rbrltda.com.br", "", "(71) 99340-2410", "42713-220", "Rua Cristovão B. Pires", "S/N", "Portão", "Lauro de Freitas", "BA", "2023-05-15", "Assistente Comercial", "Comercial", "", ""),
      mk("Paulo Victor Santos dos Santos", "Paulo Victor", "063.017.315-06", "13.529.007-42", "Masculino", "1995-09-05", "suporte01@rbrltda.com.br", "", "(71) 99953-5550", "42722-020", "Rua José Leite", "686, Cond. Gran Ville das Artes", "Caji", "Lauro de Freitas", "BA", "2017-04-03", "Analista Comercial", "Comercial", "", ""),
      mk("Severino Luiz Gomes Junior", "Severino", "041.526.824-93", "6062893", "Masculino", "1983-07-03", "promotor02@rbrltda.com.br", "", "(81) 99103-7615", "53417-190", "Rua Bom Conselho", "185", "Artur Lundgren I", "Paulista", "PE", "2021-05-10", "Promotor de Vendas (PE/AL)", "Promotores", "Monique Soares", "Multimarcas"),
      mk("Taylor Feitosa da Silva Martins", "Taylor Feitosa", "386.156.078-00", "37560270", "Masculino", "1995-01-20", "promotor06@rbrltda.com.br", "", "(71) 99949-9990", "57071-192", "Rua Engenheiro Márcio Pinto de Araújo", "17", "Clima Bom", "Maceió", "AL", "2025-04-01", "Promotor de Vendas (AL)", "Promotores", "Monique Soares", "Multimarcas"),
      mk("Tayonara Castro de Sousa", "Tayonara", "011.646.493-37", "2002012006995", "Feminino", "1986-10-08", "supervisor01@rbrltda.com.br", "", "(71) 99670-7676", "60525-170", "Rua Álvaro de Andrade", "128", "João XXIII", "Fortaleza", "CE", "2026-02-10", "Supervisora Comercial", "Comercial", "Diretoria", "Multimarcas"),
      mk("Thayane Pereira de Oliveira Rios", "Thayane", "041.509.875-05", "55.530.370-6", "Feminino", "1990-06-07", "marketing@rbrltda.com.br", "", "(71) 99663-1515", "41745-028", "Rua Vila Rita", "888, Cond. Aldeia das Pedras", "Trobogy", "Salvador", "BA", "2025-11-03", "Analista de Marketing", "Marketing", "", ""),
      mk("Tiago Cesar da Silva", "Tiago", "015.707.285-18", "0922388660", "Masculino", "1984-11-06", "suporte03@rbrltda.com.br", "", "(71) 99728-2030", "41770-030", "Rua Arthur Fraga", "389, Cond. Vale dos Rios, Ed. Sapucaia, apto 201", "Stiep", "Salvador", "BA", "2026-03-16", "Analista de Suporte", "TI / Suporte", "", ""),
      mk("Vanderson Lindeberg da Silva", "Vanderson", "079.804.044-08", "7.637.985", "Masculino", "1990-10-08", "promotor08@rbrltda.com.br", "", "(71) 99923-2022", "50740-510", "Rua Coronel Célio Regueira", "60, Apto 401A, Cond. La Vie", "Várzea", "Recife", "PE", "2026-04-13", "Promotor de Vendas (PE)", "Promotores", "Monique Soares", "Multimarcas"),
      mk("Etel Lima Serpa", "Etel", "786.277.705-06", "786.277.705-06", "", "1980-05-29", "promotor07@rbrltda.com.br", "", "(71) 99969-0660", "41204-080", "Loteamento Santa Bárbara", "QD 09, casa 03", "Arraial do Retiro", "Salvador", "BA", "2026-06-11", "Promotor(a) de Vendas", "Promotores", "Monique Soares", "Multimarcas"),
      mk("Liane Silva Lopes", "Liane", "826.466.865-87", "07518290-48", "Feminino", "1981-03-20", "promotor09@rbrltda.com.br", "(71) 99925-2027", "(71) 98321-1551", "41256-280", "Travessa Mata Atlântica", "1, Bl. 16, Ap. 104", "Vale dos Lagos", "Salvador", "BA", "2026-06-11", "Promotor de Merchandising", "Promotores", "Monique Soares", "Multimarcas"),
    ];
  }

  function mk(nome, apelido, cpf, rg, sexo, nasc, email, tel, cel, cep, rua, numero, bairro, cidade, estado, admissao, cargo, depto, gestor, marca) {
    return {
      id: uid(),
      nome, apelido, cpf, rg, sexo,
      dataNascimento: nasc,
      estadoCivil: "",
      email, telefone: tel, celular: cel,
      cep, rua, numero, bairro, cidade, estado,
      matricula: "",
      dataAdmissao: admissao,
      cargo, departamento: depto, gestor, marca,
      status: "Ativo",
      foto: null
    };
  }

  /* ===================== STORAGE ===================== */
  function loadDB() {
    try {
      const raw = localStorage.getItem(DB_KEY);
      if (raw) {
        employees = JSON.parse(raw);
        return;
      }
    } catch (e) { /* corrupted, fall through to seed */ }
    employees = seedData();
    saveDB();
  }
  function saveDB() {
    localStorage.setItem(DB_KEY, JSON.stringify(employees));
  }
  function uid() {
    return "emp_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  /* ===================== HELPERS ===================== */
  function fmtDate(iso) {
    if (!iso) return "—";
    const [y, m, d] = iso.split("-");
    if (!y || !m || !d) return "—";
    return `${d}/${m}/${y}`;
  }
  function todayISO() {
    return new Date().toISOString().slice(0, 10);
  }
  function calcAge(iso) {
    if (!iso) return null;
    const b = new Date(iso + "T00:00:00");
    const t = new Date();
    let age = t.getFullYear() - b.getFullYear();
    const m = t.getMonth() - b.getMonth();
    if (m < 0 || (m === 0 && t.getDate() < b.getDate())) age--;
    return age;
  }
  function calcTenure(iso) {
    if (!iso) return "—";
    const a = new Date(iso + "T00:00:00");
    const t = new Date();
    let years = t.getFullYear() - a.getFullYear();
    let months = t.getMonth() - a.getMonth();
    if (t.getDate() < a.getDate()) months--;
    if (months < 0) { years--; months += 12; }
    const parts = [];
    if (years > 0) parts.push(`${years} ano${years > 1 ? "s" : ""}`);
    if (months > 0 || years === 0) parts.push(`${months} ${months === 1 ? "mês" : "meses"}`);
    return parts.join(" e ");
  }
  function initials(name) {
    if (!name) return "?";
    const parts = name.trim().split(/\s+/);
    const first = parts[0]?.[0] || "";
    const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
    return (first + last).toUpperCase();
  }
  function escapeHtml(str) {
    if (str === null || str === undefined) return "";
    return String(str).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }
  function statusClass(status) {
    return { "Ativo": "ativo", "Inativo": "inativo", "Férias": "ferias", "Afastado": "afastado" }[status] || "ativo";
  }
  function avatarHTML(emp, size) {
    const cls = size === "lg" ? "avatar-lg" : "avatar-sm";
    if (emp.foto) return `<div class="${cls}"><img src="${emp.foto}" alt=""></div>`;
    return `<div class="${cls}">${initials(emp.apelido || emp.nome)}</div>`;
  }

  /* ===================== TOASTS ===================== */
  function toast(msg, type = "info") {
    const c = document.getElementById("toastContainer");
    const icon = { success: "fa-circle-check", error: "fa-circle-exclamation", info: "fa-circle-info" }[type];
    const el = document.createElement("div");
    el.className = `toast ${type}`;
    el.innerHTML = `<i class="fa-solid ${icon}"></i><span>${escapeHtml(msg)}</span>`;
    c.appendChild(el);
    setTimeout(() => {
      el.style.opacity = "0";
      el.style.transform = "translateX(20px)";
      setTimeout(() => el.remove(), 200);
    }, 3200);
  }

  /* ===================== CONFIRM MODAL ===================== */
  function askConfirm(title, message, onConfirm) {
    document.getElementById("confirmTitle").textContent = title;
    document.getElementById("confirmMessage").textContent = message;
    confirmCallback = onConfirm;
    openModal("confirmModalOverlay");
  }

  /* ===================== MODAL HELPERS ===================== */
  function openModal(id) { document.getElementById(id).classList.add("open"); }
  function closeModal(id) { document.getElementById(id).classList.remove("open"); }

  /* ===================== NAVIGATION ===================== */
  function switchView(view) {
    document.querySelectorAll(".view").forEach(v => v.classList.add("hidden"));
    document.getElementById("view-" + view).classList.remove("hidden");
    document.querySelectorAll(".nav-item").forEach(b => b.classList.toggle("active", b.dataset.view === view));
    closeSidebar();
    if (view === "dashboard") renderDashboard();
    if (view === "colaboradores") renderTable();
    if (view === "aniversariantes") renderBirthdays();
    if (view === "empresa") renderCompanyAnniversaries();
    if (view === "relatorios") renderSummary();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openSidebar() {
    document.getElementById("sidebar").classList.add("open");
    document.getElementById("sidebarOverlay").classList.add("show");
  }
  function closeSidebar() {
    document.getElementById("sidebar").classList.remove("open");
    document.getElementById("sidebarOverlay").classList.remove("show");
  }

  /* ===================== DASHBOARD ===================== */
  function renderDashboard() {
    const now = new Date();
    const curMonth = now.getMonth();

    const total = employees.length;
    const birthdays = employees.filter(e => e.dataNascimento && (new Date(e.dataNascimento + "T00:00:00").getMonth() === curMonth)).length;
    const admissions = employees.filter(e => e.dataAdmissao && (new Date(e.dataAdmissao + "T00:00:00").getMonth() === curMonth)).length;
    const active = employees.filter(e => e.status === "Ativo").length;
    const promoters = employees.filter(e => /promotor/i.test(e.cargo) || e.departamento === "Promotores").length;
    const admin = employees.filter(e => e.departamento === "Administrativo").length;

    document.getElementById("kpiTotal").textContent = total;
    document.getElementById("kpiBirthdays").textContent = birthdays;
    document.getElementById("kpiAdmissions").textContent = admissions;
    document.getElementById("kpiActive").textContent = active;
    document.getElementById("kpiPromoters").textContent = promoters;
    document.getElementById("kpiAdmin").textContent = admin;

    renderChart("estado", "chartEstado", groupCount(employees, "estado"));
    renderChart("departamento", "chartDepartamento", groupCount(employees, "departamento"));
    renderChart("gestor", "chartGestor", groupCount(employees, "gestor", "Sem gestor"));
  }

  function groupCount(list, field, emptyLabel) {
    const map = {};
    list.forEach(e => {
      const key = (e[field] && String(e[field]).trim()) || emptyLabel || "Não informado";
      map[key] = (map[key] || 0) + 1;
    });
    return map;
  }

  function renderChart(key, canvasId, dataMap) {
    const labels = Object.keys(dataMap);
    const values = Object.values(dataMap);
    const palette = ["#003E7E", "#E30613", "#1559A5", "#9AA7C2", "#7A1F2B", "#5B8DBE", "#C9CDD4", "#0B7A4B", "#9A6700", "#4A2F6B"];
    const ctx = document.getElementById(canvasId).getContext("2d");
    if (charts[key]) charts[key].destroy();
    charts[key] = new Chart(ctx, {
      type: "doughnut",
      data: { labels, datasets: [{ data: values, backgroundColor: palette, borderWidth: 2, borderColor: getComputedStyle(document.body).getPropertyValue("--white") || "#fff" }] },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: { legend: { position: "bottom", labels: { boxWidth: 10, font: { size: 11 }, color: getComputedStyle(document.body).getPropertyValue("--ink") } } }
      }
    });
  }

  /* ===================== TABLE / COLABORADORES ===================== */
  function getFilteredSorted() {
    let list = employees.slice();
    const f = table.filters;
    const term = globalSearchTerm.trim().toLowerCase();

    if (term) {
      list = list.filter(e =>
        [e.nome, e.cidade, e.estado, e.cargo, e.departamento].some(v => (v || "").toLowerCase().includes(term))
      );
    }
    if (f.nome) list = list.filter(e => e.nome.toLowerCase().includes(f.nome.toLowerCase()));
    if (f.estado) list = list.filter(e => e.estado === f.estado);
    if (f.cidade) list = list.filter(e => e.cidade === f.cidade);
    if (f.departamento) list = list.filter(e => e.departamento === f.departamento);
    if (f.marca) list = list.filter(e => e.marca === f.marca);
    if (f.gestor) list = list.filter(e => e.gestor === f.gestor);

    list.sort((a, b) => {
      let va = (a[table.sortField] || "").toString().toLowerCase();
      let vb = (b[table.sortField] || "").toString().toLowerCase();
      if (va < vb) return table.sortDir === "asc" ? -1 : 1;
      if (va > vb) return table.sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return list;
  }

  function populateFilterOptions() {
    const estados = [...new Set(employees.map(e => e.estado).filter(Boolean))].sort();
    const cidades = [...new Set(employees.map(e => e.cidade).filter(Boolean))].sort();
    const deptos = [...new Set(employees.map(e => e.departamento).filter(Boolean))].sort();
    const marcas = [...new Set(employees.map(e => e.marca).filter(Boolean))].sort();
    const gestores = [...new Set(employees.map(e => e.gestor).filter(Boolean))].sort();

    fillSelect("filterEstado", estados, "Estado");
    fillSelect("filterCidade", cidades, "Cidade");
    fillSelect("filterDepartamento", deptos, "Departamento");
    fillSelect("filterMarca", marcas, "Marca");
    fillSelect("filterGestor", gestores, "Gestor");
  }
  function fillSelect(id, values, placeholder) {
    const sel = document.getElementById(id);
    const current = sel.value;
    sel.innerHTML = `<option value="">${placeholder}</option>` + values.map(v => `<option value="${escapeHtml(v)}">${escapeHtml(v)}</option>`).join("");
    if (values.includes(current)) sel.value = current;
  }

  function renderTable() {
    populateFilterOptions();
    const list = getFilteredSorted();
    const totalPages = Math.max(1, Math.ceil(list.length / PER_PAGE));
    if (table.page > totalPages) table.page = totalPages;
    const start = (table.page - 1) * PER_PAGE;
    const pageItems = list.slice(start, start + PER_PAGE);

    const tbody = document.getElementById("employeeTableBody");
    if (pageItems.length === 0) {
      tbody.innerHTML = `<tr><td colspan="10" style="text-align:center; padding:50px; color:var(--gray-500);"><i class="fa-solid fa-user-slash" style="font-size:26px; display:block; margin-bottom:10px;"></i>Nenhum colaborador encontrado.</td></tr>`;
    } else {
      tbody.innerHTML = pageItems.map(e => `
        <tr>
          <td class="cell-photo">${avatarHTML(e)}</td>
          <td class="name-cell" style="cursor:pointer;" data-open-profile="${e.id}"><strong>${escapeHtml(e.nome)}</strong><span>${escapeHtml(e.email || "")}</span></td>
          <td>${escapeHtml(e.cargo || "—")}</td>
          <td>${escapeHtml(e.departamento || "—")}</td>
          <td>${escapeHtml(e.cidade || "—")}</td>
          <td>${escapeHtml(e.estado || "—")}</td>
          <td>${fmtDate(e.dataNascimento)}</td>
          <td>${fmtDate(e.dataAdmissao)}</td>
          <td><span class="badge ${statusClass(e.status)}">${escapeHtml(e.status)}</span></td>
          <td>
            <div class="row-actions">
              <button data-action="view" data-id="${e.id}" title="Visualizar"><i class="fa-solid fa-eye"></i></button>
              <button data-action="edit" data-id="${e.id}" title="Editar"><i class="fa-solid fa-pen"></i></button>
              <button data-action="delete" class="del" data-id="${e.id}" title="Excluir"><i class="fa-solid fa-trash"></i></button>
            </div>
          </td>
        </tr>
      `).join("");
    }

    document.getElementById("paginationInfo").textContent =
      list.length === 0 ? "0 resultados" : `Mostrando ${start + 1}–${Math.min(start + PER_PAGE, list.length)} de ${list.length} colaboradores`;
    renderPagination(totalPages);
  }

  function renderPagination(totalPages) {
    const wrap = document.getElementById("pagination");
    let html = "";
    for (let i = 1; i <= totalPages; i++) {
      html += `<button class="${i === table.page ? "active" : ""}" data-page="${i}">${i}</button>`;
    }
    wrap.innerHTML = html;
  }

  /* ===================== ANIVERSARIANTES ===================== */
  function renderBirthdays() {
    const now = new Date();
    const curMonth = now.getMonth();
    document.getElementById("aniversariantesSubtitle").textContent = `Aniversariantes de ${MESES_PT[curMonth]}`;

    const list = employees
      .filter(e => e.dataNascimento && new Date(e.dataNascimento + "T00:00:00").getMonth() === curMonth)
      .sort((a, b) => new Date(a.dataNascimento + "T00:00:00").getDate() - new Date(b.dataNascimento + "T00:00:00").getDate());

    const grid = document.getElementById("birthdayGrid");
    if (list.length === 0) {
      grid.innerHTML = `<div class="empty-state"><i class="fa-solid fa-cake-candles"></i><p>Nenhum aniversariante este mês.</p></div>`;
      return;
    }
    grid.innerHTML = list.map(e => {
      const d = new Date(e.dataNascimento + "T00:00:00");
      return `
      <div class="person-card">
        ${avatarHTML(e, "lg")}
        <h4>${escapeHtml(e.nome)}</h4>
        <p>${escapeHtml(e.cargo || "")}${e.departamento ? " · " + escapeHtml(e.departamento) : ""}</p>
        <span class="date-chip">${String(d.getDate()).padStart(2, "0")} de ${MESES_PT[d.getMonth()]}</span>
        <button class="btn btn-primary" data-action="card" data-type="aniversario" data-id="${e.id}"><i class="fa-solid fa-wand-magic-sparkles"></i> Gerar Card</button>
      </div>`;
    }).join("");
  }

  /* ===================== ANIVERSÁRIO DE EMPRESA ===================== */
  function renderCompanyAnniversaries() {
    const now = new Date();
    const curMonth = now.getMonth();
    const list = employees
      .filter(e => e.dataAdmissao && new Date(e.dataAdmissao + "T00:00:00").getMonth() === curMonth)
      .sort((a, b) => new Date(a.dataAdmissao + "T00:00:00").getDate() - new Date(b.dataAdmissao + "T00:00:00").getDate());

    const grid = document.getElementById("companyAnniversaryGrid");
    if (list.length === 0) {
      grid.innerHTML = `<div class="empty-state"><i class="fa-solid fa-building-flag"></i><p>Nenhum aniversário de empresa este mês.</p></div>`;
      return;
    }
    grid.innerHTML = list.map(e => {
      const years = calcCompanyYears(e.dataAdmissao);
      return `
      <div class="person-card">
        ${avatarHTML(e, "lg")}
        <h4>${escapeHtml(e.nome)}</h4>
        <p>${escapeHtml(e.cargo || "")}</p>
        <span class="date-chip blue-chip">${years} ${years === 1 ? "ano" : "anos"} de empresa</span>
        <button class="btn btn-primary" data-action="card" data-type="empresa" data-id="${e.id}"><i class="fa-solid fa-wand-magic-sparkles"></i> Gerar Card</button>
      </div>`;
    }).join("");
  }
  function calcCompanyYears(iso) {
    if (!iso) return 0;
    const a = new Date(iso + "T00:00:00");
    const t = new Date();
    let years = t.getFullYear() - a.getFullYear();
    if (t.getMonth() < a.getMonth() || (t.getMonth() === a.getMonth() && t.getDate() < a.getDate())) years--;
    return Math.max(years, 0);
  }

  /* ===================== PERFIL ===================== */
  function openProfile(id) {
    const e = employees.find(x => x.id === id);
    if (!e) return;
    const age = calcAge(e.dataNascimento);
    document.getElementById("profileModalBody").innerHTML = `
      <div class="profile-header">
        ${avatarHTML(e, "lg")}
        <div>
          <h3>${escapeHtml(e.nome)}</h3>
          <p>${escapeHtml(e.cargo || "—")} · ${escapeHtml(e.departamento || "—")}</p>
        </div>
      </div>
      <div class="profile-grid">
        <div class="profile-item"><span>Cidade</span><strong>${escapeHtml(e.cidade || "—")} / ${escapeHtml(e.estado || "—")}</strong></div>
        <div class="profile-item"><span>Telefone / Celular</span><strong>${escapeHtml(e.celular || e.telefone || "—")}</strong></div>
        <div class="profile-item"><span>E-mail</span><strong>${escapeHtml(e.email || "—")}</strong></div>
        <div class="profile-item"><span>Data de nascimento</span><strong>${fmtDate(e.dataNascimento)}${age !== null ? " (" + age + " anos)" : ""}</strong></div>
        <div class="profile-item"><span>Data de admissão</span><strong>${fmtDate(e.dataAdmissao)}</strong></div>
        <div class="profile-item"><span>Gestor</span><strong>${escapeHtml(e.gestor || "—")}</strong></div>
        <div class="profile-item"><span>Marca atendida</span><strong>${escapeHtml(e.marca || "—")}</strong></div>
        <div class="profile-item"><span>Status</span><strong>${escapeHtml(e.status)}</strong></div>
      </div>
      <div class="profile-tenure"><i class="fa-solid fa-business-time"></i> Tempo de empresa: ${calcTenure(e.dataAdmissao)}</div>
    `;
    openModal("profileModalOverlay");
  }

  /* ===================== CARD GERADOR ===================== */
  function openCard(id, type) {
    const e = employees.find(x => x.id === id);
    if (!e) return;
    currentCardEmployee = { e, type };
    const preview = document.getElementById("cardPreview");
    let title, sub, msg;
    if (type === "aniversario") {
      const age = calcAge(e.dataNascimento);
      title = "Feliz Aniversário!";
      sub = `${escapeHtml(e.nome)} — ${age !== null ? age + " anos" : ""}`;
      msg = "Que seu dia seja repleto de alegria e realizações. A equipe RBR deseja um excelente ano! 🎉";
    } else {
      const years = calcCompanyYears(e.dataAdmissao);
      title = `${years} ${years === 1 ? "Ano" : "Anos"} de RBR!`;
      sub = escapeHtml(e.nome);
      msg = `Obrigado por fazer parte da nossa história. Parabéns pelos ${years} ${years === 1 ? "ano" : "anos"} de dedicação! 🚀`;
    }
    preview.innerHTML = `
      ${avatarHTML(e, "lg")}
      <h2>${title}</h2>
      <p>${sub}</p>
      <div class="card-msg">${msg}</div>
      <div class="card-logo">RBR Representações</div>
    `;
    openModal("cardModalOverlay");
  }

  function downloadCard() {
    const node = document.getElementById("cardPreview");
    if (typeof html2canvas === "undefined") { toast("Não foi possível gerar a imagem do cartão.", "error"); return; }
    html2canvas(node, { backgroundColor: null, scale: 2 }).then(canvas => {
      const link = document.createElement("a");
      link.download = `cartao_${(currentCardEmployee?.e.nome || "colaborador").replace(/\s+/g, "_")}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      toast("Cartão baixado com sucesso!", "success");
    });
  }

  function copyCardText() {
    if (!currentCardEmployee) return;
    const { e, type } = currentCardEmployee;
    let text;
    if (type === "aniversario") {
      text = `🎉 Feliz Aniversário, ${e.nome}! A equipe RBR Representações deseja um dia incrível e um ano repleto de conquistas!`;
    } else {
      const years = calcCompanyYears(e.dataAdmissao);
      text = `🚀 Parabéns, ${e.nome}, pelos ${years} ${years === 1 ? "ano" : "anos"} de RBR Representações! Obrigado por fazer parte da nossa história.`;
    }
    navigator.clipboard.writeText(text).then(() => toast("Texto copiado!", "success")).catch(() => toast("Não foi possível copiar.", "error"));
  }

  /* ===================== FORM (CRIAR / EDITAR) ===================== */
  function openForm(id) {
    const form = document.getElementById("employeeForm");
    form.reset();
    pendingPhotoData = null;
    document.getElementById("photoPreview").classList.add("hidden");
    document.getElementById("photoPlaceholder").classList.remove("hidden");

    if (id) {
      const e = employees.find(x => x.id === id);
      if (!e) return;
      document.getElementById("formModalTitle").textContent = "Editar Colaborador";
      document.getElementById("empId").value = e.id;
      document.getElementById("empNome").value = e.nome || "";
      document.getElementById("empApelido").value = e.apelido || "";
      document.getElementById("empCpf").value = e.cpf || "";
      document.getElementById("empRg").value = e.rg || "";
      document.getElementById("empSexo").value = e.sexo || "";
      document.getElementById("empNascimento").value = e.dataNascimento || "";
      document.getElementById("empEstadoCivil").value = e.estadoCivil || "";
      document.getElementById("empEmail").value = e.email || "";
      document.getElementById("empTelefone").value = e.telefone || "";
      document.getElementById("empCelular").value = e.celular || "";
      document.getElementById("empCep").value = e.cep || "";
      document.getElementById("empRua").value = e.rua || "";
      document.getElementById("empNumero").value = e.numero || "";
      document.getElementById("empBairro").value = e.bairro || "";
      document.getElementById("empCidade").value = e.cidade || "";
      document.getElementById("empEstado").value = e.estado || "";
      document.getElementById("empMatricula").value = e.matricula || "";
      document.getElementById("empAdmissao").value = e.dataAdmissao || "";
      document.getElementById("empCargo").value = e.cargo || "";
      document.getElementById("empDepartamento").value = e.departamento || "";
      document.getElementById("empGestor").value = e.gestor || "";
      document.getElementById("empMarca").value = e.marca || "";
      document.getElementById("empStatus").value = e.status || "Ativo";
      if (e.foto) {
        pendingPhotoData = e.foto;
        document.getElementById("photoPreview").src = e.foto;
        document.getElementById("photoPreview").classList.remove("hidden");
        document.getElementById("photoPlaceholder").classList.add("hidden");
      }
    } else {
      document.getElementById("formModalTitle").textContent = "Novo Colaborador";
      document.getElementById("empId").value = "";
      document.getElementById("empStatus").value = "Ativo";
    }
    openModal("formModalOverlay");
  }

  function handlePhotoInput(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      pendingPhotoData = ev.target.result;
      document.getElementById("photoPreview").src = pendingPhotoData;
      document.getElementById("photoPreview").classList.remove("hidden");
      document.getElementById("photoPlaceholder").classList.add("hidden");
    };
    reader.readAsDataURL(file);
  }

  function handleFormSubmit(ev) {
    ev.preventDefault();
    const id = document.getElementById("empId").value;
    const nome = document.getElementById("empNome").value.trim();
    if (!nome) { toast("Informe o nome completo.", "error"); return; }

    const data = {
      nome,
      apelido: document.getElementById("empApelido").value.trim(),
      cpf: document.getElementById("empCpf").value.trim(),
      rg: document.getElementById("empRg").value.trim(),
      sexo: document.getElementById("empSexo").value,
      dataNascimento: document.getElementById("empNascimento").value,
      estadoCivil: document.getElementById("empEstadoCivil").value,
      email: document.getElementById("empEmail").value.trim(),
      telefone: document.getElementById("empTelefone").value.trim(),
      celular: document.getElementById("empCelular").value.trim(),
      cep: document.getElementById("empCep").value.trim(),
      rua: document.getElementById("empRua").value.trim(),
      numero: document.getElementById("empNumero").value.trim(),
      bairro: document.getElementById("empBairro").value.trim(),
      cidade: document.getElementById("empCidade").value.trim(),
      estado: document.getElementById("empEstado").value.trim(),
      matricula: document.getElementById("empMatricula").value.trim(),
      dataAdmissao: document.getElementById("empAdmissao").value,
      cargo: document.getElementById("empCargo").value.trim(),
      departamento: document.getElementById("empDepartamento").value,
      gestor: document.getElementById("empGestor").value.trim(),
      marca: document.getElementById("empMarca").value,
      status: document.getElementById("empStatus").value,
      foto: pendingPhotoData
    };

    if (id) {
      const idx = employees.findIndex(x => x.id === id);
      if (idx > -1) employees[idx] = { ...employees[idx], ...data };
      toast("Colaborador atualizado com sucesso!", "success");
    } else {
      employees.push({ id: uid(), ...data });
      toast("Colaborador cadastrado com sucesso!", "success");
    }
    saveDB();
    closeModal("formModalOverlay");
    refreshCurrentView();
  }

  function deleteEmployee(id) {
    const e = employees.find(x => x.id === id);
    if (!e) return;
    askConfirm("Excluir colaborador?", `Tem certeza que deseja excluir "${e.nome}"? Esta ação não pode ser desfeita.`, () => {
      employees = employees.filter(x => x.id !== id);
      saveDB();
      refreshCurrentView();
      toast("Colaborador excluído.", "success");
    });
  }

  function refreshCurrentView() {
    const active = document.querySelector(".nav-item.active");
    const view = active ? active.dataset.view : "dashboard";
    switchView(view);
  }

  /* ===================== RELATÓRIOS: RESUMO ===================== */
  function renderSummary() {
    const map = groupCount(employees, "departamento", "Sem departamento");
    const total = employees.length || 1;
    const tbody = document.getElementById("summaryTableBody");
    tbody.innerHTML = Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .map(([dep, count]) => `<tr><td>${escapeHtml(dep)}</td><td>${count}</td><td>${((count / total) * 100).toFixed(1)}%</td></tr>`)
      .join("");
  }

  /* ===================== IMPORT CSV ===================== */
  function handleCsvImport(ev) {
    const file = ev.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const text = e.target.result;
        const rows = parseCSV(text);
        if (rows.length < 2) { toast("Arquivo CSV vazio ou inválido.", "error"); return; }
        const headers = rows[0].map(h => h.trim().toLowerCase());
        let imported = 0;
        for (let i = 1; i < rows.length; i++) {
          const row = rows[i];
          if (row.length === 1 && row[0].trim() === "") continue;
          const obj = {};
          headers.forEach((h, idx) => obj[h] = (row[idx] || "").trim());
          employees.push({
            id: uid(),
            nome: obj["nome"] || obj["nome completo"] || "Sem nome",
            apelido: obj["apelido"] || obj["nome para exibição"] || "",
            cpf: obj["cpf"] || "",
            rg: obj["rg"] || "",
            sexo: obj["sexo"] || "",
            dataNascimento: obj["data de nascimento"] || obj["datanascimento"] || "",
            estadoCivil: obj["estado civil"] || "",
            email: obj["email"] || obj["e-mail"] || "",
            telefone: obj["telefone"] || "",
            celular: obj["celular"] || "",
            cep: obj["cep"] || "",
            rua: obj["rua"] || "",
            numero: obj["numero"] || obj["número"] || "",
            bairro: obj["bairro"] || "",
            cidade: obj["cidade"] || "",
            estado: obj["estado"] || "",
            matricula: obj["matricula"] || obj["matrícula"] || "",
            dataAdmissao: obj["data de admissão"] || obj["dataadmissao"] || "",
            cargo: obj["cargo"] || "",
            departamento: obj["departamento"] || "",
            gestor: obj["gestor"] || "",
            marca: obj["marca"] || obj["marca atendida"] || "",
            status: obj["status"] || "Ativo",
            foto: null
          });
          imported++;
        }
        saveDB();
        refreshCurrentView();
        toast(`${imported} colaborador(es) importado(s) com sucesso!`, "success");
      } catch (err) {
        toast("Erro ao processar o arquivo CSV.", "error");
      }
      ev.target.value = "";
    };
    reader.readAsText(file, "UTF-8");
  }

  function parseCSV(text) {
    const delim = text.includes(";") && text.split("\n")[0].split(";").length > text.split("\n")[0].split(",").length ? ";" : ",";
    return text.trim().split(/\r?\n/).map(line => {
      const cells = [];
      let cur = "", inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (ch === '"') { inQuotes = !inQuotes; continue; }
        if (ch === delim && !inQuotes) { cells.push(cur); cur = ""; continue; }
        cur += ch;
      }
      cells.push(cur);
      return cells;
    });
  }

  /* ===================== EXPORT ===================== */
  const EXPORT_FIELDS = [
    ["nome", "Nome"], ["apelido", "Nome para Exibição"], ["cpf", "CPF"], ["rg", "RG"], ["sexo", "Sexo"],
    ["dataNascimento", "Data de Nascimento"], ["estadoCivil", "Estado Civil"], ["email", "Email"],
    ["telefone", "Telefone"], ["celular", "Celular"], ["cep", "CEP"], ["rua", "Rua"], ["numero", "Número"],
    ["bairro", "Bairro"], ["cidade", "Cidade"], ["estado", "Estado"], ["matricula", "Matrícula"],
    ["dataAdmissao", "Data de Admissão"], ["cargo", "Cargo"], ["departamento", "Departamento"],
    ["gestor", "Gestor"], ["marca", "Marca Atendida"], ["status", "Status"]
  ];

  function exportCSV() {
    const headers = EXPORT_FIELDS.map(f => f[1]);
    const rows = employees.map(e => EXPORT_FIELDS.map(f => csvEscape(e[f[0]] || "")));
    const csv = [headers.join(";"), ...rows.map(r => r.join(";"))].join("\n");
    downloadBlob(new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" }), "colaboradores_rbr.csv");
    toast("Exportação CSV concluída!", "success");
  }
  function csvEscape(v) {
    const s = String(v).replace(/"/g, '""');
    return /[;",\n]/.test(s) ? `"${s}"` : s;
  }

  function exportExcel() {
    if (typeof XLSX === "undefined") { toast("Biblioteca de exportação indisponível.", "error"); return; }
    const headers = EXPORT_FIELDS.map(f => f[1]);
    const rows = employees.map(e => EXPORT_FIELDS.map(f => e[f[0]] ? fmtIfDate(f[0], e[f[0]]) : ""));
    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    ws["!cols"] = headers.map(() => ({ wch: 20 }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Colaboradores");
    XLSX.writeFile(wb, "colaboradores_rbr.xlsx");
    toast("Exportação Excel concluída!", "success");
  }
  function fmtIfDate(field, val) {
    if ((field === "dataNascimento" || field === "dataAdmissao") && /^\d{4}-\d{2}-\d{2}$/.test(val)) return fmtDate(val);
    return val;
  }

  function exportJSON() {
    downloadBlob(new Blob([JSON.stringify(employees, null, 2)], { type: "application/json" }), "colaboradores_rbr.json");
    toast("Exportação JSON concluída!", "success");
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  /* ===================== DARK MODE ===================== */
  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    document.getElementById("darkModeSwitch").checked = theme === "dark";
    localStorage.setItem(THEME_KEY, theme);
    const icon = theme === "dark" ? "fa-sun" : "fa-moon";
    document.getElementById("darkModeToggle").innerHTML = `<i class="fa-solid ${icon}"></i>`;
    if (document.getElementById("view-dashboard") && !document.getElementById("view-dashboard").classList.contains("hidden")) {
      renderDashboard();
    }
  }
  function toggleTheme() {
    const cur = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
    applyTheme(cur === "dark" ? "light" : "dark");
  }

  /* ===================== EVENTOS ===================== */
  function bindEvents() {
    document.getElementById("menuToggle").addEventListener("click", openSidebar);
    document.getElementById("sidebarClose").addEventListener("click", closeSidebar);
    document.getElementById("sidebarOverlay").addEventListener("click", closeSidebar);

    document.querySelectorAll(".nav-item").forEach(btn => {
      btn.addEventListener("click", () => switchView(btn.dataset.view));
    });

    document.getElementById("globalSearch").addEventListener("input", e => {
      globalSearchTerm = e.target.value;
      table.page = 1;
      if (!document.getElementById("view-colaboradores").classList.contains("hidden")) {
        renderTable();
      } else if (globalSearchTerm.trim()) {
        switchView("colaboradores");
      }
    });

    document.getElementById("darkModeToggle").addEventListener("click", toggleTheme);
    document.getElementById("darkModeToggleSidebar").addEventListener("click", toggleTheme);
    document.getElementById("darkModeSwitch").addEventListener("change", toggleTheme);

    document.getElementById("btnNovoColaborador").addEventListener("click", () => openForm(null));
    document.getElementById("btnNovoColaborador2").addEventListener("click", () => openForm(null));
    document.getElementById("formModalClose").addEventListener("click", () => closeModal("formModalOverlay"));
    document.getElementById("formCancelBtn").addEventListener("click", () => closeModal("formModalOverlay"));
    document.getElementById("employeeForm").addEventListener("submit", handleFormSubmit);
    document.getElementById("empFotoInput").addEventListener("change", handlePhotoInput);

    document.getElementById("profileModalClose").addEventListener("click", () => closeModal("profileModalOverlay"));
    document.getElementById("cardModalClose").addEventListener("click", () => closeModal("cardModalOverlay"));
    document.getElementById("cardDownloadBtn").addEventListener("click", downloadCard);
    document.getElementById("cardCopyBtn").addEventListener("click", copyCardText);

    document.getElementById("confirmCancelBtn").addEventListener("click", () => closeModal("confirmModalOverlay"));
    document.getElementById("confirmOkBtn").addEventListener("click", () => {
      if (confirmCallback) confirmCallback();
      closeModal("confirmModalOverlay");
    });

    [["formModalOverlay"], ["profileModalOverlay"], ["cardModalOverlay"], ["confirmModalOverlay"]].forEach(([id]) => {
      document.getElementById(id).addEventListener("click", e => { if (e.target.id === id) closeModal(id); });
    });

    // Filtros
    ["filterNome", "filterEstado", "filterCidade", "filterDepartamento", "filterMarca", "filterGestor"].forEach(id => {
      document.getElementById(id).addEventListener("input", () => updateFilters());
      document.getElementById(id).addEventListener("change", () => updateFilters());
    });
    document.getElementById("btnLimparFiltros").addEventListener("click", () => {
      table.filters = { nome: "", estado: "", cidade: "", departamento: "", marca: "", gestor: "" };
      ["filterNome", "filterEstado", "filterCidade", "filterDepartamento", "filterMarca", "filterGestor"].forEach(id => document.getElementById(id).value = "");
      table.page = 1;
      renderTable();
    });

    // Tabela: ordenação, ações, paginação (delegação de eventos)
    document.getElementById("employeeTable").addEventListener("click", e => {
      const th = e.target.closest("th[data-sort]");
      if (th) {
        const field = th.dataset.sort;
        if (table.sortField === field) table.sortDir = table.sortDir === "asc" ? "desc" : "asc";
        else { table.sortField = field; table.sortDir = "asc"; }
        renderTable();
        return;
      }
      const profileCell = e.target.closest("[data-open-profile]");
      if (profileCell) { openProfile(profileCell.dataset.openProfile); return; }
      const actionBtn = e.target.closest("button[data-action]");
      if (actionBtn) {
        const id = actionBtn.dataset.id;
        const action = actionBtn.dataset.action;
        if (action === "view") openProfile(id);
        if (action === "edit") openForm(id);
        if (action === "delete") deleteEmployee(id);
      }
    });
    document.getElementById("pagination").addEventListener("click", e => {
      const btn = e.target.closest("button[data-page]");
      if (btn) { table.page = parseInt(btn.dataset.page, 10); renderTable(); }
    });

    // Cards de aniversário (delegação)
    document.getElementById("birthdayGrid").addEventListener("click", e => {
      const btn = e.target.closest("button[data-action='card']");
      if (btn) openCard(btn.dataset.id, btn.dataset.type);
    });
    document.getElementById("companyAnniversaryGrid").addEventListener("click", e => {
      const btn = e.target.closest("button[data-action='card']");
      if (btn) openCard(btn.dataset.id, btn.dataset.type);
    });

    // Relatórios
    document.getElementById("importCsvInput").addEventListener("change", handleCsvImport);
    document.getElementById("btnExportCsv").addEventListener("click", exportCSV);
    document.getElementById("btnExportExcel").addEventListener("click", exportExcel);
    document.getElementById("btnExportJson").addEventListener("click", exportJSON);

    // Configurações
    document.getElementById("btnClearDb").addEventListener("click", () => {
      askConfirm("Limpar base de dados?", "Todos os colaboradores cadastrados neste navegador serão removidos.", () => {
        employees = [];
        saveDB();
        refreshCurrentView();
        toast("Base de dados limpa.", "success");
      });
    });
    document.getElementById("btnSeedDb").addEventListener("click", () => {
      askConfirm("Restaurar dados de exemplo?", "A base atual será substituída pela equipe RBR de exemplo.", () => {
        employees = seedData();
        saveDB();
        refreshCurrentView();
        toast("Dados de exemplo restaurados.", "success");
      });
    });

    // Back to top
    window.addEventListener("scroll", () => {
      document.getElementById("backToTop").classList.toggle("show", window.scrollY > 400);
    });
    document.getElementById("backToTop").addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

    // ESC fecha modais
    document.addEventListener("keydown", e => {
      if (e.key === "Escape") {
        ["formModalOverlay", "profileModalOverlay", "cardModalOverlay", "confirmModalOverlay"].forEach(id => closeModal(id));
      }
    });
  }

  function updateFilters() {
    table.filters = {
      nome: document.getElementById("filterNome").value,
      estado: document.getElementById("filterEstado").value,
      cidade: document.getElementById("filterCidade").value,
      departamento: document.getElementById("filterDepartamento").value,
      marca: document.getElementById("filterMarca").value,
      gestor: document.getElementById("filterGestor").value
    };
    table.page = 1;
    renderTable();
  }

  /* ===================== INIT ===================== */
  function init() {
    loadDB();
    const savedTheme = localStorage.getItem(THEME_KEY) || "light";
    applyTheme(savedTheme);
    bindEvents();
    switchView("dashboard");
  }

  document.addEventListener("DOMContentLoaded", init);
})();
