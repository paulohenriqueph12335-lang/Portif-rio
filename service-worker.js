// O site não usa mais modo offline: abre direto do GitHub Pages.
// Este arquivo só existe para limpar os aparelhos que já tinham guardado
// uma cópia: apaga o cache, se desinstala e recarrega a página.
self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.map((name) => caches.delete(name)));
    await self.registration.unregister();
    const windows = await self.clients.matchAll({ type: 'window' });
    windows.forEach((client) => client.navigate(client.url));
  })());
});
