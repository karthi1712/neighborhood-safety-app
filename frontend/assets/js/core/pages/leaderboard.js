
const BASE = "https://neighborhood-safety-app.onrender.com/api";

initPage(()=>{
  document.getElementById("app").innerHTML = `
    <h2>Top Contributors</h2>
    <div class="card">User1 - 20 reports</div>
    <div class="card">User2 - 15 reports</div>
  `;
});