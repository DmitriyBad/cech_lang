import { describe, expect, it } from "vitest";
import { diffAnswer } from "./answerDiff";

const text = (chars: Array<{ char: string }>) => chars.map((item) => item.char).join("");
const bad = (chars: Array<{ char: string; bad: boolean }>) => chars.filter((item) => item.bad).map((item) => item.char).join("");

describe("diffAnswer", () => {
  it("marks a replaced letter in both strings", () => {
    const diff = diffAnswer("studenta", "studentu");

    expect(text(diff.typed)).toBe("studenta");
    expect(bad(diff.typed)).toBe("a");
    expect(bad(diff.correct)).toBe("u");
    expect(diff.distance).toBe(1);
  });

  it("marks a missing letter only in the correct answer", () => {
    const diff = diffAnswer("dlam", "dělám");

    expect(bad(diff.typed)).toBe("a");
    expect(bad(diff.correct)).toBe("ěá");
    expect(diff.distance).toBeGreaterThan(0);
  });

  it("marks an extra letter only in the typed answer", () => {
    const diff = diffAnswer("jedu", "jdu");

    expect(bad(diff.typed)).toBe("e");
    expect(bad(diff.correct)).toBe("");
    expect(diff.distance).toBe(1);
  });

  it("ignores case, extra spaces and final punctuation", () => {
    const diff = diffAnswer("  Já  jedu. ", "já jedu");

    expect(diff.distance).toBe(0);
    expect(bad(diff.typed)).toBe("");
  });

  it("detects a difference in diacritics only", () => {
    expect(diffAnswer("byt", "být").diacriticsOnly).toBe(true);
    expect(diffAnswer("bit", "být").diacriticsOnly).toBe(false);
    expect(diffAnswer("být", "být").diacriticsOnly).toBe(false);
  });

  it("handles empty input", () => {
    expect(diffAnswer("", "dům").distance).toBe(3);
    expect(text(diffAnswer("", "dům").correct)).toBe("dům");
  });
});
