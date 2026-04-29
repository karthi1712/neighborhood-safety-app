(async () => {
  const map = L.map("map").setView([20.59, 78.96], 5);
  L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  const severityColor = (severity) => {
    return severity === "high" ? "red" : severity === "medium" ? "orange" : "green";
  };

  const incidentData = await fetchIncidents();
  const markers = [];

  incidentData.forEach((incident) => {
    const coords = incident.location?.coordinates || [];
    if (coords.length < 2) return;

    const lat = coords[1];
    const lng = coords[0];
    const color = severityColor(incident.severity);

    const marker = L.circleMarker([lat, lng], {
      radius: 10,
      color,
      fillColor: color,
      fillOpacity: 0.8,
      weight: 2
    }).addTo(map);

    marker.bindPopup(`
      <strong>${incident.title}</strong><br>
      Severity: ${incident.severity || "unknown"}<br>
      ${incident.description || "No description."}<br>
      <a href="https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}" target="_blank">Navigate here</a>
    `);

    markers.push(marker);
  });

  if (markers.length) {
    const bounds = L.featureGroup(markers).getBounds();
    map.fitBounds(bounds.pad(0.2));
  }

  map.locate({ setView: true, maxZoom: 13 });

  map.on("locationfound", (e) => {
    const radius = e.accuracy / 2;
    L.marker(e.latlng).addTo(map).bindPopup("You are here").openPopup();
    L.circle(e.latlng, { radius, color: "#3ad", fillOpacity: 0.1 }).addTo(map);
  });

  map.on("locationerror", () => {
    console.warn("Location access denied or unavailable.");
  });

  const legend = L.control({ position: "bottomright" });
  legend.onAdd = () => {
    const div = L.DomUtil.create("div", "leaflet-legend");
    div.style.background = "rgba(0,0,0,0.65)";
    div.style.color = "white";
    div.style.padding = "10px 12px";
    div.style.borderRadius = "10px";
    div.style.lineHeight = "1.5em";
    div.innerHTML = `
      <strong>Severity</strong><br>
      <span style="display:inline-block;width:12px;height:12px;background:green;margin-right:6px;border-radius:50%"></span> Low<br>
      <span style="display:inline-block;width:12px;height:12px;background:orange;margin-right:6px;border-radius:50%"></span> Medium<br>
      <span style="display:inline-block;width:12px;height:12px;background:red;margin-right:6px;border-radius:50%"></span> High
    `;
    return div;
  };
  legend.addTo(map);
})();