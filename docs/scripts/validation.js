/**
 * Runtime validation for data loaded from docs/assets/*.json.
 *
 * Philosophy: validation is lenient at boundaries. A single malformed question
 * should not crash the whole app — it should be dropped with a console warning
 * so the rest of the quiz still works. Hard errors are reserved for cases
 * where continuing would corrupt persisted user state (e.g. question has no
 * _id, we'd silently create ghost stats under `undefined`).
 */
(function () {
  "use strict";

  window.EBT = window.EBT || {};
  var ns = window.EBT;

  var VALID_CATEGORIES = new Set([
    "GERMANY",
    "Baden-Württemberg",
    "Bayern",
    "Berlin",
    "Brandenburg",
    "Bremen",
    "Hamburg",
    "Hessen",
    "Mecklenburg-Vorpommern",
    "Niedersachsen",
    "Nordrhein-Westfalen",
    "Rheinland-Pfalz",
    "Saarland",
    "Sachsen",
    "Sachsen-Anhalt",
    "Schleswig-Holstein",
    "Thüringen",
  ]);

  var VALID_SUB_CATEGORIES = new Set([
    "FUNDAMENTAL_RIGHTS",
    "POLITICAL_SYSTEM",
    "STATE_ADMIN",
    "HISTORY",
    "SOCIETY_WELFARE",
    "EUROPE",
  ]);

  /**
   * @param {unknown} q
   * @returns {{ ok: true } | { ok: false, reason: string }}
   */
  function validateQuestion(q) {
    if (!q || typeof q !== "object") return { ok: false, reason: "not an object" };
    var obj = /** @type {Record<string, unknown>} */ (q);
    if (typeof obj._id !== "string" || !obj._id) return { ok: false, reason: "missing _id" };
    if (typeof obj.category !== "string" || !VALID_CATEGORIES.has(obj.category)) {
      return { ok: false, reason: "unknown category: " + obj.category };
    }
    if (!obj.question || typeof obj.question !== "object") {
      return { ok: false, reason: "missing question block" };
    }
    var qb = /** @type {Record<string, unknown>} */ (obj.question);
    if (typeof qb.text !== "string") return { ok: false, reason: "missing question.text" };
    if (!Array.isArray(obj.options) || obj.options.length !== 4) {
      return { ok: false, reason: "options must be a 4-element array" };
    }
    for (var i = 0; i < 4; i++) {
      if (typeof obj.options[i] !== "string") {
        return { ok: false, reason: "options[" + i + "] is not a string" };
      }
    }
    if (typeof obj.answerIndex !== "number" || obj.answerIndex < 0 || obj.answerIndex > 3) {
      return { ok: false, reason: "answerIndex must be integer in [0,3]" };
    }
    if (
      obj.sub_category != null &&
      obj.sub_category !== "" &&
      typeof obj.sub_category === "string" &&
      !VALID_SUB_CATEGORIES.has(obj.sub_category)
    ) {
      return { ok: false, reason: "unknown sub_category: " + obj.sub_category };
    }
    return { ok: true };
  }

  /**
   * Filter an array of raw questions, dropping invalid entries with a warning.
   * @param {unknown[]} rawQuestions
   * @returns {{ questions: unknown[], dropped: Array<{ index: number, reason: string, id?: string }> }}
   */
  function filterValidQuestions(rawQuestions) {
    var dropped = [];
    var kept = [];
    if (!Array.isArray(rawQuestions)) return { questions: [], dropped: dropped };
    rawQuestions.forEach(function (q, i) {
      var res = validateQuestion(q);
      if (res.ok === true) {
        kept.push(q);
      } else {
        var qid;
        if (q && typeof q === "object") {
          var anyQ = /** @type {any} */ (q);
          qid = typeof anyQ._id === "string" ? anyQ._id : undefined;
        }
        dropped.push({ index: i, reason: res.reason, id: qid });
      }
    });
    if (dropped.length) {
      console.warn("[validation] dropped " + dropped.length + " invalid question(s):", dropped);
    }
    return { questions: kept, dropped: dropped };
  }

  /**
   * @param {unknown} entry
   * @returns {boolean}
   */
  function validateDictionaryEntry(entry) {
    if (!entry || typeof entry !== "object") return false;
    var e = /** @type {Record<string, unknown>} */ (entry);
    // At least one language must provide a description string.
    var langs = ["de", "en", "pt"];
    for (var i = 0; i < langs.length; i++) {
      var sub = /** @type {Record<string, unknown>} */ (e[langs[i]]);
      if (sub && typeof sub === "object" && typeof sub.description === "string") return true;
    }
    return false;
  }

  /**
   * Drop malformed dictionary entries in-place, returning a sanitized copy.
   * Preserves the special "aliases" key unchanged.
   * @param {Record<string, unknown>} rawDict
   * @returns {{ dictionary: Record<string, unknown>, dropped: string[] }}
   */
  function filterValidDictionary(rawDict) {
    var dropped = [];
    /** @type {Record<string, unknown>} */
    var out = {};
    if (!rawDict || typeof rawDict !== "object") {
      return { dictionary: out, dropped: dropped };
    }
    Object.keys(rawDict).forEach(function (k) {
      if (k === "aliases") {
        out.aliases = rawDict.aliases;
        return;
      }
      if (validateDictionaryEntry(rawDict[k])) {
        out[k] = rawDict[k];
      } else {
        dropped.push(k);
      }
    });
    if (dropped.length) {
      console.warn("[validation] dropped " + dropped.length + " invalid dictionary entries");
    }
    return { dictionary: out, dropped: dropped };
  }

  ns.Validation = {
    VALID_CATEGORIES: VALID_CATEGORIES,
    VALID_SUB_CATEGORIES: VALID_SUB_CATEGORIES,
    validateQuestion: validateQuestion,
    filterValidQuestions: filterValidQuestions,
    validateDictionaryEntry: validateDictionaryEntry,
    filterValidDictionary: filterValidDictionary,
  };
})();
