const filterToggle = document.getElementById("filterToggle");
const filterPanel = document.getElementById("filterPanel");
const filterOptions = Array.from(document.querySelectorAll(".filter-option"));
const allCarsGrid = document.getElementById("allCarsGrid");
let cards = [];

// Function to create a card element from product data
function createCard(product) {
    const card = document.createElement('article');
    card.className = 'card';
    card.setAttribute('data-category', product.categorie_nom || 'Unknown');

    // Assume image path based on marque, categorie_nom, nom
    const modelName = product.nom.replace(new RegExp(`^${product.marque}\\s+`, 'i'), '').replace(/\s+/g, '_').toUpperCase();
    const imagePath = `../assets/img/${product.marque.toLowerCase()}/${product.categorie_nom}/${modelName}/icon/${modelName.toLowerCase()}.jpg`;
    // Fallback to a default image if not found
    const fallbackImage = '../assets/img/maserati/Maserati-index.png'; // or some placeholder

    card.innerHTML = `
        <a href="produit.html?id=${product.id}" class="card-link" aria-label="Voir le produit ${product.nom}">
            <div class="card-media">
                <img src="${imagePath}" alt="${product.nom}" onerror="this.src='${fallbackImage}'" />
                <span class="card-badge">${product.categorie_nom || 'N/A'}</span>
            </div>
            <div class="card-body">
                <h3>${product.nom}</h3>
                <p>${product.description}</p>
                <div class="card-specs">
                    <span class="spec">${product.couleur_principale || 'N/A'}</span>
                    <span class="spec">${product.prix} €</span>
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

// Fetch products from API
async function fetchProducts() {
    const marque = document.title.includes('Maserati') ? 'Maserati' : 'Porsche';
    try {
        const response = await fetch(`http://localhost:3000/api/produits?marque=${marque}`);
        if (!response.ok) throw new Error('Failed to fetch products');
        const products = await response.json();

        // Clear existing cards
        allCarsGrid.innerHTML = '';

        // Create and append cards
        cards = products.map(createCard);
        cards.forEach(card => allCarsGrid.appendChild(card));

        // Update filter options if needed
        updateFilterOptions();
    } catch (error) {
        console.error('Error fetching products:', error);
        allCarsGrid.innerHTML = '<p>Erreur lors du chargement des produits.</p>';
    }
}

// Update filter options based on available categories
function updateFilterOptions() {
    const categories = [...new Set(cards.map(card => card.dataset.category))];
    // For now, keep the existing filters, but could dynamically add if needed
}

// Apply the selected filter to cards and update UI state.
const setFilter = (value, label) => {
  filterOptions.forEach((btn) => btn.classList.toggle("active", btn.dataset.filter === value));
  cards.forEach((card) => {
    const match = value === "all" || card.dataset.category === value;
    card.classList.toggle("is-hidden", !match);
  });
  filterToggle.textContent = label || value;
  filterToggle.setAttribute("aria-expanded", "false");
  filterPanel.classList.remove("open");
  filterPanel.setAttribute("aria-hidden", "true");
};

// Toggle the filter dropdown panel.
filterToggle.addEventListener("click", () => {
  const isOpen = filterPanel.classList.toggle("open");
  filterToggle.setAttribute("aria-expanded", String(isOpen));
  filterPanel.setAttribute("aria-hidden", String(!isOpen));
});

filterOptions.forEach((btn) => {
  // Apply the clicked filter option.
  btn.addEventListener("click", () => {
    const value = btn.dataset.filter;
    setFilter(value, btn.textContent.trim());
  });
});

// Close the panel when clicking outside of it.
document.addEventListener("click", (event) => {
  if (!filterPanel.contains(event.target) && event.target !== filterToggle) {
    filterPanel.classList.remove("open");
    filterToggle.setAttribute("aria-expanded", "false");
    filterPanel.setAttribute("aria-hidden", "true");
  }
});

// Load products on page load
document.addEventListener('DOMContentLoaded', fetchProducts);
