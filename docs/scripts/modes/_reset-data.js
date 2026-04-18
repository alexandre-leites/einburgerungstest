/**
 * Reset-data modal business logic.
 *
 * The modal shell and checkboxes live in index.html; general.js still
 * wires the reset button / OK button event listeners but delegates the
 * actual work to this file.
 */
(function () {
  "use strict";

  window.EBT = window.EBT || {};

  /**
   * Read the currently-checked reset options from the modal checkboxes.
   */
  function readSelection() {
    const els = window.EBT.Selectors.query();
    return {
      stats: !!els.resetChkStats?.checked,
      sessions: !!els.resetChkSessions?.checked,
      dictionary: !!els.resetChkDictionary?.checked,
      other: !!els.resetChkOther?.checked,
      language: !!els.resetChkLanguage?.checked,
      state: !!els.resetChkState?.checked,
      focusTopic: !!els.resetChkFocusTopic?.checked,
    };
  }

  /**
   * Set the default checkbox state (what's on when the modal first opens).
   * Mirror of the original behaviour: everything except prefs is checked.
   */
  function setDefaults() {
    const els = window.EBT.Selectors.query();
    if (els.resetChkStats) els.resetChkStats.checked = true;
    if (els.resetChkSessions) els.resetChkSessions.checked = true;
    if (els.resetChkDictionary) els.resetChkDictionary.checked = true;
    if (els.resetChkOther) els.resetChkOther.checked = true;
    if (els.resetChkLanguage) els.resetChkLanguage.checked = false;
    if (els.resetChkState) els.resetChkState.checked = false;
    if (els.resetChkFocusTopic) els.resetChkFocusTopic.checked = false;
  }

  /**
   * Erase the selected categories from localStorage. Returns a descriptor
   * the caller can use to update UI afterwards (e.g. whether language
   * changed, so selects need repopulating).
   */
  function applySelection(selection) {
    const Core = window.EBT.Core;
    if (!Core) return selection;
    const APP = Core.APP;
    const key = Core.storageKey;

    const keys = Object.keys(localStorage).filter((k) => k.startsWith(APP.prefix));
    keys.forEach((k) => {
      if (!selection.language && k === key("lang")) return;
      if (!selection.state && k === key("selectedState")) return;
      if (!selection.focusTopic && k === key("selectedFocusTopic")) return;

      if (selection.stats && (k === key("statsById") || k === key("stats.sort") || k === key("testHistory"))) {
        localStorage.removeItem(k);
        return;
      }
      if (selection.sessions && k.startsWith(key("session."))) {
        localStorage.removeItem(k);
        return;
      }
      if (selection.dictionary && k === key("myDictionary")) {
        localStorage.removeItem(k);
        return;
      }
      if (selection.other) {
        localStorage.removeItem(k);
      }
    });

    // Read defaults back into app state if prefs were cleared.
    const state = Core.state;
    if (selection.language) state.lang = Core.readJSON(key("lang"), APP.defaultLang);
    if (selection.state) state.selectedState = Core.readJSON(key("selectedState"), APP.defaultState);
    if (selection.focusTopic) state.selectedFocusTopic = Core.readJSON(key("selectedFocusTopic"), APP.focusTopicAll);

    return selection;
  }

  window.EBT.ResetData = {
    readSelection,
    setDefaults,
    applySelection,
  };
})();
