const BASE = "https://neighborhood-safety-app.onrender.com/api";

async function fetchIncidents() {
  const res = await fetch(`${BASE}/incidents`);
  return res.json();
}

async function fetchNearby(lat, lng) {
  const res = await fetch(`${BASE}/incidents/near?lat=${lat}&lng=${lng}`);
  return res.json();
}

async function createIncident(data) {
  const res = await fetch(`${BASE}/incidents`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function loginUser(data) {
  const res = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.msg || await res.text());
  return json;
}

async function getNotifications(email) {
  const res = await fetch(`${BASE}/auth/notifications?email=${encodeURIComponent(email)}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function markNotificationsRead(email) {
  const res = await fetch(`${BASE}/auth/notifications/read`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email })
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function updateLocation(data) {
  const res = await fetch(`${BASE}/auth/location`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function getAdminDashboard(email) {
  const res = await fetch(`${BASE}/admin/dashboard`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email })
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function getAdminUsers(email) {
  const res = await fetch(`${BASE}/admin/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email })
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function getAdminIncidents(email) {
  const res = await fetch(`${BASE}/admin/incidents`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email })
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function updateIncidentStatus(email, incidentId, status) {
  const res = await fetch(`${BASE}/admin/incidents/${incidentId}/status`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, status })
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function deleteIncidentById(email, incidentId) {
  const res = await fetch(`${BASE}/admin/incidents/${incidentId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email })
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}