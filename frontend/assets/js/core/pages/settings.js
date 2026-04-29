const BASE = "https://neighborhood-safety-app.onrender.com/api";
initPage(()=>{
  document.getElementById("app").innerHTML = `
    <h2>Settings</h2>
    <label>Notifications <input type="checkbox"></label>
  `;
});