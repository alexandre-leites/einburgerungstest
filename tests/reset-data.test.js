/**
 * Unit tests for EBT.ResetData — the reset-data-modal business logic.
 * Drives applySelection against a mock localStorage populated with
 * prefixed keys, and asserts the right categories are erased.
 */
import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { JSDOM } from "jsdom";

const ROOT = path.resolve(new URL(".", import.meta.url).pathname, "..");
const HTML = fs.readFileSync(path.join(ROOT, "docs", "index.html"), "utf8");
const SEL = fs.readFileSync(
  path.join(ROOT, "docs", "scripts", "selectors.js"),
  "utf8",
);
const SRC = fs.readFileSync(
  path.join(ROOT, "docs", "scripts", "modes", "_reset-data.js"),
  "utf8",
);

function newCtx() {
  // Provide a URL so jsdom constructs a Storage object for window.localStorage.
  const dom = new JSDOM(HTML, {
    runScripts: "outside-only",
    pretendToBeVisual: true,
    url: "http://localhost/",
  });
  const ctx = dom.getInternalVMContext();
  vm.runInContext(SEL, ctx, { filename: "selectors.js" });
  vm.runInContext(SRC, ctx, { filename: "_reset-data.js" });
  return dom.window;
}

function installMockCore(window, initialStorage = {}) {
  const PREFIX = "ebt.";
  for (const [k, v] of Object.entries(initialStorage)) {
    window.localStorage.setItem(k, typeof v === "string" ? v : JSON.stringify(v));
  }
  const state = { lang: "de", selectedState: "Berlin", selectedFocusTopic: "ALL" };
  window.EBT.Core = {
    APP: {
      prefix: PREFIX,
      defaultLang: "de",
      defaultState: "Bavaria",
      focusTopicAll: "ALL",
    },
    state,
    storageKey: (name) => PREFIX + name,
    readJSON: (key, fallback) => {
      const raw = window.localStorage.getItem(key);
      if (raw == null) return fallback;
      try {
        return JSON.parse(raw);
      } catch {
        return fallback;
      }
    },
  };
  return state;
}

describe("EBT.ResetData.setDefaults", () => {
  it("checks all destructive categories, leaves prefs unchecked", () => {
    const window = newCtx();
    window.EBT.ResetData.setDefaults();
    const el = (id) => window.document.getElementById(id);
    expect(el("resetChkStats").checked).toBe(true);
    expect(el("resetChkSessions").checked).toBe(true);
    expect(el("resetChkDictionary").checked).toBe(true);
    expect(el("resetChkOther").checked).toBe(true);
    expect(el("resetChkLanguage").checked).toBe(false);
    expect(el("resetChkState").checked).toBe(false);
    expect(el("resetChkFocusTopic").checked).toBe(false);
  });
});

describe("EBT.ResetData.readSelection", () => {
  it("reads the current checkbox state", () => {
    const window = newCtx();
    const el = (id) => window.document.getElementById(id);
    el("resetChkStats").checked = true;
    el("resetChkDictionary").checked = false;
    el("resetChkLanguage").checked = true;
    const sel = window.EBT.ResetData.readSelection();
    expect(sel.stats).toBe(true);
    expect(sel.dictionary).toBe(false);
    expect(sel.language).toBe(true);
  });
});

describe("EBT.ResetData.applySelection", () => {
  it("erases stats keys when stats is checked", () => {
    const window = newCtx();
    installMockCore(window, {
      "ebt.statsById": { q1: { correct: 1 } },
      "ebt.testHistory": [],
      "ebt.stats.sort": "mostWrong",
      "ebt.myDictionary": {},
    });
    window.EBT.ResetData.applySelection({
      stats: true,
      sessions: false,
      dictionary: false,
      other: false,
      language: false,
      state: false,
      focusTopic: false,
    });
    expect(window.localStorage.getItem("ebt.statsById")).toBeNull();
    expect(window.localStorage.getItem("ebt.testHistory")).toBeNull();
    expect(window.localStorage.getItem("ebt.stats.sort")).toBeNull();
    // dictionary untouched
    expect(window.localStorage.getItem("ebt.myDictionary")).not.toBeNull();
  });

  it("erases all session.* keys when sessions is checked", () => {
    const window = newCtx();
    installMockCore(window, {
      "ebt.session.test": { index: 0 },
      "ebt.session.train": {},
      "ebt.session.memorization.random": {},
      "ebt.myDictionary": { a: {} },
    });
    window.EBT.ResetData.applySelection({
      stats: false,
      sessions: true,
      dictionary: false,
      other: false,
      language: false,
      state: false,
      focusTopic: false,
    });
    expect(window.localStorage.getItem("ebt.session.test")).toBeNull();
    expect(window.localStorage.getItem("ebt.session.train")).toBeNull();
    expect(window.localStorage.getItem("ebt.session.memorization.random")).toBeNull();
    expect(window.localStorage.getItem("ebt.myDictionary")).not.toBeNull();
  });

  it("preserves pref keys when their flag is false", () => {
    const window = newCtx();
    installMockCore(window, {
      "ebt.lang": '"en"',
      "ebt.selectedState": '"Berlin"',
      "ebt.selectedFocusTopic": '"ALL"',
      "ebt.session.test": {},
    });
    window.EBT.ResetData.applySelection({
      stats: false,
      sessions: true,
      dictionary: false,
      other: true,
      language: false,
      state: false,
      focusTopic: false,
    });
    // Prefs survive even though `other: true` would otherwise sweep them.
    expect(window.localStorage.getItem("ebt.lang")).not.toBeNull();
    expect(window.localStorage.getItem("ebt.selectedState")).not.toBeNull();
    expect(window.localStorage.getItem("ebt.selectedFocusTopic")).not.toBeNull();
    // Session wiped.
    expect(window.localStorage.getItem("ebt.session.test")).toBeNull();
  });

  it("resets app state fields to defaults when language+other (or state+other) are both true", () => {
    // The UI treats the pref flags as "also include" toggles — a pref key is
    // only erased when its flag is true AND `other` (the sweep flag) is true.
    const window = newCtx();
    const state = installMockCore(window, {
      "ebt.lang": '"en"',
      "ebt.selectedState": '"Berlin"',
    });
    state.lang = "en";
    state.selectedState = "Berlin";
    window.EBT.ResetData.applySelection({
      stats: false,
      sessions: false,
      dictionary: false,
      other: true,
      language: true,
      state: true,
      focusTopic: false,
    });
    // Keys removed first, then read back → default values.
    expect(state.lang).toBe("de");
    expect(state.selectedState).toBe("Bavaria");
  });

  it("leaves prefs intact when their flag is false even if `other` sweeps", () => {
    const window = newCtx();
    const state = installMockCore(window, {
      "ebt.lang": '"en"',
    });
    state.lang = "en";
    window.EBT.ResetData.applySelection({
      stats: false,
      sessions: false,
      dictionary: false,
      other: true,
      language: false,
      state: false,
      focusTopic: false,
    });
    // `other: true` sweeps, but `language: false` protects the lang key.
    expect(window.localStorage.getItem("ebt.lang")).not.toBeNull();
    expect(state.lang).toBe("en");
  });

  it("with 'other' true, wipes anything under the prefix except whitelisted prefs", () => {
    const window = newCtx();
    installMockCore(window, {
      "ebt.lang": '"de"',
      "ebt.ui.dismissTip.home": "true",
      "ebt.somethingElse": "42",
      "unprefixed.key": "leave me alone",
    });
    window.EBT.ResetData.applySelection({
      stats: false,
      sessions: false,
      dictionary: false,
      other: true,
      language: false,
      state: false,
      focusTopic: false,
    });
    expect(window.localStorage.getItem("ebt.ui.dismissTip.home")).toBeNull();
    expect(window.localStorage.getItem("ebt.somethingElse")).toBeNull();
    expect(window.localStorage.getItem("ebt.lang")).not.toBeNull();
    expect(window.localStorage.getItem("unprefixed.key")).not.toBeNull();
  });
});
