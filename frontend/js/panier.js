console.log('Script panier.js loaded');

// Storage Keys
const STORAGE_KEYS = {
  cart: 'lacasa_cart',
  favs: 'lacasa_favs'
};

// Storage utility functions
const getList = (key) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error('Error reading from localStorage:', e);
    return [];
  }
};

const removeItem = (key, item) => {
  try {
    const list = getList(key);
    // Use String comparison to handle number/string mismatch
    const index = list.findIndex(i => String(i) === String(item));
    if (index > -1) {
      list.splice(index, 1);
      localStorage.setItem(key, JSON.stringify(list));
    }
  } catch (e) {
    console.error('Error removing item from localStorage:', e);
  }
};

// ── Image helpers ────────────────────────────────────────────

function normalizePorscheCategory(product) {
  const byModel = {
    'Taycan Turbo GT':   'Electrique',
    'Cayenne E-Hybrid':  'SUV',
    'Cayenne Electric':  'Electrique',
    'Macan':             'SUV',
    'Panamera':          'Classic',
    '911 Carrera RS':    'Sport',
    '718 Spyder RS':     'Sport',
    '718 Cayman GT4 RS': 'Super Sport',
    '911 GT3':           'Super Sport',
    '911 Turbo S':       'Super Sport',
  };
  return byModel[product.nom] || product.categorie_nom || 'Sport';
}

function getImagePath(product) {
  const color = product.couleur_principale || 'Noir';
  const modelFolder = product.nom
    .replace(new RegExp(`^${product.marque || ''}\\s+`, 'i'), '')
    .trim();
  const ext = (modelFolder.includes('GT4 RS') || modelFolder.includes('Spyder RS'))
    ? '.webp' : '.jpg';

  if (product.marque === 'Maserati') {
    const modelName  = product.nom.toUpperCase().replace(/ /g, '_');
    const colorUpper = color.toUpperCase();
    return `../assets/img/maserati/${product.categorie_nom}/${modelName}/${modelName}_AVANT_${colorUpper}.jpg`;
  } else if (product.marque === 'Porsche') {
    const category = normalizePorscheCategory(product);
    return `../assets/img/porsche/colours/${category}/${modelFolder}/${modelFolder} ${color}${ext}`;
  } else {
    return '../assets/img/maserati/Maserati-index.png';
  }
}

// ── Price helpers ────────────────────────────────────────────

const formatPrice = (value) => {
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value) + ' €';
};

// ── Adapt API product ────────────────────────────────────────

function adaptProductFromAPI(apiProduct) {
  const primaryColor     = apiProduct.couleur_principale || 'Noir';
  const primaryImagePath = getImagePath({ ...apiProduct, couleur_principale: primaryColor });
  const rawPrice         = Number(apiProduct.prix);  // e.g. 125000

  return {
    id:           apiProduct.id,
    name:         apiProduct.nom,
    brand:        apiProduct.marque,
    ref:          apiProduct.ref,
    badge:        apiProduct.categorie_nom,
    price:        formatPrice(rawPrice),             // "125 000,00 €"
    rawPrice:     rawPrice,
    availability: apiProduct.stock > 0 ? `${apiProduct.stock} en stock` : 'Sur demande',
    stock:        apiProduct.stock,
    specs: {
      power:     apiProduct.puissance + ' ch',
      zeroTo100: apiProduct.zero_a_cent + ' s',
      drive:     apiProduct.annee,
      edition:   apiProduct.ref,
    },
    description: apiProduct.description,
    image:       primaryImagePath,
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
  listEl.className = 'items';
  listEl.innerHTML = '';

  if (!ids.length) {
    emptyEl.style.display = 'grid';
    if (summaryCount) summaryCount.textContent = '0';
    if (summaryTotal) summaryTotal.textContent = '0 €';
    return;
  }

  emptyEl.style.display = 'none';

  let total    = 0;
  let hasDevis = false;

  for (const id of ids) {
    try {
      const response = await fetch(`http://localhost:3000/api/produits/${id}`);
      if (!response.ok) throw new Error('Product not found');
      const apiProduct = await response.json();
      const product    = adaptProductFromAPI(apiProduct);

      // Accumulate total using rawPrice (already a clean number)
      if (product.rawPrice && product.rawPrice > 0) {
        total += product.rawPrice;
      } else {
        hasDevis = true;
      }

      const card = document.createElement('div');
      card.className = 'item-card';
      card.innerHTML = `
        <img src="${product.image}" alt="${product.name}" />
        <div class="item-info">
          <h3>${product.name}</h3>
          <span class="item-brand">${product.brand}</span>
          <span class="item-price">${product.price}</span>
          <span class="item-stock">${product.availability}</span>
        </div>
        <div class="item-actions">
          <button class="btn-view"   type="button">Voir</button>
          <button class="btn-remove" type="button" data-id="${product.id}">Retirer</button>
        </div>
      `;

      card.querySelector('img').addEventListener('click', () => {
        window.location.href = `produit.html?id=${product.id}`;
      });

      card.querySelector('.btn-view').addEventListener('click', () => {
        window.location.href = `produit.html?id=${product.id}`;
      });

      card.querySelector('.btn-remove').addEventListener('click', () => {
        removeItem(STORAGE_KEYS.cart, product.id);
        render();
      });

      listEl.appendChild(card);
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
    }
  }

  // Update summary
  const totalText = hasDevis ? 'Sur devis' : formatPrice(total);
  if (summaryCount) summaryCount.textContent = String(ids.length);
  if (summaryTotal) summaryTotal.textContent = totalText;

  // Persist for checkout
  localStorage.setItem('lacasa_order_total', totalText);
  localStorage.setItem('lacasa_order_count', String(ids.length));
};

render();