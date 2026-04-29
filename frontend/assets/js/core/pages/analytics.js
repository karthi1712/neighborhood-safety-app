const BASE = "https://neighborhood-safety-app.onrender.com/api";
initPage(async () => {
  const data = await fetchIncidents();

  document.getElementById("app").innerHTML = `
    <h2>Analytics</h2>
    <canvas id="pie"></canvas>
    <canvas id="bar"></canvas>
  `;

  const low = data.filter(i=>i.severity==="low").length;
  const med = data.filter(i=>i.severity==="medium").length;
  const high = data.filter(i=>i.severity==="high").length;

  new Chart(document.getElementById("pie"), {
    type: "pie",
    data: {
      labels:["Low","Medium","High"],
      datasets:[{ data:[low,med,high] }]
    }
  });

  new Chart(document.getElementById("bar"), {
    type: "bar",
    data: {
      labels:["Low","Medium","High"],
      datasets:[{ data:[low,med,high] }]
    }
  });
});