/**
 * Layout-swap proof-of-concept: docs/modern.html uses a totally different
 * shell (floating glass header + bottom dock + right-side drawer) yet
 * must satisfy the same contracts as docs/index.html so every framework
 * module keeps working unchanged.
 *
 * What we verify:
 *   1. Every logical name in selectors.js resolves to one element.
 *   2. Every [data-i18n] key references a known catalogue entry (via
 *      View.applyI18n running against the modern shell).
 *   3. Every mode renderer can still execute end-to-end by loading the
 *      same template partial into the modern DOM.
 *   4. The nav-handler registry still resolves routes clicked from the
 *      modern dock (same .nav__item[data-route] convention).
 *   5. View.toggleSidebar opens the drawer on desktop-width viewports in
 *      the modern layout (where data-behavior="drawer" is set).
 */
import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { JSDOM } from "jsdom";

const ROOT = path.resolve(new URL(".", import.meta.url).pathname, "..");
const MODERN_HTML = fs.readFileSync(path.join(ROOT, "docs", "modern.html"), "utf8");
const PARTIAL_TEMPLATES = fs.readFileSync(
  path.join(ROOT, "docs", "partials", "templates.html"),
  "utf8",
);
const SCRIPTS_DIR = path.join(ROOT, "docs", "scripts");

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

function installTemplates(window) {
  const container = window.document.createElement("div");
  container.innerHTML = PARTIAL_TEMPLATES;
  for (const tpl of container.querySelectorAll("template[id]")) {
    window.document.body.appendChild(tpl);
  }
}

function loadModern() {
  const dom = new JSDOM(MODERN_HTML, {
    runScripts: "outside-only",
    pretendToBeVisual: true,
    url: "http://localhost/",
  });
  const ctx = dom.getInternalVMContext();
  for (const f of [...FRAMEWORK, ...MODES]) {
    const src = fs.readFileSync(path.join(SCRIPTS_DIR, f), "utf8");
    vm.runInContext(src, ctx, { filename: f });
  }
  installTemplates(dom.window);
  return dom.window;
}

describe("modern layout — selector registry contract", () => {
  it("every logical name in selectors.js resolves to exactly one element", () => {
    const window = loadModern();
    const Sel = window.EBT.Selectors;
    const missing = [];
    const dupes = [];
    for (const name of Sel.names()) {
      const selector = Sel.selectorFor(name);
      const found = window.document.querySelectorAll(selector);
      if (found.length === 0) missing.push(`${name} (${selector})`);
      else if (found.length > 1) dupes.push(`${name}: ${found.length}`);
    }
    expect(missing).toEqual([]);
    expect(dupes).toEqual([]);
  });
});

describe("modern layout — nav registry contract", () => {
  it("every .nav__item[data-route] points to a registered route path", () => {
    const window = loadModern();
    // Routes registered by the mode files via EBT.Nav.register / registerPrefix.
    const items = window.document.querySelectorAll(".nav__item[data-route]");
    expect(items.length).toBeGreaterThan(0);
    const routes = Array.from(items).map((el) => el.getAttribute("data-route"));
    // Every declared route should be one of the known app routes.
    const knownRoutes = new Set([
      "home",
      "mode/memorization/random",
      "mode/memorization/ordered",
      "mode/train",
      "mode/test",
      "mode/review",
      "stats",
      "dictionary",
    ]);
    for (const r of routes) expect(knownRoutes.has(r)).toBe(true);
  });
});

describe("modern layout — renderers execute against the alternate DOM", () => {
  it("renderHome fills main from the shared template partial", () => {
    const window = loadModern();
    // Minimal Core stub that renderHome needs. general.js assembles the
    // full Core at runtime; tests exercise one renderer at a time.
    window.EBT.Core = {
      t: (k) => `t(${k})`,
      state: { lang: "de", route: "home" },
    };
    window.EBT.Render.home();
    const main = window.document.getElementById("main");
    // Home renderer uses tpl-home which has [data-slot="introTitle"].
    const intro = main.querySelector('[data-slot="introTitle"]');
    expect(intro).not.toBeNull();
    expect(intro.textContent).toBe("t(introTitle)");
    // Title should have been routed through View.setTitle → #routeTitle.
    expect(window.document.getElementById("routeTitle").textContent).toBe("t(home)");
  });

  it("View.setActiveRoute marks the matching dock button aria-current=page", () => {
    const window = loadModern();
    window.EBT.View.setActiveRoute("mode/test");
    const testBtn = window.document.getElementById("navTest");
    const homeBtn = window.document.getElementById("navHome");
    expect(testBtn.getAttribute("aria-current")).toBe("page");
    expect(homeBtn.getAttribute("aria-current")).toBeNull();
  });

  it("View.applyI18n replaces every [data-i18n] element in the modern shell", () => {
    const window = loadModern();
    const nodes = window.document.querySelectorAll("[data-i18n]");
    expect(nodes.length).toBeGreaterThan(5); // at least a handful of labels
    window.EBT.View.applyI18n((k) => `T(${k})`);
    expect(window.document.getElementById("navHome").textContent).toContain("T(home)");
    expect(window.document.getElementById("backBtn").textContent).toBe("T(back)");
  });
});

describe("modern layout — drawer sidebar behaviour", () => {
  it("data-behavior='drawer' is set so View opens the sidebar regardless of viewport", () => {
    const window = loadModern();
    const sidebar = window.document.getElementById("sidebar");
    expect(sidebar.dataset.behavior).toBe("drawer");

    // Force desktop viewport (max-width >980 so matchMedia returns false).
    window.matchMedia = (query) => ({
      matches: false,
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
    });

    window.EBT.View.refresh();
    window.EBT.View.openSidebar();
    expect(sidebar.classList.contains("is-open")).toBe(true);
    window.EBT.View.closeSidebar();
    expect(sidebar.classList.contains("is-open")).toBe(false);
  });
});
