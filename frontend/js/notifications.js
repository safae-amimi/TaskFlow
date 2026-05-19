requireAuth();      
renderNavbar();     
showUsername();
const token = localStorage.getItem('token');

async function fetchNotifications() {
  const res = await axios.get('/api/notifications', {
    headers: { Authorization: `Bearer ${token}` }
  });

  const notifications = res.data;
  const unread = notifications.filter(n => !n.read);

  document.getElementById('notif-badge').textContent = unread.length;
  document.getElementById('notif-badge').style.display = unread.length > 0 ? 'block' : 'none';

  const readNotifs = notifications.filter(n => n.read);
  localStorage.setItem('archived_notifications', JSON.stringify(readNotifs));
}

async function markAsRead(id) {
  await axios.patch(`/api/notifications/${id}/read`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  fetchNotifications(); 
}
fetchNotifications();
setInterval(fetchNotifications, 30000);