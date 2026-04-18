/**
 * The user's personal dictionary (word -> {word, addedAt}).
 *
 * Cap: at most MAX_ENTRIES. If a write would exceed the cap, the oldest
 * entries (by addedAt) are pruned first. This prevents silent data loss
 * when localStorage quota is exhausted by an ever-growing personal list.
 *
 * Depends on: EBT.Storage, EBT.Utils (canonicalWordKey).
 */
(function () {
  "use strict";

  window.EBT = window.EBT || {};
  var ns = window.EBT;
  var KEY = "myDictionary";
  // Hard cap on entries so the personal dictionary cannot grow without
  // bound and push localStorage past its per-origin quota (~5MB typical).
  // Well above any realistic per-user study word set.
  var MAX_ENTRIES = 1000;

  function canon(word) {
    return ns.Utils ? ns.Utils.canonicalWordKey(word) : String(word || "").toLowerCase();
  }

  function readAll() {
    return ns.Storage.readJSON(KEY, {}) || {};
  }

  /**
   * Remove the oldest entries until the dictionary fits within the cap.
   * Returns the trimmed object (same reference). Entries without addedAt
   * (imported legacy payloads) sort as earliest so they prune first.
   */
  function pruneToCap(obj) {
    var keys = Object.keys(obj);
    if (keys.length <= MAX_ENTRIES) return obj;
    keys.sort(function (a, b) {
      var ta = Date.parse((obj[a] && obj[a].addedAt) || "") || 0;
      var tb = Date.parse((obj[b] && obj[b].addedAt) || "") || 0;
      return ta - tb; // oldest first
    });
    var toRemove = keys.length - MAX_ENTRIES;
    for (var i = 0; i < toRemove; i++) {
      delete obj[keys[i]];
    }
    return obj;
  }

  function writeAll(obj) {
    var safe = pruneToCap(obj || {});
    var result = ns.Storage.writeJSON(KEY, safe);
    return result && result.ok ? { ok: true } : result;
  }

  function has(keyOrWord) {
    var c = canon(keyOrWord);
    if (!c) return false;
    return Object.prototype.hasOwnProperty.call(readAll(), c);
  }

  function add(keyOrWord, displayWord) {
    var c = canon(keyOrWord);
    if (!c) return false;
    var all = readAll();
    if (all[c]) return false;
    all[c] = {
      word: String(displayWord != null ? displayWord : keyOrWord),
      addedAt: new Date().toISOString(),
    };
    var res = writeAll(all);
    return !!(res && res.ok);
  }

  function remove(keyOrWord) {
    var c = canon(keyOrWord);
    if (!c) return false;
    var all = readAll();
    if (!all[c]) return false;
    delete all[c];
    writeAll(all);
    return true;
  }

  function clear() {
    writeAll({});
  }

  ns.MyDict = {
    KEY: KEY,
    MAX_ENTRIES: MAX_ENTRIES,
    readAll: readAll,
    writeAll: writeAll,
    pruneToCap: pruneToCap,
    has: has,
    add: add,
    remove: remove,
    clear: clear,
  };
})();
