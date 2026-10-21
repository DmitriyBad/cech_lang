import { describe, expect, it } from "vitest";
import { PASS_SCORE, scoreSpeech } from "./speechScore";

const statuses = (target: string, heard: string[]) => scoreSpeech(target, heard).words.map((word) => word.status);

describe("scoreSpeech", () => {
  it("scores a perfect reading as 1, ignoring case and punctuation", () => {
    const result = scoreSpeech("Já jedu domů.", ["já jedu domů"]);

    expect(result.score).toBe(1);
    expect(statuses("Já jedu domů.", ["já jedu domů"])).toEqual(["ok", "ok", "ok"]);
  });

  it("marks missed words and keeps the order", () => {
    expect(statuses("Já jedu domů autobusem.", ["já jedu autobusem"])).toEqual(["ok", "ok", "missed", "ok"]);
    expect(scoreSpeech("Já jedu domů autobusem.", ["já jedu autobusem"]).score).toBe(0.75);
  });

  it("counts a word without diacritics as close", () => {
    const result = scoreSpeech("Dnes mám hodně práce.", ["dnes mam hodne prace"]);

    expect(result.words.map((word) => word.status)).toEqual(["ok", "close", "close", "close"]);
    expect(result.score).toBe((1 + 1.5) / 4);
  });

  it("ignores extra words and does not match them out of order", () => {
    expect(statuses("Ty jsi student.", ["ty jsi velký student"])).toEqual(["ok", "ok", "ok"]);
    expect(statuses("Ty jsi student.", ["student jsi ty"]).filter((status) => status === "ok")).toHaveLength(1);
  });

  it("picks the best alternative", () => {
    const result = scoreSpeech("Jdu do školy.", ["jdu do skoly", "jdu do školy"]);

    expect(result.score).toBe(1);
    expect(result.heard).toBe("jdu do školy");
  });

  it("scores silence as zero and passes only a good reading", () => {
    expect(scoreSpeech("Jdu do školy.", []).score).toBe(0);
    expect(scoreSpeech("Jdu do školy.", [""]).words.every((word) => word.status === "missed")).toBe(true);
    expect(PASS_SCORE).toBeGreaterThan(0.5);
    expect(scoreSpeech("Jdu do školy.", ["jdu školy"]).score).toBeLessThan(PASS_SCORE);
  });
});
