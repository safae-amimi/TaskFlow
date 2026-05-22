requireAuth();      
renderNavbar();     
const API = 'http://localhost:5000';
const projectId = new URLSearchParams(window.location.search).get('projectId');
const token = localStorage.getItem('token');

async function loadActivities() {
    const res = await axios.get(`/api/activities/project/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` }
});

    const feed = document.getElementById('activity-feed');
    feed.innerHTML = '';

    res.data.forEach(a => {
        const time = new Date(a.createdAt).toLocaleString();
        feed.innerHTML += `
            <div class="activity-item">
                👤 <strong>${a.user?.name || 'Utilisateur'}</strong> — ${a.details}
                <span class="time">${time}</span>
            </div>
        `;
    });
}

loadActivities();