// i18n.js
import { loadTranslations, applyTranslations } from './translations.js';

const supportedLangs = ['es', 'ca'];
const defaultLang = 'es';

function getCurrentLang() {
  const params = new URLSearchParams(window.location.search);
  const lang = params.get('lang');
  return supportedLangs.includes(lang) ? lang : defaultLang;
}

async function initI18n() {
  const lang = getCurrentLang();

  // Carga traducciones
  const translations = await loadTranslations(lang);

  // Aplica traducciones al DOM
  applyTranslations(translations);

  // Configura selector de idioma
  const langSelect = document.getElementById('language-select');
  if (langSelect) {
    langSelect.value = lang;
    langSelect.addEventListener('change', async (e) => {
      const newLang = e.target.value;
      const newTranslations = await loadTranslations(newLang);
      applyTranslations(newTranslations);
    });
  }
}

document.addEventListener('DOMContentLoaded', initI18n);
