/**
 * Shared "review a single past question" modal.
 *
 * The modal shell lives in index.html (#questionReviewModal); this file
 * clones the `tpl-question-review-body` / `tpl-question-review-option`
 * templates to populate the body card (question text + options in a
 * read-only, correct/wrong-highlighted form).
 *
 * Consumed via window.EBT.Core.openQuestionReviewModal which is installed
 * by general.js. Kept in modes/ since both test-results and
 * test-history-view invoke it.
 */
(function () {
  "use strict";

  window.EBT = window.EBT || {};

  function buildOption({ Core, question, idx, chosenIndex, wasSkipped, isCorrect, showTranslation }) {
    const Templates = window.EBT.Templates;
    const labels = ["1", "2", "3", "4"];
    const optText = question.options[idx];
    const isChosen = !wasSkipped && chosenIndex === idx;
    const isCorrectOption = idx === question.answerIndex;

    const frag = Templates.render("tpl-question-review-option", {
      badge: labels[idx],
      label: optText,
    });
    const option = frag.querySelector('[data-ref="option"]');
    if (isCorrectOption) option.classList.add("option--correct");
    else if (isChosen && !isCorrect) option.classList.add("option--wrong");

    if (showTranslation) {
      const optTr = Core.getOptionTranslation(question, idx);
      if (optTr && optTr !== optText) {
        const tr = option.querySelector('[data-ref="translation"]');
        tr.textContent = optTr;
        tr.hidden = false;
      }
    }
    return frag;
  }

  function buildCard({ Core, question, chosenIndex }) {
    const Templates = window.EBT.Templates;
    const state = Core.state;
    const showTranslation = state.lang !== "de";
    const wasSkipped = typeof chosenIndex !== "number";
    const isCorrect = !wasSkipped && chosenIndex === question.answerIndex;

    const frag = Templates.render("tpl-question-review-body", {
      text: question.question?.text ?? "",
    });

    if (showTranslation) {
      const translation = Core.getQuestionTranslation(question);
      if (translation) {
        const el = frag.querySelector('[data-ref="translation"]');
        el.textContent = translation;
        el.hidden = false;
      }
    }

    if (question.question?.image) {
      const img = frag.querySelector('[data-ref="image"]');
      img.src = question.question.image;
      img.alt = question._id;
      img.hidden = false;
    }

    const options = frag.querySelector('[data-ref="options"]');
    question.options.forEach((_optText, idx) => {
      options.appendChild(
        buildOption({ Core, question, idx, chosenIndex, wasSkipped, isCorrect, showTranslation }),
      );
    });

    return frag;
  }

  /**
   * Open the review modal for one question. Intended to be installed on
   * EBT.Core as `openQuestionReviewModal(question, chosenIndex)`.
   */
  function open(question, chosenIndex) {
    if (!question) {
      console.error("openQuestionReviewModal: question is null");
      return;
    }
    const Core = window.EBT.Core;
    const View = window.EBT.View;
    const Selectors = window.EBT.Selectors;
    if (!Core || !View || !Selectors) return;

    const t = Core.t;
    const els = Selectors.query();
    if (!els.questionReviewCard || !els.questionReviewTitle) return;

    const questionNumber = question._id.split("-")[1] || question._id;
    els.questionReviewTitle.textContent = `${t("question")} ${questionNumber}`;
    els.questionReviewSubtitle.textContent = question.category ?? "";

    els.questionReviewCard.replaceChildren(buildCard({ Core, question, chosenIndex }));

    View.openModal("questionReviewModal");
  }

  window.EBT.QuestionReviewModal = { open };
})();
