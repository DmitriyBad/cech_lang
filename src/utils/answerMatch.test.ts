import { describe, expect, it } from "vitest";
import { isTypeable, matchAnswer } from "./answerMatch";

describe("matchAnswer", () => {
  it("ignores case, spaces and final punctuation", () => {
    expect(matchAnswer("  Jedu. ", "jedu")).toBe("exact");
    expect(matchAnswer("já   jedu", "Já jedu!")).toBe("exact");
  });

  it("accepts missing diacritics with a flag", () => {
    expect(matchAnswer("dekuji", "děkuji")).toBe("no-diacritics");
  });

  it("requires diacritics when a distractor differs only by them", () => {
    expect(matchAnswer("byt", "být", ["být", "byt", "bít"])).toBe("wrong");
    expect(matchAnswer("být", "být", ["být", "byt"])).toBe("exact");
  });

  it("rejects wrong and empty answers", () => {
    expect(matchAnswer("jede", "jedu")).toBe("wrong");
    expect(matchAnswer("   ", "jedu")).toBe("wrong");
  });
});

describe("isTypeable", () => {
  it("allows Czech text only", () => {
    expect(isTypeable("děkuji")).toBe(true);
    expect(isTypeable("дякую")).toBe(false);
    expect(isTypeable("")).toBe(false);
  });
});
