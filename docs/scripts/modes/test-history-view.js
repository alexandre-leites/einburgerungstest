/**
 * Test history view — read-only rendering of one past test record.
 * Extracted from general.js.
 */
(function () {
  "use strict";

  window.EBT = window.EBT || {};
  window.EBT.Render = window.EBT.Render || {};

  function localeFor(lang) {
    if (lang === "de") return "de-DE";
    if (lang === "pt") return "pt-BR";
    return "en-US";
  }

  window.EBT.Render.testHistoryView = function renderTestHistoryView() {
    const Core = window.EBT.Core;
    const View = window.EBT.View;
    const TR = window.EBT.TestReview;
    if (!Core || !View || !TR) return;

    const t = Core.t;
    const APP = Core.APP;
    const state = Core.state;

    View.setActiveRoute("stats");

    const testRecord = Core.readJSON(Core.storageKey("viewingTestHistory"), null);
    if (!testRecord) {
      Core.setRoute("stats");
      return;
    }

    View.setTimer({ visible: false });
    View.setFooterVisible(true);
    View.clearMain();
    const mainEl = View.mainElement();
    if (!mainEl) return;

    const locale = localeFor(state.lang);
    const date = new Date(testRecord.timestamp);
    const dateStr = date.toLocaleDateString(locale);
    const timeStr = date.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });

    const score = testRecord.score?.correct ?? 0;
    const wrong = testRecord.score?.wrong ?? 0;
    const pct = Math.round((score / APP.testTotal) * 100);
    const passed = testRecord.passed;

    View.setTitle(t("testDetails"), `${dateStr} ${timeStr}`);
    View.setProgress(0, 0);

    const titleCard = TR.buildTitleCard({
      t,
      title: t("testFinished"),
      passed,
      passLabel: passed ? t("pass") : t("fail"),
      correct: score,
      wrong,
      accuracyPct: pct,
      actions: [
        {
          label: t("statistics"),
          onClick: () => Core.setRoute("stats"),
        },
      ],
    });
    mainEl.appendChild(titleCard);

    if (testRecord.questionIds && testRecord.questionIds.length > 0) {
      const reviewCard = TR.buildReviewCard({
        Core,
        t,
        state,
        questionIds: testRecord.questionIds,
        answers: testRecord.answers,
        onViewQuestion: (question, chosen) => Core.openQuestionReviewModal(question, chosen),
      });
      mainEl.appendChild(reviewCard);
    }

    View.setFooterState({ backDisabled: false, nextDisabled: true, homeDisabled: false });
  };

  window.EBT.Nav?.register("test-history-view", {
    onBack: () => window.EBT.Core?.setRoute("stats"),
  });
})();
