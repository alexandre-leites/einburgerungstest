/**
 * Settings UI — the language / state / focus-topic selects and the
 * "Reset data" affordance in the sidebar. All DOM wiring lives here so
 * general.js's init only has to call `EBT.Settings.wire()`.
 *
 * Depends on EBT.Core (storage, state, lang), EBT.View (modal open/close,
 * toast, apply-i18n, active-route), EBT.Sessions (clearSession),
 * EBT.ResetData (the reset-modal logic).
 */
(function () {
  "use strict";

  window.EBT = window.EBT || {};

  function focusTopicKeys() {
    const APP = window.EBT.Core.APP;
    return [APP.focusTopicAll, ...APP.subCategoryKeys];
  }

  function initStatesSelect() {
    const Core = window.EBT.Core;
    const APP = Core.APP;
    const state = Core.state;
    const els = window.EBT.Selectors.query();
    if (!els.stateSelect) return;
    const states = [...new Set(state.questions.map((q) => q.category))]
      .filter((c) => c && c !== "GERMANY")
      .sort((a, b) => a.localeCompare(b, "de"));
    els.stateSelect.replaceChildren();
    states.forEach((s) => {
      const opt = document.createElement("option");
      opt.value = s;
      opt.textContent = s;
      els.stateSelect.appendChild(opt);
    });
    if (!states.includes(state.selectedState)) {
      state.selectedState = states[0] ?? APP.defaultState;
    }
    els.stateSelect.value = state.selectedState;
  }

  function initFocusTopicSelect(shortLabels, longLabels) {
    const Core = window.EBT.Core;
    const APP = Core.APP;
    const state = Core.state;
    const els = window.EBT.Selectors.query();
    if (!els.focusTopicSelect) return;
    const keys = focusTopicKeys();
    els.focusTopicSelect.replaceChildren();
    keys.forEach((value) => {
      const opt = document.createElement("option");
      opt.value = value;
      opt.textContent = Core.t(shortLabels[value] ?? value);
      opt.title = Core.t(longLabels[value] ?? value);
      els.focusTopicSelect.appendChild(opt);
    });
    if (!keys.includes(state.selectedFocusTopic)) {
      state.selectedFocusTopic = APP.focusTopicAll;
    }
    els.focusTopicSelect.value = state.selectedFocusTopic;
  }

  /**
   * Erase the active session for every mode. Used when a setting changes
   * that invalidates in-flight sessions (state, focus-topic).
   */
  function clearModeSessions() {
    const Sessions = window.EBT.Sessions;
    Sessions.clearSession("test");
    Sessions.clearSession("memorization");
    Sessions.clearSession("memorization.random");
    Sessions.clearSession("memorization.ordered");
    Sessions.clearSession("train");
  }

  /**
   * Wire the select change handlers + reset button. Called once during
   * app init after selectors have resolved.
   *
   * @param {{
   *   focusTopicShortLabels: Record<string,string>,
   *   focusTopicLongLabels: Record<string,string>,
   *   onSyncTexts: () => void,
   *   onRouteChange: () => void,
   *   stopTestTicker: () => void,
   * }} deps
   */
  function wire(deps) {
    const Core = window.EBT.Core;
    const View = window.EBT.View;
    const state = Core.state;
    const els = window.EBT.Selectors.query();

    const writeState = (name, value) => Core.writeJSON(Core.storageKey(name), value);

    // Initial select population.
    initStatesSelect();
    initFocusTopicSelect(deps.focusTopicShortLabels, deps.focusTopicLongLabels);
    if (els.languageSelect) els.languageSelect.value = state.lang;

    const refreshAfterFilterChange = () => {
      clearModeSessions();
      // Always re-dispatch the current route — renderers need to re-pick from
      // the new pool. The previous targeted list of routes missed cases like
      // home (harmless) but was brittle; a blanket re-dispatch is cheaper.
      deps.onRouteChange();
    };

    if (els.languageSelect) {
      els.languageSelect.addEventListener("change", () => {
        state.lang = els.languageSelect.value;
        writeState("lang", state.lang);
        deps.onSyncTexts();
        deps.onRouteChange();
      });
    }
    if (els.stateSelect) {
      els.stateSelect.addEventListener("change", () => {
        state.selectedState = els.stateSelect.value;
        writeState("selectedState", state.selectedState);
        refreshAfterFilterChange();
      });
    }
    if (els.focusTopicSelect) {
      els.focusTopicSelect.addEventListener("change", () => {
        state.selectedFocusTopic = els.focusTopicSelect.value;
        writeState("selectedFocusTopic", state.selectedFocusTopic);
        refreshAfterFilterChange();
      });
    }
    if (els.resetBtn) {
      els.resetBtn.addEventListener("click", () => {
        window.EBT.ResetData.setDefaults();
        View.openModal("resetDataModal");
      });
    }
    if (els.resetDataOkBtn) {
      els.resetDataOkBtn.addEventListener("click", () => {
        const selection = window.EBT.ResetData.readSelection();
        window.EBT.ResetData.applySelection(selection);
        deps.stopTestTicker();
        View.closeModal("resetDataModal");
        if (els.languageSelect) els.languageSelect.value = state.lang;
        initStatesSelect();
        initFocusTopicSelect(deps.focusTopicShortLabels, deps.focusTopicLongLabels);
        deps.onSyncTexts();
        View.showToast(Core.t("resetDone"));
        deps.onRouteChange();
      });
    }
  }

  window.EBT.Settings = {
    initStatesSelect,
    initFocusTopicSelect,
    wire,
  };
})();
