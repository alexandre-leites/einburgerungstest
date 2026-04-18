/**
 * Thin wrapper around localStorage with the app's "ebt." prefix.
 *
 * Why not use localStorage directly everywhere? Because the moment we want
 * to add schema versioning, compression, or an IndexedDB backend, every
 * call site becomes a liability. Funneling through EBT.Storage today means
 * we change one place tomorrow.
 */
(function () {
  "use strict";

  window.EBT = window.EBT || {};
  var ns = window.EBT;
  var PREFIX = "ebt.";

  function fullKey(name) {
    return PREFIX + name;
  }

  function readJSON(name, fallback) {
    try {
      var raw = localStorage.getItem(fullKey(name));
      if (raw == null || raw === "") return fallback === undefined ? null : fallback;
      return JSON.parse(raw);
    } catch (err) {
      return fallback === undefined ? null : fallback;
    }
  }

  /**
   * Persist `value` under `name`. Returns a result object rather than throwing
   * so call sites can respond to quota failures (prune caches, toast the user)
   * instead of losing writes silently. Also dispatches an
   * `ebt:storage-write-failed` CustomEvent so UI layers can toast without
   * wrapping every call site.
   * @returns {{ ok: true } | { ok: false, reason: string, error: unknown }}
   */
  function writeJSON(name, value) {
    try {
      localStorage.setItem(fullKey(name), JSON.stringify(value));
      return { ok: true };
    } catch (err) {
      var reason = "other";
      // Quota errors have well-known names/codes across browsers.
      if (
        err &&
        (err.name === "QuotaExceededError" ||
          err.name === "NS_ERROR_DOM_QUOTA_REACHED" ||
          err.code === 22 ||
          err.code === 1014)
      ) {
        reason = "quota";
      } else if (err && err.name === "SecurityError") {
        reason = "unavailable";
      }
      console.warn("[storage] write failed for " + name + " (" + reason + "):", err);
      if (typeof window !== "undefined" && typeof window.dispatchEvent === "function") {
        try {
          window.dispatchEvent(
            new CustomEvent("ebt:storage-write-failed", {
              detail: { name: name, reason: reason, error: err },
            }),
          );
        } catch (_e) {
          // CustomEvent unsupported — skip notification.
        }
      }
      return { ok: false, reason: reason, error: err };
    }
  }

  function remove(name) {
    localStorage.removeItem(fullKey(name));
  }

  /**
   * Iterate over every prefixed key and delete those for which `predicate`
   * returns truthy. Predicate receives the suffix (without prefix).
   */
  function clearMatching(predicate) {
    var toDelete = [];
    for (var i = 0; i < localStorage.length; i++) {
      var k = localStorage.key(i);
      if (!k || k.indexOf(PREFIX) !== 0) continue;
      var suffix = k.slice(PREFIX.length);
      if (predicate(suffix)) toDelete.push(k);
    }
    toDelete.forEach(function (k) {
      localStorage.removeItem(k);
    });
    return toDelete.length;
  }

  function listKeys() {
    var out = [];
    for (var i = 0; i < localStorage.length; i++) {
      var k = localStorage.key(i);
      if (k && k.indexOf(PREFIX) === 0) out.push(k.slice(PREFIX.length));
    }
    return out;
  }

  ns.Storage = {
    PREFIX: PREFIX,
    fullKey: fullKey,
    readJSON: readJSON,
    writeJSON: writeJSON,
    remove: remove,
    clearMatching: clearMatching,
    listKeys: listKeys,
  };
})();
