const totalEl = document.getElementById("payTotal");
const countEl = document.getElementById("payCount");

if (countEl) {
  countEl.textContent = localStorage.getItem("lacasa_order_count") || "0";
}

if (totalEl) {
  totalEl.textContent = localStorage.getItem("lacasa_order_total") || "Sur devis";
}

// Address autocompletion using French government API
const addressInput = document.getElementById("address");
const cityInput = document.getElementById("city");
const postalInput = document.getElementById("postal");

if (addressInput) {
  let suggestionsContainer = document.createElement("div");
  suggestionsContainer.id = "address-suggestions";
  suggestionsContainer.style.cssText = `
    position: absolute;
    background: white;
    border: 1px solid #ccc;
    border-top: none;
    max-height: 200px;
    overflow-y: auto;
    z-index: 1000;
    width: calc(100% - 2px);
    display: none;
  `;
  addressInput.parentNode.style.position = "relative";
  addressInput.parentNode.appendChild(suggestionsContainer);

  let debounceTimer;

  addressInput.addEventListener("input", function() {
    clearTimeout(debounceTimer);
    const query = this.value.trim();
    if (query.length < 3) {
      suggestionsContainer.style.display = "none";
      return;
    }
    debounceTimer = setTimeout(() => fetchSuggestions(query), 300);
  });

  addressInput.addEventListener("blur", function() {
    setTimeout(() => suggestionsContainer.style.display = "none", 150);
  });

  function fetchSuggestions(query) {
    fetch(`https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(query)}&limit=5`)
      .then(response => response.json())
      .then(data => {
        suggestionsContainer.innerHTML = "";
        if (data.features && data.features.length > 0) {
          data.features.forEach(feature => {
            const suggestion = document.createElement("div");
            suggestion.textContent = feature.properties.label;
            suggestion.style.cssText = `
              padding: 8px;
              cursor: pointer;
              border-bottom: 1px solid #eee;
            `;
            suggestion.addEventListener("click", () => selectSuggestion(feature.properties));
            suggestionsContainer.appendChild(suggestion);
          });
          suggestionsContainer.style.display = "block";
        } else {
          suggestionsContainer.style.display = "none";
        }
      })
      .catch(error => {
        console.error("Erreur lors de la récupération des suggestions:", error);
        suggestionsContainer.style.display = "none";
      });
  }

  function selectSuggestion(properties) {
    addressInput.value = properties.name || properties.label.split(", ")[0];
    cityInput.value = properties.city;
    postalInput.value = properties.postcode;
    suggestionsContainer.style.display = "none";
  }
}
