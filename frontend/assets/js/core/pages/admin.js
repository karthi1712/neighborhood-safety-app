const adminApp = document.getElementById('adminApp');
const user = JSON.parse(localStorage.getItem('user') || 'null');

if (!user || user.role !== 'admin') {
  window.location.href = 'login.html';
}

async function loadAdminDashboard() {
  try {
    const data = await getAdminDashboard(user.email);
    const users = await getAdminUsers(user.email);
    const incidents = await getAdminIncidents(user.email);

    adminApp.innerHTML = `
      <div class="grid stats-grid admin-stats">
        <div class="card stat-card-large">
          <span class="stat-value">${data.totalUsers}</span>
          <p>Total users</p>
        </div>
        <div class="card stat-card-large">
          <span class="stat-value">${data.totalIncidents}</span>
          <p>Total incidents</p>
        </div>
      </div>
      <div class="grid admin-summary">
        <div class="card">
          <h3>Incidents by status</h3>
          <ul>${data.incidentsByStatus.map(s => `<li>${s._id}: ${s.count}</li>`).join('')}</ul>
        </div>
        <div class="card">
          <h3>Incidents by severity</h3>
          <ul>${data.incidentsBySeverity.map(s => `<li>${s._id}: ${s.count}</li>`).join('')}</ul>
        </div>
      </div>
      <div class="card">
        <h3>Recent incident reports</h3>
        <div class="admin-table">
          ${incidents.map(i => `
            <div class="admin-row">
              <div>
                <strong>${i.title}</strong>
                <p>${i.description || 'No details.'}</p>
                <small>Severity: ${i.severity} • Status: ${i.status} • Reported by: ${i.reportedBy?.name || 'Anonymous'}</small>
              </div>
              <div class="admin-actions">
                <button class="btn secondary" onclick="updateIncidentStatus('${i._id}', 'verified')">Mark verified</button>
                <button class="btn secondary" onclick="updateIncidentStatus('${i._id}', 'resolved')">Mark resolved</button>
                <button class="btn danger" onclick="deleteIncident('${i._id}')">Delete</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
      <div class="card">
        <h3>Recent logins</h3>
        <ul>${data.recentLogins.map(u => `<li>${u.name} (${u.email}) ${u.role} — ${u.lastLogin ? new Date(u.lastLogin).toLocaleString() : 'never'}</li>`).join('')}</ul>
      </div>
      <div class="card">
        <h3>All users</h3>
        <div class="admin-table">
          ${users.map(u => `
            <div class="admin-row">
              <div>
                <strong>${u.name}</strong><br>
                <span>${u.email}</span><br>
                <small>${u.role} • Last login: ${u.lastLogin ? new Date(u.lastLogin).toLocaleString() : 'never'}</small>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } catch (error) {
    adminApp.innerHTML = `<div class="card"><h3>Unable to load admin dashboard</h3><p>${error.message}</p></div>`;
  }
}

window.updateIncidentStatus = async (incidentId, status) => {
  try {
    await updateIncidentStatus(user.email, incidentId, status);
    await loadAdminDashboard();
  } catch (err) {
    alert('Unable to update incident: ' + err.message);
  }
};

window.deleteIncident = async (incidentId) => {
  if (!confirm('Delete this incident permanently?')) return;
  try {
    await deleteIncidentById(user.email, incidentId);
    await loadAdminDashboard();
  } catch (err) {
    alert('Unable to delete incident: ' + err.message);
  }
};

loadAdminDashboard();