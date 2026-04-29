const notificationsList = document.getElementById('notificationsList');
const markAllReadBtn = document.getElementById('markAllRead');
const currentUser = JSON.parse(localStorage.getItem('user') || 'null');

if (!currentUser) {
  window.location.href = 'login.html';
}

async function loadNotifications() {
  try {
    const notifications = await getNotifications(currentUser.email);
    if (!notifications.length) {
      notificationsList.innerHTML = '<div class="card"><h3>No notifications</h3><p>You have not received any nearby alerts yet.</p></div>';
      return;
    }

    notificationsList.innerHTML = notifications.map(note => `
      <div class="card notification-card ${note.read ? 'read' : 'unread'}">
        <div>
          <strong>${note.message}</strong>
          <p>${new Date(note.createdAt).toLocaleString()}</p>
        </div>
        <span class="notification-status">${note.read ? 'Read' : 'New'}</span>
      </div>
    `).join('');
  } catch (err) {
    notificationsList.innerHTML = `<div class="card"><h3>Unable to load notifications</h3><p>${err.message}</p></div>`;
  }
}

markAllReadBtn.addEventListener('click', async () => {
  try {
    await markNotificationsRead(currentUser.email);
    await loadNotifications();
    location.reload();
  } catch (err) {
    alert('Unable to mark notifications read: ' + err.message);
  }
});

loadNotifications();