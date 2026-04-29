initPage((device) => {
  const app = document.getElementById("app");

  app.innerHTML = `
    <h2>Dashboard (${device})</h2>
  `;
});