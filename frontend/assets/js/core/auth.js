// Simple local auth system (for now)

function handleSignup(email, password) {
  let users = JSON.parse(localStorage.getItem("users")) || [];

  const exists = users.find(u => u.email === email);

  if (exists) {
    alert("User already exists");
    return;
  }

  users.push({ email, password });
  localStorage.setItem("users", JSON.stringify(users));

  alert("Signup successful!");
}

function handleLogin(email, password) {
  let users = JSON.parse(localStorage.getItem("users")) || [];

  const user = users.find(
    u => u.email === email && u.password === password
  );

  if (!user) {
    alert("Invalid credentials");
    return;
  }

  localStorage.setItem("currentUser", JSON.stringify(user));

  alert("Login successful!");
  window.location.href = "dashboard.html";
}

function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
}

// Protect pages
function protectPage() {
  const user = localStorage.getItem("currentUser");

  if (!user) {
    window.location.href = "login.html";
  }
}