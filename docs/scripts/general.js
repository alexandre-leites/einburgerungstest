/* eslint-disable no-console */
(() => {
  const APP = {
    prefix: "ebt.",
    version: 1,
    defaultLang: "de",
    defaultState: "Berlin",
    testTotal: 33,
    testGermanyCount: 30,
    testStateCount: 3,
    testDurationMs: 60 * 60 * 1000,
    // Fraction of test questions reserved for the user's weakest questions
    // (lowest correct count, then lowest total views). The rest are picked
    // uniformly at random so tests stay varied.
    testWeaknessRatio: 0.4,
    // Training mode tuning. Each question starts with `trainDefaultCredits`
    // weight; weight is the picker's probability mass. Correct answers reduce
    // weight (the picker shows the question less), wrong answers raise it
    // (more reviews). Once a question is shown, it is on cooldown for a
    // random time in [min, max]ms so the user doesn't see the same question
    // twice in a row.
    trainDefaultCredits: 10,
    trainCorrectDelta: -1,
    trainWrongDelta: 2,
    trainMinCredits: 0,
    trainCooldownMinMs: 3 * 60 * 1000,
    trainCooldownMaxMs: 10 * 60 * 1000,
    focusTopicAll: "ALL",
    subCategoryKeys: [
      "FUNDAMENTAL_RIGHTS",
      "POLITICAL_SYSTEM",
      "STATE_ADMIN",
      "HISTORY",
      "SOCIETY_WELFARE",
      "EUROPE",
    ],
  };

  const state = {
    questions: [],
    questionsById: new Map(),
    baseDictionary: {}, // entries only (lemma -> {de,en,pt})
    baseDictionaryAliases: {}, // form -> lemma
    baseDictionaryIndex: new Map(), // canonical form -> lemma
    lang: APP.defaultLang,
    selectedState: APP.defaultState,
    selectedFocusTopic: APP.focusTopicAll,
    route: "home",
    activeSession: null, // {mode, orderIds, index, ...}
    testTicker: null,
    currentWord: null,
    currentWordDisplay: null,
    ignoreNextWordClick: false,
    wordLongPressTimer: null,
    prevRoute: null,
    memOrderedShouldReset: false,
  };

  const els = {};

  // Pull helpers from extracted modules (utils.js, storage.js, stats-store.js,
  // mydict-store.js). Kept as locally-named bindings so the many existing
  // call sites in this file keep working unchanged.
  const Utils = window.EBT.Utils;
  const Storage = window.EBT.Storage;
  const StatsStore = window.EBT.Stats;

  // Thin legacy shims: preserve the original (prefixed-key) signatures that
  // the rest of this file uses. New code should prefer EBT.Storage directly.
  function key(name) {
    return `${APP.prefix}${name}`;
  }
  function readJSON(storageKey, fallback) {
    const suffix =
      typeof storageKey === "string" && storageKey.indexOf(APP.prefix) === 0
        ? storageKey.slice(APP.prefix.length)
        : storageKey;
    return Storage.readJSON(suffix, fallback);
  }
  function writeJSON(storageKey, value) {
    const suffix =
      typeof storageKey === "string" && storageKey.indexOf(APP.prefix) === 0
        ? storageKey.slice(APP.prefix.length)
        : storageKey;
    Storage.writeJSON(suffix, value);
  }

  function t(id) {
    if (window.EBT && window.EBT.I18N) {
      return window.EBT.I18N.t(state.lang, id);
    }
    return id;
  }

  /**
   * Guess a language for a first-time visitor based on navigator.language.
   * Falls back to APP.defaultLang when nothing supported matches.
   */
  function detectPreferredLanguage() {
    const supported = new Set(["de", "en", "pt"]);
    try {
      const langs = Array.isArray(navigator.languages) && navigator.languages.length
        ? navigator.languages
        : [navigator.language || ""];
      for (const raw of langs) {
        if (typeof raw !== "string" || !raw) continue;
        const primary = raw.toLowerCase().split(/[-_]/)[0];
        if (supported.has(primary)) return primary;
      }
    } catch (_e) {
      // navigator may be unavailable in some environments — fall through.
    }
    return APP.defaultLang;
  }

  const FOCUS_TOPIC_LABEL_KEYS = {
    [APP.focusTopicAll]: "focusTopicAll",
    FUNDAMENTAL_RIGHTS: "focusFundamentalRights",
    POLITICAL_SYSTEM: "focusPoliticalSystem",
    STATE_ADMIN: "focusStateAdmin",
    HISTORY: "focusHistory",
    SOCIETY_WELFARE: "focusSocietyWelfare",
    EUROPE: "focusEurope",
  };

  function getSubCategoryLabel(subCategoryKey) {
    if (!subCategoryKey) return "";
    return t(FOCUS_TOPIC_LABEL_KEYS[subCategoryKey] ?? subCategoryKey);
  }

  function getQuestionMetaLine(q, prefix) {
    const parts = [];
    if (prefix) parts.push(prefix);
    parts.push(q._id);
    parts.push(q.category);
    const subLabel = q.sub_category ? getSubCategoryLabel(q.sub_category) : "";
    if (subLabel) parts.push(subLabel);
    return parts.join(" • ");
  }

  // Chrome mutations delegate to EBT.View (docs/scripts/view.js). The
  // wrappers here keep the historical call sites in this file unchanged
  // while layouts override behaviour by swapping out index.html.
  const View = window.EBT.View;

  function toast(message) {
    View.showToast(message);
  }

  // Pure helpers aliased from utils.js.
  const normalizeWord = Utils.normalizeWord;
  const canonicalWordKey = Utils.canonicalWordKey;

  function findBaseDictionaryEntry(word) {
    const w = normalizeWord(word);
    if (!w) return null;
    const canon = w.toLowerCase();
    const lemma = state.baseDictionaryIndex.get(canon) ?? canon;
    const entry = state.baseDictionary[lemma];
    if (!entry) return null;
    return { key: lemma, entry };
  }

  // Stats aliases used only during Core assembly below.
  const statsBump = StatsStore.bump;
  const statsBumpSkip = StatsStore.bumpSkip;

  const syncSidebarForViewport = View.syncSidebarForViewport;
  const closeSidebar = View.closeSidebar;

  const toggleSidebar = View.toggleSidebar;

  const openModal = View.openModal;
  const closeModal = View.closeModal;

  function confirmDialog(text, onOk) {
    View.showConfirm(text, onOk);
  }

  function setRoute(route) {
    const next = route || "home";
    state.route = next;
    if (window.EBT?.Router?.setHash) {
      window.EBT.Router.setHash(next);
    } else {
      window.location.hash = `#/${next}`;
    }
  }

  function getRouteFromHash() {
    if (window.EBT?.Router?.getRouteFromHash) {
      return window.EBT.Router.getRouteFromHash();
    }
    const raw = window.location.hash || "#/home";
    const cleaned = raw.replace(/^#\/?/, "");
    return cleaned || "home";
  }

  // Test-mode lifecycle lives in modes/_test-lifecycle.js. Thin shims are
  // kept so other parts of general.js (init, Settings.wire's
  // stopTestTicker dep) still call them by name.
  function stopTestTicker() {
    window.EBT.TestLifecycle?.stopTicker();
  }

  function updateTestTimerUI(testSession) {
    window.EBT.TestLifecycle?.updateTimerUI(testSession);
  }

  // Pool/session helpers live in scripts/sessions.js. Thin bindings for
  // Core export — anything not exported is referenced via Sessions.*
  // where needed.
  const Sessions = window.EBT.Sessions;
  const loadSession = Sessions.loadSession;
  const saveSession = Sessions.saveSession;
  const clearSession = Sessions.clearSession;
  const ensureSessionForMode = Sessions.ensureSessionForMode;
  const ensureMemorizationSession = Sessions.ensureMemorizationSession;
  const getTrainCredits = Sessions.getTrainCredits;
  const setTrainCredits = Sessions.setTrainCredits;
  const bumpTrainSessionStats = Sessions.bumpTrainSessionStats;

  function getQuestionById(id) {
    return state.questionsById.get(id) ?? null;
  }

  function getQuestionTranslation(question) {
    if (state.lang === "en") return question.question?.text_en ?? null;
    if (state.lang === "pt") return question.question?.text_pt ?? null;
    return null;
  }

  function getOptionTranslation(question, optionIndex) {
    if (state.lang === "en") return question.options_en?.[optionIndex] ?? null;
    if (state.lang === "pt") return question.options_pt?.[optionIndex] ?? null;
    return null;
  }

  // Shared question-card helpers live in modes/_question-card.js; these
  // thin shims keep the Core export stable.
  function renderQuestionCard(question, opts) {
    return window.EBT.QuestionCard?.renderQuestionCard(question, opts);
  }

  function renderTip(id, title, text) {
    return window.EBT.QuestionCard?.renderTip(id, title, text);
  }

  function finishTest(auto) {
    window.EBT.TestLifecycle?.finish(auto);
  }

  // openQuestionReviewModal lives in modes/_question-review-modal.js.
  // It reaches back into EBT.Core for t/state/question helpers.
  function openQuestionReviewModal(question, chosenIndex) {
    if (window.EBT.QuestionReviewModal) {
      return window.EBT.QuestionReviewModal.open(question, chosenIndex);
    }
  }

  // Stats aggregation lives in scripts/stats-aggregations.js. These thin
  // wrappers bind the pure functions to the current app state/context so
  // Core's callers don't need to thread the context manually.
  function statsAggCtx() {
    return {
      questions: state.questions,
      subCategoryLabelFor: getSubCategoryLabel,
      stateLabel: t("stateTopicLabel"),
    };
  }
  function getStatsRows() {
    return window.EBT.StatsAgg.getStatsRows(statsAggCtx());
  }
  function getStatsByTopic() {
    return window.EBT.StatsAgg.getStatsByTopic(statsAggCtx());
  }
  function getTestHistoryStats() {
    return window.EBT.StatsAgg.getTestHistoryStats(readJSON, key("testHistory"));
  }

  // Word UI lives in modes/_word-ui.js; these are thin shims that keep
  // the historical call sites inside this file working.
  function closeWordContextMenu() {
    window.EBT.WordUI?.closeContextMenu();
  }

  function openWordModal(wordRaw) {
    window.EBT.WordUI?.openModal(wordRaw);
  }

  // Routes are registered once and dispatched via EBT.Router. Adding a new
  // route means appending a { path, render } entry here and registering the
  // renderer on window.EBT.Render. See docs/scripts/modes/README.md for the
  // pattern used when moving a render function out of general.js.
  function registerRoutes() {
    const Router = window.EBT.Router;
    if (!Router) return;

    // Expose every render function under EBT.Render so any future mode-file
    // split can delegate to / replace entries here without touching this file.
    window.EBT.Render = window.EBT.Render || {};
    const R = window.EBT.Render;
    // All renderers are provided by docs/scripts/modes/*.js.

    Router.routes.length = 0;
    Router.registerAll([
      { path: "home", render: () => R.home() },
      { path: "mode/memorization/random", render: () => R.memorization() },
      { path: "mode/memorization/ordered", render: () => R.memorization() },
      { path: "mode/train", render: () => R.training() },
      {
        path: "mode/test",
        render: () => {
          const s = loadSession("test");
          if (s?.finished) return R.testResults();
          return R.test();
        },
      },
      { path: "mode/review", render: () => R.review() },
      { path: "stats", render: () => R.stats() },
      { path: "test-history-view", render: () => R.testHistoryView() },
      { path: "dictionary", render: () => R.dictionary() },
    ]);
  }

  function onRouteChange() {
    const Router = window.EBT.Router;
    const route = Router ? Router.getRouteFromHash() : getRouteFromHash();
    state.prevRoute = state.route;
    state.route = route;
    if (route === "mode/memorization/ordered" && state.prevRoute !== "mode/memorization/ordered") {
      state.memOrderedShouldReset = true;
    }
    closeSidebar();
    if (route !== "mode/test") stopTestTicker();
    if (Router) return Router.dispatch(route);
    // Fallback (should not be reached if router.js loaded)
    const R = window.EBT.Render || {};
    if (typeof R.home === "function") return R.home();
    return null;
  }

  function syncStaticUITexts() {
    // Every translatable label in index.html carries [data-i18n="<key>"];
    // the View layer walks them. Adding a new label is an HTML-only change.
    View.applyI18n(t);
    initFocusTopicSelect();
    document.documentElement.lang = state.lang === "pt" ? "pt-BR" : state.lang;
  }

  const FOCUS_TOPIC_SHORT_LABEL_KEYS = {
    [APP.focusTopicAll]: "focusShortAll",
    FUNDAMENTAL_RIGHTS: "focusShortFundamentalRights",
    POLITICAL_SYSTEM: "focusShortPoliticalSystem",
    STATE_ADMIN: "focusShortStateAdmin",
    HISTORY: "focusShortHistory",
    SOCIETY_WELFARE: "focusShortSocietyWelfare",
    EUROPE: "focusShortEurope",
  };

  // Thin wrappers over EBT.Settings. Kept as function names because
  // initEvents() still references them, and the data-loader pipeline
  // re-calls initStatesSelect after questions load.
  function initStatesSelect() {
    window.EBT.Settings.initStatesSelect();
  }
  function initFocusTopicSelect() {
    window.EBT.Settings.initFocusTopicSelect(
      FOCUS_TOPIC_SHORT_LABEL_KEYS,
      FOCUS_TOPIC_LABEL_KEYS,
    );
  }

  function initEvents() {
    els.sidebarOpenBtn.addEventListener("click", toggleSidebar);
    els.sidebarCloseBtn.addEventListener("click", closeSidebar);
    els.overlay.addEventListener("click", closeSidebar);

    // Surface storage failures to the user. Quota exhaustion and private-
    // mode restrictions are otherwise silent.
    window.addEventListener("ebt:storage-write-failed", (ev) => {
      const reason = ev?.detail?.reason;
      if (reason === "quota") toast(t("quotaExceeded"));
      else if (reason === "unavailable") toast(t("storageUnavailable"));
    });

    document.querySelectorAll(".nav__item[data-route]").forEach((b) => {
      b.addEventListener("click", () => {
        const route = b.getAttribute("data-route");
        // Always close, even if route is already active (hashchange won't fire)
        closeSidebar();
        if (route === state.route) {
          // Special case: if clicking Test nav item while on test results, start a new test
          if (route === "mode/test") {
            const testSession = loadSession("test");
            if (testSession?.finished) {
              clearSession("test");
              onRouteChange();
            }
          }
          return;
        }
        setRoute(route);
      });
    });

    window.EBT.Settings.wire({
      focusTopicShortLabels: FOCUS_TOPIC_SHORT_LABEL_KEYS,
      focusTopicLongLabels: FOCUS_TOPIC_LABEL_KEYS,
      onSyncTexts: syncStaticUITexts,
      onRouteChange,
      stopTestTicker,
    });

    // Footer back/next dispatch to per-route handlers registered by each
    // mode file (see modes/_nav-handlers.js). Unknown routes go home.
    els.backBtn.addEventListener("click", () => window.EBT.Nav.back(state.route));
    els.homeBtn.addEventListener("click", () => setRoute("home"));
    els.nextBtn.addEventListener("click", () => window.EBT.Nav.next(state.route));

    document.addEventListener("click", (ev) => {
      const target = ev.target;
      if (!(target instanceof HTMLElement)) return;
      const modalId = target.getAttribute("data-close-modal");
      if (modalId) closeModal(modalId);
    });

    // Word UI — context menu view/toggle buttons, keyboard nav inside the
    // menu, global word-token click dispatch, outside-click dismiss,
    // mobile long-press. All in modes/_word-ui.js.
    window.EBT.WordUI.wireWordInteractions();

    // Global keyboard shortcuts — Escape + memorization arrow keys.
    window.EBT.Keyboard.wire();

    window.addEventListener("hashchange", onRouteChange);
    // keep sidebar state consistent when switching between mobile/desktop breakpoints
    const mq = window.matchMedia("(max-width: 980px)");
    const onMqChange = () => syncSidebarForViewport();
    if (typeof mq.addEventListener === "function") mq.addEventListener("change", onMqChange);
    else if (typeof mq.addListener === "function") mq.addListener(onMqChange);
    window.addEventListener("resize", onMqChange);
  }

  // Data-loading pipeline lives in scripts/data-loader.js.
  const loadData = () => window.EBT.DataLoader.load();

  async function init() {
    // Resolve every known element via the registry in selectors.js.
    // Layouts that rename IDs or omit optional elements only change there
    // and (for omissions) ensure downstream code tolerates null targets.
    Object.assign(els, window.EBT.Selectors.query());

    // Expose EBT.Core up front — extracted modules (data-loader, settings,
    // sessions, nav-handlers, …) reach for it during init. Function
    // declarations are hoisted inside the IIFE, so every reference below is
    // valid even though some of the functions are textually defined later
    // in this file.
    // Public API consumed by mode files. Anything that is only used
    // internally by general.js stays out of this object. See
    // docs/scripts/modes/README.md for the contract.
    window.EBT.Core = {
      // Config + state
      APP,
      state,
      // Translation
      t,
      // Modal plumbing
      openModal,
      closeModal,
      confirmDialog,
      // Word UI (entry points used by dictionary mode + test review rows)
      openWordModal,
      // Shared renderers
      renderQuestionCard,
      renderTip,
      // Question helpers
      getQuestionById,
      getQuestionMetaLine,
      getQuestionTranslation,
      getOptionTranslation,
      // Session lifecycle
      loadSession,
      saveSession,
      clearSession,
      ensureSessionForMode,
      ensureMemorizationSession,
      // Dictionary lookup (used by word UI)
      findBaseDictionaryEntry,
      // Routing
      setRoute,
      onRouteChange,
      // Storage shims (prefixed keys)
      readJSON,
      writeJSON,
      storageKey: key,
      // Stats aggregations (bound to app-state)
      getStatsRows,
      getStatsByTopic,
      getTestHistoryStats,
      // Test lifecycle
      finishTest,
      stopTestTicker,
      updateTestTimerUI,
      // Question-review modal (invoked from test-results + history-view)
      openQuestionReviewModal,
      // Training internals (used by training.js nav handler)
      getTrainCredits,
      setTrainCredits,
      bumpTrainSessionStats,
      // Stats bumpers (used by training + test)
      statsBump,
      statsBumpSkip,
    };

    // Load shared view-layer templates from the partial. Layouts that ship
    // the templates inline can skip this (loadFromUrl no-ops on every
    // template id that already exists).
    if (window.EBT?.Templates?.loadFromUrl) {
      try {
        await window.EBT.Templates.loadFromUrl("partials/templates.html");
      } catch (err) {
        console.error("[templates] load failed", err);
      }
    }

    // Run data migrations before anything else touches localStorage.
    if (window.EBT?.Migrations?.run) {
      window.EBT.Migrations.run({ currentVersion: APP.version, prefix: APP.prefix });
    }

    // Load UI strings up front so t() returns real translations on first paint.
    if (window.EBT?.I18N?.load) {
      try {
        await window.EBT.I18N.load();
      } catch (err) {
        console.error("[i18n] load failed", err);
      }
    }

    // Pick up saved preference first. On first visit, fall back to the
    // browser's navigator.language if it happens to be one we support.
    const savedLang = readJSON(key("lang"), null);
    state.lang = savedLang ?? detectPreferredLanguage();
    state.selectedState = readJSON(key("selectedState"), APP.defaultState);
    state.selectedFocusTopic = readJSON(key("selectedFocusTopic"), APP.focusTopicAll);
    els.languageSelect.value = state.lang;
    syncStaticUITexts();

    await loadData();
    initStatesSelect();
    initFocusTopicSelect();
    // Ensure modals are not visible on load (helps even with cached CSS)
    closeModal("wordModal");
    closeModal("confirmModal");
    closeWordContextMenu();
    syncSidebarForViewport();
    // Migrate personal-dictionary keys to canonical lowercase if needed.
    // Belongs with the store; kept here for load-time ordering (runs before
    // the first dictionary render touches the data).
    try {
      const MyDict = window.EBT.MyDict;
      const all = MyDict.readAll();
      const migrated = {};
      let changed = false;
      Object.keys(all).forEach((k) => {
        const canon = canonicalWordKey(k);
        if (!canon) return;
        const v = all[k] ?? {};
        migrated[canon] = {
          word: v.word ?? k,
          addedAt: v.addedAt ?? v.updatedAt ?? v.createdAt ?? new Date().toISOString(),
        };
        if (canon !== k) changed = true;
      });
      if (changed) MyDict.writeAll(migrated);
    } catch (_err) {
      // Migration is best-effort; a corrupt payload shouldn't block boot.
    }
    initEvents();
    registerRoutes();

    setRoute(getRouteFromHash());
    onRouteChange();
  }

  init();
})();
