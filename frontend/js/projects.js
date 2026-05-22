requireAuth();      
renderNavbar();     
const API = 'http://localhost:5000';
const token = localStorage.getItem('token');
if (!token) window.location.href = 'index.html';

const headers = { Authorization: `Bearer ${token}` };
let currentPage = 1;

async function loadProjects() {
  const res = await axios.get(`/api/projects?page=${currentPage}&limit=5`, { headers });
  const { data, total, page, totalPages } = res.data;

  const list = document.getElementById('projects-list');
  list.innerHTML = '';

  data.forEach(p => {
    list.innerHTML += `
      <div class="card">
        <h3>${p.title} <span class="badge">${p.status}</span></h3>
        <p>${p.description || ''}</p>
        <p>📅 ${p.deadline ? new Date(p.deadline).toLocaleDateString() : 'Pas de deadline'}</p>
        <button onclick="deleteProject('${p._id}')">🗑 Supprimer</button>
        <a href="tasks.html?projectId=${p._id}">📋 Voir tâches</a>
      </div>
    `;
  });

  document.getElementById('page-info').textContent = `Page ${page} / ${totalPages}`;
}

async function createProject() {
  const title = document.getElementById('proj-title').value;
  const description = document.getElementById('proj-desc').value;
  const deadline = document.getElementById('proj-deadline').value;

  await axios.post('/api/projects', { title, description, deadline }, { headers });
  loadProjects();
}

async function deleteProject(id) {
  if (!confirm('Supprimer ce projet ?')) return;
  await axios.delete(`/api/projects/${id}`, { headers });
  loadProjects();
}

function changePage(dir) {
  currentPage += dir;
  if (currentPage < 1) currentPage = 1;
  loadProjects();
}

loadProjects();