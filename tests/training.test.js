import { describe, it, expect } from "vitest";
import utils from "../docs/scripts/utils.js";

const { nextTrainingCredits, pickTrainingQuestionId } = utils;

const CFG = { correctDelta: -1, wrongDelta: 2, minCredits: 0 };

describe("nextTrainingCredits", () => {
  it("decrements on a correct answer", () => {
    expect(nextTrainingCredits(10, true, CFG)).toBe(9);
  });
  it("increments on a wrong answer (harder q comes back more)", () => {
    expect(nextTrainingCredits(10, false, CFG)).toBe(12);
  });
  it("clamps to minCredits on repeated correct answers", () => {
    let c = 2;
    c = nextTrainingCredits(c, true, CFG); // 1
    c = nextTrainingCredits(c, true, CFG); // 0
    c = nextTrainingCredits(c, true, CFG); // still 0 (clamped)
    expect(c).toBe(0);
  });
  it("treats missing/NaN current as 0", () => {
    expect(nextTrainingCredits(undefined, true, CFG)).toBe(0); // max(0, -1) = 0
    expect(nextTrainingCredits(null, false, CFG)).toBe(2);
  });
  it("honors a custom minCredits floor", () => {
    expect(nextTrainingCredits(1, true, { ...CFG, minCredits: 1 })).toBe(1);
  });
});

describe("pickTrainingQuestionId", () => {
  const ids = ["q-a", "q-b", "q-c"];
  const base = {
    credits: { "q-a": 10, "q-b": 10, "q-c": 10 },
    nextEligibleAt: {},
    defaultCredits: 10,
    nowMs: 1000,
  };

  it("returns null on an empty pool", () => {
    expect(pickTrainingQuestionId([], base)).toBeNull();
  });

  it("picks by weighted random over eligible questions", () => {
    // With random = 0, the first eligible question wins.
    const picked = pickTrainingQuestionId(ids, { ...base, random: () => 0 });
    expect(picked).toBe("q-a");
  });

  it("excludes questions on cooldown", () => {
    const ctx = {
      ...base,
      nextEligibleAt: { "q-a": 2000, "q-b": 2000 }, // on cooldown past nowMs=1000
      random: () => 0,
    };
    expect(pickTrainingQuestionId(ids, ctx)).toBe("q-c");
  });

  it("falls back to non-cooldown path when every question is on cooldown", () => {
    const ctx = {
      ...base,
      nextEligibleAt: { "q-a": 9999, "q-b": 9999, "q-c": 9999 },
      random: () => 0,
    };
    // All on cooldown -> fallback ignores cooldown, picks by credits weight.
    expect(pickTrainingQuestionId(ids, ctx)).toBe("q-a");
  });

  it("excludes questions with zero credits", () => {
    const ctx = {
      ...base,
      credits: { "q-a": 0, "q-b": 0, "q-c": 10 },
      random: () => 0,
    };
    expect(pickTrainingQuestionId(ids, ctx)).toBe("q-c");
  });

  it("returns the first ID as a last-resort seed when everything is exhausted", () => {
    const ctx = {
      credits: { "q-a": 0, "q-b": 0, "q-c": 0 },
      nextEligibleAt: {},
      defaultCredits: 0, // force default to 0 too
      nowMs: 0,
      random: () => 0,
    };
    expect(pickTrainingQuestionId(ids, ctx)).toBe("q-a");
  });

  it("uses defaultCredits when a question has no explicit credit entry", () => {
    const ctx = {
      credits: { "q-a": 0 }, // only one explicit; others implicit
      nextEligibleAt: {},
      defaultCredits: 5,
      nowMs: 0,
      random: () => 0,
    };
    // q-a is 0 (excluded); q-b, q-c implicit default 5; sum=10, r=0 picks q-b.
    expect(pickTrainingQuestionId(ids, ctx)).toBe("q-b");
  });

  it("weighted distribution respects credit mass over many trials", () => {
    const ctx = {
      credits: { "q-a": 9, "q-b": 1, "q-c": 0 },
      nextEligibleAt: {},
      defaultCredits: 10,
      nowMs: 0,
    };
    let aCount = 0;
    let bCount = 0;
    for (let i = 0; i < 2000; i++) {
      const pick = pickTrainingQuestionId(ids, { ...ctx, random: Math.random });
      if (pick === "q-a") aCount += 1;
      else if (pick === "q-b") bCount += 1;
    }
    // q-a should win much more often (9x weight vs 1x). Allow some slack.
    expect(aCount).toBeGreaterThan(bCount * 5);
  });
});
