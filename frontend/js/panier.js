const listEl = document.getElementById("itemsList");
const emptyEl = document.getElementById("emptyState");
const summaryCount = document.getElementById("summaryCount");
const summaryTotal = document.getElementById("summaryTotal");

const parsePrice = (value) => {
  if (!value || typeof value !== "string") return null;
  if (value.toLowerCase().includes("devis")) return null;
  const digits = value.replace(/[^\d]/g, "");
  if (!digits) return null;
  return Number(digits);
};

const formatPrice = (value) => {
  return new Intl.NumberFormat("fr-FR").format(value) + " €";
};

// Render the cart list from localStorage.
const render = () => {
  const ids = getList(STORAGE_KEYS.cart);
  listEl.className = "items";
  listEl.innerHTML = "";

  if (!ids.length) {
    emptyEl.style.display = "grid";
    return;
  }

  emptyEl.style.display = "none";

  let total = 0;
  let hasDevis = false;

  ids.forEach((id) => {
    const product = getProduct(id);
    const price = parsePrice(product.price);
    if (price === null) {
      hasDevis = true;
    } else {
      total += price;
    }
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
    // Remove the product from the cart.
    card.querySelector("button").addEventListener("click", () => {
      removeItem(STORAGE_KEYS.cart, product.id);
      render();
    });
    listEl.appendChild(card);
  });

  if (summaryCount) summaryCount.textContent = String(ids.length);
  if (summaryTotal) {
    summaryTotal.textContent = hasDevis ? "Sur devis" : formatPrice(total);
  }
  localStorage.setItem("lacasa_order_total", hasDevis ? "Sur devis" : formatPrice(total));
  localStorage.setItem("lacasa_order_count", String(ids.length));
};

// Initial render on page load.
render();
