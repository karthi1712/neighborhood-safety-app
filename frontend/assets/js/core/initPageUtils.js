// Central Page Initialization Utility

// Detect device
function getDevice() {
  if (window.innerWidth < 600) return "mobile";
  if (window.innerWidth < 1024) return "tablet";
  return "desktop";
}

// Load HTML component
async function loadComponent(id, file) {
  try {
    const res = await fetch(`../components/${file}`);
    const html = await res.text();
    document.getElementById(id).innerHTML = html;
  } catch (err) {
    console.error("Error loading component:", file);
  }
}

// Load all global components
async function loadLayout() {
  if (document.getElementById("navbar"))
    await loadComponent("navbar", "navbar.html");

  if (document.getElementById("footer"))
    await loadComponent("footer", "footer.html");

  if (document.getElementById("sidebar-container"))
    await loadComponent("sidebar-container", "sidebar.html");

  if (document.getElementById("modal-container"))
    await loadComponent("modal-container", "modal.html");
}

// MAIN INIT FUNCTION
function initPage(renderFn) {

  async function render() {
    await loadLayout();

    const device = getDevice();
    renderFn(device);
  }

  // First load
  window.addEventListener("load", render);

  // On resize
  window.addEventListener("resize", render);
}