import { describe, it, expect, beforeEach } from "vitest";

function buildLocalStorageMock() {
  const store = new Map();
  return {
    get length() {
      return store.size;
    },
    key(i) {
      return Array.from(store.keys())[i] ?? null;
    },
    getItem(k) {
      return store.has(k) ? store.get(k) : null;
    },
    setItem(k, v) {
      store.set(k, String(v));
    },
    removeItem(k) {
      store.delete(k);
    },
    clear() {
      store.clear();
    },
  };
}

// Set up globals before importing the module so its IIFE sees them.
globalThis.window = globalThis;
globalThis.localStorage = buildLocalStorageMock();
await import("../docs/scripts/migrations.js");
const { Migrations } = globalThis.EBT;

beforeEach(() => {
  // Fresh localStorage for every test. The Migrations module keeps its own
  // registry state, so we reset that too by keeping tests independent.
  globalThis.localStorage.clear();
});

describe("EBT.Migrations.run", () => {
  const PREFIX = "ebt.";

  it("no-op on first run: records current version without applying anything", () => {
    Migrations.register(100, () => {
      throw new Error("should not be called on fresh install");
    });
    const res = Migrations.run({ currentVersion: 100, prefix: PREFIX });
    expect(res.applied).toEqual([]);
    // Stored as JSON number
    expect(globalThis.localStorage.getItem(PREFIX + "_schemaVersion")).toBe("100");
  });

  it("runs registered migrations in order on upgrade", () => {
    globalThis.localStorage.setItem(PREFIX + "_schemaVersion", "200");
    const calls = [];
    Migrations.register(201, () => calls.push(201));
    Migrations.register(202, () => calls.push(202));
    const res = Migrations.run({ currentVersion: 202, prefix: PREFIX });
    expect(calls).toEqual([201, 202]);
    expect(res.applied).toEqual([201, 202]);
    expect(globalThis.localStorage.getItem(PREFIX + "_schemaVersion")).toBe("202");
  });

  it("stops on error and does not bump version", () => {
    globalThis.localStorage.setItem(PREFIX + "_schemaVersion", "300");
    Migrations.register(301, () => {
      throw new Error("boom");
    });
    const res = Migrations.run({ currentVersion: 302, prefix: PREFIX });
    expect(res.applied).toEqual([]);
    expect(res.error).toBeDefined();
    expect(globalThis.localStorage.getItem(PREFIX + "_schemaVersion")).toBe("300");
  });

  it("handles downgrades by resetting the stored version", () => {
    globalThis.localStorage.setItem(PREFIX + "_schemaVersion", "500");
    const res = Migrations.run({ currentVersion: 400, prefix: PREFIX });
    expect(globalThis.localStorage.getItem(PREFIX + "_schemaVersion")).toBe("400");
    expect(res.applied).toEqual([]);
  });
});
