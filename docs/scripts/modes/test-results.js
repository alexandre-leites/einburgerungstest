/**
 * Test results renderer — summary of a completed test session.
 * Extracted from general.js.
 */
(function () {
  "use strict";

  window.EBT = window.EBT || {};
  window.EBT.Render = window.EBT.Render || {};

  window.EBT.Render.testResults = function renderTestResults() {
    const Core = window.EBT.Core;
    const View = window.EBT.View;
    const TR = window.EBT.TestReview;
    if (!Core || !View || !TR) return;

    const t = Core.t;
    const APP = Core.APP;

    View.setActiveRoute("mode/test");
    View.setTimer({ visible: false });
    View.setFooterVisible(true);

    const s = Core.loadSession("test");
    const score = s?.score ?? { correct: 0, wrong: 0 };
    const passed = score.correct >= 17;
    const pct = Math.round((score.correct / APP.testTotal) * 100);

    View.clearMain();
    const mainEl = View.mainElement();
    if (!mainEl) return;

    const titleCard = TR.buildTitleCard({
      t,
      title: t("testFinished"),
      passed,
      passLabel: passed ? t("pass") : t("fail"),
      correct: score.correct,
      wrong: score.wrong,
      accuracyPct: pct,
      actions: [
        {
          label: t("newTest"),
          variant: "primary",
          onClick: () => {
            Core.confirmDialog(t("newTest"), () => {
              Core.clearSession("test");
              Core.setRoute("mode/test");
              Core.onRouteChange();
            });
          },
        },
        {
          label: t("statistics"),
          onClick: () => Core.setRoute("stats"),
        },
      ],
    });
    mainEl.appendChild(titleCard);

    if (s && s.questionIds && s.questionIds.length > 0) {
      const reviewCard = TR.buildReviewCard({
        Core,
        t,
        state: Core.state,
        questionIds: s.questionIds,
        answers: s.answers,
        onViewQuestion: (question, chosen) => Core.openQuestionReviewModal(question, chosen),
      });
      mainEl.appendChild(reviewCard);
    }

    View.setTitle(t("test"), s?.state ? `${s.state}` : "");
    View.setProgress(0, 0);

    View.setFooterState({
      backDisabled: true,
      nextDisabled: true,
      homeDisabled: false,
    });
  };
})();
