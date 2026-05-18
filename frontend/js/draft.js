const form = document.getElementById('task-form');
const projectId = new URLSearchParams(window.location.search).get('projectId');
const DRAFT_KEY = `draft_task_${projectId}`;
window.addEventListener('load', () => {
    const draft = localStorage.getItem(DRAFT_KEY);
    if (draft) {
        const confirmRestore = confirm('Brouillon détecté. Voulez-vous le restaurer ?');
        if (confirmRestore) {
            const data = JSON.parse(draft);
            document.getElementById('task-title').value = data.title || '';
            document.getElementById('task-description').value = data.description || '';
            document.getElementById('task-priority').value = data.priority || '';
        } else {
            localStorage.removeItem(DRAFT_KEY);
        }
    }
});