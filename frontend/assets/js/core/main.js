// Responsive Engine + Component Loader
async function loadAllComponents() {
  await loadComponent("navbar", "navbar.html");
  await loadComponent("footer", "footer.html");

  // optional containers
  if (document.getElementById("sidebar-container")) {
    await loadComponent("sidebar-container", "sidebar.html");
  }

  if (document.getElementById("modal-container")) {
    await loadComponent("modal-container", "modal.html");
  }
}
function getDevice() {
  if (window.innerWidth < 600) return "mobile";
  if (window.innerWidth < 1024) return "tablet";
  return "desktop";
}

async function loadComponent(id, file) {
  try {
    const res = await fetch(`../components/${file}`);
    const html = await res.text();
    document.getElementById(id).innerHTML = html;
  } catch (err) {
    console.error("Component load failed:", err);
  }
}

function initPage(renderFn) {
  async function render() {
    await loadComponent("navbar", "navbar.html");
    await loadComponent("footer", "footer.html");
    async function render() {
    loadAllComponents();
    renderFn(getDevice());
    }

    renderFn(getDevice());
  }

  window.addEventListener("load", render);
  window.addEventListener("resize", render);
}
function loadAllComponents() {
  loadFooter();
}