const BASE = "https://neighborhood-safety-app.onrender.com/api";
initPage((device) => {
  const app = document.getElementById("app");

  if (device === "mobile") {
    app.innerHTML = `
      <h1>Safety App</h1>
      <button onclick="go('map')">Map</button>
    `;
  } else {
    app.innerHTML = `
      <h1>Public Safety Platform</h1>
      <p>Report incidents and stay safe</p>
      <button onclick="go('report')">Report</button>
      <button onclick="go('map')">View Map</button>
    `;
  }
});

function go(p) {
  location.href = p + ".html";
}