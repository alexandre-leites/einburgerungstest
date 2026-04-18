import { describe, it, expect, beforeEach } from "vitest";

function buildLocalStorageMock({ quotaAfter = Infinity } = {}) {
  const store = new Map();
  let writeCount = 0;
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
      writeCount += 1;
      if (writeCount > quotaAfter) {
        const err = new Error("quota");
        err.name = "QuotaExceededError";
        err.code = 22;
        throw err;
      }
      store.set(k, String(v));
    },
    removeItem(k) {
      store.delete(k);
    },
    clear() {
      store.clear();
      writeCount = 0;
    },
  };
}

// Set up a window-like global and record dispatched events.
const dispatched = [];
globalThis.window = globalThis;
globalThis.window.dispatchEvent = (ev) => {
  dispatched.push(ev);
  return true;
};
// CustomEvent polyfill for the Node context.
globalThis.CustomEvent = class CustomEvent {
  constructor(type, init) {
    this.type = type;
    this.detail = (init && init.detail) || undefined;
  }
};
globalThis.localStorage = buildLocalStorageMock();
await import("../docs/scripts/storage.js");
const { Storage } = globalThis.EBT;

beforeEach(() => {
  globalThis.localStorage.clear();
  dispatched.length = 0;
});

describe("Storage.readJSON", () => {
  it("returns fallback when key is missing", () => {
    expect(Storage.readJSON("missing", "fallback")).toBe("fallback");
  });
  it("returns null when no fallback provided and key missing", () => {
    expect(Storage.readJSON("missing")).toBeNull();
  });
  it("returns fallback when stored value is corrupted JSON", () => {
    globalThis.localStorage.setItem("ebt.corrupt", "{not-json");
    expect(Storage.readJSON("corrupt", "fallback")).toBe("fallback");
  });
  it("round-trips objects", () => {
    Storage.writeJSON("obj", { a: 1, b: [2, 3] });
    expect(Storage.readJSON("obj")).toEqual({ a: 1, b: [2, 3] });
  });
});

describe("Storage.writeJSON", () => {
  it("returns {ok: true} on success", () => {
    const r = Storage.writeJSON("a", 1);
    expect(r).toEqual({ ok: true });
  });
  it("returns {ok:false, reason:'quota'} and dispatches event when storage is full", () => {
    // The mock starts throwing on the 2nd write.
    globalThis.localStorage = buildLocalStorageMock({ quotaAfter: 1 });
    // Re-point the module's localStorage reference.
    Storage.writeJSON("first", 1);
    const r = Storage.writeJSON("second", 2);
    expect(r.ok).toBe(false);
    expect(r.reason).toBe("quota");
    expect(dispatched).toHaveLength(1);
    expect(dispatched[0].type).toBe("ebt:storage-write-failed");
    expect(dispatched[0].detail.reason).toBe("quota");
    // Restore for other tests.
    globalThis.localStorage = buildLocalStorageMock();
  });
});

describe("Storage.clearMatching", () => {
  it("deletes only keys matching the predicate", () => {
    Storage.writeJSON("keep.a", 1);
    Storage.writeJSON("drop.a", 2);
    Storage.writeJSON("drop.b", 3);
    const n = Storage.clearMatching((suffix) => suffix.indexOf("drop.") === 0);
    expect(n).toBe(2);
    expect(Storage.readJSON("keep.a")).toBe(1);
    expect(Storage.readJSON("drop.a")).toBeNull();
    expect(Storage.readJSON("drop.b")).toBeNull();
  });
  it("returns 0 when nothing matches", () => {
    Storage.writeJSON("x", 1);
    expect(Storage.clearMatching(() => false)).toBe(0);
  });
});

describe("Storage.listKeys", () => {
  it("returns prefix-stripped keys", () => {
    Storage.writeJSON("one", 1);
    Storage.writeJSON("two.nested", 2);
    const keys = Storage.listKeys().sort();
    expect(keys).toEqual(["one", "two.nested"]);
  });
  it("ignores keys without the app prefix", () => {
    globalThis.localStorage.setItem("other.app", "{}");
    Storage.writeJSON("mine", 1);
    expect(Storage.listKeys()).toEqual(["mine"]);
  });
});

describe("Storage.remove / fullKey", () => {
  it("removes a single key", () => {
    Storage.writeJSON("x", 1);
    Storage.remove("x");
    expect(Storage.readJSON("x")).toBeNull();
  });
  it("exposes the prefix", () => {
    expect(Storage.fullKey("hello")).toBe(Storage.PREFIX + "hello");
  });
});
