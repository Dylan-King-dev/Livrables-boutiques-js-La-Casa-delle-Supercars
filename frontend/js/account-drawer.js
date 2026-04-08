// Initialise les interactions du tiroir de compte.
(() => {
  const drawer = document.getElementById("accountDrawer");
  const backdrop = document.getElementById("drawerBackdrop");
  if (!drawer || !backdrop) return;

  // Ouvre le tiroir de compte coulissant.
  const openDrawer = () => {
    drawer.classList.add("open");
    backdrop.classList.add("open");
    drawer.setAttribute("aria-hidden", "false");
    document.body.classList.add("drawer-open");
  };

  // Ferme le tiroir de compte coulissant.
  const closeDrawer = () => {
    drawer.classList.remove("open");
    backdrop.classList.remove("open");
    drawer.setAttribute("aria-hidden", "true");
    document.body.classList.remove("drawer-open");
  };

  document.querySelectorAll("[data-account-link]").forEach((link) => {
    // Intercepte les liens de compte pour ouvrir le tiroir.
    link.addEventListener("click", (e) => {
      e.preventDefault();
      openDrawer();
    });
  });

  const closeBtn = drawer.querySelector("[data-drawer-close]");
  // Ferme via le bouton X si present.
  if (closeBtn) closeBtn.addEventListener("click", closeDrawer);
  // Ferme quand on clique en dehors du tiroir.
  backdrop.addEventListener("click", closeDrawer);

  document.addEventListener("keydown", (e) => {
    // Autorise la touche Echap pour fermer le tiroir.
    if (e.key === "Escape") closeDrawer();
  });
})();
