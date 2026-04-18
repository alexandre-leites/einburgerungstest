/**
 * The user's personal dictionary (word -> {word, addedAt}).
 *
 * Depends on: EBT.Storage, EBT.Utils (canonicalWordKey).
 */
(function () {
  "use strict";

  window.EBT = window.EBT || {};
  var ns = window.EBT;
  var KEY = "myDictionary";

  function canon(word) {
    return ns.Utils ? ns.Utils.canonicalWordKey(word) : String(word || "").toLowerCase();
  }

  function readAll() {
    return ns.Storage.readJSON(KEY, {}) || {};
  }

  function writeAll(obj) {
    ns.Storage.writeJSON(KEY, obj || {});
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
    writeAll(all);
    return true;
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
    readAll: readAll,
    writeAll: writeAll,
    has: has,
    add: add,
    remove: remove,
    clear: clear,
  };
})();
