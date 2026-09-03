const CACHE = "ecometrica-v69";
const APP_SHELL = "./index.html";
const ASSETS = [
  "./",
  APP_SHELL,
  "./styles.css?v=64",
  "./footer.css?v=8",
  "./search.css?v=13",
  "./map.css?v=15",
  "./protocol.css?v=67",
  "./dedup.css?v=22",
  "./prisma.css?v=64",
  "./extraction.css?v=66",
  "./analytics.css?v=44",
  "./flow.css?v=64",
  "./help.css?v=69",
  "./topbar.css?v=69",
  "./app.js?v=69",
  "./manifest.webmanifest",
  "./icons/icon.svg",
  "./icons/decb-uern.png",
  "./icons/flag-br.svg"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key.startsWith("ecometrica-") && key !== CACHE).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  const sameOrigin = url.origin === self.location.origin;
  const isNavigation = request.mode === "navigate";

  if (isNavigation) {
    event.respondWith(
      fetch(request, { cache: "no-store" })
        .then(response => {
          if (response.ok) caches.open(CACHE).then(cache => cache.put(APP_SHELL, response.clone()));
          return response;
        })
        .catch(() => caches.match(APP_SHELL))
    );
    return;
  }

  if (!sameOrigin) {
    event.respondWith(fetch(request));
    return;
  }

  event.respondWith(
    fetch(request, { cache: "no-store" })
      .then(response => {
        if (response.ok) caches.open(CACHE).then(cache => cache.put(request, response.clone()));
        return response;
      })
      .catch(() => caches.match(request))
  );
});
