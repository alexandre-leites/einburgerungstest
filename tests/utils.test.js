import { describe, it, expect } from "vitest";
import utils from "../docs/scripts/utils.js";

const {
  pad2,
  formatTimeMs,
  shuffle,
  randInt,
  tokenize,
  normalizeWord,
  canonicalWordKey,
  escapeRegExp,
  escapeHtml,
  html,
  highlightWord,
  accuracyOf,
  weaknessKeyFor,
  pickWithWeaknessReservation,
} = utils;

describe("pad2", () => {
  it("left-pads single digits with 0", () => {
    expect(pad2(0)).toBe("00");
    expect(pad2(7)).toBe("07");
    expect(pad2(12)).toBe("12");
  });
});

describe("formatTimeMs", () => {
  it("formats zero and negative as 00:00", () => {
    expect(formatTimeMs(0)).toBe("00:00");
    expect(formatTimeMs(-5000)).toBe("00:00");
  });
  it("formats seconds correctly", () => {
    expect(formatTimeMs(1000)).toBe("00:01");
    expect(formatTimeMs(59 * 1000)).toBe("00:59");
    expect(formatTimeMs(60 * 1000)).toBe("01:00");
    expect(formatTimeMs(60 * 60 * 1000)).toBe("60:00");
  });
  it("handles bad input by clamping to 00:00", () => {
    expect(formatTimeMs(NaN)).toBe("00:00");
    expect(formatTimeMs(undefined)).toBe("00:00");
  });
});

describe("shuffle", () => {
  it("preserves element identity and length", () => {
    const arr = [1, 2, 3, 4, 5];
    const before = [...arr];
    const out = shuffle(arr);
    expect(out).toBe(arr); // mutates in place
    expect(out).toHaveLength(5);
    expect([...out].sort()).toEqual(before.sort());
  });
  it("works on empty and single-element arrays", () => {
    expect(shuffle([])).toEqual([]);
    expect(shuffle([42])).toEqual([42]);
  });
});

describe("randInt", () => {
  it("stays within bounds", () => {
    for (let i = 0; i < 500; i++) {
      const n = randInt(3, 7);
      expect(n).toBeGreaterThanOrEqual(3);
      expect(n).toBeLessThanOrEqual(7);
    }
  });
  it("returns the fixed value when min === max", () => {
    expect(randInt(4, 4)).toBe(4);
  });
});

describe("tokenize", () => {
  it("splits words, whitespace, and punctuation", () => {
    expect(tokenize("Was? Ja!")).toEqual(["Was", "?", " ", "Ja", "!"]);
  });
  it("preserves German umlauts inside words", () => {
    expect(tokenize("Äpfel Öl ß")).toEqual(["Äpfel", " ", "Öl", " ", "ß"]);
  });
  it("handles nullish input", () => {
    expect(tokenize(null)).toEqual([]);
    expect(tokenize(undefined)).toEqual([]);
    expect(tokenize("")).toEqual([]);
  });
});

describe("normalizeWord / canonicalWordKey", () => {
  it("strips leading/trailing non-letters", () => {
    expect(normalizeWord("  Hallo!  ")).toBe("Hallo");
    expect(normalizeWord("«Bürger»")).toBe("Bürger");
  });
  it("lowercases for canonical key", () => {
    expect(canonicalWordKey("Bürger")).toBe("bürger");
    expect(canonicalWordKey(" ÄPFEL ")).toBe("äpfel");
  });
  it("handles empty / null", () => {
    expect(normalizeWord(null)).toBe("");
    expect(canonicalWordKey("")).toBe("");
  });
});

describe("escapeRegExp", () => {
  it("escapes regex metacharacters", () => {
    expect(escapeRegExp("a.b*c")).toBe("a\\.b\\*c");
    expect(escapeRegExp("()[]{}")).toBe("\\(\\)\\[\\]\\{\\}");
  });
});

describe("escapeHtml / html tagged template", () => {
  it("escapes <, >, &, quotes and apostrophes", () => {
    expect(escapeHtml("<script>alert('x')</script>"))
      .toBe("&lt;script&gt;alert(&#39;x&#39;)&lt;/script&gt;");
  });
  it("escapes interpolations but not literal segments", () => {
    const evil = '"<img src=x onerror=alert(1)>"';
    const out = html`<td>${evil}</td>`;
    expect(out).toBe(
      '<td>&quot;&lt;img src=x onerror=alert(1)&gt;&quot;</td>',
    );
  });
  it("passes html.raw() through unescaped", () => {
    const inner = html`<b>${"bold"}</b>`;
    const out = html`<p>${html.raw(inner)}</p>`;
    expect(out).toBe("<p><b>bold</b></p>");
  });
  it("coerces null/undefined to empty string", () => {
    expect(html`<td>${null}</td>`).toBe("<td></td>");
    expect(html`<td>${undefined}</td>`).toBe("<td></td>");
  });
});

describe("highlightWord", () => {
  it("wraps the whole-word match in <strong>", () => {
    expect(highlightWord("Das ist ein Test", "Test")).toBe("Das ist ein <strong>Test</strong>");
  });
  it("is case-insensitive", () => {
    expect(highlightWord("ABC abc", "abc")).toBe("<strong>ABC</strong> <strong>abc</strong>");
  });
  it("respects Unicode word boundaries for umlauts", () => {
    expect(highlightWord("Bürger Bürgerrecht", "Bürger")).toBe(
      "<strong>Bürger</strong> Bürgerrecht",
    );
  });
  it("returns the original string when the word is empty", () => {
    expect(highlightWord("foo", "")).toBe("foo");
  });
});

describe("accuracyOf", () => {
  it("returns 0 for a fresh stat (nothing answered)", () => {
    expect(accuracyOf({ correct: 0, wrong: 0 })).toBe(0);
  });
  it("ignores skipped when computing accuracy", () => {
    expect(accuracyOf({ correct: 3, wrong: 1, skipped: 99 })).toBe(0.75);
  });
  it("is resilient to missing fields", () => {
    expect(accuracyOf(null)).toBe(0);
    expect(accuracyOf(undefined)).toBe(0);
    expect(accuracyOf({})).toBe(0);
  });
});

describe("weaknessKeyFor", () => {
  const stats = {
    "q-never-seen": undefined,
    "q-0-correct-5-views": { correct: 0, wrong: 3, skipped: 2 },
    "q-1-correct-1-view": { correct: 1, wrong: 0, skipped: 0 },
    "q-5-correct-5-views": { correct: 5, wrong: 0, skipped: 0 },
  };

  it("ranks never-seen as weakest", () => {
    const a = weaknessKeyFor("q-never-seen", stats);
    const b = weaknessKeyFor("q-0-correct-5-views", stats);
    expect(a).toBeLessThan(b);
  });
  it("ranks seen-but-never-correct before correctly-answered-once", () => {
    const a = weaknessKeyFor("q-0-correct-5-views", stats);
    const b = weaknessKeyFor("q-1-correct-1-view", stats);
    expect(a).toBeLessThan(b);
  });
  it("ranks repeatedly-correct as strongest", () => {
    const a = weaknessKeyFor("q-1-correct-1-view", stats);
    const b = weaknessKeyFor("q-5-correct-5-views", stats);
    expect(a).toBeLessThan(b);
  });
});

function buildPool(n) {
  const out = [];
  for (let i = 0; i < n; i++) out.push({ _id: "q-" + i });
  return out;
}

describe("pickWithWeaknessReservation", () => {
  it("returns count items when pool > count", () => {
    const pool = buildPool(100);
    const stats = {};
    const pick = pickWithWeaknessReservation(pool, 30, 0.4, stats);
    expect(pick).toHaveLength(30);
    const ids = new Set(pick.map((q) => q._id));
    expect(ids.size).toBe(30);
  });

  it("returns all items (shuffled) when pool <= count", () => {
    const pool = buildPool(5);
    const pick = pickWithWeaknessReservation(pool, 30, 0.4, {});
    expect(pick).toHaveLength(5);
  });

  it("biases toward the weakest band", () => {
    const pool = buildPool(100);
    // Make q-50..q-99 "strong" (many correct answers)
    const stats = {};
    for (let i = 50; i < 100; i++) stats["q-" + i] = { correct: 10, wrong: 0, skipped: 0 };
    // Run many trials; count how often strong questions are picked.
    let strongPicks = 0;
    let weakPicks = 0;
    const trials = 200;
    for (let t = 0; t < trials; t++) {
      const pick = pickWithWeaknessReservation(pool, 30, 0.4, stats);
      for (const q of pick) {
        const idx = parseInt(q._id.slice(2), 10);
        if (idx >= 50) strongPicks += 1;
        else weakPicks += 1;
      }
    }
    // With 40% reserved for weak and 60% uniform random, weak picks should
    // heavily outnumber strong ones.
    expect(weakPicks).toBeGreaterThan(strongPicks * 1.5);
  });

  it("produces different picks across runs (not deterministic)", () => {
    const pool = buildPool(100);
    const stats = {};
    const a = pickWithWeaknessReservation(pool, 30, 0.4, stats)
      .map((q) => q._id)
      .sort();
    const b = pickWithWeaknessReservation(pool, 30, 0.4, stats)
      .map((q) => q._id)
      .sort();
    // Could theoretically match; extremely unlikely with a 100-element pool.
    expect(a).not.toEqual(b);
  });

  it("honors weakRatio=0 (pure random)", () => {
    const pool = buildPool(100);
    const pick = pickWithWeaknessReservation(pool, 30, 0, {});
    expect(pick).toHaveLength(30);
  });

  it("honors weakRatio=1 (all from weak band)", () => {
    const pool = buildPool(20);
    const stats = {};
    // Make a clear ranking: q-0 is weakest, q-19 is strongest.
    for (let i = 0; i < 20; i++) stats["q-" + i] = { correct: i, wrong: 0, skipped: 0 };
    const picks = pickWithWeaknessReservation(pool, 5, 1, stats);
    expect(picks).toHaveLength(5);
    // All picks should come from the weakest band (q-0..q-9 approx; candidateSize = max(10, 10) = 10).
    for (const p of picks) {
      const idx = parseInt(p._id.slice(2), 10);
      expect(idx).toBeLessThan(10);
    }
  });
});
