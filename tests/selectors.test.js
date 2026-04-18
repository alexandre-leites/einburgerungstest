/**
 * Selector registry guard: every logical name in selectors.js must resolve
 * to exactly one element in docs/index.html. Catches drift when either
 * file is edited.
 */
import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { JSDOM } from "jsdom";

const ROOT = path.resolve(new URL(".", import.meta.url).pathname, "..");
const HTML = fs.readFileSync(path.join(ROOT, "docs", "index.html"), "utf8");
const SEL_SRC = fs.readFileSync(path.join(ROOT, "docs", "scripts", "selectors.js"), "utf8");

describe("selectors registry", () => {
  it("every registered selector resolves to a unique element in index.html", () => {
    const dom = new JSDOM(HTML, { runScripts: "outside-only" });
    const { window } = dom;
    const ctx = dom.getInternalVMContext();
    vm.runInContext(SEL_SRC, ctx, { filename: "selectors.js" });

    const Sel = window.EBT.Selectors;
    expect(Sel).toBeTruthy();

    const names = Sel.names();
    expect(names.length).toBeGreaterThan(0);

    const els = Sel.query();
    const missing = [];
    for (const name of names) {
      if (!els[name]) missing.push(`${name} (${Sel.selectorFor(name)})`);
    }
    expect(missing).toEqual([]);
  });

  it("each selector returns exactly one element (no duplicate IDs)", () => {
    const dom = new JSDOM(HTML, { runScripts: "outside-only" });
    const { window } = dom;
    const ctx = dom.getInternalVMContext();
    vm.runInContext(SEL_SRC, ctx, { filename: "selectors.js" });

    const Sel = window.EBT.Selectors;
    const duplicates = [];
    for (const name of Sel.names()) {
      const selector = Sel.selectorFor(name);
      const matches = window.document.querySelectorAll(selector);
      if (matches.length > 1) duplicates.push(`${name}: ${matches.length}`);
    }
    expect(duplicates).toEqual([]);
  });
});
