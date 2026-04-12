console.log('Script panier.js loaded');

// ── Storage Keys ─────────────────────────────────────────────

const STORAGE_KEYS = {
  cart: 'lacasa_cart',
  favs: 'lacasa_favs'
};

// ── Storage utils ────────────────────────────────────────────

const getList = (key) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error('Error reading localStorage:', e);
    return [];
  }
};

const removeItem = (key, item) => {
  try {
    const list = getList(key);
    const index = list.findIndex(i => String(i) === String(item));
    if (index > -1) {
      list.splice(index, 1);
      localStorage.setItem(key, JSON.stringify(list));
    }
  } catch (e) {
    console.error('Error removing item:', e);
  }
};

// ── Image helpers ────────────────────────────────────────────

function normalizePorscheCategory(product) {
  const byModel = {
    'Taycan Turbo GT': 'Electrique',
    'Cayenne E-Hybrid': 'SUV',
    'Cayenne Electric': 'Electrique',
    'Macan': 'SUV',
    'Panamera': 'Classic',
    '911 Carrera RS': 'Sport',
    '718 Spyder RS': 'Sport',
    '718 Cayman GT4 RS': 'Super Sport',
    '911 GT3': 'Super Sport',
    '911 Turbo S': 'Super Sport',
  };
  return byModel[product.nom] || product.categorie_nom || 'Sport';
}

function getImagePath(product) {
  const color = product.couleur_principale || 'Noir';
  const modelFolder = product.nom.replace(new RegExp(`^${product.marque || ''}\\s+`, 'i'), '').trim();
  const ext = (modelFolder.includes('GT4 RS') || modelFolder.includes('Spyder RS')) ? '.webp' : '.jpg';

  if (product.marque === 'Maserati') {
    const modelName = product.nom.toUpperCase().replace(/ /g, '_');
    const colorUpper = color.toUpperCase();
    return `../assets/img/maserati/${product.categorie_nom}/${modelName}/${modelName}_AVANT_${colorUpper}.jpg`;
  }

  if (product.marque === 'Porsche') {
    const category = normalizePorscheCategory(product);
    return `../assets/img/porsche/colours/${category}/${modelFolder}/${modelFolder} ${color}${ext}`;
  }

  return '../assets/img/default.jpg';
}

// ── Price helpers ────────────────────────────────────────────

const formatPrice = (value) => {
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value) + ' €';
};

// ── Adapt API product (WITH DISCOUNT) ────────────────────────

function adaptProductFromAPI(apiProduct) {
  const rawPrice  = Number(apiProduct.prix);
  const reduction = Number(apiProduct.reduction) || 0;

  const finalPrice = reduction > 0
    ? rawPrice * (1 - reduction / 100)
    : rawPrice;

  return {
    id: apiProduct.id,
    name: apiProduct.nom,
    brand: apiProduct.marque,
    image: getImagePath(apiProduct),

    price: formatPrice(finalPrice),
    originalPrice: reduction > 0 ? formatPrice(rawPrice) : null,

    rawPrice: finalPrice,
    reduction: reduction,

    availability: apiProduct.stock > 0
      ? `${apiProduct.stock} en stock`
      : 'Sur demande'
  };
}

// ── DOM refs ─────────────────────────────────────────────────

const listEl       = document.getElementById('itemsList');
const emptyEl      = document.getElementById('emptyState');
const summaryCount = document.getElementById('summaryCount');
const summaryTotal = document.getElementById('summaryTotal');

// ── Render ───────────────────────────────────────────────────

const render = async () => {
  const ids = getList(STORAGE_KEYS.cart);

  listEl.innerHTML = '';

  if (!ids.length) {
  console.log("Panier vide");

  if (emptyEl) {
    emptyEl.style.display = 'grid'; // ✅ show your existing design
  }

  if (listEl) {
    listEl.innerHTML = '';
  }

  if (summaryCount) summaryCount.textContent = '0';
  if (summaryTotal) summaryTotal.textContent = '0 €';

  return;
}

  emptyEl.style.display = 'none';

  let total = 0;

  for (const id of ids) {
    try {
      const res = await fetch(`http://localhost:3000/api/produits/${id}`);
      if (!res.ok) throw new Error('Erreur produit');

      const apiProduct = await res.json();
      const product = adaptProductFromAPI(apiProduct);

      total += product.rawPrice;

      const card = document.createElement('div');
      card.className = 'item-card';

      card.innerHTML = `
        <img src="${product.image}" alt="${product.name}" />

        <div class="item-info">
          <h3>${product.name}</h3>
          <span class="item-brand">${product.brand}</span>

          <div class="item-price-wrapper">
            ${
              product.reduction > 0
                ? `
                <span class="item-price-old">${product.originalPrice}</span>
                <span class="item-price-new">${product.price}</span>
                <span class="item-discount">-${product.reduction}%</span>
              `
                : `<span class="item-price">${product.price}</span>`
            }
          </div>

          <span class="item-stock">${product.availability}</span>
        </div>

        <div class="item-actions">
          <button class="btn-view">Voir</button>
          <button class="btn-remove" data-id="${product.id}">Retirer</button>
        </div>
      `;

      // Navigation
      card.querySelector('img').onclick = () => {
        window.location.href = `produit.html?id=${product.id}`;
      };

      card.querySelector('.btn-view').onclick = () => {
        window.location.href = `produit.html?id=${product.id}`;
      };

      // Remove item
      card.querySelector('.btn-remove').onclick = () => {
        removeItem(STORAGE_KEYS.cart, product.id);
        render();
      };

      listEl.appendChild(card);

    } catch (err) {
      console.error('Erreur chargement produit:', err);
    }
  }

  // ── Summary ────────────────────────────────────────────────

  if (summaryCount) summaryCount.textContent = String(ids.length);
  if (summaryTotal) summaryTotal.textContent = formatPrice(total);

  localStorage.setItem('lacasa_order_total', formatPrice(total));
  localStorage.setItem('lacasa_order_count', String(ids.length));
};

// ── Init ─────────────────────────────────────────────────────

render();