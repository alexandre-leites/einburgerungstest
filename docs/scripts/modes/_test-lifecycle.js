/**
 * Test-mode session lifecycle: ticker, finish flow, history persistence.
 *
 * Extracted from general.js so that all test-specific domain code lives
 * alongside modes/test.js. Exposed as window.EBT.TestLifecycle; general.js
 * installs thin shims on EBT.Core so historical call sites keep working.
 */
(function () {
  "use strict";

  window.EBT = window.EBT || {};

  function stopTicker() {
    const state = window.EBT.Core?.state;
    if (state?.testTicker) window.clearInterval(state.testTicker);
    if (state) state.testTicker = null;
  }

  function updateTimerUI(testSession) {
    const Core = window.EBT.Core;
    const View = window.EBT.View;
    const Utils = window.EBT.Utils;
    if (!Core || !View || !Utils) return;

    const remaining = testSession.endTimeMs - Date.now();
    View.setTimer({ value: Utils.formatTimeMs(remaining) });
    if (remaining <= 0) finish(true);
  }

  function saveHistory(testSession) {
    const Core = window.EBT.Core;
    if (!Core) return;
    const history = Core.readJSON(Core.storageKey("testHistory"), []);
    const testRecord = {
      timestamp: testSession.finishedAtMs || Date.now(),
      state: testSession.state,
      score: testSession.score,
      passed: (testSession.score?.correct ?? 0) >= 17,
      questionIds: testSession.questionIds,
      answers: testSession.answers,
    };
    history.push(testRecord);
    if (history.length > 50) history.shift();
    Core.writeJSON(Core.storageKey("testHistory"), history);
  }

  function finish(auto) {
    const Core = window.EBT.Core;
    if (!Core) return;
    stopTicker();

    const session = Core.loadSession("test");
    if (!session || session.finished) {
      window.EBT.Render.testResults();
      return;
    }

    const finalize = () => {
      const s = Core.loadSession("test");
      if (!s || s.finished) return;
      let correct = 0;
      s.questionIds.forEach((qid) => {
        const q = Core.getQuestionById(qid);
        const chosen = s.answers?.[qid];
        const isCorrect = typeof chosen === "number" && q && chosen === q.answerIndex;
        if (isCorrect) correct += 1;
      });
      const wrong = Core.APP.testTotal - correct;
      s.finished = true;
      s.finishedAtMs = Date.now();
      s.score = { correct, wrong };
      Core.saveSession("test", s);

      // Bump per-question stats only once, at the end of the test.
      s.questionIds.forEach((qid) => {
        const q = Core.getQuestionById(qid);
        const chosen = s.answers?.[qid];
        if (typeof chosen !== "number") {
          Core.statsBumpSkip(qid);
          return;
        }
        const isCorrect = q && chosen === q.answerIndex;
        Core.statsBump(qid, !!isCorrect);
      });

      saveHistory(s);
      window.EBT.Render.testResults();
    };

    if (auto) {
      finalize();
      return;
    }
    Core.confirmDialog(Core.t("finishTestConfirm"), finalize);
  }

  window.EBT.TestLifecycle = {
    stopTicker,
    updateTimerUI,
    finish,
    saveHistory,
  };
})();
