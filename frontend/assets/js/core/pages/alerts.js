const BASE = "https://neighborhood-safety-app.onrender.com/api";

const alertsGrid = document.getElementById('alertsGrid');

async function loadAlerts() {
  try {
    const incidents = await fetchIncidents();
    if (!incidents || !incidents.length) {
      alertsGrid.innerHTML = '<div class="card"><h3>No alerts found</h3><p>There are no active incident reports at the moment.</p></div>';
      return;
    }

    alertsGrid.innerHTML = incidents.map((incident) => {
      const color = incident.severity === 'high' ? '#f87171' : incident.severity === 'medium' ? '#fb923c' : '#34d399';
      return `
        <div class="card alert-card" style="border-left: 5px solid ${color};">
          <h3>${incident.title}</h3>
          <p>${incident.description || 'No description provided.'}</p>
          <div class="alert-meta">
            <span>${incident.severity.toUpperCase()} severity</span>
            <span>${new Date(incident.createdAt).toLocaleString()}</span>
          </div>
        </div>
      `;
    }).join('');
  } catch (err) {
    alertsGrid.innerHTML = `<div class="card"><h3>Error loading alerts</h3><p>${err.message}</p></div>`;
  }
}

loadAlerts();