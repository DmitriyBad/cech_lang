export type MatchResult = "exact" | "no-diacritics" | "wrong";

const hasCyrillic = (text: string) => /[Ѐ-ӿ]/.test(text);

export const stripDiacritics = (text: string) => text.normalize("NFD").replace(/[̀-ͯ]/g, "");

// Регістр, зайві пробіли та кінцева пунктуація не впливають на результат.
export const normalizeAnswer = (text: string) =>
  text
    .normalize("NFC")
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[.!?…]+$/u, "")
    .toLocaleLowerCase("cs-CZ");

/** Чи можна відповідь ввести з клавіатури: лише чеський текст розумної довжини. */
export const isTypeable = (correctAnswer: string) =>
  correctAnswer.trim().length > 0 && correctAnswer.length <= 60 && !hasCyrillic(correctAnswer);

/**
 * «no-diacritics» зараховується лише коли відповідь збігається без діакритики і жоден
 * із хибних варіантів не відрізняється від правильного тільки діакритикою (byt / být).
 */
export const matchAnswer = (typed: string, correct: string, options: string[] = []): MatchResult => {
  const t = normalizeAnswer(typed);
  const c = normalizeAnswer(correct);

  if (t.length === 0) {
    return "wrong";
  }

  if (t === c) {
    return "exact";
  }

  const ambiguous = options.some(
    (option) => normalizeAnswer(option) !== c && stripDiacritics(normalizeAnswer(option)) === stripDiacritics(c),
  );

  return !ambiguous && stripDiacritics(t) === stripDiacritics(c) ? "no-diacritics" : "wrong";
};
