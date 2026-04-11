const filterToggle = document.getElementById("filterToggle");
const filterPanel = document.getElementById("filterPanel");
const filterOptions = Array.from(document.querySelectorAll(".filter-option"));
const allCarsGrid = document.getElementById("allCarsGrid");
const catalogueSearch = document.getElementById("catalogueSearch");
const catalogueSearchInput = document.getElementById("catalogueSearchInput");
const sortSelect = document.getElementById("sortSelect");

let cards = [];
let allProducts = [];
let currentFilter = "all";
let currentSearch = "";
let currentSort = "alphabetical";

// Function to create a card element from product data
function createCard(product) {
    const card = document.createElement('article');
    card.className = 'card';
    card.setAttribute('data-category', product.categorie_nom || 'Unknown');

    // Assume image path based on marque, categorie_nom, nom
    const modelName = product.ref.replace('Réf. ', '').replace('/', '_').toUpperCase();
    const modelFolder = product.nom.replace(new RegExp(`^${product.marque}\\s+`, 'i'), '');
    const color = product.couleur_principale || 'Noir';
    let imagePath;
    if (product.marque === 'Maserati') {
        const colorUpper = color.toUpperCase();
        imagePath = `../assets/img/maserati/${product.categorie_nom}/${modelName}/${modelName}_AVANT_${colorUpper}.jpg`;
    } else if (product.marque === 'Porsche') {
        imagePath = `../assets/img/porsche/colours/${product.categorie_nom}/${modelFolder}/${color}.jpg`;
    } else {
        imagePath = '../assets/img/porsche/Porsche-index.png';
    }
    // Fallback to a default image if not found
    const fallbackImage = '../assets/img/porsche/Porsche-index.png'; // or some placeholder

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
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search');

    let apiUrl = `http://localhost:3000/api/produits?marque=${marque}`;
    if (searchQuery) {
        apiUrl += `&search=${encodeURIComponent(searchQuery)}`;
    }

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Failed to fetch products');
        const products = await response.json();

        // Clear existing cards
        allCarsGrid.innerHTML = '';

        // Create and append cards
        cards = products.map(createCard);
        allProducts = [...cards];
        cards.forEach(card => allCarsGrid.appendChild(card));

        // Update filter options if needed
        updateFilterOptions();

        // Show search results message if searching
        if (searchQuery) {
            const resultsCount = products.length;
            const searchMessage = document.createElement('div');
            searchMessage.className = 'search-results-message';
            searchMessage.style.cssText = `
                margin-bottom: 20px;
                padding: 12px 16px;
                background: #f8f9fa;
                border-radius: 4px;
                border-left: 4px solid #1b2330;
            `;
            searchMessage.innerHTML = `
                <strong>Résultats pour "${searchQuery}"</strong> - ${resultsCount} produit${resultsCount !== 1 ? 's' : ''} trouvé${resultsCount !== 1 ? 's' : ''}
            `;

            // Insert before the grid
            allCarsGrid.parentElement.insertBefore(searchMessage, allCarsGrid);
        }
    } catch (error) {
        console.error('Error fetching products:', error);
        allCarsGrid.innerHTML = '<p>Erreur lors du chargement des produits.</p>';
    }
}

// Sort products based on current sort selection
function sortProducts(productsToSort) {
    const sorted = [...productsToSort];
    
    if (currentSort === "alphabetical") {
        sorted.sort((a, b) => {
            const nameA = a.querySelector("h3").textContent.toLowerCase();
            const nameB = b.querySelector("h3").textContent.toLowerCase();
            return nameA.localeCompare(nameB);
        });
    } else if (currentSort === "price-asc") {
        sorted.sort((a, b) => {
            const priceA = parseInt(a.querySelector(".card-specs span:nth-child(2)").textContent);
            const priceB = parseInt(b.querySelector(".card-specs span:nth-child(2)").textContent);
            return priceA - priceB;
        });
    } else if (currentSort === "price-desc") {
        sorted.sort((a, b) => {
            const priceA = parseInt(a.querySelector(".card-specs span:nth-child(2)").textContent);
            const priceB = parseInt(b.querySelector(".card-specs span:nth-child(2)").textContent);
            return priceB - priceA;
        });
    }
    
    return sorted;
}

// Update displayed products based on all filters (category, search, sort)
function applyFiltersAndSort() {
    let filtered = cards.filter(card => {
        // Apply category filter
        const matchesCategory = currentFilter === "all" || card.dataset.category === currentFilter;
        
        // Apply search filter
        let matchesSearch = true;
        if (currentSearch) {
            const cardText = card.textContent.toLowerCase();
            matchesSearch = cardText.includes(currentSearch.toLowerCase());
        }
        
        return matchesCategory && matchesSearch;
    });
    
    // Sort the filtered results
    filtered = sortProducts(filtered);
    
    // Update display
    cards.forEach(card => card.classList.add("is-hidden"));
    filtered.forEach(card => card.classList.remove("is-hidden"));
}

// Update filter options based on available categories
function updateFilterOptions() {
    const categories = [...new Set(cards.map(card => card.dataset.category))];
    // For now, keep the existing filters, but could dynamically add if needed
}

// Apply the selected filter to cards and update UI state.
const setFilter = (value, label) => {
  currentFilter = value;
  filterOptions.forEach((btn) => btn.classList.toggle("active", btn.dataset.filter === value));
  filterToggle.textContent = label || value;
  filterToggle.setAttribute("aria-expanded", "false");
  filterPanel.classList.remove("open");
  filterPanel.setAttribute("aria-hidden", "true");
  applyFiltersAndSort();
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

// Handle search form submission
catalogueSearch.addEventListener("submit", (e) => {
  e.preventDefault();
  currentSearch = catalogueSearchInput.value.trim();
  applyFiltersAndSort();
});

// Handle search input change (live search)
catalogueSearchInput.addEventListener("input", (e) => {
  currentSearch = e.target.value.trim();
  applyFiltersAndSort();
});

// Handle sort selection change
sortSelect.addEventListener("change", (e) => {
  currentSort = e.target.value;
  applyFiltersAndSort();
});

// Load products on page load
document.addEventListener('DOMContentLoaded', fetchProducts);
