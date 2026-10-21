import type { Example } from "../types/Verb";
import { grammarModules } from "./grammarModules";
import { nouns } from "./nouns";
import { verbs } from "./verbs";

export interface SpeakingSentence extends Example {
  /** Стабільний ключ для статистики. */
  id: string;
}

const MIN_WORDS = 3;
const MAX_WORDS = 8;

// Для читання вголос беремо короткі речення без цифр і лапок: розпізнавач записує числа цифрами, а лапки ламають порівняння.
const isReadable = (cz: string) => {
  const words = cz.trim().split(/\s+/).length;
  return words >= MIN_WORDS && words <= MAX_WORDS && !/[0-9“”"„«»:]/.test(cz) && !/[Ѐ-ӿ]/.test(cz);
};

const collect = (): SpeakingSentence[] => {
  const seen = new Set<string>();
  const result: SpeakingSentence[] = [];
  const add = (example: Example, source: string) => {
    if (isReadable(example.cz) && !seen.has(example.cz)) {
      seen.add(example.cz);
      result.push({ ...example, id: source + ":" + example.cz });
    }
  };

  verbs.forEach((verb) => verb.examples.forEach((example) => add(example, "v" + verb.id)));
  grammarModules.forEach((module) => module.lessons.forEach((lesson) => lesson.examples.forEach((example) => add(example, "l" + lesson.id))));
  nouns.forEach((noun) => noun.examples.forEach((example) => add(example, "n" + noun.id)));

  return result;
};

export const speakingSentences: SpeakingSentence[] = collect();

/** Випадкові речення для однієї серії. */
export const pickSpeakingSet = (count = 10, rng: () => number = Math.random): SpeakingSentence[] => {
  const pool = [...speakingSentences];

  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  return pool.slice(0, count);
};
