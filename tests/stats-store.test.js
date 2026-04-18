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
await import("../docs/scripts/stats-store.js");
const { Stats } = globalThis.EBT;

beforeEach(() => {
  globalThis.localStorage.clear();
});

describe("Stats.bump", () => {
  it("creates a fresh stat record on first touch", () => {
    Stats.bump("q-1", true);
    const all = Stats.readAll();
    expect(all["q-1"].correct).toBe(1);
    expect(all["q-1"].wrong).toBe(0);
    expect(all["q-1"].skipped).toBe(0);
    expect(all["q-1"].lastAnsweredAt).toBeTruthy();
  });

  it("increments correct vs wrong by the flag", () => {
    Stats.bump("q-1", true);
    Stats.bump("q-1", false);
    Stats.bump("q-1", true);
    const s = Stats.readAll()["q-1"];
    expect(s.correct).toBe(2);
    expect(s.wrong).toBe(1);
  });

  it("ignores missing question id", () => {
    Stats.bump("", true);
    Stats.bump(undefined, true);
    expect(Object.keys(Stats.readAll())).toHaveLength(0);
  });

  it("preserves lastSkippedAt when bumping correct/wrong", () => {
    Stats.bumpSkip("q-1");
    const after = Stats.readAll()["q-1"];
    Stats.bump("q-1", true);
    const merged = Stats.readAll()["q-1"];
    expect(merged.skipped).toBe(1);
    expect(merged.lastSkippedAt).toBe(after.lastSkippedAt);
  });
});

describe("Stats.bumpSkip", () => {
  it("initialises skipped on first skip", () => {
    Stats.bumpSkip("q-1");
    expect(Stats.readAll()["q-1"].skipped).toBe(1);
  });
  it("increments existing skipped count", () => {
    Stats.bumpSkip("q-1");
    Stats.bumpSkip("q-1");
    expect(Stats.readAll()["q-1"].skipped).toBe(2);
  });
});

describe("Stats.clear", () => {
  it("empties the stats map", () => {
    Stats.bump("q-1", true);
    Stats.bump("q-2", false);
    Stats.clear();
    expect(Stats.readAll()).toEqual({});
  });
});

describe("Stats.defaultStat", () => {
  it("returns zeroed counters with null timestamps", () => {
    expect(Stats.defaultStat()).toEqual({
      correct: 0,
      wrong: 0,
      skipped: 0,
      lastAnsweredAt: null,
      lastSkippedAt: null,
    });
  });
});
