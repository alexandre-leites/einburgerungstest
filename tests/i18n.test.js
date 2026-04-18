import { describe, it, expect, beforeEach } from "vitest";

globalThis.window = globalThis;
// Pretend we already loaded the i18n bundles — skip the fetch dance and
// directly poke strings in. The fallback logic is what we actually want to
// exercise.
await import("../docs/scripts/i18n.js");
const { I18N } = globalThis.EBT;

beforeEach(() => {
  I18N.strings.de = {};
  I18N.strings.en = {};
  I18N.strings.pt = {};
});

describe("I18N.t fallback chain", () => {
  it("returns the key itself when no language has it", () => {
    expect(I18N.t("de", "unknownKey")).toBe("unknownKey");
    expect(I18N.t("en", "unknownKey")).toBe("unknownKey");
  });

  it("returns the requested language when present", () => {
    I18N.strings.en.home = "Home";
    expect(I18N.t("en", "home")).toBe("Home");
  });

  it("falls back to DE (source of truth) when requested lang is missing the key", () => {
    I18N.strings.de.home = "Startseite";
    I18N.strings.en = {}; // no home key
    expect(I18N.t("en", "home")).toBe("Startseite");
  });

  it("falls back to the key when both requested lang and DE are missing it", () => {
    I18N.strings.de = {};
    I18N.strings.pt = {};
    expect(I18N.t("pt", "missingKey")).toBe("missingKey");
  });

  it("does not fall back to DE when requested lang IS DE", () => {
    I18N.strings.de = {};
    expect(I18N.t("de", "home")).toBe("home");
  });

  it("returns empty string for empty/nullish keys", () => {
    expect(I18N.t("de", "")).toBe("");
    expect(I18N.t("de", undefined)).toBe("");
  });

  it("handles literal empty-string translations (doesn't skip them)", () => {
    I18N.strings.en.empty = "";
    expect(I18N.t("en", "empty")).toBe("");
  });
});

describe("I18N.has", () => {
  it("returns true only when the key exists in that language", () => {
    I18N.strings.de.greeting = "Hallo";
    expect(I18N.has("de", "greeting")).toBe(true);
    expect(I18N.has("en", "greeting")).toBe(false);
  });
});
