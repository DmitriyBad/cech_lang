import { describe, expect, it } from "vitest";
import { pickSpeakingSet, speakingSentences } from "./speakingSentences";

describe("speaking sentences", () => {
  it("has plenty of short, readable Czech sentences", () => {
    expect(speakingSentences.length).toBeGreaterThan(200);
    expect(speakingSentences.every((item) => item.cz.split(/\s+/).length >= 3 && item.cz.split(/\s+/).length <= 8)).toBe(true);
    expect(speakingSentences.some((item) => /[0-9“”"„«»:]/.test(item.cz) || /[Ѐ-ӿ]/.test(item.cz))).toBe(false);
  });

  it("has unique sentences and ids", () => {
    expect(new Set(speakingSentences.map((item) => item.cz)).size).toBe(speakingSentences.length);
    expect(new Set(speakingSentences.map((item) => item.id)).size).toBe(speakingSentences.length);
  });

  it("picks a set of the requested size without repeats", () => {
    const set = pickSpeakingSet(10, () => 0.3);

    expect(set).toHaveLength(10);
    expect(new Set(set.map((item) => item.id)).size).toBe(10);
  });
});
