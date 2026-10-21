import type { Example, Exercise } from "../types/Verb";

// Вправи на речення: скласти зі слів, написати під диктовку, знайти помилку.
// Усі вони будуються з готових речень (приклади слів і уроків), тому нових текстів не вигадують.

export const tokenize = (sentence: string): string[] => sentence.trim().split(/\s+/).filter(Boolean);

const MIN_WORDS = 3;
const MAX_WORDS = 9;

/** Речення підходить для складання: не надто коротке й не надто довге. */
export const isBuildable = (sentence: string) => {
  const words = tokenize(sentence).length;
  return words >= MIN_WORDS && words <= MAX_WORDS;
};

const SUBJECT_PRONOUN = /^(Já|Ty|On|Ona|Ono|My|Vy|Oni|Ony)\s+/;

/** Чеською займенник підмета можна опустити: «Já jedu domů» = «Jedu domů». Це теж правильна відповідь. */
export const sentenceAlternatives = (sentence: string): string[] => {
  const match = SUBJECT_PRONOUN.exec(sentence);

  if (!match) {
    return [];
  }

  const rest = sentence.slice(match[0].length);
  return rest.length > 0 ? [rest.charAt(0).toUpperCase() + rest.slice(1)] : [];
};

/** Слово без розділових знаків і регістру, щоб знайти його в реченні. */
export const coreWord = (token: string) => token.replace(/^[„“"«(]+|[.,!?”“"»)…:;]+$/g, "").toLocaleLowerCase("cs-CZ");

export const buildSentenceExercise = (example: Example): Exercise => ({
  kind: "build",
  question: "Складіть речення чеською: “" + example.ua + "”",
  options: [],
  correctAnswer: example.cz,
  tokens: tokenize(example.cz),
  acceptable: sentenceAlternatives(example.cz),
  audio: example.cz,
  explanation: ["Правильне речення: " + example.cz + " — " + example.ua, "Порядок слів у чеському реченні близький до українського, але частки se, si і форми být стоять на другому місці."],
});

export const buildDictationExercise = (example: Example): Exercise => ({
  kind: "dictation",
  question: "Прослухайте речення й складіть його",
  options: [],
  correctAnswer: example.cz,
  tokens: tokenize(example.cz),
  acceptable: sentenceAlternatives(example.cz),
  audio: example.cz,
  hint: example.ua,
  explanation: ["Правильне речення: " + example.cz + " — " + example.ua],
});

/**
 * Вправа «знайдіть помилку»: у реченні замінено одне слово (чи два підряд) на хибну форму.
 * Повертає null, якщо речення відрізняються так, що помилку не можна показати чітко.
 */
export const buildErrorExercise = (correct: Example, wrongCz: string, explanation: string[]): Exercise | null => {
  const right = tokenize(correct.cz);
  const wrong = tokenize(wrongCz);

  if (right.length < MIN_WORDS || right.length > MAX_WORDS || wrong.length !== right.length) {
    return null;
  }

  let start = 0;
  while (start < right.length && right[start] === wrong[start]) {
    start += 1;
  }

  let end = right.length;
  while (end > start && right[end - 1] === wrong[end - 1]) {
    end -= 1;
  }

  const size = end - start;

  if (size < 1 || size > 2) {
    return null;
  }

  const errorIndexes = Array.from({ length: size }, (_, offset) => start + offset);

  return {
    kind: "error",
    question: "Знайдіть слово з помилкою. Переклад: " + correct.ua,
    options: [],
    correctAnswer: errorIndexes.map((index) => wrong[index]).join(" "),
    tokens: wrong,
    errorIndexes,
    audio: correct.cz,
    answerText: correct.cz,
    explanation: ["Правильне речення: " + correct.cz + " — " + correct.ua, ...explanation],
  };
};
