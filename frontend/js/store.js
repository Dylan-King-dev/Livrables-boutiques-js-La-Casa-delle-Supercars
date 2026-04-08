const STORAGE_KEYS = {
  cart: "lacasa_cart",
  favs: "lacasa_favs",
};

const PRODUCTS = {
  "porsche-gt3rs": {
    id: "porsche-gt3rs",
    name: "Porsche 911 GT3 RS",
    short: "GT3 RS",
    brand: "Porsche",
    ref: "992/GT3RS",
    image: "../assets/img/porsche/colours/Super%20Sport/911%20GT3/911%20GT3%20Jaune.jpg",
    colors: [
      {
        key: "jaune",
        label: "Jaune",
        swatch: "../assets/img/porsche/colours/Super%20Sport/911%20GT3/Speedyellow.jpg",
        images: [
          "../assets/img/porsche/colours/Super%20Sport/911%20GT3/911%20GT3%20Jaune.jpg",
          "../assets/img/porsche/colours/Super%20Sport/911%20GT3/911%20GT3%20Jaune(1).jpg",
          "../assets/img/porsche/colours/Super%20Sport/911%20GT3/911%20GT3%20Jaune(2).jpg",
        ],
      },
      {
        key: "argent",
        label: "Argent",
        swatch: "../assets/img/porsche/colours/Super%20Sport/911%20GT3/Argent.jpg",
        images: [
          "../assets/img/porsche/colours/Super%20Sport/911%20GT3/911%20GT3%20Argent.jpg",
          "../assets/img/porsche/colours/Super%20Sport/911%20GT3/911%20GT3%20Argent(1).jpg",
          "../assets/img/porsche/colours/Super%20Sport/911%20GT3/911%20GT3%20Argent(2).jpg",
        ],
      },
    ],
  },
  "porsche-911-carrera": {
    id: "porsche-911-carrera",
    name: "Porsche 911 Carrera",
    short: "911 Carrera",
    brand: "Porsche",
    ref: "911/CARRERA",
    image: "../assets/img/porsche/colours/Sport/911%20Carrera%20RS/911%20Carrera%20S%20Red.jpg",
  },
  "porsche-panamera": {
    id: "porsche-panamera",
    name: "Porsche Panamera",
    short: "Panamera",
    brand: "Porsche",
    ref: "PANAMERA",
    image: "../assets/img/porsche/colours/Classic/Panamera/Panamera%20Bleu.jpg",
  },
  "porsche-macan": {
    id: "porsche-macan",
    name: "Porsche Macan",
    short: "Macan",
    brand: "Porsche",
    ref: "MACAN",
    image: "../assets/img/porsche/colours/SUV/Macan/Macan%20Orange.jpg",
  },
  "porsche-taycan-turbo-gt": {
    id: "porsche-taycan-turbo-gt",
    name: "Porsche Taycan Turbo GT",
    short: "Taycan Turbo GT",
    brand: "Porsche",
    ref: "TAYCAN/GT",
    image: "../assets/img/porsche/colours/Electrique/Taycan%20Turbo%20GT/Taycan%20Turbo%20GT%20Bleu.jpg",
  },
  "maserati-granturismo": {
    id: "maserati-granturismo",
    name: "Maserati GranTurismo",
    short: "GranTurismo",
    brand: "Maserati",
    ref: "GRAN/TURISMO",
    image: "../assets/img/maserati/Sport/GRAN_TURISMO/GRAN_TURISMO_AVANT_NOIR.jpg",
  },
  "maserati-trofeo": {
    id: "maserati-trofeo",
    name: "Maserati Trofeo",
    short: "Trofeo",
    brand: "Maserati",
    ref: "TROFEO",
    image: "../assets/img/maserati/Sport/TROFEO/TROFEO_AVANT_NOIR.jpg",
  },
  "maserati-gt2-stradale": {
    id: "maserati-gt2-stradale",
    name: "Maserati GT2 Stradale",
    short: "GT2 Stradale",
    brand: "Maserati",
    ref: "GT2/STRADALE",
    image: "../assets/img/maserati/Super%20Sport/GT2_STRADALE/GT2_STRADALE_AVANT_NOIR.jpg",
  },
  "maserati-grancabrio": {
    id: "maserati-grancabrio",
    name: "Maserati GranCabrio",
    short: "GranCabrio",
    brand: "Maserati",
    ref: "GRAN/CABRIO",
    image: "../assets/img/maserati/Sport%20Cabrio/GRANCABRIO/GRANCABRIO_AVANT_OR.jpg",
  },
  "maserati-grancabrio-trofeo": {
    id: "maserati-grancabrio-trofeo",
    name: "Maserati GranCabrio Trofeo",
    short: "GranCabrio Trofeo",
    brand: "Maserati",
    ref: "GRAN/CABRIO/TROFEO",
    image: "../assets/img/maserati/Sport%20Cabrio/GRANCABRIO%20TROFEO/GRANCABRIO_TROFEO_AVANT_NOIR.jpg",
  },
  "maserati-grecale": {
    id: "maserati-grecale",
    name: "Maserati Grecale",
    short: "Grecale",
    brand: "Maserati",
    ref: "GRECALE",
    image: "../assets/img/maserati/SUV/GRECALE/GRECALE_AVANT_NOIR.jpg",
  },
  "maserati-grecale-modena": {
    id: "maserati-grecale-modena",
    name: "Maserati Grecale Modena",
    short: "Grecale Modena",
    brand: "Maserati",
    ref: "GRECALE/MODENA",
    image: "../assets/img/maserati/SUV/GRECALE%20MODENA/GRECALE_MODENA_AVANT_NOIR.jpg",
  },
  "maserati-granturismo-folgore": {
    id: "maserati-granturismo-folgore",
    name: "Maserati GranTurismo Folgore",
    short: "GranTurismo Folgore",
    brand: "Maserati",
    ref: "FOLGORE/GT",
    image: "../assets/img/maserati/Éléctrique/GRANTURISMO_FOLGORE/GRANTURISMO_FOLGORE_AVANT_NOIR.jpg",
  },
  "maserati-grecale-folgore": {
    id: "maserati-grecale-folgore",
    name: "Maserati Grecale Folgore",
    short: "Grecale Folgore",
    brand: "Maserati",
    ref: "FOLGORE/SUV",
    image: "../assets/img/maserati/Éléctrique/GRECALE_FOLGORE/GRECALE_FOLGORE_AVANT_NOIR.jpg",
  },
};

// Lit une liste depuis le localStorage en toute securite.
const getList = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch {
    return [];
  }
};

// Enregistre une liste dans le localStorage.
const setList = (key, list) => {
  localStorage.setItem(key, JSON.stringify(list));
};

// Bascule un element dans la liste et retourne la liste mise a jour.
const toggleItem = (key, id) => {
  const list = getList(key);
  const idx = list.indexOf(id);
  if (idx >= 0) list.splice(idx, 1);
  else list.unshift(id);
  setList(key, list);
  return list;
};

// Ajoute un element a la liste s'il n'existe pas deja.
const addItem = (key, id) => {
  const list = getList(key);
  if (!list.includes(id)) list.unshift(id);
  setList(key, list);
  return list;
};

// Retire un element de la liste et retourne la liste mise a jour.
const removeItem = (key, id) => {
  const list = getList(key).filter((item) => item !== id);
  setList(key, list);
  return list;
};

// Recupere un produit par id avec un secours par defaut.
const getProduct = (id) => PRODUCTS[id] || PRODUCTS["porsche-gt3rs"];
