const form = document.getElementById('task-form');
const projectId = new URLSearchParams(window.location.search).get('projectId');
const DRAFT_KEY = `draft_task_${projectId}`;
