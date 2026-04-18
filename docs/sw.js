/**
 * Minimal service worker: make the app usable offline after first load.
 *
 * Strategy differs by request type:
 *  - HTML navigation (the document itself):   network-first, cache fallback.
 *    Keeps a stale shell from masking a deployment that changed the script
 *    manifest, the template contract, or the selector registry.
 *  - Everything else (JS / CSS / JSON / fonts / images):
 *    stale-while-revalidate for same-origin GETs. Fast repeat visits,
 *    background revalidation, offline fallback.
 *
 * Bump `CACHE_VERSION` whenever you ship breaking changes that should
 * invalidate the old caches (e.g. major i18n or question schema changes,
 * or — as happened in the layout-swap refactor — the HTML shell becomes
 * incompatible with the new script manifest). On activation, older caches
 * are purged.
 */
"use strict";

const CACHE_VERSION = "v2";
const CACHE_NAME = "ebt-" + CACHE_VERSION;

self.addEventListener("install", (event) => {
  // Activate immediately on first install so the page doesn't have to reload
  // just to pick up the worker.
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      // Purge caches from previous versions so we don't accumulate forever.
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)));
      await self.clients.claim();
    })(),
  );
});

function isNavigationRequest(req) {
  // Covers both top-level navigations and explicit document Accept types.
  if (req.mode === "navigate") return true;
  const accept = req.headers.get("accept") || "";
  return req.method === "GET" && accept.includes("text/html");
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  if (isNavigationRequest(req)) {
    // Network-first: never serve a stale HTML shell to a freshly-opened tab.
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE_NAME);
        try {
          const res = await fetch(req);
          if (res && res.ok && res.type === "basic") {
            cache.put(req, res.clone()).catch(() => {});
          }
          return res;
        } catch (_err) {
          const cached = await cache.match(req);
          if (cached) return cached;
          return Response.error();
        }
      })(),
    );
    return;
  }

  // Stale-while-revalidate for everything else (scripts, styles, assets).
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(req);

      const networkFetch = fetch(req)
        .then((res) => {
          if (res && res.ok && res.type === "basic") {
            cache.put(req, res.clone()).catch(() => {});
          }
          return res;
        })
        .catch(() => null);

      if (cached) {
        event.waitUntil(networkFetch);
        return cached;
      }
      const res = await networkFetch;
      if (res) return res;
      return Response.error();
    })(),
  );
});
