import { loadTranslations, applyTranslations } from './translations.js';

const supportedLangs = ['es', 'ca'];
const defaultLang = 'es';

// Detecta el idioma en la URL (?lang=es)
function getCurrentLang() {
  const params = new URLSearchParams(window.location.search);
  const lang = params.get('lang');
  return supportedLangs.includes(lang) ? lang : defaultLang;
}

// Cambia el idioma actual agregando ?lang=xx en la URL
function changeLanguage(lang) {
  const url = new URL(window.location);
  url.searchParams.set('lang', lang);
  window.location.href = url.toString();
}

// --- Inicio ---
document.addEventListener('DOMContentLoaded', async () => {
  const lang = getCurrentLang();

  // Carga traducciones
  const translations = await loadTranslations(lang);
  applyTranslations(translations);

  // Configura selector de idioma
  const langSelect = document.getElementById('language-select');
  if (langSelect) {
    langSelect.value = lang;
    langSelect.addEventListener('change', e => changeLanguage(e.target.value));
  }
});
