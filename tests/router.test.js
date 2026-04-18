import { describe, it, expect, beforeEach } from "vitest";

globalThis.window = globalThis;
// Fake a mutable location.hash without a real navigation.
const fakeLocation = { hash: "" };
Object.defineProperty(globalThis.window, "location", {
  value: fakeLocation,
  writable: true,
  configurable: true,
});

await import("../docs/scripts/router.js");
const { Router } = globalThis.EBT;

beforeEach(() => {
  Router.routes.length = 0;
  fakeLocation.hash = "";
});

describe("Router.getRouteFromHash", () => {
  it("returns 'home' when hash is empty", () => {
    fakeLocation.hash = "";
    expect(Router.getRouteFromHash()).toBe("home");
  });
  it("strips the leading #/", () => {
    fakeLocation.hash = "#/mode/test";
    expect(Router.getRouteFromHash()).toBe("mode/test");
  });
  it("strips a bare # prefix", () => {
    fakeLocation.hash = "#home";
    expect(Router.getRouteFromHash()).toBe("home");
  });
  it("returns 'home' when hash is just '#/'", () => {
    fakeLocation.hash = "#/";
    expect(Router.getRouteFromHash()).toBe("home");
  });
});

describe("Router.register / dispatch", () => {
  it("calls the matching renderer", () => {
    let called = null;
    Router.register({ path: "home", render: () => (called = "home") });
    Router.register({ path: "stats", render: () => (called = "stats") });
    Router.dispatch("stats");
    expect(called).toBe("stats");
  });

  it("falls back to 'home' on unknown route", () => {
    let called = null;
    Router.register({ path: "home", render: () => (called = "home") });
    Router.dispatch("not/a/real/route");
    expect(called).toBe("home");
  });

  it("silently does nothing if neither requested nor 'home' is registered", () => {
    expect(() => Router.dispatch("whatever")).not.toThrow();
  });

  it("rejects malformed route objects", () => {
    expect(() => Router.register(null)).toThrow();
    expect(() => Router.register({ path: "x" })).toThrow(); // no render
    expect(() => Router.register({ render: () => {} })).toThrow(); // no path
  });

  it("registerAll accepts an array", () => {
    const calls = [];
    Router.registerAll([
      { path: "a", render: () => calls.push("a") },
      { path: "b", render: () => calls.push("b") },
    ]);
    Router.dispatch("b");
    expect(calls).toEqual(["b"]);
  });
});

describe("Router.setHash", () => {
  it("writes the hash prefix", () => {
    Router.setHash("mode/train");
    expect(fakeLocation.hash).toBe("#/mode/train");
  });
});
