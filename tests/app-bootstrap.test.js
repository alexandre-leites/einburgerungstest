/**
 * End-to-end boot smoke test: load index.html into jsdom, execute every
 * script in the order declared in the HTML loader (including view.js,
 * templates.js, selectors.js, and all mode files). Verify each module's
 * registrations are present after load. Does NOT run general.js's IIFE
 * init() (which does async i18n fetches and localStorage migrations), but
 * confirms that the registration side of every file succeeds.
 */
import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { JSDOM } from "jsdom";

const ROOT = path.resolve(new URL(".", import.meta.url).pathname, "..");
const HTML = fs.readFileSync(path.join(ROOT, "docs", "index.html"), "utf8");
const PARTIAL_TEMPLATES = fs.readFileSync(
  path.join(ROOT, "docs", "partials", "templates.html"),
  "utf8",
);
const SCRIPTS_DIR = path.join(ROOT, "docs", "scripts");

// Inject the shared templates partial into a jsdom document. In production
// general.js fetches this at init via EBT.Templates.loadFromUrl; tests
// short-circuit the fetch by splicing the partial's content directly.
function installTemplates(window) {
  const container = window.document.createElement("div");
  container.innerHTML = PARTIAL_TEMPLATES;
  for (const tpl of container.querySelectorAll("template[id]")) {
    window.document.body.appendChild(tpl);
  }
}

// Order mirrors the loader array in index.html (minus general.js, which we
// can't safely execute under jsdom — it calls matchMedia in a way jsdom
// doesn't always support and awaits fetch()).
const FRAMEWORK = [
  "utils.js",
  "storage.js",
  "migrations.js",
  "validation.js",
  "i18n.js",
  "stats-store.js",
  "mydict-store.js",
  "session-store.js",
  "router.js",
  "stats-aggregations.js",
  "sessions.js",
  "data-loader.js",
  "selectors.js",
  "view.js",
  "templates.js",
];

const MODES = [
  "modes/_nav-handlers.js",
  "modes/_reset-data.js",
  "modes/_settings.js",
  "modes/_question-card.js",
  "modes/_word-ui.js",
  "modes/_keyboard-shortcuts.js",
  "modes/_test-lifecycle.js",
  "modes/_test-review-shared.js",
  "modes/_question-review-modal.js",
  "modes/home.js",
  "modes/dictionary.js",
  "modes/stats.js",
  "modes/review.js",
  "modes/test-results.js",
  "modes/test-history-view.js",
  "modes/memorization.js",
  "modes/training.js",
  "modes/test.js",
];

describe("app bootstrap (framework + modes, no general.js)", () => {
  it("loads every script and registers the expected namespaces", () => {
    const dom = new JSDOM(HTML, { runScripts: "outside-only", pretendToBeVisual: true });
    const { window } = dom;
    const ctx = dom.getInternalVMContext();

    for (const file of [...FRAMEWORK, ...MODES]) {
      const src = fs.readFileSync(path.join(SCRIPTS_DIR, file), "utf8");
      vm.runInContext(src, ctx, { filename: file });
    }

    const EBT = window.EBT;
    expect(EBT).toBeTruthy();

    // Framework modules
    expect(typeof EBT.Utils.shuffle).toBe("function");
    expect(typeof EBT.Storage.readJSON).toBe("function");
    expect(typeof EBT.Selectors.query).toBe("function");
    expect(typeof EBT.View.setTitle).toBe("function");
    expect(typeof EBT.View.mountMain).toBe("function");
    expect(typeof EBT.View.openModal).toBe("function");
    expect(typeof EBT.Templates.render).toBe("function");

    // Mode registrations
    const R = EBT.Render;
    expect(typeof R.home).toBe("function");
    expect(typeof R.dictionary).toBe("function");
    expect(typeof R.stats).toBe("function");
    expect(typeof R.review).toBe("function");
    expect(typeof R.testResults).toBe("function");
    expect(typeof R.testHistoryView).toBe("function");
    expect(typeof R.memorization).toBe("function");
    expect(typeof R.training).toBe("function");
    expect(typeof R.test).toBe("function");

    // Test-review shared helper
    expect(typeof EBT.TestReview.buildTitleCard).toBe("function");
    expect(typeof EBT.TestReview.buildReviewCard).toBe("function");

    // Newly-extracted helpers
    expect(typeof EBT.WordUI.openModal).toBe("function");
    expect(typeof EBT.WordUI.openContextMenu).toBe("function");
    expect(typeof EBT.WordUI.wireContextMenuKeyboardNav).toBe("function");
    expect(typeof EBT.WordUI.wireWordInteractions).toBe("function");
    expect(typeof EBT.Keyboard.wire).toBe("function");
    expect(typeof EBT.QuestionReviewModal.open).toBe("function");
    expect(typeof EBT.TestLifecycle.finish).toBe("function");
    expect(typeof EBT.TestLifecycle.stopTicker).toBe("function");
    expect(typeof EBT.QuestionCard.renderQuestionCard).toBe("function");
    expect(typeof EBT.QuestionCard.renderTip).toBe("function");

    // Domain modules
    expect(typeof EBT.Sessions.ensureSessionForMode).toBe("function");
    expect(typeof EBT.Sessions.pickQuestionsForTest).toBe("function");
    expect(typeof EBT.Sessions.pickNextTrainingQuestionId).toBe("function");
    expect(typeof EBT.StatsAgg.getStatsRows).toBe("function");
    expect(typeof EBT.StatsAgg.getStatsByTopic).toBe("function");
    expect(typeof EBT.StatsAgg.getTestHistoryStats).toBe("function");

    // Navigation + reset + settings helpers
    expect(typeof EBT.Nav.back).toBe("function");
    expect(typeof EBT.Nav.next).toBe("function");
    expect(typeof EBT.Nav.register).toBe("function");
    expect(typeof EBT.ResetData.readSelection).toBe("function");
    expect(typeof EBT.ResetData.applySelection).toBe("function");
    expect(typeof EBT.Settings.wire).toBe("function");
    expect(typeof EBT.Settings.initStatesSelect).toBe("function");
    expect(typeof EBT.DataLoader.load).toBe("function");
    expect(typeof EBT.DataLoader.applyQuestions).toBe("function");
    expect(typeof EBT.View.showConfirm).toBe("function");

    // i18n data-driven attribute walker
    expect(typeof EBT.View.applyI18n).toBe("function");
  });

  it("applyI18n populates every [data-i18n] element from a translate function", () => {
    const dom = new JSDOM(HTML, { runScripts: "outside-only", pretendToBeVisual: true });
    const { window } = dom;
    const ctx = dom.getInternalVMContext();
    for (const file of FRAMEWORK) {
      const src = fs.readFileSync(path.join(SCRIPTS_DIR, file), "utf8");
      vm.runInContext(src, ctx, { filename: file });
    }
    const spy = (key) => `T(${key})`;
    window.EBT.View.applyI18n(spy);
    // Check a representative sample of labelled elements.
    expect(window.document.getElementById("navHome").textContent).toBe("T(home)");
    expect(window.document.getElementById("backBtn").textContent).toBe("T(back)");
    expect(window.document.getElementById("progressLabel").textContent).toBe("T(progress)");
    expect(window.document.getElementById("confirmCancelBtn").textContent).toBe("T(cancel)");
  });

  it("view.setTitle mutates the real topbar element", () => {
    const dom = new JSDOM(HTML, { runScripts: "outside-only", pretendToBeVisual: true });
    const { window } = dom;
    const ctx = dom.getInternalVMContext();
    for (const file of FRAMEWORK) {
      const src = fs.readFileSync(path.join(SCRIPTS_DIR, file), "utf8");
      vm.runInContext(src, ctx, { filename: file });
    }
    window.EBT.View.setTitle("Hello", "World");
    expect(window.document.getElementById("routeTitle").textContent).toBe("Hello");
    expect(window.document.getElementById("routeMeta").textContent).toBe("World");
  });

  it("templates render known slots into real markup", () => {
    const dom = new JSDOM(HTML, { runScripts: "outside-only", pretendToBeVisual: true });
    const { window } = dom;
    const ctx = dom.getInternalVMContext();
    for (const file of FRAMEWORK) {
      const src = fs.readFileSync(path.join(SCRIPTS_DIR, file), "utf8");
      vm.runInContext(src, ctx, { filename: file });
    }
    installTemplates(window);
    const frag = window.EBT.Templates.render("tpl-home", {
      introTitle: "Welcome",
      introText: "Study the test",
    });
    const container = window.document.createElement("div");
    container.appendChild(frag);
    expect(container.querySelector('[data-slot="introTitle"]').textContent).toBe("Welcome");
    expect(container.querySelector('[data-slot="introText"]').textContent).toBe("Study the test");
  });
});
