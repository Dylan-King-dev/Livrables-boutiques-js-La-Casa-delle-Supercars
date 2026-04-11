// Search functionality with autocomplete suggestions
(() => {
  let searchInput = null;
  let suggestionsContainer = null;
  let currentFocus = -1;
  let debounceTimer = null;
  let isInitialized = false;

  // Initialize search functionality
  const initializeSearch = () => {
    if (isInitialized) return;

    searchInput = document.querySelector('.menu-search input[type="search"]');
    if (!searchInput) return;

    isInitialized = true;

    // Create suggestions container
    createSuggestionsContainer();

    // Add event listeners
    setupEventListeners();
  };

  // Create suggestions container
  const createSuggestionsContainer = () => {
    if (suggestionsContainer) return;

    suggestionsContainer = document.createElement('div');
    suggestionsContainer.className = 'search-suggestions';
    suggestionsContainer.style.cssText = `
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: white;
      border: 1px solid #ddd;
      border-top: none;
      border-radius: 0 0 4px 4px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      z-index: 1000;
      max-height: 300px;
      overflow-y: auto;
      display: none;
    `;

    searchInput.parentElement.style.position = 'relative';
    searchInput.parentElement.appendChild(suggestionsContainer);
  };

  // Setup event listeners
  const setupEventListeners = () => {
    if (!searchInput) return;

    // Handle input events
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.trim();

      // Clear previous timer
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }

      // Debounce API calls
      debounceTimer = setTimeout(() => {
        fetchSuggestions(query);
      }, 300);
    });

    // Handle keyboard navigation
    searchInput.addEventListener('keydown', (e) => {
      if (!suggestionsContainer || suggestionsContainer.style.display === 'none') return;

      const items = suggestionsContainer.querySelectorAll('.suggestion-item');

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        currentFocus = currentFocus < items.length - 1 ? currentFocus + 1 : 0;
        updateFocus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        currentFocus = currentFocus > 0 ? currentFocus - 1 : items.length - 1;
        updateFocus();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (currentFocus >= 0 && items[currentFocus]) {
          const productName = items[currentFocus].querySelector('span:first-child').textContent;
          searchInput.value = productName;
          hideSuggestions();
          performSearch(productName);
        }
      } else if (e.key === 'Escape') {
        hideSuggestions();
      }
    });

    // Handle form submission
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && (!suggestionsContainer || suggestionsContainer.style.display === 'none')) {
        e.preventDefault();
        performSearch(searchInput.value);
      }
    });

    // Hide suggestions when clicking outside
    document.addEventListener('click', (e) => {
      if (!searchInput || !suggestionsContainer) return;
      if (!searchInput.contains(e.target) && !suggestionsContainer.contains(e.target)) {
        hideSuggestions();
      }
    });
  };

  // Fetch suggestions from API
  const fetchSuggestions = async (query) => {
    if (query.length < 2) {
      hideSuggestions();
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/produits/search/suggestions?q=${encodeURIComponent(query)}`);
      const suggestions = await response.json();
      displaySuggestions(suggestions, query);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      hideSuggestions();
    }
  };

  // Display suggestions
  const displaySuggestions = (suggestions, query) => {
    if (!suggestionsContainer) return;

    if (suggestions.length === 0) {
      hideSuggestions();
      return;
    }

    suggestionsContainer.innerHTML = '';

    suggestions.forEach((product, index) => {
      const item = document.createElement('div');
      item.className = 'suggestion-item';
      item.style.cssText = `
        padding: 12px 16px;
        cursor: pointer;
        border-bottom: 1px solid #eee;
        display: flex;
        justify-content: space-between;
        align-items: center;
      `;

      const nameSpan = document.createElement('span');
      nameSpan.style.fontWeight = '500';

      // Highlight matching text
      const regex = new RegExp(`(${query})`, 'gi');
      nameSpan.innerHTML = product.nom.replace(regex, '<mark>$1</mark>');

      const detailsSpan = document.createElement('span');
      detailsSpan.style.cssText = `
        font-size: 0.9em;
        color: #666;
        margin-left: 8px;
      `;
      detailsSpan.textContent = `${product.marque} • ${formatPrice(product.prix, product.reduction)}`;

      item.appendChild(nameSpan);
      item.appendChild(detailsSpan);

      // Store product data for later use
      item.dataset.productId = product.id;
      item.dataset.productName = product.nom;

      // Add click handler
      item.addEventListener('click', () => {
        selectSuggestion(product);
      });

      // Add keyboard navigation
      item.addEventListener('mouseenter', () => {
        removeActiveStates();
        item.classList.add('active');
        currentFocus = index;
      });

      suggestionsContainer.appendChild(item);
    });

    suggestionsContainer.style.display = 'block';
  };

  // Hide suggestions
  const hideSuggestions = () => {
    if (suggestionsContainer) {
      suggestionsContainer.style.display = 'none';
    }
    currentFocus = -1;
  };

  // Remove active states from suggestions
  const removeActiveStates = () => {
    if (!suggestionsContainer) return;
    const items = suggestionsContainer.querySelectorAll('.suggestion-item');
    items.forEach(item => item.classList.remove('active'));
  };

  // Select a suggestion
  const selectSuggestion = (product) => {
    if (searchInput) {
      searchInput.value = product.nom;
    }
    hideSuggestions();
    // Navigate to product page
    window.location.href = `produit.html?id=${product.id}`;
  };

  // Format price with discount
  const formatPrice = (price, reduction) => {
    const finalPrice = reduction > 0 ? price * (1 - reduction / 100) : price;
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(finalPrice);
  };

  // Update focus styling
  const updateFocus = () => {
    if (!suggestionsContainer) return;
    removeActiveStates();
    const items = suggestionsContainer.querySelectorAll('.suggestion-item');
    if (items[currentFocus]) {
      items[currentFocus].classList.add('active');
      items[currentFocus].scrollIntoView({ block: 'nearest' });
    }
  };

  // Perform search when Enter is pressed without selection
  const performSearch = async (query) => {
    if (!query.trim()) return;

    try {
      // First, try to find products matching the search
      const response = await fetch(`http://localhost:3000/api/produits?search=${encodeURIComponent(query)}`);
      const products = await response.json();

      if (products.length > 0) {
        // Check which brand has the most results
        const maseratiCount = products.filter(p => p.marque === 'Maserati').length;
        const porscheCount = products.filter(p => p.marque === 'Porsche').length;

        // Redirect to the catalogue with the most results, or Maserati if tie
        const targetCatalogue = porscheCount > maseratiCount ? 'cataloguePorsche.html' : 'catalogueMaserati.html';
        window.location.href = `${targetCatalogue}?search=${encodeURIComponent(query)}`;
      } else {
        // No results found, show a message
        alert(`Aucun produit trouvé pour "${query}". Essayez avec des termes différents.`);
      }
    } catch (error) {
      console.error('Error performing search:', error);
      // Fallback to Maserati catalogue
      window.location.href = `catalogueMaserati.html?search=${encodeURIComponent(query)}`;
    }
  };

  // Watch for menu panel changes
  const menuPanel = document.getElementById('menuPanel');
  if (menuPanel) {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          const isOpen = menuPanel.classList.contains('open');
          if (isOpen) {
            // Menu is opening, initialize search if not already done
            setTimeout(initializeSearch, 100); // Small delay to ensure DOM is ready
          } else {
            // Menu is closing, hide suggestions
            hideSuggestions();
          }
        }
      });
    });
    observer.observe(menuPanel, { attributes: true });
  }

  // Also try to initialize immediately in case menu is already open
  setTimeout(initializeSearch, 100);
})();