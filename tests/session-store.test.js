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

await import("../docs/scripts/storage.js");
await import("../docs/scripts/session-store.js");
const { Session } = globalThis.EBT;

beforeEach(() => {
  globalThis.localStorage.clear();
});

describe("Session per-mode load/save/clear", () => {
  it("returns null when no session saved", () => {
    expect(Session.load("test")).toBeNull();
  });
  it("round-trips a saved session", () => {
    Session.save("test", { mode: "test", questionIds: ["q-1"] });
    const s = Session.load("test");
    expect(s.questionIds).toEqual(["q-1"]);
  });
  it("clear removes only the chosen mode", () => {
    Session.save("test", { mode: "test" });
    Session.save("train", { mode: "train" });
    Session.clear("test");
    expect(Session.load("test")).toBeNull();
    expect(Session.load("train")).toBeTruthy();
  });
  it("clearAll removes every session key", () => {
    Session.save("test", { mode: "test" });
    Session.save("train", { mode: "train" });
    Session.save("memorization.ordered", { mode: "memorization" });
    Session.clearAll();
    expect(Session.load("test")).toBeNull();
    expect(Session.load("train")).toBeNull();
    expect(Session.load("memorization.ordered")).toBeNull();
  });
});

describe("Session history", () => {
  it("loadHistory returns empty array by default", () => {
    expect(Session.loadHistory()).toEqual([]);
  });

  it("appendHistory adds entries in order", () => {
    Session.appendHistory({ score: 1 });
    Session.appendHistory({ score: 2 });
    const hist = Session.loadHistory();
    expect(hist).toHaveLength(2);
    expect(hist[0].score).toBe(1);
    expect(hist[1].score).toBe(2);
  });

  it("appendHistory trims to HISTORY_MAX, dropping oldest", () => {
    const MAX = Session.HISTORY_MAX;
    for (let i = 0; i < MAX; i++) {
      Session.appendHistory({ id: i });
    }
    expect(Session.loadHistory()).toHaveLength(MAX);
    // Pushing one more should drop the oldest.
    Session.appendHistory({ id: MAX });
    const hist = Session.loadHistory();
    expect(hist).toHaveLength(MAX);
    expect(hist[0].id).toBe(1);
    expect(hist[hist.length - 1].id).toBe(MAX);
  });

  it("saveHistory also caps at HISTORY_MAX", () => {
    const MAX = Session.HISTORY_MAX;
    const list = Array.from({ length: MAX + 5 }, (_, i) => ({ id: i }));
    Session.saveHistory(list);
    const hist = Session.loadHistory();
    expect(hist).toHaveLength(MAX);
    // saveHistory keeps the TAIL, i.e. most recent entries.
    expect(hist[0].id).toBe(5);
  });

  it("clearHistory empties the log", () => {
    Session.appendHistory({ id: 1 });
    Session.clearHistory();
    expect(Session.loadHistory()).toEqual([]);
  });

  it("loadHistory returns an empty array when storage holds a non-array", () => {
    globalThis.localStorage.setItem("ebt.testHistory", JSON.stringify({ nope: true }));
    expect(Session.loadHistory()).toEqual([]);
  });
});
