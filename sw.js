const CACHE = "ecometrica-v42";
const ASSETS = ["./", "./index.html", "./styles.css", "./footer.css?v=6", "./search.css?v=13", "./map.css?v=15", "./protocol.css?v=20", "./dedup.css?v=22", "./prisma.css?v=26", "./analytics.css?v=42", "./flow.css?v=37", "./app.js?v=42", "./manifest.webmanifest", "./icons/icon.svg", "./icons/decb-uern.png", "./icons/flag-br.svg"];
self.addEventListener("install", event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting())));
self.addEventListener("activate", event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  event.respondWith(fetch(event.request).then(response => {
    const copy = response.clone();
    caches.open(CACHE).then(cache => cache.put(event.request, copy));
    return response;
  }).catch(() => caches.match(event.request).then(hit => hit || caches.match("./index.html"))));
});
