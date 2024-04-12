importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.2.0/workbox-sw.js');


workbox.routing.registerRoute(
  new RegExp('https://api-cartilha-teste.onrender.com/api/capitulos?populate=*'),
  new NetworkFirst({
    cacheName: 'api-capitulos-cache',
    plugins: [
      new BackgroundSyncPlugin('syncData', {
        maxRetentionTime: 24 * 60 // Retry for up to 24 hours (in minutes)
      })
    ]
  })
);

workbox.routing.registerRoute(
  new RegExp('https://api-cartilha-teste.onrender.com/api/autors?populate=*'),
  new NetworkFirst({
    cacheName: 'api-autores-cache',
    plugins: [
      new BackgroundSyncPlugin('syncData', {
        maxRetentionTime: 24 * 60 // Retry for up to 24 hours (in minutes)
      })
    ]
  })
);

workbox.routing.registerRoute(
  new RegExp('https://tecnofam-api.cpao.embrapa.br/strapi/upload/'),
  new CacheFirst({
    cacheName: 'api-images-cache',
    plugins: [
      new CacheableResponsePlugin({ statuses: [200] }),
      new ExpirationPlugin({ maxEntries: 50 }) // Limite o número de imagens em cache para evitar uso excessivo de armazenamento
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
  return cleanupOutdatedCaches()
    .then(() => {
      return precacheAndRoute(self.__WB_MANIFEST);
    });
}

registerRoute(
  /\.(?:png|jpg|jpeg|svg|gif|ico|css)$/,
  new CacheFirst({
    cacheName: 'static-cache',
  })
);

registerRoute(
  /manifest.json$/,
  new StaleWhileRevalidate({
    cacheName: 'manifest-cache',
  })
);

registerRoute(
  ({ url }) => url.origin === self.location.origin,
  new StaleWhileRevalidate()
);

precacheAndRoute(self.__WB_MANIFEST);
