/**
 * Training renderer — one question at a time, weight-based picker,
 * with per-attempt feedback.
 * Extracted from general.js.
 */
(function () {
  "use strict";

  window.EBT = window.EBT || {};
  window.EBT.Render = window.EBT.Render || {};

  window.EBT.Render.training = function renderTraining() {
    const Core = window.EBT.Core;
    const View = window.EBT.View;
    const Utils = window.EBT.Utils;
    if (!Core || !View || !Utils) return;

    const t = Core.t;
    const APP = Core.APP;
    const state = Core.state;

    View.setActiveRoute("mode/train");
    Core.ensureSessionForMode("train");
    const session = state.activeSession;
    const qid = session.currentQuestionId;
    const q = Core.getQuestionById(qid);
    if (!q) return;

    View.setTitle(t("training"), Core.getQuestionMetaLine(q));
    View.setTimer({ visible: false });
    View.setFooterVisible(true);
    View.setProgress(session.answeredCount ?? 0, "∞");

    const feedback = session.currentAttempt ?? null;
    const locked = !!feedback;

    View.clearMain();
    const mainEl = View.mainElement();
    if (!mainEl) return;

    const tip = Core.renderTip("training", t("tipTrainingTitle"), t("tipTrainingText"));
    if (tip) mainEl.appendChild(tip);

    mainEl.appendChild(
      Core.renderQuestionCard(q, {
        mode: "train",
        showOnlyCorrect: false,
        revealCorrectness: true,
        disableOptions: locked,
        showTranslation: state.lang !== "de",
        showFeedback: !!feedback,
        feedback,
        onChoose: (idx) => {
          const isCorrect = idx === q.answerIndex;
          Core.statsBump(q._id, isCorrect);
          const currentCredits = Core.getTrainCredits(session, qid);
          const nextCredits = Utils.nextTrainingCredits(currentCredits, isCorrect, {
            correctDelta: APP.trainCorrectDelta,
            wrongDelta: APP.trainWrongDelta,
            minCredits: APP.trainMinCredits,
          });
          Core.setTrainCredits(session, qid, nextCredits);
          Core.bumpTrainSessionStats(session, qid, isCorrect);
          session.answeredCount = (session.answeredCount ?? 0) + 1;
          session.currentAttempt = { chosenIndex: idx, isCorrect, at: new Date().toISOString() };
          Core.saveSession("train", session);
          window.EBT.Render.training();
        },
      }),
    );

    View.setFooterState({
      backDisabled: !Array.isArray(session.history) || session.history.length === 0,
      nextDisabled: false,
      homeDisabled: false,
    });
  };

  window.EBT.Nav?.register("mode/train", {
    onBack: () => {
      const Core = window.EBT.Core;
      const s = Core.ensureSessionForMode("train");
      if (Array.isArray(s.history) && s.history.length) {
        const prev = s.history.pop();
        if (prev) {
          s.currentQuestionId = prev;
          s.currentAttempt = null;
          Core.saveSession("train", s);
        }
      }
      Core.onRouteChange();
    },
    onNext: () => {
      const Core = window.EBT.Core;
      const s = Core.ensureSessionForMode("train");
      if (s.currentQuestionId && !s.currentAttempt) {
        Core.statsBumpSkip(s.currentQuestionId);
      }
      if (s.currentQuestionId) s.history.push(s.currentQuestionId);
      const Sessions = window.EBT.Sessions;
      const nextId = Sessions.pickNextTrainingQuestionId(s, Date.now());
      s.currentQuestionId = nextId;
      s.currentAttempt = null;
      if (nextId) Sessions.markTrainingShown(s, nextId, Date.now());
      Core.saveSession("train", s);
      Core.onRouteChange();
    },
  });
})();
