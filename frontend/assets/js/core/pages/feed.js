let userLocation = null;
let incidentMap = null;
const incidentMarkers = {};

function updateCurrentLocationText() {
  const label = document.getElementById("current-location");
  if (!userLocation) {
    label.textContent = "Current location not set";
  } else {
    label.textContent = `Current location: ${userLocation.lat.toFixed(5)}, ${userLocation.lng.toFixed(5)}`;
  }
}

function setCurrentLocation() {
  navigator.geolocation.getCurrentPosition((pos) => {
    userLocation = {
      lat: pos.coords.latitude,
      lng: pos.coords.longitude
    };
    const latField = document.getElementById("userLat");
    const lngField = document.getElementById("userLng");
    if (latField) latField.value = userLocation.lat;
    if (lngField) lngField.value = userLocation.lng;
    updateCurrentLocationText();
  }, () => {
    alert("Allow location access to use current location.");
  });
}

function getSourceLocation() {
  const latField = document.getElementById("userLat");
  const lngField = document.getElementById("userLng");
  const lat = latField ? parseFloat(latField.value) : NaN;
  const lng = lngField ? parseFloat(lngField.value) : NaN;

  if (!isNaN(lat) && !isNaN(lng)) {
    return { lat, lng };
  }

  return userLocation;
}

function getDirectionsTo(lat, lng) {
  const source = getSourceLocation();
  const destination = `${lat},${lng}`;
  const origin = source ? `${source.lat},${source.lng}` : "";
  const url = origin
    ? `https://www.google.com/maps/dir/${origin}/${destination}`
    : `https://www.google.com/maps/dir/?api=1&destination=${destination}`;

  window.open(url, '_blank');
}

function showIncidentOnMap(id) {
  const marker = incidentMarkers[id];
  if (!marker || !incidentMap) return;
  const latLng = marker.getLatLng();
  incidentMap.setView(latLng, 15);
  marker.openPopup();
}

function buildIncidentCard(i) {
  const coords = i.location?.coordinates || [];
  const lat = coords[1];
  const lng = coords[0];
  const locationText = lat && lng ? `${lat.toFixed(5)}, ${lng.toFixed(5)}` : "Location not available";

  return `
    <div class="card">
      <h3>${i.title}</h3>
      <p>${i.description || "No description provided."}</p>
      <p><strong>Severity:</strong> ${i.severity || "unknown"}</p>
      <p><strong>Location:</strong> ${locationText}</p>
      <div class="feed-actions">
        <button class="btn secondary" onclick="showIncidentOnMap('${i._id}')">View on Map</button>
        ${lat && lng ? `<button class="btn secondary" onclick="getDirectionsTo(${lat}, ${lng})">Navigate</button>` : ""}
      </div>
    </div>
  `;
}

document.addEventListener("DOMContentLoaded", async () => {
  incidentMap = L.map("feedMap").setView([20.59, 78.96], 5);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(incidentMap);

  const data = await fetchIncidents();
  const feed = document.getElementById("feed");
  feed.innerHTML = data.length
    ? data.map(buildIncidentCard).join("")
    : "<p>No incidents reported yet.</p>";

  data.forEach(i => {
    const coords = i.location?.coordinates || [];
    if (coords.length < 2) return;

    const lat = coords[1];
    const lng = coords[0];
    const marker = L.marker([lat, lng]).addTo(incidentMap).bindPopup(
      `<b>${i.title}</b><br>${i.description || "No description."}<br><strong>Severity:</strong> ${i.severity}`
    );

    incidentMarkers[i._id] = marker;
    marker.on("click", () => {
      incidentMap.setView([lat, lng], 15);
    });
  });

  if (Object.keys(incidentMarkers).length) {
    const bounds = L.featureGroup(Object.values(incidentMarkers)).getBounds();
    incidentMap.fitBounds(bounds.pad(0.2));
  }

  updateCurrentLocationText();
});