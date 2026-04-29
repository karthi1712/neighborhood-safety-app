function useCurrent() {
  navigator.geolocation.getCurrentPosition((pos) => {
    document.getElementById("lat").value = pos.coords.latitude;
    document.getElementById("lng").value = pos.coords.longitude;
    alert("Current location set!");
  }, (err) => {
    alert("Location access denied. Please allow location access.");
  });
}

function submit() {
  const title = document.getElementById("title").value;
  const description = document.getElementById("desc").value;
  const severity = document.getElementById("severity").value;
  let lat = document.getElementById("lat").value;
  let lng = document.getElementById("lng").value;

  if (!title) {
    alert("Title required");
    return;
  }

  if (!lat || !lng) {
    alert("Please set location (use current or enter manually)");
    return;
  }

  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const payload = {
    title,
    description,
    severity,
    lat: parseFloat(lat),
    lng: parseFloat(lng)
  };

  if (user && user._id) {
    payload.userId = user._id;
  }

  createIncident(payload).then(() => {
    alert("✅ Incident Reported!");
    window.location.href = "map.html";
  }).catch(err => {
    alert("Failed to report: " + err.message);
  });
}

const submitIncident = submit;