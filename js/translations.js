// translations.js
export async function loadTranslations(lang) {
  try {
    const res = await fetch(`/i18n/${lang}.json`);
    if (!res.ok) throw new Error(`No se pudo cargar ${lang}.json`);
    return await res.json();
  } catch (err) {
    console.warn(`Error cargando ${lang}.json, usando español por defecto`, err);
    const fallback = await fetch(`/i18n/es.json`);
    return await fallback.json();
  }
}

export function applyTranslations(translations) {
  function getValue(obj, path) {
    return path.split('.').reduce((o, k) => (o && o[k] !== undefined ? o[k] : null), obj);
  }

  // Textos normales (permite HTML)
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const value = getValue(translations, key);
    if (value) el.innerHTML = value;
  });

  // Placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    const value = getValue(translations, key);
    if (value) el.setAttribute('placeholder', value);
  });
}
