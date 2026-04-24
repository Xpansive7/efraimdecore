const CACHE = "efraim-v1";
const ASSETS = ["/", "/index.html", "/styles.css", "/app.js"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener("fetch", e => {
  // Supabase e CDN sempre pela rede
  if (e.request.url.includes("supabase.co") || e.request.url.includes("cdn.jsdelivr") || e.request.url.includes("fonts.")) {
    return;
  }
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
