/**
 * Data loader — fetches and applies the questions + base dictionary
 * payloads, with a last-known-good localStorage fallback if the network
 * fails. A pure module: the app state lives on EBT.Core.state, and
 * EBT.View handles the "loading…" / error card presentation.
 *
 * Exposes EBT.DataLoader.load(). Callers await it once during init, then
 * render the first route.
 */
(function () {
  "use strict";

  window.EBT = window.EBT || {};

  const LKG_QUESTIONS_KEY = "lkg.questions";
  const LKG_DICTIONARY_KEY = "lkg.dictionary";

  function applyQuestions(rawQuestions) {
    const Core = window.EBT.Core;
    const { questions } = window.EBT?.Validation?.filterValidQuestions
      ? window.EBT.Validation.filterValidQuestions(rawQuestions)
      : { questions: rawQuestions };
    Core.state.questions = questions;
    Core.state.questionsById = new Map(questions.map((q) => [q._id, q]));
    return questions;
  }

  function applyDictionary(rawDict) {
    const Core = window.EBT.Core;
    const sanitized = window.EBT?.Validation?.filterValidDictionary
      ? window.EBT.Validation.filterValidDictionary(rawDict).dictionary
      : rawDict;
    const aliases =
      sanitized?.aliases && typeof sanitized.aliases === "object" ? sanitized.aliases : {};
    const entries = { ...sanitized };
    delete entries.aliases;

    Core.state.baseDictionary = entries;
    Core.state.baseDictionaryAliases = aliases;

    const index = new Map();
    Object.keys(entries).forEach((lemma) =>
      index.set(String(lemma).toLowerCase(), String(lemma).toLowerCase()),
    );
    Object.keys(aliases).forEach((form) => {
      const lemma = String(aliases[form] ?? "").toLowerCase();
      if (!lemma) return;
      if (!entries[lemma]) return;
      index.set(String(form).toLowerCase(), lemma);
    });
    Core.state.baseDictionaryIndex = index;
    return sanitized;
  }

  function clearDictionaryState() {
    const state = window.EBT.Core.state;
    state.baseDictionary = {};
    state.baseDictionaryAliases = {};
    state.baseDictionaryIndex = new Map();
  }

  function saveLastKnownGood(questions, dict) {
    try {
      if (Array.isArray(questions) && questions.length > 0) {
        window.EBT.Storage.writeJSON(LKG_QUESTIONS_KEY, {
          savedAt: new Date().toISOString(),
          questions,
        });
      }
      if (dict && typeof dict === "object") {
        window.EBT.Storage.writeJSON(LKG_DICTIONARY_KEY, {
          savedAt: new Date().toISOString(),
          dictionary: dict,
        });
      }
    } catch (err) {
      // Quota is non-fatal: we just won't have an offline cache this time.
      console.warn("[loadData] failed to persist last-known-good snapshot", err);
    }
  }

  /**
   * Render the "load failed, no cache either" error card into main with
   * a retry button. Pure View layer — no templates needed.
   */
  function renderLoadErrorCard() {
    const View = window.EBT.View;
    const Core = window.EBT.Core;
    const t = Core.t;
    View.clearMain();
    const main = View.mainElement();
    if (!main) return;
    const card = document.createElement("div");
    card.className = "card";
    const title = document.createElement("div");
    title.className = "card__title";
    title.textContent = t("loadFailed");
    const retry = document.createElement("button");
    retry.type = "button";
    retry.className = "btn btn--primary";
    retry.style.marginTop = "12px";
    retry.textContent = t("retry");
    retry.addEventListener("click", () => window.location.reload());
    card.appendChild(title);
    card.appendChild(retry);
    main.appendChild(card);
  }

  async function load() {
    const Core = window.EBT.Core;
    const View = window.EBT.View;
    const Storage = window.EBT.Storage;
    const t = Core.t;

    const main = View.mainElement();
    if (main) main.textContent = t("loading");

    try {
      const [qRes, dRes] = await Promise.all([
        fetch("assets/questions.json"),
        fetch("assets/dictionary.json"),
      ]);
      if (!qRes.ok) throw new Error("questions");
      const rawQuestions = await qRes.json();
      const questions = applyQuestions(rawQuestions);

      let dictSnapshot = null;
      if (dRes.ok) {
        const rawDict = await dRes.json();
        dictSnapshot = applyDictionary(rawDict);
      } else {
        clearDictionaryState();
      }

      saveLastKnownGood(questions, dictSnapshot);
      return;
    } catch (err) {
      console.error(err);
    }

    // Network / parse / schema failure. Try last-known-good snapshot.
    const cachedQ = Storage.readJSON(LKG_QUESTIONS_KEY, null);
    const cachedD = Storage.readJSON(LKG_DICTIONARY_KEY, null);
    if (cachedQ && Array.isArray(cachedQ.questions) && cachedQ.questions.length > 0) {
      applyQuestions(cachedQ.questions);
      if (cachedD && cachedD.dictionary) applyDictionary(cachedD.dictionary);
      else clearDictionaryState();
      // Non-blocking notification; user can still study.
      setTimeout(() => View.showToast(t("loadFailedOffline")), 0);
      return;
    }

    renderLoadErrorCard();
  }

  window.EBT.DataLoader = {
    load,
    applyQuestions,
    applyDictionary,
    saveLastKnownGood,
    LKG_QUESTIONS_KEY,
    LKG_DICTIONARY_KEY,
  };
})();
