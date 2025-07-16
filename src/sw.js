import { precacheAndRoute } from 'workbox-precaching';

const VERSION = '1.0.0'; // Уникальная версия для обновления

// В этот массив Vite автоматически вставит ресурсы, которые нужно кэшировать
precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => cacheName !== `v${VERSION}`).map(cacheName => caches.delete(cacheName))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) return response;
      // Пропускаем запросы к внешним серверам (например, WebSocket)
      if (event.request.url.startsWith('https://websocket-server-01.onrender.com')) {
        return fetch(event.request);
      }
      // Для клиентского роутинга возвращаем index.html
      return fetch(event.request).catch(() => caches.match('/index.html'));
    })
  );
});