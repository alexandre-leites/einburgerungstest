/**
 * Per-mode session persistence and test-history log.
 *
 * Session key convention: `session.<mode>` or `session.<mode>.<variant>`
 * (e.g. `session.memorization.ordered`). Mode owners are responsible for
 * the shape of the payload — this module is only the I/O boundary.
 *
 * Depends on: EBT.Storage.
 */
(function () {
  "use strict";

  window.EBT = window.EBT || {};
  var ns = window.EBT;

  var HISTORY_KEY = "testHistory";
  var HISTORY_MAX = 50;

  function sessionKey(mode) {
    return "session." + mode;
  }

  function load(mode) {
    return ns.Storage.readJSON(sessionKey(mode), null);
  }

  function save(mode, session) {
    ns.Storage.writeJSON(sessionKey(mode), session);
  }

  function clear(mode) {
    ns.Storage.remove(sessionKey(mode));
  }

  function clearAll() {
    return ns.Storage.clearMatching(function (suffix) {
      return suffix.indexOf("session.") === 0;
    });
  }

  function loadHistory() {
    var hist = ns.Storage.readJSON(HISTORY_KEY, []);
    return Array.isArray(hist) ? hist : [];
  }

  function saveHistory(history) {
    var list = Array.isArray(history) ? history.slice() : [];
    if (list.length > HISTORY_MAX) list = list.slice(list.length - HISTORY_MAX);
    ns.Storage.writeJSON(HISTORY_KEY, list);
  }

  function appendHistory(record) {
    var list = loadHistory();
    list.push(record);
    if (list.length > HISTORY_MAX) list = list.slice(list.length - HISTORY_MAX);
    ns.Storage.writeJSON(HISTORY_KEY, list);
  }

  function clearHistory() {
    ns.Storage.writeJSON(HISTORY_KEY, []);
  }

  ns.Session = {
    HISTORY_KEY: HISTORY_KEY,
    HISTORY_MAX: HISTORY_MAX,
    sessionKey: sessionKey,
    load: load,
    save: save,
    clear: clear,
    clearAll: clearAll,
    loadHistory: loadHistory,
    saveHistory: saveHistory,
    appendHistory: appendHistory,
    clearHistory: clearHistory,
  };
})();
