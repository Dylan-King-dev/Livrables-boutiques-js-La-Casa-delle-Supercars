const totalEl = document.getElementById("payTotal");
const countEl = document.getElementById("payCount");

if (countEl) {
  countEl.textContent = localStorage.getItem("lacasa_order_count") || "0";
}
if (totalEl) {
  totalEl.textContent = localStorage.getItem("lacasa_order_total") || "Sur devis";
}

// ── Address autocomplete (French gov API) ────────────────────
const addressInput = document.getElementById("address");
const cityInput    = document.getElementById("city");
const postalInput  = document.getElementById("postal");

if (addressInput) {
  const suggestionsContainer = document.createElement("div");
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

  addressInput.addEventListener("input", function () {
    clearTimeout(debounceTimer);
    const query = this.value.trim();
    if (query.length < 3) { suggestionsContainer.style.display = "none"; return; }
    debounceTimer = setTimeout(() => fetchSuggestions(query), 300);
  });

  addressInput.addEventListener("blur", function () {
    setTimeout(() => suggestionsContainer.style.display = "none", 150);
  });

  function fetchSuggestions(query) {
    fetch(`https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(query)}&limit=5`)
      .then(r => r.json())
      .then(data => {
        suggestionsContainer.innerHTML = "";
        if (data.features?.length) {
          data.features.forEach(feature => {
            const div = document.createElement("div");
            div.textContent = feature.properties.label;
            div.style.cssText = "padding:8px;cursor:pointer;border-bottom:1px solid #eee;";
            div.addEventListener("mousedown", () => selectSuggestion(feature.properties));
            suggestionsContainer.appendChild(div);
          });
          suggestionsContainer.style.display = "block";
        } else {
          suggestionsContainer.style.display = "none";
        }
      })
      .catch(() => { suggestionsContainer.style.display = "none"; });
  }

  function selectSuggestion(props) {
    addressInput.value = props.name || props.label.split(", ")[0];
    if (cityInput)   cityInput.value   = props.city     || "";
    if (postalInput) postalInput.value = props.postcode || "";
    suggestionsContainer.style.display = "none";
    clearError(addressInput);
    clearError(cityInput);
    clearError(postalInput);
  }
}

// ── Validation helpers ───────────────────────────────────────

function showError(input, msg) {
  input.classList.add("input-error");
  let err = input.parentNode.querySelector(".field-error");
  if (!err) {
    err = document.createElement("span");
    err.className = "field-error";
    input.parentNode.appendChild(err);
  }
  err.textContent = msg;
}

function clearError(input) {
  if (!input) return;
  input.classList.remove("input-error");
  const err = input.parentNode.querySelector(".field-error");
  if (err) err.remove();
}

// Clear error on user input
["cardName","cardNumber","cardExpiry","cardCvc","address","city","postal"].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener("input", () => clearError(el));
});

function validateFields() {
  let valid = true;

  const cardName   = document.getElementById("cardName");
  const cardNumber = document.getElementById("cardNumber");
  const cardExpiry = document.getElementById("cardExpiry");
  const cardCvc    = document.getElementById("cardCvc");
  const address    = document.getElementById("address");
  const city       = document.getElementById("city");
  const postal     = document.getElementById("postal");

  if (!cardName?.value.trim()) {
    showError(cardName, "Champ obligatoire");
    valid = false;
  }

  if (!cardNumber?.value.trim()) {
    showError(cardNumber, "Champ obligatoire");
    valid = false;
  } else if (!/^\d[\d\s]{13,18}\d$/.test(cardNumber.value.trim())) {
    showError(cardNumber, "Numéro invalide");
    valid = false;
  }

  if (!cardExpiry?.value.trim()) {
    showError(cardExpiry, "Champ obligatoire");
    valid = false;
  } else if (!/^\d{2}\/\d{2}$/.test(cardExpiry.value.trim())) {
    showError(cardExpiry, "Format MM/AA attendu");
    valid = false;
  }

  if (!cardCvc?.value.trim()) {
    showError(cardCvc, "Champ obligatoire");
    valid = false;
  } else if (!/^\d{3,4}$/.test(cardCvc.value.trim())) {
    showError(cardCvc, "CVC invalide");
    valid = false;
  }

  if (!address?.value.trim()) {
    showError(address, "Champ obligatoire");
    valid = false;
  }

  if (!city?.value.trim()) {
    showError(city, "Champ obligatoire");
    valid = false;
  }

  if (!postal?.value.trim()) {
    showError(postal, "Champ obligatoire");
    valid = false;
  } else if (!/^\d{4,5}$/.test(postal.value.trim())) {
    showError(postal, "Code postal invalide");
    valid = false;
  }

  return valid;
}

// ── Stock decrement ──────────────────────────────────────────

async function decrementStock() {
  const ids = JSON.parse(localStorage.getItem("lacasa_cart") || "[]");
  if (!ids.length) return;

  // Count occurrences (same product added multiple times)
  const counts = {};
  ids.forEach(id => { counts[id] = (counts[id] || 0) + 1; });

  await Promise.allSettled(
    Object.entries(counts).map(([id, qty]) =>
      fetch(`http://localhost:3000/api/produits/${id}/decrement-stock`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: qty }),
      })
    )
  );
}

// ── Success screen ───────────────────────────────────────────

function showSuccess() {
  // Clear cart data
  localStorage.removeItem("lacasa_cart");
  localStorage.removeItem("lacasa_order_total");
  localStorage.removeItem("lacasa_order_count");

  const overlay = document.createElement("div");
  overlay.id = "successOverlay";
  overlay.innerHTML = `
    <div class="success-box">
      <div class="success-icon">
        <svg viewBox="0 0 52 52" width="64" height="64">
          <circle cx="26" cy="26" r="25" fill="none" stroke="#c9a96e" stroke-width="2"/>
          <path d="M14 27 l8 8 l16-16" fill="none" stroke="#c9a96e" stroke-width="2.5"
                stroke-linecap="round" stroke-linejoin="round"
                class="checkmark-path"/>
        </svg>
      </div>
      <h2>Commande confirmée</h2>
      <p>Votre véhicule est en route.<br/>Un conseiller vous contactera sous 24 h pour organiser la livraison.</p>
      <a href="index.html" class="btn-home">Retour à l'accueil</a>
    </div>
  `;

  // Inline styles so it works without touching paiement.css
  overlay.style.cssText = `
    position: fixed; inset: 0;
    background: rgba(10,10,10,.85);
    backdrop-filter: blur(6px);
    display: flex; align-items: center; justify-content: center;
    z-index: 9999;
    animation: fadeIn .35s ease;
  `;

  const style = document.createElement("style");
  style.textContent = `
    @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
    @keyframes slideUp { from { opacity:0; transform:translateY(24px) } to { opacity:1; transform:translateY(0) } }
    @keyframes drawCheck { to { stroke-dashoffset: 0 } }

    #successOverlay .success-box {
      background: #0e0e0e;
      border: 1px solid #2a2a2a;
      border-radius: 4px;
      padding: 56px 48px;
      text-align: center;
      max-width: 420px;
      width: 90%;
      animation: slideUp .45s ease .1s both;
    }
    #successOverlay .success-icon { margin-bottom: 28px; }
    #successOverlay .checkmark-path {
      stroke-dasharray: 45;
      stroke-dashoffset: 45;
      animation: drawCheck .5s ease .4s forwards;
    }
    #successOverlay h2 {
      font-family: 'Playfair Display', serif;
      font-size: 1.6rem;
      font-weight: 600;
      color: #f0ece4;
      margin: 0 0 12px;
      letter-spacing: .03em;
    }
    #successOverlay p {
      font-family: 'Source Sans 3', sans-serif;
      color: #888;
      font-size: .95rem;
      line-height: 1.6;
      margin: 0 0 36px;
    }
    #successOverlay .btn-home {
      display: inline-block;
      padding: 12px 32px;
      background: #c9a96e;
      color: #0e0e0e;
      font-family: 'Source Sans 3', sans-serif;
      font-weight: 600;
      font-size: .875rem;
      letter-spacing: .08em;
      text-transform: uppercase;
      text-decoration: none;
      border-radius: 2px;
      transition: background .2s;
    }
    #successOverlay .btn-home:hover { background: #b8944f; }

    /* Validation styles */
    .input-error {
      border-color: #e05252 !important;
      outline-color: #e05252 !important;
    }
    .field-error {
      display: block;
      margin-top: 4px;
      font-size: .78rem;
      color: #e05252;
      font-family: 'Source Sans 3', sans-serif;
    }
  `;
  document.head.appendChild(style);
  document.body.appendChild(overlay);
}

// ── Pay button ───────────────────────────────────────────────

const payBtn = document.querySelector(".btn[type='button']");
if (payBtn) {
  payBtn.addEventListener("click", async () => {
    if (!validateFields()) return;

    payBtn.textContent = "Traitement…";
    payBtn.disabled = true;

    try {
      await decrementStock();
    } catch (e) {
      console.error("Stock decrement error:", e);
      // Non-blocking — still show success even if API fails
    }

    showSuccess();
  });
}