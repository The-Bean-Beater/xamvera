const sidebar = document.getElementById("sidebar");
const menuButton = document.getElementById("menuButton");
const navItems = document.querySelectorAll(".nav-item");
const viewLinks = document.querySelectorAll("[data-view-link], [data-view-target]");
const views = document.querySelectorAll(".view");
const themeButtons = document.querySelectorAll("[data-theme-option]");
const themeStorageKey = "xamvera-theme";

function showView(viewId) {
  views.forEach((view) => {
    view.classList.toggle("active", view.id === viewId);
  });

  navItems.forEach((item) => {
    item.classList.toggle("active", item.dataset.view === viewId);
  });

  sidebar.classList.remove("open");
}

function applyTheme(theme) {
  const selectedTheme = theme || "system";

  if (selectedTheme === "system") {
    document.documentElement.removeAttribute("data-theme");
    localStorage.removeItem(themeStorageKey);
  } else {
    document.documentElement.dataset.theme = selectedTheme;
    localStorage.setItem(themeStorageKey, selectedTheme);
  }

  themeButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.themeOption === selectedTheme);
  });
}

menuButton.addEventListener("click", () => {
  sidebar.classList.toggle("open");
});

navItems.forEach((item) => {
  item.addEventListener("click", () => showView(item.dataset.view));
});

viewLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    showView(link.dataset.viewLink || link.dataset.viewTarget);
  });
});

themeButtons.forEach((button) => {
  button.addEventListener("click", () => applyTheme(button.dataset.themeOption));
});

applyTheme(localStorage.getItem(themeStorageKey) || "system");
