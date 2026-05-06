const sidebar = document.getElementById("sidebar");
const menuButton = document.getElementById("menuButton");
const navItems = document.querySelectorAll(".nav-item");
const views = document.querySelectorAll(".view");

function showView(viewId) {
  views.forEach((view) => {
    view.classList.toggle("active", view.id === viewId);
  });

  navItems.forEach((item) => {
    item.classList.toggle("active", item.dataset.view === viewId);
  });

  sidebar.classList.remove("open");
}

menuButton.addEventListener("click", () => {
  sidebar.classList.toggle("open");
});

navItems.forEach((item) => {
  item.addEventListener("click", () => showView(item.dataset.view));
});
