/**
 * Shared helpers for the test-results and test-history-view renderers.
 * Both views produce the same summary card + review table against either
 * the live session (test-results) or a stored history record
 * (test-history-view).
 *
 * All DOM construction goes through EBT.Templates — markup lives in
 * index.html, this file only wires data + event handlers.
 *
 * Loaded before modes/test-results.js and modes/test-history-view.js.
 */
(function () {
  "use strict";

  window.EBT = window.EBT || {};

  /**
   * Build a "correct / wrong / skipped" cell for the review row.
   * Returns a DocumentFragment populated from one of two templates.
   */
  function buildResultBadge(t, wasSkipped, isCorrect) {
    const Templates = window.EBT.Templates;
    if (wasSkipped) {
      return Templates.render("tpl-test-review-skipped-badge", {
        label: t("skipped"),
      });
    }
    const frag = Templates.render("tpl-test-review-result-badge", {
      label: `${isCorrect ? "✓" : "✗"} ${isCorrect ? t("correct") : t("wrong")}`,
    });
    const badge = frag.querySelector('[data-ref="badge"]');
    badge.classList.add(isCorrect ? "badge-pass" : "badge-fail");
    return frag;
  }

  /**
   * Build an "answer" cell — either a "—" dash if the question was
   * skipped, or the option's German text with an optional translation
   * underneath when the UI language isn't German.
   */
  function buildAnswerCell(state, q, optionIndex) {
    const Templates = window.EBT.Templates;
    if (typeof optionIndex !== "number") {
      return Templates.render("tpl-test-review-answer-cell-dash", {});
    }
    const germanText = q.options[optionIndex] ?? "";
    const frag = Templates.render("tpl-test-review-answer-cell", {
      main: germanText,
    });

    if (state.lang !== "de") {
      let translation = "";
      if (state.lang === "en" && q.options_en?.[optionIndex]) translation = q.options_en[optionIndex];
      else if (state.lang === "pt" && q.options_pt?.[optionIndex]) translation = q.options_pt[optionIndex];
      if (translation && translation !== germanText) {
        const tr = frag.querySelector('[data-ref="translation"]');
        tr.textContent = translation;
        tr.hidden = false;
      }
    }
    return frag;
  }

  /**
   * Build the summary-title card. Returns the card element.
   * `opts.actions` is an array of {label, variant?, onClick} used to build
   * buttons into the data-ref="actions" row.
   */
  function buildTitleCard({ t, title, passed, passLabel, correct, wrong, accuracyPct, actions }) {
    const Templates = window.EBT.Templates;
    const frag = Templates.render("tpl-test-results-title", {
      title,
      badge: `${passed ? "✓" : "✗"} ${passLabel}`,
      correctLabel: t("correct"),
      correctValue: String(correct),
      wrongLabel: t("wrong"),
      wrongValue: String(wrong),
      accuracyLabel: t("accuracy"),
      accuracyValue: `${accuracyPct}%`,
    });
    const root = frag.firstElementChild;
    const badge = root.querySelector('[data-ref="badge"]');
    badge.classList.add(passed ? "badge-pass--filled" : "badge-fail--filled");
    const actionsRow = root.querySelector('[data-ref="actions"]');
    (actions || []).forEach((a) => {
      const btnFrag = Templates.render("tpl-test-review-action-btn", {
        label: a.label,
      });
      const b = btnFrag.querySelector('[data-ref="btn"]');
      b.className = a.variant === "primary" ? "btn btn--primary" : "btn";
      b.addEventListener("click", a.onClick);
      actionsRow.appendChild(btnFrag);
    });
    return root;
  }

  /**
   * Build the question review card given the list of question ids, the
   * answers map, and a click handler. Returns the card element.
   */
  function buildReviewCard({ Core, t, state, questionIds, answers, onViewQuestion }) {
    const Templates = window.EBT.Templates;
    const frag = Templates.render("tpl-test-review-card", {
      title: t("questionReview"),
      questionHeader: t("question"),
      yourAnswerHeader: t("yourAnswer"),
      correctAnswerHeader: t("correctAnswer"),
      resultHeader: t("result"),
    });
    const root = frag.firstElementChild;
    const tbody = root.querySelector('[data-ref="tbody"]');

    questionIds.forEach((qid) => {
      const q = Core.getQuestionById(qid);
      if (!q) return;
      const chosen = answers?.[qid];
      const isCorrect = typeof chosen === "number" && chosen === q.answerIndex;
      const wasSkipped = typeof chosen !== "number";
      const questionNumber = qid.split("-")[1] || qid;

      const rowFrag = Templates.render("tpl-test-review-row", {
        number: questionNumber,
        category: q.category,
        yourAnswer: buildAnswerCell(state, q, wasSkipped ? undefined : chosen),
        correctAnswer: buildAnswerCell(state, q, q.answerIndex),
        result: buildResultBadge(t, wasSkipped, isCorrect),
      });
      const tr = rowFrag.firstElementChild;
      tr.querySelector('[data-action="viewQuestion"]').addEventListener("click", () => {
        onViewQuestion(q, chosen);
      });
      tbody.appendChild(tr);
    });
    return root;
  }

  window.EBT.TestReview = { buildTitleCard, buildReviewCard };
})();
