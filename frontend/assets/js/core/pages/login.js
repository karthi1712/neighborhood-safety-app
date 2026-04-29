initPage((device) => {
  const app = document.getElementById("app");

  app.innerHTML = `
    <div class="auth-container">

      <h2 id="formTitle">Login</h2>

      <input id="email" placeholder="Email"><br>
      <input id="password" type="password" placeholder="Password"><br>

      <button onclick="login()">Login</button>

      <p id="toggleText">
        Don't have an account?
        <span onclick="toggle()">Signup</span>
      </p>

    </div>
  `;
});

let isLogin = true;

function toggle() {
  isLogin = !isLogin;

  document.getElementById("formTitle").innerText =
    isLogin ? "Login" : "Signup";

  document.getElementById("toggleText").innerHTML =
    isLogin
      ? `Don't have an account? <span onclick="toggle()">Signup</span>`
      : `Already have an account? <span onclick="toggle()">Login</span>`;

  document.querySelector("button").innerText =
    isLogin ? "Login" : "Signup";
}

function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("Fill all fields");
    return;
  }

  if (isLogin) {
    handleLogin(email, password);
  } else {
    handleSignup(email, password);
  }

async function handleLogin(email, password) {
  try {
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
  } catch (err) {
    alert("Login failed: " + err.message);
  }
}

async function handleSignup(email, password) {
  const name = prompt("Enter your name:");
  const mobile = prompt("Enter your mobile number:");

  if (!name || !mobile) {
    alert("Name and mobile required");
    return;
  }

  try {
    const res = await fetch(`${BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, mobile })
    });

    const data = await res.json();

    if (res.ok) {
      alert("Registration successful! Please login.");
      toggle(); // Switch to login
    } else {
      alert(data.msg);
    }
  } catch (err) {
    alert("Registration failed: " + err.message);
  }
}
}