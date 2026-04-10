const API_URL = "http://localhost:3000/api/produits?marque=Porsche";

const gridByCategory = {
  Sport: document.getElementById("sportGrid"),
  "Super Sport": document.getElementById("superGrid"),
  Classic: document.getElementById("classicGrid"),
  SUV: document.getElementById("suvGrid"),
  Electrique: document.getElementById("electricGrid"),
};

const IMAGE_BY_NAME = {
  "porsche 911 carrera": "../assets/img/porsche/colours/Sport/911%20Carrera%20RS/911%20Carrera%20S%20Red.jpg",
  "porsche 911 gt3": "../assets/img/porsche/colours/Super%20Sport/911%20GT3/911%20GT3%20Jaune.jpg",
  "porsche panamera": "../assets/img/porsche/colours/Classic/Panamera/Panamera%20Bleu.jpg",
  "porsche macan": "../assets/img/porsche/colours/SUV/Macan/Macan%20Orange.jpg",
  "porsche taycan turbo gt": "../assets/img/porsche/colours/Electrique/Taycan%20Turbo%20GT/Taycan%20Turbo%20GT%20Bleu.jpg",
};

const CATEGORY_BY_NAME = {
  "porsche 911 carrera": "Sport",
  "porsche 911 gt3": "Super Sport",
  "porsche panamera": "Classic",
  "porsche macan": "SUV",
  "porsche taycan turbo gt": "Electrique",
};

const normalizeLabel = (value) =>
  String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

const formatEuro = (value) => {
  const numeric = Number(value);
  if (Number.isNaN(numeric)) return "Sur devis";
  return `${numeric.toLocaleString("fr-FR", { maximumFractionDigits: 0 })} €`;
};

const createCard = (product, category) => {
  const key = normalizeLabel(product.nom);
  const image = IMAGE_BY_NAME[key] || "../assets/img/porsche/Porsche-index.png";
  const specPower = product.puissance ? `${product.puissance} ch` : "Puissance N/A";
  const specZero = product.zero_a_cent ? `0-100 km/h ${product.zero_a_cent} s` : "0-100 N/A";

  const article = document.createElement("article");
  article.className = "card";
  article.innerHTML = `
    <a class="card-link" href="produit.html?id=${product.id}" aria-label="Voir le produit ${product.nom}">
      <div class="card-media">
        <img src="${image}" alt="${product.nom}" />
        <span class="card-badge">${category}</span>
      </div>
      <div class="card-body">
        <h3>${product.nom}</h3>
        <div class="card-meta">
          <span>${product.marque || "Porsche"}</span>
          <span>${product.annee || "N/A"}</span>
        </div>
        <p>${product.description || "Modèle disponible à la commande."}</p>
        <div class="card-specs">
          <span class="spec">${specPower}</span>
          <span class="spec">${specZero}</span>
          <span class="spec">${formatEuro(product.prix)}</span>
          <span class="spec">${product.ref || "Ref N/A"}</span>
        </div>
        <div class="card-footer">
          <span>Découvrir</span>
          <span>${category}</span>
        </div>
      </div>
    </a>
  `;

  return article;
};

const clearGrids = () => {
  Object.values(gridByCategory).forEach((grid) => {
    if (grid) grid.innerHTML = "";
  });
};

const renderProducts = (products) => {
  clearGrids();
  products.forEach((product) => {
    const key = normalizeLabel(product.nom);
    const category = CATEGORY_BY_NAME[key] || "Sport";
    const grid = gridByCategory[category] || gridByCategory.Sport;
    if (!grid) return;
    grid.appendChild(createCard(product, category));
  });
};

const init = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) return;
    const products = await response.json();
    renderProducts(products);
  } catch {
    clearGrids();
  }
};

init();
