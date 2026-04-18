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

globalThis.window = globalThis;
globalThis.window.dispatchEvent = () => true;
globalThis.CustomEvent = class {
  constructor(type, init) {
    this.type = type;
    this.detail = (init && init.detail) || undefined;
  }
};
globalThis.localStorage = buildLocalStorageMock();

// Load in dependency order.
await import("../docs/scripts/utils.js");
await import("../docs/scripts/storage.js");
await import("../docs/scripts/mydict-store.js");
const { MyDict } = globalThis.EBT;

beforeEach(() => {
  globalThis.localStorage.clear();
});

describe("MyDict canonicalisation", () => {
  it("normalises case + strips trailing punctuation when adding", () => {
    expect(MyDict.add("Bürger!", "Bürger!")).toBe(true);
    expect(MyDict.has("bürger")).toBe(true);
    expect(MyDict.has("BÜRGER")).toBe(true);
  });
  it("returns false on duplicate add", () => {
    MyDict.add("hund", "hund");
    expect(MyDict.add("Hund", "Hund")).toBe(false);
  });
});

describe("MyDict CRUD", () => {
  it("add/has/remove", () => {
    expect(MyDict.has("katze")).toBe(false);
    expect(MyDict.add("katze", "Katze")).toBe(true);
    expect(MyDict.has("katze")).toBe(true);
    expect(MyDict.remove("katze")).toBe(true);
    expect(MyDict.has("katze")).toBe(false);
  });
  it("remove returns false for absent entries", () => {
    expect(MyDict.remove("nope")).toBe(false);
  });
  it("readAll returns every stored entry", () => {
    MyDict.add("a", "A");
    MyDict.add("b", "B");
    const all = MyDict.readAll();
    expect(Object.keys(all).sort()).toEqual(["a", "b"]);
    expect(all.a.word).toBe("A");
  });
  it("clear empties the dictionary", () => {
    MyDict.add("a");
    MyDict.clear();
    expect(MyDict.readAll()).toEqual({});
  });
});

describe("MyDict cap + pruning", () => {
  it("pruneToCap keeps the newest N entries when over cap", () => {
    const MAX = MyDict.MAX_ENTRIES;
    const obj = {};
    // Build MAX+5 entries with increasing addedAt.
    for (let i = 0; i < MAX + 5; i++) {
      obj["w" + i] = { word: "w" + i, addedAt: new Date(2024, 0, 1, 0, 0, i).toISOString() };
    }
    const pruned = MyDict.pruneToCap(obj);
    const keys = Object.keys(pruned);
    expect(keys).toHaveLength(MAX);
    // The oldest 5 (w0..w4) should be gone, the newest should remain.
    expect(pruned.w0).toBeUndefined();
    expect(pruned.w4).toBeUndefined();
    expect(pruned["w" + (MAX + 4)]).toBeDefined();
  });

  it("entries without addedAt are pruned first", () => {
    const MAX = MyDict.MAX_ENTRIES;
    const obj = {};
    // First entry has no addedAt (legacy import).
    obj.legacy = { word: "legacy" };
    for (let i = 0; i < MAX; i++) {
      obj["w" + i] = { word: "w" + i, addedAt: new Date(2024, 0, 1, 0, 0, i).toISOString() };
    }
    const pruned = MyDict.pruneToCap(obj);
    expect(Object.keys(pruned)).toHaveLength(MAX);
    expect(pruned.legacy).toBeUndefined();
  });

  it("pruneToCap is a no-op when under cap", () => {
    const obj = { a: { word: "a", addedAt: "2024-01-01T00:00:00.000Z" } };
    const pruned = MyDict.pruneToCap(obj);
    expect(pruned).toBe(obj);
    expect(Object.keys(pruned)).toEqual(["a"]);
  });
});
