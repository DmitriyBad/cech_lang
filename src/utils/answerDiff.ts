export interface DiffChar {
  char: string;
  /** true, якщо символ відрізняється від правильної відповіді (зайвий, пропущений чи інший). */
  bad: boolean;
}

export interface AnswerDiff {
  typed: DiffChar[];
  correct: DiffChar[];
  /** Кількість відмінних символів (відстань Левенштейна). */
  distance: number;
  /** Різниця лише в діакритиці (byt / být). */
  diacriticsOnly: boolean;
}

const prepare = (text: string) =>
  text
    .normalize("NFC")
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[.!?…]+$/u, "");

const base = (char: string) => char.normalize("NFD").replace(/[̀-ͯ]/g, "").toLocaleLowerCase("cs-CZ");

/**
 * Порівнює введене з правильним посимвольно: показує, які літери зайві, пропущені чи замінені.
 * Регістр не враховується, як і в перевірці відповіді.
 */
export const diffAnswer = (typedText: string, correctText: string): AnswerDiff => {
  const typedChars = Array.from(prepare(typedText));
  const correctChars = Array.from(prepare(correctText));
  const same = (a: string, b: string) => a.toLocaleLowerCase("cs-CZ") === b.toLocaleLowerCase("cs-CZ");
  const rows = typedChars.length;
  const cols = correctChars.length;

  const table: number[][] = Array.from({ length: rows + 1 }, () => new Array<number>(cols + 1).fill(0));
  for (let i = 0; i <= rows; i += 1) {
    table[i][0] = i;
  }
  for (let j = 0; j <= cols; j += 1) {
    table[0][j] = j;
  }
  for (let i = 1; i <= rows; i += 1) {
    for (let j = 1; j <= cols; j += 1) {
      table[i][j] = Math.min(
        table[i - 1][j] + 1,
        table[i][j - 1] + 1,
        table[i - 1][j - 1] + (same(typedChars[i - 1], correctChars[j - 1]) ? 0 : 1),
      );
    }
  }

  const typed: DiffChar[] = [];
  const correct: DiffChar[] = [];
  let i = rows;
  let j = cols;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && table[i][j] === table[i - 1][j - 1] + (same(typedChars[i - 1], correctChars[j - 1]) ? 0 : 1)) {
      const equal = same(typedChars[i - 1], correctChars[j - 1]);
      typed.push({ char: typedChars[i - 1], bad: !equal });
      correct.push({ char: correctChars[j - 1], bad: !equal });
      i -= 1;
      j -= 1;
    } else if (i > 0 && table[i][j] === table[i - 1][j] + 1) {
      typed.push({ char: typedChars[i - 1], bad: true });
      i -= 1;
    } else {
      correct.push({ char: correctChars[j - 1], bad: true });
      j -= 1;
    }
  }

  const diacriticsOnly =
    typedChars.length === correctChars.length &&
    typedChars.some((char, index) => !same(char, correctChars[index])) &&
    typedChars.every((char, index) => base(char) === base(correctChars[index]));

  return { typed: typed.reverse(), correct: correct.reverse(), distance: table[rows][cols], diacriticsOnly };
};
