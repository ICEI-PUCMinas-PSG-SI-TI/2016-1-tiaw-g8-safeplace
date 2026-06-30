const API = 'https://cilfpkyzwgokglhynemu.supabase.co/rest/v1/compromissos';
const HEADERS = { 'apikey': 'sb_publishable_jgKH18ZqnhFanAeeZ_Wpig_9gobmFwS', 'Authorization': 'Bearer sb_publishable_jgKH18ZqnhFanAeeZ_Wpig_9gobmFwS', 'Content-Type': 'application/json', 'Prefer': 'return=representation' };

// ─── STATE ────────────────────────────────────────────────
function hoje() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}
let selectedDate = hoje();
let viewDate = hoje();
let editingId = null;
let allCompromissos = [];
let searchDebounce = null;

// ─── UTILS ───────────────────────────────────────────────
const $ = id => document.getElementById(id);
const pad = n => String(n).padStart(2, '0');

function formatDateLabel(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
}

function toDateStr(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function todayStr() {
  return toDateStr(hoje());
}

function showToast(msg) {
  const wrap = $('toast-wrap');
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  wrap.appendChild(el);
  setTimeout(() => el.remove(), 3000);
}

// ─── API CALLS ────────────────────────────────────────────
async function fetchAll() {
  try {
    const r = await fetch(API + '?select=*', { headers: HEADERS });
    if (!r.ok) throw new Error();
    allCompromissos = await r.json();
    return allCompromissos;
  } catch {
    showToast('⚠️ Erro ao conectar ao servidor. Tente novamente.');
    return [];
  }
}

async function fetchByDate(dateStr) {
  try {
    const r = await fetch(`${API}?data=eq.${dateStr}&select=*`, { headers: HEADERS });
    return await r.json();
  } catch { return []; }
}

async function createCompromisso(data) {
  const r = await fetch(API, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify(data)
  });
  return r.json();
}

async function updateCompromisso(id, data) {
  const r = await fetch(`${API}?id=eq.${id}`, {
    method: 'PUT',
    headers: HEADERS,
    body: JSON.stringify(data)
  });
  return r.json();
}

async function deleteCompromisso(id) {
  await fetch(`${API}?id=eq.${id}`, { method: 'DELETE', headers: HEADERS });
}

// ─── CALENDAR ─────────────────────────────────────────────
function renderCalendar() {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  $('cal-month').textContent = new Date(year, month, 1)
    .toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayStr_ = todayStr();
  const selStr = toDateStr(selectedDate);

  const eventDates = new Set(allCompromissos.map(c => c.data));

  const grid = $('cal-grid');
  // Guardar headers
  const headers = Array.from(grid.querySelectorAll('.cal-dow'));
  grid.innerHTML = '';
  headers.forEach(h => grid.appendChild(h));

  // Células vazias
  for (let i = 0; i < firstDay; i++) {
    const el = document.createElement('div');
    el.className = 'cal-day empty';
    grid.appendChild(el);
  }

  // Dias
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${pad(month + 1)}-${pad(d)}`;
    const el = document.createElement('div');
    el.className = 'cal-day';
    if (dateStr === todayStr_) el.classList.add('today');
    if (dateStr === selStr) el.classList.add('selected');
    if (eventDates.has(dateStr)) el.classList.add('has-event');
    el.textContent = d;
    el.addEventListener('click', () => selectDate(new Date(year, month, d)));
    grid.appendChild(el);
  }
}

function selectDate(date) {
  selectedDate = date;
  viewDate = new Date(date.getFullYear(), date.getMonth(), 1);
  renderCalendar();
  loadDayEvents();
}

// ─── DAY EVENTS ───────────────────────────────────────────
async function loadDayEvents() {
  const dateStr = toDateStr(selectedDate);
  $('day-title').textContent = formatDateLabel(dateStr);

  const list = $('events-list');
  list.innerHTML = '<div class="empty-day">Carregando...</div>';

  const events = await fetchByDate(dateStr);

  if (events.length === 0) {
    list.innerHTML = '<div class="empty-day">Nenhum compromisso neste dia</div>';
    return;
  }

  events.sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio));

  list.innerHTML = '';
  events.forEach(ev => list.appendChild(buildEventCard(ev)));
}

function buildEventCard(ev) {
  const isVideo = ev.tipo === 'video';
  const card = document.createElement('div');
  card.className = 'event-card';
  card.dataset.id = ev.id;

  card.innerHTML = `
    <div class="event-left">
      <div class="event-title">${ev.titulo}</div>
      <div class="event-meta">
        <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          ${isVideo
            ? '<path d="M15 10l4.55-2.73A1 1 0 0121 8.19v7.62a1 1 0 01-1.45.88L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"/>'
            : '<path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>'}
        </svg>
        ${isVideo ? 'Chamada de Vídeo' : 'Presencial'}
        <span class="dot">•</span>
        Com: ${ev.participante}
      </div>
    </div>
    <div class="event-right">
      <div class="time-badge">
        <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
        </svg>
        ${ev.hora_inicio} - ${ev.hora_fim}
      </div>
      <button class="icon-btn btn-edit" title="Editar">
        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
      </button>
      <button class="icon-btn danger btn-delete" title="Excluir">
        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6M10 11v6M14 11v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
        </svg>
      </button>
    </div>`;

  card.querySelector('.btn-edit').addEventListener('click', () => openEdit(ev.id));
  card.querySelector('.btn-delete').addEventListener('click', () => confirmDelete(ev.id, ev.titulo, ev.data));

  return card;
}

// ─── MODAL ────────────────────────────────────────────────
function openModal(mode = 'new') {
  editingId = null;
  $('modal-title').textContent = 'Novo Compromisso';
  $('form-titulo').value = '';
  $('form-data').value = toDateStr(selectedDate);
  $('form-hora-inicio').value = '';
  $('form-hora-fim').value = '';
  $('form-tipo').value = 'video';
  $('form-participante').value = '';
  $('modal-overlay').classList.add('open');
}

async function openEdit(id) {
  let ev = allCompromissos.find(c => String(c.id) === String(id));
  if (!ev) {
    try {
      ev = await fetch(`${API}?id=eq.${id}&select=*`, { headers: HEADERS }).then(r => r.json()).then(d => d[0]);
    } catch {
      showToast('Erro ao carregar compromisso.');
      return;
    }
  }

  editingId = id;
  $('modal-title').textContent = 'Editar Compromisso';
  $('form-titulo').value = ev.titulo;
  $('form-data').value = ev.data;
  $('form-hora-inicio').value = ev.hora_inicio;
  $('form-hora-fim').value = ev.hora_fim;
  $('form-tipo').value = ev.tipo;
  $('form-participante').value = ev.participante;
  $('modal-overlay').classList.add('open');
}

function closeModal() {
  $('modal-overlay').classList.remove('open');
  editingId = null;
}

async function handleFormSubmit(e) {
  e.preventDefault();

  const payload = {
    titulo: $('form-titulo').value.trim(),
    data: $('form-data').value,
    hora_inicio: $('form-hora-inicio').value,
    hora_fim: $('form-hora-fim').value,
    tipo: $('form-tipo').value,
    participante: $('form-participante').value.trim()
  };

  if (!payload.titulo || !payload.data || !payload.hora_inicio || !payload.hora_fim || !payload.participante) {
    showToast('Preencha todos os campos!');
    return;
  }

  try {
    if (editingId) {
      await updateCompromisso(editingId, { ...payload, id: editingId });
      showToast('Compromisso atualizado!');
    } else {
      await createCompromisso(payload);
      showToast('Compromisso criado!');
    }
    closeModal();
    await refreshAll();
  } catch {
    showToast('Erro ao salvar. Verifique o servidor.');
  }
}

// ─── DELETE ───────────────────────────────────────────────
let pendingDelete = null;

function confirmDelete(id, titulo, data) {
  pendingDelete = { id, data };
  $('delete-name').textContent = titulo;
  $('delete-overlay').classList.add('open');
}

async function doDelete() {
  if (!pendingDelete) return;
  try {
    await deleteCompromisso(pendingDelete.id);
    showToast('Compromisso excluído.');
  } catch {
    showToast('Erro ao excluir.');
  }
  $('delete-overlay').classList.remove('open');
  pendingDelete = null;
  await refreshAll();
}

function cancelDelete() {
  $('delete-overlay').classList.remove('open');
  pendingDelete = null;
}

// ─── SEARCH ───────────────────────────────────────────────
function handleSearch(e) {
  clearTimeout(searchDebounce);
  const q = e.target.value.trim().toLowerCase();
  const dropdown = $('search-dropdown');

  if (!q) { dropdown.classList.remove('open'); return; }

  searchDebounce = setTimeout(() => {
    const results = allCompromissos.filter(c =>
      c.titulo.toLowerCase().includes(q) ||
      c.participante.toLowerCase().includes(q)
    ).slice(0, 6);

    if (!results.length) {
      dropdown.innerHTML = '<div class="search-result-item" style="color:var(--text-muted)">Nenhum resultado</div>';
    } else {
      dropdown.innerHTML = '';
      results.forEach(c => {
        const item = document.createElement('div');
        item.className = 'search-result-item';
        item.innerHTML = `
          <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
          <span>${c.titulo}</span>
          <span class="sr-date">${formatDateLabel(c.data)}</span>`;
        item.addEventListener('click', () => goToEvent(c.data));
        dropdown.appendChild(item);
      });
    }
    dropdown.classList.add('open');
  }, 200);
}

function goToEvent(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  selectedDate = new Date(y, m - 1, d);
  viewDate = new Date(y, m - 1, 1);
  $('search-input').value = '';
  $('search-dropdown').classList.remove('open');
  renderCalendar();
  loadDayEvents();
}

// ─── REFRESH ──────────────────────────────────────────────
async function refreshAll() {
  await fetchAll();
  renderCalendar();
  loadDayEvents();
}

// ─── NAV ──────────────────────────────────────────────────
function prevMonth() {
  viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1);
  renderCalendar();
}
function nextMonth() {
  viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1);
  renderCalendar();
}

// ─── INIT ─────────────────────────────────────────────────
window.addEventListener('load', async () => {
  // Montar headers do calendário
  const grid = $('cal-grid');
  const dows = ['dom','seg','ter','qua','qui','sex','sáb'];
  dows.forEach(d => {
    const el = document.createElement('div');
    el.className = 'cal-dow';
    el.textContent = d;
    grid.appendChild(el);
  });

  await refreshAll();

  $('compromisso-form').addEventListener('submit', handleFormSubmit);

  $('modal-overlay').addEventListener('click', e => {
    if (e.target === $('modal-overlay')) closeModal();
  });
  $('delete-overlay').addEventListener('click', e => {
    if (e.target === $('delete-overlay')) cancelDelete();
  });

  $('search-input').addEventListener('input', handleSearch);
  document.addEventListener('click', e => {
    if (!e.target.closest('.search-wrap')) {
      $('search-dropdown').classList.remove('open');
    }
  });

  // Botões do modal de delete
  $('btn-confirmar-delete').addEventListener('click', doDelete);
  $('btn-cancelar-delete').addEventListener('click', cancelDelete);
  $('btn-cancelar-modal').addEventListener('click', closeModal);
  $('btn-novo').addEventListener('click', () => openModal('new'));
});

// Expor globais necessários para o HTML
window.prevMonth = prevMonth;
window.nextMonth = nextMonth;
