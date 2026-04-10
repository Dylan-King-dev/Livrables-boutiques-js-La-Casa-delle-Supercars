console.log('Script produit.js loaded');

const params = new URLSearchParams(window.location.search);
const productId = params.get("id") || "porsche-gt3rs";
console.log('productId:', productId);

function getImagePath(product) {
    const modelName = product.ref.replace('Réf. ', '').replace('/', '_').toUpperCase();
    const color = product.couleur_principale || 'Noir';
    if (product.marque === 'Maserati') {
        const colorUpper = color.toUpperCase();
        return `../assets/img/maserati/${product.categorie_nom}/${modelName}/${modelName}_AVANT_${colorUpper}.jpg`;
    } else if (product.marque === 'Porsche') {
        const modelFolder = product.nom.replace(new RegExp(`^${product.marque}\\s+`, 'i'), '');
        return `../assets/img/porsche/colours/${product.categorie_nom}/${modelFolder}/${color}.jpg`;
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
        return `../assets/img/porsche/colours/${apiProduct.categorie_nom}/${modelFolder}/${color}.jpg`;
    } else {
        return '../assets/img/maserati/Maserati-index.png';
    }
}

function adaptProductFromAPI(apiProduct) {
    const colors = [];
    const primaryColor = apiProduct.couleur_principale || 'Noir';
    const secondaryColor = apiProduct.couleur_secondaire;

    // Primary color
    const primaryImagePath = getImagePath({ ...apiProduct, couleur_principale: primaryColor });
    colors.push({
        key: primaryColor.toLowerCase(),
        label: primaryColor,
        swatch: getSwatchPath(apiProduct, primaryColor),
        images: [
            primaryImagePath,
            primaryImagePath.replace('_AVANT_', '_COTER_'),
            primaryImagePath.replace('_AVANT_', '_ARRIERE_')
        ],
    });

    // Secondary color if exists
    if (secondaryColor) {
        const secondaryImagePath = getImagePath({ ...apiProduct, couleur_principale: secondaryColor });
        colors.push({
            key: secondaryColor.toLowerCase(),
            label: secondaryColor,
            swatch: getSwatchPath(apiProduct, secondaryColor),
            images: [
                secondaryImagePath,
                secondaryImagePath.replace('_AVANT_', '_COTER_'),
                secondaryImagePath.replace('_AVANT_', '_ARRIERE_')
            ],
        });
    }

    return {
        id: apiProduct.id,
        name: apiProduct.nom,
        short: apiProduct.nom.replace(apiProduct.marque + ' ', ''),
        brand: apiProduct.marque,
        ref: apiProduct.ref,
        badge: apiProduct.categorie_nom,
        price: apiProduct.prix + ' €',
        availability: apiProduct.stock > 0 ? 'Disponible' : 'Sur demande',
        specs: {
            power: 'N/A',
            zeroTo100: 'N/A',
            drive: 'N/A',
            edition: 'N/A',
        },
        description: apiProduct.description,
        image: primaryImagePath,
        colors: colors,
    };
}

let product;

console.log('Is numeric:', /^\d+$/.test(productId));

if (/^\d+$/.test(productId)) {
    console.log('Fetching from API for id:', productId);
    fetch(`http://localhost:3000/api/produits/${productId}`)
        .then(response => {
            console.log('Response status:', response.status);
            if (!response.ok) throw new Error('Product not found');
            return response.json();
        })
        .then(apiProduct => {
            console.log('API product:', apiProduct);
            product = adaptProductFromAPI(apiProduct);
            console.log('Adapted product:', product);
            initializePage();
        })
        .catch(error => {
            console.error('Error fetching product:', error);
            product = getProduct("porsche-gt3rs");
            initializePage();
        });
} else {
    console.log('Using static product:', productId);
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

let index = 0;
let touchStartX = 0;
let touchDeltaX = 0;
let viewerIndex = 0;
let viewerImages = [];
let isPaused = false;
let continuousMode = true;

// Met a jour l'aperçu plein écran.
const updateViewer = (nextIndex) => {
  if (!viewerImg || !viewerImages.length) return;
  viewerIndex = (nextIndex + viewerImages.length) % viewerImages.length;
  const src = viewerImages[viewerIndex];
  viewerImg.src = src;
  viewerImg.alt = viewerCaption ? viewerCaption.textContent : viewerImg.alt;
  if (viewerCaption) viewerCaption.textContent = viewerImg.alt;
  if (viewerIndicators) {
    Array.from(viewerIndicators.querySelectorAll("button")).forEach((dot, i) => {
      dot.classList.toggle("active", i === viewerIndex);
    });
  }
};

// Ouvre l'aperçu plein écran de l'image sélectionnée.
const openViewer = (images, startIndex) => {
  if (!imageViewer || !viewerImg) return;
  viewerImages = images.slice();
  viewerIndex = startIndex || 0;
  const alt = viewerImg.alt || "";
  if (viewerIndicators) {
    viewerIndicators.innerHTML = "";
    viewerImages.forEach((_, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.setAttribute("aria-label", `Aller à l'image ${i + 1}`);
      if (i === viewerIndex) btn.classList.add("active");
      btn.addEventListener("click", () => updateViewer(i));
      viewerIndicators.appendChild(btn);
    });
  }
  updateViewer(viewerIndex);
  if (viewerCaption && alt) viewerCaption.textContent = alt;
  imageViewer.classList.add("open");
  imageViewer.setAttribute("aria-hidden", "false");
  document.body.classList.add("viewer-open");
};

// Ferme l'aperçu plein écran.
const closeViewer = () => {
  if (!imageViewer || !viewerImg) return;
  imageViewer.classList.remove("open");
  imageViewer.setAttribute("aria-hidden", "true");
  document.body.classList.remove("viewer-open");
  viewerImg.src = "";
  if (viewerCaption) viewerCaption.textContent = "";
  viewerImages = [];
};

// Met a jour la position du carrousel et l'indicateur actif.
const updateCarousel = (nextIndex) => {
  if (continuousMode) return;
  index = (nextIndex + indicators.length) % indicators.length;
  track.style.transform = `translateX(-${index * 100}%)`;
  indicators.forEach((dot, i) => dot.classList.toggle("active", i === index));
};


// Remplace les images du carrousel pour la couleur selectionnee.
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
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openViewer(resolved, i % resolved.length);
      }
    };
    slide.appendChild(img);
    track.appendChild(slide);
  });
  track.style.setProperty("--slides", band.length);
  track.classList.add("is-continuous");
  track.classList.remove("is-paused");
  if (pauseBtn) {
    pauseBtn.textContent = "Ⅱ";
    pauseBtn.setAttribute("aria-pressed", "false");
  }
  if (prevBtn) prevBtn.disabled = true;
  if (nextBtn) nextBtn.disabled = true;
  const indicatorsWrap = document.getElementById("carouselIndicators");
  if (indicatorsWrap) indicatorsWrap.classList.add("is-hidden");
};

// Affiche les options de couleur et branche les clics.
const renderColors = () => {
  colorOptions.innerHTML = "";
  const colors = product.colors || [{ key: "default", label: "Standard", images: [product.image] }];
  // Cree un bouton pour chaque couleur disponible.
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
    // Change les images du carrousel quand une couleur est choisie.
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

// Rafraichit l'icone des favoris selon le localStorage.
const refreshFavState = () => {
  const favs = getList(STORAGE_KEYS.favs);
  const isFav = favs.includes(product.id);
  toggleFavBtn.style.color = isFav ? "#2a2f36" : "inherit";
  toggleFavBtn.classList.toggle("is-active", isFav);
  toggleFavBtn.setAttribute("aria-pressed", isFav ? "true" : "false");
  toggleFavBtn.setAttribute("aria-label", isFav ? "Retirer des favoris" : "Ajouter aux favoris");
};

if (productBadge) productBadge.textContent = product.badge || product.short || product.brand || "Signature";
productTitle.textContent = product.name;
productRef.textContent = `Réf. ${product.ref || product.id}`;
if (productDesc) {
  productDesc.textContent = product.description || `${product.brand} — série limitée, préparée sur mesure.`;
}
if (productPrice) {
  productPrice.textContent = product.price || "Sur devis";
}
if (productAvailability) {
  productAvailability.textContent = product.availability || "Disponible";
  productAvailability.classList.remove("is-limited", "is-demand");
  if (productAvailability.textContent.toLowerCase().includes("limité") || productAvailability.textContent.toLowerCase().includes("série")) {
    productAvailability.classList.add("is-limited");
  }
  if (productAvailability.textContent.toLowerCase().includes("demande") || productAvailability.textContent.toLowerCase().includes("précommande")) {
    productAvailability.classList.add("is-demand");
  }
}
if (specPower) specPower.textContent = (product.specs && product.specs.power) || "—";
if (specZero) specZero.textContent = (product.specs && product.specs.zeroTo100) || "—";
if (specDrive) specDrive.textContent = (product.specs && product.specs.drive) || "—";
if (specEdition) specEdition.textContent = (product.specs && product.specs.edition) || "Signature";

renderColors();
refreshFavState();

// Va a l'image precedente.
if (prevBtn) prevBtn.addEventListener("click", () => updateCarousel(index - 1));
// Va a l'image suivante.
if (nextBtn) nextBtn.addEventListener("click", () => updateCarousel(index + 1));
if (pauseBtn) {
  pauseBtn.addEventListener("click", () => {
    isPaused = !isPaused;
    pauseBtn.setAttribute("aria-pressed", isPaused ? "true" : "false");
    pauseBtn.setAttribute("aria-label", isPaused ? "Reprendre" : "Mettre en pause");
    pauseBtn.textContent = isPaused ? "▶" : "Ⅱ";
    if (track) {
      track.classList.toggle("is-paused", isPaused);
    }
  });
}
// Ajoute le clic sur chaque indicateur.
indicators.forEach((dot) => {
  // Saute vers l'image correspondante a l'indicateur.
  dot.addEventListener("click", () => updateCarousel(Number(dot.dataset.index)));
});

// Ajoute le produit au panier et affiche une confirmation courte.
addToCartBtn.addEventListener("click", () => {
  addItem(STORAGE_KEYS.cart, product.id);
  addToCartBtn.textContent = "Ajouté";
  addToCartBtn.classList.add("is-added");
  if (statusMessage) statusMessage.textContent = `${product.name} ajouté au panier.`;
  // Retablit le libelle du bouton apres un court delai.
  setTimeout(() => {
    addToCartBtn.textContent = "Ajouter au panier";
    addToCartBtn.classList.remove("is-added");
  }, 1200);
});

if (bookTestBtn) {
  bookTestBtn.addEventListener("click", () => {
    if (statusMessage) {
      statusMessage.textContent = "Un conseiller vous recontactera pour organiser l'essai.";
    }
  });
}

// Bascule le produit dans les favoris.
toggleFavBtn.addEventListener("click", () => {
  toggleItem(STORAGE_KEYS.favs, product.id);
  refreshFavState();
});

// Navigation clavier et gestes tactiles pour le carrousel.
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") updateCarousel(index - 1);
  if (e.key === "ArrowRight") updateCarousel(index + 1);
  if (e.key === "Escape") closeViewer();
});

if (viewerClose) viewerClose.addEventListener("click", closeViewer);
if (viewerPrev) viewerPrev.addEventListener("click", () => updateViewer(viewerIndex - 1));
if (viewerNext) viewerNext.addEventListener("click", () => updateViewer(viewerIndex + 1));
if (imageViewer) {
  imageViewer.addEventListener("click", (e) => {
    if (e.target === imageViewer || e.target === viewerImg) closeViewer();
  });
}

track.addEventListener("touchstart", (e) => {
  touchStartX = e.touches[0].clientX;
  touchDeltaX = 0;
});

track.addEventListener("touchmove", (e) => {
  touchDeltaX = e.touches[0].clientX - touchStartX;
});

track.addEventListener("touchend", () => {
  if (Math.abs(touchDeltaX) > 40) {
    updateCarousel(touchDeltaX > 0 ? index - 1 : index + 1);
  }
  touchStartX = 0;
  touchDeltaX = 0;
});

if (topbar) {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 0) {
      topbar.classList.add("is-hidden");
    } else {
      topbar.classList.remove("is-hidden");
    }
  });
}
}
