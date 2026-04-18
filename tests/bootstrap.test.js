/**
 * Smoke test: load every framework script in order under jsdom and verify
 * that the EBT namespace ends up populated with the modules we expect.
 * Does not execute general.js (too DOM-coupled) — just the new framework
 * modules that should all co-exist cleanly.
 */
import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { JSDOM } from "jsdom";

const ROOT = path.resolve(new URL(".", import.meta.url).pathname, "..");
const SCRIPTS_DIR = path.join(ROOT, "docs", "scripts");

// Order matches docs/index.html's loader list.
const SCRIPTS = [
  "utils.js",
  "storage.js",
  "migrations.js",
  "validation.js",
  "i18n.js",
  "stats-store.js",
  "mydict-store.js",
  "session-store.js",
  "router.js",
];

describe("bootstrap", () => {
  it("all framework scripts attach to window.EBT in load order", () => {
    const dom = new JSDOM("<!doctype html><html><body></body></html>", {
      runScripts: "outside-only",
    });
    const { window } = dom;
    const ctx = dom.getInternalVMContext();
    for (const file of SCRIPTS) {
      const code = fs.readFileSync(path.join(SCRIPTS_DIR, file), "utf8");
      vm.runInContext(code, ctx, { filename: file });
    }
    const EBT = window.EBT;
    expect(EBT).toBeTruthy();
    expect(typeof EBT.Utils.shuffle).toBe("function");
    expect(typeof EBT.Storage.readJSON).toBe("function");
    expect(typeof EBT.Migrations.run).toBe("function");
    expect(typeof EBT.Validation.validateQuestion).toBe("function");
    expect(typeof EBT.I18N.load).toBe("function");
    expect(typeof EBT.Stats.bump).toBe("function");
    expect(typeof EBT.MyDict.add).toBe("function");
    expect(typeof EBT.Session.loadHistory).toBe("function");
    expect(typeof EBT.Router.dispatch).toBe("function");
  });
});
