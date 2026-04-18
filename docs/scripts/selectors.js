/**
 * Selector registry — single source of truth for every element the app JS
 * needs to reach by ID. Layouts that want to rename/move elements only
 * update this file (and the corresponding id="..." in the HTML).
 *
 * Usage:
 *   const els = EBT.Selectors.query();        // resolves against document
 *   const els = EBT.Selectors.query(rootEl);  // resolves against a subtree
 *
 * Missing elements resolve to `null` so optional chrome can be omitted by
 * alternative layouts without breaking the app (the view layer and
 * renderers must tolerate null targets — see view.js).
 */
(function () {
  "use strict";

  window.EBT = window.EBT || {};

  // Grouped purely for readability. `query()` flattens back to one object.
  const GROUPS = {
    shell: {
      app: "#app",
      main: "#main",
      overlay: "#overlay",
      toast: "#toast",
    },
    sidebar: {
      sidebar: "#sidebar",
      sidebarOpenBtn: "#sidebarOpenBtn",
      sidebarCloseBtn: "#sidebarCloseBtn",
      brandSubtitle: "#brandSubtitle",
    },
    nav: {
      navHome: "#navHome",
      navSectionModes: "#navSectionModes",
      navMemTitle: "#navMemTitle",
      navMemRandom: "#navMemRandom",
      navMemOrdered: "#navMemOrdered",
      navTrain: "#navTrain",
      navTest: "#navTest",
      navReview: "#navReview",
      navSectionTools: "#navSectionTools",
      navStats: "#navStats",
      navDict: "#navDict",
      navSectionSettings: "#navSectionSettings",
    },
    settings: {
      languageSelect: "#languageSelect",
      languageLabel: "#languageLabel",
      stateSelect: "#stateSelect",
      stateLabel: "#stateLabel",
      focusTopicSelect: "#focusTopicSelect",
      focusTopicLabel: "#focusTopicLabel",
      resetBtn: "#resetBtn",
    },
    topbar: {
      routeTitle: "#routeTitle",
      routeMeta: "#routeMeta",
      timerPill: "#timerPill",
      timerLabel: "#timerLabel",
      timerValue: "#timerValue",
      progressLabel: "#progressLabel",
      progressValue: "#progressValue",
    },
    footer: {
      pageFooter: "#pageFooter",
      backBtn: "#backBtn",
      homeBtn: "#homeBtn",
      nextBtn: "#nextBtn",
    },
    wordModal: {
      wordModalTitle: "#wordModalTitle",
      wordModalSubtitle: "#wordModalSubtitle",
      wordBaseTitle: "#wordBaseTitle",
      wordBaseContent: "#wordBaseContent",
      wordContextMenu: "#wordContextMenu",
      wordCtxViewBtn: "#wordCtxViewBtn",
      wordCtxToggleBtn: "#wordCtxToggleBtn",
    },
    confirmModal: {
      confirmTitle: "#confirmTitle",
      confirmText: "#confirmText",
      confirmCancelBtn: "#confirmCancelBtn",
      confirmOkBtn: "#confirmOkBtn",
    },
    questionReviewModal: {
      questionReviewTitle: "#questionReviewTitle",
      questionReviewSubtitle: "#questionReviewSubtitle",
      questionReviewCard: '#questionReviewModal [data-ref="card"]',
    },
    resetDataModal: {
      resetDataTitle: "#resetDataTitle",
      resetDataSubtitle: "#resetDataSubtitle",
      resetStatsLabel: "#resetStatsLabel",
      resetSessionsLabel: "#resetSessionsLabel",
      resetDictionaryLabel: "#resetDictionaryLabel",
      resetOtherLabel: "#resetOtherLabel",
      resetLanguageLabel: "#resetLanguageLabel",
      resetStateLabel: "#resetStateLabel",
      resetFocusTopicLabel: "#resetFocusTopicLabel",
      resetChkStats: "#resetChkStats",
      resetChkSessions: "#resetChkSessions",
      resetChkDictionary: "#resetChkDictionary",
      resetChkOther: "#resetChkOther",
      resetChkLanguage: "#resetChkLanguage",
      resetChkState: "#resetChkState",
      resetChkFocusTopic: "#resetChkFocusTopic",
      resetDataCancelBtn: "#resetDataCancelBtn",
      resetDataOkBtn: "#resetDataOkBtn",
    },
  };

  // Flatten GROUPS into a single {logicalName: cssSelector} map.
  const FLAT = Object.create(null);
  for (const groupName of Object.keys(GROUPS)) {
    const group = GROUPS[groupName];
    for (const name of Object.keys(group)) {
      FLAT[name] = group[name];
    }
  }

  function query(root) {
    const scope = root || document;
    const out = Object.create(null);
    for (const name of Object.keys(FLAT)) {
      out[name] = scope.querySelector(FLAT[name]);
    }
    return out;
  }

  function names() {
    return Object.keys(FLAT);
  }

  function selectorFor(name) {
    return FLAT[name];
  }

  window.EBT.Selectors = { query, names, selectorFor, GROUPS };
})();
