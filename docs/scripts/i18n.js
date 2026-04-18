/**
 * i18n loader. Fetches docs/assets/i18n/{de,en,pt}.json at boot and exposes:
 *   - EBT.I18N.load()            -> Promise<void>
 *   - EBT.I18N.t(lang, key)      -> string (falls back through lang -> de -> key)
 *   - EBT.I18N.has(lang, key)    -> boolean
 *   - EBT.I18N.strings           -> { de: {...}, en: {...}, pt: {...} } (populated after load)
 *
 * Kept framework-free on purpose: classic script, registers on window.EBT.
 */
(function () {
  "use strict";

  window.EBT = window.EBT || {};
  var ns = window.EBT;
  var LANGS = ["de", "en", "pt"];
  var strings = { de: {}, en: {}, pt: {} };
  var loaded = false;

  function load() {
    if (loaded) return Promise.resolve();
    return Promise.all(
      LANGS.map(function (lang) {
        return fetch("assets/i18n/" + lang + ".json", { cache: "no-cache" })
          .then(function (res) {
            if (!res.ok) throw new Error("http " + res.status);
            return res.json();
          })
          .then(function (data) {
            strings[lang] = data || {};
          })
          .catch(function (err) {
            console.warn("[i18n] failed to load " + lang + ".json:", err);
            strings[lang] = {};
          });
      }),
    ).then(function () {
      loaded = true;
    });
  }

  function t(lang, k) {
    if (!k) return "";
    var dict = strings[lang];
    if (dict && Object.prototype.hasOwnProperty.call(dict, k)) return dict[k];
    // Fallback chain: requested lang -> DE (source-of-truth) -> key itself.
    if (lang !== "de") {
      var de = strings.de;
      if (de && Object.prototype.hasOwnProperty.call(de, k)) return de[k];
    }
    return k;
  }

  function has(lang, k) {
    var dict = strings[lang];
    return !!(dict && Object.prototype.hasOwnProperty.call(dict, k));
  }

  ns.I18N = {
    LANGS: LANGS,
    strings: strings,
    load: load,
    t: t,
    has: has,
    isLoaded: function () {
      return loaded;
    },
  };
})();
