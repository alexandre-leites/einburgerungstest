/**
 * Test renderer — timed full-simulation mode.
 * Extracted from general.js.
 */
(function () {
  "use strict";

  window.EBT = window.EBT || {};
  window.EBT.Render = window.EBT.Render || {};

  window.EBT.Render.test = function renderTest() {
    const Core = window.EBT.Core;
    const View = window.EBT.View;
    const Templates = window.EBT.Templates;
    if (!Core || !View || !Templates) return;

    const t = Core.t;
    const APP = Core.APP;
    const state = Core.state;

    View.setActiveRoute("mode/test");
    const session = Core.ensureSessionForMode("test");

    const qid = session.questionIds[session.index];
    const q = Core.getQuestionById(qid);
    if (!q) return;

    View.setTitle(t("test"), Core.getQuestionMetaLine(q, state.selectedState));
    View.setTimer({ visible: true });
    View.setFooterVisible(true);

    Core.stopTestTicker();
    Core.updateTestTimerUI(session);
    state.testTicker = window.setInterval(() => {
      const current = Core.loadSession("test");
      if (!current || current.finished) return;
      Core.updateTestTimerUI(current);
    }, 1000);

    const answeredCount = Object.keys(session.answers ?? {}).length;
    View.setProgress(answeredCount, APP.testTotal);

    View.clearMain();
    const mainEl = View.mainElement();
    if (!mainEl) return;

    const tip = Core.renderTip("test", t("tipTestTitle"), t("tipTestText"));
    if (tip) mainEl.appendChild(tip);

    const card = Core.renderQuestionCard(q, {
      mode: "test",
      showOnlyCorrect: false,
      revealCorrectness: false,
      disableOptions: !!session.finished,
      showTranslation: state.lang !== "de",
      showFeedback: false,
      feedback: null,
      chosenIndex: typeof session.answers[qid] === "number" ? session.answers[qid] : null,
      onChoose: (idx) => {
        const updated = Core.loadSession("test");
        if (!updated || updated.finished) return;
        updated.answers[qid] = idx;
        updated.skipped[qid] = false;
        Core.saveSession("test", updated);
        window.EBT.Render.test();
      },
    });

    const actionsFrag = Templates.render("tpl-test-actions", {
      answeredLabel: t("answered"),
      answered: `${answeredCount}/${APP.testTotal}`,
      finishLabel: t("finishTest"),
    });
    const actionsCard = actionsFrag.firstElementChild;
    actionsCard.querySelector('[data-action="finish"]').addEventListener("click", () => Core.finishTest(false));

    mainEl.appendChild(card);
    mainEl.appendChild(actionsCard);

    View.setFooterState({
      backDisabled: session.index <= 0,
      nextDisabled: session.index >= session.questionIds.length - 1,
      homeDisabled: false,
    });
  };

  window.EBT.Nav?.register("mode/test", {
    onBack: () => {
      const Core = window.EBT.Core;
      const s = Core.loadSession("test");
      if (s && s.index > 0) {
        s.index -= 1;
        Core.saveSession("test", s);
      }
      Core.onRouteChange();
    },
    onNext: () => {
      const Core = window.EBT.Core;
      const s = Core.loadSession("test");
      if (s) {
        const currentQid = s.questionIds?.[s.index];
        const hasAnswer = typeof s.answers?.[currentQid] === "number";
        if (currentQid && !hasAnswer && !s.skipped[currentQid]) {
          Core.statsBumpSkip(currentQid);
          s.skipped[currentQid] = true;
        }
        // If on last question, finish the test instead of advancing.
        if (s.index === s.questionIds.length - 1) {
          return Core.finishTest(false);
        }
      }
      if (s && s.index < s.questionIds.length - 1) {
        s.index += 1;
        Core.saveSession("test", s);
      }
      Core.onRouteChange();
    },
  });
})();
