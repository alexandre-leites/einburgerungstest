import { describe, it, expect } from "vitest";

// validation.js registers itself on window.EBT. Simulate the browser global
// before the module IIFE runs, then import it once for the whole suite.
globalThis.window = globalThis;
await import("../docs/scripts/validation.js");

const { Validation } = globalThis.EBT;

function goodQ(overrides = {}) {
  return {
    _id: "frage-1",
    category: "GERMANY",
    question: { text: "Wie viele Bundesländer hat Deutschland?" },
    options: ["16", "15", "14", "13"],
    answerIndex: 0,
    sub_category: "POLITICAL_SYSTEM",
    ...overrides,
  };
}

describe("validateQuestion", () => {
  it("accepts a well-formed question", () => {
    expect(Validation.validateQuestion(goodQ()).ok).toBe(true);
  });

  it("rejects missing _id", () => {
    expect(Validation.validateQuestion(goodQ({ _id: "" })).ok).toBe(false);
  });

  it("rejects unknown category", () => {
    expect(Validation.validateQuestion(goodQ({ category: "Atlantis" })).ok).toBe(false);
  });

  it("rejects wrong-length options", () => {
    expect(Validation.validateQuestion(goodQ({ options: ["a", "b", "c"] })).ok).toBe(false);
  });

  it("rejects answerIndex out of range", () => {
    expect(Validation.validateQuestion(goodQ({ answerIndex: 4 })).ok).toBe(false);
  });

  it("accepts null sub_category (optional)", () => {
    expect(Validation.validateQuestion(goodQ({ sub_category: null })).ok).toBe(true);
  });

  it("rejects unknown sub_category", () => {
    expect(Validation.validateQuestion(goodQ({ sub_category: "NOT_A_CATEGORY" })).ok).toBe(false);
  });
});

describe("filterValidQuestions", () => {
  it("splits valid and invalid", () => {
    const input = [goodQ({ _id: "frage-1" }), { bogus: true }, goodQ({ _id: "frage-2" })];
    const res = Validation.filterValidQuestions(input);
    expect(res.questions).toHaveLength(2);
    expect(res.dropped).toHaveLength(1);
  });
});

describe("validateDictionaryEntry", () => {
  it("accepts entries with any language description", () => {
    expect(Validation.validateDictionaryEntry({ de: { description: "Hallo" } })).toBe(true);
  });
  it("rejects entries with no usable description", () => {
    expect(Validation.validateDictionaryEntry({ de: { phrases: ["no description"] } })).toBe(false);
  });
});
