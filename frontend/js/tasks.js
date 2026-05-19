const token = localStorage.getItem('token');
if (!token) window.location.href = 'index.html';

const headers = { Authorization: `Bearer ${token}` };
const projectId = new URLSearchParams(window.location.search).get('projectId');
let currentPage = 1;

async function loadTasks() {
  const search = document.getElementById('search').value;
  const status = document.getElementById('filter-status').value;
  const priority = document.getElementById('filter-priority').value;

  const params = new URLSearchParams({ page: currentPage, limit: 5 });
  if (search) params.append('search', search);
  if (status) params.append('status', status);
  if (priority) params.append('priority', priority);

  const res = await axios.get(
    `/api/tasks/project/${projectId}?${params.toString()}`,
    { headers }
  );

  const { data, page, totalPages } = res.data;
  const list = document.getElementById('tasks-list');
  list.innerHTML = '';

  data.forEach(t => {
    list.innerHTML += `
      <div class="card">
        <h4>${t.title}</h4>
        <p>Priorité: <strong>${t.priority}</strong></p>
        <p>Statut: 
          <select onchange="updateStatus('${t._id}', this.value)">
            <option ${t.status === 'à faire' ? 'selected' : ''}>à faire</option>
            <option ${t.status === 'en cours' ? 'selected' : ''}>en cours</option>
            <option ${t.status === 'terminé' ? 'selected' : ''}>terminé</option>
          </select>
        </p>
        <p>Assigné à: ${t.assignedTo ? t.assignedTo.name : 'Non assigné'}</p>
        <button onclick="deleteTask('${t._id}')">🗑 Supprimer</button>
      </div>
    `;
  });

  document.getElementById('page-info').textContent = `Page ${page} / ${totalPages}`;
}

async function updateStatus(id, status) {
  await axios.patch(`/api/tasks/${id}/status`, { status }, { headers });
  loadTasks();
}

async function deleteTask(id) {
  if (!confirm('Supprimer cette tâche ?')) return;
  await axios.delete(`/api/tasks/${id}`, { headers });
  loadTasks();
}

document.getElementById('task-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  await axios.post('/api/tasks', {
    title: document.getElementById('task-title').value,
    description: document.getElementById('task-description').value,
    priority: document.getElementById('task-priority').value,
    project: projectId
  }, { headers });
  loadTasks();
});

function changePage(dir) {
  currentPage += dir;
  if (currentPage < 1) currentPage = 1;
  loadTasks();
}

function logout() {
  localStorage.removeItem('token');
  window.location.href = 'index.html';
}

loadTasks();