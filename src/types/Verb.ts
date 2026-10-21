export interface Example {
  cz: string;
  ua: string;
}

// Тип вправи: без `kind` це звичайний вибір із варіантів (або введення відповіді).
// build — скласти речення зі слів (або написати); dictation — те саме, але речення треба спершу почути;
// error — знайти слово з помилкою; speak — прочитати речення вголос.
export type ExerciseKind = "build" | "dictation" | "error" | "speak";

export interface Exercise {
  question: string;
  options: string[];
  correctAnswer: string;
  /** Коротке пояснення, яке показується після відповіді. */
  explanation?: string[];
  kind?: ExerciseKind;
  /** build, dictation, error: слова речення в правильному порядку (для error: речення з помилкою). */
  tokens?: string[];
  /** error: позиції слів із помилкою в `tokens`. */
  errorIndexes?: number[];
  /** Інші правильні відповіді (наприклад, речення без особового займенника). */
  acceptable?: string[];
  /** Чеський текст для озвучення (dictation, speak) і для кнопки «послухати» після відповіді. */
  audio?: string;
  /** Підказка-переклад, якщо озвучення недоступне. */
  hint?: string;
  /** Як показувати правильну відповідь, якщо вона не збігається з `correctAnswer` (error). */
  answerText?: string;
}

export interface Verb {
  id: number;
  infinitive: string;
  translation: string;
  level: "A1" | "A2";
  conjugation: {
    ja: string;
    ty: string;
    on: string;
    my: string;
    vy: string;
    oni: string;
  };
  /** Вид дієслова. У доконаних форми «теперішнього часу» означають майбутній час (přijdu = «прийду»). */
  aspect?: "imperfective" | "perfective";
  /** Літературні варіанти розмовних форм таблиці (pracuju → pracuji, můžu → mohu). */
  formalForms?: Partial<Verb["conjugation"]>;
  /** Короткі пояснення до слова (вживання, відмінність від схожого дієслова). */
  notes?: string[];
  examples: Example[];
  exercises: Exercise[];
}

export type VerbLevel = Verb["level"];
