// Carga las traducciones desde un JSON
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

// Aplica traducciones a elementos con data-i18n
export function applyTranslations(translations) {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n'); // ej: "nav.home"
    const keys = key.split('.');
    let text = translations;

    for (const k of keys) {
      if (text && typeof text === 'object') {
        text = text[k];
      }
    }

    if (typeof text === 'string') el.textContent = text;
  });
}
