// service-worker.js
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.2.0/workbox-sw.js');

// Rota para a API de capítulos
workbox.routing.registerRoute(
  new RegExp('https://api-cartilha-teste.onrender.com/api/capitulos?populate=*'),
  // new RegExp('https://tecnofam-strapi.cpao.embrapa.br/api/capitulos?populate=*'),
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'api-capitulos-cache',
  })
);

// Rota para a API de autores
workbox.routing.registerRoute(
  // new RegExp('https://api-cartilha-teste-production.up.railway.app/api/autors'),
  new RegExp('https://tecnofam-strapi.cpao.embrapa.br/api/autors?populate=*'),
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'api-autores-cache',
  })
);

self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/api/capitulos') || event.request.url.includes('/api/autors')) {
    const promiseChain = fetch(event.request.clone())
      .then((response) => {
        const responseClone = response.clone();
        caches.open('api-cache')
          .then((cache) => {
            cache.put(event.request, responseClone);
          });
        return response;
      })
      .catch(() => {
        return caches.match(event.request)
          .then((response) => {
            if (response) {
              return response;
            }
            return self.registration.sync.register('syncData');
          });
      });
    event.respondWith(promiseChain);
  }
});

if (navigator.storage && navigator.storage.persist) {
  navigator.storage.persist().then(granted => {
    if (granted) {
      alert("Armazenamento persistirá e não será limpo");
    } else {
      alert("Armazenamento não persistirá e pode ser limpo");
    }
  });
}

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

// Rotas para arquivos estáticos
workbox.routing.registerRoute(
  /\.(?:png|jpg|jpeg|svg|gif|ico|css)$/,
  new workbox.strategies.CacheFirst({
    cacheName: 'static-cache',
  })
);

// Rota para o arquivo de manifest
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
