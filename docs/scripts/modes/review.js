/**
 * Review renderer — list of weak questions (most wrong first) with
 * a quick jump into training mode for each.
 * Extracted from general.js.
 */
(function () {
  "use strict";

  window.EBT = window.EBT || {};
  window.EBT.Render = window.EBT.Render || {};

  window.EBT.Render.review = function renderReview() {
    const Core = window.EBT.Core;
    const View = window.EBT.View;
    const Templates = window.EBT.Templates;
    if (!Core || !View || !Templates) return;

    const t = Core.t;

    View.setActiveRoute("mode/review");
    View.setTitle(t("review"), "");
    View.setTimer({ visible: false });
    View.setFooterVisible(true);
    View.setProgress(0, 0);

    View.clearMain();
    const mainEl = View.mainElement();
    if (!mainEl) return;

    const tip = Core.renderTip("review", t("tipReviewTitle"), t("tipReviewText"));
    if (tip) mainEl.appendChild(tip);

    const rows = Core.getStatsRows();
    if (!rows.length) {
      const emptyFrag = Templates.render("tpl-review-empty", {
        title: t("review"),
        noStats: t("noStatsYet"),
      });
      mainEl.appendChild(emptyFrag);
      View.setFooterState({ backDisabled: true, nextDisabled: true, homeDisabled: false });
      return;
    }

    rows.sort((a, b) => b.wrong - a.wrong || a.accuracy - b.accuracy);
    const top = rows.slice(0, 30);

    const frag = Templates.render("tpl-review", {
      title: t("review"),
      subtitle: t("mostWrong"),
      questionHeader: t("question"),
      attemptsHeader: t("attempts"),
      wrongHeader: t("wrong"),
      accuracyHeader: t("accuracy"),
    });
    const card = frag.firstElementChild;
    const tbody = card.querySelector('[data-ref="tbody"]');

    top.forEach((r) => {
      const questionNumber = r.id.split("-")[1] || r.id;
      const rowFrag = Templates.render("tpl-review-row", {
        number: questionNumber,
        category: r.category,
        attempts: String(r.attempts),
        wrong: String(r.wrong),
        accuracy: `${Math.round(r.accuracy * 100)}%`,
        openLabel: t("openInTraining"),
      });
      const btn = rowFrag.querySelector('[data-action="open"]');
      btn.addEventListener("click", () => {
        // Training mode picks the current question by `currentQuestionId`.
        // Force it to the question the user clicked on. Push the previous
        // current (if any) onto history so the footer "Back" button can
        // still return to it.
        const trainSession = Core.ensureSessionForMode("train");
        if (trainSession.currentQuestionId && trainSession.currentQuestionId !== r.id) {
          trainSession.history.push(trainSession.currentQuestionId);
        }
        trainSession.currentQuestionId = r.id;
        trainSession.currentAttempt = null;
        Core.saveSession("train", trainSession);
        Core.setRoute("mode/train");
      });
      tbody.appendChild(rowFrag);
    });

    mainEl.appendChild(card);
    View.setFooterState({ backDisabled: true, nextDisabled: true, homeDisabled: false });
  };
})();
