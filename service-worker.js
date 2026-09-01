// Service Worker do portfólio — cacheia tudo no 1º acesso para funcionar
// depois sem internet. Sobe a versão do CACHE_NAME quando o conteúdo mudar,
// assim o navegador sabe que precisa baixar tudo de novo.
const CACHE_NAME = 'ph-portfolio-v1';

const ASSETS = [
  './',
  './index.html',
  './quem-sou-eu.html',
  './manifest.json',
  './styles.css',
  './i18n.css',
  './workspace.css',
  './gallery.css',
  './about.css',
  './deck.css',
  './i18n-pt.js',
  './i18n-en.js',
  './i18n.js',
  './script.js',
  './workspace.js',
  './gallery.js',
  './about.js',
  './deck.js',
  './assets/fonts/fonts.css',
  './assets/fonts/fraunces-latin-600-normal.woff2',
  './assets/fonts/fraunces-latin-ext-600-normal.woff2',
  './assets/fonts/ibm-plex-mono-latin-400-normal.woff2',
  './assets/fonts/ibm-plex-mono-latin-500-normal.woff2',
  './assets/fonts/ibm-plex-mono-latin-600-normal.woff2',
  './assets/fonts/ibm-plex-mono-latin-ext-400-normal.woff2',
  './assets/fonts/ibm-plex-mono-latin-ext-500-normal.woff2',
  './assets/fonts/ibm-plex-mono-latin-ext-600-normal.woff2',
  './assets/fonts/inter-latin-400-normal.woff2',
  './assets/fonts/inter-latin-500-normal.woff2',
  './assets/fonts/inter-latin-600-normal.woff2',
  './assets/fonts/inter-latin-700-normal.woff2',
  './assets/fonts/inter-latin-ext-400-normal.woff2',
  './assets/fonts/inter-latin-ext-500-normal.woff2',
  './assets/fonts/inter-latin-ext-600-normal.woff2',
  './assets/fonts/inter-latin-ext-700-normal.woff2',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/icons/icon-maskable-512.png',
  './analytics-excel.png',
  './analytics-excel-estrategico.png',
  './analytics-tableau-barras.png',
  './analytics-tableau-mapa.png',
  './analytics-tableau-temporal.png',
  './analytics-tableau-dashboard-completo.png',
  './paulo-henrique.jpg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n))
      )
    ).then(() => self.clients.claim())
  );
});

// Cache-first: responde do cache instantaneamente (e offline);
// se não estiver em cache, busca na rede e guarda para a próxima vez.
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return response;
        })
        .catch(() => caches.match('./index.html'));
    })
  );
});
