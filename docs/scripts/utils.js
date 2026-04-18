/**
 * Pure helper functions shared by the app and by the Node-side test suite.
 *
 * Dual-export pattern: this file works both as a classic <script> in the
 * browser (populates window.EBT.Utils) and as a CommonJS module loaded by
 * Vitest / plain Node tests. Keep every function in here pure — no DOM
 * access, no localStorage, no closures over app state.
 */
(function (root, factory) {
  "use strict";
  var api = factory();
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  if (typeof root !== "undefined" && root) {
    root.EBT = root.EBT || {};
    root.EBT.Utils = api;
  }
})(typeof window !== "undefined" ? window : typeof globalThis !== "undefined" ? globalThis : null, function () {
  "use strict";

  function pad2(n) {
    return String(n).padStart(2, "0");
  }

  function formatTimeMs(ms) {
    var clamped = Math.max(0, Number(ms) || 0);
    var totalSec = Math.floor(clamped / 1000);
    var min = Math.floor(totalSec / 60);
    var sec = totalSec % 60;
    return pad2(min) + ":" + pad2(sec);
  }

  /**
   * Fisher-Yates in place shuffle. Also returns the array for convenience.
   * @template T
   * @param {T[]} array
   * @returns {T[]}
   */
  function shuffle(array) {
    for (var i = array.length - 1; i > 0; i -= 1) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = array[i];
      array[i] = array[j];
      array[j] = tmp;
    }
    return array;
  }

  function randInt(minInclusive, maxInclusive) {
    var min = Math.ceil(minInclusive);
    var max = Math.floor(maxInclusive);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function tokenize(text) {
    var re = /([A-Za-zÄÖÜäöüß]+|\s+|[^A-Za-zÄÖÜäöüß\s]+)/g;
    return String(text == null ? "" : text).match(re) || [];
  }

  function normalizeWord(word) {
    return String(word == null ? "" : word)
      .trim()
      .replace(/^[^A-Za-zÄÖÜäöüß]+|[^A-Za-zÄÖÜäöüß]+$/g, "");
  }

  function canonicalWordKey(word) {
    return normalizeWord(word).toLowerCase();
  }

  function escapeRegExp(str) {
    return String(str).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function escapeHtml(str) {
    if (str == null) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  /**
   * Tagged template helper that auto-escapes interpolated values. Use this
   * anywhere you're assigning to innerHTML with user-reachable data:
   *     el.innerHTML = html`<td>${userValue}</td>`;
   * Nested html`...` results are passed through untouched via a symbol.
   */
  var RAW_MARK = "__ebt_html_raw__";
  function html(strings, ...values) {
    var out = strings[0];
    for (var i = 0; i < values.length; i++) {
      var v = values[i];
      if (v && typeof v === "object" && v[RAW_MARK]) {
        out += v.value;
      } else {
        out += escapeHtml(v == null ? "" : v);
      }
      out += strings[i + 1];
    }
    return out;
  }
  // Mark a pre-built HTML string as safe (e.g. the output of another html``).
  html.raw = function (s) {
    var obj = {};
    obj[RAW_MARK] = true;
    obj.value = String(s == null ? "" : s);
    return obj;
  };

  function highlightWord(text, word) {
    var w = normalizeWord(word);
    if (!w) return String(text == null ? "" : text);
    var escaped = escapeRegExp(w);
    var re = new RegExp("(^|[^\\p{L}])(" + escaped + ")(?=[^\\p{L}]|$)", "giu");
    return String(text == null ? "" : text).replace(re, function (_m, p1, p2) {
      return p1 + "<strong>" + p2 + "</strong>";
    });
  }

  function accuracyOf(stat) {
    var correct = (stat && stat.correct) || 0;
    var wrong = (stat && stat.wrong) || 0;
    var total = correct + wrong;
    if (!total) return 0;
    return correct / total;
  }

  /**
   * Weakness score for a question given its stats record. Lower = weaker.
   * Primary signal: number of correct answers. Secondary: total views
   * (correct + wrong + skipped). Never-seen questions always rank first.
   */
  function weaknessKeyFor(questionId, stats) {
    var s = (stats && stats[questionId]) || {};
    var correct = s.correct || 0;
    var wrong = s.wrong || 0;
    var skipped = s.skipped || 0;
    return correct * 1000 + (correct + wrong + skipped);
  }

  /**
   * Pick `count` questions from `pool`. `weakRatio` (0..1) determines what
   * fraction of the pick is drawn from the user's weakest questions.
   *
   * Draws happen in two passes:
   *   1. Take the top `max(weakCount * 2, weakCount + 5)` weakest from the
   *      pool, shuffle, and sample `weakCount` from that band (so the exact
   *      N weakest aren't always picked in identical order).
   *   2. Fill the remainder uniformly at random from what's left.
   *
   * The returned array is itself shuffled so weak/random picks don't cluster.
   */
  function pickWithWeaknessReservation(pool, count, weakRatio, stats) {
    if (!Array.isArray(pool)) return [];
    if (pool.length <= count) return shuffle(pool.slice()).slice(0, count);
    var weakCount = Math.max(0, Math.min(count, Math.floor(count * weakRatio)));
    var randomCount = count - weakCount;

    var shuffled = shuffle(pool.slice());
    var ranked = shuffled.slice().sort(function (a, b) {
      return weaknessKeyFor(a._id, stats) - weaknessKeyFor(b._id, stats);
    });

    var candidateSize = Math.min(pool.length, Math.max(weakCount * 2, weakCount + 5));
    var weakCandidates = ranked.slice(0, candidateSize);
    var weakPick = shuffle(weakCandidates.slice()).slice(0, weakCount);

    var pickedIds = new Set(
      weakPick.map(function (q) {
        return q._id;
      }),
    );
    var rest = pool.filter(function (q) {
      return !pickedIds.has(q._id);
    });
    var randomPick = shuffle(rest).slice(0, randomCount);

    return shuffle(weakPick.concat(randomPick));
  }

  return {
    pad2: pad2,
    formatTimeMs: formatTimeMs,
    shuffle: shuffle,
    randInt: randInt,
    tokenize: tokenize,
    normalizeWord: normalizeWord,
    canonicalWordKey: canonicalWordKey,
    escapeRegExp: escapeRegExp,
    escapeHtml: escapeHtml,
    html: html,
    highlightWord: highlightWord,
    accuracyOf: accuracyOf,
    weaknessKeyFor: weaknessKeyFor,
    pickWithWeaknessReservation: pickWithWeaknessReservation,
  };
});
