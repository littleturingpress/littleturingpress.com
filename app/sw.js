// Offline support: keep the app files on the device. Bump VERSION on every release.
const VERSION = "ltc-app-4";
const FILES = ["./", "index.html", "app.css?v=2", "extras.js?v=1", "content.js?v=1", "app.js?v=4", "manifest.webmanifest",
  "icons/icon-192.png", "../assets/img/bit.webp", "../assets/img/cover.webp", "../assets/img/bit-drawer.webp", "../assets/img/case2.webp",
  "../assets/fonts/InterDisplay-Black.woff", "../assets/fonts/Inter-Regular.woff", "../assets/fonts/Inter-SemiBold.woff", "../assets/fonts/Inter-Bold.woff", "../assets/fonts/DejaVuSansMono-Bold.woff"];
self.addEventListener("install", e => { e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET" || new URL(e.request.url).origin !== location.origin) return;
  // network first, so updates arrive quickly; fall back to the saved copy when offline
  e.respondWith(fetch(e.request).then(r => { const copy = r.clone(); caches.open(VERSION).then(c => c.put(e.request, copy)); return r; }).catch(() => caches.match(e.request, { ignoreSearch: false })));
});
