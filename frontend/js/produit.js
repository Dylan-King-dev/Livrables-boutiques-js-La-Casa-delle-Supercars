const params = new URLSearchParams(window.location.search);
const productId = params.get("id") || "porsche-gt3rs";
const product = getProduct(productId);

const track = document.getElementById("carouselTrack");
const prevBtn = document.getElementById("prevSlide");
const nextBtn = document.getElementById("nextSlide");
const indicators = Array.from(document.querySelectorAll("#carouselIndicators button"));
const colorOptions = document.getElementById("colorOptions");
const colorLabel = document.getElementById("colorLabel");
const productShort = document.getElementById("productShort");
const productTitle = document.getElementById("productTitle");
const productRef = document.getElementById("productRef");
const addToCartBtn = document.getElementById("addToCart");
const toggleFavBtn = document.getElementById("toggleFav");

let index = 0;

// Met a jour la position du carrousel et l'indicateur actif.
const updateCarousel = (nextIndex) => {
  index = (nextIndex + indicators.length) % indicators.length;
  track.style.transform = `translateX(-${index * 100}%)`;
  indicators.forEach((dot, i) => dot.classList.toggle("active", i === index));
};

// Remplace les images du carrousel pour la couleur selectionnee.
const setSlides = (images, label) => {
  const slides = Array.from(track.querySelectorAll("img"));
  slides.forEach((img, i) => {
    const src = images[i] || images[0] || product.image;
    img.src = src;
    img.alt = `${product.name} - ${label} - vue ${i + 1}`;
  });
  updateCarousel(0);
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
      Array.from(colorOptions.querySelectorAll("button")).forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
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
  toggleFavBtn.style.color = favs.includes(product.id) ? "#2a2f36" : "inherit";
};

productShort.textContent = product.short || product.name;
productTitle.textContent = product.name;
productRef.textContent = `Réf. ${product.ref || product.id}`;

renderColors();
refreshFavState();

// Va a l'image precedente.
prevBtn.addEventListener("click", () => updateCarousel(index - 1));
// Va a l'image suivante.
nextBtn.addEventListener("click", () => updateCarousel(index + 1));
// Ajoute le clic sur chaque indicateur.
indicators.forEach((dot) => {
  // Saute vers l'image correspondante a l'indicateur.
  dot.addEventListener("click", () => updateCarousel(Number(dot.dataset.index)));
});

// Ajoute le produit au panier et affiche une confirmation courte.
addToCartBtn.addEventListener("click", () => {
  addItem(STORAGE_KEYS.cart, product.id);
  addToCartBtn.textContent = "Ajouté";
  // Retablit le libelle du bouton apres un court delai.
  setTimeout(() => (addToCartBtn.textContent = "Ajouter au panier"), 1200);
});

// Bascule le produit dans les favoris.
toggleFavBtn.addEventListener("click", () => {
  toggleItem(STORAGE_KEYS.favs, product.id);
  refreshFavState();
});

