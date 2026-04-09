const listEl = document.getElementById("itemsList");
const emptyEl = document.getElementById("emptyState");

// Render the favorites list from localStorage.
const render = () => {
  const ids = getList(STORAGE_KEYS.favs);
  listEl.className = "items";
  listEl.innerHTML = "";

  if (!ids.length) {
    emptyEl.style.display = "grid";
    return;
  }

  emptyEl.style.display = "none";

  ids.forEach((id) => {
    const product = getProduct(id);
    const card = document.createElement("div");
    card.className = "item-card";
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <div class="item-info">
        <h3>${product.name}</h3>
        <span>${product.brand}</span>
      </div>
      <div class="item-actions">
        <button type="button" data-action="remove" data-id="${product.id}">Retirer</button>
      </div>
    `;
    // Go to the product page when clicking the image.
    card.querySelector("img").addEventListener("click", () => {
      window.location.href = `produit.html?id=${product.id}`;
    });
    // Remove the product from favorites.
    card.querySelector("button").addEventListener("click", () => {
      removeItem(STORAGE_KEYS.favs, product.id);
      render();
    });
    listEl.appendChild(card);
  });
};

// Initial render on page load.
render();
