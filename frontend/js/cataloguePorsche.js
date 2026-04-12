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

// Associe chaque modèle Porsche à son image front
const PORSCHE_IMAGES = {
  "718 Spyder RS": "../assets/img/porsche/colours/Sport/718 Spyder RS/718 Spyder RS.jpg",
  "911 Carrera RS": "../assets/img/porsche/colours/Sport/911 Carrera RS/911 Carrera RS.jpg",
  "Panamera": "../assets/img/porsche/colours/Classic/Panamera/Panamera Bleu.jpg",
  "Cayenne E-Hybrid": "../assets/img/porsche/colours/SUV/Cayenne E-Hybrid/Cayenne E-Hybrid.jpg",
  "Cayenne Electric": "../assets/img/porsche/colours/Electrique/Cayenne Electric/Cayenne Electric.jpg",
  "Macan": "../assets/img/porsche/colours/SUV/Macan/Macan Orange.jpg",
  "Taycan Turbo GT": "../assets/img/porsche/colours/Electrique/Taycan Turbo GT/Taycan Turbo GT Bleu.jpg",
  "718 Cayman GT4 RS": "../assets/img/porsche/colours/Super Sport/718 Cayman GT4 RS/718 Cayman GT4 RS.jpg",
  "911 GT3": "../assets/img/porsche/colours/Super Sport/911 GT3/911 GT3 Jaune.jpg",
  "911 Turbo S": "../assets/img/porsche/colours/Super Sport/911 Turbo S/911 Turbo S.jpg"
};

function getPorscheImage(product) {
  return PORSCHE_IMAGES[product.nom] || "../assets/img/porsche/Porsche-index.png";
}

function createCard(product) {
  const card = document.createElement("article");
  card.className = "card";
  card.dataset.category = product.categorie_nom || "Unknown";
  card.dataset.price = product.prix;

  const imagePath = getPorscheImage(product);
  const fallbackImage = "../assets/img/porsche/Porsche-index.png";

  card.innerHTML = `
    <a href="produit.html?id=${product.id}" class="card-link" aria-label="Voir le produit ${product.nom}">
      <div class="card-media">
        <img src="${imagePath}" alt="${product.nom}" onerror="this.src='${fallbackImage}'" />
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
  try {
    const response = await fetch("http://localhost:3000/api/produits?marque=Porsche");
    if (!response.ok) {
      throw new Error("Erreur lors du chargement des produits");
    }

    const products = await response.json();

    allCarsGrid.innerHTML = "";
    cards = products.map(createCard);
    cards.forEach((card) => allCarsGrid.appendChild(card));

    applyFiltersAndSort();
  } catch (error) {
    console.error("Erreur chargement produits Porsche :", error);
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
  let filtered = cards.filter((card) => {
    const matchesCategory =
      currentFilter === "all" || card.dataset.category === currentFilter;

    const matchesSearch =
      !currentSearch ||
      card.textContent.toLowerCase().includes(currentSearch.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  filtered = sortProducts(filtered);

  cards.forEach((card) => card.classList.add("is-hidden"));
  filtered.forEach((card) => card.classList.remove("is-hidden"));
}

const setFilter = (value, label) => {
  currentFilter = value;

  filterOptions.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.filter === value);
  });

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
    setFilter(btn.dataset.filter, btn.textContent.trim());
  });
});

document.addEventListener("click", (event) => {
  if (
    filterPanel &&
    filterToggle &&
    !filterPanel.contains(event.target) &&
    event.target !== filterToggle
  ) {
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
