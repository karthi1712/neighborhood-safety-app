// Simple local auth system (for now)

async function handleSignup(email, password) {
  const name = prompt("Enter name:");
  const mobile = prompt("Enter mobile:");

  const res = await fetch(`${BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, mobile })
  });

  const data = await res.json();

  if (res.ok) {
    alert("Signup successful!");
  } else {
    alert(data.msg);
  }
}
async function handleLogin(email, password) {
  const res = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (res.ok) {
    localStorage.setItem("user", JSON.stringify(data.user));
    window.location.href = "dashboard.html";
  } else {
    alert(data.msg);
  }
}

function logout() {
  localStorage.removeItem("user");
  window.location.href = "login.html";
}

// Protect pages
function protectPage() {
  const user = localStorage.getItem("user");
  if (!user) window.location.href = "login.html";
}