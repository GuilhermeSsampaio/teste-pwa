importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.2.0/workbox-sw.js');

// Rota para a API de capítulos
workbox.routing.registerRoute(
  new RegExp('https://api-cartilha-teste.onrender.com/api/capitulos?populate=*'),
  new workbox.strategies.CacheFirst({
    cacheName: 'api-capitulos-cache',
    plugins: [
      new workbox.backgroundSync.BackgroundSyncPlugin('syncDataa', {
        maxRetentionTime: 24 * 60 // Retry for up to 24 hours (in minutes)
      })
    ]
  })
);

workbox.routing.registerRoute(
  new RegExp('https://api-cartilha-teste.onrender.com/api/autors?populate=*'),
  new workbox.strategies.CacheFirst({
    cacheName: 'api-autores-cache',
    plugins: [
      new workbox.backgroundSync.BackgroundSyncPlugin('syncDatab', {
        maxRetentionTime: 24 * 60 // Retry for up to 24 hours (in minutes)
      })
    ]
  })
);

workbox.routing.registerRoute(
  new RegExp('https://tecnofam-api.cpao.embrapa.br/strapi/upload/'),
  new workbox.strategies.CacheFirst({
    cacheName: 'api-images-cache',
    plugins: [
      new workbox.cacheableResponse.CacheableResponsePlugin({ statuses: [200] }),
      new workbox.expiration.ExpirationPlugin({ maxEntries: 50 }) // Limite o número de imagens em cache para evitar uso excessivo de armazenamento
    ]
  })
);

self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/api/capitulos') || event.request.url.includes('/api/autors')) {
    const promiseChain = fetch(event.request.clone())
      .catch(() => {
        return self.registration.sync.register('syncData');
      });
    event.waitUntil(promiseChain);
  }
});

self.addEventListener('sync', (event) => {
  if (event.tag === 'syncData') {
    event.waitUntil(syncData());
  }
});

function syncData() {
  return workbox.precaching.cleanupOutdatedCaches()
    .then(() => {
      return workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);
    });
}

// Definição manual do array __WB_MANIFEST
const manifest = [
  '/',
  '/edicao-completa',
  '/autores'
  // Adicione mais URLs aqui conforme necessário
].map(url => ({ url, revision: null }));

workbox.precaching.precacheAndRoute(manifest);


// Rotas para arquivos estáticos
workbox.routing.registerRoute(
  /\.(?:png|jpg|jpeg|svg|gif|ico|css)$/,
  new workbox.strategies.CacheFirst({
    cacheName: 'static-cache',
  })
);

// Rota para o arquivo de manifesto
workbox.routing.registerRoute(
  /manifest.json$/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'manifest-cache',
  })
);

// Rota para outras rotas (página principal, etc.)
workbox.routing.registerRoute(
  ({ url }) => url.origin === self.location.origin,
  new workbox.strategies.StaleWhileRevalidate()
);
