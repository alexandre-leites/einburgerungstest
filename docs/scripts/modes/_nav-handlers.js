/**
 * Footer "Back" / "Next" button behaviour, per route.
 *
 * Each mode registers its own handlers here so the footer-button wiring
 * in general.js stays generic. Unknown/unregistered routes fall back to
 * "go home", mirroring the original behaviour.
 *
 * Loaded before the mode files that populate it.
 */
(function () {
  "use strict";

  window.EBT = window.EBT || {};

  // Registry of per-route handlers:
  //   { [routeExact]: { onBack?, onNext?, matchPrefix? } }
  const _byRoute = Object.create(null);

  function register(route, handlers) {
    _byRoute[route] = handlers;
  }

  function registerPrefix(prefix, handlers) {
    _byRoute[`__prefix__:${prefix}`] = { ...handlers, matchPrefix: prefix };
  }

  function _lookup(route) {
    if (route in _byRoute) return _byRoute[route];
    for (const key of Object.keys(_byRoute)) {
      const h = _byRoute[key];
      if (h.matchPrefix && route && route.startsWith(h.matchPrefix)) return h;
    }
    return null;
  }

  function back(route) {
    const h = _lookup(route);
    if (h && typeof h.onBack === "function") return h.onBack(route);
    window.EBT.Core?.setRoute("home");
  }

  function next(route) {
    const h = _lookup(route);
    if (h && typeof h.onNext === "function") return h.onNext(route);
    window.EBT.Core?.setRoute("home");
  }

  window.EBT.Nav = { register, registerPrefix, back, next };
})();
