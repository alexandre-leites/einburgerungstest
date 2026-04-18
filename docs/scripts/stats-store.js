/**
 * Per-question answer statistics. Keyed by question._id.
 *
 * Depends on: EBT.Storage.
 */
(function () {
  "use strict";

  window.EBT = window.EBT || {};
  var ns = window.EBT;
  var KEY = "statsById";

  function defaultStat() {
    return {
      correct: 0,
      wrong: 0,
      skipped: 0,
      lastAnsweredAt: null,
      lastSkippedAt: null,
    };
  }

  function readAll() {
    return ns.Storage.readJSON(KEY, {}) || {};
  }

  function writeAll(obj) {
    ns.Storage.writeJSON(KEY, obj || {});
  }

  function bump(questionId, isCorrect) {
    if (!questionId) return;
    var all = readAll();
    var cur = all[questionId] || defaultStat();
    all[questionId] = Object.assign({}, cur, {
      correct: cur.correct + (isCorrect ? 1 : 0),
      wrong: cur.wrong + (isCorrect ? 0 : 1),
      lastAnsweredAt: new Date().toISOString(),
    });
    writeAll(all);
  }

  function bumpSkip(questionId) {
    if (!questionId) return;
    var all = readAll();
    var cur = all[questionId] || defaultStat();
    all[questionId] = Object.assign({}, cur, {
      skipped: (cur.skipped || 0) + 1,
      lastSkippedAt: new Date().toISOString(),
    });
    writeAll(all);
  }

  function clear() {
    writeAll({});
  }

  ns.Stats = {
    KEY: KEY,
    defaultStat: defaultStat,
    readAll: readAll,
    writeAll: writeAll,
    bump: bump,
    bumpSkip: bumpSkip,
    clear: clear,
  };
})();
