const totalEl = document.getElementById("payTotal");
const countEl = document.getElementById("payCount");

if (countEl) {
  countEl.textContent = localStorage.getItem("lacasa_order_count") || "0";
}
if (totalEl) {
  totalEl.textContent = localStorage.getItem("lacasa_order_total") || "Sur devis";
}

// ── Card number formatting ────────────────────────────────────
const cardNumberInput = document.getElementById("cardNumber");
if (cardNumberInput) {
  cardNumberInput.addEventListener("input", function () {
    let v = this.value.replace(/\D/g, "").slice(0, 16);
    this.value = v.replace(/(.{4})/g, "$1 ").trim();
  });
}

// ── Expiry formatting ─────────────────────────────────────────
const cardExpiryInput = document.getElementById("cardExpiry");
if (cardExpiryInput) {
  cardExpiryInput.addEventListener("input", function () {
    let v = this.value.replace(/\D/g, "").slice(0, 4);
    if (v.length >= 3) v = v.slice(0, 2) + "/" + v.slice(2);
    this.value = v;
  });
}

// ── Address autocomplete (French gov API) ────────────────────
const addressInput = document.getElementById("address");
const cityInput    = document.getElementById("city");
const postalInput  = document.getElementById("postal");

// The suggestions container already exists in the HTML inside .field
const suggestionsContainer = document.getElementById("address-suggestions");

if (addressInput && suggestionsContainer) {
  let debounceTimer;

  addressInput.addEventListener("input", function () {
    clearTimeout(debounceTimer);
    const query = this.value.trim();
    if (query.length < 3) {
      hideSuggestions();
      return;
    }
    debounceTimer = setTimeout(() => fetchSuggestions(query), 300);
  });

  addressInput.addEventListener("blur", function () {
    setTimeout(hideSuggestions, 180);
  });

  function hideSuggestions() {
    suggestionsContainer.classList.remove("visible");
    suggestionsContainer.innerHTML = "";
  }

  function fetchSuggestions(query) {
    fetch(`https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(query)}&limit=5`)
      .then(r => r.json())
      .then(data => {
        suggestionsContainer.innerHTML = "";
        if (data.features?.length) {
          data.features.forEach(feature => {
            const div = document.createElement("div");
            div.className = "suggestion-item";
            div.textContent = feature.properties.label;
            div.addEventListener("mousedown", (e) => {
              e.preventDefault(); // prevent blur from firing before click
              selectSuggestion(feature.properties);
            });
            suggestionsContainer.appendChild(div);
          });
          suggestionsContainer.classList.add("visible");
        } else {
          hideSuggestions();
        }
      })
      .catch(() => hideSuggestions());
  }

  function selectSuggestion(props) {
    addressInput.value = props.name || props.label.split(", ")[0];
    if (cityInput)   cityInput.value   = props.city     || "";
    if (postalInput) postalInput.value = props.postcode || "";
    hideSuggestions();
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
  localStorage.removeItem("lacasa_cart");
  localStorage.removeItem("lacasa_order_total");
  localStorage.removeItem("lacasa_order_count");

  const overlay = document.createElement("div");
  overlay.id = "successOverlay";
  overlay.innerHTML = `
    <div class="success-box">
      <div class="success-icon">
        <svg viewBox="0 0 52 52" width="64" height="64">
          <circle cx="26" cy="26" r="25" fill="none" stroke="#c9a96e" stroke-width="1.5"/>
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

  overlay.style.cssText = `
    position: fixed; inset: 0;
    background: rgba(10,10,10,.88);
    backdrop-filter: blur(8px);
    display: flex; align-items: center; justify-content: center;
    z-index: 9999;
    animation: fadeIn .3s ease;
  `;

  const style = document.createElement("style");
  style.textContent = `
    @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
    @keyframes slideUp { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:translateY(0) } }
    @keyframes drawCheck { to { stroke-dashoffset: 0 } }

    #successOverlay .success-box {
      background: #0e0e0e;
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 20px;
      padding: 56px 48px;
      text-align: center;
      max-width: 420px;
      width: 90%;
      animation: slideUp .4s ease .1s both;
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
      color: #666;
      font-size: .95rem;
      line-height: 1.7;
      margin: 0 0 36px;
    }
    #successOverlay .btn-home {
      display: inline-block;
      padding: 14px 36px;
      background: #c9a96e;
      color: #0e0e0e;
      font-family: 'Source Sans 3', sans-serif;
      font-weight: 600;
      font-size: .8rem;
      letter-spacing: .12em;
      text-transform: uppercase;
      text-decoration: none;
      border-radius: 999px;
      transition: background .2s;
    }
    #successOverlay .btn-home:hover { background: #b8944f; }
  `;
  document.head.appendChild(style);
  document.body.appendChild(overlay);
}

// ── Pay button ───────────────────────────────────────────────

const payBtn = document.querySelector(".btn-pay");
if (payBtn) {
  payBtn.addEventListener("click", async () => {
    if (!validateFields()) return;

    payBtn.textContent = "Traitement…";
    payBtn.disabled = true;

    try {
      await decrementStock();
    } catch (e) {
      console.error("Stock decrement error:", e);
    }

    showSuccess();
  });
}