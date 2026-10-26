(function(){
"use strict";

const STORAGE_KEY = 'ph_lang';
const DEFAULT_LANG = 'pt';

function getDict(lang){ return lang === 'en' ? window.I18N_EN : window.I18N_PT; }

function resolve(dict, path){
  return path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined) ? acc[key] : null, dict);
}

function currentLang(){
  return localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
}

function applyLanguage(lang, opts){
  opts = opts || {};
  const dict = getDict(lang);
  if (!dict) return;

  document.documentElement.lang = lang === 'en' ? 'en' : 'pt-BR';

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const value = resolve(dict, el.getAttribute('data-i18n'));
    if (value !== null) el.textContent = value;
  });

  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const value = resolve(dict, el.getAttribute('data-i18n-html'));
    if (value !== null) el.innerHTML = value;
  });

  /* atributos: data-i18n-attr="aria-label:hero.ctaPrimary,title:common.someKey" */
  document.querySelectorAll('[data-i18n-attr]').forEach(el => {
    el.getAttribute('data-i18n-attr').split(',').forEach(pair => {
      const [attr, key] = pair.split(':').map(s => s.trim());
      if (!attr || !key) return;
      const value = resolve(dict, key);
      if (value !== null) el.setAttribute(attr, value);
    });
  });

  /* metadados — cada página pode apontar os seus com <body data-i18n-meta="..."> */
  const meta = resolve(dict, document.body.dataset.i18nMeta || 'meta');
  if (meta) {
    if (meta.title) document.title = meta.title;
    const descTag = document.querySelector('meta[name="description"]');
    if (descTag && meta.description) descTag.setAttribute('content', meta.description);
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle && meta.title) ogTitle.setAttribute('content', meta.title);
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc && meta.description) ogDesc.setAttribute('content', meta.description);
  }

  document.querySelectorAll('.lang-btn').forEach(btn => {
    const isActive = btn.dataset.lang === lang;
    btn.classList.toggle('is-active', isActive);
    btn.setAttribute('aria-pressed', String(isActive));
  });

  if (!opts.silent) localStorage.setItem(STORAGE_KEY, lang);

  window.dispatchEvent(new CustomEvent('languagechange', { detail: { lang, dict } }));
}

function setupSwitcher(){
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.lang;
      if (lang === currentLang()) return;
      applyLanguage(lang);
    });
  });
}

/* API pública mínima, útil para outros scripts (workspace.js etc.) */
window.PH_I18N = {
  t(path){ return resolve(getDict(currentLang()), path); },
  lang(){ return currentLang(); },
  apply: applyLanguage
};

document.addEventListener('DOMContentLoaded', () => {
  setupSwitcher();
  applyLanguage(currentLang(), { silent: true });
});

})();
