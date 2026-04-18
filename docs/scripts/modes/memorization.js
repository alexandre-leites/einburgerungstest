/**
 * Memorization renderer — browse questions one by one (random or ordered).
 * Extracted from general.js.
 */
(function () {
  "use strict";

  window.EBT = window.EBT || {};
  window.EBT.Render = window.EBT.Render || {};

  function parseTargetId(raw) {
    const s = String(raw ?? "").trim();
    if (!s) return null;
    const m = s.match(/frage-(\d+)/i) ?? s.match(/^(\d+)$/);
    if (!m) return null;
    return `frage-${Number(m[1])}`;
  }

  window.EBT.Render.memorization = function renderMemorization() {
    const Core = window.EBT.Core;
    const View = window.EBT.View;
    const Templates = window.EBT.Templates;
    if (!Core || !View || !Templates) return;

    const t = Core.t;
    const state = Core.state;

    const orderMode = state.route === "mode/memorization/ordered" ? "ordered" : "random";
    View.setActiveRoute(state.route);

    const session = Core.ensureMemorizationSession(orderMode);
    if (orderMode === "ordered" && state.memOrderedShouldReset) {
      session.index = 0;
      Core.saveSession("memorization.ordered", session);
      state.memOrderedShouldReset = false;
    }

    const qid = session.orderIds[session.index];
    const q = Core.getQuestionById(qid);
    if (!q) return;

    const label = orderMode === "ordered" ? t("memorizationOrdered") : t("memorizationRandom");
    View.setTitle(`${t("memorization")} • ${label}`, Core.getQuestionMetaLine(q));
    View.setTimer({ visible: false });
    View.setFooterVisible(true);
    View.setProgress(session.index + 1, session.orderIds.length);

    View.clearMain();
    const mainEl = View.mainElement();
    if (!mainEl) return;

    const tip = Core.renderTip("memorization", t("tipMemorizationTitle"), t("tipMemorizationText"));
    if (tip) mainEl.appendChild(tip);

    // Mode-switch (random / ordered). In the classic layout the sidebar
    // already has these as nav items; we still render the in-page
    // control so the alternate layout (which hides the sidebar entries)
    // has a visible way to switch.
    const switchFrag = Templates.render("tpl-memorization-mode-switch", {
      randomLabel: t("memorizationRandom"),
      orderedLabel: t("memorizationOrdered"),
    });
    const switchRoot = switchFrag.firstElementChild;
    const randomBtn = switchRoot.querySelector('[data-ref="random"]');
    const orderedBtn = switchRoot.querySelector('[data-ref="ordered"]');
    const activeBtn = orderMode === "ordered" ? orderedBtn : randomBtn;
    activeBtn.classList.add("btn--primary");
    activeBtn.setAttribute("aria-selected", "true");
    (orderMode === "ordered" ? randomBtn : orderedBtn).setAttribute("aria-selected", "false");
    randomBtn.addEventListener("click", () => {
      if (orderMode !== "random") Core.setRoute("mode/memorization/random");
    });
    orderedBtn.addEventListener("click", () => {
      if (orderMode !== "ordered") Core.setRoute("mode/memorization/ordered");
    });
    mainEl.appendChild(switchRoot);

    if (orderMode === "ordered") {
      const frag = Templates.render("tpl-memorization-ordered-controls", {
        goToLabel: t("goToId"),
        goLabel: t("go"),
        resetLabel: t("resetToFirst"),
      });
      const controls = frag.firstElementChild;
      const input = controls.querySelector('[data-ref="input"]');
      const goBtn = controls.querySelector('[data-action="go"]');
      const resetBtn = controls.querySelector('[data-action="reset"]');

      goBtn.addEventListener("click", () => {
        const target = parseTargetId(input.value);
        if (!target) return;
        const idx = session.orderIds.indexOf(target);
        if (idx < 0) return;
        session.index = idx;
        Core.saveSession("memorization.ordered", session);
        window.EBT.Render.memorization();
      });
      resetBtn.addEventListener("click", () => {
        session.index = 0;
        Core.saveSession("memorization.ordered", session);
        window.EBT.Render.memorization();
      });
      input.addEventListener("keydown", (ev) => {
        if (ev.key !== "Enter") return;
        goBtn.click();
      });
      mainEl.appendChild(controls);
    }

    mainEl.appendChild(
      Core.renderQuestionCard(q, {
        mode: "memorization",
        showOnlyCorrect: true,
        onChoose: null,
        chosenIndex: null,
        revealCorrectness: false,
        disableOptions: true,
        showTranslation: state.lang !== "de",
        showFeedback: false,
        feedback: null,
      }),
    );

    View.setFooterState({
      backDisabled: session.index <= 0,
      nextDisabled: session.index >= session.orderIds.length - 1,
      homeDisabled: false,
    });
  };

  // Footer back/next for memorization: step the current session index.
  function stepMemorization(route, delta) {
    const Core = window.EBT.Core;
    const orderMode = route === "mode/memorization/ordered" ? "ordered" : "random";
    const modeKey = orderMode === "ordered" ? "memorization.ordered" : "memorization.random";
    const s = Core.loadSession(modeKey) ?? Core.ensureMemorizationSession(orderMode);
    const nextIndex = s.index + delta;
    if (nextIndex >= 0 && nextIndex <= s.orderIds.length - 1) {
      s.index = nextIndex;
      Core.saveSession(modeKey, s);
    }
    Core.onRouteChange();
  }

  window.EBT.Nav?.registerPrefix("mode/memorization/", {
    onBack: (route) => stepMemorization(route, -1),
    onNext: (route) => stepMemorization(route, +1),
  });
})();
