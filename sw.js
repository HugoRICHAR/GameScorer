// GameScorer offline cache.
// Everything is served from the cache instantly and refreshed in the
// background, so the app opens with no signal and picks up a new deploy
// on the following launch. Google Fonts are cached the same way.
// Bump VERSION when the SHELL list changes.
const VERSION = 'gs-v4';
const SHELL = [
  './', 'index.html', 'manifest.webmanifest', 'apple-touch-icon.png', 'icon-192.png', 'icon-512.png',
  'shared/reset.css', 'shared/components.css', 'shared/glass.css', 'shared/base.js', 'shared/icons.svg',
  'scopa/index.html', 'scopa/apple-touch-icon.png',
  'skull-king/index.html', 'skull-king/apple-touch-icon.png',
  'darts/index.html', 'darts/apple-touch-icon.png',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const mine = url.origin === location.origin;
  if (!mine && !/^fonts\.(googleapis|gstatic)\.com$/.test(url.hostname)) return;
  e.respondWith(caches.open(VERSION).then(cache =>
    cache.match(req, { ignoreSearch: mine }).then(hit => {
      const fresh = fetch(req)
        .then(res => {
          if (res.ok || res.type === 'opaque') cache.put(req, res.clone());
          return res;
        })
        .catch(() => hit || Response.error());
      if (hit) { e.waitUntil(fresh); return hit; }
      return fresh;
    })));
});
