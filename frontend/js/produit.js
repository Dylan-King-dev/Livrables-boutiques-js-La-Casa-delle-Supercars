console.log('Script produit.js loaded');

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

const addItem = (key, item) => {
  try {
    const list = getList(key);
    list.push(item);
    localStorage.setItem(key, JSON.stringify(list));
  } catch (e) {
    console.error('Error writing to localStorage:', e);
  }
};

const toggleItem = (key, item) => {
  try {
    const list = getList(key);
    const index = list.findIndex(i => String(i) === String(item));
    if (index > -1) {
      list.splice(index, 1);
    } else {
      list.push(item);
    }
    localStorage.setItem(key, JSON.stringify(list));
  } catch (e) {
    console.error('Error toggling item in localStorage:', e);
  }
};

const countInCart = (productId) => {
  const list = getList(STORAGE_KEYS.cart);
  return list.filter(i => String(i) === String(productId)).length;
};

const params = new URLSearchParams(window.location.search);
const productId = params.get("id") || "porsche-gt3rs";
console.log('productId:', productId);

function normalizePorscheCategory(product) {
  const byModel = {
    'Taycan Turbo GT': 'Electrique',
    'Cayenne E-Hybrid': 'SUV',
    'Cayenne Electric': 'SUV',
    'Macan': 'SUV',
    'Panamera': 'Classic',
    '911 Carrera RS': 'Sport',
    '718 Spyder RS': 'Sport',
    '718 Cayman GT4 RS': 'Super Sport',
    '911 GT3': 'Super Sport',
    '911 Turbo S': 'Super Sport',
  };

  return byModel[product.nom] || product.categorie_nom;
}

function normalizePorscheColor(color) {
  const map = {
    'Bleu Metal': 'Bleu metal',
    'Vert': 'Oak Green',
    'Marron': 'Burgundy',
    'Jaune': 'Speedyellow',
    'Gris': 'gris',
  };

  return map[color] || color;
}

function getImagePath(product) {
    const modelName = product.ref.replace('Réf. ', '').replace('/', '_').toUpperCase();
    const color = product.couleur_principale || 'Noir';
    if (product.marque === 'Maserati') {
        const colorUpper = color.toUpperCase();
        return `../assets/img/maserati/${product.categorie_nom}/${modelName}/${modelName}_AVANT_${colorUpper}.jpg`;
    } else if (product.marque === 'Porsche') {
        const modelFolder = product.nom.replace(new RegExp(`^${product.marque}\\s+`, 'i'), '');
    const category = normalizePorscheCategory(product);
    const normalizedColor = normalizePorscheColor(color);
    return `../assets/img/porsche/colours/${category}/${modelFolder}/${normalizedColor}.jpg`;
    } else {
        return '../assets/img/maserati/Maserati-index.png';
    }
}

function getSwatchPath(apiProduct, color) {
    const modelName = apiProduct.ref.replace('Réf. ', '').replace('/', '_').toUpperCase();
    if (apiProduct.marque === 'Maserati') {
        const swatchColor = color === 'Noir' ? 'NOIR' : color;
        return `../assets/img/maserati/${apiProduct.categorie_nom}/${modelName}/icon/menu_icon_${swatchColor}.jpg`;
    } else if (apiProduct.marque === 'Porsche') {
        const modelFolder = apiProduct.nom.replace(new RegExp(`^${apiProduct.marque}\\s+`, 'i'), '');
    const category = normalizePorscheCategory(apiProduct);
    const normalizedColor = normalizePorscheColor(color);
    return `../assets/img/porsche/colours/${category}/${modelFolder}/${normalizedColor}.jpg`;
    } else {
        return '../assets/img/maserati/Maserati-index.png';
    }
}

function adaptProductFromAPI(apiProduct) {
  const colors = [];
  const primaryColor = apiProduct.couleur_principale || 'Noir';
  const secondaryColor = apiProduct.couleur_secondaire;
  const reduction = Number(apiProduct.reduction) || 0;
  const prixOriginal = Number(apiProduct.prix);
  const prixReduit = reduction > 0 ? prixOriginal * (1 - reduction / 100) : null;

  const buildImages = (color) => {
    const imagePath = getImagePath({ ...apiProduct, couleur_principale: color });
    if (apiProduct.marque === 'Porsche') {
      const ext = imagePath.includes('.webp') ? '.webp' : '.jpg';
      const base = imagePath.replace(ext, '');
      return [imagePath, `${base}(1)${ext}`, `${base}(2)${ext}`];
    } else {
      return [
        imagePath,
        imagePath.replace('_AVANT_', '_COTER_'),
        imagePath.replace('_AVANT_', '_ARRIERE_'),
      ];
    }
  };

  const primaryImages = buildImages(primaryColor);
  colors.push({
    key: primaryColor.toLowerCase(),
    label: primaryColor,
    swatch: getSwatchPath(apiProduct, primaryColor),
    images: primaryImages,
  });

  if (secondaryColor) {
    const secondaryImages = buildImages(secondaryColor);
    colors.push({
      key: secondaryColor.toLowerCase(),
      label: secondaryColor,
      swatch: getSwatchPath(apiProduct, secondaryColor),
      images: secondaryImages,
    });
  }

  return {
    id: apiProduct.id,
    name: apiProduct.nom,
    short: apiProduct.nom.replace(apiProduct.marque + ' ', ''),
    brand: apiProduct.marque,
    ref: apiProduct.ref,
    badge: apiProduct.categorie_nom,
    reduction: reduction,
    prixOriginal: prixOriginal,
    prixReduit: prixReduit,
    price: prixReduit
      ? new Intl.NumberFormat('fr-FR').format(prixReduit) + ' €'
      : new Intl.NumberFormat('fr-FR').format(prixOriginal) + ' €',
    priceOriginalFormatted: new Intl.NumberFormat('fr-FR').format(prixOriginal) + ' €',
    availability: apiProduct.stock > 0 ? `${apiProduct.stock} en stock` : 'Sur demande',
    stock: Number(apiProduct.stock),
    specs: {
      power: apiProduct.puissance + ' ch',
      zeroTo100: apiProduct.zero_a_cent + ' s',
      drive: apiProduct.annee,
      edition: apiProduct.ref
    },
    description: apiProduct.description,
    image: primaryImages[0],
    colors: colors,
  };
}

let product;

const getProduct = (id) => {
  return {
    id: 1,
    name: 'Produit',
    short: 'Produit',
    brand: 'Marque',
    ref: 'REF-001',
    badge: 'Standard',
    reduction: 0,
    prixOriginal: 0,
    prixReduit: null,
    price: 'Sur devis',
    priceOriginalFormatted: 'Sur devis',
    availability: 'Disponible',
    stock: 0,
    specs: { power: 'N/A', zeroTo100: 'N/A', drive: 'N/A', edition: 'N/A' },
    description: 'Description du produit',
    image: '../assets/img/maserati/Maserati-index.png',
    colors: [{
      key: 'default',
      label: 'Standard',
      images: ['../assets/img/maserati/Maserati-index.png', '../assets/img/maserati/Maserati-index.png', '../assets/img/maserati/Maserati-index.png']
    }]
  };
};

if (/^\d+$/.test(productId)) {
  fetch(`http://localhost:3000/api/produits/${productId}`)
    .then(response => {
      if (!response.ok) throw new Error('Product not found');
      return response.json();
    })
    .then(apiProduct => {
      product = adaptProductFromAPI(apiProduct);
      initializePage();
    })
    .catch(error => {
      console.error('Error fetching product:', error);
      product = getProduct("porsche-gt3rs");
      initializePage();
    });
} else {
  product = getProduct(productId);
  initializePage();
}

function initializePage() {

  const track = document.getElementById("carouselTrack");
  const prevBtn = document.getElementById("prevSlide");
  const nextBtn = document.getElementById("nextSlide");
  const pauseBtn = document.getElementById("pauseSlides");
  const indicators = Array.from(document.querySelectorAll("#carouselIndicators button"));
  const colorOptions = document.getElementById("colorOptions");
  const colorLabel = document.getElementById("colorLabel");
  const productBadge = document.getElementById("productBadge");
  const productTitle = document.getElementById("productTitle");
  const productRef = document.getElementById("productRef");
  const productDesc = document.getElementById("productDesc");
  const productPrice = document.getElementById("productPrice");
  const productAvailability = document.getElementById("productAvailability");
  const specPower = document.getElementById("specPower");
  const specZero = document.getElementById("specZero");
  const specDrive = document.getElementById("specDrive");
  const specEdition = document.getElementById("specEdition");
  const addToCartBtn = document.getElementById("addToCart");
  const bookTestBtn = document.getElementById("bookTest");
  const toggleFavBtn = document.getElementById("toggleFav");
  const statusMessage = document.getElementById("statusMessage");
  const imageViewer = document.getElementById("imageViewer");
  const viewerImg = document.getElementById("viewerImg");
  const viewerClose = document.getElementById("viewerClose");
  const viewerCaption = document.getElementById("viewerCaption");
  const viewerPrev = document.getElementById("viewerPrev");
  const viewerNext = document.getElementById("viewerNext");
  const viewerIndicators = document.getElementById("viewerIndicators");
  const topbar = document.querySelector(".topbar");
  const qtyInput = document.getElementById("qtyInput");
  const qtyPlus = document.getElementById("qtyPlus");
  const qtyMinus = document.getElementById("qtyMinus");

  let touchStartX = 0;
  let touchDeltaX = 0;
  let viewerIndex = 0;
  let viewerImages = [];
  let isPaused = false;
  let continuousMode = true;
  let index = 0;

  // ── Viewer ───────────────────────────────────────────────

  const updateViewer = (nextIndex) => {
    if (!viewerImg || !viewerImages.length) return;
    viewerIndex = (nextIndex + viewerImages.length) % viewerImages.length;
    viewerImg.src = viewerImages[viewerIndex];
    if (viewerIndicators) {
      Array.from(viewerIndicators.querySelectorAll("button")).forEach((dot, i) => {
        dot.classList.toggle("active", i === viewerIndex);
      });
    }
  };

  const openViewer = (images, startIndex) => {
    if (!imageViewer || !viewerImg) return;
    viewerImages = images.slice();
    viewerIndex = startIndex || 0;
    if (viewerIndicators) {
      viewerIndicators.innerHTML = "";
      viewerImages.forEach((_, i) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.setAttribute("aria-label", `Aller à l'image ${i + 1}`);
        if (i === viewerIndex) btn.classList.add("active");
        btn.addEventListener("click", (e) => { e.preventDefault(); e.stopPropagation(); updateViewer(i); });
        viewerIndicators.appendChild(btn);
      });
    }
    updateViewer(viewerIndex);
    imageViewer.classList.add("open");
    imageViewer.setAttribute("aria-hidden", "false");
    document.body.classList.add("viewer-open");
  };

  const closeViewer = () => {
    if (!imageViewer || !viewerImg) return;
    imageViewer.classList.remove("open");
    imageViewer.setAttribute("aria-hidden", "true");
    document.body.classList.remove("viewer-open");
    viewerImg.src = "";
    if (viewerCaption) viewerCaption.textContent = "";
    viewerImages = [];
  };

  // ── Carousel ─────────────────────────────────────────────

  const updateCarousel = (nextIndex) => {
    if (continuousMode) return;
    index = (nextIndex + indicators.length) % indicators.length;
    track.style.transform = `translateX(-${index * 100}%)`;
    indicators.forEach((dot, i) => dot.classList.toggle("active", i === index));
  };

  const setSlides = (images, label) => {
    const resolved = images.map((src) => src || product.image);
    const band = resolved.concat(resolved);
    track.innerHTML = "";
    band.forEach((src, i) => {
      const slide = document.createElement("div");
      slide.className = "carousel-slide";
      const img = document.createElement("img");
      img.src = src;
      img.alt = `${product.name} - ${label} - vue ${((i % resolved.length) + 1)}`;
      img.loading = i === 0 ? "eager" : "lazy";
      img.tabIndex = 0;
      img.setAttribute("role", "button");
      img.setAttribute("aria-label", `Agrandir ${img.alt}`);
      img.onclick = () => openViewer(resolved, i % resolved.length);
      img.onkeydown = (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openViewer(resolved, i % resolved.length); }
      };
      slide.appendChild(img);
      track.appendChild(slide);
    });
    track.style.setProperty("--slides", band.length);
    track.classList.add("is-continuous");
    track.classList.remove("is-paused");
    if (pauseBtn) { pauseBtn.textContent = "Ⅱ"; pauseBtn.setAttribute("aria-pressed", "false"); }
    if (prevBtn) prevBtn.disabled = true;
    if (nextBtn) nextBtn.disabled = true;
    const indicatorsWrap = document.getElementById("carouselIndicators");
    if (indicatorsWrap) indicatorsWrap.classList.add("is-hidden");
  };

  // ── Colors ───────────────────────────────────────────────

  const renderColors = () => {
    colorOptions.innerHTML = "";
    const colors = product.colors || [{ key: "default", label: "Standard", images: [product.image] }];
    colors.forEach((color, idx) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.dataset.color = color.key;
      btn.setAttribute("aria-pressed", idx === 0 ? "true" : "false");
      if (idx === 0) btn.classList.add("active");

      if (color.swatch) {
        const swatch = document.createElement("span");
        swatch.className = "color-swatch";
        const img = document.createElement("img");
        img.src = color.swatch;
        img.alt = color.label;
        swatch.appendChild(img);
        btn.appendChild(swatch);
      }

      btn.appendChild(document.createTextNode(color.label));
      btn.addEventListener("click", () => {
        Array.from(colorOptions.querySelectorAll("button")).forEach((b) => {
          b.classList.remove("active");
          b.setAttribute("aria-pressed", "false");
        });
        btn.classList.add("active");
        btn.setAttribute("aria-pressed", "true");
        colorLabel.textContent = color.label;
        setSlides(color.images || [product.image], color.label);
      });
      colorOptions.appendChild(btn);
    });
    const firstColor = colors[0];
    colorLabel.textContent = firstColor.label;
    setSlides(firstColor.images || [product.image], firstColor.label);
  };

  // ── Favs ─────────────────────────────────────────────────

  const refreshFavState = () => {
    const favs = getList(STORAGE_KEYS.favs);
    const isFav = favs.some(i => String(i) === String(product.id));
    toggleFavBtn.style.color = isFav ? "#2a2f36" : "inherit";
    toggleFavBtn.classList.toggle("is-active", isFav);
    toggleFavBtn.setAttribute("aria-pressed", isFav ? "true" : "false");
    toggleFavBtn.setAttribute("aria-label", isFav ? "Retirer des favoris" : "Ajouter aux favoris");
  };

  // ── Populate page ─────────────────────────────────────────

  if (productBadge) {
    productBadge.textContent = product.badge || product.short || product.brand || "Signature";

    // Discount badge top-right of the card-top area
    if (product.reduction > 0) {
      const existingBadge = document.getElementById('discountBadge');
      if (!existingBadge) {
        const discountBadge = document.createElement('span');
        discountBadge.id = 'discountBadge';
        discountBadge.textContent = `-${product.reduction}%`;
        discountBadge.style.cssText = `
          display: inline-block;
          background: #c9a96e;
          color: #0e0e0e;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 2px;
          letter-spacing: 0.06em;
          margin-left: auto;
        `;
        // Insert after badge in the card-top row
        productBadge.insertAdjacentElement('afterend', discountBadge);
      }
    }
  }

  if (productTitle) productTitle.textContent = product.name;
  if (productRef) productRef.textContent = `Réf. ${product.ref || product.id}`;
  if (productDesc) productDesc.textContent = product.description || `${product.brand} — série limitée, préparée sur mesure.`;

  // ── Price with reduction ──────────────────────────────────
  if (productPrice) {
    if (product.reduction > 0) {
      productPrice.innerHTML = `
        <span style="text-decoration:line-through;color:#666;font-size:0.85em;margin-right:8px;">${product.priceOriginalFormatted}</span><span style="color:#c9a96e;font-weight:600;">${product.price}</span>
      `;
    } else {
      productPrice.textContent = product.price || "Sur devis";
    }
  }

  if (specPower) specPower.textContent = product.specs?.power || "—";
  if (specZero) specZero.textContent = product.specs?.zeroTo100 || "—";
  if (specDrive) specDrive.textContent = product.specs?.drive || "—";
  if (specEdition) specEdition.textContent = product.specs?.edition || "—";

  if (productAvailability) {
    productAvailability.textContent = product.availability || "Disponible";
    productAvailability.classList.remove("is-limited", "is-demand");
    if (productAvailability.textContent.toLowerCase().includes("limité")) productAvailability.classList.add("is-limited");
    if (productAvailability.textContent.toLowerCase().includes("demande")) productAvailability.classList.add("is-demand");
  }

  renderColors();
  refreshFavState();

  // ── Add to cart ───────────────────────────────────────────
  if (qtyInput && qtyPlus && qtyMinus) {
    qtyPlus.addEventListener("click", () => {
      qtyInput.value = Number(qtyInput.value) + 1;
    });

    qtyMinus.addEventListener("click", () => {
      if (Number(qtyInput.value) > 1) {
        qtyInput.value = Number(qtyInput.value) - 1;
      }
    });
  }

  if (addToCartBtn) {
  addToCartBtn.addEventListener("click", () => {
    const qtyToAdd = Number(qtyInput?.value) || 1;
    const alreadyInCart = countInCart(product.id);

    console.log('stock:', product.stock, 'alreadyInCart:', alreadyInCart, 'qtyToAdd:', qtyToAdd);

    // ❌ Out of stock OR already max
    if (product.stock === 0 || alreadyInCart >= product.stock) {
      const msg = "Rupture de stock";
      const detail = `${product.name} n'est plus disponible.`;

      addToCartBtn.textContent = msg;
      addToCartBtn.classList.add("is-unavailable");

      if (statusMessage) statusMessage.textContent = detail;

      setTimeout(() => {
        addToCartBtn.textContent = "Ajouter au panier";
        addToCartBtn.classList.remove("is-unavailable");
      }, 2000);

      return;
    }

    // dépasse le stock
    if (alreadyInCart + qtyToAdd > product.stock) {
      const remaining = product.stock - alreadyInCart;

      addToCartBtn.textContent = `Max ${remaining}`;

      if (statusMessage) {
        statusMessage.textContent = `Vous pouvez encore ajouter ${remaining} exemplaire(s).`;
      }

      setTimeout(() => {
        addToCartBtn.textContent = "Ajouter au panier";
      }, 2000);

      return;
    }

    // Ajouter les items au panier
    for (let i = 0; i < qtyToAdd; i++) {
      addItem(STORAGE_KEYS.cart, product.id);
    }

    console.log('Cart after add:', getList(STORAGE_KEYS.cart));

    addToCartBtn.textContent = "Ajouté ✓";

    if (statusMessage) {
      statusMessage.textContent = `${product.name} ajouté au panier (${qtyToAdd}).`;
    }

    // reset quantity
    if (qtyInput) {
  qtyInput.addEventListener("input", () => {
    let value = Number(qtyInput.value);

    if (value < 1) value = 1;
    if (value > product.stock) value = product.stock;

    qtyInput.value = value;
  });
}

    setTimeout(() => {
      addToCartBtn.textContent = "Ajouter au panier";
    }, 1200);
  });
}


  // ── Favs toggle ───────────────────────────────────────────

  toggleFavBtn.addEventListener("click", () => {
    toggleItem(STORAGE_KEYS.favs, product.id);
    refreshFavState();
  });

  // ── Carousel controls ─────────────────────────────────────

  if (prevBtn) prevBtn.addEventListener("click", () => updateCarousel(index - 1));
  if (nextBtn) nextBtn.addEventListener("click", () => updateCarousel(index + 1));
  if (pauseBtn) {
    pauseBtn.addEventListener("click", () => {
      isPaused = !isPaused;
      pauseBtn.setAttribute("aria-pressed", isPaused ? "true" : "false");
      pauseBtn.setAttribute("aria-label", isPaused ? "Reprendre" : "Mettre en pause");
      pauseBtn.textContent = isPaused ? "▶" : "Ⅱ";
      if (track) track.classList.toggle("is-paused", isPaused);
    });
  }
  indicators.forEach((dot) => {
    dot.addEventListener("click", () => updateCarousel(Number(dot.dataset.index)));
  });

  // ── Viewer controls ───────────────────────────────────────

  if (viewerClose) viewerClose.addEventListener("click", (e) => { e.preventDefault(); e.stopPropagation(); closeViewer(); });
  if (viewerPrev) viewerPrev.addEventListener("click", (e) => { e.preventDefault(); e.stopPropagation(); updateViewer(viewerIndex - 1); });
  if (viewerNext) viewerNext.addEventListener("click", (e) => { e.preventDefault(); e.stopPropagation(); updateViewer(viewerIndex + 1); });
  if (imageViewer) {
    imageViewer.addEventListener("click", (e) => {
      if (e.target === imageViewer || e.target === viewerImg) closeViewer();
    });
  }

  // ── Touch ─────────────────────────────────────────────────

  track.addEventListener("touchstart", (e) => { touchStartX = e.touches[0].clientX; touchDeltaX = 0; });
  track.addEventListener("touchmove", (e) => { touchDeltaX = e.touches[0].clientX - touchStartX; });
  track.addEventListener("touchend", () => {
    if (Math.abs(touchDeltaX) > 40) updateCarousel(touchDeltaX > 0 ? index - 1 : index + 1);
    touchStartX = 0; touchDeltaX = 0;
  });

  // ── Keyboard ──────────────────────────────────────────────

  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") updateCarousel(index - 1);
    if (e.key === "ArrowRight") updateCarousel(index + 1);
    if (e.key === "Escape") closeViewer();
  });

  // ── Topbar scroll ─────────────────────────────────────────

  if (topbar) {
    window.addEventListener("scroll", () => {
      topbar.classList.toggle("is-hidden", window.scrollY > 0);
    });
  }
}