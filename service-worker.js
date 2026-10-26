// Service Worker do portfólio — cacheia tudo no 1º acesso para funcionar
// depois sem internet. Sobe a versão do CACHE_NAME quando o conteúdo mudar,
// assim o navegador sabe que precisa baixar tudo de novo.
const CACHE_NAME = 'ph-portfolio-v4';

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
  './fonts.css',
  './fraunces-latin-600-normal.woff2',
  './fraunces-latin-ext-600-normal.woff2',
  './ibm-plex-mono-latin-400-normal.woff2',
  './ibm-plex-mono-latin-500-normal.woff2',
  './ibm-plex-mono-latin-600-normal.woff2',
  './ibm-plex-mono-latin-ext-400-normal.woff2',
  './ibm-plex-mono-latin-ext-500-normal.woff2',
  './ibm-plex-mono-latin-ext-600-normal.woff2',
  './inter-latin-400-normal.woff2',
  './inter-latin-500-normal.woff2',
  './inter-latin-600-normal.woff2',
  './inter-latin-700-normal.woff2',
  './inter-latin-ext-400-normal.woff2',
  './inter-latin-ext-500-normal.woff2',
  './inter-latin-ext-600-normal.woff2',
  './inter-latin-ext-700-normal.woff2',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png',
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
      // cache: 'reload' ignora o cache HTTP do navegador, para não guardar
      // uma versão antiga do site junto com a nova.
      .then((cache) => cache.addAll(ASSETS.map((url) => new Request(url, { cache: 'reload' }))))
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

// Páginas, scripts, estilos e textos: rede primeiro, para as atualizações
// aparecerem na hora; sem internet, usa a cópia guardada.
// Fontes e imagens: cache primeiro, porque quase nunca mudam.
function isCode(request) {
  if (request.mode === 'navigate') return true;
  return /\.(html|js|css|json)$/.test(new URL(request.url).pathname);
}

function saveCopy(request, response) {
  if (response.ok && new URL(request.url).origin === self.location.origin) {
    const copy = response.clone();
    caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
  }
  return response;
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  if (isCode(request)) {
    event.respondWith(
      fetch(request, { cache: 'no-cache' })
        .then((response) => saveCopy(request, response))
        .catch(() =>
          caches.match(request).then((cached) =>
            cached || (request.mode === 'navigate' ? caches.match('./index.html') : undefined)
          )
        )
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) =>
      cached || fetch(request).then((response) => saveCopy(request, response))
    )
  );
});
