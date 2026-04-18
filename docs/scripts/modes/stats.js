/**
 * Stats renderer — summary + per-topic + per-question tables.
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

  function buildPassBadge(passed, label) {
    const span = document.createElement("span");
    span.className = passed ? "badge-pass" : "badge-fail";
    span.textContent = `${passed ? "✓" : "✗"} ${label}`;
    return span;
  }

  window.EBT.Render.stats = function renderStats() {
    const Core = window.EBT.Core;
    const View = window.EBT.View;
    const Templates = window.EBT.Templates;
    if (!Core || !View || !Templates) return;

    const t = Core.t;
    const APP = Core.APP;
    const state = Core.state;

    View.setActiveRoute("stats");
    View.setTitle(t("statistics"), "");
    View.setTimer({ visible: false });
    View.setFooterVisible(true);
    View.setProgress(0, 0);

    View.clearMain();
    const mainEl = View.mainElement();
    if (!mainEl) return;

    // Test history summary ---------------------------------------------------
    const testStats = Core.getTestHistoryStats();
    if (testStats) {
      const frag = Templates.render("tpl-stats-summary", {
        title: t("testHistory"),
        totalTestsLabel: t("totalTests"),
        totalTests: String(testStats.totalTests),
        averageScoreLabel: t("averageScore"),
        averageScore: `${testStats.averageScore}/${APP.testTotal}`,
        passRateLabel: t("passRate"),
        passRate: `${testStats.passRate}%`,
        dateHeader: t("date"),
        scoreHeader: t("score"),
        accuracyHeader: t("accuracy"),
        resultHeader: t("result"),
      });
      const summaryCard = frag.firstElementChild;
      const historyTable = summaryCard.querySelector('[data-ref="historyTable"]');
      const historyBody = summaryCard.querySelector('[data-ref="historyBody"]');

      if (testStats.history.length > 0) {
        historyTable.hidden = false;
        const locale = localeFor(state.lang);
        testStats.history.slice(0, 10).forEach((test, idx) => {
          const date = new Date(test.timestamp);
          const dateStr = date.toLocaleDateString(locale);
          const timeStr = date.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });
          const score = test.score?.correct ?? 0;
          const pct = Math.round((score / APP.testTotal) * 100);

          const rowFrag = Templates.render("tpl-stats-history-row", {
            date: dateStr,
            time: timeStr,
            score: `${score}/${APP.testTotal}`,
            pct: `${pct}%`,
            result: buildPassBadge(test.passed, test.passed ? t("pass") : t("fail")),
          });
          const tr = rowFrag.firstElementChild;
          tr.querySelector('[data-action="viewTest"]').addEventListener("click", () => {
            Core.writeJSON(Core.storageKey("viewingTestHistory"), testStats.history[idx]);
            Core.setRoute("test-history-view");
          });
          historyBody.appendChild(tr);
        });
      }
      mainEl.appendChild(summaryCard);
    }

    // Per-question rows ------------------------------------------------------
    const rows = Core.getStatsRows();
    if (!rows.length) {
      const emptyFrag = Templates.render("tpl-stats-empty", {
        title: t("statistics"),
        text: t("noStatsYet"),
      });
      mainEl.appendChild(emptyFrag);
      View.setFooterState({ backDisabled: true, nextDisabled: true, homeDisabled: false });
      return;
    }

    // Per-topic aggregation --------------------------------------------------
    const byTopic = Core.getStatsByTopic();
    if (byTopic.length > 0) {
      const topicFrag = Templates.render("tpl-stats-by-topic", {
        title: t("statsByTopic"),
        topicHeader: t("topic"),
        correctHeader: t("correct"),
        wrongHeader: t("wrong"),
        accuracyHeader: t("accuracy"),
      });
      const topicCard = topicFrag.firstElementChild;
      const topicBody = topicCard.querySelector('[data-ref="tbody"]');
      byTopic.forEach((row) => {
        const rowFrag = Templates.render("tpl-stats-by-topic-row", {
          topic: row.topicLabel,
          correct: String(row.correct),
          wrong: String(row.wrong),
          accuracy: `${Math.round(row.accuracy * 100)}%`,
        });
        topicBody.appendChild(rowFrag);
      });
      mainEl.appendChild(topicCard);
    }

    // Per-question sorted table ----------------------------------------------
    const sort = Core.readJSON(Core.storageKey("stats.sort"), "mostWrong");
    const sortRows = (which) => {
      if (which === "mostCorrect") return rows.sort((a, b) => b.correct - a.correct);
      if (which === "mostSkipped") return rows.sort((a, b) => b.skipped - a.skipped);
      if (which === "bestAccuracy") return rows.sort((a, b) => b.accuracy - a.accuracy);
      if (which === "worstAccuracy") return rows.sort((a, b) => a.accuracy - b.accuracy);
      return rows.sort((a, b) => b.wrong - a.wrong);
    };
    sortRows(sort);

    const perQFrag = Templates.render("tpl-stats-per-question", {
      title: `${t("statistics")} • ${t("question")}`,
      sortByLabel: t("sortBy"),
      mostWrong: t("mostWrong"),
      mostCorrect: t("mostCorrect"),
      mostSkipped: t("mostSkipped"),
      bestAccuracy: t("bestAccuracy"),
      worstAccuracy: t("worstAccuracy"),
      questionHeader: t("question"),
      attemptsHeader: t("attempts"),
      correctHeader: t("correct"),
      wrongHeader: t("wrong"),
      skippedHeader: t("skipped"),
      accuracyHeader: t("accuracy"),
    });
    const perQCard = perQFrag.firstElementChild;
    const sel = perQCard.querySelector('[data-ref="sortSelect"]');
    const perQBody = perQCard.querySelector('[data-ref="tbody"]');
    rows.forEach((r) => {
      const questionNumber = r.id.split("-")[1] || r.id;
      const rowFrag = Templates.render("tpl-stats-per-question-row", {
        number: questionNumber,
        category: r.category,
        attempts: String(r.attempts),
        correct: String(r.correct),
        wrong: String(r.wrong),
        skipped: String(r.skipped),
        accuracy: `${Math.round(r.accuracy * 100)}%`,
      });
      perQBody.appendChild(rowFrag);
    });

    sel.value = sort;
    sel.addEventListener("change", () => {
      Core.writeJSON(Core.storageKey("stats.sort"), sel.value);
      window.EBT.Render.stats();
    });

    mainEl.appendChild(perQCard);

    View.setFooterState({ backDisabled: true, nextDisabled: true, homeDisabled: false });
  };
})();
