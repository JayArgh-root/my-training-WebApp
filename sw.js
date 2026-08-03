const CACHE_NAME = 'training-app-v21';
const FILES_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './App Icon/icon-180.png',
  './App Icon/icon-192.png',
  './App Icon/icon-512.png',
  './Splash screen/bg-full.png',
  './Splash screen/person-icon-transparent.png',
  './Splash screen/apple-splash-1125x2436.png'
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

// index.html (und die Startseite) immer zuerst frisch aus dem Netz laden, damit
// Aktualisierungen sofort ankommen - Cache dient hier nur als Offline-Fallback.
// Statische Assets (Icons, Bilder) bleiben cache-first, da sie sich selten ändern
// und das schneller/zuverlässiger fürs Offline-Training ist.
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);
  const isAppShellHTML = req.mode === 'navigate' || url.pathname.endsWith('.html') || url.pathname.endsWith('/');

  if (isAppShellHTML) {
    event.respondWith(
      fetch(req)
        .then((networkResponse) => {
          const copy = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          return networkResponse;
        })
        .catch(() => caches.match(req))
    );
    return;
  }

  event.respondWith(
    caches.match(req).then((cached) => cached || fetch(req))
  );
});
