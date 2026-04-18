/**
 * Shared render helpers for question-based modes (memorization, training,
 * test, and the review-modal and test-review rows).
 *
 * - renderSelectableText: tokenises text into clickable word buttons so the
 *   word-dictionary lookup can open on any word click.
 * - renderQuestionCard: builds the full question + options card. Behaviour
 *   is driven by `opts` — see each mode's call site for the flags in use.
 * - renderTip: builds a dismissible tip card (tip IDs persist as dismissed
 *   under the `ui.dismissTip.<id>` storage key).
 *
 * Exposed as window.EBT.QuestionCard; general.js keeps thin shims on
 * EBT.Core so mode files can keep calling Core.renderQuestionCard etc.
 */
(function () {
  "use strict";

  window.EBT = window.EBT || {};

  function renderSelectableText(container, text) {
    const Utils = window.EBT.Utils;
    if (!Utils) return;
    const tokens = Utils.tokenize(text);
    tokens.forEach((tok) => {
      if (/^[A-Za-zÄÖÜäöüß]+$/.test(tok)) {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "word";
        b.dataset.word = tok;
        b.textContent = tok;
        container.appendChild(b);
      } else {
        container.appendChild(document.createTextNode(tok));
      }
    });
  }

  function renderQuestionCard(question, opts) {
    const Core = window.EBT.Core;
    if (!Core) return document.createElement("div");
    const t = Core.t;
    const {
      mode,
      showOnlyCorrect,
      onChoose,
      chosenIndex,
      revealCorrectness,
      disableOptions,
      showTranslation,
      showFeedback,
      feedback,
    } = opts;

    const card = document.createElement("div");
    card.className = "card";

    const head = document.createElement("div");
    head.className = "question__head";

    const idLine = document.createElement("div");
    idLine.className = "question__id";
    idLine.textContent = Core.getQuestionMetaLine(question).replace(/^/, `${t("question")} • `);

    const textLine = document.createElement("div");
    textLine.className = "question__text";
    renderSelectableText(textLine, question.question?.text ?? "");

    head.appendChild(idLine);
    head.appendChild(textLine);

    const translation = showTranslation ? Core.getQuestionTranslation(question) : null;
    if (translation) {
      const tr = document.createElement("div");
      tr.className = "question__translation";
      tr.textContent = translation;
      head.appendChild(tr);
    }

    if (question.question?.image) {
      const img = document.createElement("img");
      img.className = "question__image";
      img.loading = "lazy";
      img.alt = question._id;
      img.src = question.question.image;
      img.addEventListener("error", () => {
        img.remove();
        window.EBT.View?.showToast(t("imageMissing"));
      });
      head.appendChild(img);
    }

    card.appendChild(head);

    const optionsWrap = document.createElement("div");
    optionsWrap.className = "options";

    const labels = ["1", "2", "3", "4"];
    question.options.forEach((optText, idx) => {
      const item = document.createElement("div");
      item.className = "option";
      item.setAttribute("role", "button");
      item.tabIndex = disableOptions ? -1 : 0;
      if (disableOptions) {
        item.classList.add("is-disabled");
        item.setAttribute("aria-disabled", "true");
      }

      if (showOnlyCorrect && idx !== question.answerIndex) {
        optText = "------";
      } else if (showOnlyCorrect && idx === question.answerIndex) {
        item.classList.add("option--correct");
      }

      if (mode === "test" && typeof chosenIndex === "number" && idx === chosenIndex) {
        item.classList.add("option--chosen");
      }

      if (showFeedback && feedback && typeof feedback.chosenIndex === "number") {
        const isChosen = feedback.chosenIndex === idx;
        const isCorrect = question.answerIndex === idx;
        if (revealCorrectness) {
          if (isCorrect) item.classList.add("option--correct");
          else if (isChosen && !feedback.isCorrect) item.classList.add("option--wrong");
        }
      }

      const top = document.createElement("div");
      top.className = "option__top";

      const badge = document.createElement("div");
      badge.className = "option__badge";
      badge.textContent = labels[idx];

      const text = document.createElement("div");
      text.className = "option__text";
      renderSelectableText(text, optText);

      top.appendChild(badge);
      top.appendChild(text);
      item.appendChild(top);

      const optTr = showTranslation ? Core.getOptionTranslation(question, idx) : null;
      const shouldShowOptTranslation = !!optTr && (!showOnlyCorrect || idx === question.answerIndex);
      if (shouldShowOptTranslation) {
        const tr = document.createElement("div");
        tr.className = "option__translation";
        tr.textContent = optTr;
        item.appendChild(tr);
      }

      const activate = () => {
        if (disableOptions) return;
        onChoose?.(idx);
      };
      item.addEventListener("click", activate);
      item.addEventListener("keydown", (ev) => {
        if (disableOptions) return;
        if (ev.key === "Enter" || ev.key === " ") {
          ev.preventDefault();
          activate();
        }
      });
      optionsWrap.appendChild(item);
    });

    card.appendChild(optionsWrap);
    return card;
  }

  function tipStorageKey(id) {
    return `ui.dismissTip.${id}`;
  }

  function isTipDismissed(id) {
    const Core = window.EBT.Core;
    if (!Core) return false;
    return !!Core.readJSON(Core.storageKey(tipStorageKey(id)), false);
  }

  function dismissTip(id) {
    const Core = window.EBT.Core;
    if (!Core) return;
    Core.writeJSON(Core.storageKey(tipStorageKey(id)), true);
  }

  function renderTip(id, title, text) {
    if (isTipDismissed(id)) return null;
    const Core = window.EBT.Core;
    if (!Core) return null;

    const card = document.createElement("div");
    card.className = "card";
    card.style.boxShadow = "none";

    const header = document.createElement("div");
    header.className = "row";
    header.style.justifyContent = "space-between";
    header.style.alignItems = "flex-start";
    header.style.gap = "12px";

    const left = document.createElement("div");
    const tEl = document.createElement("div");
    tEl.className = "card__title";
    tEl.textContent = title;
    const bEl = document.createElement("div");
    bEl.className = "muted";
    bEl.textContent = text;
    left.appendChild(tEl);
    left.appendChild(bEl);

    const close = document.createElement("button");
    close.type = "button";
    close.className = "btn btn--ghost";
    close.textContent = Core.t("hideTip");
    close.addEventListener("click", () => {
      dismissTip(id);
      card.remove();
    });

    header.appendChild(left);
    header.appendChild(close);
    card.appendChild(header);
    return card;
  }

  window.EBT.QuestionCard = {
    renderSelectableText,
    renderQuestionCard,
    renderTip,
  };
})();
