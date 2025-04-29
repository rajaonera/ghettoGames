const CACHE_NAME = 'stats-joueurs-cache-v1';
const urlsToCache = [
  '/',
  '/compteur_parties_perdues2.0.html',
  '/style.css',
  '/script.js',
  '/manifest.json',
  '/logo.png',
  '/logo.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
