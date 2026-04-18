/**
 * Unit tests for EBT.Nav — the per-route Back/Next dispatcher.
 * Loads the module in isolation and drives it with mock Core.
 */
import { describe, it, expect, beforeEach } from "vitest";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { JSDOM } from "jsdom";

const ROOT = path.resolve(new URL(".", import.meta.url).pathname, "..");
const SRC = fs.readFileSync(
  path.join(ROOT, "docs", "scripts", "modes", "_nav-handlers.js"),
  "utf8",
);

function freshCtx() {
  const dom = new JSDOM("<!doctype html><html><body></body></html>", {
    runScripts: "outside-only",
  });
  const ctx = dom.getInternalVMContext();
  vm.runInContext(SRC, ctx, { filename: "_nav-handlers.js" });
  return dom.window;
}

describe("EBT.Nav", () => {
  let window;
  let fallbackCalls;

  beforeEach(() => {
    window = freshCtx();
    fallbackCalls = [];
    // Stub EBT.Core.setRoute so the default "go home" fallback is observable.
    window.EBT.Core = { setRoute: (r) => fallbackCalls.push(r) };
  });

  it("dispatches to the exact-route handler when registered", () => {
    let backCalled = false;
    let nextCalled = false;
    window.EBT.Nav.register("mode/train", {
      onBack: () => { backCalled = true; },
      onNext: () => { nextCalled = true; },
    });
    window.EBT.Nav.back("mode/train");
    window.EBT.Nav.next("mode/train");
    expect(backCalled).toBe(true);
    expect(nextCalled).toBe(true);
    expect(fallbackCalls).toEqual([]);
  });

  it("falls back to Core.setRoute('home') when no handler matches", () => {
    window.EBT.Nav.back("some/unknown/route");
    window.EBT.Nav.next("some/unknown/route");
    expect(fallbackCalls).toEqual(["home", "home"]);
  });

  it("falls back to home when handler object lacks the matching verb", () => {
    // Register only onBack; pressing Next should fall through to home.
    window.EBT.Nav.register("read-only-route", { onBack: () => {} });
    window.EBT.Nav.next("read-only-route");
    expect(fallbackCalls).toEqual(["home"]);
  });

  it("matches a prefix-registered handler for any subroute", () => {
    const seen = [];
    window.EBT.Nav.registerPrefix("mode/memorization/", {
      onBack: (route) => seen.push(["back", route]),
      onNext: (route) => seen.push(["next", route]),
    });
    window.EBT.Nav.back("mode/memorization/random");
    window.EBT.Nav.next("mode/memorization/ordered");
    expect(seen).toEqual([
      ["back", "mode/memorization/random"],
      ["next", "mode/memorization/ordered"],
    ]);
  });

  it("prefers exact match over prefix match", () => {
    const seen = [];
    window.EBT.Nav.registerPrefix("mode/", {
      onBack: () => seen.push("prefix"),
    });
    window.EBT.Nav.register("mode/test", {
      onBack: () => seen.push("exact"),
    });
    window.EBT.Nav.back("mode/test");
    expect(seen).toEqual(["exact"]);
  });

  it("passes the route string to handlers (lets prefix handlers branch on subroute)", () => {
    const seen = [];
    window.EBT.Nav.registerPrefix("mode/memorization/", {
      onBack: (route) => seen.push(route),
    });
    window.EBT.Nav.back("mode/memorization/random");
    expect(seen).toEqual(["mode/memorization/random"]);
  });
});
