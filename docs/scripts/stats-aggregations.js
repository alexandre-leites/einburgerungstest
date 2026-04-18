/**
 * Pure stats aggregation over persisted counters and test history.
 *
 * Inputs come from:
 *   - EBT.Stats.readAll() — per-question counters
 *   - EBT.Storage / EBT.Utils.accuracyOf — no DOM access here
 *   - A questions list passed in by the caller (state.questions)
 *
 * All functions are deterministic and side-effect-free, so mode files
 * can call them freely during rendering.
 */
(function () {
  "use strict";

  window.EBT = window.EBT || {};

  /**
   * @param {{questions: Array, subCategoryLabelFor: (key: string) => string, stateLabel: string}} ctx
   */
  function getStatsRows(ctx) {
    const Stats = window.EBT.Stats;
    const Utils = window.EBT.Utils;
    if (!Stats || !Utils) return [];

    const all = Stats.readAll();
    const rows = [];
    (ctx.questions || []).forEach((q) => {
      const stat = all[q._id];
      if (!stat) return;
      const total = (stat.correct ?? 0) + (stat.wrong ?? 0);
      rows.push({
        id: q._id,
        category: q.category,
        sub_category: q.sub_category ?? null,
        correct: stat.correct ?? 0,
        wrong: stat.wrong ?? 0,
        skipped: stat.skipped ?? 0,
        attempts: total,
        accuracy: Utils.accuracyOf(stat) ?? 0,
      });
    });
    return rows;
  }

  function getStatsByTopic(ctx) {
    const rows = getStatsRows(ctx);
    const byTopic = new Map();
    rows.forEach((r) => {
      const topicKey = r.sub_category || "STATE";
      const agg = byTopic.get(topicKey) ?? {
        topicKey,
        correct: 0,
        wrong: 0,
        skipped: 0,
        attempts: 0,
      };
      agg.correct += r.correct;
      agg.wrong += r.wrong;
      agg.skipped += r.skipped;
      agg.attempts += r.attempts;
      byTopic.set(topicKey, agg);
    });
    return Array.from(byTopic.entries())
      .map(([topicKey, agg]) => {
        const total = agg.correct + agg.wrong;
        const accuracy = total > 0 ? agg.correct / total : 0;
        const label = topicKey === "STATE" ? ctx.stateLabel : ctx.subCategoryLabelFor(topicKey);
        return {
          topicKey,
          topicLabel: label,
          correct: agg.correct,
          wrong: agg.wrong,
          skipped: agg.skipped,
          attempts: agg.attempts,
          accuracy,
        };
      })
      .filter((topic) => topic.attempts > 0)
      .sort((a, b) => b.wrong - a.wrong);
  }

  /**
   * @param {(key: string) => *} readJSON
   * @param {string} historyKey — already-prefixed storage key
   */
  function getTestHistoryStats(readJSON, historyKey) {
    if (typeof readJSON !== "function") return null;
    const history = readJSON(historyKey, []);
    if (!history.length) return null;
    const totalTests = history.length;
    const totalCorrect = history.reduce((sum, test) => sum + (test.score?.correct ?? 0), 0);
    const passedTests = history.filter((test) => test.passed).length;
    return {
      totalTests,
      averageScore: totalTests > 0 ? (totalCorrect / totalTests).toFixed(1) : 0,
      passRate: totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0,
      history: history.slice().reverse(),
    };
  }

  window.EBT.StatsAgg = {
    getStatsRows,
    getStatsByTopic,
    getTestHistoryStats,
  };
})();
