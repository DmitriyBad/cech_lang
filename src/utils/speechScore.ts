// Порівняння сказаного з реченням. Розпізнавач помиляється в діакритиці й іноді змінює регістр,
// тому слова зі збігом «до діакритики» вважаються майже правильними («close»).

export type WordStatus = "ok" | "close" | "missed";

export interface WordScore {
  word: string;
  status: WordStatus;
}

export interface SpeechScore {
  words: WordScore[];
  /** Частка правильно сказаних слів від 0 до 1 («майже» рахується за половину). */
  score: number;
  /** Найкращий із варіантів, які почув розпізнавач. */
  heard: string;
}

export const PASS_SCORE = 0.75;

const clean = (word: string) =>
  word
    .normalize("NFC")
    .toLocaleLowerCase("cs-CZ")
    .replace(/^[„“"«(]+|[.,!?”“"»)…:;]+$/g, "");

const plain = (word: string) => word.normalize("NFD").replace(/[̀-ͯ]/g, "");

export const wordsOf = (text: string) => text.trim().split(/\s+/).filter(Boolean);

const scoreOne = (target: string, heardText: string): SpeechScore => {
  const targetWords = wordsOf(target);
  const heardWords = wordsOf(heardText).map(clean);
  const rows = targetWords.length;
  const cols = heardWords.length;
  const level = (a: string, b: string) => (clean(a) === b ? 2 : plain(clean(a)) === plain(b) ? 1 : 0);

  // Найдовша спільна послідовність: слова, сказані в правильному порядку, з пропусками й зайвими словами.
  const table: number[][] = Array.from({ length: rows + 1 }, () => new Array<number>(cols + 1).fill(0));
  for (let i = 1; i <= rows; i += 1) {
    for (let j = 1; j <= cols; j += 1) {
      const gain = level(targetWords[i - 1], heardWords[j - 1]);
      table[i][j] = Math.max(table[i - 1][j], table[i][j - 1], gain > 0 ? table[i - 1][j - 1] + gain : 0);
    }
  }

  const statuses: WordStatus[] = new Array<WordStatus>(rows).fill("missed");
  let i = rows;
  let j = cols;

  while (i > 0 && j > 0) {
    const gain = level(targetWords[i - 1], heardWords[j - 1]);

    if (gain > 0 && table[i][j] === table[i - 1][j - 1] + gain) {
      statuses[i - 1] = gain === 2 ? "ok" : "close";
      i -= 1;
      j -= 1;
    } else if (table[i][j] === table[i - 1][j]) {
      i -= 1;
    } else {
      j -= 1;
    }
  }

  const points = statuses.reduce((sum, status) => sum + (status === "ok" ? 1 : status === "close" ? 0.5 : 0), 0);

  return {
    words: targetWords.map((word, index) => ({ word, status: statuses[index] })),
    score: rows === 0 ? 0 : points / rows,
    heard: heardText,
  };
};

/** Оцінює найкращий із варіантів розпізнавання (розпізнавач повертає кілька гіпотез). */
export const scoreSpeech = (target: string, heardAlternatives: string[]): SpeechScore => {
  const candidates = heardAlternatives.filter((text) => text.trim().length > 0);

  if (candidates.length === 0) {
    return scoreOne(target, "");
  }

  return candidates.map((text) => scoreOne(target, text)).reduce((best, current) => (current.score > best.score ? current : best));
};
