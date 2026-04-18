/**
 * Behavioural tests for EBT.TestReview (modes/_test-review-shared.js) +
 * EBT.QuestionReviewModal (modes/_question-review-modal.js). Verifies
 * the templatized DOM output matches the pre-refactor DOM shape that
 * renders the test-results and test-history-view cards.
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

function installTemplates(window) {
  const container = window.document.createElement("div");
  container.innerHTML = PARTIAL_TEMPLATES;
  for (const tpl of container.querySelectorAll("template[id]")) {
    window.document.body.appendChild(tpl);
  }
}

// Minimum set of scripts needed for these modules to execute.
const FILES = [
  "utils.js",
  "storage.js",
  "validation.js",
  "stats-store.js",
  "mydict-store.js",
  "session-store.js",
  "selectors.js",
  "view.js",
  "templates.js",
  "modes/_test-review-shared.js",
  "modes/_question-review-modal.js",
];

function newCtx() {
  const dom = new JSDOM(HTML, {
    runScripts: "outside-only",
    pretendToBeVisual: true,
    url: "http://localhost/",
  });
  const ctx = dom.getInternalVMContext();
  for (const f of FILES) {
    const src = fs.readFileSync(path.join(SCRIPTS_DIR, f), "utf8");
    vm.runInContext(src, ctx, { filename: f });
  }
  installTemplates(dom.window);
  return dom.window;
}

function installCore(window, { lang = "de" } = {}) {
  window.EBT.Core = {
    state: { lang },
    t: (key) => `t(${key})`,
    getQuestionById: () => null,
    getQuestionTranslation: (q) => q.questionTranslation ?? null,
    getOptionTranslation: (q, idx) => q.optionTranslations?.[idx] ?? null,
  };
}

function mockQuestion(overrides = {}) {
  return {
    _id: "frage-42",
    category: "GERMANY",
    question: { text: "Die Frage?" },
    options: ["Option A", "Option B", "Option C", "Option D"],
    answerIndex: 1,
    ...overrides,
  };
}

// ---------------------------------------------------------------- TestReview ---

describe("TestReview.buildTitleCard", () => {
  it("renders pill values, wires action buttons with correct variants", () => {
    const window = newCtx();
    installCore(window);
    const clicked = [];
    const card = window.EBT.TestReview.buildTitleCard({
      t: window.EBT.Core.t,
      title: "Test finished",
      passed: true,
      passLabel: "Pass",
      correct: 25,
      wrong: 8,
      accuracyPct: 76,
      actions: [
        { label: "New test", variant: "primary", onClick: () => clicked.push("new") },
        { label: "Stats", onClick: () => clicked.push("stats") },
      ],
    });

    const pills = card.querySelectorAll(".pill__value");
    expect(pills[0].textContent).toBe("25");
    expect(pills[1].textContent).toBe("8");
    expect(pills[2].textContent).toBe("76%");

    const buttons = card.querySelectorAll("button");
    expect(buttons).toHaveLength(2);
    expect(buttons[0].className).toBe("btn btn--primary");
    expect(buttons[0].textContent).toBe("New test");
    expect(buttons[1].className).toBe("btn");
    buttons[0].click();
    buttons[1].click();
    expect(clicked).toEqual(["new", "stats"]);

    // Pass badge uses the filled-green class.
    const badge = card.querySelector('[data-ref="badge"]');
    expect(badge.classList.contains("badge-pass--filled")).toBe(true);
    expect(badge.classList.contains("result-pill")).toBe(true);
  });

  it("fail gives the filled-red badge class", () => {
    const window = newCtx();
    installCore(window);
    const card = window.EBT.TestReview.buildTitleCard({
      t: window.EBT.Core.t,
      title: "x",
      passed: false,
      passLabel: "Fail",
      correct: 0,
      wrong: 33,
      accuracyPct: 0,
      actions: [],
    });
    const badge = card.querySelector('[data-ref="badge"]');
    expect(badge.classList.contains("badge-fail--filled")).toBe(true);
  });
});

describe("TestReview.buildReviewCard", () => {
  it("renders one row per question, with translations when not DE", () => {
    const window = newCtx();
    const q1 = mockQuestion({
      _id: "frage-1",
      options: ["A", "B", "C", "D"],
      options_en: ["a", "b", "c", "d"],
      answerIndex: 2,
    });
    installCore(window, { lang: "en" });
    window.EBT.Core.getQuestionById = (qid) => (qid === "frage-1" ? q1 : null);

    const seen = [];
    const card = window.EBT.TestReview.buildReviewCard({
      Core: window.EBT.Core,
      t: window.EBT.Core.t,
      state: window.EBT.Core.state,
      questionIds: ["frage-1"],
      answers: { "frage-1": 0 }, // chose A (wrong; correct was C)
      onViewQuestion: (q, chosen) => seen.push([q._id, chosen]),
    });

    const rows = card.querySelectorAll("tbody tr");
    expect(rows).toHaveLength(1);

    // Your-answer cell shows German + English translation below.
    const td = rows[0].querySelectorAll("td")[1];
    expect(td.textContent).toContain("A");
    expect(td.textContent).toContain("a");

    // Result badge gets the "fail" class and the ✗ marker.
    const badge = rows[0].querySelectorAll("td")[3].querySelector("span");
    expect(badge.classList.contains("badge-fail")).toBe(true);
    expect(badge.textContent).toContain("✗");

    // Clicking the view button invokes onViewQuestion with (q, chosen).
    rows[0].querySelector('[data-action="viewQuestion"]').click();
    expect(seen).toEqual([["frage-1", 0]]);
  });

  it("renders a dash + skipped badge when no answer was recorded", () => {
    const window = newCtx();
    const q = mockQuestion({ _id: "frage-2" });
    installCore(window, { lang: "de" });
    window.EBT.Core.getQuestionById = () => q;

    const card = window.EBT.TestReview.buildReviewCard({
      Core: window.EBT.Core,
      t: window.EBT.Core.t,
      state: window.EBT.Core.state,
      questionIds: ["frage-2"],
      answers: {}, // not answered
      onViewQuestion: () => {},
    });
    const tds = card.querySelectorAll("tbody tr td");
    // Your-answer cell is just a dash.
    expect(tds[1].textContent.trim()).toBe("—");
    // Skipped badge uses the muted class, no inline color.
    const badge = tds[3].querySelector("span");
    expect(badge.className).toBe("muted");
    expect(badge.textContent).toBe("t(skipped)");
  });

  it("correct answer shows the green badge", () => {
    const window = newCtx();
    const q = mockQuestion({ _id: "frage-3", answerIndex: 2 });
    installCore(window, { lang: "de" });
    window.EBT.Core.getQuestionById = () => q;
    const card = window.EBT.TestReview.buildReviewCard({
      Core: window.EBT.Core,
      t: window.EBT.Core.t,
      state: window.EBT.Core.state,
      questionIds: ["frage-3"],
      answers: { "frage-3": 2 },
      onViewQuestion: () => {},
    });
    const badge = card.querySelectorAll("tbody tr td")[3].querySelector("span");
    expect(badge.classList.contains("badge-pass")).toBe(true);
    expect(badge.textContent).toContain("✓");
  });
});

// ----------------------------------------------------- QuestionReviewModal ---

describe("QuestionReviewModal.open", () => {
  it("populates title, subtitle, question text and four options in the modal shell", () => {
    const window = newCtx();
    const q = mockQuestion({
      _id: "frage-200",
      category: "GERMANY",
      question: { text: "Was ist die Hauptstadt?" },
      options: ["Berlin", "München", "Hamburg", "Frankfurt"],
      answerIndex: 0,
    });
    installCore(window, { lang: "de" });

    window.EBT.QuestionReviewModal.open(q, 1);

    const title = window.document.getElementById("questionReviewTitle");
    const subtitle = window.document.getElementById("questionReviewSubtitle");
    const card = window.document
      .getElementById("questionReviewModal")
      .querySelector('[data-ref="card"]');

    expect(title.textContent).toBe("t(question) 200");
    expect(subtitle.textContent).toBe("GERMANY");
    expect(card.querySelector(".question__text").textContent).toBe("Was ist die Hauptstadt?");

    const options = card.querySelectorAll(".option");
    expect(options).toHaveLength(4);
    // Correct option (index 0) gets --correct class.
    expect(options[0].classList.contains("option--correct")).toBe(true);
    // Chosen-but-wrong option (index 1) gets --wrong class.
    expect(options[1].classList.contains("option--wrong")).toBe(true);
    // Other options stay plain.
    expect(options[2].classList.contains("option--correct")).toBe(false);
    expect(options[2].classList.contains("option--wrong")).toBe(false);
  });

  it("shows an image when question.question.image is set, otherwise keeps it hidden", () => {
    const window = newCtx();
    installCore(window, { lang: "de" });

    const qWithImage = mockQuestion({ question: { text: "x", image: "foo.png" } });
    window.EBT.QuestionReviewModal.open(qWithImage, 0);
    const cardA = window.document
      .getElementById("questionReviewModal")
      .querySelector('[data-ref="card"]');
    const imgA = cardA.querySelector("img.question__image");
    expect(imgA).not.toBeNull();
    expect(imgA.hidden).toBe(false);
    expect(imgA.getAttribute("src")).toBe("foo.png");

    const qNoImage = mockQuestion({ question: { text: "y" } });
    window.EBT.QuestionReviewModal.open(qNoImage, 0);
    const cardB = window.document
      .getElementById("questionReviewModal")
      .querySelector('[data-ref="card"]');
    const imgB = cardB.querySelector("img.question__image");
    expect(imgB.hidden).toBe(true);
  });
});
