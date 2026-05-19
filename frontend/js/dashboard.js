const token = localStorage.getItem('token');
if (!token) window.location.href = 'index.html';

const headers = { Authorization: `Bearer ${token}` };

async function loadDashboard() {
    const res = await axios.get('/api/dashboard', { headers });
    const { activeProjects, totalAssigned, completed, late, inProgress } = res.data;

    document.getElementById('active-projects').textContent = activeProjects;
    document.getElementById('total-assigned').textContent = totalAssigned;
    document.getElementById('completed').textContent = completed;
    document.getElementById('late').textContent = late;

    const list = document.getElementById('in-progress-list');
    list.innerHTML = '';
    inProgress.forEach(t => {
        list.innerHTML += `
            <div class="card">
                <h4>${t.title}</h4>
                <p>Priorité: <strong>${t.priority}</strong></p>
                <p>Deadline: ${t.deadline ? new Date(t.deadline).toLocaleDateString() : '-'}</p>
            </div>
    `;
    });
}

function logout() {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
}

loadDashboard();