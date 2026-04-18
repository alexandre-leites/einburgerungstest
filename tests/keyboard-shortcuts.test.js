/**
 * Unit tests for EBT.Keyboard.wire() — Escape dispatch and the
 * conditions under which memorization Arrow keys fire Back/Next.
 */
import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { JSDOM } from "jsdom";

const ROOT = path.resolve(new URL(".", import.meta.url).pathname, "..");
const HTML = fs.readFileSync(path.join(ROOT, "docs", "index.html"), "utf8");
const SEL = fs.readFileSync(path.join(ROOT, "docs", "scripts", "selectors.js"), "utf8");
const SRC = fs.readFileSync(
  path.join(ROOT, "docs", "scripts", "modes", "_keyboard-shortcuts.js"),
  "utf8",
);

function newCtx() {
  const dom = new JSDOM(HTML, {
    runScripts: "outside-only",
    pretendToBeVisual: true,
    url: "http://localhost/",
  });
  const ctx = dom.getInternalVMContext();
  vm.runInContext(SEL, ctx, { filename: "selectors.js" });
  vm.runInContext(SRC, ctx, { filename: "_keyboard-shortcuts.js" });
  return dom.window;
}

function installStubs(window, route) {
  const closed = [];
  window.EBT.Core = { state: { route } };
  window.EBT.View = {
    closeSidebar: () => closed.push("sidebar"),
    closeModal: (id) => closed.push(`modal:${id}`),
  };
  window.EBT.WordUI = {
    closeContextMenu: () => closed.push("wordCtx"),
  };
  return { closed };
}

function fireKey(window, key, opts = {}) {
  const ev = new window.KeyboardEvent("keydown", { key, bubbles: true, cancelable: true });
  // jsdom's KeyboardEvent doesn't accept target/isContentEditable in the init
  // dict; dispatch from the target directly so ev.target is set.
  (opts.target ?? window).dispatchEvent(ev);
  return ev;
}

describe("EBT.Keyboard — Escape", () => {
  it("closes sidebar, every known modal, and the word context menu", () => {
    const window = newCtx();
    const { closed } = installStubs(window, "home");
    window.EBT.Keyboard.wire();
    fireKey(window, "Escape");
    expect(closed).toContain("sidebar");
    expect(closed).toContain("modal:wordModal");
    expect(closed).toContain("modal:confirmModal");
    expect(closed).toContain("modal:questionReviewModal");
    expect(closed).toContain("modal:resetDataModal");
    expect(closed).toContain("wordCtx");
  });
});

describe("EBT.Keyboard — Arrow keys on memorization routes", () => {
  it("fires back/next buttons on a plain memorization route", () => {
    const window = newCtx();
    installStubs(window, "mode/memorization/random");
    window.EBT.Keyboard.wire();

    const clicks = [];
    window.document.getElementById("backBtn").addEventListener("click", () => clicks.push("back"));
    window.document.getElementById("nextBtn").addEventListener("click", () => clicks.push("next"));

    fireKey(window, "ArrowLeft");
    fireKey(window, "ArrowRight");
    expect(clicks).toEqual(["back", "next"]);
  });

  it("ignores arrow keys on non-memorization routes", () => {
    const window = newCtx();
    installStubs(window, "mode/train");
    window.EBT.Keyboard.wire();

    const clicks = [];
    window.document.getElementById("backBtn").addEventListener("click", () => clicks.push("back"));
    fireKey(window, "ArrowLeft");
    expect(clicks).toEqual([]);
  });

  it("suppresses arrow-key nav when any modal is visible", () => {
    const window = newCtx();
    installStubs(window, "mode/memorization/ordered");
    window.EBT.Keyboard.wire();

    // Un-hide the confirm modal so the querySelector guard triggers.
    const modal = window.document.getElementById("confirmModal");
    modal.removeAttribute("hidden");

    const clicks = [];
    window.document.getElementById("backBtn").addEventListener("click", () => clicks.push("back"));
    fireKey(window, "ArrowLeft");
    expect(clicks).toEqual([]);
  });

  it("suppresses arrow-key nav when the word context menu is visible", () => {
    const window = newCtx();
    installStubs(window, "mode/memorization/ordered");
    window.EBT.Keyboard.wire();

    window.document.getElementById("wordContextMenu").hidden = false;

    const clicks = [];
    window.document.getElementById("backBtn").addEventListener("click", () => clicks.push("back"));
    fireKey(window, "ArrowLeft");
    expect(clicks).toEqual([]);
  });

  it("suppresses arrow-key nav when an INPUT is the event target", () => {
    const window = newCtx();
    installStubs(window, "mode/memorization/ordered");
    window.EBT.Keyboard.wire();

    const input = window.document.createElement("input");
    window.document.body.appendChild(input);

    const clicks = [];
    window.document.getElementById("backBtn").addEventListener("click", () => clicks.push("back"));

    fireKey(window, "ArrowLeft", { target: input });
    expect(clicks).toEqual([]);
  });
});
