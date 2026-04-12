const filterToggle = document.getElementById("filterToggle");
const filterPanel = document.getElementById("filterPanel");
const filterOptions = Array.from(document.querySelectorAll(".filter-option"));
const allCarsGrid = document.getElementById("allCarsGrid");
const catalogueSearch = document.getElementById("catalogueSearch");
const catalogueSearchInput = document.getElementById("catalogueSearchInput");
const sortSelect = document.getElementById("sortSelect");

let cards = [];
let currentFilter = "all";
let currentSearch = "";
let currentSort = "alphabetical";

// Table de correspondance des images côté front
const PRODUCT_IMAGES = {
  Porsche: {
    "718 Spyder RS": "../assets/img/porsche/colours/Sport/718 Spyder RS/718 Spyder RS Argent.webp",
    "911 Carrera RS": "../assets/img/porsche/colours/Sport/911 Carrera RS/911 Carrera S Argent.jpg",
    "Panamera": "../assets/img/porsche/colours/Classic/Panamera/Panamera Blanc.jpg",
    "Cayenne E-Hybrid": "../assets/img/porsche/colours/SUV/Cayenne E-Hybrid/Cayenne E-Hybrid Blanc.jpg",
    "Cayenne Electric": "../assets/img/porsche/colours/Electrique/Cayenne Electric/Cayenne Electric Gris.jpg",
    "Macan": "../assets/img/porsche/colours/SUV/Macan/Macan Orange.jpg",
    "Taycan Turbo GT": "../assets/img/porsche/colours/Electrique/Taycan Turbo GT/Taycan Turbo GT Bleu.jpg",
    "718 Cayman GT4 RS": "../assets/img/porsche/colours/Super Sport/718 Cayman GT4 RS/718 Cayman GT4 RS Argent.webp",
    "911 GT3": "../assets/img/porsche/colours/Super Sport/911 GT3/911 GT3 Jaune.jpg",
    "911 Turbo S": "../assets/img/porsche/colours/Super Sport/911 Turbo S/911 Turbo S Argent.jpg"
  },
  Maserati: {
    "Granturismo Folgore": "../assets/img/maserati/Éléctrique/GRANTURISMO_FOLGORE/GRANTURISMO_FOLGORE_AVANT_NOIR.jpg",
    "Grecale Folgore": "../assets/img/maserati/Éléctrique/GRECALE_FOLGORE/GRECALE_FOLGORE_AVANT_NOIR.jpg",
    "Gran Turismo": "../assets/img/maserati/Sport/GRAN_TURISMO/GRAN_TURISMO_AVANT_NOIR.jpg",
    "Trofeo": "../assets/img/maserati/Sport/TROFEO/TROFEO_AVANT_NOIR.jpg",
    "Grancabrio": "../assets/img/maserati/Sport Cabrio/GRANCABRIO/GRANCABRIO_AVANT_OR.jpg",
    "Grancabrio Trofeo": "../assets/img/maserati/Sport Cabrio/GRANCABRIO TROFEO/GRANCABRIO_TROFEO_AVANT_NOIR.jpg",
    "GT2 Stradale": "../assets/img/maserati/Super Sport/GT2_STRADALE/GT2_STRADALE_AVANT_NOIR.jpg",
    "MCPura": "../assets/img/maserati/Super Sport/MCPURA/MCPURA_AVANT_NOIR.jpg",
    "Grecale": "../assets/img/maserati/SUV/GRECALE/GRECALE_AVANT_NOIR.jpg",
    "Grecale Modena": "../assets/img/maserati/SUV/GRECALE MODENA/GRECALE_MODENA_AVANT_NOIR.jpg"
  }
};

function getImageByProduct(product) {
  return PRODUCT_IMAGES[product.marque]?.[product.nom] || "../assets/img/logos/Red%20car%20house%20emblem%20logo.png";
}

function createCard(product) {
  const card = document.createElement("article");
  card.className = "card";
  card.setAttribute("data-category", product.categorie_nom || "Unknown");
  card.setAttribute("data-price", product.prix);

  const imagePath = getImageByProduct(product);

  card.innerHTML = `
    <a href="produit.html?id=${product.id}" class="card-link" aria-label="Voir le produit ${product.nom}">
      <div class="card-media">
        <img src="${imagePath}" alt="${product.nom}" />
        <span class="card-badge">${product.categorie_nom || "N/A"}</span>
      </div>
      <div class="card-body">
        <h3>${product.nom}</h3>
        <p>${product.description}</p>
        <div class="card-specs">
          <span class="spec">${product.couleur_principale || "N/A"}</span>
          <span class="spec">${Number(product.prix).toLocaleString("fr-FR")} €</span>
          <span class="spec">Stock: ${product.stock}</span>
        </div>
        <div class="card-footer">
          <span>Découvrir</span>
          <span>${product.ref}</span>
        </div>
      </div>
    </a>
  `;

  return card;
}

async function fetchProducts() {
  const marque = document.title.includes("Maserati") ? "Maserati" : "Porsche";

  try {
    const response = await fetch(`http://localhost:3000/api/produits?marque=${marque}`);
    if (!response.ok) throw new Error("Erreur API");

    const products = await response.json();

    allCarsGrid.innerHTML = "";
    cards = products.map(createCard);
    cards.forEach(card => allCarsGrid.appendChild(card));

    applyFiltersAndSort();
  } catch (error) {
    console.error("Erreur chargement produits :", error);
    allCarsGrid.innerHTML = "<p>Erreur lors du chargement des produits.</p>";
  }
}

function sortProducts(productsToSort) {
  const sorted = [...productsToSort];

  if (currentSort === "alphabetical") {
    sorted.sort((a, b) => {
      const nameA = a.querySelector("h3").textContent.toLowerCase();
      const nameB = b.querySelector("h3").textContent.toLowerCase();
      return nameA.localeCompare(nameB);
    });
  } else if (currentSort === "price-asc") {
    sorted.sort((a, b) => Number(a.dataset.price) - Number(b.dataset.price));
  } else if (currentSort === "price-desc") {
    sorted.sort((a, b) => Number(b.dataset.price) - Number(a.dataset.price));
  }

  return sorted;
}

function applyFiltersAndSort() {
  let filtered = cards.filter(card => {
    const matchesCategory = currentFilter === "all" || card.dataset.category === currentFilter;
    const matchesSearch = !currentSearch || card.textContent.toLowerCase().includes(currentSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  filtered = sortProducts(filtered);

  allCarsGrid.innerHTML = "";
  filtered.forEach(card => allCarsGrid.appendChild(card));
}

const setFilter = (value, label) => {
  currentFilter = value;
  filterOptions.forEach(btn => btn.classList.toggle("active", btn.dataset.filter === value));
  if (filterToggle) {
    filterToggle.textContent = label || value;
    filterToggle.setAttribute("aria-expanded", "false");
  }
  if (filterPanel) {
    filterPanel.classList.remove("open");
    filterPanel.setAttribute("aria-hidden", "true");
  }
  applyFiltersAndSort();
};

if (filterToggle && filterPanel) {
  filterToggle.addEventListener("click", () => {
    const isOpen = filterPanel.classList.toggle("open");
    filterToggle.setAttribute("aria-expanded", String(isOpen));
    filterPanel.setAttribute("aria-hidden", String(!isOpen));
  });
}

filterOptions.forEach((btn) => {
  btn.addEventListener("click", () => {
    const value = btn.dataset.filter;
    setFilter(value, btn.textContent.trim());
  });
});

document.addEventListener("click", (event) => {
  if (filterPanel && filterToggle && !filterPanel.contains(event.target) && event.target !== filterToggle) {
    filterPanel.classList.remove("open");
    filterToggle.setAttribute("aria-expanded", "false");
    filterPanel.setAttribute("aria-hidden", "true");
  }
});

if (catalogueSearch && catalogueSearchInput) {
  catalogueSearch.addEventListener("submit", (e) => {
    e.preventDefault();
    currentSearch = catalogueSearchInput.value.trim();
    applyFiltersAndSort();
  });

  catalogueSearchInput.addEventListener("input", (e) => {
    currentSearch = e.target.value.trim();
    applyFiltersAndSort();
  });
}

if (sortSelect) {
  sortSelect.addEventListener("change", (e) => {
    currentSort = e.target.value;
    applyFiltersAndSort();
  });
}

document.addEventListener("DOMContentLoaded", fetchProducts);
