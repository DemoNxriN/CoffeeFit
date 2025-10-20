// translations.js
export const languages = {
  es: 'Español',
  ca: 'Català'
};

export const defaultLang = 'es';

export const translations = {
  es: {
    'nav.home': 'Inicio',
    'nav.products': 'Productos',
    'nav.about': 'Sobre Nosotros',
    'nav.contact': 'Contacto',
  },
  ca: {
    'nav.home': 'Inici',
    'nav.products': 'Productes',
    'nav.about': 'Sobre Nosaltres',
    'nav.contact': 'Contacte',
  }
};

export function getLangFromUrl() {
  const path = window.location.pathname.split('/');
  const lang = path[1];
  return languages[lang] ? lang : defaultLang;
}

export function t(lang, key) {
  return translations[lang][key] || translations[defaultLang][key] || key;
}
