requireAuth();      
renderNavbar();     
showUsername();
const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user') || '{}');

function requireAuth() {
  if (!token) {
    window.location.href = 'index.html';
  }
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = 'index.html';
}

function goTo(page, params = {}) {
  const query = new URLSearchParams(params).toString();
  window.location.href = query ? `${page}?${query}` : page;
}


function getProjectId() {
  return new URLSearchParams(window.location.search).get('projectId');
}

function showUsername() {
  const el = document.getElementById('username');
  if (el && user.name) el.textContent = user.name;
}

function renderNavbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;

  nav.innerHTML = `
    <div class="nav-brand">🗂️ TaskFlow</div>
    <div class="nav-links">
      <a href="dashboard.html" ${isActive('dashboard.html')}>📊 Dashboard</a>
      <a href="projects.html" ${isActive('projects.html')}>📁 Projets</a>
      <a href="notifications.html" ${isActive('notifications.html')}>
        🔔 <span id="notif-badge" class="badge-hidden">0</span>
      </a>
      <span class="nav-user">👤 ${user.name || ''}</span>
      <button onclick="logout()" class="btn-logout">Déconnexion</button>
    </div>
  `;
}

function isActive(page) {
  return window.location.pathname.endsWith(page) ? 'class="active-link"' : '';
}