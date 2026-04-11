// Initialise les interactions du tiroir de compte.
(() => {
  const drawer = document.getElementById("accountDrawer");
  const backdrop = document.getElementById("drawerBackdrop");
  if (!drawer || !backdrop) return;

  drawer.hidden = true;
  backdrop.hidden = true;

  // Check if user is logged in and update drawer content
  const updateDrawerContent = () => {
    const userData = localStorage.getItem('lacasa_user');
    const drawerBody = drawer.querySelector('.drawer-body');
    const drawerActions = drawer.querySelector('.drawer-actions');

    if (userData) {
      const user = JSON.parse(userData);
      drawerBody.innerHTML = `
        <div class="user-info">
          <p><strong>${user.prenom} ${user.nom}</strong></p>
          <p>${user.email}</p>
        </div>
      `;
      drawerActions.innerHTML = `
        <a href="favoris.html">Mes favoris</a>
        <a href="panier.html">Mon panier</a>
        <button id="logoutBtn" class="logout-btn">Se déconnecter</button>
      `;

      // Add logout functionality
      const logoutBtn = drawerActions.querySelector('#logoutBtn');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
          localStorage.removeItem('lacasa_user');
          updateDrawerContent();
          closeDrawer();
          // Redirect to home page
          window.location.href = 'index.html';
        });
      }
    } else {
      drawerBody.innerHTML = '<p>Connectez-vous pour retrouver vos favoris, votre panier et vos commandes.</p>';
      drawerActions.innerHTML = `
        <a class="primary" href="login.html">Se connecter</a>
        <a href="register.html">Créer un compte</a>
      `;
    }
  };

  // Ouvre le tiroir de compte coulissant.
  const openDrawer = () => {
    updateDrawerContent();
    drawer.hidden = false;
    backdrop.hidden = false;
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
    drawer.hidden = true;
    backdrop.hidden = true;
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

  // Initialize drawer content on page load
  updateDrawerContent();
})();
