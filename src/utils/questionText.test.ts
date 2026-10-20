import { describe, expect, it } from "vitest";
import { adaptQuestion } from "./questionText";

describe("adaptQuestion", () => {
  it("asks to write instead of choose in typing mode", () => {
    expect(adaptQuestion("Оберіть genitiv однини для “student”", true)).toBe("Напишіть genitiv однини для “student”");
    expect(adaptQuestion("Оберіть чеський інфінітив для: “робити”", true)).toBe("Напишіть чеський інфінітив для: “робити”");
  });

  it("uses «впишіть» when the sentence has a gap", () => {
    expect(adaptQuestion("Оберіть locativ після “o”: mluvím o ___", true)).toBe("Впишіть locativ після “o”: mluvím o ___");
    expect(adaptQuestion("Доповніть: Nemám ___", true)).toBe("Впишіть пропущене слово: Nemám ___");
    expect(adaptQuestion("Доповніть форму для “já”: jet", true)).toBe("Впишіть форму для “já”: jet");
  });

  it("rewrites the grammar cloze in both languages", () => {
    const question = "UA: Оберіть правильну форму для теми “Минулий час”. Переклад: Я був.\nCZ: Vyberte správné slovo do české věty.\nJá jsem ___.";

    expect(adaptQuestion(question, true)).toBe(
      "UA: Впишіть правильну форму для теми “Минулий час”. Переклад: Я був.\nCZ: Napište správné slovo do české věty.\nJá jsem ___.",
    );
    expect(adaptQuestion(question, false)).toBe(question);
  });

  it("never leaves «Доповніть» in choice mode", () => {
    expect(adaptQuestion("Доповніть: Vidím ___", false)).toBe("Оберіть пропущене слово: Vidím ___");
    expect(adaptQuestion("Доповніть форму для “ty”: být", false)).toBe("Оберіть форму для “ty”: být");
  });

  it("does not touch questions that have nothing to rewrite", () => {
    expect(adaptQuestion("Що означає “dům”?", true)).toBe("Що означає “dům”?");
    expect(adaptQuestion("Як українською: “jít”", false)).toBe("Як українською: “jít”");
  });
});
