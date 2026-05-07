const API = '/api';
let editingId = null;

async function api(method, path, body) {
  const res = await fetch(API + path, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : {},
    body: body ? JSON.stringify(body) : undefined,
  });
  return res.json();
}

// --- Stats ---
async function loadStats() {
  const { data } = await api('GET', '/stats');
  document.getElementById('stats-bar').innerHTML = `
    <span>Нийт: ${data.total}</span>
    <span>Дууссан: ${data.done}</span>
    <span>Хоцорсон: ${data.overdue}</span>
  `;
}

// --- Tasks ---
async function loadTasks() {
  const search   = document.getElementById('search').value.trim();
  const priority = document.getElementById('filter-priority').value;
  const status   = document.getElementById('filter-status').value;

  const params = new URLSearchParams();
  if (search)   params.set('search', search);
  if (priority) params.set('priority', priority);
  if (status)   params.set('status', status);

  const { data } = await api('GET', '/tasks?' + params);
  renderTasks(data);
  loadStats();
}

function renderTasks(tasks) {
  const container = document.getElementById('tasks');
  container.innerHTML = '';
  tasks.forEach(t => {
    const card = document.createElement('div');
    card.className = `task-card ${t.priority} ${t.status === 'done' ? 'done' : ''}`;
    card.innerHTML = `
      <div class="info">
        <div class="title ${t.status === 'done' ? 'done-text' : ''}">${esc(t.title)}</div>
        <div class="meta">
          ${t.priority.toUpperCase()}
          ${t.due_date ? ' · ' + t.due_date : ''}
          ${t.description ? ' · ' + esc(t.description) : ''}
        </div>
        <div class="labels">
          ${(t.labels || []).map(l =>
            `<span class="label-chip" style="background:${l.color}">${esc(l.name)}</span>`
          ).join('')}
        </div>
      </div>
      <div class="actions">
        <button class="btn-done"   onclick="toggleDone(${t.id}, '${t.status}')">
          ${t.status === 'done' ? 'Undo' : 'Done'}
        </button>
        <button class="btn-edit"   onclick="openEdit(${t.id})">Засах</button>
        <button class="btn-delete" onclick="deleteTask(${t.id})">Устгах</button>
      </div>
    `;
    container.appendChild(card);
  });
}

function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// --- Create ---
document.getElementById('task-form').addEventListener('submit', async e => {
  e.preventDefault();
  const title    = document.getElementById('f-title').value.trim();
  const desc     = document.getElementById('f-desc').value.trim();
  const due_date = document.getElementById('f-due').value || null;
  const priority = document.getElementById('f-priority').value;
  await api('POST', '/tasks', { title, description: desc, due_date, priority });
  e.target.reset();
  loadTasks();
});

// --- Toggle done ---
async function toggleDone(id, currentStatus) {
  const status = currentStatus === 'done' ? 'pending' : 'done';
  await api('PUT', `/tasks/${id}`, { status });
  loadTasks();
}

// --- Delete ---
async function deleteTask(id) {
  if (!confirm('Устгах уу?')) return;
  await api('DELETE', `/tasks/${id}`);
  loadTasks();
}

// --- Edit modal ---
async function openEdit(id) {
  const { data } = await api('GET', `/tasks/${id}`);
  editingId = id;
  document.getElementById('e-title').value    = data.title;
  document.getElementById('e-desc').value     = data.description || '';
  document.getElementById('e-due').value      = data.due_date || '';
  document.getElementById('e-priority').value = data.priority;
  document.getElementById('e-status').value   = data.status;
  document.getElementById('modal').classList.remove('hidden');
}

document.getElementById('btn-cancel').addEventListener('click', () => {
  document.getElementById('modal').classList.add('hidden');
  editingId = null;
});

document.getElementById('btn-save').addEventListener('click', async () => {
  if (!editingId) return;
  await api('PUT', `/tasks/${editingId}`, {
    title:       document.getElementById('e-title').value.trim(),
    description: document.getElementById('e-desc').value.trim(),
    due_date:    document.getElementById('e-due').value || null,
    priority:    document.getElementById('e-priority').value,
    status:      document.getElementById('e-status').value,
  });
  document.getElementById('modal').classList.add('hidden');
  editingId = null;
  loadTasks();
});

// --- Filter ---
document.getElementById('btn-filter').addEventListener('click', loadTasks);
document.getElementById('btn-reset').addEventListener('click', () => {
  document.getElementById('search').value = '';
  document.getElementById('filter-priority').value = '';
  document.getElementById('filter-status').value = '';
  loadTasks();
});
document.getElementById('search').addEventListener('keydown', e => {
  if (e.key === 'Enter') loadTasks();
});

loadTasks();
