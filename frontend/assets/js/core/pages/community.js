const BASE = "https://neighborhood-safety-app.onrender.com/api";
initPage(() => {
  const app = document.getElementById("app");

  app.innerHTML = `
    <h2>Community</h2>

    <textarea id="post"></textarea><br>
    <button onclick="addPost()">Post</button>

    <div id="posts"></div>
  `;
});

function addPost() {
  const text = document.getElementById("post").value;

  const div = document.getElementById("posts");
  div.innerHTML += `<div class="card">${text}</div>`;
}