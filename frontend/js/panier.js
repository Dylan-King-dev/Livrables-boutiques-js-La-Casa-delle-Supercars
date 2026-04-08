const listEl = document.getElementById("itemsList");
const emptyEl = document.getElementById("emptyState");
const addressInput = document.getElementById("addressInput");
const suggestionsEl = document.getElementById("addressSuggestions");
const cityInput = document.getElementById("cityInput");
const postalInput = document.getElementById("postalInput");

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
    // Remove the product from the cart.
    card.querySelector("button").addEventListener("click", () => {
      removeItem(STORAGE_KEYS.cart, product.id);
      render();
    });
    listEl.appendChild(card);
  });
};

// Initial render on page load.
render();

// Hide and clear the address suggestions list.
const clearSuggestions = () => {
  if (!suggestionsEl) {
    return;
  }
  suggestionsEl.innerHTML = "";
  suggestionsEl.style.display = "none";
};

// Normalize different API payload shapes into a common suggestion list.
const normalizeSuggestions = (data) => {
  if (!data) {
    return [];
  }

  if (Array.isArray(data.results)) {
    return data.results
      .map((item) => ({
        label: item.fulltext || item.label || item.text || "",
        city: item.city || item.citycode || "",
        postcode: item.postcode || item.postalcode || "",
      }))
      .filter((item) => item.label);
  }

  if (Array.isArray(data.features)) {
    return data.features
      .map((feature) => ({
        label: feature.properties?.label || feature.properties?.name || "",
        city: feature.properties?.city || "",
        postcode: feature.properties?.postcode || "",
      }))
      .filter((item) => item.label);
  }

  return [];
};

// Split a full suggestion label into address, city, and postal code.
const splitAddressLine = (label) => {
  if (!label) {
    return { address: "", city: "", postcode: "" };
  }

  const [addressPart, rest] = label.split(",", 2).map((part) => part?.trim() || "");
  if (!rest) {
    return { address: label.trim(), city: "", postcode: "" };
  }

  const postalMatch = rest.match(/\b\d{5}\b/);
  const postcode = postalMatch ? postalMatch[0] : "";
  const city = rest.replace(postcode, "").trim();
  return { address: addressPart, city, postcode };
};

// Render suggestion items and wire up click handlers.
const renderSuggestions = (items) => {
  if (!suggestionsEl) {
    return;
  }
  suggestionsEl.innerHTML = "";
  if (!items.length) {
    clearSuggestions();
    return;
  }
  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item.label;
    // Fill the form with the selected suggestion.
    li.addEventListener("click", () => {
      const parsed = splitAddressLine(item.label);
      addressInput.value = parsed.address || item.label;
      const cityValue = item.city || parsed.city;
      const postalValue = item.postcode || parsed.postcode;
      if (cityValue) {
        cityInput.value = cityValue;
      }
      if (postalValue) {
        postalInput.value = postalValue;
      }
      clearSuggestions();
    });
    suggestionsEl.appendChild(li);
  });
  suggestionsEl.style.display = "block";
};

let autocompleteTimer = null;
let lastQuery = "";

// Fetch address suggestions from the geocoding API.
const fetchSuggestions = async (query) => {
  if (!query || query.length < 3) {
    clearSuggestions();
    return;
  }

  if (query === lastQuery) {
    return;
  }
  lastQuery = query;

  const url = `https://data.geopf.fr/geocodage/completion?text=${encodeURIComponent(query)}&maximumResponses=5&type=StreetAddress`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      clearSuggestions();
      return;
    }
    const data = await response.json();
    renderSuggestions(normalizeSuggestions(data));
  } catch (error) {
    clearSuggestions();
  }
};

if (addressInput) {
  // Debounce input to avoid spamming the API.
  addressInput.addEventListener("input", (event) => {
    const value = event.target.value.trim();
    if (autocompleteTimer) {
      window.clearTimeout(autocompleteTimer);
    }
    autocompleteTimer = window.setTimeout(() => {
      fetchSuggestions(value);
    }, 250);
  });

  // Close suggestions when clicking elsewhere.
  document.addEventListener("click", (event) => {
    if (!suggestionsEl) {
      return;
    }
    if (event.target === addressInput || suggestionsEl.contains(event.target)) {
      return;
    }
    clearSuggestions();
  });
}
