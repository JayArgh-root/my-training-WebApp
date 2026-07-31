const CACHE_NAME = 'training-app-v16';
const FILES_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './App Icon/icon-180.png',
  './App Icon/icon-192.png',
  './App Icon/icon-512.png',
  './Splash screen/bg-full.png',
  './Splash screen/person-icon.png',
  './Splash screen/logo-icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
