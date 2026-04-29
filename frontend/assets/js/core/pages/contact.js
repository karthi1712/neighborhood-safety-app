const BASE = "https://neighborhood-safety-app.onrender.com/api";
initPage(()=>{
  document.getElementById("app").innerHTML = `
    <h2>Contact</h2>
    <input placeholder="Email"><br>
    <textarea placeholder="Message"></textarea><br>
    <button>Send</button>
  `;
});