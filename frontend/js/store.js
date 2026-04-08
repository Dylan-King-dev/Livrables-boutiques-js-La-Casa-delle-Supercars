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
    badge: "Super Sport",
    price: "315 000 €",
    availability: "Disponible",
    specs: {
      power: "525 ch",
      zeroTo100: "3,2 s",
      drive: "Propulsion",
      edition: "RS Pack",
    },
    description: "Atmosphère circuit, aérodynamique affûtée et performance extrême.", 
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
    badge: "Sport",
    price: "137 000 €",
    availability: "Sur demande",
    specs: {
      power: "385 ch",
      zeroTo100: "4,2 s",
      drive: "Propulsion",
      edition: "Carrera",
    },
    image: "../assets/img/porsche/colours/Sport/911%20Carrera%20RS/911%20Carrera%20S%20Red.jpg",
  },
  "porsche-panamera": {
    id: "porsche-panamera",
    name: "Porsche Panamera",
    short: "Panamera",
    brand: "Porsche",
    ref: "PANAMERA",
    badge: "Classic",
    price: "125 000 €",
    availability: "Disponible",
    specs: {
      power: "353 ch",
      zeroTo100: "5,1 s",
      drive: "AWD",
      edition: "Executive",
    },
    image: "../assets/img/porsche/colours/Classic/Panamera/Panamera%20Bleu.jpg",
  },
  "porsche-macan": {
    id: "porsche-macan",
    name: "Porsche Macan",
    short: "Macan",
    brand: "Porsche",
    ref: "MACAN",
    badge: "SUV",
    price: "86 000 €",
    availability: "Disponible",
    specs: {
      power: "265 ch",
      zeroTo100: "6,2 s",
      drive: "AWD",
      edition: "Urban",
    },
    image: "../assets/img/porsche/colours/SUV/Macan/Macan%20Orange.jpg",
  },
  "porsche-taycan-turbo-gt": {
    id: "porsche-taycan-turbo-gt",
    name: "Porsche Taycan Turbo GT",
    short: "Taycan Turbo GT",
    brand: "Porsche",
    ref: "TAYCAN/GT",
    badge: "E-Performance",
    price: "225 000 €",
    availability: "Série limitée",
    specs: {
      power: "1 100 ch",
      zeroTo100: "2,2 s",
      drive: "AWD",
      edition: "Turbo GT",
    },
    image: "../assets/img/porsche/colours/Electrique/Taycan%20Turbo%20GT/Taycan%20Turbo%20GT%20Bleu.jpg",
  },
  "maserati-granturismo": {
    id: "maserati-granturismo",
    name: "Maserati GranTurismo",
    short: "GranTurismo",
    brand: "Maserati",
    ref: "GRAN/TURISMO",
    badge: "Sport",
    price: "168 000 €",
    availability: "Disponible",
    specs: {
      power: "490 ch",
      zeroTo100: "3,9 s",
      drive: "AWD",
      edition: "Nettuno",
    },
    image: "../assets/img/maserati/Sport/GRAN_TURISMO/GRAN_TURISMO_AVANT_NOIR.jpg",
  },
  "maserati-trofeo": {
    id: "maserati-trofeo",
    name: "Maserati Trofeo",
    short: "Trofeo",
    brand: "Maserati",
    ref: "TROFEO",
    badge: "Sport+",
    price: "198 000 €",
    availability: "Sur demande",
    specs: {
      power: "550 ch",
      zeroTo100: "3,5 s",
      drive: "AWD",
      edition: "Trofeo",
    },
    image: "../assets/img/maserati/Sport/TROFEO/TROFEO_AVANT_NOIR.jpg",
  },
  "maserati-gt2-stradale": {
    id: "maserati-gt2-stradale",
    name: "Maserati GT2 Stradale",
    short: "GT2 Stradale",
    brand: "Maserati",
    ref: "GT2/STRADALE",
    badge: "Super Sport",
    price: "310 000 €",
    availability: "Série limitée",
    specs: {
      power: "640 ch",
      zeroTo100: "2,8 s",
      drive: "Propulsion",
      edition: "Stradale",
    },
    image: "../assets/img/maserati/Super%20Sport/GT2_STRADALE/GT2_STRADALE_AVANT_NOIR.jpg",
  },
  "maserati-grancabrio": {
    id: "maserati-grancabrio",
    name: "Maserati GranCabrio",
    short: "GranCabrio",
    brand: "Maserati",
    ref: "GRAN/CABRIO",
    badge: "Cabrio",
    price: "175 000 €",
    availability: "Disponible",
    specs: {
      power: "490 ch",
      zeroTo100: "4,0 s",
      drive: "AWD",
      edition: "Cabrio",
    },
    image: "../assets/img/maserati/Sport%20Cabrio/GRANCABRIO/GRANCABRIO_AVANT_OR.jpg",
  },
  "maserati-grancabrio-trofeo": {
    id: "maserati-grancabrio-trofeo",
    name: "Maserati GranCabrio Trofeo",
    short: "GranCabrio Trofeo",
    brand: "Maserati",
    ref: "GRAN/CABRIO/TROFEO",
    badge: "Trofeo",
    price: "210 000 €",
    availability: "Sur demande",
    specs: {
      power: "550 ch",
      zeroTo100: "3,6 s",
      drive: "AWD",
      edition: "Trofeo",
    },
    image: "../assets/img/maserati/Sport%20Cabrio/GRANCABRIO%20TROFEO/GRANCABRIO_TROFEO_AVANT_NOIR.jpg",
  },
  "maserati-grecale": {
    id: "maserati-grecale",
    name: "Maserati Grecale",
    short: "Grecale",
    brand: "Maserati",
    ref: "GRECALE",
    badge: "SUV",
    price: "88 000 €",
    availability: "Disponible",
    specs: {
      power: "300 ch",
      zeroTo100: "5,6 s",
      drive: "AWD",
      edition: "Grecale",
    },
    image: "../assets/img/maserati/SUV/GRECALE/GRECALE_AVANT_NOIR.jpg",
  },
  "maserati-grecale-modena": {
    id: "maserati-grecale-modena",
    name: "Maserati Grecale Modena",
    short: "Grecale Modena",
    brand: "Maserati",
    ref: "GRECALE/MODENA",
    badge: "Modena",
    price: "99 000 €",
    availability: "Disponible",
    specs: {
      power: "330 ch",
      zeroTo100: "5,2 s",
      drive: "AWD",
      edition: "Modena",
    },
    image: "../assets/img/maserati/SUV/GRECALE%20MODENA/GRECALE_MODENA_AVANT_NOIR.jpg",
  },
  "maserati-granturismo-folgore": {
    id: "maserati-granturismo-folgore",
    name: "Maserati GranTurismo Folgore",
    short: "GranTurismo Folgore",
    brand: "Maserati",
    ref: "FOLGORE/GT",
    badge: "Folgore",
    price: "205 000 €",
    availability: "Série limitée",
    specs: {
      power: "760 ch",
      zeroTo100: "2,7 s",
      drive: "AWD",
      edition: "Folgore",
    },
    image: "../assets/img/maserati/Éléctrique/GRANTURISMO_FOLGORE/GRANTURISMO_FOLGORE_AVANT_NOIR.jpg",
  },
  "maserati-grecale-folgore": {
    id: "maserati-grecale-folgore",
    name: "Maserati Grecale Folgore",
    short: "Grecale Folgore",
    brand: "Maserati",
    ref: "FOLGORE/SUV",
    badge: "Folgore",
    price: "115 000 €",
    availability: "Précommande",
    specs: {
      power: "500 ch",
      zeroTo100: "4,1 s",
      drive: "AWD",
      edition: "Folgore",
    },
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


