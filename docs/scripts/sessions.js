/**
 * Session lifecycle for every mode (memorization, training, test).
 *
 * Reaches into window.EBT.Core for configuration, app state, storage
 * shims, and Utils. general.js exposes thin wrappers on EBT.Core so
 * existing callers (and mode files) keep working.
 *
 * Depends on Core being assembled before any function here runs — which
 * is always the case since sessions are only touched after init() has
 * populated EBT.Core and the first route has dispatched.
 */
(function () {
  "use strict";

  window.EBT = window.EBT || {};

  // --------------------------------------------------------------- Pools ---

  function getGermanyPool() {
    const Core = window.EBT.Core;
    const state = Core.state;
    const APP = Core.APP;
    const germany = state.questions.filter((q) => q.category === "GERMANY");
    if (state.selectedFocusTopic === APP.focusTopicAll) return germany;
    return germany.filter((q) => q.sub_category === state.selectedFocusTopic);
  }

  function getPracticeQuestions() {
    const state = window.EBT.Core.state;
    const germany = getGermanyPool();
    const stateQs = state.questions.filter((q) => q.category === state.selectedState);
    return [...germany, ...stateQs];
  }

  function getPracticeQuestionIds() {
    return getPracticeQuestions().map((q) => q._id);
  }

  function getMemorizationQuestions() {
    return getPracticeQuestions();
  }

  function getMemorizationQuestionIds() {
    return getMemorizationQuestions().map((q) => q._id);
  }

  function getOrderedMemorizationQuestionIds() {
    const ids = getMemorizationQuestionIds();
    const parseId = (id) => {
      const parts = String(id).split("-");
      const n = Number(parts[1]);
      return Number.isFinite(n) ? n : Number.POSITIVE_INFINITY;
    };
    return [...ids].sort((a, b) => parseId(a) - parseId(b) || a.localeCompare(b));
  }

  function pickQuestionsForTest() {
    const Core = window.EBT.Core;
    const state = Core.state;
    const APP = Core.APP;
    const Utils = window.EBT.Utils;
    const Stats = window.EBT.Stats;
    const stats = Stats.readAll();
    const germanyQs = state.questions.filter((q) => q.category === "GERMANY");
    const germanyPick = Utils.pickWithWeaknessReservation(
      germanyQs,
      APP.testGermanyCount,
      APP.testWeaknessRatio,
      stats,
    );
    const stateQs = state.questions.filter((q) => q.category === state.selectedState);
    const statePick = Utils.pickWithWeaknessReservation(
      stateQs,
      APP.testStateCount,
      APP.testWeaknessRatio,
      stats,
    );
    return [...germanyPick, ...statePick];
  }

  // ------------------------------------------------------- Storage shims ---

  function storageKeyFor(mode) {
    return window.EBT.Core.storageKey(`session.${mode}`);
  }

  function loadSession(mode) {
    const session = window.EBT.Core.readJSON(storageKeyFor(mode), null);
    return session ? normalizeSchema(mode, session) : null;
  }

  /**
   * Patch a loaded session so all expected fields exist. Keeps renderers
   * and nav handlers free from defensive `if (!s.foo) s.foo = {}` checks.
   * Forward-compatible when a session was written by an older version.
   */
  function normalizeSchema(mode, session) {
    if (mode === "test") {
      if (!session.answers || typeof session.answers !== "object") session.answers = {};
      if (!session.skipped || typeof session.skipped !== "object") session.skipped = {};
    } else if (mode === "train") {
      if (!Array.isArray(session.history)) session.history = [];
      if (!session.creditsById) session.creditsById = {};
      if (!session.nextEligibleAtById) session.nextEligibleAtById = {};
      if (!session.sessionStatsById) session.sessionStatsById = {};
    }
    return session;
  }

  function saveSession(mode, session) {
    window.EBT.Core.writeJSON(storageKeyFor(mode), session);
  }

  function clearSession(mode) {
    // writeJSON can't express "delete"; go direct for removal.
    localStorage.removeItem(storageKeyFor(mode));
  }

  // --------------------------------------------------- Training internals ---

  function getTrainCredits(session, qid) {
    const APP = window.EBT.Core.APP;
    const raw = session.creditsById?.[qid];
    return typeof raw === "number" ? raw : APP.trainDefaultCredits;
  }

  function setTrainCredits(session, qid, credits) {
    if (!session.creditsById) session.creditsById = {};
    session.creditsById[qid] = credits;
  }

  function setTrainNextEligibleAt(session, qid, ts) {
    if (!session.nextEligibleAtById) session.nextEligibleAtById = {};
    session.nextEligibleAtById[qid] = ts;
  }

  function bumpTrainSessionStats(session, qid, isCorrect) {
    if (!session.sessionStatsById) session.sessionStatsById = {};
    const current = session.sessionStatsById[qid] ?? { correct: 0, wrong: 0 };
    session.sessionStatsById[qid] = {
      correct: current.correct + (isCorrect ? 1 : 0),
      wrong: current.wrong + (isCorrect ? 0 : 1),
    };
  }

  function pickNextTrainingQuestionId(session, nowMs) {
    const Utils = window.EBT.Utils;
    const APP = window.EBT.Core.APP;
    const ids =
      Array.isArray(session.poolIds) && session.poolIds.length
        ? session.poolIds
        : getPracticeQuestionIds();
    return Utils.pickTrainingQuestionId(ids, {
      credits: session.creditsById || {},
      nextEligibleAt: session.nextEligibleAtById || {},
      defaultCredits: APP.trainDefaultCredits,
      nowMs,
    });
  }

  function markTrainingShown(session, qid, nowMs) {
    const APP = window.EBT.Core.APP;
    const Utils = window.EBT.Utils;
    const delay = Utils.randInt(APP.trainCooldownMinMs, APP.trainCooldownMaxMs);
    setTrainNextEligibleAt(session, qid, nowMs + delay);
  }

  // ------------------------------------------------- Mode session factory ---

  function ensureSessionForMode(mode) {
    const Core = window.EBT.Core;
    const state = Core.state;
    const APP = Core.APP;
    const Utils = window.EBT.Utils;

    if (mode === "test") {
      let session = loadSession("test");
      if (!session || session.version !== APP.version) session = null;
      if (
        !session ||
        session.state !== state.selectedState ||
        !Array.isArray(session.questionIds)
      ) {
        const qs = pickQuestionsForTest();
        session = {
          version: APP.version,
          mode: "test",
          state: state.selectedState,
          startTimeMs: Date.now(),
          endTimeMs: Date.now() + APP.testDurationMs,
          questionIds: qs.map((q) => q._id),
          index: 0,
          answers: {},
          finished: false,
          finishedAtMs: null,
          score: null,
        };
        saveSession("test", session);
      }
      state.activeSession = session;
      return session;
    }

    let session = loadSession(mode);
    if (!session || session.version !== APP.version) session = null;

    if (mode === "train") {
      const poolIds = getPracticeQuestionIds();
      if (!poolIds.length) {
        session = {
          version: APP.version,
          mode: "train",
          state: state.selectedState,
          poolIds: [],
          currentQuestionId: null,
          history: [],
          creditsById: {},
          nextEligibleAtById: {},
          sessionStatsById: {},
          answeredCount: 0,
          currentAttempt: null,
        };
        saveSession("train", session);
        state.activeSession = session;
        return session;
      }
      if (!session || session.mode !== "train" || session.state !== state.selectedState) {
        session = {
          version: APP.version,
          mode: "train",
          state: state.selectedState,
          poolIds,
          currentQuestionId: null,
          history: [],
          creditsById: {},
          nextEligibleAtById: {},
          sessionStatsById: {},
          answeredCount: 0,
          currentAttempt: null,
        };
      }
      // Keep poolIds in sync if the questions file changed.
      session.poolIds = poolIds;
      if (!session.currentQuestionId) {
        session.currentQuestionId = pickNextTrainingQuestionId(session, Date.now());
        if (session.currentQuestionId) {
          markTrainingShown(session, session.currentQuestionId, Date.now());
        }
        saveSession("train", session);
      }
      state.activeSession = session;
      return session;
    }

    // Default: memorization-style sequential session.
    if (!session || !Array.isArray(session.orderIds)) {
      const orderIds = Utils.shuffle(getPracticeQuestionIds());
      session = {
        version: APP.version,
        mode,
        state: state.selectedState,
        orderIds,
        index: 0,
      };
      saveSession(mode, session);
    }
    if (session.state && session.state !== state.selectedState) {
      clearSession(mode);
      return ensureSessionForMode(mode);
    }
    state.activeSession = session;
    return session;
  }

  function ensureMemorizationSession(orderMode) {
    const Core = window.EBT.Core;
    const state = Core.state;
    const APP = Core.APP;
    const Utils = window.EBT.Utils;

    const modeKey = orderMode === "ordered" ? "memorization.ordered" : "memorization.random";
    let session = loadSession(modeKey);
    if (!session || session.version !== APP.version) session = null;

    const orderIds = orderMode === "ordered" ? getOrderedMemorizationQuestionIds() : null;
    if (
      !session ||
      !Array.isArray(session.orderIds) ||
      session.state !== state.selectedState ||
      session.orderMode !== orderMode
    ) {
      session = {
        version: APP.version,
        mode: "memorization",
        state: state.selectedState,
        orderMode,
        orderIds:
          orderMode === "ordered" ? orderIds : Utils.shuffle(getMemorizationQuestionIds()),
        index: 0,
        createdAtMs: Date.now(),
      };
      saveSession(modeKey, session);
    } else {
      if (orderMode === "ordered") session.orderIds = orderIds;
      if (session.index >= session.orderIds.length) {
        session.index = Math.max(0, session.orderIds.length - 1);
      }
      saveSession(modeKey, session);
    }
    state.activeSession = session;
    return session;
  }

  window.EBT.Sessions = {
    // Pools
    getGermanyPool,
    getPracticeQuestions,
    getPracticeQuestionIds,
    getMemorizationQuestions,
    getMemorizationQuestionIds,
    getOrderedMemorizationQuestionIds,
    pickQuestionsForTest,
    // Storage
    loadSession,
    saveSession,
    clearSession,
    // Mode factories
    ensureSessionForMode,
    ensureMemorizationSession,
    // Training internals
    getTrainCredits,
    setTrainCredits,
    setTrainNextEligibleAt,
    bumpTrainSessionStats,
    pickNextTrainingQuestionId,
    markTrainingShown,
  };
})();
